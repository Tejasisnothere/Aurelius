import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    age: {
      type: Number,
      min: 0,
      max: 120
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/
    },

    aadhaarNumber: {
      type: String,
      unique: true,
      match: /^\d{12}$/
    },

    address: {
      type: String,
      trim: true
    },

    country: {
      type: String,
      default: "India"
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },

    interactedWithEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
      }
    ],

    intent: {},
    amount: {},
    tags: {},
    fraud: {},
    date: {},
    remarks: {}
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
