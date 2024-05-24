import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();//creating an express application

app.use(cors({
    origin: process.env.CORS_ORIGIN,// Allows you to specify which origins can access your server. 
    credentials:true//This option allows cookies to be included in cross-origin requests. It is necessary when the client and server need to share cookies.
}))
 
app.use(express.json({limit:"16kb;"}))
app.use(express.urlencoded)
app.use(express.static("public"))
app.use(cookieParser())


export { app }


