import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error);
    console.error('Error Info:', errorInfo);
    // Log to external service here if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#09090B',
            color: '#FFFFFF',
            padding: '20px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Something went wrong</h1>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>
            Please try refreshing the page
          </p>
          {import.meta.env.DEV && (
            <pre
              style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#ff6b6b',
                maxWidth: '600px',
                overflow: 'auto',
              }}
            >
              {this.state.error?.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
