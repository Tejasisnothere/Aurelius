import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const userSchema = new mongoose.model(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: true,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      minlength: 6,
      maxlength: 10,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "viewer"],
      default: "admin",
    },

    companyName: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerificationToken: String,

    passwordResetToken: String,
    passwordResetExpires: Date,

    lastLogin: Date,
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

export default mongoose.model("User", userSchema);