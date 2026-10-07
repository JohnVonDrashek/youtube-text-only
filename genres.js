// The genres JEV picks from, one per video, with the Lucide icon shown for
// each. `about` is what JEV reads when choosing, and it reads literally, so
// each one says plainly what belongs there. Shared by the content scripts and
// the background worker. JEV allows up to 255 options.
//
// `family` colors the icon (see content.css). Only four hues stay distinct
// when any two can sit side by side, in both themes and for red-green color
// blindness, so related genres share a color and the icon tells them apart:
// gold for faith and heritage, blue for knowledge, pink for arts and fun,
// green for everyday life, gray for other.
const GENRES = [
  { id: 'faith', family: 'gold', label: 'Faith', icon: 'Church', about: 'Religion and spiritual life: theology, prayer, liturgy, saints, scripture, church teaching, apologetics.' },
  { id: 'history', family: 'gold', label: 'History', icon: 'Landmark', about: 'Past events, eras, empires, wars and historical figures, including archaeology.' },
  { id: 'music', family: 'pink', label: 'Music', icon: 'Music', about: 'Songs, albums, covers, mixes, chant, live performances and music playlists.' },
  { id: 'gaming', family: 'pink', label: 'Gaming', icon: 'Gamepad2', about: 'Video games: playthroughs, reviews, speedruns, game lore and gaming news.' },
  { id: 'tech', family: 'blue', label: 'Tech & AI', icon: 'Cpu', about: 'Computers, software, programming, gadgets, the internet and artificial intelligence.' },
  { id: 'science', family: 'blue', label: 'Science', icon: 'FlaskConical', about: 'Physics, chemistry, biology, space, medicine, math and how nature works.' },
  { id: 'language', family: 'blue', label: 'Languages', icon: 'Languages', about: 'Learning languages, linguistics, alphabets, words and how languages work.' },
  { id: 'ideas', family: 'gold', label: 'Ideas', icon: 'Brain', about: 'Philosophy, ethics, arguments, debates, psychology and big ideas.' },
  { id: 'news', family: 'blue', label: 'News & politics', icon: 'Newspaper', about: 'Current events, politics, government, law and social issues.' },
  { id: 'howto', family: 'green', label: 'How-to', icon: 'Wrench', about: 'Practical tutorials: fixing, making, building, DIY and life skills.' },
  { id: 'comedy', family: 'pink', label: 'Comedy', icon: 'Laugh', about: 'Jokes, memes, sketches, parody, pranks and funny compilations.' },
  { id: 'film', family: 'pink', label: 'Film & TV', icon: 'Clapperboard', about: 'Movies, TV shows, anime and cartoons, trailers, scenes and reviews of them.' },
  { id: 'books', family: 'gold', label: 'Books', icon: 'BookOpen', about: 'Books, literature, poetry, authors and reading.' },
  { id: 'art', family: 'pink', label: 'Art & design', icon: 'Palette', about: 'Drawing, painting, animation craft, architecture, design and crafts.' },
  { id: 'sports', family: 'green', label: 'Sports & fitness', icon: 'Dumbbell', about: 'Sports, athletes, exercise, workouts and outdoor activities.' },
  { id: 'food', family: 'green', label: 'Food', icon: 'ChefHat', about: 'Cooking, recipes, restaurants, food reviews and drinks.' },
  { id: 'travel', family: 'green', label: 'Travel & places', icon: 'Map', about: 'Travel, cities, countries, geography and maps.' },
  { id: 'money', family: 'green', label: 'Business & money', icon: 'Briefcase', about: 'Business, companies, careers, investing, economics and personal finance.' },
  { id: 'life', family: 'green', label: 'Vlogs & life', icon: 'UserRound', about: "Someone's daily life, personal stories, vlogs, family and relationships." },
  { id: 'other', family: 'gray', label: 'Other', icon: 'CircleHelp', about: 'Fits none of the other genres.' },
];

// Cached answers belong to one version of this list.
const GENRES_VERSION = GENRES.map(g => g.id + ':' + g.about).join('|');
