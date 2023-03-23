import { Checkbox as BaseCheckbox } from '@arco-design/web-react';
import { Type, Static } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import {
  CheckboxPropsSpec as BaseCheckboxPropsSpec,
  CheckboxOptionSpec as BaseCheckboxOptionSpec,
} from '../generated/types/Checkbox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { css } from '@emotion/css';
import { useEffect, useMemo, useCallback } from 'react';
import { useStateValue } from '../hooks/useStateValue';

const CheckboxPropsSpec = Type.Object({
  ...BaseCheckboxPropsSpec,
});
const CheckboxStateSpec = Type.Object({
  checkedValues: Type.Array(Type.String()),
  isCheckAll: Type.Boolean(),
});

export const Checkbox = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'checkbox',
    displayName: 'Checkbox',
    exampleProperties: {
      options: [
        {
          label: 'checkbox1',
          value: 'checkbox1',
        },
        {
          label: 'checkbox2',
          value: 'checkbox2',
        },
        {
          label: 'checkbox3',
          value: 'checkbox3',
        },
      ],
      disabled: false,
      direction: 'horizontal',
      defaultCheckedValues: ['checkbox1'],
      showCheckAll: false,
      checkAllText: 'Check all',
      updateWhenDefaultValueChanges: false,
    },
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: CheckboxPropsSpec,
    state: CheckboxStateSpec,
    methods: {
      setCheckedValues: Type.Object({
        checkedValues: Type.Array(Type.String()),
      }),
      checkAll: Type.Object({}),
      uncheckAll: Type.Object({}),
      toggleValues: Type.Object({
        values: BaseCheckboxOptionSpec,
      }),
    },
    styleSlots: ['content'],
    slots: {},
    events: ['onChange'],
  },
})(props => {
  const { elementRef, mergeState, subscribeMethods, callbackMap, customStyle } = props;
  const {
    updateWhenDefaultValueChanges,
    options = [],
    defaultCheckedValues,
    showCheckAll,
    checkAllText,
    ...checkboxProps
  } = getComponentProps(props);
  const optionValues = useMemo(() => options.map(o => o.value), [options]);
  const defaultValue = useMemo(
    () => optionValues.filter(o => defaultCheckedValues.includes(o)),
    [defaultCheckedValues, optionValues]
  );

  const [checkedValues, setCheckedValues] = useStateValue(
    defaultValue,
    mergeState,
    updateWhenDefaultValueChanges,
    'checkedValues'
  );
  const enabledOptions = useMemo(
    () => options.filter(({ disabled }) => !disabled),
    [options]
  );
  const isCheckedAll = useMemo<boolean>(
    () => checkedValues.length === options.length,
    [checkedValues, options.length]
  );

  useEffect(() => {
    mergeState({
      isCheckAll: isCheckedAll,
    });
  }, [isCheckedAll, mergeState]);

  const indeterminate = useMemo<boolean>(
    () => checkedValues.length !== 0 && !isCheckedAll,
    [isCheckedAll, checkedValues]
  );
  const option = options[0];

  const onGroupChange = (newCheckedValues: string[]) => {
    setCheckedValues(newCheckedValues);
    mergeState({
      checkedValues: newCheckedValues,
      isCheckAll: newCheckedValues.length === options.length,
    });
    callbackMap?.onChange?.();
  };
  const onChange = (checked: boolean) => {
    const newCheckedValues = checked ? [option?.value] : [];

    setCheckedValues(newCheckedValues);
    mergeState({
      checkedValues: newCheckedValues,
      isCheckAll: newCheckedValues.length === options.length,
    });
    callbackMap?.onChange?.();
  };
  const checkAll = useCallback(() => {
    const newCheckedValues = enabledOptions.map(({ value }) => value);

    setCheckedValues(newCheckedValues);
    mergeState({
      checkedValues: newCheckedValues,
      isCheckAll: true,
    });
  }, [enabledOptions, mergeState, setCheckedValues]);
  const uncheckAll = useCallback(() => {
    setCheckedValues([]);
    mergeState({
      checkedValues: [],
      isCheckAll: false,
    });
  }, [mergeState, setCheckedValues]);
  const onCheckAll = () => {
    if (checkedValues.length !== enabledOptions.length) {
      checkAll();
    } else {
      uncheckAll();
    }
  };

  useEffect(() => {
    subscribeMethods({
      setCheckedValues: ({ checkedValues: newCheckedValues }) => {
        setCheckedValues(newCheckedValues);
        mergeState({
          checkedValues: newCheckedValues,
          isCheckAll: checkedValues.length === options.length,
        });
      },
      toggleValues: ({
        values = [],
      }: {
        values: Static<typeof BaseCheckboxOptionSpec>;
      }) => {
        const currentCheckedValues = [...checkedValues];

        values.forEach(({ value }) => {
          const index = currentCheckedValues.indexOf(value);

          if (index > -1) {
            currentCheckedValues.splice(index, 1);
          } else {
            currentCheckedValues.push(value);
          }
        });

        setCheckedValues(currentCheckedValues);
        mergeState({
          checkedValues: currentCheckedValues,
          isCheckAll: currentCheckedValues.length === options.length,
        });
      },
      checkAll,
      uncheckAll,
    });
  }, [
    subscribeMethods,
    mergeState,
    checkedValues,
    options,
    checkAll,
    uncheckAll,
    setCheckedValues,
  ]);

  const CheckAll = showCheckAll ? (
    <BaseCheckbox
      className={css(customStyle?.content)}
      indeterminate={indeterminate}
      checked={isCheckedAll}
      onChange={onCheckAll}
    >
      {checkAllText}
    </BaseCheckbox>
  ) : null;
  const CheckboxList =
    options.length > 1 ? (
      <BaseCheckbox.Group
        {...checkboxProps}
        className={css(customStyle?.content)}
        value={checkedValues}
        onChange={onGroupChange}
        options={options}
      />
    ) : (
      <BaseCheckbox
        {...checkboxProps}
        className={css(customStyle?.content)}
        disabled={checkboxProps.disabled || option?.disabled}
        onChange={onChange}
        checked={checkedValues.includes(option?.value)}
        indeterminate={option?.indeterminate}
      >
        {option?.label}
      </BaseCheckbox>
    );

  return (
    <div ref={elementRef}>
      {CheckAll}
      {CheckboxList}
    </div>
  );
});
