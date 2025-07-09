const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/auctions.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS auctions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price INTEGER,
    date TEXT,
    server TEXT
  )`);
});

db.close();