const Database = require('better-sqlite3');
const path = require('path');

let dbPath;
try{
   const { app } = require('electron');
   dbPath = path.join(app.getPath('userData'), 'offleet.db');
}catch{
    dbPath = path.join(__dirname, 'offleet.db');
}
 const db = new Database(dbPath);
 
module.exports = db;