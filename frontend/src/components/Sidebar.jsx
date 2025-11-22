import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, ShieldAlert, Network, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/upload', icon: Upload, label: 'Upload PCAP' },
        { path: '/traffic', icon: ShieldAlert, label: 'Detected Traffic' },
        { path: '/nodes', icon: Network, label: 'Tor Nodes' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">TorGuard</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    v1.0.0 • Secure & Private
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
