import { Router } from 'express'
import { getMeController,
         loginUserController, 
         logoutUserController, 
         registerUserController 
        } from '../controllers/auth.controller.js'
import { authUser } from '../middlewares/auth.middleware.js'

const authRouter = Router()

// POST /api/auth/register
authRouter.post('/register', registerUserController)

//POST /api/auth/login
authRouter.post('/login', loginUserController)

//POST /api/auth/logout
authRouter.post('/logout', logoutUserController)

// GET /api/auth/get-me
authRouter.get('/get-me', authUser, getMeController)


authRouter.get('/test', authUser, (req, res) => {



    res.status(200).json({
        message: "This is a test route",
        user: req.user.id,
    })
})

export {authRouter}