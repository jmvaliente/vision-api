const express = require('express')
const app = express()

const fs = require('fs')
const multer = require('multer')
const { createWorker } = require('tesseract.js')
const PORT = 5000 || process.env.PORT

const worker = createWorker({
    logger: m => console.log(m)
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./upload")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).single('image')

app.set('view engine', "ejs")

app.get("/", (req, res, next) => {
    res.render('index')
})

app.post("/upload", (req, res, next) => {
    upload(req, res, next => {
        fs.readFile(`./upload/${req.file.originalname}`, (err, data) => {
            if (err) return console.log(err)
            console.log(data)
            const trasnsform = async function () {
                await worker.load();
                await worker.loadLanguage('spa');
                await worker.initialize('spa');
                const { data: { text } } = await worker.recognize(`./upload/${req.file.originalname}`);
                console.log(text);
                await worker.terminate();
            }()

            trasnsform.then(el => console.log(el))

        })
    })
})

app.listen(PORT, () => { console.log(`Server Running in port: ${PORT}`) })