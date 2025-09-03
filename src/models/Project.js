import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  mainTech: String,
  technologies: [String],
  fullDescription: String,
  imageUrl: String,
  demoLink: String,
  githubLink: String,
  features: [String],
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);