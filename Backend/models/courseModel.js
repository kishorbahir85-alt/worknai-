import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name:       { type: String, default: '' },
  timing:     { type: String, default: '' },
  days:       { type: String, default: '' },
  startDate:  { type: String, default: '' },
  totalSeats: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
}, { _id: true });

const courseSchema = mongoose.Schema(
  {
    title:            { type: String, required: true },
    slug:             { type: String, unique: true },
    shortDescription: { type: String, default: '' },
    description:      { type: String, default: '' },
    icon:             { type: String, default: '📚' },
    category:         { type: String, default: '' },
    duration:         { type: String, default: '' },
    startDate:        { type: String, default: '' },
    price:            { type: Number, default: 0 },
    discountPrice:    { type: Number, default: 0 },
    level:            { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    mode:             { type: String, enum: ['online', 'offline', 'hybrid'], default: 'offline' },
    videoUrl:         { type: String, default: '' },
    isActive:         { type: Boolean, default: true },
    featured:         { type: Boolean, default: false },
    batches:          { type: [batchSchema], default: [] },
    postedBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
