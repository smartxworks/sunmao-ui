import React from 'react';
import { FieldProps } from '../fields';
import { ModuleWidget } from './ModuleWidget';
import { ExpressionWidget } from './ExpressionWidget';

export const widgets: Record<string, React.FC<FieldProps>> = {
  module: ModuleWidget,
  expression: ExpressionWidget,
};
