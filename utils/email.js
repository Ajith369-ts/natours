const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        // Activate in gmail "less secure app" option
    });

    // define the email options
    const mailOptions = {
        from: "Ajith Kumar <hello@ajith.io>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // actually send the gmail
    await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
