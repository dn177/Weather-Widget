import { Component } from "react";

// Suspense only catches loading states, not render errors, so a rejected
// lazy import (stale chunk after a redeploy) or a runtime throw (e.g. WebGL
// context creation failing in the Astronaut scene) would otherwise unmount
// the whole tree to a blank page. This catches it and renders `fallback`
// instead, leaving the rest of the app intact.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
