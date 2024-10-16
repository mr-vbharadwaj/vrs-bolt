import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this resource.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of resource.'],
  },
  downloads: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);