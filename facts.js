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
    'Vikings in Iceland started a parliament more than a thousand years ago. It is one of the oldest in the world.',
  ],
  NZ: [
    'New Zealand was the first country where women could vote, in 1893.',
    'There are more sheep in New Zealand than people.',
    'The kiwi, New Zealand\'s bird, can\'t fly, and it lays one of the biggest eggs for its size of any bird.',
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
    'Denmark has more than four hundred islands.',
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
    'Tunisia has a giant Roman arena at El Djem, where gladiators once fought.',
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
    'Venezuela has tepuis, flat-topped mountains so tall and steep that some plants and frogs on top live nowhere else.',
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
    'In the north of Finland, the Sámi people herd reindeer.',
  ],
  CZ: [
    'Prague Castle is one of the biggest castles in the world.',
    'Czechia has more than two thousand castles.',
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

// Each US state, by postal code.
const STATE_FACTS = {
  CA: [
    'In 1848, gold was found at Sutter\'s Mill, and thousands of people rushed to California to dig for it.',
    'Death Valley, in California, is the hottest place ever measured on Earth.',
    'California\'s coast redwoods are the tallest trees in the world.',
  ],
  NV: [
    'The giant Hoover Dam, on the edge of Nevada, holds back the Colorado River to make Lake Mead.',
    'Nevada became a state during the Civil War, so its motto is "Battle Born."',
    'Some of the oldest living trees on Earth, bristlecone pines thousands of years old, grow in Nevada\'s mountains.',
  ],
  OR: [
    'Pioneers walked about two thousand miles beside their covered wagons on the Oregon Trail.',
    'Lewis and Clark spent a rainy winter at the Pacific Ocean in Oregon, at the end of their long journey west.',
    'Puffins nest on Haystack Rock, a giant rock standing in the sea on Oregon\'s coast.',
  ],
  AZ: [
    'The oldest rocks at the bottom of the Grand Canyon are almost two billion years old.',
    'In the Petrified Forest, ancient trees have turned to colorful stone.',
    'Arizona joined the United States on Valentine\'s Day in 1912, the last of the forty-eight states next to each other.',
  ],
  TX: [
    'For almost ten years, Texas was its own country, the Republic of Texas.',
    'Davy Crockett and Jim Bowie fought at the Alamo, an old mission in San Antonio, in 1836.',
    'When astronauts first landed on the Moon, the first word they said from there was "Houston", the Texas city where Mission Control is.',
  ],
  FL: [
    'Saint Augustine, Florida, founded by the Spanish in 1565, is the oldest city started by Europeans in the United States.',
    'The rocket that took astronauts to the Moon in 1969 launched from Cape Canaveral, Florida.',
    'South Florida is the only place in the world where alligators and crocodiles live side by side.',
  ],
  AK: [
    'The United States bought Alaska from Russia in 1867, for about two cents an acre.',
    'In 1925, sled dogs like Balto and Togo raced medicine across the snow to sick children in Nome, Alaska.',
    'In the far north of Alaska, the sun doesn\'t set for about two months in summer.',
  ],
  HI: [
    'Long ago, Polynesian sailors found Hawaii by steering their canoes by the stars.',
    'Hawaii has the only royal palace in the United States, where Hawaiian kings and queens lived.',
    'Surfing was first made famous in Hawaii, where even kings rode the waves.',
  ],
  WA: [
    'Washington is the only state named after a president, George Washington.',
    'In 1980, the volcano Mount Saint Helens erupted and blew off the whole top of the mountain.',
    'The Space Needle in Seattle was built for a World\'s Fair in 1962.',
  ],
  NY: [
    'The Statue of Liberty was a present to the United States from France.',
    'Niagara Falls, on New York\'s border with Canada, pours out more water than almost any waterfall on Earth.',
    'New York City was once a Dutch town called New Amsterdam.',
  ],
  UT: [
    'In 1869, a golden spike in Utah joined the railroad tracks from east and west, so trains could cross the whole country.',
    'At Dinosaur National Monument in Utah, you can see a wall of rock with more than a thousand dinosaur bones in it.',
    'The Great Salt Lake is much saltier than the ocean, so you float in it easily.',
  ],
  ID: [
    'Sacagawea, the young woman who helped guide Lewis and Clark, was born in Idaho.',
    'Hells Canyon in Idaho is deeper than the Grand Canyon.',
    'Astronauts visited Idaho\'s Craters of the Moon to practice studying rocks before going to the Moon.',
  ],
  CO: [
    'Colorado has more than fifty mountains over fourteen thousand feet tall.',
    'At Mesa Verde, Ancestral Pueblo people built whole villages into the sides of cliffs.',
    'Colorado has the tallest sand dunes in North America.',
  ],
  NM: [
    'Santa Fe, New Mexico, is the oldest state capital in the United States, more than four hundred years old.',
    'Every summer evening, hundreds of thousands of bats fly out of Carlsbad Caverns.',
    'People have lived in the adobe houses of Taos Pueblo for about a thousand years.',
  ],
  MT: [
    'The first Tyrannosaurus rex skeleton ever found was dug up in Montana.',
    'At the Battle of the Little Bighorn in Montana, in 1876, Sitting Bull and Crazy Horse led their people to a great victory.',
    'Montana\'s Glacier National Park has mountain goats that climb the steepest cliffs.',
  ],
  WY: [
    'Wyoming was the first place in the United States where women could vote, in 1869.',
    'Devils Tower in Wyoming was the first national monument. A Native American legend says a giant bear made its stripes with its claws.',
    'Most of Yellowstone, the world\'s first national park, is in Wyoming.',
  ],
  LA: [
    'In 1803, the Louisiana Purchase doubled the size of the United States.',
    'Jazz music was born in New Orleans, Louisiana.',
    'Every year, New Orleans has Mardi Gras, with parades, masks and beads thrown from floats.',
  ],
  MI: [
    'Detroit, Michigan, is called the Motor City because Henry Ford and others built cars there.',
    'On Mackinac Island in Michigan, cars aren\'t allowed. People ride horses, carriages and bikes.',
    'Michigan touches four of the five Great Lakes.',
  ],
  ME: [
    'Maine grows most of the wild blueberries in the United States.',
    'Thousands of moose live in the North Woods of Maine.',
    'For part of the year, the top of Cadillac Mountain in Maine is the first place in the United States to see the sunrise.',
  ],
  GA: [
    'Martin Luther King Jr., who led the fight for fair treatment for Black Americans, was born in Atlanta, Georgia.',
    'The Girl Scouts were started in Savannah, Georgia, by Juliette Gordon Low.',
    'Georgia is named after King George the Second of England.',
  ],
  IL: [
    'Abraham Lincoln lived in Illinois before he became president, so it\'s called the Land of Lincoln.',
    'The first skyscraper in the world was built in Chicago.',
    'A legend says the Great Chicago Fire of 1871 started when Mrs. O\'Leary\'s cow kicked over a lantern.',
  ],
  OK: [
    'In the Land Run of 1889, thousands of settlers raced on horses and wagons to claim land in Oklahoma.',
    'Many Native American nations were forced to walk to Oklahoma on a sad journey called the Trail of Tears.',
    'Today, almost forty Native American nations have their headquarters in Oklahoma.',
  ],
  KS: [
    'Amelia Earhart, the famous pilot who flew alone across the Atlantic, was born in Kansas.',
    'Long ago, huge herds of bison roamed the Kansas prairie.',
    'The middle of the forty-eight states next to each other is in Kansas.',
  ],
  NE: [
    'Arbor Day, a holiday for planting trees, was started in Nebraska.',
    'Pioneers on the Oregon Trail looked out for Chimney Rock in Nebraska, a tall rock shaped like a chimney.',
    'Nebraska has the biggest train yard in the world, where trains are sorted and fixed.',
  ],
  ND: [
    'Theodore Roosevelt was a cowboy on a ranch in North Dakota, and a national park there is named after him.',
    'Lewis and Clark spent a winter in North Dakota, where they met Sacagawea.',
    'The town of Rugby, North Dakota, says it is the middle of all of North America.',
  ],
  SD: [
    'Sue, one of the biggest and most complete T. rex skeletons ever found, was dug up in South Dakota.',
    'The walls of Wind Cave in South Dakota are covered in a rock pattern that looks like honeycomb.',
    'A giant carving of the Lakota leader Crazy Horse is being made in a mountain in South Dakota. It will be even bigger than Mount Rushmore.',
  ],
  MN: [
    'The mighty Mississippi River starts in Minnesota as a stream so small you can walk across it on stepping stones.',
    'In the tall tales, the giant lumberjack Paul Bunyan and Babe the blue ox made Minnesota\'s lakes with their footprints.',
    'The Mall of America in Minnesota is so big it has a theme park with roller coasters inside.',
  ],
  IA: [
    'The farmhouse in the famous painting American Gothic, with the farmer holding a pitchfork, is in Iowa.',
    'At Effigy Mounds, Native Americans long ago built earth mounds shaped like bears and birds.',
    'Herbert Hoover, born in Iowa, was the first president born west of the Mississippi River.',
  ],
  MO: [
    'Ice cream cones became famous at the World\'s Fair in Saint Louis, Missouri, in 1904.',
    'The Pony Express, riders carrying mail on fast horses, started in Saint Joseph, Missouri.',
    'Lewis and Clark set off from near Saint Louis in 1804 to explore the West.',
  ],
  AR: [
    'A state law says Arkansas must be said "ARK-an-saw."',
    'In Hot Springs, Arkansas, people have bathed in naturally warm water for hundreds of years.',
    'President Bill Clinton was born in Arkansas.',
  ],
  WI: [
    'The first kindergarten in the United States opened in Wisconsin in 1856.',
    'Wisconsin has more than fifteen thousand lakes.',
    'Harry Houdini, the famous escape artist, grew up in Wisconsin.',
  ],
  OH: [
    'Ohio\'s flag is the only state flag that isn\'t a rectangle. It\'s shaped like a swallow\'s tail.',
    'The Wright brothers built their airplane in their bicycle shop in Dayton, Ohio.',
    'Thomas Edison, inventor of the light bulb, was born in Ohio.',
  ],
  IN: [
    'Abraham Lincoln spent much of his boyhood on a farm in Indiana.',
    'There is a town in Indiana called Santa Claus, where helpers answer children\'s letters to Santa.',
    'Wabash, Indiana, says it was the first town in the world lit up by electric lights.',
  ],
  KY: [
    'Abraham Lincoln was born in a log cabin in Kentucky.',
    'Daniel Boone, a famous frontiersman, explored Kentucky and helped make a trail through the mountains.',
    'The Kentucky Derby horse race has been run every year since 1875.',
  ],
  TN: [
    'Davy Crockett, the famous frontiersman, was born in Tennessee.',
    'In the Great Smoky Mountains, thousands of fireflies flash all together on summer nights.',
    'The Grand Ole Opry in Nashville has been playing music on the radio since 1925.',
  ],
  MS: [
    'The teddy bear got its name after President Theodore Roosevelt went bear hunting in Mississippi and refused to shoot a tied-up bear.',
    'Jim Henson, who made the Muppets, was born in Mississippi.',
    'Elvis Presley was born in Tupelo, Mississippi.',
  ],
  AL: [
    'In 1955, Rosa Parks refused to give up her bus seat in Montgomery, Alabama, and helped change unfair laws.',
    'Helen Keller, who could not see or hear but learned to read, write and speak, was born in Alabama.',
    'Mobile, Alabama, says it had the first Mardi Gras parade in America, even before New Orleans.',
  ],
  SC: [
    'The first shots of the Civil War were fired at Fort Sumter, in South Carolina, in 1861.',
    'In 1718, the pirate Blackbeard blocked the harbor of Charleston with his ships.',
    'Charleston, South Carolina, has a street of old houses painted in bright colors, called Rainbow Row.',
  ],
  NC: [
    'Virginia Dare, the first English baby born in America, was born on Roanoke Island. Her whole colony later vanished.',
    'The wreck of Blackbeard\'s pirate ship, the Queen Anne\'s Revenge, was found off North Carolina.',
    'The Cape Hatteras Lighthouse is the tallest brick lighthouse in the United States.',
  ],
  VA: [
    'Jamestown, Virginia, started in 1607, was the first English town in America that lasted. Pocahontas lived nearby.',
    'More presidents were born in Virginia than in any other state, including George Washington and Thomas Jefferson.',
    'The American Revolution was won at Yorktown, Virginia, in 1781.',
  ],
  WV: [
    'In the legend of John Henry, a strong railroad worker raced a steam drill through a mountain tunnel in West Virginia, and won.',
    'West Virginia split off from Virginia during the Civil War to become its own state.',
    'The New River Gorge Bridge in West Virginia is one of the longest steel arch bridges in the world.',
  ],
  PA: [
    'The Declaration of Independence was signed in Philadelphia, Pennsylvania, in 1776.',
    'Benjamin Franklin flew a kite in a thunderstorm in Philadelphia to show that lightning is electricity.',
    'On Groundhog Day, people in Punxsutawney, Pennsylvania, watch a groundhog to see if winter will last longer.',
  ],
  NJ: [
    'Thomas Edison invented the phonograph and worked on the light bulb in his lab in Menlo Park, New Jersey.',
    'The first nearly complete dinosaur skeleton in North America was found in New Jersey in 1858.',
    'On Christmas night in 1776, George Washington crossed the icy Delaware River to surprise his enemies in Trenton, New Jersey.',
  ],
  MD: [
    'Francis Scott Key wrote "The Star-Spangled Banner" after watching a battle at Fort McHenry in Maryland.',
    'Harriet Tubman was born in Maryland. She escaped slavery and then led many others to freedom.',
    'Maryland\'s official state sport is jousting, like the knights of old.',
  ],
  DE: [
    'In 1776, Caesar Rodney rode all night through a storm to Philadelphia so Delaware could vote for independence.',
    'Delaware is called the Blue Hen State, after the fighting chickens its soldiers carried in the Revolution.',
    'Swedish settlers in Delaware built some of the first log cabins in America.',
  ],
  CT: [
    'At Mystic Seaport in Connecticut, you can climb aboard an old wooden whaling ship.',
    'The first nuclear submarine, the Nautilus, was built in Connecticut. It once sailed under the ice at the North Pole.',
    'The first telephone book ever was printed in New Haven, Connecticut. It had fifty names.',
  ],
  RI: [
    'Most of Rhode Island isn\'t an island at all. It\'s on the mainland.',
    'Rhode Island was the first colony to declare independence from Britain, in May 1776.',
    'The oldest synagogue building in the United States is in Newport, Rhode Island.',
  ],
  MA: [
    'At the Boston Tea Party in 1773, colonists dumped crates of tea into Boston Harbor to protest a tax.',
    'Paul Revere rode at midnight to warn that British soldiers were coming.',
    'Harvard, in Massachusetts, is the oldest college in the United States.',
  ],
  VT: [
    'Vermont has more than a hundred old covered bridges.',
    'For fourteen years, Vermont was its own little country before it joined the United States.',
    'A farmer in Vermont, Wilson Bentley, took the first ever photograph of a single snowflake.',
  ],
  NH: [
    'In 1934, a gust of wind at 231 miles an hour was measured on top of Mount Washington in New Hampshire.',
    'A rock face called the Old Man of the Mountain looked out from a cliff in New Hampshire for thousands of years.',
    'New Hampshire\'s motto is "Live Free or Die."',
  ],
};

// Seas, bays and gulfs, by their key in places.js.
const SEA_FACTS = {
  'hudson-bay': [
    'Henry Hudson sailed into the bay in 1610, looking for a way to China. His crew set him adrift in a little boat, and he was never seen again.',
    'The Hudson\'s Bay Company, started in 1670 to trade furs, is one of the oldest companies in the world.',
    'In summer, thousands of white beluga whales swim into the rivers of Hudson Bay.',
  ],
  'gulf-of-mexico': [
    'The pirate Jean Lafitte hid his ships in the bays along the Gulf of Mexico.',
    'Kemp\'s ridley sea turtles, the smallest sea turtles, come to its beaches to lay their eggs.',
    'Warm water from the Gulf of Mexico flows out into the Atlantic and helps start the Gulf Stream.',
  ],
  'caribbean-sea': [
    'Christopher Columbus\'s ships reached the islands of the Caribbean in 1492.',
    'Port Royal in Jamaica was a famous pirate town, until an earthquake sank much of it into the sea in 1692.',
    'The coral reefs of the Caribbean are home to sea turtles, parrotfish and seahorses.',
  ],
  'mediterranean-sea': [
    'Mediterranean means "in the middle of the land."',
    'The Greeks said its entrance, by Gibraltar, was guarded by the Pillars of Hercules.',
    'The Romans ruled all the lands around it and called it "Our Sea."',
  ],
  'gulf-of-alaska': [
    'In 1958, a landslide in Lituya Bay made the biggest wave ever recorded, taller than any building in the world back then.',
    'Vitus Bering, sailing for Russia in 1741, was one of the first Europeans to see Alaska, from the Gulf of Alaska.',
    'Sea otters in the Gulf of Alaska hold hands while they sleep, so they don\'t drift apart.',
  ],
  'bering-sea': [
    'In the Ice Age, the sea was lower, and people walked across a land bridge here from Asia to America.',
    'Two islands in the Bering Sea, Big Diomede and Little Diomede, are less than three miles apart, but a whole day apart, because the date line runs between them.',
    'It is named after Vitus Bering, a Danish explorer who sailed for the Russian tsar.',
  ],
  'golfo-de-california': [
    'The explorer Jacques Cousteau called the Gulf of California "the world\'s aquarium."',
    'Huge groups of rays leap out of the water in the Gulf of California, flapping like birds.',
    'The vaquita, the smallest porpoise in the world, lives only here.',
  ],
  'red-sea': [
    'In the Bible story, Moses parts the waters of the Red Sea.',
    'The Red Sea is slowly getting wider, because Africa and Arabia are drifting apart.',
    'It may be named after red seaweed that sometimes blooms in the water.',
  ],
  'black-sea': [
    'Deep in the Black Sea there is almost no oxygen, so ancient shipwrecks have stayed whole for thousands of years.',
    'In the Greek myths, the warrior women called the Amazons lived on the shores of the Black Sea.',
    'The ancient Greeks called it the "Welcoming Sea," hoping to make it friendly to sailors.',
  ],
  'north-sea': [
    'Long ago, part of the North Sea was dry land where people hunted. Today it is called Doggerland.',
    'In the year 793, Vikings sailed across the North Sea and raided the island monastery of Lindisfarne.',
    'The Dutch built giant gates and walls called the Delta Works to hold back North Sea storms.',
  ],
  'baltic-sea': [
    'The Swedish warship Vasa sank on its very first voyage in 1628, and was lifted out of the sea more than three hundred years later.',
    'Long ago, merchants of the Hanseatic League sailed the Baltic in round ships called cogs, trading fish, furs and amber.',
    'In the north, the Baltic freezes over in winter.',
  ],
  'bay-of-bengal': [
    'In the Sundarbans, a huge mangrove forest on the Bay of Bengal, tigers swim between the islands.',
    'The Ganges River flows into the bay, making the biggest river delta in the world.',
    'The monsoon winds blow off the bay and bring heavy summer rains to India.',
  ],
  'aegean-sea': [
    'In the myths, the Minotaur lived in a maze called the Labyrinth on Crete, at the southern edge of the Aegean.',
    'The city of Troy, from the story of the wooden horse, stood near the Aegean shore.',
    'Divers found an ancient Greek machine in a shipwreck nearby that could predict eclipses. Some call it the first computer.',
  ],
  'arabian-sea': [
    'Long ago, sailors waited for the monsoon winds to blow them across the Arabian Sea to trade spices.',
    'The humpback whales of the Arabian Sea never leave it. They are the most isolated whales in the world.',
    'Traders crossed it in wooden sailing boats called dhows for thousands of years.',
  ],
  'south-china-sea': [
    'About six hundred years ago, the Chinese admiral Zheng He sailed giant treasure ships across the South China Sea.',
    'It is one of the busiest seas in the world, with thousands of ships carrying things everywhere.',
    'Strong storms called typhoons often form over the South China Sea.',
  ],
  'sea-of-japan': [
    'In the Japanese tale of Urashima Taro, a fisherman rides a turtle to a palace under the sea, where a dragon king lives.',
    'Twice, storms that the Japanese called "kamikaze," the divine wind, wrecked fleets sailing to invade Japan.',
    'Giant jellyfish in the Sea of Japan can grow bigger than a person.',
  ],
  'coral-sea': [
    'In 1770, Captain Cook\'s ship Endeavour ran aground on the Great Barrier Reef.',
    'Sea turtles swim thousands of miles to lay their eggs on the beaches of the Coral Sea.',
    'In the Battle of the Coral Sea in 1942, the ships fighting never even saw each other. Airplanes did all the fighting.',
  ],
  'tasman-sea': [
    'It is named after the Dutch explorer Abel Tasman, who sailed there in 1642.',
    'Giant stick insects thought to be gone forever were found living on a lonely rock in the Tasman Sea.',
    'In 1928, a pilot named Charles Kingsford Smith made the first flight across the Tasman Sea.',
  ],
  'persian-gulf': [
    'In Bahrain, an island country in the Persian Gulf, a single tree called the Tree of Life grows all alone in the desert.',
    'The ancient Sumerians told of Dilmun, a magical land in the gulf where no one grew old.',
    'Gentle sea cows called dugongs graze on sea grass in the Persian Gulf.',
  ],
  'gulf-of-guinea': [
    'Ghana, on the Gulf of Guinea, used to be called the Gold Coast, because of all its gold.',
    'On the island of São Tomé in the gulf, a giant rock tower called Pico Cão Grande sticks straight up out of the jungle.',
    'Sea turtles come to its beaches to lay their eggs.',
  ],
  'labrador-sea': [
    'About a thousand years ago, the Viking Leif Erikson sailed past Labrador and called it Markland, the land of forests.',
    'Icebergs from Greenland float south through the Labrador Sea. The one that sank the Titanic came this way.',
    'Labrador retriever dogs got their name from this part of Canada.',
  ],
  'baffin-bay': [
    'It is named after William Baffin, an English sailor who explored it in 1616.',
    'The Inuit hunted in Baffin Bay in kayaks, boats they invented.',
    'In 1845, whalers in Baffin Bay saw the ships of the explorer John Franklin. After that, his expedition was never seen again.',
  ],
  'bay-of-biscay': [
    'Surfing in Europe began in Biarritz, a town on the Bay of Biscay.',
    'Long ago, Basque sailors from the bay\'s shores were some of the first people to hunt whales far out at sea.',
    'Dolphins and whales are often seen from the ferries that cross the bay.',
  ],
  'irish-sea': [
    'A legend says the giant Finn McCool scooped up a chunk of Ireland and threw it into the sea, and it became the Isle of Man.',
    'Saint Patrick crossed the Irish Sea to bring Christianity to Ireland.',
    'On the Isle of Man, in the middle of the Irish Sea, there is a kind of cat with no tail, the Manx cat.',
  ],
  'sargasso-sea': [
    'Eels from rivers in Europe and America swim thousands of miles to the Sargasso Sea to lay their eggs.',
    'Columbus\'s sailors were afraid the seaweed would trap their ships.',
    'Part of the Sargasso Sea is in the Bermuda Triangle, where many stories say ships disappeared.',
  ],
  'gulf-of-saint-lawrence': [
    'Whales, even giant blue whales, swim into the Gulf of Saint Lawrence to feed.',
    'The French explorer Jacques Cartier sailed into the gulf in 1534.',
    'Vikings built a village nearby, on the tip of Newfoundland, about a thousand years ago.',
  ],
  'adriatic-sea': [
    'Every year, Venice holds a ceremony where it "marries" the sea by throwing a ring into the water.',
    'Marco Polo sailed from Venice on the Adriatic on his long journey to China.',
    'In Split, on the Adriatic, people live and shop inside the walls of a Roman emperor\'s palace.',
  ],
  'caspian-sea': [
    'Sturgeon, huge fish whose family goes back to the time of the dinosaurs, live in the Caspian Sea.',
    'The Volga, the longest river in Europe, flows into the Caspian Sea.',
    'The Caspian has its own seals, living far from any ocean.',
  ],
  'weddell-sea': [
    'In 2022, explorers found Shackleton\'s ship Endurance on the bottom of the Weddell Sea, more than a hundred years after it sank.',
    'Weddell seals live farther south than any other mammal.',
    'Emperor penguins huddle together on its ice through the long, dark winter.',
  ],
  'ross-sea': [
    'Roald Amundsen and Robert Falcon Scott both started their race to the South Pole from the edge of the Ross Sea.',
    'The Ross Ice Shelf, a huge floating sheet of ice, is about as big as France.',
    'Mount Erebus, a volcano near the Ross Sea, has a lake of glowing lava in its crater.',
  ],
  'barents-sea': [
    'In 1596, the Dutch explorer Willem Barentsz and his crew were trapped by ice and had to spend the winter in a hut they built.',
    'Polar bears and walruses live on the islands of Svalbard, at the edge of the Barents Sea.',
    'Warm water from the Gulf Stream keeps part of the Barents Sea free of ice, even in winter.',
  ],
  'sea-of-okhotsk': [
    'Drifting sea ice reaches Japan from the Sea of Okhotsk, farther south than anywhere else in the Northern Hemisphere.',
    'Steller\'s sea eagles, some of the biggest eagles in the world, spend the winter there.',
    'The Ainu people of northern Japan told stories of gods that came as bears and owls.',
  ],
  'philippine-sea': [
    'Ferdinand Magellan crossed the Philippine Sea to reach the Philippines in 1521.',
    'Some of the strongest typhoons in the world form over the Philippine Sea.',
    'Japan protects a tiny reef in the Philippine Sea, Okinotorishima, with concrete walls to keep it from washing away.',
  ],
  'yellow-sea': [
    'The Great Wall of China ends at the sea, at a spot called the Old Dragon\'s Head.',
    'Off the coast of Korea, the tide goes out so far that a path appears, and people walk across the sea to an island.',
    'Millions of birds stop to rest and eat on its mudflats on their long journeys.',
  ],
  'gulf-of-aden': [
    'Ships carried frankincense and myrrh, precious perfumes, across the Gulf of Aden in ancient times.',
    'On the island of Socotra nearby, dragon\'s blood trees look like giant umbrellas and have red sap.',
    'Legends say the Queen of Sheba ruled lands on both sides of the gulf.',
  ],
  'great-australian-bight': [
    'The Bunda Cliffs along the bight are some of the longest unbroken sea cliffs in the world.',
    'The explorer Matthew Flinders mapped the coast of the bight in 1802.',
    'Great white sharks swim in its cold waters.',
  ],
};
