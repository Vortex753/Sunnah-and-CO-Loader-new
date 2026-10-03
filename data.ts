export type Category = { slug: string; name: string; group: string };
export type Product = {
  id: string;
  name: string;
  category: string;
  type?: string | undefined;
  format?: "ebook" | undefined;
  price: number;
  description: string;
};

const raw: [string, string, string[]][] = [
  // ── Men ──
  ["Men Essentials", "Bisht", ["Black Bisht", "Gold Trim Bisht", "Camel Bisht", "Summer Bisht"]],
  ["Men Essentials", "Izaar & Sirwal", ["Cotton Sirwal", "Izaar Wrap", "Linen Trousers", "Ankle Sirwal"]],
  ["Men Essentials", "Surma / Kohl", ["Ithmid Surma", "Kajal Stick", "Surma with Applicator", "Herbal Kohl"]],
  ["Men Essentials", "Beard Care", ["Beard Oil", "Wooden Comb", "Beard Balm", "Beard Trimmer"]],
  ["Other Items", "Bakhoor & Incense", ["Oud Bakhoor", "Bakhoor Burner", "Incense Chips", "Electric Mabkhara"]],
  ["Other Items", "Natural Oils", ["Black Seed Oil", "Olive Oil", "Argan Oil", "Castor Oil"]],
  ["Other Items", "Sunnah Foods", ["Ajwa Dates", "Sidr Honey", "Talbina", "Zamzam Water"]],
  ["Other Items", "Azan Clocks", ["Digital Azan Clock", "Wall Azan Clock", "Azan Alarm", "Mosque Clock"]],
  ["Other Items", "Wudu Essentials", ["Wudu Socks", "Wudu Bottle", "Portable Bidet", "Wudu Seat"]],
  ["Other Items", "Islamic Wall Art", ["Ayatul Kursi Canvas", "Bismillah Frame", "Wooden Calligraphy", "Metal Wall Art"]],
  ["Men Essentials", "Calligraphy", ["Hand-Painted Calligraphy", "Gold Leaf Panel", "Name Calligraphy", "Canvas Set"]],
  ["Other Items", "Lanterns", ["Moroccan Lantern", "Ramadan Lantern", "LED Fanoos", "Brass Lantern"]],
  ["Men Essentials", "Ramadan & Eid Decor", ["Eid Banner", "Ramadan Calendar", "Crescent Lights", "Eid Balloons"]],
  ["Other Items", "Home Fragrance", ["Oud Room Spray", "Reed Diffuser", "Scented Candle", "Car Freshener"]],
  ["Men Essentials", "Men's Jewelry", ["Silver Ring", "Tasbih Bracelet", "Leather Bracelet", "Aqeeq Ring"]],
  ["Men Essentials", "Stationery", ["Islamic Planner", "Quran Journal", "Calligraphy Pens", "Bookmarks Set"]],
  ["Men Essentials", "Bags & Wallets", ["Leather Wallet", "Quran Bag", "Tote Bag", "Crossbody Pouch"]],
  ["Men Essentials", "Socks & Footwear", ["Leather Khuff", "Cotton Socks", "Sandals", "Masjid Slippers"]],

  // ── Women ──
  ["Women Essentials", "Jilbab", ["Two-Piece Jilbab", "Overhead Jilbab", "Prayer Jilbab", "Maxi Jilbab"]],
  ["Women Essentials", "Women's Jewelry", ["Ayatul Kursi Pendant", "Allah Necklace", "Crescent Bracelet", "Pearl Hijab Chain"]],
  ["Women Essentials", "Gift Sets", ["Eid Gift Box", "Nikah Gift Set", "New Muslim Kit", "Ramadan Hamper"]],

  // ── Kids ──
  ["Kids Essentials", "Boys Thobe", ["Boys Thobe", "Boys Jubba", "Boys Kurta", "Boys Sirwal"]],
  ["Kids Essentials", "Girls Abaya", ["Girls Abaya", "Girls Jilbab", "Girls Khimar", "Girls Prayer Dress"]],
  ["Kids Essentials", "Kids Kufi & Hijab", ["Kids Kufi", "Kids Hijab", "Kids Shemagh", "Kids Underscarf"]],
  ["Kids Essentials", "Islamic Toys", ["Talking Quran Cube", "Wudu Puzzle", "Masjid Blocks", "Prayer Doll"]],
  ["Kids Essentials", "Learning Aids", ["Arabic Flash Cards", "Quran Reading Pen", "Salah Chart", "Duas Poster"]],
  ["Kids Essentials", "Kids Prayer Essentials", ["Kids Prayer Mat", "Kids Prayer Dress", "Kids Tasbih", "Kids Azan Clock"]],

];

// Garment types consolidated into one shared clothing page per section (filterable by type).
const PARENT: Record<string, string> = {
  Thobe: "Men's Clothing", Jubba: "Men's Clothing", "Kurta Pyjama": "Men's Clothing", "Caps / Kufi": "Men's Clothing",
  "Shemagh & Ghutra": "Men's Clothing", Bisht: "Men's Clothing", "Izaar & Sirwal": "Men's Clothing",
  Abaya: "Women's Clothing / Prayer Dress", Hijab: "Women's Clothing / Prayer Dress", Niqab: "Women's Clothing / Prayer Dress",
  Jilbab: "Women's Clothing / Prayer Dress", Khimar: "Women's Clothing / Prayer Dress", "Prayer Dress": "Women's Clothing / Prayer Dress",
  "Boys Thobe": "Kids Clothing", "Girls Abaya": "Kids Clothing", "Kids Kufi & Hijab": "Kids Clothing",
};
const catName = (n: string) => PARENT[n] ?? n;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const categories: Category[] = [];
for (const [group, name] of raw) {
  const n = catName(name);
  if (!categories.some((c) => c.name === n)) categories.push({ group, name: n, slug: slug(n) });
}
export const categoryTypes = (catSlug: string) =>
  raw.filter(([, n]) => slug(catName(n)) === catSlug && PARENT[n]).map(([, n]) => n);

export const products: Product[] = raw.flatMap(([, cat, items], ci) =>
  items.map((name, i) => ({
    id: `${slug(cat)}-${i + 1}`,
    name,
    category: slug(catName(cat)),
    type: PARENT[cat] ? cat : undefined,
    price: Math.round((8 + ((ci * 37 + i * 23) % 90)) * 100) / 100 + 0.99,
    description: `${name} from our ${cat} collection. Carefully sourced, authentic quality, and made to serve you in your daily Sunnah. A beautiful choice for yourself or as a gift.`,
  })),
);

export const getCategory = (s: string) => categories.find((c) => c.slug === s);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const money = (n: number) => `$${n.toFixed(2)}`;

export const ORDER_STAGES = ["Order Placed", "In Store", "At Warehouse", "Out for Delivery", "Delivered"] as const;

// ── Books & Kids (audience-first pages made of separate topic sections) ──
type Topic = [string, string, string[]];
const ADULT: Topic[] = [
  ["Qur'an and Tafsir", "a trusted companion for reading, understanding and reflecting on the words of Allah.", ["Tafsir Ibn Kathir (Abridged)", "The Noble Qur'an with Translation", "Tafsir As-Sa'di", "Tajweed Mushaf - Madinah Print"]],
  ["Rulings of Shariyah Law", "a clear, well-referenced guide to everyday rulings on worship, transactions and family life.", ["Fiqh us-Sunnah", "Reliance of the Traveller", "Bulugh al-Maram", "Umdat al-Ahkam"]],
  ["Scholar's Books", "a classic work from the scholars of Islam, presented for the modern reader.", ["Riyadh as-Salihin", "Kitab at-Tawheed", "Al-Arba'in an-Nawawiyyah", "Zad al-Ma'ad (Abridged)"]],
  ["Human Rights under Shariyah Law", "an accessible look at the rights and dignity guaranteed to every person under the Shariyah.", ["Human Rights in Islam", "Justice and Dignity in Shariyah", "Rights of Neighbours and Kin", "Rights of Women in Islam"]],
];
const KIDS: Topic[] = [
  ["What Qur'an teaches Us", "a gentle, illustrated introduction to the lessons and values of the Qur'an for young readers.", ["Little Lessons from the Qur'an", "My First Qur'an Stories", "Qur'an Values for Kids"]],
  ["Prophet Stories", "the inspiring stories of the Prophets, told simply for children.", ["Stories of the Prophets for Kids", "Prophet Adam to Prophet Nuh", "The Life of Prophet Muhammad for Children"]],
  ["Sahaba Stories", "true tales of the Companions' courage, honesty and love for Allah and His Messenger.", ["Heroes of the Sahaba", "Abu Bakr the Truthful", "Bilal and the Call to Prayer"]],
  ["Rank of Parents", "a warm story-led lesson on the great status of mothers and fathers in Islam.", ["Mama and Baba in Islam", "Kindness to Parents", "Paradise at Mother's Feet"]],
  ["Rank of teachers", "a lesson in adab and gratitude towards those who teach us.", ["Respecting Our Teachers", "The Teacher's Reward", "Learning with Adab"]],
  ["Human Rights under Shariyah Law", "a child-friendly introduction to fairness, kindness and the rights we all share.", ["Rights We All Share", "Fairness for Everyone", "Kindness to Neighbours and Animals"]],
];
const MEN_CLOTHES: Topic[] = [
  ["Jubbah", "a comfortable, well-cut jubbah made for daily wear, Jumu'ah and special occasions.", ["Classic White Jubbah", "Moroccan Jubbah", "Embroidered Jubbah", "Linen Jubbah"]],
  ["Qameez", "a neat, breathable qameez set in quality fabric, ideal for everyday and festive wear.", ["Cotton Qameez Set", "Pathani Qameez", "Festive Qameez", "Short Qameez"]],
  ["Thobe", "a classic thobe with a clean finish and a relaxed, modest fit.", ["Saudi Thobe", "Emirati Kandura", "Omani Dishdasha", "Qatari Thobe"]],
  ["Islamic Gym Wear", "modest, breathable activewear designed for training while keeping to Islamic dress.", ["Modest Training Tee", "Long Sleeve Compression Top", "Loose-Fit Training Pants", "Sports Sirwal"]],
];
const MEN_HEAD: Topic[] = [
  ["Caps", "a well-made cap that is comfortable for salah and everyday wear.", ["Knitted Kufi", "Turkish Cap", "Omani Kumma", "Crochet Prayer Cap"]],
  ["Imama", "a quality imama in soft fabric, sized for a neat and lasting wrap.", ["White Cotton Imama", "Black Imama", "Sudanese Imama", "Turban Cloth"]],
  ["Keffiyeh", "a traditional keffiyeh in durable woven cotton with a timeless pattern.", ["Red Keffiyeh", "Black and White Keffiyeh", "Jordanian Keffiyeh", "Palestinian Keffiyeh"]],
  ["Ghutra and Agal", "a traditional Gulf head-dress piece, crisp and elegant when worn.", ["White Ghutra", "Agal Cord", "Gold Thread Ghutra", "Agal Set"]],
];
const MEN_ACC: Topic[] = [
  ["Atar", "a long-lasting, alcohol-free fragrance in the tradition of the Sunnah.", ["Oud Atar", "White Musk", "Rose Atar", "Amber Atar"]],
  ["Miswak Brush", "a natural Sunnah tooth-cleaning essential, fresh and easy to carry.", ["Natural Miswak", "Miswak Pack of 5", "Miswak Holder", "Miswak Toothpaste"]],
  ["Tabeeh", "a smooth, finely finished tabeeh for dhikr at home or on the go.", ["Wooden Tabeeh", "Crystal Tabeeh", "Digital Counter", "Amber Tabeeh"]],
  ["Hajj and Umrah Essentials", "a practical item for your Hajj or Umrah journey, chosen for comfort and durability.", ["Ihram Set", "Umrah Kit", "Hajj Belt", "Travel Pouch"]],
];
const WOMEN_WEAR: Topic[] = [
  ["Abaya", "an elegant abaya in a soft, flowing fabric with a modest, comfortable cut.", ["Classic Black Abaya", "Open Front Abaya", "Butterfly Abaya", "Embroidered Abaya"]],
  ["Prayer Dress", "an easy-to-wear prayer dress that gives full covering for salah.", ["Travel Prayer Dress", "Two-Piece Prayer Set", "Zip Prayer Dress", "One-Piece Prayer Dress"]],
  ["Haya Suit", "a modest, well-tailored suit designed with haya in mind for daily wear.", ["Everyday Haya Suit", "Long Tunic Haya Suit", "Festive Haya Suit"]],
];
const WOMEN_HEAD: Topic[] = [
  ["Hijaab/Khimar", "a soft, drapey piece that stays in place and feels light all day.", ["Chiffon Hijaab", "Jersey Hijaab", "Long Khimar", "Double Layer Khimar"]],
  ["Prayer Hijaab", "an easy pull-on prayer hijaab that covers fully with no pins needed.", ["Instant Prayer Hijaab", "Cotton Prayer Hijaab", "Travel Prayer Hijaab"]],
  ["Niqab", "a breathable niqab in quality fabric with a secure, comfortable fit.", ["One Layer Niqab", "Three Layer Niqab", "Tie-Back Niqab", "Half Niqab"]],
];
const WOMEN_ACC: Topic[] = [
  ["Hijaab Pin", "a strong, snag-free pin that keeps your hijaab neat all day.", ["Pearl Hijaab Pins", "Magnetic Hijaab Pins", "Gold Pin Set"]],
  ["Sleeves", "modest, stretchy sleeves that add coverage under any outfit.", ["Cotton Sleeves", "Sports Sleeves", "Lace Sleeves"]],
  ["Mehendi", "a natural, rich-staining mehendi for hands and hair.", ["Natural Henna Cone", "Henna Powder", "Hair Henna"]],
  ["Eyeliner/Kajal", "a smooth, long-wearing kajal made with gentle ingredients.", ["Herbal Kajal", "Kajal Stick", "Waterproof Eyeliner"]],
  ["Perfumes/Atar for Females", "a soft, alcohol-free fragrance designed for women.", ["Musk Tahara", "Rose Atar", "Jasmine Atar", "Vanilla Musk"]],
];
const GENERAL_ACC: Topic[] = [
  ["Prayer Mats", "a soft, well-padded prayer mat for comfortable, focused salah.", ["Velvet Prayer Mat", "Travel Prayer Mat", "Padded Prayer Mat", "Foldable Prayer Mat"]],
  ["Qur'an Rehel/Desk", "a sturdy, elegant stand for reading the Qur'an comfortably.", ["Wooden Rehel", "Carved Rehel", "Folding Desk Rehel"]],
  ["Qibla Compass", "a precise compass that points you to the Qibla wherever you are.", ["Pocket Qibla Compass", "Digital Qibla Compass", "Travel Qibla Compass"]],
  ["Islamic Rain Coats", "a modest, full-length rain coat that keeps you covered and dry.", ["Long Rain Coat", "Hooded Rain Poncho", "Compact Travel Rain Coat"]],
  ["Tabeeh", "a smooth, finely finished tabeeh for dhikr at home or on the go.", ["Wooden Tabeeh", "Crystal Tabeeh", "Digital Counter Tabeeh"]],
  ["Miswak Brush", "a natural Sunnah tooth-cleaning essential, fresh and easy to carry.", ["Natural Miswak", "Miswak Pack of 5", "Miswak Travel Case"]],
];
const KIDS_CLOTHES: Topic[] = [
  ["Jubbah", "a soft, comfortable jubbah for boys, perfect for Jumu'ah, Eid and everyday wear.", ["Boys White Jubbah", "Embroidered Boys Jubbah", "Cotton Boys Jubbah"]],
  ["Qameez", "a neat, breathable qameez set for kids in gentle, easy-care fabric.", ["Kids Cotton Qameez Set", "Kids Pathani Qameez", "Festive Kids Qameez"]],
  ["Thobe", "a classic kids thobe with a clean finish and a relaxed, comfortable fit.", ["Boys Saudi Thobe", "Boys Emirati Kandura", "Boys Omani Dishdasha"]],
  ["Sunnah Sports Wear", "modest, breathable activewear for kids that keeps them covered while they play.", ["Kids Modest Tracksuit", "Kids Sports Sirwal", "Kids Long Sleeve Sports Top"]],
];
const bookPages: { page: string; ebook: boolean; topics: Topic[]; base?: number }[] = [
  { page: "Thobes/Islamic Wear", ebook: false, topics: MEN_CLOTHES, base: 20 },
  { page: "Men's Head Wear", ebook: false, topics: MEN_HEAD, base: 8 },
  { page: "Men's Accessories", ebook: false, topics: MEN_ACC, base: 6 },
  { page: "Prayer Dress/Islamic Wear", ebook: false, topics: WOMEN_WEAR, base: 22 },
  { page: "Women's Head Wear", ebook: false, topics: WOMEN_HEAD, base: 8 },
  { page: "Women's Accessories", ebook: false, topics: WOMEN_ACC, base: 5 },
  { page: "General Accessories", ebook: false, topics: GENERAL_ACC, base: 6 },
  { page: "Islamic Books", ebook: false, topics: ADULT },
  { page: "E-Books", ebook: true, topics: ADULT },
  { page: "Kids Thobes/Islamic Wear", ebook: false, topics: KIDS_CLOTHES, base: 12 },
  { page: "Kids Books", ebook: false, topics: KIDS },
  { page: "E-Book for Kids", ebook: true, topics: KIDS },
];
for (const { page, ebook, topics, base } of bookPages) {
  topics.forEach(([topic, blurb, titles], ti) => {
    const cs = slug(`${page} ${topic}`);
    categories.push({ slug: cs, name: topic, group: page });
    titles.forEach((t, i) => {
      const n = (ti * 7 + i * 5) % (ebook ? 8 : 20);
      products.push({
        id: `${cs}-${i + 1}`,
        name: ebook ? `${t} (E-Book)` : t,
        category: cs,
        format: ebook ? "ebook" : undefined,
        price: (base ?? (ebook ? 3 : 9)) + n + 0.99,
        description: `${t} is ${blurb}${ebook ? " Yours as a digital download right after purchase." : ""}`,
      });
    });
  });
}

// Sidebar / menu structure. Books, Men, Women, Kids and Accessories each open a dropdown of pages first.
export type NavPage = { group: string; label: string };
const P = (group: string, label: string = group): NavPage => ({ group, label });
export const nav: { name: string; pages: NavPage[] | null }[] = [
  { name: "Books", pages: [P("Islamic Books"), P("E-Books")] },
  { name: "Men", pages: [P("Thobes/Islamic Wear"), P("Men's Head Wear", "Head Wear")] },
  { name: "Women", pages: [P("Prayer Dress/Islamic Wear"), P("Women's Head Wear", "Head Wear")] },
  { name: "Kids", pages: [P("Kids Thobes/Islamic Wear", "Thobes/Islamic Wear"), P("Kids Books"), P("E-Book for Kids")] },
  { name: "Accessories", pages: [P("Men's Accessories", "Men"), P("Women's Accessories", "Women"), P("General Accessories", "General")] },
];
export const groups = nav.flatMap((n) => n.pages?.map((p) => p.group) ?? []);
export const sectionedGroups = groups;
export const pageTitle = (g: string) => g;
