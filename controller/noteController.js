const { Note } = require("../model/noteModel");
const { User } = require("../model/userModel");

const addNote = async (req, res) => {
  const { title, content } = req.body;
  const user = req.user.userId;
  let existingUser;
  let note;

  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!existingUser) {
    return res.status(400).json({ error: "Unable to find user" });
  }

  try {
    note = await Note.create({ title, content, user });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    note.save();
    existingUser.notes.push(note);
    existingUser.save();
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ message: "Note added successfully" });
};

// GET NOTES

const getNote = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate("notes");
    if (!user) {
      return res.status(500).json({ message: "No user found" });
    }
    const { notes } = user;
    return res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE NOTE

const deleteNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  let note;
  let user;

  try {
    note = await Note.findByIdAndRemove(noteId);
    user = await User.findById(userId).populate("notes");
    await user.notes.pull(note);
    await user.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!note) {
    return res.status(400).json({ message: "Unable to delete note" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

// SEARCH NOTE

const searchNote = async (req, res) => {
  const { searchTerm } = req.body;
  try {
    const user = await User.findById(req.user.userId).populate("notes");
    if (!user) {
      return res.status(500).json({ message: "No user found" });
    }
    const { notes } = user;
    const filteredNotes = notes.filter(note => note.title.match(new RegExp(searchTerm, 'i')));
    return res.status(200).json({ filteredNotes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

// UPDATE COLOR 

const changeColor = async (req, res) => {
  const bookId = req.params.id;
  const { color } = req.body; 
  try {
    const res = await Note.findByIdAndUpdate(bookId, {color: color});
  } catch (error) {
    return res.json({ message: error.message });
  }
}

module.exports = { addNote, getNote, deleteNote, searchNote, changeColor };
