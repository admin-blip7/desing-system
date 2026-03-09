"use client";

import React from "react";

interface LogoBamlErrorBoundaryProps {
  children: React.ReactNode;
}

interface LogoBamlErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class LogoBamlErrorBoundary extends React.Component<
  LogoBamlErrorBoundaryProps,
  LogoBamlErrorBoundaryState
> {
  constructor(props: LogoBamlErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error: unknown): LogoBamlErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Error inesperado en BAML.",
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("[LogoBamlErrorBoundary]", error, errorInfo);
  }

  private reset = () => {
    this.setState({
      hasError: false,
      message: "",
    });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section
        className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-100"
        role="alert"
        aria-live="assertive"
      >
        <h2 className="text-base font-semibold">No se pudo renderizar BAML de logo</h2>
        <p className="mt-2 text-sm text-red-100/90">{this.state.message}</p>
        <button
          type="button"
          onClick={this.reset}
          className="mt-4 rounded-md border border-red-300/50 px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-red-500/20"
        >
          Reintentar
        </button>
      </section>
    );
  }
}
