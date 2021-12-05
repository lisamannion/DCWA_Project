const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'lecturersDB'
const colName = 'lecturers'

var lectDB
var lect

// Connect to the database
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        // Setting up the database in lectDB
        lectDB = client.db(dbName)
        // Setting up the collection variable
        lect = lectDB.collection(colName)
    })
    .catch((error) => {
        console.log(error)
    })

// Retrieve all lecturers function
var getLecturers = function () {
    return new Promise((resolve, reject) => {
        var cursor = lect.find()
        // Returns an array in the form of a promise
        cursor.toArray()
            .then((docs) => {
                resolve(docs)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Function to add a lecturer
var addLecturer = function (id, name, dept) {
    return new Promise((resolve, reject) => {
        lect.insertOne({ _id: id, name: name, dept: dept })
            .then((docs) => {
                console.log(docs)
                resolve(docs)
            })
            .catch((error) => {
                reject(error)
            })

    })
}

// Exports - functions can be elsewhere in the project
module.exports = { getLecturers, addLecturer }