import os
import redis

redisConn = None

def redis_config() :
    global redisConn
    try:
        REDIS_HOST = str = os.getenv("REDIS_HOST")
        REDIS_PORT = integer = os.getenv("REDIS_PORT")
        print(str)
        print(integer)
        redisConn = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=os.getenv('REDIS_PASSWORD'))
        print("redis connection success")
        return redisConn
    except:
        print("redis connection failure")

def get_redis():
    global redisConn
    return redisConn