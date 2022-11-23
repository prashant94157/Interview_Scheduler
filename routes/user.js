const express = require('express');
const User = require('../models/user.js');
const router = express.Router();

// @route    GET users/read
// @desc     Get all users
// @access   Public
router.get('/read', async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    //console.log(users);
    res.send(users);
  } catch (e) {
    res.status(404).send(e);
  }
});

// @route    POST users/create
// @desc     Create an user
// @access   Public
router.post('/create', async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    user = new User({
      name,
      email,
      interviews: [],
    });
    await user.save();
    res.json({ msg: 'User account successfully' });
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
