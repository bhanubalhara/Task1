'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HealthData {
  ok: boolean;
  version: string;
  uptime?: number;
}

export default function HealthCheckPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/healthz');
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (error) {
      console.error('Error fetching health:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">System Health</h1>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : health ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${health.ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-lg font-semibold">
                  Status: {health.ok ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Version</label>
                  <p className="text-lg font-mono text-gray-900">{health.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Uptime</label>
                  <p className="text-lg text-gray-900">{formatUptime(health.uptime)}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold mb-4">API Endpoint</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm text-gray-800">GET /api/healthz</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-600 py-8">
              Failed to fetch health status
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

