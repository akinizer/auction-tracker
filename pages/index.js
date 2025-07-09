import { useState, useEffect } from 'react';

// Small sample of Pokémon names — replace with full 1000+ list for best results
const POKEMON_NAMES = [
  "Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle",
  "Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto",
  "Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew",
  "Sandslash","Nidoran♀","Nidorina","Nidoqueen","Nidoran♂","Nidorino","Nidoking","Clefairy","Clefable",
  "Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras",
  "Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey",
  "Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam",
  "Machop","Machoke","Machamp","Bellsprout","Weepinbell","Victreebel","Tentacool","Tentacruel","Geodude",
  "Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro","Magnemite","Magneton","Farfetch’d",
  "Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder","Cloyster","Gastly","Haunter","Gengar",
  "Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb","Electrode","Exeggcute","Exeggutor","Cubone",
  "Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing","Rhyhorn","Rhydon","Chansey",
  "Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Mr. Mime","Scyther",
  "Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados","Lapras","Ditto","Eevee",
  "Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto","Kabutops","Aerodactyl",
  "Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo","Mew",
  // Gen 2
  "Chikorita","Bayleef","Meganium","Cyndaquil","Quilava","Typhlosion","Totodile","Croconaw","Feraligatr",
  "Sentret","Furret","Hoothoot","Noctowl","Ledyba","Ledian","Spinarak","Ariados","Crobat","Chinchou",
  "Lanturn","Pichu","Cleffa","Igglybuff","Togepi","Togetic","Natu","Xatu","Mareep","Flaaffy","Ampharos",
  "Bellossom","Marill","Azumarill","Sudowoodo","Politoed","Hoppip","Skiploom","Jumpluff","Aipom","Sunkern",
  "Sunflora","Yanma","Wooper","Quagsire","Espeon","Umbreon","Murkrow","Slowking","Misdreavus","Unown",
  "Wobbuffet","Girafarig","Pineco","Forretress","Dunsparce","Gligar","Steelix","Snubbull","Granbull",
  "Qwilfish","Scizor","Shuckle","Heracross","Sneasel","Teddiursa","Ursaring","Slugma","Magcargo","Swinub",
  "Piloswine","Corsola","Remoraid","Octillery","Delibird","Mantine","Skarmory","Houndour","Houndoom",
  "Kingdra","Phanpy","Donphan","Porygon2","Stantler","Smeargle","Tyrogue","Hitmontop","Smoochum","Elekid",
  "Magby","Miltank","Blissey","Raikou","Entei","Suicune","Larvitar","Pupitar","Tyranitar","Lugia",
  "Ho-Oh","Celebi",
  // Gen 3
  "Treecko","Grovyle","Sceptile","Torchic","Combusken","Blaziken","Mudkip","Marshtomp","Swampert",
  "Poochyena","Mightyena","Zigzagoon","Linoone","Wurmple","Silcoon","Beautifly","Cascoon","Dustox",
  "Lotad","Lombre","Ludicolo","Seedot","Nuzleaf","Shiftry","Taillow","Swellow","Wingull","Pelipper",
  "Ralts","Kirlia","Gardevoir","Surskit","Masquerain","Shroomish","Breloom","Slakoth","Vigoroth",
  "Slaking","Nincada","Ninjask","Shedinja","Whismur","Loudred","Exploud","Makuhita","Hariyama",
  "Azurill","Nosepass","Skitty","Delcatty","Sableye","Mawile","Aron","Lairon","Aggron","Meditite",
  "Medicham","Electrike","Manectric","Plusle","Minun","Volbeat","Illumise","Roselia","Gulpin",
  "Swalot","Carvanha","Sharpedo","Wailmer","Wailord","Numel","Camerupt","Torkoal","Spoink","Grumpig",
  "Spinda","Trapinch","Vibrava","Flygon","Cacnea","Cacturne","Swablu","Altaria","Zangoose","Seviper",
  "Lunatone","Solrock","Barboach","Whiscash","Corphish","Crawdaunt","Baltoy","Claydol","Lileep",
  "Cradily","Anorith","Armaldo","Feebas","Milotic","Castform","Kecleon","Shuppet","Banette","Duskull",
  "Dusclops","Tropius","Chimecho","Absol","Wynaut","Snorunt","Glalie","Spheal","Sealeo","Walrein",
  "Clamperl","Huntail","Gorebyss","Relicanth","Luvdisc","Bagon","Shelgon","Salamence","Beldum",
  "Metang","Metagross","Regirock","Regice","Registeel","Latias","Latios","Kyogre","Groudon",
  "Rayquaza","Jirachi","Deoxys",
  // Gen 4
  "Turtwig","Grotle","Torterra","Chimchar","Monferno","Infernape","Piplup","Prinplup","Empoleon",
  "Starly","Staravia","Staraptor","Bidoof","Bibarel","Kricketot","Kricketune","Shinx","Luxio",
  "Luxray","Budew","Roserade","Cranidos","Rampardos","Shieldon","Bastiodon","Burmy","Wormadam",
  "Mothim","Combee","Vespiquen","Pachirisu","Buizel","Floatzel","Cherubi","Cherrim","Shellos",
  "Gastrodon","Ambipom","Drifloon","Drifblim","Buneary","Lopunny","Mismagius","Honchkrow",
  "Glameow","Purugly","Chingling","Stunky","Skuntank","Bronzor","Bronzong","Bonsly","Mime Jr.",
  "Happiny","Chatot","Spiritomb","Gible","Gabite","Garchomp","Munchlax","Riolu","Lucario",
  "Hippopotas","Hippowdon","Skorupi","Drapion","Croagunk","Toxicroak","Carnivine","Finneon",
  "Lumineon","Mantyke","Snover","Abomasnow","Weavile","Magnezone","Lickilicky","Rhyperior",
  "Tangrowth","Electivire","Magmortar","Togekiss","Yanmega","Leafeon","Glaceon","Gliscor",
  "Mamoswine","Porygon-Z","Gallade","Probopass","Dusknoir","Froslass","Rotom","Uxie","Mesprit",
  "Azelf","Dialga","Palkia","Heatran","Regigigas","Giratina","Cresselia","Phione","Manaphy",
  "Darkrai","Shaymin","Arceus",
  // Gen 5 (Unova)
  "Victini","Snivy","Servine","Serperior","Tepig","Pignite","Emboar","Oshawott","Dewott","Samurott",
  "Patrat","Watchog","Lillipup","Herdier","Stoutland","Purrloin","Liepard","Pansage","Simisage",
  "Pansear","Simisear","Panpour","Simipour","Munna","Musharna","Pidove","Tranquill","Unfezant",
  "Blitzle","Zebstrika","Roggenrola","Boldore","Gigalith","Woobat","Swoobat","Drilbur","Excadrill",
  "Audino","Timburr","Gurdurr","Conkeldurr","Tympole","Palpitoad","Seismitoad","Throh","Sawk",
  "Sewaddle","Swadloon","Leavanny","Venipede","Whirlipede","Scolipede","Cottonee","Whimsicott",
  "Petilil","Lilligant","Basculin","Sandile","Krokorok","Krookodile","Darumaka","Darmanitan",
  "Maractus","Dwebble","Crustle","Scraggy","Scrafty","Sigilyph","Yamask","Cofagrigus","Tirtouga",
  "Carracosta","Archen","Archeops","Trubbish","Garbodor","Zorua","Zoroark","Minccino","Cinccino",
  "Gothita","Gothorita","Gothitelle","Solosis","Duosion","Reuniclus","Ducklett","Swanna","Vanillite",
  "Vanillish","Vanilluxe","Deerling","Sawsbuck","Emolga","Karrablast","Escavalier","Foongus",
  "Amoonguss","Frillish","Jellicent","Alomomola","Joltik","Galvantula","Ferroseed","Ferrothorn",
  "Klink","Klang","Klinklang","Tynamo","Eelektrik","Eelektross","Elgyem","Beheeyem","Litwick",
  "Lampent","Chandelure","Axew","Fraxure","Haxorus","Cubchoo","Beartic","Cryogonal","Shelmet",
  "Accelgor","Stunfisk","Mienfoo","Mienshao","Druddigon","Golett","Golurk","Pawniard","Bisharp",
  "Bouffalant","Rufflet","Braviary","Vullaby","Mandibuzz","Heatmor","Durant","Deino","Zweilous",
  "Hydreigon","Larvesta","Volcarona","Cobalion","Terrakion","Virizion","Tornadus","Thundurus",
  "Reshiram","Zekrom","Landorus","Kyurem","Keldeo","Meloetta","Genesect",
  // Gen 6 (Kalos)
  "Chespin","Quilladin","Chesnaught","Fennekin","Braixen","Delphox","Froakie","Frogadier","Greninja",
  "Bunnelby","Diggersby","Fletchling","Fletchinder","Talonflame","Scatterbug","Spewpa","Vivillon",
  "Litleo","Pyroar","Flabébé","Floette","Florges","Skiddo","Gogoat","Pancham","Pangoro","Furfrou",
  "Espurr","Meowstic","Honedge","Doublade","Aegislash","Spritzee","Aromatisse","Swirlix","Slurpuff",
  "Inkay","Malamar","Binacle","Barbaracle","Skrelp","Dragalge","Clauncher","Clawitzer","Helioptile",
  "Heliolisk","Tyrunt","Tyrantrum","Amaura","Aurorus","Sylveon","Hawlucha","Dedenne","Carbink",
  "Goomy","Sliggoo","Goodra","Klefki","Phantump","Trevenant","Pumpkaboo","Gourgeist","Bergmite",
  "Avalugg","Noibat","Noivern","Xerneas","Yveltal","Zygarde","Diancie","Hoopa","Volcanion",
  // Gen 7 (Alola)
  "Rowlet","Dartrix","Decidueye","Litten","Torracat","Infernape","Popplio","Brionne","Primarina",
  "Pikipek","Trumbeak","Toucannon","Yungoos","Gumshoos","Grubbin","Charjabug","Vikavolt","Crabrawler",
  "Crabominable","Oricorio","Cutiefly","Ribombee","Rockruff","Lycanroc","Wishiwashi","Mareanie",
  "Toxapex","Mudbray","Mudsdale","Dewpider","Araquanid","Fomantis","Lurantis","Morelull","Shiinotic",
  "Salandit","Salazzle","Stufful","Bewear","Bounsweet","Steenee","Tsareena","Comfey","Oranguru",
  "Passimian","Wimpod","Golisopod","Sandygast","Palossand","Pyukumuku","Type: Null","Silvally",
  "Minior","Komala","Turtonator","Togedemaru","Mimikyu","Bruxish","Drampa","Dhelmise","Jangmo-o",
  "Hakamo-o","Kommo-o","Tapu Koko","Tapu Lele","Tapu Bulu","Tapu Fini","Cosmog","Cosmoem",
  "Solgaleo","Lunala","Nihilego","Buzzwole","Pheromosa","Xurkitree","Celesteela","Kartana",
  "Guzzlord","Necrozma","Magearna","Marshadow","Poipole","Naganadel","Stakataka","Blacephalon",
  "Zeraora",
  // Gen 8 (Galar)
  "Grookey","Thwackey","Rillaboom","Scorbunny","Raboot","Cinderace","Sobble","Drizzile","Inteleon",
  "Skwovet","Greedent","Rookidee","Corvisquire","Corviknight","Blipbug","Dottler","Orbeetle",
  "Nickit","Thievul","Gossifleur","Eldegoss","Wooloo","Dubwool","Chewtle","Drednaw","Yamper",
  "Boltund","Rolycoly","Carkol","Coalossal","Applin","Flapple","Appletun","Silicobra","Sandaconda",
  "Cramorant","Arrokuda","Barraskewda","Toxel","Toxtricity","Sizzlipede","Centiskorch","Clobbopus",
  "Grapploct","Sinistea","Polteageist","Hatenna","Hattrem","Hatterene","Impidimp","Morgrem",
  "Grimmsnarl","Obstagoon","Perrserker","Cursola","Sirfetch’d","Mr. Rime","Runerigus","Milcery",
  "Alcremie","Falinks","Pincurchin","Snom","Frosmoth","Stonjourner","Eiscue","Indeedee","Morpeko",
  "Cufant","Copperajah","Dracozolt","Arctozolt","Dracovish","Arctovish","Duraludon","Dreepy",
  "Drakloak","Dragapult","Zacian","Zamazenta","Eternatus","Kubfu","Urshifu","Zarude","Regieleki",
  "Regidrago","Glastrier","Spectrier","Calyrex",
  // Gen 9 (Paldea)
  "Sprigatito","Floragato","Meowscarada","Fuecoco","Crocalor","Skeledirge","Quaxly","Quaxwell",
  "Quaquaval","Lechonk","Oinkologne","Tarountula","Spidops","Nymble","Lokix","Pawmi","Pawmo",
  "Pawmot","Tandemaus","Maushold","Fidough","Dachsbun","Smoliv","Dolliv","Arboliva","Squawkabilly",
  "Nacli","Naclstack","Garganacl","Charcadet","Armarouge","Ceruledge","Tadbulb","Bellibolt",
  "Wattrel","Kilowattrel","Maschiff","Mabosstiff","Shroodle","Grafaiai","Bramblin","Brambleghast",
  "Toedscool","Toedscruel","Klawf","Capsakid","Scovillain","Rellor","Rabsca","Flittle","Espathra",
  "Tinkaton","Tinkatink","Tinkatuff","Wiglett","Wugtrio","Bombirdier","Finizen","Palafin","Varoom",
  "Revavroom","Cyclizar","Orthworm","Glimmet","Glimmora","Greavard","Houndstone","Flamigo",
  "Cetoddle","Cetitan","Veluza","Dondozo","Tatsugiri","Annihilape","Clodsire","Farigiraf",
  "Dudunsparce","Kingambit","Great Tusk","Scream Tail","Brute Bonnet","Flutter Mane","Slither Wing",
  "Sandy Shocks","Iron Treads","Iron Bundle","Iron Hands","Iron Jugulis","Iron Moth","Iron Thorns",
  "Frigibax","Arctibax","Baxcalibur","Gimmighoul","Gholdengo","Wo-Chien","Chien-Pao","Ting-Lu",
  "Chi-Yu","Roaring Moon","Iron Valiant","Koraidon","Miraidon"
];

export const ITEM_KEYWORDS = [
  // Poké Balls
  'poké ball', 'poke ball', 'great ball', 'ultra ball', 'quick ball',
  'level ball', 'lure ball', 'heavy ball', 'nest ball', 'timer ball',
  'heal ball', 'dusk ball', 'friend ball', 'love ball', 'fast ball',

  // Healing / Restoration Items
  'potion', 'super potion', 'hyper potion', 'max potion', 'full restore',
  'revive', 'max revive', 'ether', 'max ether', 'pp up', 'pp max',
  'antidote', 'full heal', 'elixir', 'berry', 'leftovers',

  // Repels
  'repel', 'super repel', 'max repel',

  // Evolution / Rare Items
  'rare candy', 'evolution stone', 'fire stone', 'water stone', 'thunder stone',
  'leaf stone', 'moon stone', 'sun stone', 'shiny stone', 'dusk stone',
  'dawn stone', 'ice stone', 'metal coat', 'dragon scale', 'kings rock',
  'deep sea tooth', 'deep sea scale', 'up-grade', 'protector', 'electirizer',
  'magmarizer', 'reaper cloth', 'dubious disc', 'prism scale', 'razor claw',
  'razor fang',

  // Battle / Competitive Held Items
  'eviolite', 'choice band', 'choice scarf', 'choice specs', 'assault vest',
  'focus sash', 'focus band', 'life orb', 'rocky helmet', 'air balloon',
  'black sludge', 'light clay', 'toxic orb', 'flame orb', 'mental herb',
  'white herb', 'power herb', 'leftovers', 'sitrus berry', 'red card',
  'quick claw', 'scope lens', 'amulet coin',

  // Event / Cosmetic / Utility
  'mount', 'cosmetic', 'set', 'cape', 'hat', 'backpack', 'wings', 'surfboard',
  'skateboard', 'sled', 'broomstick', 'balloon', 'outfit', 'tophat',
  'hood', 'mask', 'glasses', 'scarf', 'tail', 'robe', 'horn', 'ears'
];

const EVENT_KEYWORDS = [
  'easter', 'halloween', 'winter', 'summer', 'christmas',
  'valentine', 'new year', 'star wars', 'bidoof', 'tournment', 'event', 'form', 'rare', 'contest', 'bcc', 'fcc'
];


const CATEGORIES = [
  { key: 'all',     label: 'All' },
  { key: 'pokemon', label: 'Pokémon' },
  { key: 'items',   label: 'Items' },
  { key: 'mount',   label: 'Mounts' },
  { key: 'rares',   label: 'Rares/Events' },
  { key: 'pvp',     label: 'PvP-ready' },
];

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState(0);
  const [pagesFetched] = useState(21);

  // Filters
  const [q, setQ] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [server, setServer] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    // Compose query string WITHOUT category, category filtering is client-side now
    const params = new URLSearchParams();
    if (q)           params.append('q', q);
    if (dateFrom)    params.append('dateFrom', dateFrom);
    if (dateTo)      params.append('dateTo', dateTo);
    if (minPrice)    params.append('min', minPrice);
    if (maxPrice)    params.append('max', maxPrice);
    if (server)      params.append('server', server);

    fetch(`/api/auctions?${params.toString()}`)
      .then(r => r.json())
      .then(result => {
        setData(result.rows);
        setCount(result.count);
      });
  }, [q, dateFrom, dateTo, minPrice, maxPrice, server]);

  useEffect(() => {
    // Filter data client-side based on category
    const filtered = data.filter(item => {
      const title = (item.title || '').toLowerCase();

      switch(category) {
        case 'pokemon':
          // Check if title includes any pokemon name (case-insensitive)
          return POKEMON_NAMES.some(name => title.includes(name.toLowerCase()));

        case 'mount':
          // Filter if title contains "mount"
          return title.includes('mount');

        case 'pvp':
          // Filter if title contains "pvp"
          return title.includes('pvp');

        case 'all':
          return true; // Show all entries

        case 'items':
          // For items, check if title includes any item keywords
          return ITEM_KEYWORDS.some(keyword => title.includes(keyword.toLowerCase()));
          
        case 'rares':
          // For now just return true to show all items (can add logic if needed)
          return EVENT_KEYWORDS.some(keyword => title.includes(keyword.toLowerCase()));

        default:
          return true;
      }
    });

    setFilteredData(filtered);
    setCount(filtered.length);
  }, [data, category]);

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Auction Price Tracker</h1>

      {/* Filters and category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        {/* Keyword input */}
        <input
          type="text"
          placeholder="Search (name, IVs, item…) "
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

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ width: '80px', padding: '4px' }}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ width: '80px', padding: '4px' }}
        />

        {/* Server select */}
        <select
          value={server}
          onChange={e => setServer(e.target.value)}
          style={{ width: '100px', padding: '4px' }}
        >
          <option value="">All Servers</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
      </div>

      {/* Category tabs */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            style={{
              padding: '6px 16px',
              cursor: 'pointer',
              borderRadius: 6,
              border: '1.5px solid #0070f3',
              backgroundColor: category === cat.key ? '#0070f3' : 'transparent',
              color: category === cat.key ? 'white' : '#0070f3',
              fontWeight: category === cat.key ? '600' : '400',
              transition: 'background-color 0.3s, color 0.3s',
              userSelect: 'none',
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
            <th>Min Price</th>
            <th>Max Price</th>
            <th>Date</th>
            <th>Server</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No results found
              </td>
            </tr>
          ) : (
            filteredData.map((row, i) => (
              <tr key={i}>
                <td>{row.title}</td>
                <td>{row.price ? Number(row.price).toLocaleString() + ' Poké' : 'N/A'}</td>
                <td>{row.min_price ? Number(row.min_price).toLocaleString() + ' Poké' : 'N/A'}</td>
                <td>{row.max_price ? Number(row.max_price).toLocaleString() + ' Poké' : 'N/A'}</td>
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
