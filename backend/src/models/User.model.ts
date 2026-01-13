import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?:string;
    createdAt: Date;
    UpdatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name : {
        type: String,
        required : [true, 'Name is required'],
        trim: true,
        minLength: 2
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
    },
    password : {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // this will never return the this field in queries
    },
    avatar: {
        type: String,
        default: 'Default avatar URL' // change to user default image
    }
}, {timestamps: true})

const User: Model<IUser> = mongoose.model('User', userSchema)

export default User;