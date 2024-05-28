const nodemailer = require("nodemailer");
const { MAILER: config } = global.config;

const transporter = nodemailer.createTransport(config);

function verify() {
    transporter.verify((error, success) => {
        if (error) return console.error(`Failed to verify transporter: ${error}`);
        console.log("Transporter is ready to send emails");
    });
}

const queue = [];
let isSending = false;

function send(subject, message, to) {
    queue.push({ subject, message, to });
    if (!isSending) {
        isSending = true;
        sendNextMail();
    }
}

function sendNextMail() {
    const mail = queue.shift();
    if (!mail) {
        isSending = false;
        return;
    }
    const mailOptions = {
        from: process.env.mailer_user,
        to: mail.to,
        subject: mail.subject,
        text: mail.message,
        html: mail.message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error(`Failed to send email: ${error}`);
        sendNextMail();
    });
}

module.exports = { send, verify };
