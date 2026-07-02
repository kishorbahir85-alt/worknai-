import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false, default: null },
    source: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
    applicantName: { type: String, default: '' },
    applicantEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    experience: { type: String, default: '' },
    currentRole: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    coverLetterUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    interview: {
      date: { type: String, default: '' },
      time: { type: String, default: '' },
      note: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

applicationSchema.index(
  { user: 1, job: 1 },
  { unique: true, partialFilterExpression: { user: { $type: 'objectId' }, job: { $type: 'objectId' } } }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
