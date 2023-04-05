const express = require('express');
const { addNote, getNote, deleteNote, searchNote, changeColor } = require('../controller/noteController');
const router = express.Router();

router.post('/add', addNote);
router.get('/list', getNote);
router.post('/search', searchNote);
router.delete('/:id', deleteNote);
router.put('/:id', changeColor);

module.exports = router;