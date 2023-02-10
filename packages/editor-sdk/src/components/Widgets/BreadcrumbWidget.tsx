import React, { useEffect, useRef, useState } from 'react';
import {
  CORE_VERSION,
  CoreWidgetName,
  generateDefaultValueFromSpec,
} from '@sunmao-ui/shared';
import { Static, Type } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';
import { get, set } from 'lodash';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  VStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Divider,
} from '@chakra-ui/react';
import { ArrayTable } from '../Form/ArrayTable';
import { implementWidget } from '../../utils/widget';
import { WidgetProps } from '../../types/widget';
import { ComponentFormElementId } from '../../constants';
import { SpecWidget, DefaultTemplate } from './SpecWidget';

export type BreadcrumbWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.Breadcrumb}`;

const BreadcrumbWidgetOption = Type.Object({
  appendToBody: Type.Optional(Type.Boolean()),
  appendToParent: Type.Optional(Type.Boolean()),
});

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/breadcrumb': Static<typeof BreadcrumbWidgetOption>;
  }
}

export const BreadcrumbWidget: React.FC<WidgetProps<BreadcrumbWidgetType>> = props => {
  const { spec, value, onChange } = props;
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const currentSpec = getJSONSchemaByPath(spec as JSONSchema7, currentPath.join('.'));
  let currentValue = currentPath.length ? get(value, currentPath.join('.')) : value;
  const containerRef = useRef(document.getElementById(ComponentFormElementId));

  useEffect(() => {
    containerRef.current = document.getElementById(ComponentFormElementId);
  }, []);

  if (!currentSpec) {
    return <span>Fail to find spec of: {currentPath.join('.')}.</span>;
  }

  if (!currentValue) {
    // Gengerate a default value if it is undefined.
    currentValue = generateDefaultValueFromSpec(currentSpec);
  }

  let content;

  if (currentSpec.type === 'array' && currentSpec.items) {
    // Only when breadcrumbWidget is add to array type directly, render this
    const itemSpec = Array.isArray(currentSpec.items)
      ? currentSpec.items[0]
      : currentSpec.items;
    content = (
      <ArrayTable
        {...props}
        value={currentValue}
        itemSpec={itemSpec as JSONSchema7}
        disablePopover
        onClickSettings={i => {
          setCurrentPath(prev => [...prev, `${i}`]);
        }}
        onChange={v => {
          onChange(v);
        }}
      />
    );
  } else if (currentSpec.type === 'object' && currentSpec.properties) {
    // render object fields
    content = Object.keys(currentSpec.properties).map(key => {
      const childSpec = currentSpec.properties![key] as JSONSchema7;

      switch (childSpec.type) {
        case 'object':
          const onClickEdit = () => {
            setCurrentPath(prev => [...prev, key]);
          };
          return (
            <DefaultTemplate
              key={key}
              label={childSpec.title || key}
              description={childSpec.description}
              displayLabel={true}
              codeMode={false}
              isExpression={false}
            >
              {{
                content: (
                  <Button size="xs" onClick={onClickEdit}>
                    Edit
                  </Button>
                ),
              }}
            </DefaultTemplate>
          );
        case 'array':
          const itemSpec = Array.isArray(childSpec.items)
            ? childSpec.items[0]
            : childSpec.items;
          return (
            <DefaultTemplate
              key={key}
              label={childSpec.title || key}
              description={childSpec.description}
              displayLabel={true}
              codeMode={false}
            >
              {{
                content: (
                  <ArrayTable
                    {...props}
                    value={currentValue[key]}
                    itemSpec={itemSpec as JSONSchema7}
                    disablePopover
                    onClickSettings={i => {
                      setCurrentPath(prev => [...prev, key, `${i}`]);
                    }}
                    onChange={v => {
                      const newValue = set(value, [...currentPath, key].join('.'), v);
                      onChange(newValue);
                    }}
                  />
                ),
              }}
            </DefaultTemplate>
          );
        default:
          return (
            <SpecWidget
              key={key}
              {...props}
              value={currentValue[key]}
              spec={{ ...childSpec, title: childSpec.title ?? key }}
              onChange={v => {
                const newValue = set(value, [...currentPath, key].join('.'), v);
                onChange(newValue);
              }}
            />
          );
      }
    });
  } else {
    return (
      <span>
        Fail to find fields spec of: {currentPath.join('.')}. It is not an object or array
        type.
      </span>
    );
  }

  const bread = (
    <>
      <Breadcrumb marginBottom="2" separator=">" width="full">
        <BreadcrumbItem key="root">
          <BreadcrumbLink onClick={() => setCurrentPath([])}>/</BreadcrumbLink>
        </BreadcrumbItem>
        {currentPath.map((path, i) => {
          return (
            <BreadcrumbItem key={`${path}-${i}`}>
              <BreadcrumbLink onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}>
                {path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
      <Divider />
    </>
  );

  const popoverContent = (
    <PopoverContent>
      <PopoverBody maxHeight="75vh" overflow="auto" paddingBottom="96px">
        <VStack justifyContent="start" alignItems="start" spacing="0">
          {currentPath.length > 0 ? bread : undefined}
          {content}
        </VStack>
      </PopoverBody>
    </PopoverContent>
  );

  return (
    <Popover isLazy placement="left">
      <PopoverTrigger>
        <Button size="xs">Edit</Button>
      </PopoverTrigger>
      {spec.widgetOptions?.appendToParent ? (
        popoverContent
      ) : (
        <Portal
          containerRef={spec.widgetOptions?.appendToBody ? undefined : containerRef}
        >
          {popoverContent}
        </Portal>
      )}
    </Popover>
  );
};

function getJSONSchemaByPath(schema: JSONSchema7, path: string) {
  const keys = path.split('.');
  let result: JSONSchema7 | undefined = schema;

  function getChild(key: string, s: JSONSchema7) {
    if (!key) return s;
    switch (s.type) {
      case 'object':
        return s.properties ? s.properties[key] : undefined;
      case 'array':
        return Array.isArray(s.items) ? s.items[0] : s.items;
    }
  }

  for (const k of keys) {
    if (!result) break;
    result = getChild(k, result) as JSONSchema7;
  }

  return result;
}

export default implementWidget<BreadcrumbWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Breadcrumb,
  },
  spec: {
    options: BreadcrumbWidgetOption,
  },
})(BreadcrumbWidget);
