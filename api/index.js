// This file handles Vercel serverless function requests
import app from '../src/index.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
    const UPLOAD_DIR = path.join(__dirname,"..", 'uploads');
    console.log("Serving uploads from:", path.join(__dirname, '..', 'uploads'));
    app.use('/uploads', express.static(UPLOAD_DIR));
    console.log(`Serving static files from: ${UPLOAD_DIR}`);
  }


// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
// Initialize connection
connectDB().catch(console.error);

// Export the Express app as a serverless function
export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-cv-password, x-project-password'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure MongoDB is connected before handling the request
  try {
    if (mongoose.connection.readyState < 1) {
      await connectDB();
    }
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
