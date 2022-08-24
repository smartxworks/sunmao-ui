import React from 'react';

type Props = {
  componentId: string;
  onRef: (ele: HTMLElement) => void;
  onError?: (error: Error | null) => void;
  onRecoverFromError: () => void;
};

export default class ComponentErrorBoundary extends React.Component<
  Props,
  { error: Error | null; rerenderFlag: number }
> {
  ref = React.createRef<HTMLDivElement>();
  constructor(props: Props) {
    super(props);
    this.state = { error: null, rerenderFlag: 1 };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidMount() {
    if (this.ref.current) {
      this.props.onRef(this.ref.current);
    }
    this.props.onError?.(null);
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  componentDidUpdate() {
    if (this.ref.current) {
      this.props.onRef(this.ref.current);
    }
  }

  onRerender = () => {
    this.setState({ error: null }, () => {
      // update the ref after rerender
      if (this.ref.current) {
        this.props.onRef(this.ref.current);
      } else {
        this.props.onRecoverFromError();
      }
    });
  };

  render() {
    if (this.state.error) {
      return (
        <div ref={this.ref}>
          <div>
            <span>Error occurred in component: {this.props.componentId}.</span>
            <button onClick={this.onRerender}>Click here to Rerender</button>
          </div>
          <div style={{ whiteSpace: 'pre-line' }}>{this.state.error.stack}</div>
        </div>
      );
    }

    return this.props.children;
  }
}
