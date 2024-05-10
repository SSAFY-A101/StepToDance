import boto3
from data.GuideRequest import GuideUpdateRequest
from data.GuideUpdateMsg import GuideUpdateMsg
from data.FeedbackUpdateMsg import FeedbackUpdateMsg
import util.AiUtil as AiUtil
import core.redis_config as redis_config
from kafka_producer import send_data_to_kafka
from json import *

async def guideFrame(msgInstance: dict):
    guide = GuideUpdateMsg(msgInstance)
    bodyModel = AiUtil.imgToBodyModelCaffe(guide.image)
    redis = redis_config.get_redis()
    if redis == None:
        redis = redis_config.redis_config()
        print("Redis Connect")
    
    size = redis.lpush("guide:" + str(guide.guideId), '{"name":"' + guide.name + '", "model": ' + dumps(bodyModel) + '}')

    if size == guide.size:
        await send_data_to_kafka(guide.guideId, 'guide-flag')
        print(f'guide: {guide.guideId} 이미지 변환 완료')
        print('완료 메시지를 guide-flag 토픽으로 전송')


async def feedbackFrame(msgInstance: dict):
    feedback = FeedbackUpdateMsg(msgInstance)
    bodyModel = AiUtil.imgToBodyModelCaffe(feedback.image)
    redis = redis_config.get_redis()
    if redis == None:
        redis = redis_config.redis_config()
        print("Redis Connect")

    size = redis.lpush("feedback:" + str(feedback.feedbackId), '{"name":"' + feedback.name + '", "model": ' + dumps(bodyModel) + '}')

    if size == feedback.size:
        await send_data_to_kafka(feedback.feedbackId, 'feedback-flag')
        print(f'feedback: {feedback.feedbackId} 이미지 변환 완료')
        print('완료 메시지를 feedback-flag 토픽으로 전송')