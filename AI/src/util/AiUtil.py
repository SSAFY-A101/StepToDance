# import tensorflow as tf
# import numpy as np
# from matplotlib import pyplot as plt
import cv2
import boto3
import os
import base64
import numpy as np
import json

def get_s3_client():
    s3 = boto3.client('s3',
                      aws_access_key_id=os.environ['S3_ACCESS_KEY'],
                      aws_secret_access_key=os.environ['S3_SECRET_ACCESS_KEY'],
                      region_name='ap-northeast-2'
                      )
    return s3

def imgToBodyModel(image):
    print("imgToBodyModel: " , image[:10])
    # 이미지를 opencv 형식으로 변환
    imgdata = base64.b64decode(str(image))
    nparr = np.frombuffer(imgdata, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 각 파일 path
    # protoFile = "pose_deploy_linevec_faster_4_stages.prototxt"
    protoFile = "../resources/model/pose_deploy_linevec_faster_4_stages.prototxt"
    # weightsFile = "pose_iter_160000.caffemodel"
    weightsFile = "../resources/model/pose_iter_160000.caffemodel"
 
    # 위의 path에 있는 network 불러오기
    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

    # frame.shape = 불러온 이미지에서 height, width, color 받아옴
    imageHeight, imageWidth, _ = image.shape
 
    # network에 넣기위해 전처리
    inpBlob = cv2.dnn.blobFromImage(image, 1.0 / 255, (imageWidth, imageHeight), (0, 0, 0), swapRB=False, crop=False)
 
    # network에 넣어주기
    net.setInput(inpBlob)

    # 결과 받아오기
    output = net.forward()
    # output.shape[0] = 이미지 ID, [1] = 출력 맵의 높이, [2] = 너비
    H = output.shape[2]
    W = output.shape[3]
    print("이미지 ID : ", len(output[0]), ", H : ", output.shape[2], ", W : ",output.shape[3]) # 이미지 ID

    # 키포인트 검출시 이미지에 그려줌
    points = []
    for i in range(0,15):
        # 해당 신체부위 신뢰도 얻음.
        probMap = output[0, i, :, :]
 
       # global 최대값 찾기
        minVal, prob, minLoc, point = cv2.minMaxLoc(probMap)

        # 원래 이미지에 맞게 점 위치 변경
        x = (imageWidth * point[0]) / W
        y = (imageHeight * point[1]) / H

        # 키포인트 검출한 결과가 0.1보다 크면(검출한곳이 위 BODY_PARTS랑 맞는 부위면) points에 추가, 검출했는데 부위가 없으면 None으로    
        if prob > 0.1 :    
            cv2.circle(image, (int(x), int(y)), 3, (0, 255, 255), thickness=-1, lineType=cv2.FILLED)       # circle(그릴곳, 원의 중심, 반지름, 색)
            cv2.putText(image, "{}".format(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, lineType=cv2.LINE_AA)
            points.append((int(x), int(y)))
        else :
            points.append(None)
    
    print('output', points)

    return points