import { css } from '@emotion/css';
import React from 'react';

type Props = {
  componentId: string;
  onRef: (ele: HTMLElement) => void;
  onError?: (error: Error | null) => void;
  onRecoverFromError: () => void;
};

const TitleCss = css`
  font-weight: bold;
  font-size: 16px;
`;

const ButtonStyle = css`
  background: #3182ce;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
`;

const ErrorStyle = css`
  white-space: pre-line;
  font-family: monospace;
  color: red;
`;

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
            <p className={TitleCss}>
              Error occurred in component: {this.props.componentId}.
            </p>
            <button className={ButtonStyle} onClick={this.onRerender}>
              Click here to Rerender
            </button>
          </div>
          <div className={ErrorStyle}>{this.state.error.stack}</div>
        </div>
      );
    }

    return this.props.children;
  }
}
