import React from 'react';
import RcSelect, {
  BaseSelectRef,
  OptGroup,
  Option,
  SelectProps as RcSelectProps,
} from 'rc-select';
import { cx } from '@emotion/css';
import { BaseOptionType, DefaultOptionType } from 'rc-select/lib/Select';
import { Placement, RenderDOMFunc } from 'rc-select/lib/BaseSelect';
import getIcons from './utils';
import './style';

const prefixCls = 'sunmao-select';
const defaultRenderEmpty = 'Not Found';
const defaultGetPopupContainer: RenderDOMFunc = triggerNode =>
  document.body || triggerNode.parentElement;

type RawValue = string | number;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

export type SelectValue =
  | RawValue
  | RawValue[]
  | LabeledValue
  | LabeledValue[]
  | undefined;

export type CustomFunction =
  | 'inputIcon'
  | 'mode'
  | 'getInputElement'
  | 'getRawInputElement'
  | 'backfill'
  | 'placement';

export interface SelectMainProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType
> extends Omit<RcSelectProps<ValueType, OptionType>, CustomFunction> {
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  bordered?: boolean;
  placement?: Placement;
}

const SelectMain = <
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType
>(
  {
    mode,
    className,
    bordered = true,
    getPopupContainer = defaultGetPopupContainer,
    dropdownClassName,
    listHeight = 256,
    listItemHeight = 24,
    showArrow,
    placement = 'bottomLeft',
    notFoundContent,
    dropdownMatchSelectWidth = true,
    loading,
    ...props
  }: SelectMainProps<OptionType>,
  ref: React.Ref<BaseSelectRef>
) => {
  const isMultiple = mode === 'multiple' || mode === 'tags';
  const mergedShowArrow = showArrow !== undefined ? showArrow : loading || !isMultiple;
  const borderLessCls = !bordered && `${prefixCls}-borderless`;

  const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    loading,
    multiple: mode === 'multiple',
    showArrow: mergedShowArrow,
    prefixCls,
  });

  // TODO: Placement
  // TODO: Not Found
  const notFound: React.ReactNode = notFoundContent || defaultRenderEmpty;

  return (
    <RcSelect
      ref={ref}
      className={cx(className, borderLessCls)}
      prefixCls={prefixCls}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      listItemHeight={listItemHeight}
      listHeight={listHeight}
      placement={placement}
      inputIcon={suffixIcon}
      clearIcon={clearIcon}
      mode={isMultiple ? mode : undefined}
      menuItemSelectedIcon={itemIcon}
      removeIcon={removeIcon}
      {...props}
      getPopupContainer={getPopupContainer}
      notFoundContent={notFound}
      dropdownClassName={dropdownClassName}
    />
  );
};

const Select = React.forwardRef(SelectMain) as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType
>(
  props: React.PropsWithChildren<SelectMainProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  }
) => React.ReactElement) & {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
};

Select.Option = Option;
Select.OptGroup = OptGroup;

export { Select };
