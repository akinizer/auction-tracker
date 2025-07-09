// scripts/scrape.js
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

const db = new sqlite3.Database('./db/auctions.db');

async function fetchPage(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

async function scrapeAllPages() {
  const baseUrl = 'https://pokemonrevolution.net/forum/forum/211-selling-pok%C3%A9mon-cross-server';
  // First page
  let $ = await fetchPage(baseUrl);

  // Find last page number from rel="last" link
  const lastPageLink = $('a[rel="last"]').attr('href');
  let lastPageNum = 1;
  if (lastPageLink) {
    const m = lastPageLink.match(/page\/(\d+)\//);
    if (m) lastPageNum = parseInt(m[1], 10);
  }

  for (let page = 1; page <= lastPageNum; page++) {
    const pageUrl = page === 1 ? baseUrl : `${baseUrl}/page/${page}/`;
    console.log(`Fetching page ${page} / ${lastPageNum} ...`);
    $ = await fetchPage(pageUrl);

    $('.auction-post').each((i, el) => {
      const title = $(el).find('.title').text().trim();
      const priceRaw = $(el).find('.price').text();
      const price = priceRaw ? priceRaw.replace(/[^\d]/g, '') : null;
      const date = $(el).find('.date').text().trim();
      const server = $(el).find('.server').text().trim();

      if (title) {
        console.log(`Inserting: ${title}`);
        db.run(
          `INSERT INTO auctions (title, price, date, server) VALUES (?, ?, ?, ?)`,
          [title, price, date, server],
          (err) => {
            if (err) console.error('Insert error:', err);
          }
        );
      }
    });
  }

  db.close(() => {
    console.log('Database closed successfully.');
  });
}

scrapeAllPages();
