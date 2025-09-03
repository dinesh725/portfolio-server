import mongoose from 'mongoose';

const CVSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true });

export default mongoose.model('CV', CVSchema);
