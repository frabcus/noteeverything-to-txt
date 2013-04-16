#!/usr/local/bin/node

// Run with notes.db in current directory
// It makes a directory notes with the converted notes in

var fs = require('fs')
var sqlite3 = require('sqlite3')
var http = require('http')
var assert = require('assert')

// Make notes directory
if (!fs.existsSync("notes")) {
  fs.mkdirSync("notes")
}

// Remove chars and lowercase
function simplify(s) {
  return s.replace(/\s+$/, '').replace(/\//g, ' ').replace(/ - /g, '_').replace(/ /g, '_').replace(/,/g, '').toLowerCase()
}

// Setup database
var db = new sqlite3.Database('notes.db')
db.each("SELECT folder, title, body FROM notes WHERE is_folder != 1", function(err, row) {
  if (row.folder != '▼') {
    //console.log(err, row)

    var folder = "notes/" + simplify(row.folder.replace('►', '')) + "/"
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }

    var file = folder + simplify(row.title) + ".txt"
    fs.writeFileSync(file, row.body)
  }
})


