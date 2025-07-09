import { useState, useEffect } from 'react';

const CATEGORIES = [
  { key: 'all',     label: 'All' },
  { key: 'pokemon', label: 'Pokémon' },
  { key: 'items',   label: 'Items' },
  { key: 'mounts',  label: 'Mounts' },
  { key: 'rares',   label: 'Rares/Events' },
  { key: 'pvp',     label: 'PvP-ready' },
];

export default function Home() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [pagesFetched] = useState(21);

  // Filters
  const [q, setQ] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [server, setServer] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams();
    if (q)           params.append('q', q);
    if (dateFrom)    params.append('dateFrom', dateFrom);
    if (dateTo)      params.append('dateTo', dateTo);
    if (minPrice)    params.append('min', minPrice);
    if (maxPrice < 5000000) params.append('max', maxPrice);
    if (server)      params.append('server', server);
    if (category !== 'all') params.append('category', category);

    fetch(`/api/auctions?${params.toString()}`)
      .then(r => r.json())
      .then(result => {
        setData(result.rows);
        setCount(result.count);
      });
  }, [q, dateFrom, dateTo, minPrice, maxPrice, server, category]);

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Auction Price Tracker</h1>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        {/* Keyword */}
        <input
          type="text"
          placeholder="Search..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ width: '140px', padding: '4px' }}
        />

        {/* Date From */}
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          style={{ width: '120px', padding: '4px' }}
        />

        {/* Date To */}
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          style={{ width: '120px', padding: '4px' }}
        />

        {/* Price Range Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8em' }}>Min: {minPrice.toLocaleString()}</label>
          <input
            type="range"
            min={0}
            max={5000000}
            step={10000}
            value={minPrice}
            onChange={e => setMinPrice(Number(e.target.value))}
            style={{ width: '100px' }}
          />

          <label style={{ fontSize: '0.8em', marginTop: '4px' }}>Max: {maxPrice.toLocaleString()}</label>
          <input
            type="range"
            min={0}
            max={5000000}
            step={10000}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        {/* Server Filter */}
        <select
          value={server}
          onChange={e => setServer(e.target.value)}
          style={{ width: '100px', padding: '4px' }}
        >
          <option value="">All Srv</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div style={{ marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            style={{
              marginRight: 8,
              padding: '6px 12px',
              background: category === cat.key ? '#ddd' : '#fff',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 10 }}>
        <strong>Pages fetched:</strong> {pagesFetched} &nbsp;|&nbsp;
        <strong>Results:</strong> {count}
      </div>

      {/* Results Table */}
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Date</th>
            <th>Server</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={4} style={{ textAlign: 'center' }}>No results found</td></tr>
            : data.map((row, i) => (
                <tr key={i}>
                  <td>{row.title}</td>
                  <td>{row.price ? Number(row.price).toLocaleString() + ' Poké' : 'N/A'}</td>
                  <td>{row.date}</td>
                  <td>{row.server}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </main>
  );
}
