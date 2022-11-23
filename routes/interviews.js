const express = require('express');
const router = express.Router();
const interview = require('../models/interviews');
// const mailSend = require('../utilities/mailsend');
const User = require('../models/user.js');
const check = require('../middlewares/check');
const checkUpdates = require('../middlewares/checkUpdate');
const checkObjectId = require('../middlewares/checkObjectId');

// @route    POST interviews/create
// @desc     Create an interview
// @access   Public
router.post('/create', check, async (req, res) => {
  try {
    email = [];
    req.body.user.forEach((users) => {
      email.push(users.email);
    });

    const newInterview = new interview({
      email: email,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    await newInterview.save();

    req.body.user.forEach(async (users) => {
      const USER = await User.findById(users._id);
      // mailSend.sendNotificationMail(
      //   users.email,
      //   users.name,
      //   req.body.startTime,
      //   req.body.endTime
      // );
      USER.interviews.push(newInterview._id);
      await USER.save();
    });

    res.send('Interview successfully created');
  } catch (e) {
    res.status(404).send(e);
  }
});

// @route    GET interviews/read/:d
// @desc     Get specific interview using id
// @access   Public
router.get('/read/:id', checkObjectId('id'), async (req, res) => {
  try {
    const interviewRead = await interview.findById(req.params.id);

    if (!interviewRead) {
      return res.status(404).json({ msg: 'Interview details not found !!!' });
    }
    res.json(interviewRead);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ msg: 'Server Error' });
  }
});

// @route    GET interviews/read
// @desc     Get all interviews
// @access   Public
router.get('/read', async (req, res) => {
  try {
    const interviews = await interview.find().sort({ date: -1 });
    res.send(interviews);
  } catch (e) {
    res.status(404).send();
  }
});

// @route    PATCH interviews/update
// @desc     Update an interview
// @access   Public
router.patch('/update', checkUpdates, async (req, res) => {
  try {
    const currInterview = await interview.findById(req.body.interviewId);
    email = [];
    //sending updateMail to the users in the updated interview
    req.body.user.forEach((newUser) => {
      email.push(newUser.email);
    });

    //updating the given interview's data
    await interview.findByIdAndUpdate(req.body.interviewId, {
      email,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });
    const Interview = await interview.findById(req.body.interviewId);

    //updating interviews's list of newly added users
    req.body.user.forEach(async (users) => {
      const USER = await User.findById(users._id);
      if (!USER.interviews.includes(req.body.interviewId)) {
        await USER.interviews.push(req.body.interviewId);
        await USER.save();
      }
      // mailSend.sendUpdateMail(
      //   USER.email,
      //   USER.name,
      //   req.body.startTime,
      //   req.body.endTime
      // );
    });
    const oldUsersEmail = currInterview.email.filter(
      (emails) => !Interview.email.includes(emails)
    );

    oldUsersEmail.forEach(async (oldEmail) => {
      const oldUser = await User.findOne({ email: oldEmail });
      const index = oldUser.interviews.indexOf(req.body.interviewId);
      if (index > -1) {
        oldUser.interviews.splice(index, 1);
      }
      await oldUser.save();
    });
    res.send('Interview updated Successfully!');
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
