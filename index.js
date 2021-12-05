var express = require('express')
var app = express()
var sqlDao = require('./mysqlDAO')
var mongoDAO = require('./mongoDAO')
var bodyParser = require('body-parser')

// Set up for ejs templating engine
app.set('view engine', 'ejs')

// Use body parser to see what is send in request body
app.use(bodyParser.urlencoded({ extended: false }))

// Listen for get request on '/' route (Home page)
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/home.html")
})

// Listen for get request on '/' route - List records in the module table (List Modules page)
app.get('/listModules', (req, res) => {
    //console.log("GET on /listModules")
    sqlDao.getModules()
        .then((result) => {
            res.render('modules', { modules: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

// GET request to edit selected module - Redirect to update module view (Edit Module page)
app.get('/module/edit/:mid', (req, res) => {
    // Calling the mySQL Data access object function
    sqlDao.getModule(req.params.mid)
        .then((result) => {
            // Rendering the view and passing relevant data
            res.render('updateModule', { mid: result[0].mid, name: result[0].name, credits: result[0].credits })
        })
        .catch((error) => {
            // Display errors {if any)
            res.send(error)
        })
})

// POST request for Edit Module page
app.post('/module/edit/:mid', (req, res) => {
    // Calling data access object function
    sqlDao.updateModule(req.params.mid, req.body.name, req.body.credits)
        .then((result) => {
            // Redirect to the listModules view when the module has been successfully changed
            res.redirect('/listModules')
        })
        .catch((error) => {
            // Display errors (if any)
            res.send(error)
        })
})

// GET request to list the students which are taking the selected module only
app.get('/module/students/:mid', (req, res) => {
    // Calling DAO function
    sqlDao.listStudentsonModule(req.params.mid)
        .then((result) => {
            // Render the studentModule view to display results
            res.render('studentModule', { students: result, mid: req.params.mid })
        })
        .catch((error) => {
            // Display errors (if any)
            res.send(error)
        })
})

// GET on /listStudents - Displays student details
app.get('/listStudents', (req, res) => {
    // Calling getStudents function from DAO
    sqlDao.getStudents()
        .then((result) => {
            // Rendering the students view for display of results
            res.render('students', { students: result })
        })
        .catch((error) => {
            // Display errors if any occur
            res.send(error)
        })
})

// GET request when attempting to delete a student from the database
app.get('/students/delete/:sid', (req, res) => {

})

// GET request to add new student
app.get('/addStudent', (req, res) => {
    // Rendering the addStudent view (form)
    res.render('addStudent')
})

// POST request adding a new student
app.post('/addStudent', (req, res) => {
    sqlDao.addStudent(req.body.sid, req.body.name, req.body.gpa)
        .then(() => {
            res.redirect('/listStudents')
        })
        .catch((error) => {
            res.send(error)
        })
})

// Listen for get request on '/listLecturers' route - List records in the lecturers collection (MongoDB)
app.get('/listLecturers', (req, res) => {
    // Calling the mongo DAO function
    mongoDAO.getLecturers()
        .then((docs) => {
            res.render('lecturers', { listLect: docs })
        })
        .catch((error) => {
            res.send(error)
            console.log(error)
        })
})

// GET request to add new lecturer
app.get('/addLecturer', (req, res) => {
    // Rendering the addLecturer view (form)
    res.render('addLecturer')
})

// POST request adding a new lecturer
app.post('/addLecturer', (req, res) => {
    console.log(req.body)
    mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
        .then(() => {
            res.redirect('/listLecturers')
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
})

// Setting up the localhost to listen for requests on port 3004
app.listen(3004, () => {
    console.log("Listening on port 3004")
})