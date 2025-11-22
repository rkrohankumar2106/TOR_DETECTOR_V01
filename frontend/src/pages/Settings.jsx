import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { refreshIntel } from '../services/traffic';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleRefresh = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            const data = await refreshIntel();
            setMessage(data.message);
        } catch (err) {
            setError('Failed to refresh intelligence data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Configure application preferences</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Intelligence Data</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 dark:text-gray-300">Refresh Tor Exit Node List</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Update the database with the latest Tor exit node IP addresses.</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Refreshing...' : 'Refresh Now'}
                    </button>
                </div>

                {message && (
                    <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle size={18} />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
