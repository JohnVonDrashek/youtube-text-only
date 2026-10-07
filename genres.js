// The genres JEV picks from, one per video, with the Lucide icon shown for
// each. `about` is what JEV reads when choosing, and it reads literally, so
// each one says plainly what belongs there. Shared by the content scripts and
// the background worker. JEV allows up to 255 options.
//
// `color` is the disc behind each icon (the icon is drawn in white or
// near-black, whichever reads better on it). The 20 colors started from an
// obvious color for each genre and were nudged apart until every pair differs
// by at least 13.7 in OKLab (x100), near the 15 where two colors read as
// clearly different. Twenty is past what red-green color blindness can tell
// apart, so the icon shape still carries the genre too.
const GENRES = [
  { id: 'faith', color: '#ffd339', label: 'Faith', icon: 'Church', about: 'Religion and spiritual life: theology, prayer, liturgy, saints, scripture, church teaching, apologetics.' },
  { id: 'history', color: '#645000', label: 'History', icon: 'Landmark', about: 'Past events, eras, empires, wars and historical figures, including archaeology.' },
  { id: 'music', color: '#c63fb1', label: 'Music', icon: 'Music', about: 'Songs, albums, covers, mixes, chant, live performances and music playlists.' },
  { id: 'gaming', color: '#7458de', label: 'Gaming', icon: 'Gamepad2', about: 'Video games: playthroughs, reviews, speedruns, game lore and gaming news.' },
  { id: 'tech', color: '#3dd0fe', label: 'Tech & AI', icon: 'Cpu', about: 'Computers, software, programming, gadgets, the internet and artificial intelligence.' },
  { id: 'science', color: '#24b6a1', label: 'Science', icon: 'FlaskConical', about: 'Physics, chemistry, biology, space, medicine, math and how nature works.' },
  { id: 'language', color: '#4c99fb', label: 'Languages', icon: 'Languages', about: 'Learning languages, linguistics, alphabets, words and how languages work.' },
  { id: 'ideas', color: '#caa1fd', label: 'Ideas', icon: 'Brain', about: 'Philosophy, ethics, arguments, debates, psychology and big ideas.' },
  { id: 'news', color: '#0050a2', label: 'News & politics', icon: 'Newspaper', about: 'Current events, politics, government, law and social issues.' },
  { id: 'howto', color: '#f27700', label: 'How-to', icon: 'Wrench', about: 'Practical tutorials: fixing, making, building, DIY and life skills.' },
  { id: 'comedy', color: '#fdc9c4', label: 'Comedy', icon: 'Laugh', about: 'Jokes, memes, sketches, parody, pranks and funny compilations.' },
  { id: 'film', color: '#d33b36', label: 'Film & TV', icon: 'Clapperboard', about: 'Movies, TV shows, anime and cartoons, trailers, scenes and reviews of them.' },
  { id: 'books', color: '#843868', label: 'Books', icon: 'BookOpen', about: 'Books, literature, poetry, authors and reading.' },
  { id: 'art', color: '#f573a0', label: 'Art & design', icon: 'Palette', about: 'Drawing, painting, animation craft, architecture, design and crafts.' },
  { id: 'sports', color: '#86df53', label: 'Sports & fitness', icon: 'Dumbbell', about: 'Sports, athletes, exercise, workouts and outdoor activities.' },
  { id: 'food', color: '#c5af7a', label: 'Food', icon: 'ChefHat', about: 'Cooking, recipes, restaurants, food reviews and drinks.' },
  { id: 'travel', color: '#66a70c', label: 'Travel & places', icon: 'Map', about: 'Travel, cities, countries, geography and maps.' },
  { id: 'money', color: '#348144', label: 'Business & money', icon: 'Briefcase', about: 'Business, companies, careers, investing, economics and personal finance.' },
  { id: 'life', color: '#44f7d4', label: 'Vlogs & life', icon: 'UserRound', about: "Someone's daily life, personal stories, vlogs, family and relationships." },
  { id: 'other', color: '#8a8a8a', label: 'Other', icon: 'CircleHelp', about: 'Fits none of the other genres.' },
];

// Cached answers belong to one version of this list.
const GENRES_VERSION = GENRES.map(g => g.id + ':' + g.about).join('|');
