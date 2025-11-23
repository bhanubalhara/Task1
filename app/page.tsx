'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LinkData {
  id: number;
  code: string;
  url: string;
  clicks: number;
  created_at: string;
  last_clicked_at: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ url: '', code: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          code: formData.code || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || 'Failed to create link');
        return;
      }

      setFormSuccess(true);
      setFormData({ url: '', code: '' });
      setShowAddForm(false);
      fetchLinks();

      setTimeout(() => setFormSuccess(false), 3000);
    } catch (error) {
      setFormError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeleting(code);
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Link'}
          </button>
        </div>

        {formSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            Link created successfully!
          </div>
        )}

        {showAddForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Create Short Link</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Code (optional, 6-8 alphanumeric characters)
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Leave empty for auto-generated"
                  pattern="[A-Za-z0-9]{6,8}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be 6-8 alphanumeric characters
                </p>
              </div>
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formLoading ? 'Creating...' : 'Create Link'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No links found matching your search.' : 'No links yet. Create your first short link!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((link) => {
                    const shortUrl = `${baseUrl}/${link.code}`;
                    return (
                      <tr key={link.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/code/${link.code}`}
                              className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                            >
                              {link.code}
                            </Link>
                            <button
                              onClick={() => copyToClipboard(shortUrl)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy URL"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate" title={link.url}>
                            {truncateUrl(link.url, 60)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(link.last_clicked_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(link.code)}
                            disabled={deleting === link.code}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting === link.code ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <Link href="/healthz" className="hover:text-gray-700">
            Health Check
          </Link>
        </div>
      </footer>
    </div>
  );
}

