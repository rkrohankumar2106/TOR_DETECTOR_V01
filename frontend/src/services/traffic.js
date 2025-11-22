import api from './api';

export const getStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const uploadPCAP = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload-pcap', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAllTraffic = async () => {
    const response = await api.get('/logs');
    return response.data;
};

export const refreshIntel = async () => {
    const response = await api.post('/refresh-intel');
    return response.data;
};

export const getTorNodes = async () => {
    // This endpoint wasn't explicitly requested but good to have if needed later
    // For now we can just return empty or implement if backend has it (backend doesn't seem to have a direct list endpoint in the description, only stats)
    return [];
};
