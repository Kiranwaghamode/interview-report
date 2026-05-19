import axios from 'axios';

const api = axios.create({
    baseURL : 'https://interview-report-backend-uc1l.onrender.com',
    withCredentials: true,
});

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile})=>{
    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('selfDescription', selfDescription)
    formData.append('resume', resumeFile)

    const response = await api.post('/api/interview/generate', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data;

}


export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

export const getInterviewHistory = async () => {
    const response = await api.get('/api/interview/history')
    return response.data
}