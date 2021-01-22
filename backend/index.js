const { request } = require('express')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const db_functs = require('./db_functs.js')
var bodyParser = require('body-parser')
var path = require("path");
const fs = require('fs');


const app = express()
app.use(bodyParser.json())

const port = 3001
const DBSOURCE = "db.sqlite"


const messages = [{"id": 1},{"id": 2},{"id": 3},{"id": 4},{"id": 5},{"id": 6},{"id": 7},{"id": 8}]
const index = 0

app.get('/messages', (req, res) => {
    const decode = req.query.next ? Buffer.from(req.query.next, "base64").toString() : ""
    let last_index = 0
    if (decode !== "") {
        parsed_decode = JSON.parse(decode)
        if (parsed_decode["author"] != req.query["author"] || parsed_decode["channel"] != req.query["channel"])
            return res.sendStatus(400)
        const last_id = parsed_decode["last_id"]
        console.log(messages.map((x) => {return x.id}))
        last_index = messages.map((x) => {return x.id}).indexOf(last_id)
    }
    let data = messages.slice().reverse().slice(last_index)
    //console.log(parseInt(req.query.count), messages.slice(last_index), last_index)
    const count = req.query.count ? parseInt(req.query.count) : 10
    json = {
        "last_id": data[count].id, 
        "author": req.query.author, 
        "channel": req.query.channel
    }
    console.log(data[count].id)
    let next = Buffer.from(JSON.stringify(json)).toString("base64")
    if (data.length <= count) next = ""
    data = data.slice(0, count)
    return res.json({"data": data, "paging": {"next": next}})
})

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')

        let rawdata = fs.readFileSync('db_setup.json');
        let lines = JSON.parse(rawdata);
        for (line of lines) {
            db.run(line,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log("Table already exists")
                    }
                });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/dashboards', (req, res) => {
    try {
        const data = db_functs.get(DBSOURCE, "Dashboard", res)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})

app.get('/dashboard/:id', (req, res) => {
    const id = req.params.id
    try {
        const data = db_functs.get(DBSOURCE, "Dashboard", res, filter = "id", fvalue = id)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})

app.get('/lists/:dashboardid', (req, res) => {
    const did = req.params.dashboardid
    try {
        const data = db_functs.get(DBSOURCE, "List", res, filter = "dashboardid", fvalue = did)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})

app.get('/elements/:dashboardid', (req, res) => {
    const did = req.params.dashboardid
    try {
        db_functs.get(DBSOURCE, "Element", res, filter = "dashboardid", fvalue = did)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})

app.get('/listobjects/:eid', (req, res) => {
    const lid = req.params.eid
    try {
        db_functs.get(DBSOURCE, "ListObject", res, filter="elementid", fvalue = lid)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})
app.get('/notes/:eid', (req, res) => {
    const lid = req.params.eid
    try {
        db_functs.get(DBSOURCE, "Note", res, filter="elementid", fvalue = lid)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})
app.get('/photos/:eid', (req, res) => {
    const lid = req.params.eid 
    try {
        db_functs.get(DBSOURCE, "Photo", res, filter="elementid", fvalue = lid)
    } catch (err) {
        console.log(err)
        res.status(400).json({ "message": "issues in backend" })
    }
})

app.get('/photo/:path', (req, res) => {
    const path0 = req.params.path
    var root = path.dirname(require.main.filename)
    console.log(path0)
    var absolutePath = path.join(root,"./images/"+path0)
    res.sendFile(absolutePath);
})

app.post('/dashboard', function(req, res) {
    const d_name = req.body.name
    db.run("INSERT INTO Dashboard(name) VALUES (?)", [d_name])
    res.send("ADDED");
});


app.post('/element', function(req, res) {
    const name = req.body.name
    const id = req.body.did
    const type = req.body.type
    db.run("INSERT INTO Element(name, dashboardid, type) VALUES (?,?, ?)", [name,id, type])
    res.send("ADDED");
});

const multer = require('multer');
const upload = multer();


app.post('/photo', upload.any(), function(req, res) {
    const eid = req.body.id
    const files = req.files
    console.log(files[0])
    const name = "image" + eid + ".jpg"
    fs.open("images/"+name, "w", (err, fd) => {
        fs.write(fd, files[0].buffer, function (err) {
            if (err) console.log(err);
            console.log('worked =)');
          })
    })
    
    db.run("INSERT INTO Photo(elementid, path) VALUES (?,?)", [eid, name])
    res.send("ADDED");
});

app.post('/note', function(req, res) {
    const eid = req.body.id
    const body = req.body.body
    db.run("INSERT INTO Note(elementid, body) VALUES (?,?)", [eid,body])
    res.send("ADDED");
});

app.post('/listobject', function(req, res) {
    const title = req.body.name
    const eid = req.body.id
    db.run("INSERT INTO ListObject(title, elementid) VALUES (?,?)", [title, eid])
    res.send("ADDED");
});

app.delete('/dashboard/:id', function(req, res) {
    const id = req.params.id
    const d = "DELETE FROM Dashboard WHERE id="+id
    db.run(d)
    res.send("DELETED")
})

app.delete('/element/:id', function(req, res) {
    const id = req.params.id
    db.all("SELECT * FROM Photo WHERE elementid=" + id, (err, rows) => {
        if (rows.length !== 0) {
            const image = rows[0].path 
            fs.unlink('images/' + image, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
              });
        }
    })
    const d = "DELETE FROM Element WHERE id="+id
    db.run(d)
    res.send("DELETED")
})

app.delete('/listobject/:id', function(req, res) {
    const id = req.params.id
    const d = "DELETE FROM ListObject WHERE id="+id
    db.run(d)
    res.send("DELETED")
})