import { Type } from '@sinclair/typebox';
import _Text, { TextPropertySpec } from '../_internal/Text';
import { implementRuntimeComponent } from '../../utils/buildKit';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  value: TextPropertySpec,
});

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'text',
    displayName: 'Text',
    description: 'support plain and markdown formats',
    isDraggable: true,
    isResizable: false,
    exampleProperties: {
      value: {
        raw: 'text',
        format: 'plain',
      },
    },
    exampleSize: [4, 1],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
    value,
    customStyle,
    elementRef,
    // component,
    // componentDidMount,
    // unmountHooks,
    // componentDidUpdate,
  }) => {
    // console.info('####Component Render', component.id);
    // useEffect(() => {
    //   console.info('####Component DidMount', component.id);
    //   componentDidMount?.forEach(e => e());
    // }, [component.id, componentDidMount]);
    // useEffect(() => {
    //   console.info('####Component Update', component.id);
    //   componentDidUpdate?.forEach(e => e());
    // }, [component.id, componentDidMount, componentDidUpdate]);
    // useEffect(() => {
    //   return () => {
    //     console.info('Component DidUnmount', component.id, unmountHooks);
    //     unmountHooks?.forEach(e => e());
    //   };
    // }, [component.id, unmountHooks]);
    return <_Text value={value} cssStyle={customStyle?.content} ref={elementRef} />;
  }
);

// 不知道为什么，计时器还在继续，貌似是因为style执行了两次，两个interval，但是clear只执行了一次
// 另一个问题是，为什么style会执行两次呢？
