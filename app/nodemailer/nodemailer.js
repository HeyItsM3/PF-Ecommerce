const nodemailer = require ('nodemailer');
// const UserModel = require('../Models/users')
const sendgridTransport = require ('nodemailer-sendgrid-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: process.env.API_KEY_SENDGRID
}));

const sendRegisterEmail = (name, email) => {
  transporter.sendMail({
    to: email,
    from: 'ecommerce.grupo07@gmail.com',
    subject: "Registration completed successfully!",
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Welcome to blablabla</p>`,
})}

module.exports = { sendRegisterEmail }