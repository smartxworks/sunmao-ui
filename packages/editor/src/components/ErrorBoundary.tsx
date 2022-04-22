import React from 'react';

type Props = {
  onError?: (error: Error | null) => void;
};

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
      return <div style={{ whiteSpace: 'pre-line' }}>{this.state.error.stack}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
