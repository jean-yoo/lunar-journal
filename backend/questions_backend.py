import random
class QuestionGeneration(object):
    def __init__(self):
        pass

    def askGeneralQ(self):
        return random.choice(["What is something that bugged you today?",
        "What is something you should work on?",
        "What was your favorite thing about today?",
        "Who did you talk to today and about what?",
        "What were you grateful for today?",
        "Did you notice anything different today?",
        "What did you accomplish today?",
        "Did you find a chance to get outside today?",
        "Were you able to exercise today?",
        "What are a few words that capture today?",
        "How do you feel today?",
        "Did anyone inspire you today?",
        "Did you learn anything new today?",
        "Are you feeling stressed?",
        "Any good music recently?",
        "Did anything inspire you today?",
        "What is something you want to do tomorrow?",
        "What is something you want to do this weekend?",
        "What is something you want to do soon?",
        "Were you reminded of home today?",
        "What is something you want to work on tomorrow?",
        "Did you get enough sleep recently?"])

    def askLocationQ(self, location):
        return random.choice(["What did you do in %s?" %location,
        "Why did you go to %s?" %location,
        "What did you eat in %s while you were there?" %location,
        "Who did you meet in %s?" %location,
        "First time in %s?" %location,
        "Have you ever been to %s before?" %location,
        "Did going to %s inspire you to go somewhere?" %location])

    def askActivityQ(self, activity):
        return random.choice(["How did %s go?" %activity,
        "Can you tell me more about your %s experience?" %activity,
        "Was %s fun?" %activity,
        "Do you want to go %s again soon?" %activity,
        "Are there other good places to go %s nearby?" %activity])

    def askFoodQ(self, food):
        return random.choice(["How was your meal?",
        "Have a good meal?",
        "Would you get the same meal again?",
        "How does this compare to similar restaurants?",
        "How was the dining service?",
        "How was the dining atmosphere?",
        "Was there something else on the menu you wanted to try?"])

    def askDateVerbQ(self, date, verb):
        return random.choice(["You went %s on %s as well, how does it compare?" %(verb, date),
        "Do you wish you went %s more often?" %verb])

    def askPeopleQ(self):
        return random.choice(["With friends?",
        "Who were you with?"])

    def askCompActivityQ(self, verb_ing, date, location):
        """ Given that the verb was an ing verb:
        """
        return random.choice(["How was %s this time compared to %s on %s at %s?" %(verb_ing, verb_ing, date, location),
        "You went %s on %s as well, how does it compare?" %(verb_ing, date), "How does %s at %s compare?" %(verb_ing, location)])
