import { css } from '@emotion/css';
import React from 'react';

type Props = {
  onError?: (error: Error | null) => void;
};

const ErrorStyle = css`
  white-space: pre-line;
  font-family: monospace;
  color: red;
`;
class ErrorBoundary extends React.Component<Props, { error: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidMount() {
    this.props.onError?.(null);
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) {
      return <div className={ErrorStyle}>{this.state.error.stack}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
