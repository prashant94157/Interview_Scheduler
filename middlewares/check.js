const interview = require('../models/interviews');
const User = require('../models/user');

const check = async (req, res, next) => {
  // console.log(req.body.user);
  if (req.body.user.length < 2) {
    return res.status(404).send({ error: 'Must have atleast two users' });
  }
  const users = req.body.user;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const current_date = new Date().toLocaleDateString();
  const current_time = new Date().toLocaleTimeString('en-IN');

  if (startTime > endTime)
    return res
      .status(404)
      .send({ error: 'Start time must be before end time' });

  if (new Date(parseInt(startTime)).toLocaleDateString() < current_date) {
    console.log(new Date(parseInt(startTime)).toLocaleDateString());
    console.log(current_date);
    console.log(
      new Date(parseInt(startTime)).toLocaleDateString() < current_date
    );
    return res.status(404).send({ error: 'Time has already past' });
  }
  if (
    new Date(parseInt(startTime)).toLocaleDateString() == current_date &&
    new Date(parseInt(startTime)).toLocaleTimeString('en-IN') < current_time
  ) {
    console.log(new Date(parseInt(startTime)).toLocaleDateString());
    console.log(new Date(parseInt(startTime)).toLocaleTimeString('en-IN'));
    console.log(current_time, current_date);
    return res.status(404).send({ error: 'Time has already past' });
  }
  //checking selected users' availability for scheduled interview
  for (user of users) {
    const user_check = await User.findOne({ _id: user._id });
    for (item of user_check.interviews) {
      const Interview = await interview.findOne({ _id: item });
      if (!(Interview?.endTime <= startTime || Interview?.startTime >= endTime))
        return res.status(404).send({
          error: 'User ' + user_check.email + ' is not free in the given slot!',
        });
    }
  }
  next();
};

module.exports = check;
