import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    // Step 1: Event Details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Music', 'Business', 'Sports', 'Education', 'Other'], // optional restriction
    },
    startDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },

    // Step 2: Banner (multiple images)
    banners: [
      {
        url: { type: String, required: true }, // path or cloud URL
        publicId: { type: String }, // optional (if using Cloudinary or S3)
      },
    ],

    // Step 3: Ticketing
    isTicketed: {
      type: Boolean,
      default: true,
    },
    ticketName: {
      type: String,
      default: '',
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Meta info
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
