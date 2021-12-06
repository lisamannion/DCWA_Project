var express = require('express')
var app = express()
var sqlDao = require('./mysqlDAO')
var mongoDAO = require('./mongoDAO')
var bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

// Set up for ejs templating engine
app.set('view engine', 'ejs')

// Use body parser to see what is send in request body
app.use(bodyParser.urlencoded({ extended: false }))

// Listen for get request on '/' route (Home page)
app.get('/', (req, res) => {
    // Send html file
    res.sendFile(__dirname + "/views/home.html")
})

// Listen for get request on '/listModules' route - List records in the module table (List Modules page)
app.get('/listModules', (req, res) => {
    // Call the sql data access object function
    sqlDao.getModules()
        .then((result) => { // If successful render modules view 
            res.render('modules', { modules: result })
        })
        .catch((error) => { // If any errors
            res.send(error)
        })
})

// GET request to edit selected module - Redirect to update module view (Edit Module page)
app.get('/module/edit/:mid', (req, res) => {
    // Calling the mySQL Data access object function
    sqlDao.getModule(req.params.mid)
        .then((result) => { // Rendering the view and passing relevant data
            res.render('updateModule', { errors: undefined, mid: result[0].mid, name: result[0].name, credits: result[0].credits })
        })
        .catch((error) => { // Display errors {if any)
            res.send(error)
        })
})

// POST request for Edit Module page
app.post('/module/edit/:mid', [
    check('name').isLength({ min: 5 }).withMessage("Module name must be at least 5 characters"),
    check('credits').isIn([5, 10, 15]).withMessage("Credits can be either 5, 10 or 15")], (req, res) => {
        var errors = validationResult(req)
        // If there are errors, render the update module view again
        if (!errors.isEmpty()) {
            res.render('updateModule', { errors: errors.errors, mid: req.params.mid, name: req.body.name, credits: req.body.credits })
        } else {
            // Calling data access object function
            sqlDao.updateModule(req.params.mid, req.body.name, req.body.credits)
                .then(() => {
                    // Redirect to the listModules view when the module has been successfully changed
                    res.redirect('/listModules')
                })
                .catch((error) => {
                    // Display errors (if any)
                    res.send(error)
                })
        }

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
    sqlDao.deleteStudent(req.params.sid)
        .then((result) => {
            // If result is unchanged send error message
            if (result.affectedRows == 0) {
                res.send("<h1>Error Message</h1><br><br><h2>" + req.params.sid + "doesn't exist</h2><br>")
            } else { // If affected rows then redirect to list of students
                res.redirect('/listStudents')
            }
        })
        .catch((error) => {
            // If parent row print out error message
            if (error.errno == 1451) {
                res.send("<h1>Error Message</h1><br><br><h2>" + req.params.sid + "has associated modules, he/she cannot be deleted</h2><br>")
            } else { // Display any other errors
                res.send("<h1>Other errors: </h1><br><br><h2>" + req.sqlMessage + "</h2><br>")
            }
        })
})

// GET request to add new student
app.get('/addStudent', (req, res) => {
    // Rendering the addStudent view (form)
    res.render('addStudent', { errors: undefined })
})

// POST request adding a new student
app.post('/addStudent', [
    check('sid').isLength(4).withMessage("Student ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")], (req, res) => {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('addStudent', { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })
    } else {
        sqlDao.addStudent(req.body.sid, req.body.name, req.body.gpa)
            .then(() => {
                res.redirect('/listStudents')
            })
            .catch((error) => {
                if (error.errno == 1062) {
                    res.send("<h1>Error Message</h1><br><br><h2> Student with " + req.body.sid + " already exists</h2><br>")
                } else { // Display any other errors
                    res.send("<h1>Other errors: </h1><br><br><h2>" + req.sqlMessage + "</h2><br>")
                }
            })
    }

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
    res.render('addLecturer', { errors: undefined })
})

// POST request adding a new lecturer
app.post('/addLecturer', [
    check('_id').isLength(4).withMessage("Lecturer ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('dept').isLength(3).withMessage("Department must be 3 characters")], (req, res) => {

    var errors = validationResult(req)

    // If there are errors render the view again
    if (!errors.isEmpty()) {
        res.render('addLecturer', { errors: errors.errors, _id: req.body._id, name: req.body.name, dept: req.body.dept })
    } else { // Otherwise query the database using data access object
        mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
            .then(() => {
                // Redirect to GET on /listLecturers
                res.redirect('/listLecturers')
            })
            .catch((error) => {
                res.send(error)

                // if(error.errno == 1062) {
                //     res.send("<h1>Error Message</h1><br><br><h2> Student with "  + req.body.sid + " already exists</h2><br>")
                // } else { // Display any other errors
                //     res.send("<h1>Other errors: </h1><br><br><h2>" + req.sqlMessage + "</h2><br>")
                // }
            })
    }
})

// Setting up the localhost to listen for requests on port 3004
app.listen(3004, () => {
    console.log("Listening on port 3004")
})