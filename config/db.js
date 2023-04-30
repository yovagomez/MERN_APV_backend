/* 
Connect data base with the application
Mongoose is used to connect MongoDB with node.js
*/

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // process.env is used by nodejs to call an enviroment variable
        const db =  await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,        
            useUnifiedTopology: true,
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB is connected in: ${url}`);

    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1); // Show the error message
    }
};

export default connectDB;