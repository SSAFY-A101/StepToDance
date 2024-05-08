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

    image = cv2.imdecode(image)
    print(image)

    return None