
import mongoose from 'mongoose'
const routeSchema = new mongoose.Schema({
  username:{ type: String, required: false },
  routeName: { type: String, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  stops: [{ stopName: String, timing: String }],
});

const Route = mongoose.model('Route', routeSchema);
export default Route
