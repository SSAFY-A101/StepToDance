import os
import redis

def redis_config() :
    try:
        REDIS_HOST = str = os.getenv("REDIS_HOST")
        REDIS_PORT = integer = os.getenv("REDIS_PORT")
        print(str)
        print(integer)
        rd = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
        print("redis connection success")
        return rd
    except:
        print("redis connection failure")