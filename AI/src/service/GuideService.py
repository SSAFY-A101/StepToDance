import boto3
from data.GuideRequest import GuideUpdateRequest
from data.GuideUpdateMsg import GuideUpdateMsg
from util.AiUtil import imgToBodyModel
from core.redis_config import redis_config
from kafka_producer import send_data_to_kafka

# TODO: env로 키를 옮기기
AWS_S3_ACCESS_KEY = "test"
AWS_S3_PRIVATE_KEY = "test"

def guideUpload(video_url: str):
    s3 = boto3.client("s3", aws_access_key_id=AWS_S3_ACCESS_KEY, aws_secret_access_key=AWS_S3_PRIVATE_KEY)

def guideFrame(msgInstance: dict):
    guide = GuideUpdateMsg(msgInstance)
    bodyModel = imgToBodyModel(guide.image)

    redis = redis_config()
    size = redis.lpush(f'guide:{guide.guideId}', bodyModel)
    if size == guide.size:
        send_data_to_kafka(f'guideFlag', guide.guideId)