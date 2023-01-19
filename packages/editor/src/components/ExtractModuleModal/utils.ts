import {
  CoreTraitName,
  CORE_VERSION,
  EventHandlerSpec,
  ExpressionKeywords,
} from '@sunmao-ui/shared';
import { Static } from '@sinclair/typebox';
import { IComponentModel, IFieldModel, ComponentId } from '../../AppModel/IAppModel';
import { OutsideExpRelation, InsideExpRelation, InsideMethodRelation } from './type';

export function getOutsideExpRelations(
  allComponents: IComponentModel[],
  moduleRoot: IComponentModel
): OutsideExpRelation[] {
  const res: OutsideExpRelation[] = [];
  const clonedRoot = moduleRoot.clone();
  const ids = clonedRoot.allComponents.map(c => c.id);
  allComponents.forEach(c => {
    if (clonedRoot.appModel.getComponentById(c.id)) {
      // component is in module, ignore.
      return;
    }
    const handler = (field: IFieldModel, key: string, traitType?: string) => {
      if (field.isDynamic) {
        const relyRefs = Object.keys(field.refComponentInfos).filter(refId =>
          ids.includes(refId as ComponentId)
        );
        relyRefs.forEach(refId => {
          res.push({
            componentId: c.id,
            traitType,
            exp: field.getValue() as string,
            key,
            valuePath:
              field.refComponentInfos[refId as ComponentId].refProperties.slice(-1)[0],
            relyOn: refId,
          });
        });
      }
    };
    // traverse all the expressions of all outisde components and traits
    c.properties.traverse((field, key) => {
      handler(field, key);
      c.traits.forEach(t => {
        t.properties.traverse((field, key) => {
          handler(field, key, t.type);
        });
      });
    });
  });
  return res;
}

export function getInsideRelations(
  component: IComponentModel,
  moduleComponents: IComponentModel[]
) {
  const expressionRelations: InsideExpRelation[] = [];
  const methodRelations: InsideMethodRelation[] = [];
  const ids = moduleComponents.map(c => c.id) as string[];

  const handler = (field: IFieldModel, key: string, traitType?: string) => {
    if (field.isDynamic) {
      const usedIds = Object.keys(field.refComponentInfos);
      usedIds.forEach(usedId => {
        // ignore global vraiable and sunmao keywords
        if (
          !ids.includes(usedId) &&
          !(usedId in window) &&
          !ExpressionKeywords.includes(usedId)
        ) {
          expressionRelations.push({
            traitType: traitType,
            source: component.id,
            componentId: usedId,
            exp: field.rawValue,
            key: key,
          });
        }
      });
    }
  };

  component.properties.traverse((field, key) => {
    handler(field, key);
  });

  component.traits.forEach(t => {
    t.properties.traverse((field, key) => {
      handler(field, key, t.type);
    });

    // check event traits, see if component call outside methods
    if (t.type === `${CORE_VERSION}/${CoreTraitName.Event}`) {
      t.rawProperties.handlers.forEach((h: Static<typeof EventHandlerSpec>) => {
        if (!ids.includes(h.componentId)) {
          methodRelations.push({
            source: component.id,
            event: h.type,
            target: h.componentId,
            method: h.method.name,
            handler: h,
          });
        }
      });
    }
  });

  return { expressionRelations, methodRelations };
}
