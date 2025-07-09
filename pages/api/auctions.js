const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/auctions.db');

export default function handler(req, res) {
  const { q = '', min = '', max = '', server = '', dateFrom = '', dateTo = '', category = '' } = req.query;

  let whereClause = ' WHERE 1=1';
  const params = [];

  if (q) {
    whereClause += ' AND title LIKE ?';
    params.push(`%${q}%`);
  }
  if (min) {
    whereClause += ' AND price >= ?';
    params.push(min);
  }
  if (max) {
    whereClause += ' AND price <= ?';
    params.push(max);
  }
  if (server) {
    if (server.toLowerCase() !== 'all') {
      whereClause += ' AND server = ?';
      params.push(server);
    }
  }
  if (dateFrom) {
    whereClause += ' AND date >= ?';
    params.push(dateFrom);
  }
  if (dateTo) {
    whereClause += ' AND date <= ?';
    params.push(dateTo);
  }
  if (category && category !== 'all') {
    whereClause += ' AND category = ?';
    params.push(category);
  }

  db.get(`SELECT COUNT(*) as count FROM auctions${whereClause}`, params, (err, countRow) => {
    if (err) {
      console.error('DB count error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const count = countRow.count;

    db.all(`SELECT * FROM auctions${whereClause} ORDER BY date DESC`, params, (err, rows) => {
      if (err) {
        console.error('DB rows error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ count, rows });
    });
  });

}
