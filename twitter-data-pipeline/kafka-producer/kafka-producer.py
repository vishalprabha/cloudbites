from confluent_kafka import Producer
import socket
import tweepy
import config
import time



from turtle import clear
from confluent_kafka import Consumer,KafkaError
import redis
import os


redisHost = os.getenv("REDIS_HOST") or "localhost"
db = redis.Redis(host='redis',port = 6379, decode_responses = True) 

# Request from REST Server
#conf = {'bootstrap.servers': "localhost:29090",
#        'group.id': "foo",
#        'auto.offset.reset': 'smallest'}
#consumer = Consumer(conf)
#consumer.subscribe(['tweetSearchReq'])

# Response to DB
conf1 = {'bootstrap.servers': "kafka:9092",
        'client.id': socket.gethostname()}
producer = Producer(conf1)
topic = 'tweetData2DB'


# Tweeter API set up
client = tweepy.Client(bearer_token=config.BEARER_TOKEN)

# try:
#  while True:
#     msg=consumer.poll(timeout=1.0)

#     # print(msg)

#     if msg is None:
#         print('msg is None')
#         continue

#     if msg.error() == KafkaError._PARTITION_EOF:
#         print('End of partition reached {0}/{1}'
#               .format(msg.topic(), msg.partition()))
#         #print( msg.error().code())
#     else:
#         Topic = msg.topic()
#         data  = msg.value().decode('UTF-8')
        
#         print("Topic  = "+Topic)
#         print(" Data = "+data)
#         if Topic == "tweetSearchReq":
#              data = "Indian Resturant"   
#              response = client.search_recent_tweets(query= data +'  lang:en -is:retweet',max_results = 100)
#              tweetList = ''
#              for tweet in response.data:
#                 print(tweet.created_at)
#                 print(tweet)
#                 tweetList += str(tweet) +' $$$ '
#              producer.produce(topic, key="key", value=str(data) + ' ### '+tweetList)   

             
while True:
   time.sleep(1)
   #print("checking for REST server data")
   val  = db.get("isKeyAvailable")
   if val == None:
      continue 
   if val != "None":
      print("Search Key : "+val)
      response = client.search_recent_tweets(query= val +'  lang:en -is:retweet',max_results = 100)
      tweetList = ''
      if response.data == None:
         continue
      count = 0
      for tweet in response.data:
         print(tweet.created_at)
         print(tweet)
         tweetList += str(tweet) +' $$$ '
         count += 1
         if count>5:
            break
      producer.produce(topic, key="key", value=str(val) + ' ### '+tweetList)




