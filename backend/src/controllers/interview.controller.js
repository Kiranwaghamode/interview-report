import pdfparse from 'pdf-parse-fork'
import { generateInterviewReport } from '../services/ai.service.js'
import { interviewReportModel } from '../models/interviewReport.model.js'
import { PDFParse } from 'pdf-parse'




async function generateInterviewReportController(req, res){
    
    console.log("Controller is workign....")
    const resumeFile = req.file
    const resumeContent = (await pdfparse(resumeFile.buffer)).text


    const { selfDescription, jobDescription } = req.body 
    console.log("Self Description: ", selfDescription)
    console.log("Job Description: ", jobDescription)    

    try {
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })


        console.log("AI Generated Report: ", interviewReportByAi)

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGap: interviewReportByAi.skillGap,
            PreparationPlan: interviewReportByAi.preparationPlan,  // manual remap
            title: interviewReportByAi.jobTitle
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })



    } catch (error) {
        console.log("ERROR WHILE GENERATING THE REPORT:", error)
        res.status(500).json({ message: "AI is not generating Report", error: error.message })
    }


}


async function getInterviewReportByIdController(req, res){
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })

    if(!interviewReport){
        return res.status(404).json({ message: "Interview report not found" })
    }

    res.status(200).json({ message: "Interview report fetched successfully", interviewReport })

}

async function getInterviewHistoryController(req, res){
    const interviewHistory = await interviewReportModel.find({
        user: req.user.id
    }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan")

    res.status(200).json({ message: "Interview history fetched successfully", interviewHistory })

}

export {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getInterviewHistoryController
}