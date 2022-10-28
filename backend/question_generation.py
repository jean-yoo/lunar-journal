import sys
import ast
from random import randint
from questions_backend import QuestionGeneration
import requests

from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 import Features, KeywordsOptions
import json

"""
    argv[1] : keyword dictionary
    argv[2] : corpus
    argv[3] : user text
"""

def azure_extract_keywords(new_text):
    """ takes new user text and returns a list of keywords using Microsoft's Azure Cognitive Services
    """
    headers = {'Ocp-Apim-Subscription-Key': '59bf3be460ad434585a4b4143c470a92'}
    document = {'documents': [{'id': '1', 'text': new_text}]}
    azure_url = "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/KeyPhrases"

    response = requests.post(azure_url, headers=headers, json=document)
    response = response.json()
    return [keyword.encode('utf-8') for keyword in response['documents'][0]['keyPhrases']]

def watson_extract_keywords(new_text):
    """ takes new user text and returns a list of keywords using IBM's Watson Natural Language Understanding
    """
    nlp = NaturalLanguageUnderstandingV1(
        version='2018-03-16',
        username='be4694ef-b0b4-44cf-a2bf-de9e669525ef',
        password='XB1M0xRrLFQT'
    )
    response = nlp.analyze(
        text = new_text,
        features = Features(
            keywords=KeywordsOptions()
        ),
    )
    return [keyword['text'].encode('utf-8') for keyword in response.get_result()['keywords']]


def extract_date_location(keyword_entry, date_location):
    """ Given a keywords entry in the keyword_dict, return either the most recent date or location
    """
    data_len = len(keyword_entry[date_location])
    # if only one date, return that date
    if data_len == 1:
        return keyword_entry[date_location][0]
    else:
        # 70% of the time, grab the most recent date
        if randint(0,9) < 7:
            return keyword_entry[date_location][-1]
        else: # grab a random date in the list
            return keyword_entry[date_location][randint(0,data_len-1)]

def extract_comp(keyword_entry):
    """ Given a keywords entry in the keyword_dict, return either the most recent date/location pair or a random pair
    """
    data_len = len(keyword_entry['comp'])
    # if only one date, return that date
    if data_len == 1:
        return keyword_entry['comp'][0]
    else:
        # 70% of the time, grab the most recent date
        if randint(0,9) < 7:
            return keyword_entry['comp'][-1]
        else: # grab a random date in the list
            return keyword_entry['comp'][randint(0,data_len-1)]

def main():
    # take command line arguments and decode them from "{}" to {}
    keyword_dict = ast.literal_eval(sys.argv[1])
    corpus = ast.literal_eval(sys.argv[2])
    new_text = sys.argv[3]

    # instantiate question generator:
    qqgen = QuestionGeneration()
    questions = []

    # extract keywords
    if len(new_text.split()) <= 3: # if new text is too short, use azure
        keywords = azure_extract_keywords(new_text)
    else: # otherwise use watson
        keywords = watson_extract_keywords(new_text)

    if not keywords: # if watson extract returned an empty list of keywords, use azure to cover the slack
        keywords = azure_extract_keywords(new_text)

    # Question generation!
    for keyword in keywords:
        if keyword in keyword_dict: # the keyword exists in the dictionary already
            # if the comp date/location pair is known, and the keyword is a verb in the ing form, ask a GREAT comp question
            if ('VBG' in keyword_dict[keyword]['pos']) and (len(keyword_dict[keyword]['comp']) > 0):
                data, location = extract_comp(keyword_dict[keyword])
                questions.append(qqgen.askCompActivityQ(keyword, data, location))

            # if location is known:
            if len(keyword_dict[keyword]['location']) > 0:
                location = extract_date_location(keyword_dict[keyword], 'location')
                questions.append(qqgen.askLocationQ(location))

            # if date is known
            if len(keyword_dict[keyword]['date']) != 0:
                date = extract_date_location(keyword_dict[keyword], 'date')
                # if the verb is in the form of ing
                if 'VBG' in keyword_dict[keyword]['pos']:
                    questions.append(qqgen.askDateVerbQ(date, keyword))

            # if the verb is in the form of ing
            if 'VBG' in keyword_dict[keyword]['pos']:
                questions.append(qqgen.askActivityQ(keyword))

            # if the keyword is a food related word:
            if keyword_dict[keyword]['type'] == 'restaurant':
                questions.append(qqgen.askFoodQ(keyword))

    # always return at least 4 questions:
    while len(questions) < 4:
        temp = qqgen.askGeneralQ() # generate random question
        if temp not in questions: # check to see if the question has already been asked
            questions.append(temp)

    for question in questions:
        print(question)
        sys.stdout.flush()

if __name__ == '__main__':
    main()
