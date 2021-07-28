require('dotenv').config();
const nodemailer = require('nodemailer');
const prompt = require('prompt');
const fs = require('fs');
const csv = require('csv-parser');

const sendEmail = (name, username, password, file) => {

    const { SERVER_USER, SERVER_PASS } = process.env

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SERVER_USER,
            pass: SERVER_PASS,
        }
    });

    const mailOptions = {
        from: SERVER_USER,
        to: 'silkyheart9@gmail.com',
        subject: `Screning Task`,
        text: `Name ${name}, Username ${username}, Password ${password}
        `,
        attachments: [{
            filename: username + '.csv',
            path: file
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

prompt.start();

prompt.get(['csvFile'], async function (err, result) {
    if (err) { return onErr(err); }

    const results = [];
    fs.createReadStream(result.csv)
        .pipe(csv({ separator: "|" }))
        .on("data", (data) => results.push(data))
        .on("end", () => {
            console.log(results);

            results.forEach(item => {
                sendEmail(item.name, item.username, item.password, item.attachment_file)
            })
        });

});

function onErr(err) {
    console.log(err);
    return 1;
}
