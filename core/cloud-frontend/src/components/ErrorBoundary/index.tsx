import { Component, ContextType, ErrorInfo, ReactNode } from "react";

import { AppInsightsContext } from "../../modules/app-insights/providers/AppInsightsProvider";

interface Props {
  children: ReactNode;
  fallback?: (errorMessage: string) => ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  static contextType = AppInsightsContext;

  declare context: ContextType<typeof AppInsightsContext>;

  state: State = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.context.analyticsClient.trackException(error);
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { fallback } = this.props;
    const { hasError, errorMessage } = this.state;

    if (hasError) {
      return fallback ? (
        fallback(errorMessage)
      ) : (
        <h2>Error: Something went wrong</h2>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
