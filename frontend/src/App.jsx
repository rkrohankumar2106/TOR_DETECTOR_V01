import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DetectedTraffic from './pages/DetectedTraffic';
import TorNodes from './pages/TorNodes';
import Settings from './pages/Settings';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/upload" element={<Upload />} />
                                <Route path="/traffic" element={<DetectedTraffic />} />
                                <Route path="/nodes" element={<TorNodes />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
