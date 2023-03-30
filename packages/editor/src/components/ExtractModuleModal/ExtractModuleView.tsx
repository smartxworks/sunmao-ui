import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  VStack,
  Button,
  HStack,
  Box,
  ButtonGroup,
  Spacer,
  Heading,
  Text,
} from '@chakra-ui/react';
import { EventHandlerSpec, GLOBAL_MODULE_ID } from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { set, uniq } from 'lodash';
import { EditorServices } from '../../types';
import { ComponentId } from '../../AppModel/IAppModel';
import {
  RefTreatmentMap,
  OutsideExpRelationWithState,
  RefTreatment,
  InsideExpRelation,
  InsideMethodRelation,
} from './type';
import { ExtractModuleStep } from './ExtractModuleStep';
import { ExtractModulePropertyForm } from './ExtractModulePropertyForm';
import { ExtractModuleStateForm } from './ExtractModuleStateForm';
import { ExtractModuleEventForm } from './ExtractModuleEventForm';
import {
  ModuleMetaDataForm,
  ModuleMetaDataFormData,
} from '../Explorer/ExplorerForm/ModuleMetaDataForm';
import { toJS } from 'mobx';
import { json2JsonSchema } from '@sunmao-ui/editor-sdk';
import { genOperation } from '../../operations';
import { getInsideRelations, getOutsideExpRelations } from './utils';

type Props = {
  componentId: string;
  services: EditorServices;
  onClose: () => void;
};

type InsideRelations = {
  exp: InsideExpRelation[];
  method: InsideMethodRelation[];
};

export const ExtractModuleView: React.FC<Props> = ({
  componentId,
  services,
  onClose,
}) => {
  const { appModelManager } = services;
  const { appModel } = appModelManager;
  const refTreatmentMap = useRef<RefTreatmentMap>({});
  const outsideExpRelationsValueRef = useRef<OutsideExpRelationWithState[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [genModuleResult, serGenModuleResult] = useState<
    ReturnType<typeof genModule> | undefined
  >();
  const [moduleFormInitData, setModuleFormInitData] = useState<
    ModuleMetaDataFormData | undefined
  >();
  const moduleFormValueRef = useRef<ModuleMetaDataFormData | undefined>();

  const { insideExpRelations, methodRelations, outsideExpRelations } = useMemo(() => {
    const root = appModel.getComponentById(componentId as ComponentId)!;
    const moduleComponents = root.allComponents;
    const insideRelations = moduleComponents.reduce<InsideRelations>(
      (res, c) => {
        const { expressionRelations, methodRelations } = getInsideRelations(
          c,
          moduleComponents
        );
        res.exp = res.exp.concat(expressionRelations);
        res.method = res.method.concat(methodRelations);
        return res;
      },
      { exp: [], method: [] }
    );
    const outsideExpRelations = getOutsideExpRelations(appModel.allComponents, root);
    return {
      insideExpRelations: insideRelations.exp,
      methodRelations: insideRelations.method,
      outsideExpRelations,
    };
  }, [appModel, componentId]);

  const genModule = useCallback(() => {
    const exampleProperties: Record<string, string> = {};
    const moduleContainerProperties: Record<string, string> = {};
    let toMoveComponentIds: string[] = [];
    let toDeleteComponentIds: string[] = [];
    insideExpRelations.forEach(relation => {
      switch (refTreatmentMap.current[relation.componentId]) {
        case RefTreatment.move:
          toMoveComponentIds.push(relation.componentId);
          toDeleteComponentIds.push(relation.componentId);
          break;
        case RefTreatment.keep:
          moduleContainerProperties[relation.componentId] = `{{${relation.componentId}}}`;
          const value = toJS(services.stateManager.store[relation.componentId]);
          if (typeof value === 'string') {
            exampleProperties[relation.componentId] = value;
          } else {
            // save value as expression
            exampleProperties[relation.componentId] = `{{${JSON.stringify(value)}}}`;
          }
          break;
        case RefTreatment.duplicate:
          toMoveComponentIds.push(relation.componentId);
          break;
      }
    });

    toMoveComponentIds = uniq(toMoveComponentIds);
    toDeleteComponentIds = uniq(toDeleteComponentIds);

    const root = services.appModelManager.appModel
      .getComponentById(componentId as ComponentId)!
      .clone();
    const newModuleContainerId = `${componentId}__module`;
    const newModuleId = `${componentId}Module`;
    // remove root slot
    root.removeSlotTrait();

    // covert in-module components to schema
    const eventSpec: string[] = [];
    const moduleComponentsSchema = root?.allComponents.map(c => {
      const eventTrait = c.traits.find(t => t.type === 'core/v1/event');
      // conver in-module components' event handlers
      if (eventTrait) {
        const cache: Record<string, boolean> = {};
        const handlers: Static<typeof EventHandlerSpec>[] = [];
        eventTrait?.rawProperties.handlers.forEach(
          (h: Static<typeof EventHandlerSpec>) => {
            const newEventName = `${c.id}${h.type}`;
            const hasRelation = methodRelations.find(r => {
              return (
                r.source === c.id && r.event === h.type && r.target === h.componentId
              );
            });
            if (hasRelation) {
              // if component has another handler emit the same event, don't emit it again
              if (cache[newEventName]) {
                return;
              }
              // emit new $module event
              cache[newEventName] = true;
              eventSpec.push(newEventName);
              handlers.push({
                type: h.type,
                componentId: GLOBAL_MODULE_ID,
                method: {
                  name: newEventName,
                  parameters: {
                    moduleId: '{{$moduleId}}',
                  },
                },
                disabled: false,
                wait: { type: 'delay', time: 0 },
              });
            } else {
              handlers.push(h);
            }
          }
        );
        eventTrait.updateProperty('handlers', handlers);
      }
      return c.toSchema();
    });

    // add moved and duplicated components
    if (toMoveComponentIds.length) {
      toMoveComponentIds.forEach(id => {
        const comp = services.appModelManager.appModel.getComponentById(
          id as ComponentId
        )!;
        moduleComponentsSchema.push(comp.toSchema());
      });
    }

    // generate event handlers for module container
    const moduleHandlers = methodRelations.map(r => {
      const { handler } = r;
      return {
        ...handler,
        type: `${r.source}${r.event}`,
      };
    });

    // generate StateMap
    const stateMap: Record<string, string> = {};
    const outsideComponentNewProperties: Record<string, any> = {};
    type TraitNewProperties = {
      componentId: string;
      traitIndex: number;
      properties: Record<string, any>;
    };
    const outsideTraitNewProperties: TraitNewProperties[] = [];
    outsideExpRelationsValueRef.current.forEach(r => {
      if (r.stateName) {
        const origin = `${r.relyOn}.${r.valuePath}`;
        stateMap[r.stateName] = origin;
        // replace ref with new state name in expressions
        const newExp = r.exp.replaceAll(origin, `${newModuleId}.${r.stateName}`);
        const c = services.appModelManager.appModel.getComponentById(
          r.componentId as ComponentId
        )!;
        const fieldKey = r.key.startsWith('.') ? r.key.slice(1) : r.key;
        if (r.traitType) {
          c.traits.forEach((t, i) => {
            const newProperties = set(t.properties.rawValue, fieldKey, newExp);
            if (t.type === r.traitType) {
              outsideTraitNewProperties.push({
                componentId: r.componentId,
                traitIndex: i,
                properties: newProperties,
              });
            }
          });
        } else {
          const fieldKey = r.key.startsWith('.') ? r.key.slice(1) : r.key;
          const newProperties = set(c.properties.rawValue, fieldKey, newExp);
          outsideComponentNewProperties[r.componentId] = newProperties;
        }
      }
    });

    return {
      exampleProperties,
      moduleContainerProperties,
      eventSpec,
      toMoveComponentIds,
      toDeleteComponentIds,
      methodRelations,
      moduleComponentsSchema,
      moduleHandlers,
      stateMap,
      newModuleContainerId,
      newModuleId,
      outsideComponentNewProperties,
      outsideTraitNewProperties,
      moduleRootId: componentId,
    };
  }, [
    componentId,
    insideExpRelations,
    methodRelations,
    services.appModelManager.appModel,
    services.stateManager.store,
  ]);

  const onExtract = () => {
    if (!genModuleResult || !moduleFormValueRef.current) return;
    services.editorStore.appStorage.createModule({
      components: genModuleResult.moduleComponentsSchema,
      propertySpec: json2JsonSchema(genModuleResult.exampleProperties),
      exampleProperties: genModuleResult.exampleProperties,
      events: genModuleResult.eventSpec,
      moduleVersion: moduleFormValueRef.current.version,
      moduleName: moduleFormValueRef.current.name,
      stateMap: genModuleResult.stateMap,
    });

    services.eventBus.send(
      'operation',
      genOperation(services.registry, 'extractModule', {
        moduleContainerId: genModuleResult.newModuleContainerId,
        moduleContainerProperties: genModuleResult.moduleContainerProperties,
        moduleId: genModuleResult.newModuleId,
        moduleRootId: genModuleResult.moduleRootId,
        moduleType: `${moduleFormValueRef.current.version}/${moduleFormValueRef.current.name}`,
        moduleHandlers: genModuleResult.moduleHandlers,
        outsideComponentNewProperties: genModuleResult.outsideComponentNewProperties,
        outsideTraitNewProperties: genModuleResult.outsideTraitNewProperties,
        toDeleteComponentIds: genModuleResult.toDeleteComponentIds,
      })
    );
    onClose();
  };

  // generate module spec for preview
  useEffect(() => {
    if (activeIndex === 3) {
      const result = genModule();
      serGenModuleResult(result);
      const moduleFormData = {
        name: componentId,
        version: 'custom/v1',
        stateMap: result.stateMap,
        events: result.eventSpec,
        exampleProperties: result.exampleProperties,
        methods: [],
      };
      setModuleFormInitData(moduleFormData);
      moduleFormValueRef.current = moduleFormData;
    }
  }, [activeIndex, componentId, genModule]);

  return (
    <HStack spacing="12" height="full" alignItems="start">
      <ExtractModuleStep activeIndex={activeIndex} />
      <VStack height="full" width="full" alignItems="end">
        <Box width="full" overflow="auto">
          <Box width="full" display={activeIndex === 0 ? 'block' : 'none'}>
            <ExtractModulePropertyForm
              insideExpRelations={insideExpRelations}
              onChange={val => (refTreatmentMap.current = val)}
              services={services}
            />
          </Box>
          <Box width="full" display={activeIndex === 1 ? 'block' : 'none'}>
            <ExtractModuleStateForm
              outsideExpRelations={outsideExpRelations}
              onChange={v => {
                outsideExpRelationsValueRef.current = v;
              }}
            />
          </Box>
          <Box width="full" display={activeIndex === 2 ? 'block' : 'none'}>
            <ExtractModuleEventForm
              methodRelations={methodRelations}
              services={services}
            />
          </Box>
          <VStack width="full" display={activeIndex === 3 ? 'block' : 'none'}>
            <Heading size="md">Preview Module Spec</Heading>
            <Text>
              {`The Spec has generated automatically, you don't need to change anything except version and name.`}
            </Text>
            {activeIndex === 3 && moduleFormInitData ? (
              <ModuleMetaDataForm
                services={services}
                initData={moduleFormInitData}
                onSubmit={value => (moduleFormValueRef.current = value)}
              />
            ) : undefined}
          </VStack>
        </Box>
        <Spacer />
        <ButtonGroup flex="0 0">
          {activeIndex > 0 ? (
            <Button variant="outline" onClick={() => setActiveIndex(v => v - 1)}>
              Prev
            </Button>
          ) : undefined}
          {activeIndex < 3 ? (
            <Button colorScheme="blue" onClick={() => setActiveIndex(v => v + 1)}>
              Next
            </Button>
          ) : undefined}
          {activeIndex === 3 ? (
            <Button colorScheme="blue" onClick={onExtract}>
              Extract
            </Button>
          ) : undefined}
        </ButtonGroup>
      </VStack>
    </HStack>
  );
};
