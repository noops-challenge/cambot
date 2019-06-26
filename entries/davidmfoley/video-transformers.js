
// like the name says
function psychrainbow(width, height) {
  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {

      const x = (i >>2) % width;
      const y = Math.floor((i >>2) / width);
      const redShift = Math.abs(((time/4 + x) % 512) - 256);
      const greenShift = Math.abs((y - time/4) % 512 - 256);


      data[i] = (data[i] + redShift) & 255
      data[i+1] = (data[i+1] + greenShift) & 255;
    }
  };
}

// a funny accident when messing around with color channels
function toomuch(width, height) {
  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {
      const x = i % width;
      const y = Math.floor(i / width);
      const redShift = Math.abs(((time + x) % 512) - 256);
      const greenShift = Math.abs((time+ y) % 512 - 256);

      data[i] = (data[i] + redShift) & 255
      data[i+1] = (data[i+1] + greenShift) & 255;
      data[i+2] = (data[i+2] + (redShift + greenShift ^ 183)) & 255;
    }
  }
}

// track differences from the previous frames
// changed pixels show up white, unchanged black
function changes(width, height) {
  let runningAverage = Array(width * height).fill(384);

  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {

      let colorSum = data[i] + data[i+1] + data[i+2];

      const diff = Math.min(colorSum - runningAverage[i>>2], 256);

      data[i] = diff;
      data[i+1] = diff;
      data[i+2] = diff;

      // this is the magic. 
      runningAverage[i>>2] = (colorSum * 15 + runningAverage[i>>2]) >> 4;
    }
  };
}

// changed pixels colored in with rainbows
function changebow(width, height) {
  let runningAverage = Array(width * height).fill(384);

  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {

      let colorSum = data[i] + data[i+1] + data[i+2];
      const x = i % width;
      const y = Math.floor(i / width);

      const diff = Math.min(colorSum - runningAverage[i>>2], 256);
      const redShift = Math.abs(((time + x) % 512) - 256);
      const greenShift = Math.abs((time+ y) % 512 - 256);
      const blueShift = Math.abs((time+ y + x) % 512 - 256);

      data[i] = (diff * redShift) >> 8;
      data[i+1] = (diff * greenShift) >> 8;
      data[i+2] = (diff * blueShift) >> 8;

      // each frame we mix in the current frame's value slightly
      runningAverage[i>>2] = (colorSum * 63 + runningAverage[i>>2]) >> 6;
    }
  };
}

// pixelate, posterize (reduce color count), and limit the framerate
function nooptendo(width, height) {
  let frame = new Array(width * height * 4).fill(0);
  let nextFrameTime = 0;
  const frameLength = 100; // 10 FPS

  // blow out the colors here
  // R, G, B are each reduced to 2 bits (4 values) then looked up from this list
  const levels = [0, 50, 160, 255];

  return function(data, time) {

    let dataLength = data.length >> 2;

    // enforce 10 FPS
    if (nextFrameTime < time) {
      for (var i = 0; i < dataLength; i++) {

        const offset = i << 2;

        let x = i % width;
        let y = Math.floor(i / width);

        let centerY = y | 3;
        let centerX = x | 3;
        let center = (centerY * width + centerX) << 2;


        frame[offset] = data[offset] = levels[data[center] >> 6]
        frame[offset+1] = data[offset+1] = levels[data[center+1] >>6]
        frame[offset+2] = data[offset+2] = levels[data[center+2] >>6]
        frame[offset+3] = data[offset+3]
      }

      nextFrameTime = time + frameLength;
    }
    else {
      for (var i = 0; i < data.length; i++) {
        data[i] = frame[i];
      }
    }
  }
}

// a lot of things can be done using distance-from-center
// as a modifier. This just draws colorful rings emanating from the center.
function target(width, height) {
  let distance = Array(width*height).fill(0);

  // calculate distance from center for each pixel
  // You could optimize this to only loop through one quadrant and mirror to the other 3
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      distance[y*width +x ] = Math.floor(Math.sqrt(
        Math.pow(x-(width>>1),2)  + Math.pow(y-(height>>1), 2)
      ));
    }
  }

  return function(data, time) {
    // go through each pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // could optimize all of this looking/calculation up but it seems fast enough
        const offset = (y*width + x) << 2;
        const d = Math.abs((-(time>>2) + distance[y*width + x]) % 256 - 256);

        // bitwise or with 255 (binary 11111111) constrains the value to 0-255
        data[offset] =  (data[offset] + d) & 255;
        data[offset+1] = (data[offset+1] ^ d) & 255;
        data[offset+2] = (data[offset+2] - d) & 255;
      }
    }
  }
}


var transformers = {
  changes,
  changebow,
  psychrainbow,
  psychrainbow,
  nooptendo,
  toomuch,
  target,
  none: () => () => {}
};
