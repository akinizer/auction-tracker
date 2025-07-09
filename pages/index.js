import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0); // total rows from API
  const [pagesFetched, setPagesFetched] = useState(21); // hardcoded since your scraper fetches all 21 pages
  const [q, setQ] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [server, setServer] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();

    if (q.trim()) params.append('q', q);
    if (min.trim()) params.append('min', min);
    if (max.trim()) params.append('max', max);
    if (server.trim()) params.append('server', server);

    fetch(`/api/auctions?${params.toString()}`)
      .then(r => r.json())
      .then(result => {
        setData(result.rows);
        setCount(result.count);
      });
  }, [q, min, max, server]);

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Auction Price Tracker</h1>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <input placeholder="Min" value={min} onChange={e => setMin(e.target.value)} />
        <input placeholder="Max" value={max} onChange={e => setMax(e.target.value)} />
        <select value={server} onChange={e => setServer(e.target.value)}>
          <option value="">All Servers</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
      </div>

      {/* Display pages fetched and total results */}
      <div style={{ marginBottom: 10 }}>
        <strong>Pages fetched:</strong> {pagesFetched} &nbsp;|&nbsp; <strong>Results:</strong> {count}
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr><th>Title</th><th>Price</th><th>Date</th><th>Server</th></tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center' }}>No results found</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                <td>{row.title}</td>
                <td>{row.price ? Number(row.price).toLocaleString() + ' Poké' : 'N/A'}</td>
                <td>{row.date}</td>
                <td>{row.server}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
