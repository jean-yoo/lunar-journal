const express = require('express');
const fetch = require('node-fetch')
const moment = require('moment')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const spawn = require("child_process").spawn;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    "origin": "*",
    "methods": "GET,POST",
    "allowedHeaders": ['Origin, X-Requested-With, Content-Type, Accept'],
    "credentials": true
}

app.use(cors(corsOptions));

app.locals.keyword_dict = {
    'fishing': {
        'date': ["Sep-11-2018", "Sep-16-2018"],
        'pos': "VBG",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-11-2018",'San Francisco, CA'], ["Sep-16-2018", "Wenatche, WA"]]
    },
    'bridge': {
        'date': ["Sep-13-2018", "Sep-16-2018"],
        'pos': "NN",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "location",
        'comp': [["Sep-13-2018",'San Francisco, CA'], ["Sep-16-2018", "Wenatche, WA"]]
    },
    'boat': {
        'date': ["Sep-13-2018", "Sep-16-2018"],
        'pos': "NN",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-13-2018",'San Francisco, CA'], ["Sep-16-2018", "Wenatche, WA"]]
    },
    'golfing': {
        'date': ["Sep-13-2018"],
        'pos': "VBG",
        'location':['San Francisco, CA'],
        'type': "activity",
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'Golden Gate Bridge': {
        'date': ["Sep-13-2018"],
        'pos': "NN",
        'location':['San Francisco, CA'],
        'type': "location",
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'boating': {
        'date': ["Sep-14-2018"],
        'pos': "VBG",
        'location':['San Francisco, CA'],
        'type': "activity",
        'comp': [["Sep-14-2018", "San Francisco, CA"]]
    },
    'camping': {
        'date': ["Sep-15-2018"],
        'pos': "VBG",
        'location':['Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-15-2018", "Wenatche, WA"]]
    },
    'sunset chasing': {
        'date': ["Sep-14-2018"],
        'pos': "VBG",
        'location':['Big Sur, CA'],
        'type': "activity",
        'comp': [["Sep-14-2018", "Big Sur, CA"]]
    },
    'San Francisco, CA': {
        'date': ["Sep-13-2018"],
        'pos': "NN",
        'location' : ['San Francisco, CA'],
        'type': 'location',
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'Wenatche, WA': {
        'date': ['Sep-16-2018'],
        'pos': 'NN',
        'location': ['Wenatche, WA'],
        'type': 'location',
        'comp': [["Sep-16-2018", "Wenatche, WA"]]
    },
    'Big Sur, CA': {
        'date': ['Sep-14-2018'],
        'pos': 'NN',
        'location' : ['Big Sur'],
        'type': 'location',
        'comp':[["Sep-14-2018", "Big Sur, CA"]]
    }
}


app.locals.corpus = {
    'corpus': [
        'test',
        'test'
        //list of all the text
        // ['block's text', 'block's text']
    ]
}

app.locals.storedBlocks = []

app.locals.dashboards = {
    '9-14-2018': {
        'temperature': 80,
        'steps': 11000,
        'sleep': '9 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    '9-15-2018': {
        'temperature': 75,
        'steps': 8000,
        'sleep': '7 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    '9-16-2018': {
        'temperature': 61,
        'steps': 4000,
        'sleep': '0 hr 0 min',
        'weather': 'sunny',
        'mood': 'tired'
    }
}

app.locals.emojis = ['☀️', '☀️','☀️','☀️','☀️','☀️','🌤','🌤','🌤','⛅️','⛅️','⛅️', '🌥','🌦', '🌧', '⛈', '🌩','🌨','️☔️','☂️']

app.locals.hasNewBlocks = true

app.locals.prompts = {
    'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
}
// i pass keyword_dict, corpus, current_text at once to Henry/python
// i get back prompts

app.get('/', (req, res) => {
    // while (!detected) {
    //     continue
    // }
    console.log('received get req!!')
    res.send({'Express': 'Hello!'})
});

// routes for phone
app.get('/mobile/images/:id', (req, res) => {
    // extract location & timestamp
    // send to im2txt
    // send to google cloud vision
    console.log('received req')
    const current_dict = JSON.stringify(app.locals.keyword_dict);
    // console.log(current_dict)
    const url = 'https://storage.googleapis.com/project-tao/kastanByLake.jpg'
    //  console.log(url)
    const pythonProcess = spawn('python2', ["gcloud/im2Prompt.py", url, current_dict]);
    pythonProcess.stdout.on('data', (data) => {
        var parsed = JSON.parse(data.toString())
        console.log(parsed)
        addImageBlock(parsed)
        res.send({
            'generated_block': data.toString()
        })
        console.log('added new image block!')
    })
})
app.get('/mobile/location/:id', (req, res) => {
    // if they were at this location for a long time (10min+?)
    // send to places api
    // create map snippet (maybe this should be done on front end?)
    // get caption for location
    // send back to front end
})

// routes for web app
app.get('/client/prompts/:id', (req, res) => {
    // user sends text, send back list of prompts
    // const pythonProcess = spawn('python', ["question_generation.py", app.locals.keyword_dict, app.locals.corpus, req.params.id]);
    // pythonProcess.stdout.on('data', (data) => {
    //     // Do something with the data returned from python script
    //     var textChunk = data.toString('utf8');
    //     console.log(textChunk)
    // });
    let day = 'test'
    // if (req.params.id == 'reset') {
    //     console.log('resetting prompts!!')
    //     app.locals.prompts = {
    //         'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
    //     }
    // }
    let prompts = app.locals.prompts[day]
    console.log('sending prompts back', prompts)
    res.send({ prompts: prompts});
})

app.post('/client/sentiments/:id', (req, res) => {
    // user sends text, send back list of prompts
    console.log(req.body.rawText)

    const pythonProcess = spawn('python', ["sentiment_analysis.py", app.locals.keyword_dict, req.body.rawText]);
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        // var textChunk = data.toString('utf8');

        console.log(data.toString())
        res.send({ prompts: data.toString() });
    });
    let day = 'test'
    let prompts = app.locals.prompts[day]
    // console.log('sending prompts back', prompts)
})

// routes for web app
app.post('/client/text/:id', (req, res) => {
    // user sends text, send back list of prompts
    console.log(req.body.newSentence)
    const pythonProcess = spawn('python', ["question_generation.py", JSON.stringify(app.locals.keyword_dict), JSON.stringify(app.locals.corpus), req.body.newSentence]);
    let day = 'test'
    var newPrompts = app.locals.prompts[day]
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        // var temp = JSON.parse(data.toString());
        // console.log(data.toString('utf8'))
        // newPrompts.push(data)
        // var array = JSON.parse(data.toString())
        var strings = data.toString('utf8').split("\n");
        strings.pop()
        // dataString = dataString.substring(0, dataString.length-1);
        // console.log(JSON.parse(dataString))
        console.log(strings)
        let mergedPrompts = newPrompts.concat(strings)
        // console.log(mergedPrompts)
        req.app.locals.prompts[day] = [...new Set(mergedPrompts)]
        // var textChunk = data.toString('utf8');
        res.send({ prompts: app.locals.prompts[day]});
    });
    // console.log('new prompts: ', newPrompts);
})

app.get('/client/blocks/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')
    if (req.params.id == 'reset') {
        app.locals.hasNewBlocks = true
        // app.locals.storedBlocks = []
        app.locals.prompts = {
            'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
        }
    }
    const hasNewBlocks = app.locals.hasNewBlocks
    app.locals.hasNewBlocks = false
    // console.log(hasNewBlocks)
    var blocks = app.locals.storedBlocks
    blocks = blocks.concat([createRockClimbingBlock(), createFitbitBlock()])
    if (hasNewBlocks) {
        res.send({ blocks: blocks, hasNewBlocks: hasNewBlocks });
        console.log('sent block back')
    }
})

app.get('/client/dashboard/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')

    console.log('dashboard', app.locals.dashboards[req.params.id])
    res.send({ dashboard: app.locals.dashboards[req.params.id]});
    console.log('sent dashboard back')
})

app.get('/client/fitbit/:id', (req, res) => {
    // user sends fitbit activity data here
})

function createMiniBlockFromType(type, data) {
    if (type == 'image') {
        return {
                    "object": "block",
                    "type": type,
                    "data": {
                        "src": data,
                        "emojis": "🌲",
                        "mood": "😀"
                    }
                }
    } else {
        return {
            "object": "block",
            "type": type,
            "nodes": [
                {
                    "object": "text",
                    "leaves": [
                        {
                            "text": data
                        }
                    ]
                }
            ]
        }
    }
}


function addImageBlock(imageDict) {
    let timestamp = { 'type': 'timestamp', 'data': imageDict.timestamp }
    let image = { 'type': 'image', 'data': imageDict.image }
    let imagePrompt = { 'type': 'imagePrompt', 'data': imageDict.imagePrompt }
    let caption = { 'type': 'caption', 'data': imageDict.caption.slice(0, 1).toUpperCase() + imageDict.caption.slice(1) }
    let block = [timestamp, caption, image, imagePrompt]
    app.locals.storedBlocks.push(createBlockFrom(block))
}

function createFitbitBlock() {
    let timestamp = '2:30 pm ' + app.locals.emojis[Math.floor(Math.random() * app.locals.emojis.length)]
    let caption = 'Afternoon Run'

    let block = [
        {'type': 'timestamp', 'data': timestamp},
        {'type': 'caption', 'data': caption},
        {'type': 'fitbit', 'data': ''},
    ]

    return createBlockFrom(block)

}

function createBlockFrom(block) {
    var parsedBlock = block.map(miniBlock => {
        return createMiniBlockFromType(miniBlock['type'], miniBlock['data'])
    })

    parsedBlock.push(createMiniBlockFromType('paragraph', 'Start typing here and more prompts will magically pop up!\nTry it out for yourself!'))
    return {
        "document": {
            "nodes": parsedBlock
        }
    }
}

// get list of places
function getPlacesFromCoordinates() {
    // query GOOGLE PLACES
    // return best place
}

// cloud vision
function queryCloudVision() {
    // get back labels, moods, landmarks

    // if has mood, add interval

    // if has landmark, add to backend user tag dictionary

    //
}

function createRockClimbingBlock() {
    let timestamp = '11:30 am ☀️'
    let caption = 'Rock climbing at Rumney in the morning'
    let image = "https://lh3.googleusercontent.com/uvrsxcQ4isRnWlw8Q3f7V4ToaTGB7Q9eW7jXGYbR68HdjZrBZT2K4OCxPMvDjrXRqbdRzS3u-GLvdHeaIAUsFl0UB2PjDeL0zy5to0u3Lwfahi-ZDcu2PezOsaP5IiYhhhqYMlSAg5xpLhRmeQa4jnEB9Y5YVStlDRwkH_2y57u1FWwr5RW9nSjXZPCX1HrtbMM_Qeg5JwPkkweL7LoYhpGcD0AAEKjKiAVIxu6HdDejYwkK7dDu2pjlOlPGkePeWuWTBwTuFRnPscN-ZSZbytN1AXku_QwKUQBLCRWQZtli0MswyXx9k8n5usTzFAi4UMOEMV7E-8JUxoApUEnVqRmjmUwAwVGZv1QVXUdV8Z-E38frlPI3UX_mw4GA0Ey1tfsgjtalE-G6qRpLPXz9uJtUdpg9WHUttCbrkYI4Z1JnrZG-Bpsd_slKiPgmL7nIWzUzlZfT43UQEtqmIQ367bYkj1F1MG23Kw8ZFaKwmugW772g0xi-MISFVtr3sWxiV2AiN9_lYaBPh4J-BR0sALoYKPNDcmqzBcBmUahzy7Dpojy1X_ceTryOQQfq09Fuy1Dhwai2Z0PDPRrrHlExapkn8uCWKX5KMIEQfF7AEPwnDLZqFy5bRYbveSBHu2A=w738-h984-no"
    let imagePrompt = "How did rock climbing go?"

    let block = [
        {'type': 'timestamp', 'data': timestamp},
        {'type': 'caption', 'data': caption},
        {'type': 'image', 'data': image},
        {'type': 'imagePrompt', 'data': imagePrompt},
    ]
    return createBlockFrom(block)
}

// im2txt
function im2txt() {
    // get back caption
}

app.listen(port, () => console.log(`Listening on port ${port}`));
