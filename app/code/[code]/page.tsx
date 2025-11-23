'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkData {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: string;
  last_clicked_at: string | null;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${baseUrl}/${code}`;

  useEffect(() => {
    fetchLink();
  }, [code]);

  const fetchLink = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/links/${code}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to load link');
        }
        return;
      }

      const data = await response.json();
      setLink(data);
    } catch (error) {
      console.error('Error fetching link:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
              <p className="text-gray-600 mb-4">{error || 'The requested link does not exist.'}</p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Link Statistics</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Short Code</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono text-gray-900">{link.code}</span>
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Copy code"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Short URL</label>
              <div className="flex items-center gap-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  title="Copy URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Target URL</label>
              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {link.url}
                </a>
                <button
                  onClick={() => copyToClipboard(link.url)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  title="Copy URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Total Clicks</label>
                <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(link.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Clicked</label>
                <p className="text-sm text-gray-900">{formatDate(link.last_clicked_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

