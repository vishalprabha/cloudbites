import pandas as pd
import pickle
from scipy import sparse
from scipy.spatial.distance import cdist
import numpy as np
import json
import requests
from pathlib import Path


class GenerateRecommendations():
  businessxreview_read = None
  vectorizer_reviews_read = None
  vectorizer_categories_read = None
  vectorized_reviews_read = None
  vectorized_categories_read = None
  df_yelp_business_read = None
  df_yelp_review_read = None
  
  def __init__(self):
    self.load_pkl()

  def load_pkl(self):

    my_file = Path("api/resources/businessxreview.npz")
    if not my_file.exists():
      
      url = 'https://storage.googleapis.com/cloudbites-recommendation/businessxreview.npz'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/businessxreview.npz', 'wb').write(r.content)
    
    my_file = Path("api/resources/df_yelp_business.pkl")
    if not my_file.exists():
      url = 'https://storage.googleapis.com/cloudbites-recommendation/df_yelp_business.pkl'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/df_yelp_business.pkl', 'wb').write(r.content)

    my_file = Path("api/resources/vectorizer_categories.pkl")
    if not my_file.exists():
      url = 'https://storage.googleapis.com/cloudbites-recommendation/vectorizer_categories.pkl'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/vectorizer_categories.pkl', 'wb').write(r.content)
    
    my_file = Path("api/resources/vectorizer_reviews.pkl")
    if not my_file.exists():
      url = 'https://storage.googleapis.com/cloudbites-recommendation/vectorizer_reviews.pkl'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/vectorizer_reviews.pkl', 'wb').write(r.content)

    my_file = Path("api/resources/vectorizer.pkl")
    if not my_file.exists():
      url = 'https://storage.googleapis.com/cloudbites-recommendation/vectorizer.pkl'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/vectorizer.pkl', 'wb').write(r.content)

    my_file = Path("api/resources/df_yelp_review.pkl")
    if not my_file.exists():
      url = 'https://storage.googleapis.com/cloudbites-recommendation/df_yelp_review.pkl'
      r = requests.get(url, allow_redirects=True)
      open('api/resources/df_yelp_review.pkl', 'wb').write(r.content)

    # loading business review sparse matrix
    self.businessxreview_read = sparse.load_npz("api/resources/businessxreview.npz")

    # loading countvectorized reviews
    with open('api/resources/vectorizer_reviews.pkl', 'rb') as f:
        self.vectorizer_reviews_read = pickle.load(f)
        
    # loading countvectorized categories
    with open('api/resources/vectorizer_categories.pkl', 'rb') as f:
        self.vectorizer_categories_read = pickle.load(f)
        
        
    # loading transformed reviews and categories
    with open('api/resources/vectorizer.pkl', 'rb') as f:
        self.vectorized_reviews_read, self.vectorized_categories_read = pickle.load(f)
        
    # business data
    self.df_yelp_business_read = pd.read_pickle("api/resources/df_yelp_business.pkl")

    # review data 
    self.df_yelp_review_read = pd.read_pickle("api/resources/df_yelp_review.pkl")


  def generate_recommendations(self, business_id):
    
    new_reviews = self.df_yelp_review_read.loc[self.df_yelp_review_read['business_id'] == business_id, 'text']
    new_categories = self.df_yelp_business_read.loc[self.df_yelp_business_read['business_id'] == business_id, 'categories']
    dists1 = cdist(self.vectorizer_reviews_read.transform(new_reviews).todense().mean(axis=0), 
              self.vectorized_reviews_read.T.dot(self.businessxreview_read).T.todense(), 
               metric='correlation')
    # find most similar categories
    dists2 = cdist(self.vectorizer_categories_read.transform(new_categories).todense().mean(axis=0), 
                  self.vectorized_categories_read.todense(), 
                  metric='correlation')
    # combine the two vectors in one matrix
    dists_together = np.vstack([dists1.ravel(), dists2.ravel()]).T
    # this is a key cell: how are we going to prioritize ?
    dists = dists_together.mean(axis=1)
    # select the closest 10
    closest = dists.argsort().ravel()[:10]
    self.df_yelp_business_read.loc[self.df_yelp_business_read['business_id']== business_id, ['business_id', 'categories', 'name', 'stars']]
    recommendations = self.df_yelp_business_read.loc[self.df_yelp_business_read['business_id'].isin(self.df_yelp_business_read['business_id'].iloc[closest]), ['business_id', 'categories', 'name', 'stars']]
    result = recommendations.to_json(orient = 'index')
    result = json.loads(result)
    return result