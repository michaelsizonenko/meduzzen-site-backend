const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const formidable = require('express-formidable');

const app = express()
require('dotenv').config()
app.use(bodyParser.json())
app.use(formidable());
app.use(bodyParser.urlencoded({extended: true}))

app.use(function (req, res, next) {

    var origins = ['http://127.0.0.1', 'http://localhost'];

    for (var i = 0; i < origins.length; i++) {
        var origin = origins[i];

        if (req.headers.origin.indexOf(origin) > -1) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})


const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        //err && console.log(err)
        //console.log(info)
    })
}

app.post('/email', (req, resp) => {

    const fields = req.fields;
    const files = req.files;

    const message = {
        from: process.env.SENDER,
        to: process.env.RECIPIENTS,
        html: `<h1>Letter from meduzzen!</h1>
                <p> name: ${fields.name}</p>
                <p> project type: ${fields.type} </p>
                <p> number: ${fields.number}</p>
                <p>email: ${fields.email}</p>
                <p> about project: ${fields.about}</p>`,
        subject: `New order from meduzzen`,
        attachments: [{filename: files.image.name, path: files.image.path}]
    }
    mailer(message)
    resp.status(200).json(req.body.text)
})

app.listen(5000, () => {
    console.log('port started')
})
