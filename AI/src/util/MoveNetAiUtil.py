import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import cv2
import base64

# Import matplotlib libraries
from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection
import matplotlib.patches as patches

model = None
module = None
input_size = 0

def loadModel():
    global module, input_size, model
    print("loading module...")
    module = hub.load("https://tfhub.dev/google/movenet/singlepose/lightning/4")
    input_size = 192
    model = module.signatures['serving_default']



def imgToBodyModel(image):
    global module, input_size, model

    # 모듈 로드
    if module == None:
        loadModel()
    
    # base64 디코딩
    binary_image = base64.b64decode(image)
    # 텐서로 변환
    image_tensor = tf.io.decode_image(binary_image)
    # 이미지 크기 출력 (선택 사항)
    print("Image shape:", image_tensor.shape)

    # Resize and pad the image to keep the aspect ratio and fit the expected size.
    input_image = tf.expand_dims(image_tensor, axis=0)
    input_image = tf.image.resize_with_pad(input_image, input_size, input_size)

    # Run model inference.
    keypoints_with_scores = movenet(input_image)
    keypoints_with_scores = keypoints_with_scores.tolist()
    keypoints_with_scores = keypoints_with_scores[0][0]
    for i in range(len(keypoints_with_scores)):
        keypoints_with_scores[i] = keypoints_with_scores[i][:2]
    return keypoints_with_scores




def movenet(input_image):
    """Runs detection on an input image.

    Args:
      input_image: A [1, height, width, 3] tensor represents the input image
        pixels. Note that the height/width should already be resized and match the
        expected input resolution of the model before passing into this function.

    Returns:
      A [1, 1, 17, 3] float numpy array representing the predicted keypoint
      coordinates and scores.
    """
    model = module.signatures['serving_default']

    # SavedModel format expects tensor type of int32.
    input_image = tf.cast(input_image, dtype=tf.int32)
    # Run model inference.
    outputs = model(input_image)
    # Output is a [1, 1, 17, 3] tensor.
    keypoints_with_scores = outputs['output_0'].numpy()
    return keypoints_with_scores