
import mongoose from 'mongoose'
const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle
