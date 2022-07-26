const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const formidable = require('express-formidable');
const cors = require('cors')

const app = express()
require('dotenv').config()
app.use(bodyParser.json())
app.use(formidable());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})

app.post('/email', (req, resp) => {
    const fields = req.fields;
    const files = req.files;

    const message = {
        from: process.env.SENDER,
        to: process.env.RECIPIENTS,
        html: `<h1>Letter from meduzzen!</h1>
                <p> Name: ${fields.name}</p>
                <p> Email: ${fields.email}</p>`,
        subject: `New order from meduzzen`,
        attachments: [{filename: files.image?.name, path: files.image?.path}]
    }

    transporter.sendMail(message)

    resp.status(200).json(req.body.text)
})

app.get('/hello', function(req, res) {
    res.send('hello world');
})

app.listen(5000, () => {
    console.log('port started')
})
