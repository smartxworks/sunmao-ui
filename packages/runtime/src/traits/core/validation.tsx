import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createTrait } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplementation } from '../../registry';
import { min } from 'lodash';

type ValidationResult = { isValid: boolean; errorMsg: string };
type ValidationRule = (text: string) => { isValid: boolean; errorMsg: string };

const rules = new Map<string, ValidationRule>();

export function addValidationRule(name: string, rule: ValidationRule) {
  rules.set(name, rule);
}
(window as any).rules = rules;

addValidationRule('email', text => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
    return {
      isValid: true,
      errorMsg: '',
    };
  } else {
    return {
      isValid: false,
      errorMsg: '请输入正确的 email',
    };
  }
});

addValidationRule('phoneNumber', text => {
  if (/^1[3456789]\d{9}$/.test(text)) {
    return {
      isValid: true,
      errorMsg: '',
    };
  } else {
    return {
      isValid: false,
      errorMsg: '请输入正确的手机号码',
    };
  }
});

type ValidationProps = {
  value: string;
  minLength: number;
  maxLength: number;
  rule: string;
};

const useValidationTrait: TraitImplementation<ValidationProps> = props => {
  const { value, minLength, maxLength, rule, mergeState } = props;
  const [errorMsg, setErrorMsg] = useState('');

  const validateString = useCallback(
    (text: string) => {
      if (value.length > maxLength) {
        setErrorMsg(`最长不能超过${maxLength}个字符`);
        return;
      } else if (value.length < minLength) {
        setErrorMsg(`不能少于${minLength}个字符`);
        return;
      }

      const rulesArr = rule.split(',');
      for (const ruleName of rulesArr) {
        const validateFunc = rules.get(ruleName);
        if (validateFunc) {
          const result = validateFunc(value);
          if (!result.isValid) {
            setErrorMsg(result.errorMsg);
            return;
          }
        }
      }

      // pass all validation
      setErrorMsg('');
    },
    [value, minLength, maxLength]
  );

  useEffect(() => {
    validateString(value);
  }, [validateString]);

  useEffect(() => {
    mergeState({ errorMsg });
  }, [errorMsg]);

  return {
    props: null,
  };
};

const ValidationValuePropertySchema = Type.String();
const ValidationRulePropertySchema = Type.String();
const ValidationMinLengthPropertySchema = Type.Integer();
const ValidationMaxLengthPropertySchema = Type.Integer();

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'validation',
      description: 'validation trait',
    },
    spec: {
      properties: [
        {
          name: 'value',
          ...ValidationValuePropertySchema,
        },
        {
          name: 'rule',
          ...ValidationRulePropertySchema,
        },
        {
          name: 'minLength',
          ...ValidationMinLengthPropertySchema,
        },
        {
          name: 'maxLength',
          ...ValidationMaxLengthPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: useValidationTrait,
};
