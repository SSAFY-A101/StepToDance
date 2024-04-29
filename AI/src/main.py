from fastapi import FastAPI, BackgroundTasks
from kafka_producer import send_data_to_kafka
from confluent_kafka import Consumer
import asyncio
from data.GuideRequest import GuideUpdateRequest


# consumer = Consumer({'bootstrap.servers': 'k10a101.p.ssafy.io:9092', 'group.id': 'group.id'})
consumer = Consumer({'bootstrap.servers': 'kafka1:9092, kafka2:9092, kafka3:9092', 'group.id': 'group.id'})
consumer.subscribe(['topic-ai'])

app = FastAPI()

@app.get('/')
def home():
    return "hello!"

@app.post('/guides/upload')
def guideUpload(data: str):
    print(data)
    return "hello!"

@app.post("/send-data")
async def send_data(data: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_data_to_kafka, data)
    return {"message": "Data sent to Kafka!"}

# 비동기 Kafka 메시지 소비
async def consume_messages():
    current_loop = asyncio.get_running_loop()
    print("start consuming...")
    while True:
        message = await current_loop.run_in_executor(None, consumer.poll, 1.0)
        if message is None:
            continue
        print("consume", message)

# 앱 시작 시 Kafka 메시지 Consume를 비동기로 시작
@app.on_event('startup')
async def app_startup():
    asyncio.create_task(consume_messages())

# 앱 종료 시 Kafka Consumer 닫기
@app.on_event('shutdown')
async def app_shutdown():
    consumer.close()
