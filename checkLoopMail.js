const checkLoop = require('./checkLoop.js');
const nodemailer = require("nodemailer");
const config = require('./CONFIG.js');

async function mailResult(resultText)
{
    // Mail Result
    console.log("Sending Mail");

    let transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: config.mailPort,
        secure: config.mailSecure, // true for 465, false for other ports
        auth: {
          user: config.mailUser,
          pass: config.mailPass,
        },
    });

    let info = await transporter.sendMail({
        from: config.mailFrom, // sender address
        to: config.mailTo, // list of receivers
        subject: config.mailSubject, // Subject line
        text: resultText, // plain text body
        html: resultText, // html body
    });
}

function checkLoopWithMail()
{
    return checkLoop.Start(mailResult);
}

checkLoopWithMail();

exports.Start = checkLoopWithMail;