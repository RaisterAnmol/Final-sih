import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorView } from '../errors/ErrorView';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          type="500"
          code="500"
          title="Component Execution Interrupted"
          subtitle="REACT CLIENT EXCEPTION"
          description="An unexpected rendering exception was caught by the institutional error boundary. Internal state has been secured."
          incidentId="ERR-CLIENT-BOUNDARY"
          actions={[
            {
              label: "Reset Session & Reload",
              onClick: this.handleReset,
              variant: "primary",
              icon: <RefreshCw className="w-3.5 h-3.5" />,
            },
            {
              label: "Return to Dashboard",
              to: "/dashboard",
              variant: "secondary",
              icon: <AlertTriangle className="w-3.5 h-3.5" />,
            },
          ]}
        />
      );
    }

    return this.props.children;
  }
}

