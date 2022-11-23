require('dotenv').config();
const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.YOUR_DOMAIN_NAME;

const mailgun = require('mailgun-js');

const sendNotificationMail = function (email, name, startTime, endTime) {
  const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });
  const data = {
    from: 'Prashant Maurya <0166621m@gmail.com>',
    to: email,
    subject: 'Notification regarding Scaler Interview',
    html: `Hello ${name}! This is to inform you that an interview is scheduled from the scaler academy at ${new Date(
      parseInt(startTime)
    ).toLocaleTimeString('en-IN')} - ${new Date(
      parseInt(endTime)
    ).toLocaleTimeString('en-IN')} on ${new Date(
      parseInt(startTime)
    ).toDateString('en-IN')}.`,
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }
  });
};

const sendUpdateMail = function (email, name, startTime, endTime) {
  const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });
  const data = {
    from: 'Prashant Maurya <0166621m@gmail.com>',
    to: email,
    subject: 'Notification regarding Scaler Interview',
    html: `Hello ${name}! This is to inform you that an interview is scheduled from the scaler academy at ${new Date(
      parseInt(startTime)
    ).toLocaleTimeString('en-IN')} - ${new Date(
      parseInt(endTime)
    ).toLocaleTimeString('en-IN')} on ${new Date(
      parseInt(startTime)
    ).toDateString('en-IN')}.`,
  };
  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }
  });
};

module.exports = {
  sendNotificationMail,
  sendUpdateMail,
};
