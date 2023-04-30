import Vet from "../models/Vet.js"
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";
import emailRegister from '../helpers/emailRegister.js';
import emailForgetPassword from "../helpers/emailForgetPassword.js"

// It register a new vet 
const register =  async (req, res) => {
    // body is to read values of the form
    const { email, name } = req.body;

    // Avoid duplicate users
    const userExists = await Vet.findOne({email : email});
    if(userExists) {
        const error = new Error("User already registered");
        return res.status(400).json({msg: error.message});
    }
    try {
        // Save new vet 

        //Create an Vet instance
        const vet = new Vet(req.body);
        const vetSaved = await vet.save();

        // Send email
        emailRegister({
            email,
            name,
            token: vetSaved.token
        });

        res.json(vetSaved);
    } catch (error) {
        console.log(error)
    }
}

const profile = (req, res) => {
    const { vet } = req;
    res.json(vet);
}

// Verify that the user token is correct 
const confirm = async (req, res) => {
    // params is to read parameters of the URL
    const { token } = req.params;

    const confirmUser =  await Vet.findOne({token});
    if(!confirmUser) {
        const error = new Error("Invalid token");
        return res.status(404).json({msg: error.message});
    }
    try {
        confirmUser.token = null;
        confirmUser.confirmed = true;
        await confirmUser.save();

        res.json({msg: "User confirmed successfull"});
    } catch (error) {
        console.log(error);
    }
    console.log(confirmUser);
}

// It authenticate a user when you want to access
const authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Vet.findOne({email});
    if(!user) {
        const error = new Error("The user doesn't exist");
        return res.status(404).json({msg: error.message});
    }

    // Check if the user is confirmed
    if(!user.confirmed) {
        const error = new Error("Your account has not been confirmed");
        return res.status(404).json({msg: error.message});
    }

    // Check the password 
    if(await user.checkPassword(password)) {
        // Authenticate user 
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error("Password incorrect");
        return res.status(404).json({msg: error.message});
    }
}

// Recover password
 const forgottenPassword = async (req, res) => {
    const { email } = req.body;

    // Validate if the email exists
    const existsVet = await Vet.findOne({ email });
    if(!existsVet) {
        const error = new Error("The user doesn't exist");
        return res.status(400).json({msg: error.message});
    }

    try {
        // If the user exists we generate an id 
        existsVet.token = generateId();
        await existsVet.save();

        // Send email with instructions
        emailForgetPassword({
            email,
            name: existsVet.name,
            token: existsVet.token,
        });

        res.json({msg: 'We have sent an email with instructions'});
    } catch (error) {
        console.log(error);
    }
 };

 // Check if the token exists
 const checkToken = async (req, res) => {
    const { token } = req.params;

    const validToken = await Vet.findOne({ token });
    if(validToken) {
        // The token is valid, the user exists
        res.json({ msg: "Valid token and the user exists"});
    } else {
        const error = new Error("Invalid token");
        return res.status(400).json({msg: error.message});
    }
 };

 const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } =  req.body;

    const vet = await Vet.findOne({ token });
    if(!vet) {
        const error = new Error("There was an error");
        return res.status(400).json({msg: error.message});
    }

    try {
        vet.token = null;
        vet.password = password;
        await vet.save();
        res.json({msg: "Password modified successfully"})
    } catch (error) {
        console.log(error);
    }
 };

 const updateProfile = async (req, res) => {
    // Check if the user exist and then modified it 
    const vet = await Vet.findById(req.params.id)
    if(!vet) {
        const error =  new Error("There was an error");
        return res.status(400).json({msg: error.message});
    }

    // Check if the new email exists
    const { email } = req.body;
    if(vet.email !== req.body.email) {
        const emailExists =  await Vet.findOne({email});
        if(emailExists) {
            const error =  new Error("This email already exists");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        // Swap database values for updated values
        vet.name = req.body.name;
        vet.email = req.body.email;
        vet.web = req.body.web;
        vet.phone = req.body.phone;

        const vetUpdated = await vet.save();
        res.json(vetUpdated);
    } catch (error) {
        console.log(error)
    }
 };

 const updatePassword = async (req, res) => {
    // Read data
    const { id } = req.vet;
    const { pwd_current, pwd_new } = req.body;

    // Check that the vet exists
    const vet = await Vet.findById(id); // The Vet instance is brought
    if(!vet) {
        const error = new Error("There was an error");
        return res.status(400).json({msg: error.message});
    }

    // Check the password
    if(await vet.checkPassword(pwd_current)){
        // Save new password 
        vet.password = pwd_new;
        await vet.save();
        res.json({ msg: "Password saved successufully"})
    } else {
        const error =  new Error("The currect password is incorrect");
            return res.status(400).json({msg: error.message});
    }

    // Save the new password
 }

export {
    register,
    profile,
    confirm,
    authenticate,
    forgottenPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
}