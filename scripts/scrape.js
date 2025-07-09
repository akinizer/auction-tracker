const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

const db = new sqlite3.Database('./db/auctions.db');

async function fetchPage(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

function parsePrice(str) {
  if (!str) return null;
  str = str.replace(/,/g, '').trim().toLowerCase();
  let multiplier = 1;
  if (str.endsWith('k')) {
    multiplier = 1000;
    str = str.slice(0, -1);
  } else if (str.endsWith('m')) {
    multiplier = 1000000;
    str = str.slice(0, -1);
  }
  const num = parseFloat(str);
  return isNaN(num) ? null : num * multiplier;
}

async function fetchAuctionDetails(url) {
  try {
    console.log(`Fetching auction details from: ${url}`);
    const $ = await fetchPage(url);

    // Auction info container might be '.post-content'
    const text = $('.post-content').text().trim();
    console.log('Raw auction detail text:', text);

    const minBidMatch = text.match(/min bid\s+([\d,.kK]+)/i);
    const maxBidMatch = text.match(/accept cc-([\d,.kK]+), rr-([\d,.kK]+)/i);
    const durationMatch = text.match(/(\d+)(h|hrs|hours|m|minutes)/i);

    const minPrice = parsePrice(minBidMatch ? minBidMatch[1] : null);
    const ccPrice = parsePrice(maxBidMatch ? maxBidMatch[1] : null);
    const rrPrice = parsePrice(maxBidMatch ? maxBidMatch[2] : null);
    const maxPrice = Math.max(ccPrice || 0, rrPrice || 0) || null;
    const duration = durationMatch ? durationMatch[0] : null;

    console.log('Parsed auction details:', { minPrice, maxPrice, duration });

    return { minPrice, maxPrice, duration };
  } catch (err) {
    console.error(`Failed to fetch auction details from ${url}:`, err);
    return { minPrice: null, maxPrice: null, duration: null };
  }
}

async function scrapeAllPages() {
  const baseUrl = 'https://pokemonrevolution.net/forum/forum/211-selling-pok%C3%A9mon-cross-server';
  let $ = await fetchPage(baseUrl);

  const lastPageLink = $('a[rel="last"]').attr('href');
  let lastPageNum = 1;
  if (lastPageLink) {
    const m = lastPageLink.match(/page\/(\d+)\//);
    if (m) lastPageNum = parseInt(m[1], 10);
  }

  for (const el of $('div.ipsDataItem_main').toArray()) {
  const $el = $(el);

  const $titleLink = $el.find('h4.ipsDataItem_title.ipsContained_container a');
  const title = $titleLink.text().trim();
  const detailLink = $titleLink.attr('href');

  // Detect category: simple check for 'pvp' in title (case-insensitive)
  let category = 'all';
  if (/pvp/i.test(title)) {
    category = 'pvp';
  }
  // Add more category detection logic later here if needed

  // Other fields (price, date, server) - update extraction as needed
  const price = null;
  const date = null;
  const server = null;

  console.log(`Detail URL: ${detailLink}`);

  let minPrice = null, maxPrice = null, duration = null;
  if (detailLink) {
    const details = await fetchAuctionDetails(detailLink);
    minPrice = details.minPrice;
    maxPrice = details.maxPrice;
    duration = details.duration;
  }

  if (title) {
    db.run(
      `INSERT INTO auctions (title, price, date, server, min_price, max_price, end_date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, price, date, server, minPrice, maxPrice, duration, category],
      err => {
        if (err) console.error('Insert error:', err);
      }
    );
  }
}


  db.close(() => {
    console.log('Database closed successfully.');
  });
}

scrapeAllPages();
