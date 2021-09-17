import React from 'react';

class ErrorBoundary extends React.Component<
  Record<string, unknown>,
  { error: unknown }
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    console.log('!!!', { error });
    return { error };
  }

  render() {
    if (this.state.error) {
      return String(this.state.error);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
