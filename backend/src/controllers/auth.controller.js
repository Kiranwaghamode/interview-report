import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { blackListTokenModel } from "../models/blacklist.model.js";


async function registerUserController(req, res){

    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "please provide every details."
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account Already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )

    res.cookie("token", token)
    res.status(201).json({
        message: "user registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginUserController(req, res){


    
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }

        const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )
    
    res.cookie("token", token,{
    httpOnly: true,
    secure: true,          
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000      
    })
    res.status(200).json({
        message: "user logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function logoutUserController(req, res){
    const token = req.cookies.token;

    try {
        if(token){
            await blackListTokenModel.create({ token })
        }
    
        res.clearCookie("token")
    
        res.status(200).json({
            message: "user logged out successfully"
        })
    } catch (error) {
        console.log("Error while logout", error)
        res.status(500).json({
            message: "Error while Logout"
        })
        
    }
}

async function getMeController(req, res){
    
    const user = await userModel.findById(req.user.id)

    if(!user) return res.status(404).json({
        message: "user not found in get me controller"
    })

    res.status(200).json({
        message: "user details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}