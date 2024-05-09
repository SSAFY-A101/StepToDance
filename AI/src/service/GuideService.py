import boto3
from data.GuideRequest import GuideUpdateRequest
from data.GuideUpdateMsg import GuideUpdateMsg
from util.AiUtil import imgToBodyModel
from core.redis_config import *
from kafka_producer import send_data_to_kafka
from json import *

# TODO: env로 키를 옮기기
AWS_S3_ACCESS_KEY = "test"
AWS_S3_PRIVATE_KEY = "test"

def guideUpload(video_url: str):
    s3 = boto3.client("s3", aws_access_key_id=AWS_S3_ACCESS_KEY, aws_secret_access_key=AWS_S3_PRIVATE_KEY)

async def guideFrame(msgInstance: dict):
    guide = GuideUpdateMsg(msgInstance)
    bodyModel = imgToBodyModel(guide.image)
    redis = get_redis()
    if redis == None:
        redis = redis_config()
        print("Redis Connect")
    
    size = redis.lpush("guide:" + str(guide.guideId), "{'name':'" + guide.name + "', 'model': " + dumps(bodyModel) + "}")

    if size == guide.size:
        await send_data_to_kafka(guide.guideId, 'guide-flag')
        print(f'{guide.guideId} 이미지 변환 완료')
        print('완료 메시지를 guideFlag 토픽으로 전송')