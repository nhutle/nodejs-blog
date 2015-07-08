var nodemailer = require('nodemailer'),
  hbs = require('nodemailer-express-handlebars'),
  path = require('path'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  transporter,
  mailOptions,
  tmpOptions,
  mailer = {};

transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: config.get('adminEmail')
});

// default template options
tmpOptions = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views'
  },
  viewPath: 'views',
  extName: '.hbs'
};

// if (process.env.NODE_ENV === 'testing') {
//   tmpOptions.viewEngine.layoutsDir = path.join(__dirname, '../views');
//   tmpOptions.viewPath = path.join(__dirname, '../views');
// }

// default mail options
mailOptions = {
  from: 'Online Blog <ts.acc.27.05.2015@gmail.com>',
  to: '',
  subject: 'Verify Account',
  template: 'email'
};

// using handlebar template
transporter.use('compile', hbs(tmpOptions));

mailer.sendMail = function(req, user, token, callback) {
  mailOptions.to = user.email;
  mailOptions.context = {
    fullname: user.fullname,
    email: user.email,
    verifyUrl: [req.protocol, '://', req.get('host'), '/#/users/login?token=', token].join('')
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err)
      return callback({
        message: 'A problem has been occurred during processing your data',
        status: 500
      });

    return callback && callback(null);
  });
};

module.exports = mailer;