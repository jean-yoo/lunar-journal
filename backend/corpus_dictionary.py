from Day import *
from Block import *


from sklearn.feature_extraction.text import TfidfVectorizer
import operator

class Corpus:
    def __init__(self):
        self.words = {} # key: keyword, value: list of dates
        self.tfidf_weights = {} # key: words, value: weights
        self.corpus = []

    def add_words(self, Day):
        for keyword in Day.keywords:
            if keyword not in self.words: # if keyword is not in corpus yet, add it
                self.words[keyword] = [Day.date]
            else: # keyword is in corpus, just need to add date
                self.words[keyword].append(Day.date)

    def add_text_to_corpus(self, Day):
        for block in Day.blocks:
            self.corpus.append(block.text)

    def calculate_tfidf(self):
        """ Calculate tfidf given a list of text entries
        """
        vectorizer = TfidfVectorizer(max_df=0.8) # max_df is maximum % of documents the word appears in
        X = vectorizer.fit_transform(self.corpus)
        idf = vectorizer.idf_
        self.tfidf_weights = dict(zip([word.encode('utf-8') for word in vectorizer.get_feature_names()], idf))

    def get_most_important_keyword(self, keywords):
        """ Given a list of keywords, find the most important keyword based on tfidf weights
        """
        keyword_tfidf_weights = {}
        for keyword in keywords:
            if keyword in self.tfidf_weights: # if the keyword was exposed in the tfidf algo, keep track of it's weight
                keyword_tfidf_weights[keyword] = self.tfidf_weights[keyword]
        if len(keyword_tfidf_weights) != 0:
            most_important_keyword = sorted(keyword_tfidf_weights.items(), key=operator.itemgetter(1), reverse=True)[0][0]
            return most_important_keyword
        else: # no keywords were in the tfidf_weights
            pass #TODO: need to figure out what to do in this case
