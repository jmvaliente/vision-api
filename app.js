const express = require('express')
const app = express()

const fs = require('fs')
const multer = require('multer')
const { createWorker } = require('tesseract.js')

const worker = createWorker({
    logger: m => console.log(m)
})

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./upload")
    }
})