import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    empId: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    mobile: {
      type: String,
      required: true
    },

    station: {
      type: String
    },

    password: {
        type: String,
        required: true
    },

    callsAnswered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);