import mongoose from 'mongoose';

const blogSchema = mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, unique: true },
    excerpt:     { type: String, default: '' },
    content:     { type: String, default: '' },
    coverImage:  { type: String, default: '' },
    category:    { type: String, default: '' },
    tags:        [{ type: String }],
    isActive:    { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
