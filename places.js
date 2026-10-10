/* What Tom's Atlas teaches. Each topic is split into sets; one set is one level.
   A place is "kind:id": continent:NA, ocean:pacific, country:FR (two-letter code), state:CA, flag:FR.
   Each place has a short fact, said out loud when it's first taught. Keep facts true, short and friendly. */

// Home: shown as a star on every map. Change these if you live somewhere else.
const HOME = {
  town: 'Grass Valley', state: 'CA', country: 'US', continent: 'NA', ocean: 'pacific',
  townFact: 'Grass Valley is in the foothills of the Sierra Nevada mountains. Long ago, gold miners came there to dig for gold.',
};

const CONTINENTS = [
  ['NA', 'North America', 'We live in North America! It has Canada, the United States and Mexico, grizzly bears and bald eagles.'],
  ['SA', 'South America', 'South America has the Amazon rainforest, the Andes mountains, and llamas.'],
  ['AF', 'Africa', 'Africa has the Sahara, the biggest hot desert, and the River Nile. Lions, elephants and giraffes live there.'],
  ['AU', 'Australia', 'Australia is a continent and a country. Kangaroos and koalas live there.'],
  ['EU', 'Europe', 'Europe has old castles where knights lived, and Greece, where the Greek myths come from.'],
  ['AS', 'Asia', 'Asia is the biggest continent. It has Mount Everest, the tallest mountain in the world, and tigers and pandas.'],
  ['AN', 'Antarctica', 'Antarctica is the coldest place on Earth, covered in ice. Penguins live there, but there are no towns.'],
];
const CONTINENT_SETS = [['NA', 'SA', 'AF', 'AU'], ['EU', 'AS', 'AN']];

const OCEANS = [
  ['pacific', 'the Pacific Ocean', 'The Pacific is the biggest ocean of all. Its waves reach California, not far from our home.'],
  ['atlantic', 'the Atlantic Ocean', 'The Atlantic Ocean is between the Americas and Europe and Africa. Long ago, sailing ships took weeks to cross it.'],
  ['indian', 'the Indian Ocean', 'The Indian Ocean is warm. It is between Africa, Asia and Australia.'],
  ['arctic', 'the Arctic Ocean', 'The Arctic Ocean is at the top of the world, around the North Pole. Polar bears hunt on its ice, and Hudson Bay in Canada is part of it.'],
  ['southern', 'the Southern Ocean', 'The Southern Ocean goes all the way around Antarctica. Whales and penguins swim there.'],
];
const OCEAN_SETS = [['pacific', 'atlantic'], ['indian', 'arctic', 'southern']];

// Seas, bays and gulfs: smaller waters at the edges of the oceans. Each belongs to an ocean (Hudson Bay to the Arctic).
// [key from the map data, name as said in a sentence, fact]
const SEA_SETS = [
  [
    ['hudson-bay', 'Hudson Bay', 'Hudson Bay is a giant bay in Canada. In winter it freezes, and polar bears walk out on the ice to hunt seals.'],
    ['gulf-of-mexico', 'the Gulf of Mexico', 'The Gulf of Mexico is warm water between the United States and Mexico. The Mississippi River flows into it.'],
    ['caribbean-sea', 'the Caribbean Sea', 'The Caribbean Sea is warm and blue, full of islands, coral reefs and old pirate stories.'],
    ['mediterranean-sea', 'the Mediterranean Sea', 'The Mediterranean Sea is between Europe and Africa. Odysseus sailed it in the Greek myths.'],
    ['gulf-of-alaska', 'the Gulf of Alaska', 'The Gulf of Alaska has glaciers that crumble into the sea, and humpback whales.'],
    ['bering-sea', 'the Bering Sea', 'The Bering Sea is between Alaska and Russia. It is cold and stormy, with walruses on the ice.'],
  ],
  [
    ['golfo-de-california', 'the Gulf of California', 'The Gulf of California is a long, narrow sea in Mexico. Whales and sea lions swim there.'],
    ['red-sea', 'the Red Sea', 'The Red Sea is between Africa and Arabia, with bright coral reefs.'],
    ['black-sea', 'the Black Sea', 'The Black Sea is between Europe and Asia. Jason and the Argonauts sailed there to find the Golden Fleece.'],
    ['north-sea', 'the North Sea', 'The North Sea is cold and stormy. Viking longships sailed across it.'],
    ['baltic-sea', 'the Baltic Sea', 'The Baltic Sea is not very salty. Its beaches have amber, golden stone made from ancient tree sap.'],
    ['bay-of-bengal', 'the Bay of Bengal', 'The Bay of Bengal is the biggest bay in the world, between India and Southeast Asia.'],
  ],
  [
    ['aegean-sea', 'the Aegean Sea', 'The Aegean Sea is full of Greek islands. In the myths, it is named after King Aegeus, the father of Theseus.'],
    ['arabian-sea', 'the Arabian Sea', 'The Arabian Sea is part of the Indian Ocean, between Arabia and India. Sailors have crossed it for thousands of years.'],
    ['south-china-sea', 'the South China Sea', 'The South China Sea is a big sea in Asia, with hundreds of tiny islands and reefs.'],
    ['sea-of-japan', 'the Sea of Japan', 'The Sea of Japan is between Japan and the mainland of Asia.'],
    ['coral-sea', 'the Coral Sea', 'The Coral Sea has the Great Barrier Reef, the biggest coral reef in the world.'],
    ['tasman-sea', 'the Tasman Sea', 'The Tasman Sea is between Australia and New Zealand.'],
  ],
  [
    ['persian-gulf', 'the Persian Gulf', 'The Persian Gulf is a warm, shallow sea where people once dove for pearls.'],
    ['gulf-of-guinea', 'the Gulf of Guinea', 'The Gulf of Guinea is under the bulge of Africa. The Equator and the Prime Meridian cross right in it.'],
    ['labrador-sea', 'the Labrador Sea', 'The Labrador Sea is between Canada and Greenland. Icebergs float through it.'],
    ['baffin-bay', 'Baffin Bay', 'Baffin Bay is between Greenland and Canada, and icy most of the year. Narwhals live there.'],
    ['bay-of-biscay', 'the Bay of Biscay', 'The Bay of Biscay, by France and Spain, is famous for big waves and storms.'],
    ['irish-sea', 'the Irish Sea', 'The Irish Sea is between Ireland and Great Britain.'],
  ],
  [
    ['sargasso-sea', 'the Sargasso Sea', 'The Sargasso Sea is the only sea with no shore at all. It sits in the middle of the Atlantic, full of floating golden seaweed.'],
    ['gulf-of-saint-lawrence', 'the Gulf of Saint Lawrence', 'The Gulf of Saint Lawrence is where the great Saint Lawrence River meets the sea, in Canada.'],
    ['adriatic-sea', 'the Adriatic Sea', 'The Adriatic Sea is between Italy and the Balkans. The city of Venice sits right on it.'],
    ['caspian-sea', 'the Caspian Sea', 'The Caspian Sea is really the biggest lake in the world, with salty water, between Europe and Asia.'],
    ['weddell-sea', 'the Weddell Sea', 'The Weddell Sea is by Antarctica. The explorer Shackleton\'s ship got stuck in its ice.'],
    ['ross-sea', 'the Ross Sea', 'The Ross Sea, by Antarctica, has penguins, seals and a giant shelf of ice.'],
  ],
  [
    ['barents-sea', 'the Barents Sea', 'The Barents Sea is in the far north, by Norway and Russia.'],
    ['sea-of-okhotsk', 'the Sea of Okhotsk', 'The Sea of Okhotsk freezes in winter, with ice floating down toward Japan.'],
    ['philippine-sea', 'the Philippine Sea', 'The Philippine Sea is a deep sea east of the Philippines, with islands all around it.'],
    ['yellow-sea', 'the Yellow Sea', 'The Yellow Sea is named for the yellow sand that rivers carry into it.'],
    ['gulf-of-aden', 'the Gulf of Aden', 'The Gulf of Aden leads from the Arabian Sea into the Red Sea.'],
    ['great-australian-bight', 'the Great Australian Bight', 'The Great Australian Bight is a huge curve along the south of Australia, where whales come to have their babies.'],
  ],
];

// Smaller seas inside bigger ones: the map lights them up with the bigger sea, unless they're the one being asked about.
const SEA_PARTS = {
  'mediterranean-sea': ['adriatic-sea', 'aegean-sea', 'ionian-sea', 'tyrrhenian-sea', 'balearic-sea', 'golfe-du-lion'],
  'baltic-sea': ['gulf-of-bothnia', 'gulf-of-finland'],
  'hudson-bay': ['james-bay'],
  'gulf-of-mexico': ['bahia-de-campeche'],
  'caribbean-sea': ['gulf-of-honduras'],
  'baffin-bay': ['melville-bay'],
};

// [code, name as said in a sentence, fact]. Sets go from big and famous to smaller and farther.
const COUNTRY_SETS = [
  [
    ['US', 'the United States', 'The United States is our country. It has fifty states.'],
    ['CA', 'Canada', 'Canada is just north of us. It has moose, maple syrup and very cold winters.'],
    ['MX', 'Mexico', 'Mexico is just south of us. The Aztecs built great cities there long ago.'],
    ['BR', 'Brazil', 'Brazil is the biggest country in South America. Most of the Amazon rainforest is there.'],
    ['RU', 'Russia', 'Russia is the biggest country in the world. It is partly in Europe and partly in Asia.'],
    ['CN', 'China', 'China built the Great Wall, thousands of miles long. Giant pandas live there.'],
  ],
  [
    ['AU', 'Australia', 'Australia is a whole continent and one country. Kangaroos hop there.'],
    ['IN', 'India', 'India has tigers, elephants and the Taj Mahal.'],
    ['EG', 'Egypt', 'Egypt has the pyramids and the River Nile. Long ago, people there told stories of Ra, Osiris and Set.'],
    ['GB', 'the United Kingdom', 'The United Kingdom is England, Scotland, Wales and Northern Ireland. Shakespeare and the stories of King Arthur come from there.'],
    ['FR', 'France', 'France has the Eiffel Tower. People there speak French.'],
    ['JP', 'Japan', 'Japan is a country of islands, with Mount Fuji, a tall volcano.'],
  ],
  [
    ['GR', 'Greece', 'Greece is where the Greek myths come from: Zeus, Athena and Odysseus.'],
    ['IT', 'Italy', 'Italy is shaped like a boot. Ancient Rome was there.'],
    ['ES', 'Spain', 'Spain is sunny, with old castles and flamenco dancing.'],
    ['DE', 'Germany', 'Germany has deep, dark forests. Many fairy tales, like Hansel and Gretel, come from there.'],
    ['AR', 'Argentina', 'Argentina reaches far south, close to Antarctica. Cowboys called gauchos ride horses on its grasslands.'],
    ['ZA', 'South Africa', 'South Africa is at the very bottom of Africa. Penguins live on its beaches!'],
  ],
  [
    ['KE', 'Kenya', 'Kenya has huge grasslands with lions, zebras and giraffes.'],
    ['PE', 'Peru', 'Peru has Machu Picchu, a city the Inca built high in the mountains.'],
    ['CL', 'Chile', 'Chile is long and thin, stretched between the mountains and the sea.'],
    ['NO', 'Norway', 'Norway has deep sea valleys called fjords. The Vikings sailed from there.'],
    ['IE', 'Ireland', 'Ireland is a green island, full of old stories of giants and fairy folk.'],
    ['ID', 'Indonesia', 'Indonesia is made of thousands of islands. Komodo dragons live there!'],
  ],
  [
    ['IS', 'Iceland', 'Iceland has volcanoes, hot springs and glaciers.'],
    ['NZ', 'New Zealand', 'New Zealand is two big islands with mountains, glaciers and the kiwi bird.'],
    ['TR', 'Turkey', 'Turkey is partly in Europe and partly in Asia. The old city of Troy was there.'],
    ['SA', 'Saudi Arabia', 'Saudi Arabia is mostly desert, with camels and giant sand dunes.'],
    ['MG', 'Madagascar', 'Madagascar is a big island near Africa where lemurs live.'],
    ['MN', 'Mongolia', 'Mongolia has wide grasslands. Many people there live in round tents called gers.'],
  ],
  [
    ['NP', 'Nepal', 'Nepal shares Mount Everest, the tallest mountain in the world.'],
    ['TH', 'Thailand', 'Thailand has elephants, golden temples and warm beaches.'],
    ['MA', 'Morocco', 'Morocco has the Atlas Mountains, named after Atlas, the giant who held up the sky.'],
    ['ET', 'Ethiopia', 'Ethiopia is high in the mountains of Africa. Coffee first came from there.'],
    ['CO', 'Colombia', 'Colombia has rainforests, tall mountains and beaches on two seas.'],
    ['SE', 'Sweden', 'Sweden has thick forests, moose, and long summer days.'],
  ],
  [
    ['GL', 'Greenland', 'Greenland is the biggest island in the world, almost all covered in ice.'],
    ['DK', 'Denmark', 'Denmark is one of the lands the Vikings came from, along with Norway and Sweden.'],
    ['NL', 'the Netherlands', 'The Netherlands is very flat, with windmills, tulips and canals.'],
    ['CH', 'Switzerland', 'Switzerland is in the Alps, the snowy mountains of Europe.'],
    ['PT', 'Portugal', 'Portugal is on the Atlantic Ocean. Long ago, its sailors explored the world.'],
    ['PL', 'Poland', 'Poland has an old legend of a dragon that lived under the castle in Kraków.'],
  ],
  [
    ['VN', 'Vietnam', 'Vietnam is long and thin, with rice fields and green mountains.'],
    ['PH', 'the Philippines', 'The Philippines is made of more than seven thousand islands.'],
    ['KR', 'South Korea', 'South Korea is on a peninsula, with mountains and busy cities.'],
    ['PK', 'Pakistan', 'Pakistan has some of the tallest mountains in the world, like K2.'],
    ['IR', 'Iran', 'Iran was once called Persia, home of old stories of kings and heroes.'],
    ['IL', 'Israel', 'Israel is next to the Dead Sea, which is so salty that you float in it.'],
  ],
  [
    ['NG', 'Nigeria', 'Nigeria has more people than any other country in Africa.'],
    ['GH', 'Ghana', 'Ghana is where the stories of Anansi the spider come from.'],
    ['TZ', 'Tanzania', 'Tanzania has Mount Kilimanjaro, the tallest mountain in Africa.'],
    ['DZ', 'Algeria', 'Algeria is the biggest country in Africa, and most of it is the Sahara desert.'],
    ['TN', 'Tunisia', 'Tunisia was home to Carthage, an ancient city of sailors.'],
    ['CU', 'Cuba', 'Cuba is the biggest island in the Caribbean Sea.'],
  ],
  [
    ['JM', 'Jamaica', 'Jamaica is an island in the Caribbean with tall mountains called the Blue Mountains.'],
    ['VE', 'Venezuela', 'Venezuela has Angel Falls, the tallest waterfall in the world.'],
    ['BO', 'Bolivia', 'Bolivia has a giant salt flat that shines like a mirror after rain.'],
    ['EC', 'Ecuador', 'Ecuador owns the Galápagos Islands, home of giant tortoises.'],
    ['GT', 'Guatemala', 'Guatemala has old Maya pyramids hidden in the jungle.'],
    ['UA', 'Ukraine', 'Ukraine has wide fields of wheat and sunflowers.'],
  ],
  [
    ['AT', 'Austria', 'Austria is in the Alps. Mozart was born there.'],
    ['FI', 'Finland', 'Finland has thousands of lakes, and the northern lights in winter.'],
    ['CZ', 'Czechia', 'Czechia has the city of Prague, full of castles and old bridges.'],
    ['HU', 'Hungary', 'Hungary has the Danube River flowing right through the city of Budapest.'],
    ['RO', 'Romania', 'Romania has the mountains and castles where the Dracula stories are set.'],
  ],
];

// [postal code, fact]. Names come from the map. Starts at home and spreads out.
const STATE_SETS = [
  [
    ['CA', 'California is our state! It has the Sierra Nevada mountains and giant redwood trees.'],
    ['NV', 'Nevada is right next door. It is mostly desert, and shares Lake Tahoe with California.'],
    ['OR', 'Oregon is just north of California, with tall forests and Crater Lake.'],
    ['AZ', 'Arizona has the Grand Canyon, carved by the Colorado River.'],
    ['TX', 'Texas is a huge state, with cowboys and longhorn cattle.'],
    ['FL', 'Florida is warm and sunny, with alligators in the Everglades.'],
  ],
  [
    ['AK', 'Alaska is the biggest state of all, with bears, glaciers and Denali, the tallest mountain in North America. On this map it is drawn small, in the corner.'],
    ['HI', 'Hawaii is a chain of volcano islands in the middle of the Pacific Ocean.'],
    ['WA', 'Washington State has rainforests, volcanoes and lots of rain.'],
    ['NY', 'New York has New York City, with the Statue of Liberty.'],
    ['UT', 'Utah has red rock arches and the Great Salt Lake.'],
    ['ID', 'Idaho has mountains, rushing rivers and potatoes.'],
  ],
  [
    ['CO', 'Colorado is in the Rocky Mountains, with snowy peaks.'],
    ['NM', 'New Mexico has deserts, old pueblos and hot air balloon festivals.'],
    ['MT', 'Montana has big skies, high mountains and grizzly bears.'],
    ['WY', 'Wyoming has Yellowstone, where geysers shoot hot water into the air.'],
    ['LA', 'Louisiana is where the Mississippi River meets the sea, with swamps and alligators.'],
    ['MI', 'Michigan is shaped like a mitten, with the Great Lakes all around.'],
  ],
  [
    ['ME', 'Maine is the farthest east, with lighthouses, rocky shores and lobsters.'],
    ['GA', 'Georgia grows peaches and peanuts.'],
    ['IL', 'Illinois has the big city of Chicago, on Lake Michigan.'],
    ['OK', 'Oklahoma has wide plains and big thunderstorms.'],
    ['KS', 'Kansas is flat and full of wheat fields, with big summer thunderstorms.'],
    ['NE', 'Nebraska has big prairies where sandhill cranes stop on their long flight.'],
  ],
  [
    ['ND', 'North Dakota has the badlands, rocky hills where dinosaur bones are found.'],
    ['SD', 'South Dakota has Mount Rushmore, four presidents carved in a mountain. One of them is Theodore Roosevelt!'],
    ['MN', 'Minnesota is called the land of ten thousand lakes.'],
    ['IA', 'Iowa has rolling fields of corn.'],
    ['MO', 'Missouri has the Gateway Arch, a giant silver arch in St. Louis.'],
    ['AR', 'Arkansas has a park where you can dig for real diamonds.'],
  ],
  [
    ['WI', 'Wisconsin is famous for cows and cheese.'],
    ['OH', 'Ohio is where Neil Armstrong was born, the first person to walk on the Moon.'],
    ['IN', 'Indiana has a famous car race, the Indy 500.'],
    ['KY', 'Kentucky has the longest cave in the world, Mammoth Cave.'],
    ['TN', 'Tennessee has the Great Smoky Mountains and lots of music.'],
    ['MS', 'Mississippi is named after the great Mississippi River.'],
  ],
  [
    ['AL', 'Alabama is where the rockets that went to the Moon were built.'],
    ['SC', 'South Carolina has warm beaches and old forts by the sea.'],
    ['NC', 'North Carolina is where the Wright brothers flew the first airplane.'],
    ['VA', 'Virginia is where some of the first English settlers lived, long ago.'],
    ['WV', 'West Virginia is all mountains, with winding roads and rivers.'],
    ['PA', 'Pennsylvania has the Liberty Bell, in Philadelphia.'],
  ],
  [
    ['NJ', 'New Jersey has long sandy beaches on the Atlantic Ocean.'],
    ['MD', 'Maryland is famous for blue crabs from the Chesapeake Bay.'],
    ['DE', 'Delaware is a tiny state. It was the very first state.'],
    ['CT', 'Connecticut is small, with old towns and bright autumn leaves.'],
    ['RI', 'Rhode Island is the smallest state of all.'],
    ['MA', 'Massachusetts is where the Pilgrims landed in the Mayflower.'],
  ],
  [
    ['VT', 'Vermont has green mountains and maple syrup.'],
    ['NH', 'New Hampshire has the White Mountains and very windy Mount Washington.'],
  ],
];

const TOPICS = [
  { id: 'home', name: 'Where we live', note: 'our state, country, continent and ocean' },
  { id: 'continents', name: 'Continents', note: 'the seven big pieces of land' },
  { id: 'oceans', name: 'Oceans', note: 'the five oceans' },
  { id: 'seas', name: 'Seas and bays', note: 'Hudson Bay, the Caribbean…' },
  { id: 'countries', name: 'Countries', note: 'find them on the map' },
  { id: 'flags', name: 'Flags', note: 'whose flag is it?' },
  { id: 'states', name: 'US states', note: 'all fifty' },
];

// Off the screen, something to try today (one per topic).
const HANDS = {
  home: 'Draw a map of your house or garden. Where do you sleep? Where is the big tree? Mark home with a star.',
  continents: 'Tear the seven continents out of colored paper and lay them on a blue towel ocean. Can {name} put them in the right places?',
  oceans: 'Stir a spoon of salt into a cup of water and taste a drop. That is why we can\'t drink ocean water.',
  seas: 'Fill a baking tray with sand and water and make your own bay, gulf and sea with your hands. Which one is almost closed in?',
  countries: 'Find today\'s countries on a globe or in an atlas. What animals live there? What would you pack to visit?',
  flags: 'Design a flag for your family, with colors and a picture that mean something to you.',
  states: 'On your next drive, look for license plates from other states, and find them on the map at home.',
};

// End-of-round cheers by how the round went: [heading, line].
const CHEERS = [
  [['Bravo', 'A true explorer. The whole map is opening up.'], ['Well done', 'Magellan would want you on his ship.'], ['Wonderful', 'Atlas could put down the sky and take a rest. You know the world now.'], ['Hooray', 'Every one on the first try. Off to the next horizon!']],
  [['Well done', 'Lots of places found. The map is getting friendlier.'], ['Good going', 'You found your way almost everywhere.'], ['Nice work', 'Explorers get a little lost sometimes. That is how they find new places.']],
  [['Good try', 'Some of these were brand new. They will come back, and they will be easier.'], ['Keep going', 'Every explorer starts with a few wrong turns.']],
  [['Good effort', 'That was a tricky round. We will visit these places again soon.'], ['Nice try', 'New places take a few visits. Let\'s look at a map together later.']],
];
