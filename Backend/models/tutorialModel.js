import mongoose from 'mongoose';

const tutorialSchema = mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, unique: true },
    description: { type: String, default: '' },
    coverImage:  { type: String, default: '' },
    difficulty:  { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    videoUrl:    { type: String, default: '' },
    steps:       [{ title: String, description: String }],
    tags:        [{ type: String }],
    isActive:    { type: Boolean, default: true },
    postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Tutorial = mongoose.model('Tutorial', tutorialSchema);
export default Tutorial;
