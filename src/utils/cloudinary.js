import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Cloudinary with config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} - Upload result with secure URL
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'portfolio',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      ...options
    });

    // Clean up the temporary file
    try {
      await fs.promises.unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export default cloudinary;
