import mongoose,{Schema} from "mongoose";

const expenseSchema = new Schema({
    userId :{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min: [0, 'Amount must be positive'],
    },
    category:{
        type:String,
        required:true,
        enum: ['Food', 'Rent', 'Travel', 'Shopping', 'Bills','Other'],

    },
    date:{
        type:Date,
        required:true,
        default: Date.now,
    },
    notes:{
        type:String,
    },
    imageUrl:{
        type:String,
    }
},{
    timestamps:true
})

export const Expense = mongoose.model("Expense",expenseSchema)