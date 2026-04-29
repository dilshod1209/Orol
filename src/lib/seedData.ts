
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';

const floraData = [
  { name: "Lola (Liliaceae)", description: "Markaziy Osiyoning ramziy guli.", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000", fact: "Lola piyozlari bir vaqtlar oltindan qimmatroq bo'lgan." },
  { name: "Kiyiko't", description: "Dorivor o'simlik, choyi shifobaxsh.", imageUrl: "https://images.unsplash.com/photo-1502640232231-15cdec185e48?q=80&w=1000", fact: "Xalq tabobatida keng qo'llaniladi." },
  { name: "Isiriq", description: "Muqaddas va poklovchi o'simlik.", imageUrl: "https://images.unsplash.com/photo-1596708143242-6e9f168a4e8d?q=80&w=1000", fact: "Isiriq tutuni mikroblarni o'ldiradi." },
  { name: "Yantoq", description: "Cho'l o'simligi, asaldorlik xususiyati yuqori.", imageUrl: "https://images.unsplash.com/photo-1519301643262-d9630fb15a0c?q=80&w=1000" },
  { name: "Saksovul", description: "Cho'llar qahramoni, qum ko'chishini to'xtatadi.", imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1000" },
  { name: "Archa", description: "Tog'larimizning abadiy yashil ko'rki.", imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1000" },
  { name: "Atirgul", description: "Go'zallik va muhabbat timsoli.", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000" },
  { name: "Kovrak", description: "Eksportbop dorivor o'simlik.", imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b66b721?q=80&w=1000" },
  { name: "Sedana", description: "Har dardga davo o'simlik.", imageUrl: "https://images.unsplash.com/photo-1473948472280-39952cc5a927?q=80&w=1000" },
  { name: "Choyo't", description: "O'zbekistonning quyoshli o'tloqlarida o'sadi.", imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1000" },
  { name: "Rayhon", description: "Xushbo'y va sevimli xonaki o'simlik.", imageUrl: "https://images.unsplash.com/photo-1552520334-118f6c310c14?q=80&w=1000" },
  { name: "Yalpiz", description: "Salqinlik va yangilanish ramzi.", imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?q=80&w=1000" },
  { name: "Bodom guli", description: "Bahorning ilk xabarchisi.", imageUrl: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=1000" },
  { name: "Gilos guli", description: "Nafosat maskani.", imageUrl: "https://images.unsplash.com/photo-1493673272479-75526633af39?q=80&w=1000" },
  { name: "Anor", description: "Fajolat va unumdorlik ramzi.", imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=1000" },
  { name: "Uzum", description: "Sershira va oltin donalar.", imageUrl: "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1000" },
  { name: "Bug'doy", description: "Rizq-ro'zimiz manbai.", imageUrl: "https://images.unsplash.com/photo-1444858291040-58c716a82d43?q=80&w=1000" },
  { name: "Paxta", description: "O'zbekistonning oq oltini.", imageUrl: "https://images.unsplash.com/photo-1594488311319-9402636a0fb4?q=80&w=1000" },
  { name: "Tut daraxti", description: "Ipak yo'lining asosi.", imageUrl: "https://images.unsplash.com/photo-1563297654-e67c8585093e?q=80&w=1000" },
  { name: "Yong'oq", description: "Uzoq umr ko'ruvchi quvvat manbai.", imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b66b721?q=80&w=1000" }
];

const faunaData = [
  { name: "Qor qoploni", description: "Tog'larimizning mag'rur hukmdori.", imageUrl: "https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=1000", fact: "Qor qoplonlari panjalarini chang'i sifatida ishlatishadi." },
  { name: "O'rta Osiyo toshbaqasi", description: "Cho'llarimizning qadimgi aholisi.", imageUrl: "https://images.unsplash.com/photo-1548546738-8542ad0933b4?q=80&w=1000" },
  { name: "Buxoro bug'usi", description: "To'qayzorlarning mo'jizasi.", imageUrl: "https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=1000" },
  { name: "Burgut", description: "Osmonimizning ozod qushi.", imageUrl: "https://images.unsplash.com/photo-1552317926-7871b058097b?q=80&w=1000" },
  { name: "Jayron", description: "Go'zallik va tezlik timsoli.", imageUrl: "https://images.unsplash.com/photo-1510137600163-2729bc6959a6?q=80&w=1000" },
  { name: "Qulon", description: "Yovvoyi ot, cho'l shamoli.", imageUrl: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000" },
  { name: "Laylak", description: "Tinchlik va bahor elchisi.", imageUrl: "https://images.unsplash.com/photo-1615592389070-be979d7d159c?q=80&w=1000" },
  { name: "Sayg'oq", description: "Qadimiy va noyob hayvon.", imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000" },
  { name: "Tog' echkisi", description: "Tik qoyalar ustasi.", imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=1000" },
  { name: "O'zbek asali arisi", description: "Mehnatkashlik ramzi.", imageUrl: "https://images.unsplash.com/photo-1473948472280-39952cc5a927?q=80&w=1000" },
  { name: "Tulki", description: "Zukkoli va ayyor cho'l aholisi.", imageUrl: "https://images.unsplash.com/photo-1474511326042-036232938f8f?q=80&w=1000" },
  { name: "Bo'ri", description: "Jamoaviy ovchi.", imageUrl: "https://images.unsplash.com/photo-1555181126-cf46a03827c5?q=80&w=1000" },
  { name: "Qum mushugi", description: "Kichik va sirli.", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000" },
  { name: "Ilonchurq", description: "Noyob sudralib yuruvchi.", imageUrl: "https://images.unsplash.com/photo-1528158222524-d4d912b2e202?q=80&w=1000" },
  { name: "Kirpi", description: "Tikanli himoyachi.", imageUrl: "https://images.unsplash.com/photo-1544254429-1ad8808ed495?q=80&w=1000" },
  { name: "Sirtlon", description: "Cho'l tozalovchi.", imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b66b721?q=80&w=1000" },
  { name: "Yovvoyi to'ng'iz", description: "O'rmon qudrati.", imageUrl: "https://images.unsplash.com/photo-1554420349-f027556a31f2?q=80&w=1000" },
  { name: "Olaxurjun", description: "Kichik tog' kemiruvchisi.", imageUrl: "https://images.unsplash.com/photo-1548546738-8542ad0933b4?q=80&w=1000" },
  { name: "Boyqush", description: "Tungi donishmand.", imageUrl: "https://images.unsplash.com/photo-1543549732-232ff4ea8434?q=80&w=1000" },
  { name: "Turna", description: "Uzoq safarlar qushi.", imageUrl: "https://images.unsplash.com/photo-1520638023380-020526017fe1?q=80&w=1000" }
];

const historyData = [
  { title: "Registon maydoni", period: "XV-XVII asr", description: "Samarqandning yuragi, jahon madaniyati durdonasi.", imageUrl: "https://images.unsplash.com/photo-1528644018063-520dec1138a7?q=80&w=1000" },
  { title: "Arx madaniyati", period: "Antik davr", description: "Buxoro amirligining mudofaa qal'asi.", imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1000" },
  { title: "Ichan Qal'a", period: "XVIII-XIX asr", description: "Xiva shahrining ochiq osmon ostidagi muzeyi.", imageUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000" },
  { title: "Amir Temur saltanati", period: "1336-1405", description: "Sohibqiron asos solgan ulkan imperiya.", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" },
  { title: "Mirzo Ulug'bek rasadxonasi", period: "XV asr", description: "O'rta asrlar astronomiyasining eng ilg'or markazi.", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000" },
  { title: "Shohi Zinda", period: "X-XIX asr", description: "Samarqanddagi muqaddas ziyoratgohlar ansambli.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Kalon minorasi", period: "1127 y.", description: "Buxoro shahrining osmon o'par minorasi.", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000" },
  { title: "Xasti Imom majmuasi", period: "XVI asr", description: "Toshkentning eng qadimiy islomiy markazi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Afrosiyob shaharchasi", period: "VII asr", description: "Qadimiy Samarqandning devoriy suratlari.", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000" },
  { title: "Sherdor madrasasi", period: "XVII asr", description: "Registonning afsonaviy peshtoqlari.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Saroymulkxonim madrasasi", period: "XIV asr", description: "Bibi Xonim nomi bilan mashhur majmua.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Ko'kaldosh madrasasi", period: "XVI asr", description: "Toshkentdagi eng katta madrasalardan biri.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Zangiota ziyoratgohi", period: "XIV asr", description: "Toshkent viloyatining qadimiy qadamjosi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Minora masjidi", period: "Zamonaviy", description: "Oppoq marmardan barpo etilgan go'zallik.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Oqsaroy", period: "XIV asr", description: "Amir Temurning Shahrisabzdagi saroyi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Termiz qadimiy shahri", period: "Antik davr", description: "Janubiy O'zbekistonning madaniyat markazi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Fayoztepa", period: "I-III asr", description: "Buddiylik madaniyatining noyob yodgorligi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Dalvarzintepa", period: "Antik davr", description: "Kushonlar davrining boy me'rosi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Mizdakxon majmuasi", period: "IV asr", description: "Qoraqalpog'istonning sirli qadimiy maskani.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" },
  { title: "Chust madaniyati", period: "Bronza davri", description: "Farg'ona vodiysining qadimiy dehqonchilik markazi.", imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1000" }
];

export const seedDatabase = async () => {
  const checkEmpty = async (col: string) => {
    const q = query(collection(db, col), limit(1));
    const snap = await getDocs(q);
    return snap.empty;
  };

  const seed = async (col: string, data: any[]) => {
    const isEmpty = await checkEmpty(col);
    if (!isEmpty) {
        console.log(`${col} already has data, skipping seed.`);
        return;
    }
    console.log(`Seeding ${col}...`);
    for (const item of data) {
      await addDoc(collection(db, col), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log(`Finished ${col}.`);
  };

  try {
    await seed('flora', floraData);
    await seed('fauna', faunaData);
    await seed('history', historyData);
    return true;
  } catch (error) {
    console.error("Seeding failed:", error);
    return false;
  }
};
