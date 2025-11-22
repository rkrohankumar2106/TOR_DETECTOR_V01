import React, { useEffect, useState } from 'react';
import { getAllTraffic } from '../services/traffic';
import TrafficTable from '../components/TrafficTable';
import Loader from '../components/Loader';

const DetectedTraffic = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAllTraffic();
                setLogs(data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Detected Traffic</h1>
                <p className="text-gray-500">Recent network activity and threat analysis</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <TrafficTable logs={logs} />
            </div>
        </div>
    );
};

export default DetectedTraffic;
