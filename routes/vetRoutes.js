import express from "express";
import {register, profile, confirm, authenticate, forgottenPassword, checkToken, newPassword, updateProfile, updatePassword} from '../controllers/vetController.js';
import checkAuth from "../middleware/authMiddleware.js";

// Express allows access to the Router
const router = express.Router();

// URLs and its request (get, post, put, delete)
// Public area
router.post('/', register);
router.get("/confirm/:token", confirm) // Confirm account and :token is a dynamic parameter
router.post("/login", authenticate) 
router.post('/forget-password', forgottenPassword)
router.route('/forget-password/:token').get(checkToken).post(newPassword)

// Private area
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile)
router.put('/update-password', checkAuth, updatePassword)

export default router;