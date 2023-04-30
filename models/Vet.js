import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import generateId from '../helpers/generateId.js'

const vetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generateId(),
    },
    confirmed: {
        type: Boolean,
        default: false,
    }
});

// Before storing the register, the password is encrypted
vetSchema.pre('save', async function(next) {
    //If the password is already modified or hash, must to continue to the next middleware
    if(!this.isModified("password")) {
        next();
    }
    //genSalt is a series of hashing rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// This function is to compare the form password with the db password
// methods is to register new functions in vetSchema
vetSchema.methods.checkPassword = async function (formPassword) {
    return await bcrypt.compare(formPassword, this.password);
} 


// The schema es registered in the mongoose, then exported to manipulate the data 
const Vet = mongoose.model("Vet", vetSchema);
export default Vet;