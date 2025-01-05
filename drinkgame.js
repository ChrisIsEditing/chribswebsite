export const gameQuestions = {
    drinkingPrompts: [
        "Take a shot if you've ever ghosted someone",
        "Everyone who has sent a drunk message about talking about how they love someone, drinks",
        "Whoever was the last person to go on a date drinks twice",
        "The tallest person assigns 2 drinks",
        "If you're wearing black, drink",
        "Make up a rule that lasts for 3 rounds",
        "Waterfall! Last person to raise their hand drinks",
        "Truth or drink: Share your most embarrassing date story",
        "Categories: Name types of alcohol. Loser drinks",
        "True ",
        "Rock, paper, scissors with the person to your right. Loser drinks",
        "Everyone vote who's most likely to text their ex tonight. They drink",
        "Youngest player gives out 2 drinks",
        "Players with siblings each take a drink",
        "If you have a tattoo, give out 2 drinks",
        "If you're the oldest player, drink twice",
        "Anyone who still uses Snapchat must drink",
        "Drink if you've ever snooped through someone's phone",
        "Anyone who owns a pet takes a drink",
        "If you have a Spotify playlist named 'Party' or similar, drink twice",
        "Anyone who has ever lied about their age drinks once",
    ],
    
    challenges: [
        "Dance battle!!! Loser drinks",
        "Speak in an accent for the next 5 rounds or drink",
        "Do your best impression of another player or drink",
        "Tell a joke - if no one laughs, drink",
        "Arm wrestling challenge - winner gives out 3 drinks",
        "Take a silly selfie or drink once",
        "Show the last message you sent or drink",
        "Play air guitar until the next round is over or drink twice",
        "Let another player post on your Instagram Story or drink",
        "Call the 5th person in your contacts or drink"
    ],

    groupActivities: [
        "Two truths and a lie - everyone who guesses wrong drinks",
        "Word association chain - mess up and drink",
        "Rhyme chain - whoever can't rhyme must drink",
        "Quick draw! Everyone point a finger gun! Last to do it drinks.",
        "Count in 2s - whoever messes up the count drinks twice",
        "Do 10 pushups | Last group to finish drinks 2 times. No water.",

    ],

    nsfw: [
        "Take a shot if you've ever sent nudes acidentally.",
        "Take 2 shots if you have ever sent nudes on purpose.",
        "Everyone who has kissed someone at a party, drinks",
        "Try explaining what a blowjob is without directly saying it, if you can't, drink",
        "Everyone who hasn't had mastrubated in more than a month, drink",
        "Using only your mouth, get a shot into someone else's mouth.",
        "Take off your shirt or drink",
        "Pick someone to guess your underwear. If they guess right, you drink. If they don't, they drink",
    ]

};

export const gameModes = {
    casual: ['drinkingPrompts'],
    party: ['drinkingPrompts', 'challenges'],
    extreme: ['challenges',],
    nsfw: ['nsfw'],
};

export const specialRules = {
    doublePoints: false,
    cascadingDrinks: false,
    teamMode: false
};

export const modeRules = {
    casual: {
        drinkAmount: 1,
        skipAllowed: true,
        challengePenalty: 1,
        timeLimit: false
    },
    party: {
        drinkAmount: 1,
        skipAllowed: true,
        challengePenalty: 2,
        timeLimit: 20 
    },
    extreme: {
        drinkAmount: 2,
        skipAllowed: true,
        challengePenalty: 2,
        timeLimit: 10 
    },
    nsfw: {
        drinkAmount: 1,
        skipAllowed: true,
        challengePenalty: 2,
        timeLimit: false
    }
};