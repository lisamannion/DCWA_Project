var mysql = require('promise-mysql')
var pool

// Creating connection pool for multiple users
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
    .then((result) => { // Pool created successfully
        pool = result
    })
    .catch((error) => { // If there are errors
        console.log(error)
    })

// Returns all modules from database
var getModules = function () {
    return new Promise((resolve, reject) => {
        // Querying the database
        pool.query('select * from module')
            .then((result) => { // If all ok with the query
                resolve(result) // Resolve this promise - send back the result
            })
            .catch((error) => { // If there are query errors
                reject(error) // Reject this promise - send back error message
            })
    })
}

// Returns specified module from database
var getModule = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from module where mid =?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var updateModule = function(mid, name, credits) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update module set name = ?, credits = ? where mid = ?',
            values: [name, credits, mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var listStudentsonModule = function(mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select s.* from student s join student_module sm on s.sid = sm.sid inner join module m on sm.mid = m.mid where m.mid = ?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Returns all modules from database
var getStudents = function () {
    return new Promise((resolve, reject) => {
        // Querying the database
        pool.query('select * from student')
            .then((result) => { // If all ok with the query
                resolve(result) // Resolve this promise - send back the result
            })
            .catch((error) => { // If there are query errors
                reject(error) // Reject this promise - send back error message
            })
    })
}

// 
var addStudent = function (sid, name, gpa) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into student (sid, name, gpa) values (?, ?, ?)',
            values: [sid, name, gpa]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { getModules, getModule, updateModule, listStudentsonModule, getStudents, addStudent }