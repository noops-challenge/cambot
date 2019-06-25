
function psychrainbow(width, height) {
  let runningAverage = [];
  let nextSampleTime = 0;
  let sampleInterval = 100;

  return function(data, time) {
    let dataLength = data.length;
    for (var i = 0; i < dataLength; i+=4) {
      let colorSum = data[i] + data[i+1] + data[i+2];

      const diff = Math.abs(colorSum - runningAverage[i]);

      const x = i % width;
      const y = Math.floor(i / width);
      const redShift = Math.abs(((time + x) % 512) - 256);
      const greenShift = Math.abs((y - time) % 512 - 256);


      data[i] = (data[i] + redShift) & 255
      data[i+1] = (data[i+1] + greenShift + diff) & 255;
      data[i+2] = diff & 255; //(data[i+2] + diff) & 255;

      if (nextSampleTime < time) {
        runningAverage[i] = (runningAverage[1] + colorSum) >> 1;
      }
    }
    if (nextSampleTime < time) {
      nextSampleTime = time + sampleInterval;
    }
  };
}
