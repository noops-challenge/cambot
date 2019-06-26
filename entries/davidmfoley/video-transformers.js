
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

var transformers = {
  changes,
  psychrainbow,
  none: () => () => {}
};
