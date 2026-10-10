/* Fun facts for each country: history, records and unusual things. After a country (or its flag) is found,
   the next one is read out as "Did you know?", taking turns so each visit brings a new one.
   Keep them true, short and friendly; one or two sentences a young child can follow by ear. */
const FUN_FACTS = {
  US: [
    'The first people to walk on the Moon came from the United States, in 1969.',
    'The bald eagle is the national bird, and it lives only in North America.',
    'Yellowstone was the very first national park in the whole world.',
  ],
  CA: [
    'Canada has more lakes than all the other countries in the world put together.',
    'Canada has the longest coastline of any country.',
    'Basketball was invented by a Canadian, James Naismith.',
  ],
  MX: [
    'Mexico City was built where the Aztec city of Tenochtitlan stood, on an island in a lake.',
    'People in Mexico were growing corn thousands of years ago, and the Aztecs drank chocolate.',
    'The axolotl, a smiling salamander that can grow back its legs, lives in the lakes of Mexico City.',
  ],
  BR: [
    'Brazil is named after a tree, the brazilwood, which makes a red dye.',
    'The Amazon River carries more water than any other river on Earth.',
    'Brazil has won the soccer World Cup five times, more than any other country.',
  ],
  RU: [
    'Russia is so wide that when it is bedtime on one side, it is morning on the other.',
    'Lake Baikal in Russia is the deepest lake in the world.',
    'Yuri Gagarin, from Russia, was the first person ever to fly into space.',
  ],
  CN: [
    'Paper, the compass and fireworks were all invented in China.',
    'The Chinese calendar gives each year an animal, like the dragon, the tiger or the rabbit.',
    'Silk was first made in China, from the cocoons of silkworms.',
  ],
  AU: [
    'Australia has the platypus, a furry animal with a duck\'s bill that lays eggs.',
    'There are more kangaroos in Australia than people.',
    'The Great Barrier Reef is the biggest thing on Earth built by living creatures.',
  ],
  IN: [
    'India has more people than any other country in the world.',
    'The game of chess began in India, long ago.',
    'Most of the wild tigers in the world live in India.',
  ],
  EG: [
    'The Great Pyramid was the tallest building in the world for almost four thousand years.',
    'Ancient Egyptians wrote with little pictures called hieroglyphs.',
    'Egyptians loved cats so much that some cats were made into mummies.',
  ],
  GB: [
    'Stonehenge is a giant circle of stones that people built about five thousand years ago.',
    'The famous bell in the clock tower in London is called Big Ben.',
    'The story of the Loch Ness Monster comes from a deep lake in Scotland.',
  ],
  FR: [
    'The Eiffel Tower was only meant to stand for twenty years, but people loved it, so it stayed.',
    'In the Lascaux cave in France, people painted horses and bulls on the walls about seventeen thousand years ago.',
    'More people visit France than any other country in the world.',
  ],
  JP: [
    'Japan\'s bullet trains can go almost two hundred miles an hour.',
    'In the snowy mountains of Japan, monkeys warm up in hot springs.',
    'Japan has small earthquakes almost every day, but most are too small to feel.',
  ],
  GR: [
    'The first Olympic Games were held in Greece almost three thousand years ago.',
    'The word "alphabet" comes from the first two Greek letters, alpha and beta.',
    'Greece has thousands of islands, but people live on only about two hundred of them.',
  ],
  IT: [
    'Pizza as we know it was first made in Naples, in Italy.',
    'The Leaning Tower of Pisa started to tip over while it was still being built.',
    'Venice is a city built on water, where people get around by boat.',
  ],
  ES: [
    'The king and queen of Spain paid for Christopher Columbus\'s voyage across the Atlantic in 1492.',
    'In one Spanish town, people throw tomatoes at each other in a giant food fight called La Tomatina.',
    'Spanish is spoken by more than five hundred million people around the world.',
  ],
  DE: [
    'The Christmas tree tradition began in Germany.',
    'A castle in Germany called Neuschwanstein inspired the Sleeping Beauty castle at Disneyland.',
    'Johannes Gutenberg in Germany built a printing press that made books much faster to make.',
  ],
  AR: [
    'Some of the biggest dinosaurs ever found, like Argentinosaurus, lived in Argentina.',
    'Aconcagua in Argentina is the tallest mountain outside of Asia.',
    'The tango, a famous dance, began in Argentina.',
  ],
  ZA: [
    'South Africa has three capital cities.',
    'Nelson Mandela was in prison for twenty-seven years, and then became South Africa\'s president.',
    'Table Mountain in Cape Town has a top as flat as a table.',
  ],
  KE: [
    'Every year, huge herds of wildebeest cross Kenya\'s grasslands in the Great Migration.',
    'Many of the fastest long-distance runners in the world come from Kenya.',
    'The Equator runs right through the middle of Kenya.',
  ],
  PE: [
    'Potatoes were first grown in Peru, and Peru has thousands of different kinds.',
    'The Nazca Lines are giant drawings in the desert, like a monkey and a hummingbird, best seen from the sky.',
    'On Lake Titicaca, people live on floating islands made of reeds.',
  ],
  CL: [
    'The Atacama Desert in Chile is one of the driest places on Earth.',
    'Easter Island, with its giant stone heads called moai, belongs to Chile.',
    'Chile is so long that it is longer than a drive all the way across the United States.',
  ],
  NO: [
    'In the far north of Norway, the sun does not set for weeks in summer.',
    'Every year, Norway gives London a giant Christmas tree as a thank-you present.',
    'The cheese slicer was invented in Norway.',
  ],
  IE: [
    'Halloween began with an old Irish festival called Samhain.',
    'Ireland has no wild snakes. A legend says Saint Patrick drove them all out.',
    'The harp is the symbol of Ireland.',
  ],
  ID: [
    'Indonesia has more active volcanoes than any other country.',
    'Orangutans, the red-haired apes, live in Indonesia\'s rainforests.',
    'Bali, an island in Indonesia, has thousands of temples.',
  ],
  IS: [
    'Iceland has no mosquitoes at all.',
    'Many homes in Iceland are heated with hot water from under the ground.',
    'The Viking sagas, long adventure stories, were written down in Iceland.',
  ],
  NZ: [
    'New Zealand was the first country where women could vote, in 1893.',
    'There are more sheep in New Zealand than people.',
    'The Lord of the Rings films were made in New Zealand.',
  ],
  TR: [
    'Istanbul is a city on two continents, Europe and Asia.',
    'Tulips first came to Europe from Turkey.',
    'In Cappadocia, people carved houses and even whole underground cities out of soft rock.',
  ],
  SA: [
    'Saudi Arabia has no rivers that flow all year.',
    'The Empty Quarter in Saudi Arabia is the biggest sand desert in the world.',
    'Saudi Arabia even holds beauty contests for camels.',
  ],
  MG: [
    'Most of the animals in Madagascar, like lemurs, live nowhere else on Earth.',
    'Madagascar has huge baobab trees that store water in their fat trunks.',
    'One of the smallest lizards in the world is a chameleon from Madagascar that fits on your fingertip.',
  ],
  MN: [
    'Genghis Khan, from Mongolia, built one of the biggest empires there has ever been.',
    'Some of the first dinosaur eggs ever found were dug up in Mongolia\'s Gobi Desert.',
    'Mongolia has more horses than people.',
  ],
  NP: [
    'Nepal\'s flag is the only country flag that isn\'t a rectangle. It is two triangles.',
    'The Sherpa people of Nepal are famous mountain climbers who guide people up Everest.',
    'The Buddha was born in Nepal, in a place called Lumbini.',
  ],
  TH: [
    'Thailand was never ruled by a European country.',
    'The bumblebee bat from Thailand is one of the smallest mammals in the world.',
    'Bangkok, Thailand\'s capital, has one of the longest city names in the world in the Thai language.',
  ],
  MA: [
    'In Morocco, goats climb right up into argan trees to eat the fruit.',
    'Morocco is only about nine miles from Spain, across the Strait of Gibraltar.',
    'A university in the city of Fez is one of the oldest in the world, more than a thousand years old.',
  ],
  ET: [
    'Ethiopia has its own calendar, with thirteen months.',
    'Lucy, one of the most famous early human ancestors, was found in Ethiopia.',
    'In Ethiopia, a big spongy flatbread called injera is used as your plate and your spoon.',
  ],
  CO: [
    'Colombia has more kinds of birds than any other country.',
    'Caño Cristales in Colombia is called the river of five colors, because plants in it turn red, yellow and green.',
    'Most of the world\'s emeralds come from Colombia.',
  ],
  SE: [
    'Sweden has an Ice Hotel that is built fresh out of ice every winter.',
    'The Nobel Prizes were started by a Swedish inventor, Alfred Nobel.',
    'Sweden has more islands than any other country in the world.',
  ],
  GL: [
    'Greenland\'s ice is almost two miles thick in places.',
    'Erik the Red, a Viking, called it Greenland so people would want to move there.',
    'Greenland belongs to Denmark, far away in Europe.',
  ],
  DK: [
    'LEGO bricks were invented in Denmark.',
    'Denmark\'s flag is the oldest country flag still in use.',
    'A statue of the Little Mermaid sits by the water in Copenhagen.',
  ],
  NL: [
    'About a quarter of the Netherlands is lower than the sea, kept dry by walls called dikes.',
    'There are more bicycles than people in the Netherlands.',
    'Dutch people used windmills to pump water off the land.',
  ],
  CH: [
    'Switzerland has four official languages.',
    'Monks in the Swiss Alps trained Saint Bernard dogs to rescue people lost in the snow.',
    'Switzerland is famous for chocolate and for watches.',
  ],
  PT: [
    'Ferdinand Magellan, from Portugal, led the first voyage all the way around the world, though he didn\'t make it home himself.',
    'About half of the world\'s cork comes from the bark of Portugal\'s cork oak trees.',
    'Lisbon, Portugal\'s capital, is even older than Rome.',
  ],
  PL: [
    'Marie Curie, the first woman to win a Nobel Prize, was born in Poland.',
    'A salt mine in Poland has a whole chapel carved out of salt, even the chandeliers.',
    'Copernicus, from Poland, figured out that the Earth goes around the Sun.',
  ],
  VN: [
    'Vietnam has Son Doong, the biggest cave in the world, with a jungle growing inside it.',
    'Ha Long Bay has almost two thousand rocky islands. A legend says a dragon made them.',
    'Vietnam grows more coffee than any country except Brazil.',
  ],
  PH: [
    'The Philippines has tarsiers, tiny animals with eyes bigger than their brains.',
    'The yo-yo became famous thanks to a toymaker from the Philippines.',
    'The Chocolate Hills are more than a thousand round hills that turn brown in the dry season.',
  ],
  KR: [
    'Korea\'s alphabet, Hangul, was invented by King Sejong so that everyone could learn to read.',
    'Kimchi, spicy pickled cabbage, is eaten with almost every meal in Korea.',
    'In Korea, everyone used to turn a year older together on New Year\'s Day.',
  ],
  PK: [
    'Mohenjo-daro in Pakistan was one of the first big cities in the world, with streets and drains, four and a half thousand years ago.',
    'Pakistan has more glaciers than almost anywhere outside the North and South Poles.',
    'The Karakoram Highway in Pakistan is one of the highest roads in the world.',
  ],
  IR: [
    'Persian cats first came from Iran.',
    'Iran is famous for beautiful hand-woven carpets.',
    'Persian New Year, called Nowruz, starts on the first day of spring.',
  ],
  IL: [
    'The shore of the Dead Sea is the lowest land on Earth.',
    'Jerusalem is one of the oldest cities in the world, holy to Jews, Christians and Muslims.',
    'The Dead Sea Scrolls, some of the oldest writings ever found, were discovered in caves by a shepherd boy.',
  ],
  NG: [
    'More than five hundred languages are spoken in Nigeria.',
    'Nigeria has one of the biggest movie industries in the world, called Nollywood.',
    'The Nok people of Nigeria made clay sculptures more than two thousand years ago.',
  ],
  GH: [
    'Ghana grows lots of cocoa beans, which are used to make chocolate.',
    'Lake Volta in Ghana is one of the biggest lakes ever made by people.',
    'In 1957, Ghana became the first country south of the Sahara to win its freedom from a colonial ruler.',
  ],
  TZ: [
    'Tanzania has the Serengeti, where lions, zebras and wildebeest roam.',
    'Olduvai Gorge in Tanzania has some of the oldest stone tools made by early humans.',
    'Zanzibar, an island of Tanzania, is called the Spice Island, famous for cloves.',
  ],
  DZ: [
    'Long ago the Sahara was green. In Algeria\'s desert there are old rock paintings of giraffes and hippos.',
    'Some sand dunes in Algeria are taller than skyscrapers.',
    'Couscous, tiny grains of pasta, is a favorite food in Algeria.',
  ],
  TN: [
    'Scenes for Luke Skywalker\'s desert home in Star Wars were filmed in Tunisia.',
    'Hannibal, from Carthage, marched elephants over the Alps to attack Rome.',
    'In Matmata, people live in houses dug into the ground to stay cool.',
  ],
  CU: [
    'The bee hummingbird, the smallest bird in the world, lives in Cuba.',
    'Old cars from the 1950s still drive around the streets of Havana.',
    'Cuba is shaped a bit like a crocodile, and Cubans call it the Crocodile.',
  ],
  JM: [
    'Usain Bolt, the fastest runner ever timed, is from Jamaica.',
    'Reggae music comes from Jamaica.',
    'Jamaica sent a bobsled team to the Winter Olympics, even though it never snows there.',
  ],
  VE: [
    'Angel Falls is so tall that some of its water turns to mist before it reaches the bottom.',
    'Over Lake Maracaibo in Venezuela, lightning flashes on most nights of the year.',
    'Venezuela has tepuis, flat-topped mountains that inspired a story about a lost world of dinosaurs.',
  ],
  BO: [
    'Bolivia has two capital cities, La Paz and Sucre.',
    'La Paz is one of the highest capital cities in the world.',
    'People in La Paz ride cable cars across the city instead of a subway.',
  ],
  EC: [
    'The Equator line goes through Ecuador, and "Ecuador" is the Spanish word for equator.',
    'Charles Darwin studied the finches and tortoises of the Galápagos to learn how animals change.',
    'The top of Chimborazo, a volcano in Ecuador, is the place on Earth closest to the stars.',
  ],
  GT: [
    'The Maya pyramids of Tikal rise up above the rainforest trees.',
    'Guatemala\'s national bird, the quetzal, has long, shimmering green tail feathers.',
    'Guatemala has a volcano called Fuego, which means fire, that puffs out smoke almost every day.',
  ],
  UA: [
    'Ukraine has the deepest subway station in the world, in Kyiv.',
    'Ukrainians decorate eggs with beautiful patterns, called pysanky.',
    'The biggest airplane ever built, the Mriya, was made in Ukraine.',
  ],
  AT: [
    'The zoo in Vienna is the oldest zoo in the world that is still open.',
    'The song "Silent Night" was first sung in Austria.',
    'Most of Austria is covered by the Alps.',
  ],
  FI: [
    'Finland has millions of saunas, about one for every two people.',
    'Many people say Santa Claus lives in Lapland, in the north of Finland.',
    'The Moomins, the gentle cartoon trolls, were created in Finland.',
  ],
  CZ: [
    'Prague Castle is one of the biggest castles in the world.',
    'The word "robot" was first used by a Czech writer.',
    'Prague\'s old astronomical clock has been ticking for more than six hundred years.',
  ],
  HU: [
    'The Rubik\'s Cube was invented in Hungary.',
    'Budapest used to be two cities, Buda and Pest, on either side of the Danube.',
    'Hungary has lots of hot springs, and people swim in warm outdoor pools even in winter.',
  ],
  RO: [
    'Romania has more brown bears than almost any other country in Europe.',
    'Romania\'s Palace of the Parliament is one of the heaviest buildings in the world.',
    'Bran Castle, sometimes called Dracula\'s Castle, sits high on a rocky hill.',
  ],
};
