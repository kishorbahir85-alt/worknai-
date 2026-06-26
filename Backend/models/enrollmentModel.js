import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollmentType:{ type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
    paymentStatus: { type: String, enum: ['free', 'pending', 'paid'], default: 'pending' },
    amount:        { type: Number, default: 0 },
    paymentId:     { type: String, default: '' },
    accessCode:      { type: String, default: '' },
    transactionRef:  { type: String, default: '' },
    batchId:       { type: mongoose.Schema.Types.ObjectId, default: null },
    batchName:     { type: String, default: '' },
    studentDetails: {
      name:          { type: String, default: '' },
      email:         { type: String, default: '' },
      phone:         { type: String, default: '' },
      qualification: { type: String, default: '' },
      address:       { type: String, default: '' },
    },
    // For offline course applications — managed by HR/Manager
    applicationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'confirmed'],
      default: 'pending',
    },
    statusNote: { type: String, default: '' },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
