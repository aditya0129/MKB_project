const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  post: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify the connection configuration
//await transporter.verify();

const sendMail = async (email, subject, content) => {
  try {
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content,
    };

    // Send email
    // const info = await transporter.sendMail(mailOptions);
    // console.log("Mail sent:", info.messageId);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("mail send", info.messageId);
    });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.massage });
    console.log(error.message);
  }
};

module.exports = {
  sendMail,
};


// const nodemailer = require('nodemailer');

// const sendmail = async (req, res) => {
//   try {
//     // Initialize the transporter object
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT, 10),
//       secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
//       auth: {
//         user: process.env.SMTP_MAIL,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     // Verify the connection configuration
//     await transporter.verify();

//     // Define mail options
//     const mailOptions = {
//       from: process.env.SMTP_MAIL,
//       to: req.body.email,
//       subject: req.body.subject,
//       html: req.body.content,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Mail sent:', info.messageId);
    
//     return res.status(200).json({ status: true, msg: 'Email sent successfully', messageId: info.messageId });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return res.status(500).json({ status: false, msg: error.message });
//   }
// };

// module.exports = sendmail;
