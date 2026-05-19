import { GoogleGenAI } from '@google/genai'
import z from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description, with higher scores indicating a better match."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question asked during the interview"),
        intention: z.string().describe("The intention behind asking this question, e.g., to assess problem-solving skills, coding ability, etc."),
        answer: z.string().describe("how to answer this question effectively, what points to cover in the answer, and any tips for structuring the response."),
    })).describe("A list of technical questions asked during the interview, along with the intention behind each question and tips for answering them effectively."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question asked during the interview"),
        intention: z.string().describe("The intention behind asking this question, e.g., to assess cultural fit, teamwork skills, etc."),
        answer: z.string().describe("how to answer this question effectively, what points to cover in the answer, and any tips for structuring the response."),
    })).describe("A list of behavioral questions asked during the interview, along with the intention behind each question and tips for answering them effectively."),

    skillGap: z.array(z.object({
        skill: z.string().describe("The specific skill or knowledge area where the candidate showed a gap during the interview"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, indicating how critical it is for the candidate to improve in this area"),
    })).describe("A list of skill gaps identified during the interview, along with the severity of each gap to help prioritize areas for improvement."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The specific focus area for this day of preparation, e.g., practicing coding problems, reviewing system design concepts, etc."),
        tasks: z.array(z.string()).describe("A list of specific tasks or activities to complete on this day to prepare for the interview, such as solving a certain number of coding problems, reading specific articles, etc."),
    })).describe("A structured preparation plan for the candidate, outlining specific focus areas and tasks for each day leading up to the interview to help them improve their skills and increase their chances of success.")


},)

const newInterviewReportSchema = {
        type: "object",
        properties: {
            matchScore: {
                type: "number",
                description: "A score between 0 and 100 indicating how well the candidate matches the job"
            },
            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question:  { type: "string" },
                        intention: { type: "string" },
                        answer:    { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question:  { type: "string" },
                        intention: { type: "string" },
                        answer:    { type: "string" }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGap: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill:    { type: "string" },
                        severity: { type: "string", enum: ["low", "medium", "high"] }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: "array",
                description: "A day-by-day preparation plan for the candidate. MUST be included. Generate at least 5 days.",
                items: {
                    type: "object",
                    properties: {
                        day:   { type: "number" },
                        focus: { type: "string" },
                        tasks: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            },
            jobTitle: { type: "string" },
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preparationPlan", "jobTitle"]
    }


async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `generate an interview report for a candidate based on the following information:
                    Resume: ${resume}
                    Self-Description: ${selfDescription}
                    Job-Description: ${jobDescription}
                     IMPORTANT: Your response MUST include:
                    - A preparationPlan with at least 5 days of tasks
                    - The jobTitle extracted from the job description
                    `

    let response;
    

 try {
    response = await ai.models.generateContent({
           model: 'gemini-2.5-flash-lite',
           contents: prompt,
           config: {
               responseMimeType: 'application/json',
               responseSchema: newInterviewReportSchema
   
           }
       })
       console.log("ERROR In AI SERVICE: ", response)
 } catch (error) {
    console.log("Error in ai.service.js:", error)
    
 }

    // return JSON.parse(response.text())
    return JSON.parse(response.candidates[0].content.parts[0].text)
}




export { generateInterviewReport }