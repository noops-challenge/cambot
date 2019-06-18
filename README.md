![Meet Cambot](https://user-images.githubusercontent.com/212941/59636422-5ac2ea00-9108-11e9-85e0-2bb7482b99f5.png)

# 👋 Meet Cambot

Cameras, microphones, and more—your device is alive with sensors. Let's see what you can do.

This Noop is a little different from the others: there's no API!

Accessing devices can be a little intimidating, but modern browsers have made it easy. Read the documentation below for tips on how to get started, and then use the other Noop APIs to enliven the data with random colors, polygons, or sounds to create something awesome.

Share what you make with us on Twitter (#noopschallenge) or on the GitHub Community page for this challenge [here](https://github.community/t5/Events/Noops-Week-Two-Cambot-discussion/td-p/25745).

## 📹 What can you do?

On modern browsers, it is (relatively) simple to access the user's sensors. [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) is the workhorse you'll need to learn how to work with.

`getUserMedia` takes a `constraints` object where you ask for what you need. If you want access to both audio and video, pass this object:

```javascript
{ audio: true, video: true }
```

You can specify a [lot more details](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) like pixel size, which camera, audio sample rate, and more.

`getUserMedia()` is a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) because access to user media requires the user to give permission, which halts operation until the user acts.

This means your code will need to request access and then asynchronously gain access to the media stream. Here's a standard implementation:

```javascript
let constraints = { audio: true, video: true };

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    /* do something amazing with the stream */
  })
  .catch(function(err) {
    /*
      handle what happens if user doesn't
      grant permission or there's another error.
    */
  });
```

If you haven't used promises before, the TLDR is that the code in the promises (in this case, the `then` and `catch`) will happen "later" while the the rest of your code executes. "later" happens when the promise resolves.

When your promise resolves, you can access your video `stream`. The first thing to do is to show the video:

```javascript
const video = document.querySelector('video');
const constraints = { audio: true, video: true };

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  }).catch(function(err) {
    //handle error
  });
```

This will set the `stream` as the source of your `video` tag on screen. You can style your `video` tag however you like—it's part of your HTML.

🎩 Congratulations! You've now accessed your video camera and put the image on a webpage.

But we're just getting started, because your `video` tag is also accessible to JavaScript. You can capture those pixels and draw them to a `canvas`—manipulating the pixels along the way.

Using the `video` as a source, you can use the `canvas` API's `drawImage()` to render the pixels.

```javascript
let canvas = document.querySelector('canvas');
let ctx    = canvas.getContext('2d');
let video  = document.querySelector('video');

navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
    kickoff()
  }).catch(function(err) {
    console.error("Shoot, we need to access your camera to make this demo work.")
});

function kickoff() {
  let video  = document.querySelector('video');
  let canvas = document.querySelector('canvas');
  let ctx    = canvas.getContext('2d');

  function drawVideo() {
    ctx.drawImage(video, 0, 0, 800, 450);
    var frameData = ctx.getImageData(0, 0, 800, 450);
    ctx.putImageData(frameData, 0, 0);
    requestAnimationFrame(drawVideo);
  }

  //kickoff
  requestAnimationFrame(drawVideo);
}
```
Now that we're drawing the pixels to canvas as data, we can manipulate them. Let's invert the colors.

Add a call to `invertColors(frameData)` to the above, before `putImageData`:


```javascript
function invertColors(data) {
  let dataLength = data.length;
  for (var i = 0; i < dataLength; i+= 4) {
    //invert RGB
    data[i] = data[i] ^ 255;
    data[i+1] = data[i+1] ^ 255;
    data[i+2] = data[i+2] ^ 255;
  }
}}
```

🌈 Huzzah! We're manipulating video data in a `canvas`, and now we can pull in elements from the other Noops (like [Hexbot](https://noopschallenge.com/challenges/hexbot)) to spice up our video.

[See it in action](https://noops-challenge.github.io/cambot/starters/)

**🔒 Note about security**: you can't access `getUserMedia` from a local file (meaning you can't just drag the HTML file into your browser). You need to serve the file with `https://`. But don't worry, that's easy! You can use [http-server](https://github.com/indexzero/http-server) to quickly serve a file on your local computer, and you can use [GitHub Pages](https://pages.github.com/) to easily share your creation with the world.

## 🎥 Camera

Almost every device has a camera, and it's easy to access it with your web browser.

Libraries to help you get started:

- [p5js](https://github.com/processing/p5.js): is an expressive framework for working with media and JavaScript, and has a library dedicated to working with browser media: [p5.dom](https://p5js.org/reference/#/libraries/p5.dom)

- [react-webcam](https://github.com/mozmorris/react-webcam): A popular and well-supported library for accessing the webcam in React. Accessing the webcam is as simple as adding a tag to your React app, and comes with a built-in method to make a screenshot.

- [three.js](https://github.com/mrdoob/three.js): Three.js is a popular 3D software that has ready made webcam code ([example ](https://threejs.org/examples/webgl_materials_video_webcam.html) and [code](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_video_webcam.html)).


## 🎤 Microphone

Audio data is a little more subtle than the camera to work with, but you can do fun things visualizing the [soundwaves](http://mattdesl.github.io/codevember/13.html) or use the microphone as a [game controller](https://www.youtube.com/watch?v=u7Mk75m8-Ic).

Libraries to help you get started:

- [p5js](https://github.com/processing/p5.js): not only does it support video, it has a library dedicated to working with sound: [p5.sound](https://p5js.org/reference/#/libraries/p5.sound)

- [pizzicato](https://github.com/alemangui/pizzicato): play and manipulate sounds using the Web Audio API.

- [waveform-data.js](https://github.com/bbc/waveform-data.js): from the BBC, a library to give you representations of audio waveforms that you can zoom, browse, and manipulate.

Need some inspiration? Check out this great [list of Audio Visualization examples and tools](https://github.com/willianjusten/awesome-audio-visualization) from [@williamjusten](https://github.com/willianjusten).


## ❓ Other sensors

While most laptops only have microphones and cameras, phones and tablets have a wealth of sensors you can access—like the accelerometer, gyroscope, GPS, and even light sensor. Support is spotty across devices—but we'd love to see what you come up with!

## ✨ A few ideas

There are millions of things you can do with Cambot and your device sensors, but here are a few ideas to get you started:

- **Glitch**: Make a glitchy view of your webcam.
- **ASCII-fy everything**: Name one thing that isn't made better by ASCII art. Try this [asciify](https://github.com/ajay-gandhi/asciify-image) library to render your webcam in text art.
- **Accelerometer**: Use your phone's accelerometer combined with the Mazebot to solve mazes by rolling a "ball" through them.

More about Cambot on the challenge page at [noopschallenge.com](https://noopschallenge.com/challenges/cambot)
