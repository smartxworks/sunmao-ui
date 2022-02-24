import React from 'react';
import { FieldProps } from '../fields';
import { ModuleWidget } from './ModuleWidget';
import { ExpressionWidget, ExpressionWidgetProps } from './ExpressionWidget';

export const widgets: Record<string, React.FC<FieldProps> | React.FC<ExpressionWidgetProps>> = {
  module: ModuleWidget,
  expression: ExpressionWidget,
};
