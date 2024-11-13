import express from 'express'

import authMiddleware from '../authMiddleware.js'
import Route from '../Model/Route.js'
import User from '../Model/User.js'
const router = express.Router();


router.get('/my-route', authMiddleware, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).send('Forbidden');
  try {
    const student = await User.findById(req.user.id).populate('assignedBus');
    const route = await Route.findOne({ vehicle: student.assignedBus._id }).populate('vehicle');

    route.username = student.username
    console.log(route)
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching route' });
  }
});


export default router
