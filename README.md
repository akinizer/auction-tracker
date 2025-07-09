# Auction Price Tracker

A web-based tool that scrapes Pokémon Revolution Online forum auction listings and displays them in a searchable table.

---

## Features

- Scrapes auction listings from all pages of the [Selling Pokémon Cross Server](https://pokemonrevolution.net/forum/forum/211-selling-pok%C3%A9mon-cross-server/) forum.
- Stores listings in an SQLite database.
- Provides a web UI to:
  - Search auction titles
  - Filter by price range
  - Filter by server (Gold/Silver)
- Displays number of results and pages fetched

---

## Getting Started

```bash
git clone https://github.com/your-username/auction-tracker.git
cd auction-tracker
npm install
node scripts/init.js
npm run scrape
npm run dev
