import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import veterinarioRoutes from './routes/vetRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

// You get all the functionality that is required to create the server
const app = express();
// It's to recieve data in json format
app.use(express.json())

//  dotenv = used to read environment variables. With this line of code find the file named .env and get the results
dotenv.config();

connectDB();

// Domains allowed to consume the backend APIs
const domainsAllowed = [process.env.FRONTEND_URL];

// Check if the url that is making the request has access
const corsOptions = {
    origin: function(origin, callback) {
        if(domainsAllowed.indexOf(origin) !== -1) {
            // The request origin is allowed
            callback(null, true);
        } else {
            callback(new Error("Not allowed for CORS"));
        }
    },
};

// Prompt to the express that we need to use cors
app.use(cors(corsOptions))

/* 
use =  how express handle routing or pages 
req = it's what the user sends
res = it's the response from the server
 */
app.use("/api/vets", veterinarioRoutes);
app.use("/api/patients", patientRoutes);

// When we see the deployment we need the enviroment variable to exist
const PORT = process.env.PORT || 4000;

// Register the server in the port 4000, because the port 3000 is going to be used for the frontend
app.listen(PORT,  () => {
    console.log(`Server working on port ${PORT}`);
})