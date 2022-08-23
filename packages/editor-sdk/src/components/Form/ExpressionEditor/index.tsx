import React, { Suspense } from 'react';
import type { ExpressionEditorHandle, ExpressionEditorProps } from './ExpressionEditor';

export { ExpressionEditorHandle, ExpressionEditorProps };

const ExpressionEditorComponent = React.lazy(() =>
  import('./ExpressionEditor').then(lib => {
    return {
      default: lib.ExpressionEditor,
    };
  })
);

export const ExpressionEditor = React.forwardRef<
  ExpressionEditorHandle,
  ExpressionEditorProps
>((props: ExpressionEditorProps, ref) => {
  return (
    <Suspense fallback={<div>Loading Expression Editor</div>}>
      <ExpressionEditorComponent ref={ref} {...props} />
    </Suspense>
  );
});
