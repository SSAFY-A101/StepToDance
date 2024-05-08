# import tensorflow as tf
# import numpy as np
# from matplotlib import pyplot as plt
import cv2
import boto3
import os

def get_s3_client():
    s3 = boto3.client('s3',
                      aws_access_key_id=os.environ['S3_ACCESS_KEY'],
                      aws_secret_access_key=os.environ['S3_SECRET_ACCESS_KEY'],
                      region_name='ap-northeast-2'
                      )
    return s3

def imgToBodyModel(image) -> list:
    print("imgToBodyModel: " , image[:10])
    # 각 파일 path
    # protoFile = "pose_deploy_linevec_faster_4_stages.prototxt"
    protoFile = "../resources/model/pose_deploy_linevec_faster_4_stages.prototxt"
    # weightsFile = "pose_iter_160000.caffemodel"
    weightsFile = "../resources/model/pose_iter_160000.caffemodel"
 
    # 위의 path에 있는 network 불러오기
    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    print(image)
    # frame.shape = 불러온 이미지에서 height, width, color 받아옴
    imageHeight, imageWidth, _ = image.shape
 
    # network에 넣기위해 전처리
    inpBlob = cv2.dnn.blobFromImage(image, 1.0 / 255, (imageWidth, imageHeight), (0, 0, 0), swapRB=False, crop=False)
 
    # network에 넣어주기
    net.setInput(inpBlob)

    # 결과 받아오기
    output = net.forward()
    print(output)

    return None