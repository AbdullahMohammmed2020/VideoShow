const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const videoshow = require('videoshow')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/VideoShow', upload.fields([{
  name: 'images', maxCount: 4
}, {
  name: 'audio', maxCount: 1
}]), (req, res) => {


  var images = [
    './public/uploads/step1.jpg',
    './public/uploads/step2.jpg',
    './public/uploads/step3.jpg',
    './public/uploads/step4.jpg'
  ]

  var videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }

  videoshow(images, videoOptions)
    .audio('./public/uploads/song.mp3')
    .save('video.mp4')
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
    })


})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(PORT, () => {
  console.log(`App Is Listening To Port ${PORT}`)
})