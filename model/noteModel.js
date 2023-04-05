const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: { type: "string", required: true },
  content: { type: "string", required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User'},
  color: { type: "string", default: "bg-slate-100"}
}, {
  timestamps: true
});

const Note = mongoose.model("Note", noteSchema, "notes");

module.exports = { Note };
