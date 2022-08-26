from confluent_kafka import Producer
import socket
import tweepy
import config
import time
import json
import redis
import os


redisHost = os.getenv("REDIS_HOST") or "localhost"
redisPort = 6379
db = redis.Redis(host='localhost',port = 6379, decode_responses = True)   

searchKey = 'Boulder'

db.set("key","value")
print(db.get("key"))

db.set("isKeyAvailable",searchKey)
time.sleep(3)
#json_data = json.dumps(db.get(searchKey).split(' $$$ '))
json_data = {"tweets":db.get(searchKey).split(' $$$ ')}
print(json_data)

db.set("isKeyAvailable","None")
#producer.close()

#docker run --name my-redis -p 6379:6379 -d redis