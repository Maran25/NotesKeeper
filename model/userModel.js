const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: "string", unique: true, required: true },
  email: { type: "string", unique: true, required: true },
  password: { type: "string", required: true },
  notes: [{ type: mongoose.Types.ObjectId, ref: 'Note' }],
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = { User };
