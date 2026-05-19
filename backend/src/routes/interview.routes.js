import express from 'express'
import { authUser } from '../middlewares/auth.middleware.js'
import { generateInterviewReportController, getInterviewReportByIdController, getInterviewHistoryController } from '../controllers/interview.controller.js'


import { upload } from '../middlewares/file.middleware.js'
import { get } from 'node:http'





const interviewRouter = express.Router() 

//Route /api/interview
//To generate a new report
// interviewRouter.post('/generate', authUser, upload.single('resume'), generateInterviewReportController)

interviewRouter.post('/generate', authUser, (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            console.log("Multer error:", err); // 👈 this will show the real error
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, generateInterviewReportController);

//Route GET /api/interview/report/:interviewId
//To get the interview report by interviewId

interviewRouter.get('/report/:interviewId', authUser, getInterviewReportByIdController)


//Route GET /api/interview/history
//To get the interview history of the user

interviewRouter.get('/history', authUser, getInterviewHistoryController)

export { interviewRouter }