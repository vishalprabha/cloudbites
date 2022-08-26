import tweepy
import config

client = tweepy.Client(bearer_token=config.BEARER_TOKEN)
foodType = 'IndianFood' 
location  = 'Boulder'
query1 = '#'+foodType+' place:'+location +' OR '+foodType+ ' place:'+location

foodType = 'ItalianFood' 
location  = 'Boulder'
query2 = '#'+foodType+' place:'+location+' OR '+foodType+ ' place:'+location

finalQuery = query1 + ' OR ' + query2
#client.se
#response  = client.search_all_tweets(query='Indian Resturant lang:en -is:retweet',geo='48.136353,11.575004,25km')
response = client.search_recent_tweets(query='Indian Resturant  lang:en -is:retweet',max_results = 100)
#print(response)
for tweet in response.data:
    print(tweet.created_at)
    print(tweet)