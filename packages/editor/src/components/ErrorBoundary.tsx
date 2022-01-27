import React from 'react';

type Props = {
  onError?: (error: Error | null) => void;
}

class ErrorBoundary extends React.Component<
  Props,
  { error: unknown }
> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
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
      return String(this.state.error);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
