
import numpy as np

# import string
from string import punctuation
import io 
import matplotlib.pyplot as plt
from wordcloud.wordcloud import WordCloud
from PIL import Image
import base64

class GenerateWordCloud():
  # preprocessing the reviews
  # remove numbers
  def remove_num(self, text):
      text = ''.join([i for i in text if not i.isdigit()])
      return text

  # remove punctuation
  
  def remove_punct(self, text):
      text = ' '.join(word.strip(punctuation) for word in text.split() if word.strip(punctuation))
      return text

  # remove other characters
  def remove_u(self, text):
      text = text.replace('_','')
      text = text.replace('?','')
      text = text.replace('•','')
      text = text.replace("@",'')
      text = text.replace('▯','')
      text = text.replace("'",'')
      text = text.replace(",","")
      return text

  # remove extra spaces
  def remove_extra_space(self, text):
      word_list = text.split()
      text = ' '.join(word_list)
      return text

  # remove common words
  
  def remove_stopwords(self, text):
      stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the","Mr", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]
      word_list = text.split()
      word_list = [word for word in word_list if word.lower() not in stop_words]
      text = ' '.join(word_list)
      return text

  # command to run all pre
  def preprocess_text(self, text):    
    text = np.vectorize(self.remove_num)(text)
    text = np.vectorize(self.remove_punct)(text)
    text = np.vectorize(self.remove_u)(text)
    text = np.vectorize(self.remove_extra_space)(text)
    text = np.vectorize(self.remove_stopwords)(text)
    text = text.tolist()
    return text
  
  def transform_format(self, val):
    if val == 0:
        return 255
    else:
        return val

  def process_reviews(self, response):
    text = ''
    for element in response:
      text += element["text"]["raw"]
    return text

  def generate_image(self, api_response):
    text = self.process_reviews(api_response)
    text = self.preprocess_text(text)
    if not text or text == '' or text == ' ':
      text = "Null reviews"
    mask_image = np.array(Image.open('api/resources/cloud.png'))
    transformed_cloud = np.ndarray((mask_image.shape[0],mask_image.shape[1]), np.int32)
    for i in range(len(mask_image)):
        transformed_cloud[i] = list(map(self.transform_format, mask_image[i]))
    wordcloud_good = WordCloud(colormap = "Paired",mask = transformed_cloud, width = 300, height = 200, scale=2,max_words=1000).generate(text)
    buffer = io.BytesIO()
    wordcloud_good.to_image().save(buffer, 'png')
    b64_string_image = base64.b64encode(buffer.getvalue()).decode('utf8')
    return b64_string_image
