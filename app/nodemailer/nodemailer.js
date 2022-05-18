const nodemailer = require ('nodemailer');
// const UserModel = require('../Models/users')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // en donde voy a enviar el correo
    port: 587,
    secure: false,
    auth: {
        user: 'sydni.boyle8@ethereal.email', // adonde lo va a enviar
        pass: 'zPhzEKZvtnAsvEn5et'
    }
});

module.exports.sendRegisterEmail = (name, email) => {
    console.log("Check");
    transporter.sendMail({
      from: 'user',
      to: email,
      subject: "Registration completed successfully!",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Welcome to blablabla</p>
          </div>`,
    }).catch(err => console.log(err));
  };

// module.exports = { transporter }