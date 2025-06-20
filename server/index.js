import { app } from './app.js';
import connectDb from './components/db/index.db.js';
import dotenv from 'dotenv';

dotenv.config();
connectDb().then(()=>{
    app.listen(5000 , ()=>{
        console.log("App listen you");})

    app.on('error',(error)=>{
        console.log(`server error${error}`);
        throw error;
    })
})
.catch((error)=>{
    console.log("Connection failed",error);
    
})