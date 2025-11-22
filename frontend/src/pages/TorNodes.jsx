import React, { useState } from 'react';
import { RefreshCw, Server } from 'lucide-react';
import api from '../services/api';

const TorNodes = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState(null);

    const handleRefresh = async () => {
        setRefreshing(true);
        setMessage(null);
        try {
            const response = await api.post('/refresh-intel');
            setMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to refresh Tor nodes.' });
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tor Nodes Intelligence</h1>
                <p className="text-gray-500">Manage and view known Tor exit nodes</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Tor Exit Node Database</h3>
                            <p className="text-sm text-gray-500">Sync with official Tor Project list</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${refreshing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh Database'}
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TorNodes;
