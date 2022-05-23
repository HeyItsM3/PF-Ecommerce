const nodemailer = require ('nodemailer');
const sendgridTransport = require ('nodemailer-sendgrid-transport');
// require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: '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'
    }
}));

const sendRegisterEmail = (name, email) => {
  transporter.sendMail({
    to: email,
    from: 'ecommerce.grupo07@gmail.com',
    subject: "Registration completed successfully!",
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Welcome to our marketplace!</p>`,
})}

module.exports = { sendRegisterEmail }