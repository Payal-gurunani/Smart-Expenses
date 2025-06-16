import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //     monthlyBudget: {
    //   type: Number,
    //   default: 0,
    // },
    categoryBudgets: {
        type: Map,
        of: Number,
        default: {},
    },


}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.matchPassword = async function (enterddPass) {
    return await bcrypt.compare(enterddPass, this.password)
}

export const User = mongoose.model("User", userSchema)