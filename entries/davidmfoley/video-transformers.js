
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

function toomuch(width, height) {
  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {
      const x = i % width;
      const y = Math.floor(i / width);
      const redShift = Math.abs(((time + x) % 512) - 256);
      const greenShift = Math.abs((time+ y) % 512 - 256);

      //invert RGB
      data[i] = (data[i] + redShift) & 255
      data[i+1] = (data[i+1] + greenShift) & 255;
      data[i+2] = (data[i+2] + (redShift + greenShift ^ 183)) & 255;
    }
  }
}

function changes(width, height) {
  let runningAverage = Array(width * height).fill(384);

  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {

      let colorSum = data[i] + data[i+1] + data[i+2];

      //const diff = Math.floor(Math.abs(colorSum - runningAverage[i>>2]) / 3);
      const diff = Math.min(colorSum - runningAverage[i>>2], 256);

      data[i] = diff;
      data[i+1] = diff;
      data[i+2] = diff;

      runningAverage[i>>2] = (colorSum * 15 + runningAverage[i>>2]) >> 4;
    }
  };
}

function nooptendo(width, height) {
  let runningAverage = Array(width * height).fill(384);

  // blow out the colors here
  const levels = [0, 50, 160, 255];

  return function(data, time) {
    let dataLength = data.length >> 2;
    for (var i = 0; i < dataLength; i++) {

      const offset = i << 2;

      let x = i % width;
      let y = Math.floor(i / width);

      let centerY = y | 3;
      let centerX = x | 3;
      let center = (centerY * width + centerX) << 2;


      data[offset] = levels[data[center] >> 6]
      data[offset+1] = levels[data[center+1] >>6]
      data[offset+2] = levels[data[center+2] >>6]
    }
  }
}

var transformers = {
  changes,
  psychrainbow,
  psychrainbow,
  nooptendo,
  toomuch,
  none: () => () => {}
};
