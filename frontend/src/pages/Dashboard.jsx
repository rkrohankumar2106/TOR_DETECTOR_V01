import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Globe, Server } from 'lucide-react';
import { getStats, getAllTraffic } from '../services/traffic';
import CardStat from '../components/CardStat';
import MapView from '../components/MapView';
import TrafficTable from '../components/TrafficTable';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    getStats(),
                    getAllTraffic()
                ]);
                setStats(statsRes);
                setLogs(logsRes);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Overview of network traffic and threats</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardStat
                    title="Total Incidents"
                    value={stats?.total_incidents || 0}
                    icon={Activity}
                    color="bg-blue-500"
                />
                <CardStat
                    title="Active Tor Nodes"
                    value={stats?.active_tor_nodes || 0}
                    icon={Server}
                    color="bg-indigo-500"
                />
                <CardStat
                    title="Threats Detected"
                    value={logs.filter(l => l.is_tor_traffic).length}
                    icon={ShieldAlert}
                    color="bg-red-500"
                />
                <CardStat
                    title="Countries"
                    value={new Set(logs.map(l => l.geo_country).filter(Boolean)).size}
                    icon={Globe}
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Threat Map</h2>
                    <MapView logs={logs} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Traffic</h2>
                    <div className="max-h-[400px] overflow-y-auto">
                        <TrafficTable logs={logs.slice(0, 10)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
