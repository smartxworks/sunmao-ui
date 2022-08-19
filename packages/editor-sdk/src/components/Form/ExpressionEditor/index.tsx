import React, { Suspense } from 'react';
import type { ExpressionEditorHandle, ExpressionEditorProps } from './ExpressionEditor';

export { ExpressionEditorHandle, ExpressionEditorProps };

export const ExpressionEditor = React.forwardRef<
  ExpressionEditorHandle,
  ExpressionEditorProps
>((props: ExpressionEditorProps, ref) => {
  const ExpressionEditor = React.lazy(() =>
    import('./ExpressionEditor').then(lib => {
      return {
        default: lib.ExpressionEditor,
      };
    })
  );
  return (
    <Suspense fallback={<div>Loading Expression Editor</div>}>
      <ExpressionEditor ref={ref} {...props} />
    </Suspense>
  );
});
