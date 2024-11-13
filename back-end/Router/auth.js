import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../Model/User.js'
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

// Register admin or student
router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber, email } = req.body;
    const user = new User({ username, password, phoneNumber, email }); // Ensure your User model supports gmail
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    console.log("dhhdshd")
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentialssss' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ token, role: user.role });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error logging in' });
  }
});


router.get('/user', authMiddleware, async (req, res) => {
  try {
    // Assuming the user ID is stored in the token
    const userId = req.user.id; // Extract the user ID from the request object
    
    const user = await User.findById(userId); // Find user by ID
     console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, omit the password from the response
    const { password, ...userData } = user.toObject(); // Convert Mongoose document to plain object and omit password
    res.status(200).json(userData); // Return user data without password
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});


export default router


