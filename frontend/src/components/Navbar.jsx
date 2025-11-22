import React from 'react';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tor Network Analyzer</h2>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Bell size={20} />
                </button>
                <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                        <User size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
