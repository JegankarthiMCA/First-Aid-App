import express from 'express';
import authMiddleware from '../authMiddleware.js';
import Vehicle from '../Model/Vehicle.js';
import Route from '../Model/Route.js';
import User from '../Model/User.js';
import Doubt from '../Model/Doubt.js';

const router = express.Router();

// Add Vehicle
router.post('/vehicles', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error adding vehicle' });
  }
});

// Get all Vehicles (New Route)
router.get('/vehicles', authMiddleware, async (req, res) => {
  // if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {

    const vehicles = await Vehicle.find();

    res.status(200).json(vehicles);
  } catch (error) {
    console.log(err)
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
});

// Add Route
router.post('/routes', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: 'Error adding route' });
  }
});


router.get('/routes/vehicle/:vehicleId', authMiddleware, async (req, res) => {
  const { vehicleId } = req.params;

  try {
    console.log(vehicleId)
    // Find routes with the matching vehicle ID
    const routes = await Route.find({ vehicle: vehicleId }).populate('vehicle');

    if (!routes || routes.length === 0) {
      return res.status(404).json({ message: 'No Pain type found for this Organs' });
    }

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch routes', error: error.message });
  }
});



router.post('/doubt', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { doubt } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newDoubt = new Doubt({
      userId: user._id,
      name: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      doubt,
    });
    console.log(newDoubt)
    await newDoubt.save();
    res.status(201).json({ message: 'Doubt submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit doubt' });
  }
});
router.get('/doubts', authMiddleware, async (req, res) => {
  try {
    console.log("hai")
    const doubts = await Doubt.find()
    console.log(doubts)
    res.status(200).json(doubts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching doubts' });
  }
});
router.post('/register-student', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  try {
    console.log('====================================');
    console.log("register");
    console.log('====================================');
    const { username, password, vehicleId } = req.body;
    const student = new User({ username, password, role: 'user', assignedBus: vehicleId });
    await student.save();
    res.status(200).json(student);
  } catch (error) {
    console.log();

    res.status(500).json({ error: 'Error registering student' });
  }
});

export default router;
