const mongoose = require("mongoose");
const argon2 = require("argon2");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must have a name"],
    },
    email: {
      type: String,
      required: [true, "You must have an email"],
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    avatarPublicID: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
      required: [true, "you must have a password"],
      minlength: 8,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

// ecrypt the password before being saved in the data base using 2 module (crypto+argon2)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = crypto.randomBytes(32);
  this.password = await argon2.hash(this.password, { salt });
  this.passwordConfirm = undefined;
});
// assign current time to the password changed at property when the password changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.matchPassword = async function (
  actualPassword,
  candidatePassword
) {
  return await argon2.verify(actualPassword, candidatePassword);
};

module.exports = mongoose.model("User", userSchema);
