""" This is the class for blocks
"""
import requests
import json

class Block:
    def __init__(self):
        self.photo = "" # url
        self.prompt = "" # is this a quesiton?
        self.text = "" # the text in a block
        self.timestamp = "" # the timestamp of the block
        self.emoji = "" # TODO: What are the text version of each emoji we want?
        self.caption = "" # generated from the image to text and then the ad lib nlp model
        self.type = "" # block types: photo, fitbit, location, etc.
        self.keywords = []

    def __str__(self):
        return str({
            "photo": self.photo,
            "prompt": self.prompt,
            "text": self.text,
            "timestamp": self.timestamp,
            "emoji": self.emoji,
            "caption": self.caption,
            "type": self.type,
            "kewords": self.keywords
        })

    def return_json(self):
        return str({
            "photo": self.photo,
            "prompt": self.prompt,
            "text": self.text,
            "timestamp": self.timestamp,
            "emoji": self.emoji,
            "caption": self.caption,
            "type": self.type,
            "kewords": self.keywords
        })

    def set_photo(self, photo):
        self.photo = photo

    def get_photo(self):
        return self.photo

    def set_keywords(self):
        headers = {
            'Ocp-Apim-Subscription-Key': '59bf3be460ad434585a4b4143c470a92',
        }

        document = {'documents': [
            {'id': '1', 'text': self.text}
        ]}

        azure_url = "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/KeyPhrases"

        response = requests.post(azure_url, headers=headers, json=document)
        response = response.json()
        self.keywords = [keyword.encode('utf-8') for keyword in response['documents'][0]['keyPhrases']]

    def get_keywords(self):
        return self.keywords

    def set_prompt(self, prompt):
        self.prompt = prompt

    def get_prompt(self):
        return self.prompt


    def set_text(self, text):
        self.text = text

    def get_text(self):
        return self.text

    def set_timestamp(self, timestamp):
        self.timestamp = timestamp

    def get_timestamp(self):
        return self.timestamp

    def set_emoji(self, emoji):
        self.emoji = emoji

    def get_emoji(self):
        return self.emoji

    def set_caption(self, caption):
        self.caption = caption

    def get_caption(self):
        return self.caption

    def set_type(self, type):
        # type is photo, fitbit, location
        self.type = type

    def get_type(self):
        return self.type
