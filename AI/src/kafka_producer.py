import json
from confluent_kafka import Producer

# producer = KafkaProducer(
#     bootstrap_servers='k10a101.p.ssafy.io:9092',
#     bootstrap_servers='kafka1:9092, kafka2:9092, kafka3:9092',
#     value_serializer=lambda v: json.dumps(v).encode('utf-8')
# )
producer = Producer({
    'bootstrap.servers': 'kafka1:9092, kafka2:9092, kafka3:9093',
})

async def send_data_to_kafka(data: dict, topic: str = 'topic-ai'):
    producer.produce(topic=topic, value=json.dumps(data))
    producer.flush()
    print(f'sent: {data}')