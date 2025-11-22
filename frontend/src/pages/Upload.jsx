import React from 'react';
import FileUpload from '../components/FileUpload';

const Upload = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Upload PCAP</h1>
                <p className="text-gray-500">Analyze network traffic files for Tor activity</p>
            </div>

            <div className="max-w-2xl mx-auto mt-12">
                <FileUpload />
            </div>
        </div>
    );
};

export default Upload;
