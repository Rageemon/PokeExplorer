import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">An error occurred: {this.state.error?.message}</p>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;