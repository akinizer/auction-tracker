import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/auctions.db');

export default function handler(req, res) {
  const { q = '', min = '', max = '', server = '' } = req.query;

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
    whereClause += ' AND server = ?';
    params.push(server);
  }

  // First get total count
  db.get(`SELECT COUNT(*) as count FROM auctions${whereClause}`, params, (err, countRow) => {
    if (err) {
      console.error('DB count error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const count = countRow.count;

    // Then get all rows (or add LIMIT/OFFSET if needed)
    db.all(`SELECT * FROM auctions${whereClause} ORDER BY date DESC`, params, (err, rows) => {
      if (err) {
        console.error('DB rows error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Respond with count and rows
      res.status(200).json({ count, rows });
    });
  });
}
