from Block import *

""" This is the class for the day view of the journal. Each day will contain multiple blocks
"""
class Day:
    def __init__(self):
        self.blocks = []
        self.date = "" #YYYYMMDD
        self.weather = ""
        self.heading = "" # not too sure what will populate this
        self.keywords = []

    def __str__(self):
        return str({
            "blocks": [block.return_json() for block in self.blocks],
            "date": self.date,
            "weather": self.weather,
            "heading": self.heading,
            "keywords": self.keywords
        })

    def return_day_json(self):
        return str({
            "blocks": [block.return_json() for block in self.blocks],
            "date": self.date,
            "weather": self.weather,
            "heading": self.heading,
            "keywords": self.keywords
        })

    def add_block(self, block):
        """ Appends a block to the list of blocks
        """
        self.blocks.append(block)

        # TODO: how to get blocks or return as a json? is this the __str__ function?

    def add_keywords(self, block):
        [self.keywords.append(keyword) for keyword in block.get_keywords()]

    def add_all_keywords(self):
        # for block in self.blocks:
            # self.keywords.append(block.get_keywords())
        for block in self.blocks:
            [self.keywords.append(keyword) for keyword in block.get_keywords()]
        # [self.keywords.append(keyword) for keyword in block.get_keywords() for block in self.blocks]

    def get_keywords(self):
        return self.keywords

    def set_date(self, date):
        self.date = date

    def get_date(self):
        return self.date


    def set_weather(self, weather):
        self.weather = weather

    def get_weather(self):
        return self.weather


    def set_heading(self, heading):
        self.heading = heading

    def get_heading(self):
        return self.heading
