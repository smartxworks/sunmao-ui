import { Pagination as BasePagination } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css, cx } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { PaginationPropsSpec as BasePaginationPropsSpec } from '../generated/types/Pagination';
import { useEffect, useState } from 'react';

const PaginationPropsSpec = Type.Object(BasePaginationPropsSpec);
const PaginationStateSpec = Type.Object({
  currentPage: Type.Number(),
});

const exampleProperties: Static<typeof PaginationPropsSpec> = {
  pageSize: 10,
  total: 300,
  defaultCurrent: 3,
  disabled: false,
  hideOnSinglePage: true,
  size: 'default',
  sizeCanChange: false,
  simple: false,
  showJumper: false,
  showTotal: false,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'pagination',
    displayName: 'Pagination',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PaginationPropsSpec,
    state: PaginationStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onChange'],
  },
};

export const Pagination = implementRuntimeComponent(options)(props => {
  const { defaultCurrent, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, mergeState, callbackMap } = props;

  const [current, setCurrent] = useState<number>(defaultCurrent || 0);

  if (cProps.sizeCanChange) {
    Reflect.deleteProperty(cProps, 'pageSize');
  }

  useEffect(() => {
    mergeState({ currentPage: current });
  }, []);

  const handleChange = (pageNum: number) => {
    setCurrent(pageNum);
    mergeState({ currentPage: pageNum });
    callbackMap?.onChange?.();
  };

  return (
    <BasePagination
      ref={elementRef}
      className={cx(css(customStyle?.content))}
      {...cProps}
      current={current}
      onChange={handleChange}
    />
  );
});
