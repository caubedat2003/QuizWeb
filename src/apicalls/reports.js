import axiosInstance from ".";

//add report
export const addReport = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/reports/add-report', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

//get all reports
export const getAllReports = async (filter) => {
    try {
        const response = await axiosInstance.post('/api/reports/get-all-reports', filter);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

//get all reports by user
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post('/api/reports/get-all-reports-by-user');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}