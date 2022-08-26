from turtle import clear
from confluent_kafka import Consumer,KafkaError
import redis
import os


redisHost = os.getenv("REDIS_HOST") or "localhost"
db = redis.Redis(host='redis',port = 6379, decode_responses = True)

conf = {'bootstrap.servers': "kafka:9092",
        'group.id': "foo",
        'auto.offset.reset': 'smallest'}

consumer = Consumer(conf)
consumer.subscribe(['tweetData2DB'])
#consumer.subscribe(['searchKey'])
#batch = consumer.consume(num_messages=100,timeout=1)

try:
 while True:
    msg=consumer.poll(timeout=1.0)

    # print(msg)

    if msg is None:
        #print('msg is None')
        continue

    if msg.error() == KafkaError._PARTITION_EOF:
        print('End of partition reached {0}/{1}'
              .format(msg.topic(), msg.partition()))
        #print( msg.error().code())
    else:
        Topic = msg.topic()
        data  = msg.value().decode('UTF-8').split(' ### ')
        if(len(data)<2):
          continue
        key = data[0]
        TweetsDataList = data[1]
        print("Topic  = "+Topic)
        print(" Data = "+data[0]+'\n'+data[1])
        if Topic == "tweetData2DB":
             cachedData = db.get(key)
             if cachedData == None:
                print("Data is not present in redis")
                db.set(key,TweetsDataList)
             else:
                print("Data is present, append data")
                db.set(key,TweetsDataList) 
               

except KeyboardInterrupt:
   print("Interrupted through")

finally:
   consumer.close()