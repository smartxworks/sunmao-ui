import { 
  Checkbox as BaseCheckbox, 
} from '@arco-design/web-react';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImpl, implementRuntimeComponent, observer } from '@sunmao-ui/runtime';
import { 
  CheckboxPropsSchema as BaseCheckboxPropsSchema, 
  CheckboxOptionSchema as BaseCheckboxOptionSchema
} from '../generated/types/Checkbox';
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { css, cx } from '@emotion/css';
import { useState, useEffect, useMemo } from 'react';

const CheckboxPropsSchema = Type.Object({
  ...BaseCheckboxPropsSchema,
  className: Type.String()
});
const CheckboxStateSchema = Type.Object({
  checkedValues: Type.Array(Type.String()),
  isCheckAll: Type.Boolean()
});

const CheckboxImpl: ComponentImpl<Static<typeof CheckboxPropsSchema>> = observer((props)=> {
  const {
    mergeState,
    subscribeMethods,
    callbackMap,
    customStyle,
  } = props;
  const {
    className,
    options = [],
    defaultCheckedValues,
    showCheckAll,
    checkAllText,
    ...checkboxProps
  } = getComponentProps(props);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [isInit, setIsInit] = useState<boolean>(false);
  const enabledOptions = useMemo(()=> options.filter(({disabled})=> !disabled), [options]);
  const isCheckedAll = useMemo<boolean>(()=> checkedValues.length === options.length, [checkedValues, options]);
  const indeterminate = useMemo<boolean>(()=> checkedValues.length !== 0 && !isCheckedAll, [isCheckedAll, checkedValues]);
  const option = options[0];

  const onGroupChange = (newCheckedValues: string[])=> {
    setCheckedValues(newCheckedValues);
    mergeState({ 
      checkedValues: newCheckedValues,
      isCheckAll: newCheckedValues.length === options.length
    });
    callbackMap?.onChange?.();
  };
  const onChange = (checked: boolean)=> {
    const newCheckedValues = checked ? [option?.value] : [];

    setCheckedValues(newCheckedValues);
    mergeState({ 
      checkedValues: newCheckedValues,
      isCheckAll: newCheckedValues.length === options.length
    });
    callbackMap?.onChange?.();
  };
  const checkAll = ()=> {
    const newCheckedValues = enabledOptions.map(({value})=> value);

    setCheckedValues(newCheckedValues);
    mergeState({ 
      checkedValues: newCheckedValues,
      isCheckAll: true
    });
  };
  const uncheckAll = ()=> {
    setCheckedValues([]);
    mergeState({ 
      checkedValues: [],
      isCheckAll: false
    });
  };
  const onCheckAll = ()=> {
    if (checkedValues.length !== enabledOptions.length) {
      checkAll();
    } else {
      uncheckAll();
    }
  };

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      setCheckedValues(defaultCheckedValues);
      mergeState({ 
        checkedValues: defaultCheckedValues,
      });
    }
  }, [defaultCheckedValues, mergeState, isInit]);
  useEffect(() => {
    subscribeMethods({
      setCheckedValues: ({ checkedValues: newCheckedValues })=> {
        mergeState({ 
          newCheckedValues,
          isCheckAll: checkedValues.length === options.length
        });
      },
      toggleValues: ({ values = [] }: { values: Static<typeof BaseCheckboxOptionSchema> })=> {
        const currentCheckedValues = [...checkedValues];

        values.forEach(({ value })=> { 
          const index = currentCheckedValues.indexOf(value);

          if (index > -1) {
            currentCheckedValues.splice(index, 1);
          } else {
            currentCheckedValues.push(value);
          }
        });

        mergeState({ 
          checkedValues: currentCheckedValues,
          isCheckAll: currentCheckedValues.length === options.length
        });
      },
      checkAll,
      uncheckAll,
    });
  }, [subscribeMethods, mergeState, checkedValues, options]);

  const CheckAll = showCheckAll ? (
    <BaseCheckbox
      className={cx(className, css(customStyle?.content))}
      indeterminate={indeterminate}
      checked={isCheckedAll}
      onChange={onCheckAll}
    >{checkAllText}</BaseCheckbox>
  ) : null;
  const CheckboxList = options.length > 1 ? (
    <div>
      <BaseCheckbox.Group
        {...checkboxProps}
        className={cx(className, css(customStyle?.content))}
        defaultValue={defaultCheckedValues}
        value={checkedValues}
        onChange={onGroupChange}
      >
        {
          options.map(option=> (
            <BaseCheckbox
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              indeterminate={option.indeterminate}
            >{option.label}</BaseCheckbox>
          ))
        }
      </BaseCheckbox.Group>
    </div>
  ) : (
    <BaseCheckbox 
      {...checkboxProps}
      className={cx(className, css(customStyle?.content))}
      disabled={option?.disabled}
      onChange={onChange}
      checked={checkedValues.includes(option?.value)}
      indeterminate={option?.indeterminate}
    >{option?.label}</BaseCheckbox>
  );
    
  return (
    <>
      {CheckAll}
      {CheckboxList}
    </>
  );
});

const exampleProperties: Static<typeof CheckboxPropsSchema> = {
  className: 'checkbox',
  options: [],
  direction: 'horizontal',
  defaultCheckedValues: [],
  showCheckAll: false,
  checkAllText: 'Check all'
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: 'checkbox',
    displayName: 'Checkbox',
    exampleProperties
  },
  spec: {
    properties: CheckboxPropsSchema,
    state: CheckboxStateSchema,
    methods: {
      setCheckedValues: Type.Object({
        values: Type.Array(Type.String())
      }),
      checkAll: void 0,
      uncheckAll: void 0,
      toggleValues: Type.Object({
        values: BaseCheckboxOptionSchema
      })
    },
    styleSlots: ['content'],
    slots:[],
    events: ['onChange']
  }
};

export const Checkbox = implementRuntimeComponent(options)(CheckboxImpl);
