const M = 60000, H = 3600000, D = 86400000
const ago = (ms) => Date.now() - ms
const fwd = (ms) => Date.now() + ms
const img = (n) => `/img/${n}.jpg`

export const CATEGORY = {
  cafe: { name: 'Coffee Shop', icon: 'coffee' },
  restaurant: { name: 'Restaurant', icon: 'fork' },
  streetFood: { name: 'Street Food', icon: 'bag' },
}
export const PRICE = { low: '$', medium: '$$', high: '$$$' }

export const currentUser = { id: 'u_1', username: 'appetite', displayName: 'appètite', bio: 'Chasing hidden gems',
  avatar: '/img/avatar_appetite.png', followers: 842, following: 310, xp: 2450, level: 7 }
const nu = (id, username, f) => ({ id, username, displayName: username, avatar: `/img/avatar_${username}.jpg`, followers: f, following: 120, xp: 1200, level: 5 })
export const cast = [nu('u14', 'bighbigh', 612), nu('u15', 'elenlen', 934), nu('u16', 'konhokenyang', 421), nu('u17', 'davinvin', 1180), nu('u2', 'rayaruy', 305)]
export const allUsers = [currentUser, ...cast]

const P = (id, name, category, lat, lng, address, photo, price, rating, reviews, match, dist, mins, crowd, ai, gem = false, transit = true) =>
  ({ id, name, category, lat, lng, address, photo: img(photo), price, rating, reviews, match, dist, mins, crowd, ai, gem, transit })
export const places = [
  P('p1', 'Giyanti Coffee Roastery', 'cafe', -6.2005, 106.8335, 'Jl. Surabaya No. 20, Menteng', 'place_mango', 'medium', 4.6, 128, 92, 850, 11, 'Moderate', 'Small, cozy specialty roastery in Menteng that fits your calm coffee vibe.', true),
  P('p2', 'Expat. Roasters', 'cafe', -6.2075, 106.8216, 'Mori Tower 13th Floor, Jl. Jend. Sudirman Kav. 40-41', 'place_kitchenette', 'medium', 4.5, 96, 88, 1400, 18, 'Low', 'Quiet coffee bar with city views, great for working or a slow morning.'),
  P('p3', 'The Acre', 'cafe', -6.1925, 106.833, 'Jl. HOS Cokroaminoto No. 100, Menteng', 'place_tokyo2100', 'medium', 4.4, 210, 81, 1100, 14, 'Moderate', 'Lush, green café setting that matches your preference for relaxed spots.', false, false),
  P('p4', 'Plataran Menteng', 'restaurant', -6.1895, 106.8305, 'Jl. HOS Cokroaminoto No. 42, Menteng', 'place_ramen', 'high', 4.7, 342, 85, 1500, 19, 'Moderate', 'Indonesian dining inside a restored colonial mansion with a garden courtyard.'),
  P('p5', 'Lara Djonggrang', 'restaurant', -6.193, 106.832, 'Jl. Teuku Cik Di Tiro No. 4, Menteng', 'place_nasilemak', 'high', 4.6, 187, 79, 1700, 21, 'Low', 'Iconic Menteng restaurant known for rich decor and traditional Indonesian cuisine.'),
  P('p6', 'Jalan Sabang', 'streetFood', -6.187, 106.8226, 'Jl. H. Agus Salim, Menteng', 'place_pepperlunch', 'low', 4.4, 264, 83, 1900, 23, 'High', "One of Central Jakarta's best-known street-food strips, good for sampling several local dishes in one evening."),
  P('p7', 'Wood-Fired Pizza House', 'restaurant', -6.1985, 106.829, 'Jakarta', 'food_pizza_walnut', 'medium', 4.6, 148, 86, 1250, 16, 'Moderate', 'Wood-fired pizzas with blistered crusts and creative toppings.'),
  P('p8', 'Dumpling & Noodle House', 'restaurant', -6.1905, 106.825, 'Jakarta', 'food_dumpling_soup', 'low', 4.4, 203, 82, 1600, 20, 'High', 'Comforting creamy dumpling soup with tofu puffs and greens.'),
  P('p9', 'Jogoya Buffet', 'restaurant', -6.204, 106.83, 'Jakarta', 'food_jogoya_buffet', 'high', 4.5, 512, 78, 2100, 26, 'High', 'All-you-can-eat Japanese buffet with sushi rolls, grills, and desserts.'),
  P('p10', 'Pastry & Milk Tea Corner', 'cafe', -6.196, 106.827, 'Jakarta', 'food_pastry_milktea', 'low', 4.3, 97, 84, 900, 12, 'Low', 'Flaky golden pastries with iced milk tea in a bright yellow corner.'),
  P('p11', 'Kitty Pudding Dessert Bar', 'cafe', -6.192, 106.835, 'Jakarta', 'food_pudding_cat', 'medium', 4.7, 176, 88, 1300, 17, 'Moderate', 'Silky cat-shaped puddings served on glass dishes.'),
  P('p12', 'Brownie & Gelato Corner', 'cafe', -6.201, 106.8325, 'Jakarta', 'food_brownie', 'medium', 4.5, 131, 85, 1100, 15, 'Low', 'Warm fudgy brownies topped with a scoop of gelato.'),
  P('p13', 'Home-style Lunch Kitchen', 'restaurant', -6.194, 106.831, 'Jakarta', 'food_lunch_plate', 'low', 4.2, 88, 80, 1400, 18, 'Moderate', 'Hearty plates of roast chicken, creamy potatoes, and greens.'),
]
export const circlePlaceIDs = ['p1', 'p7', 'p11', 'p12']

const Po = (id, author, pi, photo, caption, review, rating, t, likes, comments, tags) =>
  ({ id, author, place: places[pi], photo: img(photo), caption, review, rating, createdAt: ago(t), likes, comments, tags, liked: false, saved: false })
export const feedPosts = [
  Po('post1', cast[4], 0, 'food_brownie', 'Best flat white in the city', 'Cozy and quiet, perfect for working.', 4.5, 10 * M, 128, 7, ['coffee', 'kemang']),
  Po('fp1', cast[0], 6, 'food_pizza_walnut', 'Walnut and honey on a blistered crust. Sweet, salty, creamy in every bite.', 'Crust had the perfect char.', 4.5, H, 428, 7, ['pizza', 'woodfired']),
  Po('fp2', cast[1], 6, 'food_pizza_mushroom', 'Mushroom pizza with a balsamic swirl. Earthy and a little sweet.', null, 4.5, 3 * H, 311, 7, ['pizza', 'mushroom']),
  Po('fp3', cast[2], 12, 'food_lunch_plate', 'Weekday lunch plate: roast chicken, creamy potatoes, and greens.', 'Simple, filling, and homey.', 4.0, 7 * H, 96, 7, ['lunch', 'homestyle']),
  Po('fp4', cast[3], 8, 'food_jogoya_buffet', 'Japanese buffet night. Sushi rolls, grills, and way too many desserts.', 'Go hungry, the spread is huge.', 4.5, 11 * H, 552, 7, ['buffet', 'sushi']),
]
export const myPosts = [
  Po('my1', currentUser, 10, 'food_pudding_cat', 'This pudding is too cute to eat. Still ate it.', 'Silky and not too sweet.', 5.0, 5 * H, 189, 14, ['dessert', 'pudding']),
  Po('my2', currentUser, 11, 'food_brownie', 'Warm brownie with a scoop of gelato. No notes.', null, 4.5, 26 * H, 143, 9, ['brownie', 'dessert']),
  Po('my3', currentUser, 7, 'food_dumpling_soup', 'Creamy dumpling soup on a rainy afternoon.', 'Comfort in a bowl.', 4.5, 50 * H, 121, 11, ['dumplings', 'soup']),
  Po('my4', currentUser, 9, 'food_pastry_milktea', 'Flaky pastry and iced milk tea. Simple and perfect.', null, 4.0, 74 * H, 88, 5, ['pastry', 'milktea']),
]
const tpl = [
  [10, 'food_pudding_cat', 'Cat-shaped pudding, too cute to eat.', 'Silky and not too sweet.', 5.0, ['dessert', 'pudding']],
  [11, 'food_brownie', 'Warm brownie, cold gelato. Classic combo.', 'Fudgy in the best way.', 4.5, ['brownie', 'dessert']],
  [7, 'food_dumpling_soup', 'Creamy dumpling soup for a rainy day.', 'Comfort in a bowl.', 4.5, ['dumplings', 'soup']],
  [9, 'food_pastry_milktea', 'Flaky pastry and iced milk tea.', null, 4.0, ['pastry', 'milktea']],
  [6, 'food_pizza_walnut', 'Walnut and honey pizza, blistered crust.', 'Sweet, salty, creamy.', 4.5, ['pizza', 'woodfired']],
  [12, 'food_lunch_plate', 'Roast chicken lunch plate, simple and filling.', 'Homey and generous.', 4.0, ['lunch', 'homestyle']],
]
export function profilePosts(user) {
  if (user.id === currentUser.id) return myPosts
  const own = feedPosts.filter((p) => p.author.id === user.id)
  const seed = Math.max(0, cast.findIndex((c) => c.id === user.id))
  const extras = [0, 1, 2].map((i) => {
    const t = tpl[(seed + i * 2) % tpl.length]
    return Po(`${user.id}-px${i}`, user, t[0], t[1], t[2], t[3], t[4], D * (i + 1) + H * seed, 60 + 37 * i + 11 * seed, 7, t[5])
  })
  return [...own, ...extras].sort((a, b) => b.createdAt - a.createdAt)
}

const Ev = (id, title, cat, photo, pi, startMs, going, attending, description) =>
  ({ id, title, category: cat, photo: img(photo), place: places[pi], start: fwd(startMs), going, attending, description })
export const events = [
  Ev('e1', 'Kemang Night Market', 'Night Market', 'food_dumpling_soup', 5, D, 240, false, 'Local food stalls, live music, and craft vendors.'),
  Ev('e2', 'Jalan Sabang Street Food Walk', 'Meetup', 'food_lunch_plate', 5, 2 * D, 86, false, "Guided evening walk through Jakarta's famous street-food strip, with five tasting stops."),
  Ev('e3', 'Single-Origin Cupping Session', 'Meetup', 'food_brownie', 0, 3 * D, 32, true, 'Taste and compare Indonesian single-origin beans with a head roaster.'),
  Ev('e4', 'Menteng Heritage Dinner', 'Festival', 'food_jogoya_buffet', 3, 5 * D, 64, false, 'A set Indonesian dinner inside a restored colonial mansion, with live kroncong music.'),
  Ev('e5', 'Latte Art Throwdown', 'Sports', 'food_pastry_milktea', 1, 6 * D, 120, false, 'Baristas compete head to head. Watch, vote, and try a few pours yourself.'),
  Ev('e6', 'Jakarta Coffee Week Pop-up', 'Festival', 'food_brownie', 2, 8 * D, 410, false, 'Roasters from across the city sharing tastings, workshops, and beans to take home.'),
  Ev('e7', 'Sunday Brunch Social', 'Meetup', 'food_pizza_mushroom', 2, 9 * D, 58, false, 'Casual brunch meetup for food lovers. Come solo, leave with new foodie friends.'),
  Ev('e8', 'Traditional Sweets Workshop', 'Exhibition', 'food_pudding_cat', 4, 11 * D, 40, false, 'Learn to make classic Indonesian jajan pasar with a local chef.'),
  Ev('e9', 'Acoustic Café Nights', 'Concert', 'food_pizza_walnut', 2, 12 * D, 150, false, 'Live acoustic sets every Friday over coffee and desserts.'),
]
const G = (id, name, icon, members, joined, desc, photo) => ({ id, name, icon, members, joined, description: desc, photo: img(photo) })
export const groups = [
  G('g1', 'Hidden Gem Hunters', 'sparkles', 1204, true, 'Sharing off-the-map spots.', 'food_pizza_walnut'),
  G('g2', 'Coffee Lovers', 'coffee', 980, false, 'Best brews in town.', 'food_pastry_milktea'),
  G('g3', 'Street Food Explorers', 'bag', 1560, false, 'Hawker stalls, night markets, and the best late-night bites.', 'food_dumpling_soup'),
  G('g4', 'Brunch Club Jakarta', 'fork', 720, false, 'Weekend brunch spots, menus, and meetups.', 'food_pizza_mushroom'),
  G('g5', 'Indonesian Classics', 'flame', 845, true, 'Rendang, soto, gudeg: where to find the real thing.', 'food_lunch_plate'),
  G('g6', 'Sweet Tooth Society', 'cake', 610, false, 'Desserts, bakeries, and traditional sweets.', 'food_pudding_cat'),
  G('g7', 'Budget Eats', 'banknote', 1320, false, 'Delicious meals under Rp50k.', 'food_dumpling_soup'),
  G('g8', 'Café Workers', 'laptop', 540, false, 'Quiet cafés with good Wi-Fi and plenty of outlets.', 'food_brownie'),
  G('g9', 'Food Photographers', 'camera', 430, false, 'Tips and spots for making food look as good as it tastes.', 'food_pizza_mushroom'),
]
export const stats = { places: 48, cities: 6, countries: 2, gems: 9, restaurants: 21, cafes: 15, events: 4, km: 312.4 }

export function commentsFor(post) {
  const others = cast.filter((c) => c.id !== post.author.id)
  const poster = post.author
  const [a, b, c, d] = others
  const mk = (id, u, text, min, likes, parent) => ({ id: `${post.id}-${id}`, author: u, text, createdAt: post.createdAt + min * M, likes, parent: parent && `${post.id}-${parent}` })
  return [
    mk('c1', a, 'Okay this looks so good, adding it to my list!', 12, 8),
    mk('c2', poster, 'Thanks! Go before the weekend rush, trust me.', 25, 3, 'c1'),
    mk('c3', b, `@${a.username} take me with you next time`, 31, 5, 'c1'),
    mk('c4', c, 'Is the place halal-friendly? Planning a family dinner.', 44, 6),
    mk('c5', poster, 'Yes, no pork or alcohol on the menu. Family-friendly too.', 58, 9, 'c4'),
    mk('c6', d, 'Price-wise how was it?', 75, 2),
    mk('c7', c, "Pretty fair for the portion, I'd say.", 90, 1, 'c6'),
  ]
}
export function relTime(t) {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}
export const fmtDate = (t) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
