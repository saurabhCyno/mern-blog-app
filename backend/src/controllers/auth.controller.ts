import {type Request, type Response } from "express"
import * as z from "zod"
import User from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt, { type SignOptions } from "jsonwebtoken"

const registerSchema = z.object({
    name : z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must have atleast 6 characters')
})

const loginSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be atleast 6 characters long')
})

const register = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = registerSchema.parse(req.body)
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({success: false, message: 'User already exists!'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({name, email, password : hashedPassword})

        const JWT_SECRET = process.env.JWT_SECRET
        const JWT_EXPIRE = process.env.JWT_EXPIRE as SignOptions["expiresIn"]
        if(!JWT_EXPIRE || !JWT_SECRET){
            throw new Error('JWT env variables are missing')
        }

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRE})

        return res.status(200).json({
            success: true,
            message:'User registered successfully',
            token,
            user : {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error: any) {
        if(error instanceof z.ZodError){
            return res.status(400).json({
                success: false, 
                error: JSON.parse(error.message)
            })
        }
        return res.status(500).json({success: false,message : 'Server error', error: error.message})
    }
}


const login = async (req : Request, res: Response) => {
    try {
        const {email, password} = loginSchema.parse(req.body)

        const user = await User.findOne({email}).select('+password')
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({success: false, message: 'Invalid credentials'})
        }

        const JWT_SECRET = process.env.JWT_SECRET
        const JWT_EXPIRE = process.env.JWT_EXPIRE as SignOptions["expiresIn"]
        if(!JWT_EXPIRE || !JWT_SECRET){
            throw new Error('JWT env variables are missing')
        }

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRE})

        return res.status(200).json({
            success: true,
            message:'User logged in successfully',
            token,
            user : {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error: any) {
        if(error instanceof z.ZodError){
            return res.status(400).json({success: false, error: JSON.parse(error.message)})
        }
        return res.status(500).json({success: false, message: 'Server error', error : error.message})
    }
}


export {register, login}