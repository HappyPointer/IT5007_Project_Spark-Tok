const { getDb } = require('./db.js');
const users = require('./users.js');
const mongod = require('mongodb');

// This function returns all paper data in the database.
// Note: This function is used for development testing and not exposed to the common users
async function paper_list() {
  const db = getDb();
  const papers = await db.collection('papers').find({}).toArray();
  return papers;
}

// The function returns a random paper, and its id is not lastPaperID
async function get_random_paper(lastPaperID) {
    const db = getDb();
    
    var papers = null;
    // The input lastPaperID is null, just random select one from database
    if (lastPaperID == null) {
        papers = await db.collection('papers').find({}).toArray();
    } 
    // The input lastPaperID is not null, we need to exclude this paper
    else {
        let last_id = new mongod.ObjectID(lastPaperID)
        papers = await db.collection('papers').find({_id: {$ne: last_id}}).toArray();
    }
    // generate a random Index
    let randIndex = Math.floor(Math.random() * papers.length);
    let newPaper = papers[randIndex];
    return newPaper;
}

// Function to handle the randomPaper API
// This function call the get_random_paper function and pack the result into recommendation formate
async function random_paper(_, { lastPaperID }) {
    let result_paper = get_random_paper(lastPaperID);
    let recommendation = {
        paper: result_paper,
        hasComment: false,
        comment: null,
    }
    return recommendation;
}

// Function to handle the recommendPaper API
// Given the user, the function return personalized recommendation result
async function recommend_paper(_, { userEmail, lastPaperID }) {
    const db = getDb();
    // check if the input userEmail exist
    const userInfo = await users.find_user(userEmail);
    // The input userEmail does not exist, downgrade to return a random papaer as recommendation
    if (userInfo.total_likes == 0) {
        let result_paper = get_random_paper(lastPaperID);
        let recommendation = {
            paper: result_paper,
            hasComment: false,
            comment: null,
        }
        return recommendation; 
    }

    // Generate random value from determining the label to recommend
    let randInterestValue = Math.floor(Math.random() * userInfo.total_likes);
    let randInterestLabelIndex = null;
    for (let i = 0; i < userInfo.like_numbers.length; i++) {
        if (randInterestValue < userInfo.like_numbers[i]) {
            randInterestLabelIndex = i;
            break;
        }
        randInterestValue -= userInfo.like_numbers[i]
    }
    // generated random label to recommend
    let randInterestLabel = userInfo.like_labels[randInterestLabelIndex];

    var papers = null;
    // When lastPaperID is null, we search from the entire database
    if (lastPaperID == null) {
        papers = await db.collection('papers').find({labels: randInterestLabel}).toArray();
    } 
    // lastPaperID is not null, we also need to exclude this paper from result
    else {
        let last_id = new mongod.ObjectID(lastPaperID)
        papers = await db.collection('papers').find({_id: {$ne: last_id}, labels: randInterestLabel}).toArray();
    }
    // Randomly select one paper from qualified papers
    let randIndex = Math.floor(Math.random() * papers.length);
    let result_paper = papers[randIndex];

    let recommendation = {
        paper: result_paper,
        hasComment: true,
        comment: "We are recommending you this paper because you seem to like -- " + randInterestLabel + " --",
    }
    return recommendation; 
}


module.exports = { paper_list, random_paper, recommend_paper };
