from watson_developer_cloud import ToneAnalyzerV3
import sys
import json
import requests

def azure_sentiment_analysis(new_text):
    """ takes new user text and returns sentiment analysis Microsoft's Azure Cognitive Services
    """
    headers = {'Ocp-Apim-Subscription-Key': '59bf3be460ad434585a4b4143c470a92'}
    document = {'documents': [{'id': '1', 'text': new_text}]}
    azure_url = "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"

    response = requests.post(azure_url, headers=headers, json=document)
    response = response.json()
    return response['documents'][0]['score']

def watson_sentiment_analysis(new_text):
    tone_analyzer = ToneAnalyzerV3(
        version="2017-09-21",
        username="cfde6c2c-e95b-436b-a67a-25345226241a",
        password="0bkNxnvrwEPh",
        url="https://gateway.watsonplatform.net/tone-analyzer/api"
    )

    try:
        text = new_text
        tone_analysis = tone_analyzer.tone(
            {'text': text},
            'application/json').get_result()
    except WatsonApiException as ex:
        print "Method failed with status code " + str(ex.code) + ": " + ex.message

    tones = {}
    for emotion in tone_analysis['document_tone']['tones']:
        tones[emotion["tone_id"].encode('utf-8')] = emotion['score']
    return tones

def main():
    tones = watson_sentiment_analysis(sys.argv[1])
    tones['positivity'] = azure_sentiment_analysis(sys.argv[1])

    print json.dumps(tones)
    sys.stdout.flush()

if __name__ == '__main__':
    main()
