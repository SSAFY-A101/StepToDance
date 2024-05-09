// worker.js
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@1.0.0");

let net;
async function loadModel() {
  net = await bodyPix.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.5,
    quantBytes: 2
  });
}

self.addEventListener('message', async (event) => {
  if (!net) {
    await loadModel();
  }
  const { imageData } = event.data;
  const segmentation = await net.segmentPerson(imageData, {
    flipHorizontal: false,
    internalResolution: 'medium',
    segmentationThreshold: 0.5
  });
  const mask = bodyPix.toMask(segmentation, {r: 255, g: 255, b: 255, a: 128}, {r: 0, g: 0, b: 0, a: 0});
  const maskImageData = new ImageData(new Uint8ClampedArray(mask.data), imageData.width, imageData.height);
  self.postMessage({ mask: maskImageData.data.buffer }, [maskImageData.data.buffer]);
});
