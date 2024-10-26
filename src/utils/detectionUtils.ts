import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

export const loadDetectionModel = async (): Promise<cocossd.ObjectDetection> => {
  await tf.ready();
  return await cocossd.load({
    base: 'lite_mobilenet_v2'
  });
};

export const drawDetections = (
  predictions: cocossd.DetectedObject[],
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '16px sans-serif';
  ctx.textBaseline = 'top';

  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;

    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = '#00FFFF';
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt('16px sans-serif', 10);
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = '#000000';
    ctx.fillText(prediction.class, x, y);
  });
};