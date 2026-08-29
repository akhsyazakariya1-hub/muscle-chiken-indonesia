import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Crown } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error Boundary Catch:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071B2A] text-[#F7F3EA] flex items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#063B32] border-2 border-[#D8C7A1] shadow-2xl space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-[#071B2A] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center mx-auto shadow-xl">
              <AlertTriangle className="w-8 h-8 text-[#D8C7A1]" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8C7A1]">MUSCLE CHICKEN INDONESIA</span>
              <h2 className="font-serif text-2xl font-bold text-[#F7F3EA] mt-1">Something went wrong.</h2>
              <p className="text-xs text-[#F7F3EA]/80 mt-2 font-sans leading-relaxed">
                Sistem mendeteksi kendala pada koneksi komponen. Layanan dapat direfresh tanpa kehilangan data pesanan Anda.
              </p>
            </div>

            {/* DEV ERROR DETAILS (Only in Dev environment) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="p-3 rounded-xl bg-[#071B2A] text-left border border-red-500/30 text-[10px] font-mono text-red-300 max-h-32 overflow-y-auto">
                <p className="font-bold text-red-400">{this.state.error.toString()}</p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-4 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-widest hover:bg-[#F7F3EA] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <RefreshCw className="w-4 h-4 text-[#071B2A]" />
              <span>RELOAD & RECONNECT</span>
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
