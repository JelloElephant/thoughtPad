const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
const uuid = require('./helpers/uuid')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))


// GET request for home path
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for notes path
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request to pull notes from our database
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
})

// POST request to take current note and add it to our database
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"))

    const newNote = {
        ...req.body,
        id: uuid()
    }

    notes.push(newNote)
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))

    res.json(notes)

})

// DELETE request to remove a note from our database
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"))
    const xNote = notes.filter((doneNote) => doneNote.id !== req.params.id)
    fs.writeFileSync("./db/db.json", JSON.stringify(xNote))
    res.json(xNote)

})

// LISTEN request to verify that server is running
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
)