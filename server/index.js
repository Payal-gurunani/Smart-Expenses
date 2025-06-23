import { app } from './app.js';
import connectDb from './components/db/index.db.js';
import dotenv from 'dotenv';
const port =`${process.env.PORT}`

dotenv.config();
connectDb().then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log("App listen you on",port);})

    app.on('error',(error)=>{
        console.log(`server error${error}`);
        throw error;
    })
})
.catch((error)=>{
    console.log("Connection failed",error);
    
})