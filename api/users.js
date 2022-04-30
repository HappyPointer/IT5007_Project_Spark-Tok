const { getDb } = require('./db.js');

// This function returns all user data in the database
// Note: This function is only to development testing and is not exposed to common users
async function user_list() {
  const db = getDb();
  const users = await db.collection('users').find({}).toArray();
  return users;
}

// This function returns the user that has the indicated Email address
// Note: This function is only to development testing and is not exposed to common users
async function find_user(u_email) {
    const db = getDb();
    let user = await db.collection('users').find({email: u_email}).toArray();
    user = user[0];
    return user;
}

// This function handles the addUser API
// Funtion adds a new user to database given email and password
async function add_user(_, { u_email, u_password }) {
    const db = getDb();
    // check whether this email has already been registered
    const check_result = await db.collection('users').find({email: u_email}).toArray();
    if (check_result.length > 0) {
        console.log("user already exist!");
        return "Email already registered!"
    } 
    // The email has not been registered, insert a new user data
    else {
        await db.collection('users').insertOne({email:u_email, pwd: u_password, total_likes: 0, like_labels:[], like_numbers:[]})
        return "User registered successfully!"
    }
}

// This function handles the likePaper API
// Function updates the user's interest data based on the given set of labels
async function likes_paper(_, { u_email, labels }) {
    const db = getDb();
    // The front end is not supposed to give an email that does not exist. If the front-end do so, an error message is returned
    let current_user = await db.collection('users').find({email: u_email}).toArray();
    current_user = current_user[0];
    for (let i = 0; i < labels.length; i++) {
        // Update user's like_labels and like_numbers fields
        let new_label = labels[i];
        let new_label_index = current_user.like_labels.findIndex((item) => item == new_label);
        if (new_label_index == -1) {
            current_user.like_labels.push(new_label);
            current_user.like_numbers.push(1);
        }
        else {
            current_user.like_numbers[new_label_index] += 1;
        }
        current_user.total_likes = current_user.total_likes + 1;
    }

    // Update the new user data into database
    await db.collection('users').updateOne({ email: u_email }, 
        {$set: { 
            total_likes: current_user.total_likes,
            like_labels: current_user.like_labels,
            like_numbers: current_user.like_numbers
        }});

    return current_user;
}

// This function handles the checkLogin API
// Function returns true if the password is correct and returns false otherwise
async function check_login(_, { userEmail, userPWD }) {
    const db = getDb();
    let check_user_result = await db.collection('users').find({email: userEmail}).toArray();
    // The input userEmail does not exist, return false
    if (check_user_result.length == 0) {
        return false;
    }
    else {
        let user_info = check_user_result[0];
        // The userEmail exists and the password is correct
        if (userPWD == user_info.pwd) {
            return true;
        } 
        // The userEmail exists but the password is not correct
        else {
            return false;
        }
    }
}


module.exports = { user_list, find_user, add_user, likes_paper, check_login };
