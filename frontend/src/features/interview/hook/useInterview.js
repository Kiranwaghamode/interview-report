import { getInterviewHistory, getInterviewReportById, generateInterviewReport} from '../services/interview.api.js'
import { useContext, useEffect } from 'react'
import { InterviewContext } from '../interview.context.jsx'
import { useParams } from 'react-router'

export const useInterview = () => {

    const { interviewId } = useParams();

    const context = useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async ({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        let response = null;
        try {
            response = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
            setReport(response.interviewReport)
        } catch (error) {
            console.log("Error in useInterview.js: while generating the report", error)
        }finally {
            setLoading(false)
        }

        return response.interviewReport;
    }

    const fetchReportById = async (interviewId) => {
        setLoading(true)
        let response = null;
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log("Error in useInterview.js: while fetching the report by id", error)
        }finally {
            setLoading(false)
        }
        return response.interviewReport;
    }

    const fetchInterviewHistory = async () => {
        setLoading(true)
        let response = null;
        try {
            response = await getInterviewHistory()
            setReports(response.interviewHistory)
        } catch (error) {
            console.log("Error in useInterview.js: while fetching the interview history", error)
        }finally {
            setLoading(false)
        }   

        return response.interviewHistory;
    }

    useEffect(() => {
        if (interviewId) {
            fetchReportById(interviewId)
        }else{
            fetchInterviewHistory()
        }
    }, [interviewId])
    

    return {
        loading,
        report,
        reports,
        generateReport,
        fetchReportById,
        fetchInterviewHistory
    }
}



   
