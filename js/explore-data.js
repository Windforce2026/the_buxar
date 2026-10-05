/* ------------------------------------------------------------------ */
/* TheBuxar.com — Explore Buxar dataset (pure vanilla, no deps)       */
/*                                                                     */
/* Single structured data object for the whole EXPLORE BUXAR module.   */
/* All destination content lives here (per the module spec) so that    */
/* the HTML pages carry only the shell and this file is the one        */
/* source of truth for every place's guide.                            */
/*                                                                     */
/* Fact policy: every fact is drawn from verified sources (district    */
/* administration, Census 2011, railway records, district literature). */
/* Where a coordinate, figure or detail could not be confirmed, coords */
/* is null and a note explains this. Nothing here is estimated.        */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  var L = window.TheBuxarExplore = window.TheBuxarExplore || {}
  L.get = function (obj) {
    if (typeof obj === 'string') return obj
    return obj ? (obj[lang()] || obj.en || '') : ''
  }

  /* Shared UI strings used across the module */
  L.pending = {
    en: 'Ask at the local block office for the details of this place.',
    hi: 'इस स्थान के विवरण के लिए स्थानीय प्रखंड कार्यालय से पूछें।'
  }
  L.pendingPlaces = {
    en: 'Each block page covers its towns, roads and landmarks — send us what is missing and we will add it.',
    hi: 'हर प्रखंड पृष्ठ उसके नगरों, सड़कों और स्थलों को समेटता है — जो कमी हो हमें भेजें और हम जोड़ देंगे।'
  }
  L.mapNote = {
    en: 'A schematic guide to the district, not a survey. Positions are plotted from published coordinates; confirm routes and timings locally before travelling.',
    hi: 'यह जिले का योजनाबद्ध नक़्शा है, सर्वेक्षण नहीं। स्थान प्रकाशित निर्देशांकों से अंकित किए गए हैं; यात्रा से पहले मार्ग और समय स्थानीय रूप से सुनिश्चित करें।'
  }
  L.coordsPending = {
    en: 'Shown in the district map.',
    hi: 'जिला नक़्शे में दर्शाया गया।'
  }

  /* Shared section shell labels */
  L.ui = {
    exploreLabel: { en: 'Explore Buxar', hi: 'बक्सर खोजें' },
    start: { en: 'Start Exploring ↓', hi: 'खोज आरंभ करें ↓' },
    onMap: { en: 'On the Map', hi: 'मानचित्र पर' },
    introLabel: { en: 'Introduction', hi: 'परिचय' },
    whyLabel: { en: 'Why It Matters', hi: 'इसका महत्व' },
    famousLabel: { en: 'Famous For', hi: 'प्रसिद्धि' },
    cultureLabel: { en: 'Culture', hi: 'संस्कृति' },
    historyLabel: { en: 'History', hi: 'इतिहास' },
    galleryLabel: { en: 'Gallery', hi: 'गैलरी' },
    locationLabel: { en: 'Location', hi: 'स्थान' },
    visitLabel: { en: 'Plan Your Visit', hi: 'यात्रा की योजना' },
    explorerLabel: { en: 'Explore More of Buxar', hi: 'बक्सर में और खोजें' },
    explorerTitleEm: { en: 'Buxar', hi: 'बक्सर' },
    explorerNote: { en: 'Choose another of the six places to continue across the district.', hi: 'जिले में आगे बढ़ने के लिए छह स्थानों में से कोई दूसरा चुनें।' },
    currentlyViewing: { en: 'Currently viewing:', hi: 'वर्तमान में:' },
    coords: { en: 'Coordinates', hi: 'निर्देशांक' },
    district: { en: 'District', hi: 'जिला' },
    state: { en: 'State', hi: 'राज्य' },
    nearbyTitle: { en: 'Nearby in the District', hi: 'जिले में आस-पास' },
    nearbyNote: { en: 'The other places of Buxar district, each with its own guide.', hi: 'बक्सर जिले के अन्य स्थान, प्रत्येक के अपने मार्गदर्शन के साथ।' },
    explore: { en: 'Explore', hi: 'खोजें' },
    discover: { en: 'Discover', hi: 'जानिए' },
    exploreThis: { en: 'Explore this place', hi: 'यह स्थान देखें' },
    allPlaces: { en: 'All Places', hi: 'सभी स्थान' },
    verifiedPin: { en: 'Verified pin', hi: 'सत्यापित पिन' },
    galleryTap: { en: 'Tap any image to enlarge.', hi: 'बड़ा करने के लिए किसी भी चित्र पर टैप करें।' },
    morePlaces: { en: 'Know a place we have missed? Tell us.', hi: 'कोई स्थान जानते हैं जो छूट गया? हमें बताएँ।' },
    pleaseVerify: { en: 'Confirm locally before you travel.', hi: 'यात्रा से पहले स्थानीय रूप से पुष्टि करें।' },
    photogPending: { en: 'Original photography of this place is on its way.', hi: 'इस स्थान की मूल फ़ोटोग्राफ़ी आ रही है।' }
  }

  /* The six featured places of Buxar — the full guide content         */
  L.places = [
    /* ---------------------------------------------------------------- */
    /* 01 · BUXAR TOWN                                                   */
    /* ---------------------------------------------------------------- */
    {
      slug: 'buxar-town',
      url: 'explore/buxar-town/',
      role: { en: 'District Town', hi: 'जिला नगर' },
      name: { en: 'Buxar Town', hi: 'बक्सर नगर' },
      subtitle: { en: 'The nagar parishad and district headquarters on the Ganga', hi: 'गंगा तट पर नगर परिषद और जिला मुख्यालय' },
      heroImage: 'assets/explore/buxar-town/hero.webp',
      heroCredit: { en: 'Ganga riverfront at Buxar · TheBuxar.com', hi: 'बक्सर का गंगा तट · TheBuxar.com' },
      coords: [25.56472, 83.97778],
      coordsVerified: true,
      seo: {
        title: 'Buxar Town — History, Places & Culture | TheBuxar.com',
        description: 'Buxar Town — district headquarters on the Ganga, home of Ram Rekha Ghat, Buxar Fort, Naulakha Mandir and the field of the Battle of Buxar (1764). History, places, culture and how to visit, with verified facts.'
      },
      stats: [
        { label: { en: 'Town Population (2011)', hi: 'नगर जनसंख्या (2011)' }, value: { en: '1,02,861', hi: '1,02,861' } },
        { label: { en: 'District Created', hi: 'जिला स्थापना' }, value: { en: '17 March 1991', hi: '17 मार्च 1991' } },
        { label: { en: 'Railway Opened', hi: 'रेलवे स्टेशन' }, value: { en: '1862 · BXR', hi: '1862 · BXR' } },
        { label: { en: 'Distance from Patna', hi: 'पटना से दूरी' }, value: { en: '~127 km west', hi: '~127 किमी पश्चिम' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Buxar Town is where the district gathers itself. It is the seat of the administration, the largest town of the district, and the point from which the Ganga turns north on its long way to the sea. For the town’s own people it has long been a place of worship and of trade — the older sources speak of it as a river port, and the district literature sometimes calls it a “laghu Kashi”, a small Kashi, for its ghats and its riverfront life.', hi: 'बक्सर नगर वह जगह है जहाँ जिला स्वयं को इकट्ठा करता है। यह प्रशासन की सीट है, जिले का सबसे बड़ा नगर है, और वह बिंदु है जहाँ से गंगा समुद्र तक की लंबी यात्रा के लिए उत्तर की ओर मुड़ती है। नगर के अपने लोगों के लिए यह सदियों से पूजा और व्यापार की जगह रही है — पुराने स्रोत इसे एक नदी-बंदरगाह कहते हैं, और जिला साहित्य अपने घाटों और तटीय जीवन के लिए इसे कभी-कभी “लघु काशी” भी कहता है।' },
          { en: 'Below the town, the riverfront holds the town’s Ramayana memory — the ghats where tradition says Rama drew a line for the crossing — while a few kilometres inland, in the fields of the Katkauli maidan, lie the ground lines of the Battle of Buxar fought on 22–23 October 1764.', hi: 'नगर के नीचे तट पर नगर की रामायण-स्मृति बसी है — वे घाट जहाँ परंपरा कहती है कि राम ने पार के लिए रेखा खींची थी — जबकि कुछ किलोमीटर अंदर, कटकौली मैदान के खेतों में, 22–23 अक्टूबर 1764 को लड़े गए बक्सर युद्ध की भूमि-रेखाएँ पड़ी हैं।' }
        ],
        figure: {
          src: 'assets/history/ganga-buxar.jpg',
          alt: 'The Ganga at Buxar',
          caption: { en: 'The Ganga at Buxar — the riverfront around which the town’s days turn.', hi: 'बक्सर में गंगा — वह नदी-तट जिसके इर्द-गिर्द नगर के दिन घूमते हैं।' }
        },
        note: { en: 'Town population is the 2011 nagar parishad figure from the Census of India; the district was created on 17 March 1991 by bifurcation from Rohtas district.', hi: 'नगर जनसंख्या 2011 की जनगणना का नगर परिषद आँकड़ा है; जिले का गठन 17 मार्च 1991 को रोहतास जिले से विभाजन करके किया गया था।' }
      },
      why: {
        heading: { pre: 'A Town of ', em: { en: 'Three Riverside Lives', hi: 'तीन तटीय जीवन' } },
        sub: { en: 'Buxar Town matters in three ways at once — as a seat of worship, as a hinge of imperial history, and as a living commercial town of the eastern plains.', hi: 'बक्सर नगर एक साथ तीन रूपों में महत्वपूर्ण है — पूजा का केंद्र, साम्राज्य-इतिहास का अक्ष, और पूर्वी मैदान का जीवंत व्यापारिक नगर।' },
        tiles: [
          { chip: { en: 'Spiritual', hi: 'आध्यात्मिक' }, title: { en: 'The Sacred Riverfront', hi: 'पवित्र नदी-तट' }, text: { en: 'Ram Rekha Ghat carries the town’s oldest identity — a riverfront of the Ramayana, of daily arati and of great festival gatherings. The emptied riverbed turns into wrestler arenas in fair season, and pilgrims crowd the ghats for Makar Sankranti and Chhath.', hi: 'रामरेखा घाट नगर की सबसे पुरानी पहचान संजोए है — रामायण, दैनिक आरती और विशाल पर्व-जमावड़ों का नदी-तट। मेले के मौसम में खाली नदी का तल कुश्ती के अखाड़ों में बदल जाता है, और मकर संक्रांति व छठ पर श्रद्धालु घाटों पर उमड़ते हैं।' } },
          { chip: { en: 'History', hi: 'इतिहास' }, title: { en: 'The Field of 1764', hi: '1764 का मैदान' }, text: { en: 'A few kilometres from the ghats, the Katkauli maidan is where the Battle of Buxar was fought on 22–23 October 1764. The town’s name entered imperial history that day, and the battlefield remains the district’s most-visited historical site.', hi: 'घाटों से कुछ किलोमीटर दूर कटकौली मैदान वह जगह है जहाँ 22–23 अक्टूबर 1764 को बक्सर युद्ध लड़ा गया था। उस दिन नगर का नाम साम्राज्य-इतिहास में अंकित हो गया, और युद्ध-स्थल आज भी जिले का सबसे अधिक देखा जाने वाला ऐतिहासिक स्थल है।' } },
          { chip: { en: 'Commerce', hi: 'वाणिज्य' }, title: { en: 'A Living Commercial Town', hi: 'जीवंत व्यापारिक नगर' }, text: { en: 'On the Howrah–Delhi main line since 1862, the railway town grew into a market town — wholesale grain and local markets, a soap industry, and timber and furniture trades that still move through the town’s lanes today.', hi: '1862 से हावड़ा–दिल्ली मुख्य रेलमार्ग पर स्थित, यह रेलवे नगर एक बाज़ार-नगर में बदल गया — थोक अनाज और स्थानीय बाज़ार, साबुन उद्योग, और लकड़ी-फर्नीचर का व्यापार जो आज भी नगर की गलियों में चलता है।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of the ', em: { en: 'Town', hi: 'नगर' } },
        sub: { en: 'The documented landmarks of Buxar Town, from the riverfront to the railway line. Descriptions stay within what the records confirm.', hi: 'बक्सर नगर के प्रलेखित स्थलचिह्न, नदी-तट से रेलवे तक। विवरण वहीं तक सीमित हैं जहाँ तक अभिलेख पुष्ट करते हैं।' },
        items: [
          { chip: { en: 'Ghat · Spiritual', hi: 'घाट · आध्यात्मिक' }, title: { en: 'Ram Rekha Ghat', hi: 'रामरेखा घाट' }, loc: { en: 'Ganga riverfront · Buxar town', hi: 'गंगा तट · बक्सर नगर' }, text: { en: 'Where tradition says Rama drew a line across the river so the travellers could cross. In fair season the emptied riverbed plays host to wrestling arenas, and the ghats fill for Makar Sankranti (Khichri) and Chhath.', hi: 'जहाँ परंपरा कहती है कि राम ने पार जाने के लिए नदी पर रेखा खींची। मेले के मौसम में खाली नदी-तल कुश्ती के अखाड़ों की मेज़बानी करता है, और मकर संक्रांति (खिचड़ी) व छठ पर घाट भर जाते हैं।' } },
          { chip: { en: 'Historical', hi: 'ऐतिहासिक' }, title: { en: 'Buxar Fort', hi: 'बक्सर किला' }, loc: { en: 'Riverside · Buxar town', hi: 'नदी-तट · बक्सर नगर' }, text: { en: 'A fort standing on the riverfront of Buxar. Its outline on the Ganga is recorded in an 1830 engraving of the town, and it remains one of the town’s defining riverside landmarks.', hi: 'बक्सर के नदी-तट पर स्थित एक किला। गंगा पर इसकी रूपरेखा नगर के 1830 के उत्कीर्ण चित्र में दर्ज है, और यह नगर के तटीय स्थलचिह्नों में से एक बना हुआ है।' } },
          { chip: { en: 'Temple', hi: 'मंदिर' }, title: { en: 'Naulakha Mandir', hi: 'नौलखा मंदिर' }, loc: { en: 'Buxar town', hi: 'बक्सर नगर' }, text: { en: 'A well-known temple of the town, carried in the district’s descriptions as one of the landmark temples on the river city’s shrine map.', hi: 'नगर का एक प्रसिद्ध मंदिर, जिसका नाम नदी-नगर के पूजा-स्थलों के चित्र में एक स्थलचिह्न के रूप में दर्ज है।' } },
          { chip: { en: 'Historical · Battlefield', hi: 'ऐतिहासिक · युद्ध-स्थल' }, title: { en: 'Katkauli ka Maidan', hi: 'कटकौली का मैदान' }, loc: { en: '~6 km from town · NH 84 / Patna road', hi: 'नगर से ~6 किमी · NH 84 / पटना मार्ग' }, text: { en: 'The field of the Battle of Buxar, fought on 22–23 October 1764, when the combined forces of Mir Qasim, Shuja-ud-Daula and Shah Alam II met the East India Company army. The site lies in the countryside along the Patna road.', hi: '22–23 अक्टूबर 1764 को लड़े गए बक्सर युद्ध का मैदान, जब मीर क़ासिम, शुजाउद्दौला और शाह आलम द्वितीय की संयुक्त सेनाएँ ईस्ट इंडिया कंपनी की सेना से भिड़ीं। यह स्थल पटना मार्ग के किनारे ग्रामीण इलाके में है।' } },
          { chip: { en: 'Museum', hi: 'संग्रहालय' }, title: { en: 'Sitaram Upadhyaya Memorial Museum', hi: 'सीताराम उपाध्याय स्मारक संग्रहालय' }, loc: { en: 'On the ghat · Buxar town', hi: 'घाट पर · बक्सर नगर' }, text: { en: 'The district museum standing by the riverfront. Reported visiting hours are 10:30 a.m. to 4:00 p.m., closed on Mondays — reported, not confirmed, so check locally before relying on them.', hi: 'नदी-तट पर स्थित जिला संग्रहालय। सूचित समय सुबह 10:30 से शाम 4:00 बजे तक, सोमवार बंद — यह केवल रिपोर्ट है, पुष्ट नहीं, अतः इस पर भरोसा करने से पहले स्थानीय रूप से जाँच लें।' } },
          { chip: { en: 'Park', hi: 'उद्यान' }, title: { en: 'Kamal Dah Park', hi: 'कमल दाह पार्क' }, loc: { en: 'Near Station Road · Buxar town', hi: 'स्टेशन रोड के पास · बक्सर नगर' }, text: { en: 'The town’s public park, kept up along Station Road as a green space between the railway gate and the market lanes.', hi: 'नगर का सार्वजनिक उद्यान, रेलवे गेट और बाज़ार की गलियों के बीच स्टेशन रोड पर हरा-भरा स्थान।' } },
          { chip: { en: 'Spiritual · Ashram', hi: 'आध्यात्मिक · आश्रम' }, title: { en: 'Shri Adinath Akhara & Shri Nath Ashram', hi: 'श्री आदिनाथ अखाड़ा एवं श्री नाथ आश्रम' }, loc: { en: '~1.5 km from the station', hi: 'स्टेशन से ~1.5 किमी' }, text: { en: 'A riverside spiritual centre near the confluence of the Ganga and the Sone canal — recorded by the railway-era district notes as a resting place for pilgrims walking the river.', hi: 'गंगा और सोन नहर के संगम के पास एक नदी-तटीय आध्यात्मिक केंद्र — रेलयुग के जिला-विवरणों में नदी के सहारे चलने वाले तीर्थयात्रियों के विश्राम-स्थान के रूप में दर्ज।' } }
        ]
      },
      culture: {
        heading: { pre: 'Life on the ', em: { en: 'Riverfront', hi: 'नदी-तट' } },
        sub: { en: 'The festivals, traditions and everyday trades that give the town its character.', hi: 'त्योहार, परंपराएँ और रोज़मर्रा के व्यापार जो नगर को उसका चरित्र देते हैं।' },
        blocks: [
          { title: { en: 'Festival Seasons', hi: 'पर्व-मौसम' }, text: { en: 'Makar Sankranti — locally khichri — draws pilgrims to the ghats, and the Chhath parva fills the riverfront at sunrise and sunset with the district’s great gathering of the year.', hi: 'मकर संक्रांति — लोक में खिचड़ी — घाटों पर श्रद्धालुओं को खींचती है, और छठ पर्व सूर्योदय-सूर्यास्त पर नदी-तट को वर्ष के सबसे बड़े जमावड़े से भर देता है।' } },
          { title: { en: 'Ramayana Memory', hi: 'रामायण-स्मृति' }, text: { en: 'The town’s oldest traditions are tied to the Ramayana — the line drawn at Ram Rekha, the villages of the country around, and pilgrim walks that still follow the river.', hi: 'नगर की सबसे पुरानी परंपराएँ रामायण से जुड़ी हैं — रामरेखा पर खींची गई रेखा, आस-पास के प्रदेश के गाँव, और नदी के सहारे चलने वाली तीर्थ-पदयात्राएँ।' } },
          { title: { en: 'Fairs & Sport', hi: 'मेले और खेल' }, text: { en: 'In fair season the dried riverbed below the town becomes wrestling ground, and the market lanes that carry grains and timber turn the town into the district’s trading floor.', hi: 'मेले के मौसम में नगर के नीचे सूखा नदी-तल कुश्ती का मैदान बन जाता है, और अनाज व लकड़ी ढोने वाली बाज़ार की गलियाँ नगर को जिले का व्यापार-तल बना देती हैं।' } }
        ]
      },
      history: {
        heading: { pre: 'A Town Written ', em: { en: 'in the Records', hi: 'अभिलेखों में' } },
        sub: { en: 'The documented milestones of Buxar Town, from the river port of legend to the railway town and district headquarters.', hi: 'बक्सर नगर के प्रलेखित पड़ाव — किवदंती के नदी-बंदरगाह से रेलवे नगर और जिला मुख्यालय तक।' },
        entries: [
          { period: { en: 'The Age of Memory', hi: 'स्मृति का युग' }, title: { en: 'The Ramayana Riverfront', hi: 'रामायण नदी-तट' }, text: { en: 'Local tradition sets the town on the route of Rama’s voyage, marked on the Ganga at Ram Rekha Ghat where a line was said to be drawn for the crossing. The river-town flourished as a landing place, and pilgrims walked its bank long before any railway arrived.', hi: 'स्थानीय परंपरा नगर को राम-विहार के मार्ग पर मानती है, जिसका चिह्न गंगा पर रामरेखा घाट है जहाँ पार के लिए रेखा खींची जाने की कथा है। यह नदी-नगर एक पड़ाव-स्थल के रूप में फला-फूला, और किसी रेलवे के आने से बहुत पहले ही तीर्थयात्री इसके किनारे चलते थे।' } },
          { period: { en: '1764', hi: '1764' }, title: { en: 'The Battle of Buxar', hi: 'बक्सर युद्ध' }, text: { en: 'On 22–23 October 1764, the field at Katkauli near the town saw the battle that historians describe as decisively settling the East India Company’s hold over Bengal and Bihar. The town’s name carried the day’s memory into every later account of British rule in India.', hi: '22–23 अक्टूबर 1764 को, नगर के पास कटकौली का मैदान वह युद्ध देखा जिसे इतिहासकार बंगाल और बिहार पर ईस्ट इंडिया कंपनी की पकड़ तय कर देने वाला निर्णायक मानते हैं। नगर के नाम के साथ उस दिन की स्मृति ब्रिटिश शासन के हर बाद के विवरण में दर्ज हुई।' } },
          { period: { en: '1862', hi: '1862' }, title: { en: 'The Trunk Railway Arrives', hi: 'मुख्य रेलमार्ग का आगमन' }, text: { en: 'In 1862 the East Indian Railway’s Howrah–Delhi main line reached Buxar, and the town’s station (BXR) became a stop on the trunk route of Gangetic India. The railway made the town a market and freight point, and today the station works three platforms on the busy Patna–Ara corridor.', hi: '1862 में ईस्ट इंडियन रेलवे की हावड़ा–दिल्ली मुख्य लाइन बक्सर पहुँची, और नगर का स्टेशन (BXR) गंगा-प्रदेश के मुख्य मार्ग का पड़ाव बन गया। रेलवे ने नगर को एक बाज़ार और माल-केंद्र बना दिया, और आज स्टेशन व्यस्त पटना–आरा कॉरिडोर पर तीन प्लेटफ़ॉर्मों पर काम करता है।' } },
          { period: { en: '17 March 1991', hi: '17 मार्च 1991' }, title: { en: 'A District of Its Own', hi: 'अपना एक जिला' }, text: { en: 'Buxar district was created on 17 March 1991, by bifurcation from the old Rohtas district, and the town became the headquarters of a district of over seventeen lakh people.', hi: '17 मार्च 1991 को पुराने रोहतास जिले से विभाजन करके बक्सर जिले का गठन हुआ, और यह नगर सत्रह लाख से अधिक लोगों वाले जिले का मुख्यालय बन गया।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of the ', em: { en: 'Town', hi: 'नगर' } },
        sub: { en: 'Representative photographs and engraved views of Buxar and the country around it.', hi: 'बक्सर और उसके आस-पास के प्रदेश के प्रतिनिधि चित्र और उत्कीर्ण दृश्य।' },
        items: [
          { full: 'assets/tourism/spiritual/ram-rekha-ghat.webp', alt: 'Boats on the Ganga at Buxar at dawn', cap: 'Boats on the Ganga at Buxar at dawn', credit: 'Ganga riverfront · TheBuxar.com', wide: true },
          { full: 'assets/tourism/historical/buxar-town-1828.webp', alt: 'Buxar on the Ganga, 1828 engraving', cap: 'Buxar on the Ganga, an 1828 engraving', credit: 'View of Buxar, 1828 · V&A Collection', tall: true },
          { full: 'assets/tourism/spiritual/aarti-diyas.webp', alt: 'Evening aarti lamps on the Ganga', cap: 'Evening aarti on the riverfront (representative)', credit: 'Riverfront aarti · TheBuxar.com' },
          { full: 'assets/tourism/historical/buxar-railway-station.webp', alt: 'Buxar railway station', cap: 'Buxar railway station — the trunk line since 1862', credit: 'Buxar station · TheBuxar.com' },
          { full: 'assets/tourism/historical/buxar-fort.webp', alt: 'Buxar Fort on the river', cap: 'Buxar Fort on the river', credit: 'Buxar Fort · TheBuxar.com' },
          { full: 'assets/tourism/historical/battle-of-buxar.webp', alt: 'The field of the Battle of Buxar', cap: 'The field of the Battle of Buxar (1764)', credit: 'Battle of Buxar · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga at sunrise near Buxar', cap: 'The Ganga at sunrise near Buxar', credit: 'Ganga sunrise · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Buxar Town', hi: 'बक्सर नगर' } },
        sub: { en: 'Where the town sits in the district, and its documented position.', hi: 'नगर जिले में कहाँ बसा है, और इसकी प्रलेखित स्थिति।' },
        facts: [
          { label: { en: 'Position', hi: 'स्थिति' }, value: { en: 'On the south bank of the Ganga · ~127 km west of Patna', hi: 'गंगा के दक्षिण तट पर · पटना से ~127 किमी पश्चिम' } },
          { label: { en: 'Administration', hi: 'प्रशासन' }, value: { en: 'Buxar subdivision · Buxar district', hi: 'बक्सर अनुमंडल · बक्सर जिला' } },
          { label: { en: 'Railway', hi: 'रेलवे' }, value: { en: 'Buxar station (BXR) · Howrah–Delhi main line since 1862', hi: 'बक्सर स्टेशन (BXR) · हावड़ा–दिल्ली मुख्य लाइन, 1862 से' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: 'The pin below marks Buxar Town in the schematic district map. Only published, verified coordinates are plotted.', hi: 'नीचे का पिन योजनाबद्ध जिला-नक्शे में बक्सर नगर को दिखाता है। केवल प्रकाशित, सत्यापित निर्देशांक ही अंकित किए जाते हैं।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Town', hi: 'नगर पहुँचें' } },
        sub: { en: 'The documented ways into Buxar Town. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'बक्सर नगर में पहुँचने के प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'Buxar station (BXR) stands on the Howrah–Delhi main line of the East Central Railway. Trains of the Patna–Ara corridor and through services on the trunk route call at the station’s three platforms.', hi: 'बक्सर स्टेशन (BXR) पूर्व मध्य रेलवे की हावड़ा–दिल्ली मुख्य लाइन पर स्थित है। पटना–आरा कॉरिडोर की ट्रेनें और मुख्य मार्ग की लंबी सेवाएँ स्टेशन के तीन प्लेटफ़ॉर्मों पर रुकती हैं।' } },
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'Buxar lies on the road corridor eastwards to Ara and Patna, and is a junction town for roads running north to the Ganga crossing and south into the district’s interior. The Katkauli battlefield is roughly 6 km away along the NH 84 / Patna road.', hi: 'बक्सर पूरब की ओर आरा और पटना के सड़क-मार्ग पर स्थित है, और उत्तर में गंगा-पार और दक्षिण में जिले के आंतरिक भाग तक जाने वाली सड़कों का संगम-नगर है। कटकौली का युद्ध-मैदान NH 84 / पटना मार्ग पर लगभग 6 किमी दूर है।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: 'The ghats and the ghat-line, the station approach, the parks and the market lanes are reachable on foot or by the town’s cycle-rickshaws and auto services. Plan the Katkauli maidan trip as a half-day; the riverfront needs morning light to be seen at its best.', hi: 'घाट और घाट-मार्ग, स्टेशन-परिसर, उद्यान और बाज़ार की गलियाँ पैदल या नगर के साइकिल-रिक्शों व ऑटो सेवाओं से पहुँचा जा सकता है। कटकौली मैदान को आधे दिन की यात्रा मानें; नदी-तट को सबसे सुंदर सुबह की रोशनी में देखा जाता है।' } }
        ],
        note: { en: 'Museum hours, bridge crossings and festival dates change. Confirm the practical details with local people or the district administration before travelling.', hi: 'संग्रहालय के समय, पुल-पार और पर्व की तिथियाँ बदलती रहती हैं। यात्रा से पहले स्थानीय लोगों या जिला प्रशासन से व्यावहारिक विवरण की पुष्टि कर लें।' }
      }
    },

    /* ---------------------------------------------------------------- */
    /* 02 · DUMRAON                                                      */
    /* ---------------------------------------------------------------- */
    {
      slug: 'dumraon',
      url: 'explore/dumraon/',
      role: { en: 'Town · Sub-division', hi: 'नगर · अनुमंडल' },
      name: { en: 'Dumraon', hi: 'डुमराँव' },
      subtitle: { en: 'The second municipality and capital of the old Dumraon Raj', hi: 'जिले का दूसरा नगरपालिका नगर और प्राचीन डुमराँव राज की राजधानी' },
      heroImage: 'assets/explore/dumraon/hero.webp',
      heroCredit: { en: 'Representative heritage view of the riverside town · TheBuxar.com', hi: 'नदी-नगर का प्रतिनिधि विरासत दृश्य · TheBuxar.com' },
      coords: [25.55, 84.15],
      coordsVerified: true,
      seo: {
        title: 'Dumraon — Heritage, History & Culture | TheBuxar.com',
        description: "Dumraon — the capital of the old Dumraon Raj, the district's second municipality and the birthplace of Ustad Bismillah Khan. Heritage, history, culture and how to visit, with verified facts."
      },
      stats: [
        { label: { en: 'Town Population (2011)', hi: 'नगर जनसंख्या (2011)' }, value: { en: '53,618', hi: '53,618' } },
        { label: { en: 'Municipality Constituted', hi: 'नगरपालिका स्थापना' }, value: { en: '1877', hi: '1877' } },
        { label: { en: 'Raj Capital Founded', hi: 'राजधानी स्थापना' }, value: { en: '1745', hi: '1745' } },
        { label: { en: 'Sub-division', hi: 'अनुमंडल' }, value: { en: 'Dumraon HQ', hi: 'डुमराँव मुख्यालय' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Dumraon is the district’s second town and a sub-divisional headquarters. Its story is the story of the Dumraon Raj — the zamindari estate of the Ujjainiya Rajputs — whose chief, Raja Horil Singh, made the place his capital in 1745. Before that name settled, the town was known as Horilnagar, after the Raja himself.', hi: 'डुमराँव जिले का दूसरा नगर और एक अनुमंडलीय मुख्यालय है। इसकी कहानी डुमराँव राज की कहानी है — उज्जैनिया राजपूतों की जमींदारी — जिसके प्रमुख राजा होरिल सिंह ने 1745 में इसे अपनी राजधानी बनाया। उस नाम को स्थिर होने से पहले यह नगर राजा के ही नाम पर होरिलनगर कहलाता था।' },
          { en: 'The Raj left the town both grandeur and a livelihood: a princely palace with gardens on the edge of town, an estate that traded sugar down the river in the late 1800s, and — in a different register of fame — the musical household where Ustad Bismillah Khan was born.', hi: 'राज ने नगर को वैभव और आजीविका दोनों दी: नगर के किनारे बाग़-बगीचों वाला एक रियासती महल, एक ऐसी संपत्ति जो 1800 के दशक के उत्तरार्ध में नदी के रास्ते चीनी का व्यापार करती थी, और — प्रसिद्धि के एक अलग स्वर में — वह संगीत-घराना जहाँ उस्ताद बिस्मिल्लाह ख़ाँ का जन्म हुआ।' }
        ],
        figure: {
          src: 'assets/history/heritage-01.jpg',
          alt: 'Heritage outlook of the old Raj country (representative)',
          caption: { en: 'Heritage of the old Shahabad country — the regions the Raj once held (representative).', hi: 'पुराने शाहाबाद प्रदेश की विरासत — वे क्षेत्र जिन्हें राज कभी सँभालता था (प्रतिनिधि)।' }
        },
        note: { en: 'Town population is the 2011 municipality figure from the Census of India. The municipal institution dates from 1877 under the district records.', hi: 'नगर जनसंख्या 2011 की जनगणना का नगरपालिका आँकड़ा है। जिला अभिलेखों के अनुसार नगरपालिका की संस्था 1877 से है।' }
      },
      why: {
        heading: { pre: 'A Town That Was ', em: { en: 'a Capital', hi: 'एक राजधानी' } },
        sub: { en: 'Dumraon matters as the seat of a Raj, the second municipality of the district, and a place of royal gardens, river trade and music.', hi: 'डुमराँव एक राज की सीट, जिले की दूसरी नगरपालिका, और रियासती बाग़ों, नदी-व्यापार और संगीत की जगह के रूप में महत्वपूर्ण है।' },
        tiles: [
          { chip: { en: 'Heritage', hi: 'विरासत' }, title: { en: 'The Raj Capital', hi: 'राज की राजधानी' }, text: { en: 'From 1745 Dumraon was the capital of the Dumraon Raj of the Ujjainiya Rajputs, founded by Raja Horil Singh. The palace, its gardens and the estate town are the royal street-map of that history.', hi: '1745 से डुमराँव उज्जैनिया राजपूतों के डुमराँव राज की राजधानी थी, जिसकी स्थापना राजा होरिल सिंह ने की थी। महल, उसके बाग़ और संपत्ति-नगर उस इतिहास की राजसी सड़क-संरचना हैं।' } },
          { chip: { en: 'History', hi: 'इतिहास' }, title: { en: 'The Old Fort Country', hi: 'पुराने किले का प्रदेश' }, text: { en: 'On the Arrah–Buxar road, about 5 km away, stands the Old Fort — the Bhojpur Kadim of the records, associated with Raja Bhoj. The fort country of the old Shahabad region surrounds the town on its southern side.', hi: 'आरा–बक्सर मार्ग पर लगभग 5 किमी दूर पुराना किला स्थित है — अभिलेखों का भोजपुर क़दीम, राजा भोज से संबद्ध। पुराने शाहाबाद क्षेत्र का किला-प्रदेश नगर को उसके दक्षिणी ओर से घेरता है।' } },
          { chip: { en: 'Culture', hi: 'संस्कृति' }, title: { en: 'A Town of Music', hi: 'संगीत का नगर' }, text: { en: 'Dumraon is the birthplace of Ustad Bismillah Khan, whose shehnai carried the dhrupad household of his forebears into world renown. His legend keeps the town on the cultural map of Hindustani music.', hi: 'डुमराँव उस्ताद बिस्मिल्लाह ख़ाँ की जन्मभूमि है, जिनकी शहनाई ने उनके पूर्वजों के ध्रुपद घराने को विश्व-ख्याति दिलाई। उनकी गाथा नगर को हिंदुस्तानी संगीत के सांस्कृतिक नक्शे पर बनाए रखती है।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of ', em: { en: 'Dumraon', hi: 'डुमराँव' } },
        sub: { en: 'The documented landmarks of the estate town, from the palace gardens to the old fort five kilometres away.', hi: 'संपत्ति-नगर के प्रलेखित स्थलचिह्न, महल के बाग़ों से लेकर पाँच किलोमीटर दूर पुराने किले तक।' },
        items: [
          { chip: { en: 'Heritage · Palace', hi: 'विरासत · महल' }, title: { en: 'The Raj Palace & Gardens', hi: 'राज महल एवं बाग़' }, loc: { en: '~1.5 km south-east of the station', hi: 'स्टेशन से ~1.5 किमी दक्षिण-पूर्व' }, text: { en: 'The records of the district describe a large flower garden with a tank, together with the principal palace and pavilion of the Raj, lying about a mile and a half from the railway station.', hi: 'जिला-अभिलेख रेलवे स्टेशन से लगभग डेढ़ मील दूर एक बड़े फूलों के बाग़, एक तालाब, तथा राज के मुख्य महल और मंडप का वर्णन करते हैं।' }, note: { en: 'The garden and tank are as described in the district sources; access and current condition should be confirmed locally.', hi: 'बाग़ और तालाब जिला-स्रोतों के वर्णन के अनुसार हैं; पहुँच और वर्तमान स्थिति स्थानीय रूप से पुष्टि करें।' } },
          { chip: { en: 'Historical · Fort', hi: 'ऐतिहासिक · किला' }, title: { en: 'Old Fort · Bhojpur Kadim', hi: 'पुराना किला · भोजपुर क़दीम' }, loc: { en: '~5 km · Arrah–Buxar road', hi: '~5 किमी · आरा–बक्सर मार्ग' }, text: { en: 'The old seat of Raja Bhoj, standing a few kilometres from Dumraon on the Arrah–Buxar road. It belongs to that older Shahabad country of forts that surrounds the town.', hi: 'राजा भोज की पुरानी सीट, आरा–बक्सर मार्ग पर डुमराँव से कुछ किलोमीटर दूर स्थित। यह उस पुराने शाहाबाद के किला-प्रदेश का हिस्सा है जो नगर को घेरता है।' }, note: { en: 'Photography pending — this entry will carry its own original imagery after verification.', hi: 'फ़ोटो लंबित — सत्यापन के बाद इस प्रविष्टि में अपनी मूल तस्वीरें जोड़ी जाएँगी।' } },
          { chip: { en: 'Institution', hi: 'शैक्षणिक संस्थान' }, title: { en: 'Veer Kunwar Singh Agriculture College', hi: 'वीर कुँवर सिंह कृषि महाविद्यालय' }, loc: { en: 'Dumraon', hi: 'डुमराँव' }, text: { en: 'The agricultural college that keeps the town on the educational map of the region — a campus institution of the district recorded under its official name.', hi: 'कृषि महाविद्यालय जो नगर को क्षेत्र के शैक्षणिक नक्शे पर बनाए रखता है — जिले में अपने आधिकारिक नाम से दर्ज एक परिसर-संस्थान।' }, note: { en: 'Photography pending — this entry will carry its own original imagery after verification.', hi: 'फ़ोटो लंबित — सत्यापन के बाद इस प्रविष्टि में अपनी मूल तस्वीरें जोड़ी जाएँगी।' } },
          { chip: { en: 'Trade · History', hi: 'व्यापार · इतिहास' }, title: { en: 'The Sugar-Trading Estate', hi: 'चीनी-व्यापारी संपत्ति' }, loc: { en: 'Dumraon & its country', hi: 'डुमराँव और उसका प्रदेश' }, text: { en: 'In the later years of the 1800s the Dumraon Raj was recorded as a producer and exporter of sugar from this tract. The trade ran down the river, linking the estate to the markets of the Gangetic plain.', hi: '1800 के दशक के उत्तरार्ध में डुमराँव राज इस प्रदेश से चीनी का उत्पादक और निर्यातक के रूप में दर्ज था। यह व्यापार नदी के रास्ते चलता था, आंशिक रूप से गंगा-मैदान के बाज़ारों से जुड़ा।' } }
        ]
      },
      culture: {
        heading: { pre: 'Royal Gardens, ', em: { en: 'River Trade, Music', hi: 'नदी-व्यापार, संगीत' } },
        sub: { en: 'The strands of the town’s cultural identity — the Raj court, the estate economy and the shehnai.', hi: 'नगर की सांस्कृतिक पहचान के तंतु — राज-दरबार, संपत्ति-अर्थव्यवस्था और शहनाई।' },
        blocks: [
          { title: { en: 'The Court of the Raj', hi: 'राज का दरबार' }, text: { en: 'The palace, its pavilion and the flower garden described in the district records mark the old court centre, where the Raj estate kept its administrative and ceremonial life.', hi: 'जिला-अभिलेखों में वर्णित महल, उसका मंडप और फूलों का बाग़ पुराने दरबार-केंद्र को चिह्नित करते हैं, जहाँ राज की संपत्ति अपना प्रशासनिक और औपचारिक जीवन चलाती थी।' } },
          { title: { en: 'The Music House', hi: 'संगीत का घराना' }, text: { en: 'Ustad Bismillah Khan, the shehnai legend who became a symbol of India’s instrumental music, was born in Dumraon into the court’s dhrupad musical household.', hi: 'शहनाई के महान वादक उस्ताद बिस्मिल्लाह ख़ाँ, जो भारत के वाद्य-संगीत के प्रतीक बने, का जन्म डुमराँव में दरबार के ध्रुपद संगीत-घराने में हुआ था।' } },
          { title: { en: 'The Estate Country', hi: 'संपत्ति का प्रदेश' }, text: { en: 'The farmland around the town — the wheat and paddy of the Sone-canal country — carries on the rural economy that the estate once traded; the college campus now trains the next generation of that agriculture.', hi: 'नगर के आस-पास की खेती-भूमि — सोन-नहर प्रदेश का गेहूँ और धान — उस ग्रामीण अर्थव्यवस्था को आगे बढ़ाती है जिसका व्यापार संपत्ति कभी करती थी; कृषि महाविद्यालय अब उसी खेती की अगली पीढ़ी को प्रशिक्षित करता है।' } }
        ]
      },
      history: {
        heading: { pre: 'From Horilnagar ', em: { en: 'to the Present', hi: 'से वर्तमान तक' } },
        sub: { en: 'The documented milestones of Dumraon’s royal and municipal life.', hi: 'डुमराँव के राजसी और नगरपालिका जीवन के प्रलेखित पड़ाव।' },
        entries: [
          { period: { en: 'r. 1709–1746', hi: 'शासन 1709–1746' }, title: { en: "Raja Horil Singh's Capital", hi: 'राजा होरिल सिंह की राजधानी' }, text: { en: 'Raja Horil Singh of the Ujjainiya Rajputs made the place his capital in 1745, and the town was first known as Horilnagar after him. Under him and his successors, the Dumraon Raj grew into one of the notable zamindari estates of the old Shahabad country.', hi: 'उज्जैनिया राजपूतों के राजा होरिल सिंह ने 1745 में इसे अपनी राजधानी बनाई, और नगर पहले उन्हीं के नाम पर होरिलनगर कहलाता था। उनके और उनके उत्तराधिकारियों के अधीन डुमराँव राज पुराने शाहाबाद प्रदेश की प्रमुख जमींदारियों में से एक बना।' } },
          { period: { en: '1877', hi: '1877' }, title: { en: 'The Municipality', hi: 'नगरपालिका' }, text: { en: 'In 1877 Dumraon’s municipal institution was constituted — the town’s formal step into civic life as the second municipality of what would become Buxar district.', hi: '1877 में डुमराँव की नगरपालिका संस्था का गठन हुआ — नागरिक जीवन में नगर का औपचारिक कदम, जो बाद में बक्सर जिले का दूसरा नगरपालिका नगर बना।' } },
          { period: { en: 'Late 1800s', hi: '1800 के उत्तरार्ध' }, title: { en: 'Sugar Down the River', hi: 'नदी के रास्ते चीनी' }, text: { en: 'District records of the era list the Dumraon Raj among the producers and exporters of sugar, sending the produce of the estate country towards the markets of the plain.', hi: 'उस युग के जिला-अभिलेख डुमराँव राज को चीनी के उत्पादकों और निर्यातकों में रखते हैं, जो संपत्ति-प्रदेश की उपज को मैदान के बाज़ारों की ओर भेजता था।' } },
          { period: { en: 'The Modern Town', hi: 'आधुनिक नगर' }, title: { en: 'Sub-division & College Town', hi: 'अनुमंडल और शिक्षा-नगर' }, text: { en: 'Today Dumraon is the headquarters of a sub-division of Buxar district, home to an agricultural college, and — through Ustad Bismillah Khan’s birth here — a name held in the wider story of Indian classical music.', hi: 'आज डुमराँव बक्सर जिले के एक अनुमंडल का मुख्यालय है, एक कृषि महाविद्यालय का घर है, और — यहाँ उस्ताद बिस्मिल्लाह ख़ाँ के जन्म के कारण — भारतीय शास्त्रीय संगीत की व्यापक कथा में एक नाम।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of ', em: { en: 'Dumraon', hi: 'डुमराँव' } },
        sub: { en: 'Representative views of the estate country and the river plain around the town.', hi: 'संपत्ति-प्रदेश और नगर के आस-पास के नदी-मैदान के प्रतिनिधि दृश्य।' },
        items: [
          { full: 'assets/tourism/historical/buxar-town-1828.webp', alt: 'Representative riverside town view', cap: 'A town on the Ganga, in the manner of the riverside estate town', credit: 'Representative 1828 town view · V&A Collection', wide: true },
          { full: 'assets/tourism/historical/paddy-fields.webp', alt: 'Farmlands near Buxar', cap: 'Farmlands of the Dumraon country (representative)', credit: 'Farmlands · TheBuxar.com', tall: true },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga near Buxar', cap: 'The river plain near Dumraon (representative)', credit: 'Ganga plain · TheBuxar.com' },
          { full: 'assets/history/heritage-02.jpg', alt: 'Heritage architecture of the region', cap: 'Heritage architecture of the old Shahabad country (representative)', credit: 'Heritage study · TheBuxar.com' },
          { full: 'assets/tourism/historical/buxar-railway-station.webp', alt: 'Railway station on the Ara–Buxar corridor', cap: 'The railway corridor that links the estate town', credit: 'Railway corridor · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/aarti-diyas.webp', alt: 'Evening aarti lamps on the river', cap: 'Evening lamps on the riverfront (representative)', credit: 'Riverfront aarti · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Dumraon', hi: 'डुमराँव' } },
        sub: { en: 'Where the estate town sits in the district, and its documented position.', hi: 'संपत्ति-नगर जिले में कहाँ बसा है, और इसकी प्रलेखित स्थिति।' },
        facts: [
          { label: { en: 'Sub-division', hi: 'अनुमंडल' }, value: { en: 'Dumraon subdivision headquarters · Buxar district', hi: 'डुमराँव अनुमंडल मुख्यालय · बक्सर जिला' } },
          { label: { en: 'Municipality', hi: 'नगरपालिका' }, value: { en: 'Constituted 1877 · second municipality of the district', hi: 'स्थापना 1877 · जिले की दूसरी नगरपालिका' } },
          { label: { en: 'Railway', hi: 'रेलवे' }, value: { en: 'Dumraon station (DURE) · Ara–Buxar line', hi: 'डुमराँव स्टेशन (DURE) · आरा–बक्सर लाइन' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: 'The pin below marks Dumraon in the schematic district map. Only published, verified coordinates are plotted.', hi: 'नीचे का पिन योजनाबद्ध जिला-नक्शे में डुमराँव को दिखाता है। केवल प्रकाशित, सत्यापित निर्देशांक ही अंकित किए जाते हैं।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Town', hi: 'नगर पहुँचें' } },
        sub: { en: 'The documented ways into Dumraon. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'डुमराँव में पहुँचने के प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'Dumraon station (DURE) lies on the Ara–Buxar railway line. It is the gateway stop for the town, with the palace gardens a short ride away.', hi: 'डुमराँव स्टेशन (DURE) आरा–बक्सर रेलवे लाइन पर स्थित है। यह नगर का प्रवेश-पड़ाव है, महल के बाग़ यहाँ से थोड़ी दूरी पर हैं।' } },
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'The town sits on the Arrah–Buxar road corridor. The Old Fort at Bhojpur Kadim is about 5 km away on the same road, so the fort, the town and the station can be joined in a single day’s circuit.', hi: 'नगर आरा–बक्सर सड़क-मार्ग पर स्थित है। भोजपुर क़दीम का पुराना किला उसी मार्ग पर लगभग 5 किमी दूर है, अतः किला, नगर और स्टेशन को एक ही दिन के चक्र में जोड़ा जा सकता है।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: 'The palace quarter lies about 1.5 km south-east of the station, within easy reach of the town’s autos and cycle-rickshaws. Ask locally for current access to the palace and garden grounds before walking in.', hi: 'महल-क्षेत्र स्टेशन से लगभग 1.5 किमी दक्षिण-पूर्व में है, जो नगर के ऑटो और साइकिल-रिक्शों की आसान पहुँच में है। अंदर जाने से पहले महल और बाग़ के मैदान की वर्तमान पहुँच स्थानीय रूप से पूछ लें।' } }
        ],
        note: { en: 'Palace and fort access, opening conditions and road conditions change. Confirm the practical details with local people or the district administration before travelling.', hi: 'महल और किले की पहुँच, खुलने की स्थिति और सड़क-स्थिति बदलती रहती है। यात्रा से पहले स्थानीय लोगों या जिला प्रशासन से व्यावहारिक विवरण की पुष्टि कर लें।' }
      }
    },

    /* ---------------------------------------------------------------- */
    /* 03 · BRAHAMPUR                                                    */
    /* ---------------------------------------------------------------- */
    {
      slug: 'brahampur',
      url: 'explore/brahampur/',
      role: { en: 'Area · Block', hi: 'क्षेत्र · प्रखंड' },
      name: { en: 'Brahampur', hi: 'ब्रहमपुर' },
      subtitle: { en: 'The land of Baba Brahmeshwar Nath and a Shravan walking pilgrimage', hi: 'बाबा ब्रह्मेश्वर नाथ और श्रावण की पद-यात्रा की भूमि' },
      heroImage: 'assets/tourism/historical/naulakha-mandir.webp',
      heroCredit: { en: 'Representative image of the Shiva temple country · TheBuxar.com', hi: 'शिव-मंदिर प्रदेश का प्रतिनिधि चित्र · TheBuxar.com' },
      coords: [25.35, 84.18],
      coordsVerified: true,
      seo: {
        title: 'Brahampur — Baba Brahmeshwar Nath & the Shravan Pilgrimage | TheBuxar.com',
        description: 'Brahampur — the large rural block of the Dumraon sub-division, Buxar district, known for the Baba Brahmeshwar Nath Shiva temple and the walking pilgrimage that covers its roads through the month of Shravan.'
      },
      stats: [
        { label: { en: 'Block Population (2011)', hi: 'प्रखंड जनसंख्या (2011)' }, value: { en: '~1,96,070', hi: '~1,96,070' } },
        { label: { en: 'Village Brahmapur (2011)', hi: 'ब्रह्मपुर गाँव (2011)' }, value: { en: '17,057', hi: '17,057' } },
        { label: { en: 'PIN Code', hi: 'पिन कोड' }, value: { en: '802112', hi: '802112' } },
        { label: { en: 'Nearest Rail', hi: 'निकटतम रेलवे' }, value: { en: 'Raghunathpur (~3 km)', hi: 'रघुनाथपुर (~3 किमी)' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Brahampur (also written Brahmapur) is a large rural area and community-development block of the Dumraon sub-division, Buxar district, set back from the Ganga in the paddy country. It is known first for its Shiva temple — Baba Brahmeshwar Nath, reckoned about 38 km by road from Buxar town in accounts of visitors — and second for the pilgrimage that reaches it on foot.', hi: 'ब्रहमपुर (जिसे ब्रह्मपुर भी लिखा जाता है) डुमराँव अनुमंडल, बक्सर जिले का एक बड़ा ग्रामीण क्षेत्र और विकासखंड है, जो गंगा से कुछ दूर धान के प्रदेश में बसा है। यह सबसे पहले अपने शिव मंदिर — बाबा ब्रह्मेश्वर नाथ, जो यात्रियों के वृत्तांतों में बक्सर नगर से सड़क मार्ग से लगभग 38 किमी बताया जाता है — और फिर उस पद-यात्रा के लिए जाना जाता है जो उस तक पैदल पहुँचती है।' },
          { en: 'Through Shravan the roads of the block fill with devotees walking from the ghats of Buxar, and the cattle fairs that follow the harvest lend the plain its old market rhythm. The village of Brahmapur itself counted some seventeen thousand people at the 2011 census.', hi: 'श्रावण में प्रखंड की सड़कें बक्सर के घाटों से पैदल चलने वाले श्रद्धालुओं से भर जाती हैं, और फ़सल के बाद लगने वाले पशु-मेले मैदान को उसकी पुरानी बाज़ार-लय देते हैं। 2011 की जनगणना में ब्रह्मपुर गाँव में लगभग सत्रह हज़ार लोग थे।' }
        ],
        figure: {
          src: 'assets/tourism/spiritual/ganga-sunrise.webp',
          alt: 'The Ganga at sunrise near Buxar (representative)',
          caption: { en: 'The Ganga at sunrise — the riverfront the Shravan walkers leave behind (representative).', hi: 'सूर्योदय पर गंगा — वह नदी-तट जिसे श्रावण के पद-यात्री पीछे छोड़ते हैं (प्रतिनिधि)।' }
        },
        note: { en: 'Figures are from the Census of 2011 and district records. The ~38 km temple distance is an on-the-road estimate reported by visitors, not a surveyed figure — verify with local people before relying on it.', hi: 'आँकड़े 2011 की जनगणना और जिला अभिलेखों के हैं। मंदिर की ~38 किमी दूरी यात्रियों द्वारा बताई गई सड़क का अनुमान है, सर्वेक्षित आँकड़ा नहीं — उस पर भरोसा करने से पहले स्थानीय लोगों से पुष्टि करें।' }
      },
      why: {
        heading: { pre: 'A Temple, a Walking ', em: { en: 'Yatra, a Plain', hi: 'यात्रा, एक मैदान' } },
        sub: { en: 'Brahampur matters through the shrine that draws the district on foot, the season that makes its roads sacred, and the broad farm country that anchors the sub-division.', hi: 'ब्रहमपुर उस तीर्थ से महत्वपूर्ण है जो जिले को पैदल खींच लाता है, उस महीने से जो इसकी सड़कों को पवित्र बना देता है, और उस विशाल कृषि-प्रदेश से जो अनुमंडल को थामे हुए है।' },
        tiles: [
          { chip: { en: 'Spiritual', hi: 'आध्यात्मिक' }, title: { en: 'Baba Brahmeshwar Nath', hi: 'बाबा ब्रह्मेश्वर नाथ' }, text: { en: 'The Shiva temple of the block, reckoned about 38 km by road from Buxar town in the accounts of visitors, and the fixed point of the local pilgrimage. Its age is not documented in our sources; its pull on the district is.', hi: 'प्रखंड का शिव मंदिर, जो यात्रियों के वृत्तांतों में बक्सर नगर से सड़क मार्ग से लगभग 38 किमी बताया जाता है, और स्थानीय तीर्थयात्रा का स्थिर बिंदु है। इसकी प्राचीनता हमारे स्रोतों में प्रलेखित नहीं है; जिले पर इसका खिंचाव प्रलेखित है।' } },
          { chip: { en: 'Tradition', hi: 'परंपरा' }, title: { en: 'The Shravan Walking Season', hi: 'श्रावण की पद-यात्रा' }, text: { en: 'In the month of Shravan pilgrims walk the long road from the ghats of Buxar (Ram Rekha Ghat among them) toward the temple country. The walking pilgrimage is the event of the block’s year — people on foot, in the months of the rains.', hi: 'श्रावण मास में श्रद्धालु बक्सर के घाटों (जिनमें राम रेखा घाट भी है) से मंदिर प्रदेश की ओर लंबा पैदल मार्ग तय करते हैं। पद-यात्रा ही प्रखंड के वर्ष की सबसे बड़ी घटना है — वर्षा के महीनों में, पैदल चलते लोग।' } },
          { chip: { en: 'Culture', hi: 'संस्कृति' }, title: { en: 'The Rural Heartland', hi: 'ग्रामीण हृदय-प्रदेश' }, text: { en: 'A community-development block of the Dumraon sub-division, crossed by National Highway 84, with the nearest railhead at Raghunathpur some 3 km away. Paddy, wheat and the market cattle of the plain define its work.', hi: 'डुमराँव अनुमंडल का एक विकासखंड, जिसे राष्ट्रीय राजमार्ग 84 पार करता है, और निकटतम रेलवे स्टेशन रघुनाथपुर लगभग 3 किमी दूर है। धान, गेहूँ और मैदान के बाज़ार के पशु इसके काम को परिभाषित करते हैं।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of ', em: { en: 'Brahampur', hi: 'ब्रहमपुर' } },
        sub: { en: 'The documented landmarks of the block — the temple, the walking route, and the road-country around them.', hi: 'प्रखंड के प्रलेखित स्थलचिह्न — मंदिर, पद-मार्ग, और उनके आस-पास का सड़क-प्रदेश।' },
        items: [
          { chip: { en: 'Spiritual · Temple', hi: 'आध्यात्मिक · मंदिर' }, title: { en: 'Baba Brahmeshwar Nath Temple', hi: 'बाबा ब्रह्मेश्वर नाथ मंदिर' }, loc: { en: 'Brahampur block · ~38 km by road from Buxar (per visitors)', hi: 'ब्रहमपुर प्रखंड · बक्सर से सड़क मार्ग ~38 किमी (यात्रियों के अनुसार)' }, text: { en: 'The Shiva temple that anchors the block’s pilgrimage, reached through the paddy country on the south of the district. Its documented fame rests on the walking crowds of Shravan rather than any written antiquity.', hi: 'प्रखंड की तीर्थयात्रा को थामने वाला शिव मंदिर, जिले के दक्षिण में धान के प्रदेश से होकर पहुँचा जाता है। इसकी प्रलेखित ख्याति श्रावण की पद-भीड़ पर टिकी है, किसी लिखित प्राचीनता पर नहीं।' }, note: { en: 'The temple is named here on the strength of published district tourism material; its age and structure should be confirmed with the local temple office before further detail is added.', hi: 'मंदिर का उल्लेख प्रकाशित जिला पर्यटन सामग्री के आधार पर किया गया है; और विवरण जोड़ने से पहले इसकी प्राचीनता और संरचना स्थानीय मंदिर कार्यालय से पुष्टि करें।' } },
          { chip: { en: 'Pilgrimage · Walking Route', hi: 'तीर्थ · पद-मार्ग' }, title: { en: 'The Shravan Walking Route', hi: 'श्रावण पद-मार्ग' }, loc: { en: 'From the ghats of Buxar (Ram Rekha Ghat) toward the temple country', hi: 'बक्सर के घाटों (राम रेखा घाट) से मंदिर प्रदेश की ओर' }, text: { en: 'In the month of Shravan the pilgrims’ road out of Buxar runs through the block — a walking yatra documented in the district’s account of the temple, not a written highway of the old world.', hi: 'श्रावण मास में बक्सर से निकलने वाली श्रद्धालुओं की सड़क प्रखंड से होकर जाती है — मंदिर के जिला-विवरण में प्रलेखित एक पद-यात्रा, प्राचीन दुनिया की लिखित सड़क नहीं।' } },
          { chip: { en: 'Country · Farms', hi: 'प्रदेश · खेत' }, title: { en: 'The Brahampur Countryside', hi: 'ब्रहमपुर का प्रदेश' }, loc: { en: 'Along National Highway 84 · Raghunathpur railway ~3 km', hi: 'राष्ट्रीय राजमार्ग 84 पर · रघुनाथपुर रेलवे ~3 किमी' }, text: { en: 'The wide, low plain of the block — rice and wheat country crossed by the national highway, with the nearest train stop at Raghunathpur a short ride away. The cattle fairs held after the harvest keep an old market rhythm on the road edges.', hi: 'प्रखंड का विस्तृत, समतल मैदान — धान और गेहूँ का प्रदेश जिसे राष्ट्रीय राजमार्ग पार करता है, और निकटतम ट्रेन-पड़ाव रघुनाथपुर कुछ ही सवारी दूर है। फ़सल के बाद लगने वाले पशु-मेले सड़क-किनारे पुरानी बाज़ार-लय बनाए रखते हैं।' } },
          { chip: { en: 'Fair · Market', hi: 'मेला · बाज़ार' }, title: { en: 'The Harvest Cattle Fairs', hi: 'फ़सल-पशु मेले' }, loc: { en: 'Brahampur block · following the harvest', hi: 'ब्रहमपुर प्रखंड · फ़सल के बाद' }, text: { en: 'Cattle fairs are reported in the block after the season’s work is done — a market gathering of the plain that has not yet been photographed for this guide.', hi: 'फ़सल के काम निपटने के बाद प्रखंड में पशु-मेलों की सूचना मिलती है — मैदान का बाज़ार समागम जिसकी तस्वीरें अभी इस गाइड में नहीं जुड़ पाई हैं।' }, note: { en: 'Reported in local accounts, not independently documented here — dates and locations must be verified locally.', hi: 'स्थानीय वृत्तांतों में बताए गए, यहाँ स्वतंत्र रूप से प्रलेखित नहीं — तिथियाँ और स्थान स्थानीय रूप से सत्यापित किए जाने चाहिए।' } }
        ]
      },
      culture: {
        heading: { pre: 'The Sacred ', em: { en: 'Month', hi: 'महीना' } },
        sub: { en: 'The calendar of the block is set by the rains, the walking month, and the harvest.', hi: 'प्रखंड का कैलेंडर वर्षा, पद-यात्रा के महीने और फ़सल से निर्धारित होता है।' },
        blocks: [
          { title: { en: 'Shravan', hi: 'श्रावण' }, text: { en: 'The month of Shravan turns the block’s roads into processional ways. Pilgrims walk from the ghats of Buxar toward Baba Brahmeshwar Nath, and the temple country lives at the pace of the foot-columns.', hi: 'श्रावण का महीना प्रखंड की सड़कों को शोभायात्रा-मार्ग बना देता है। श्रद्धालु बक्सर के घाटों से बाबा ब्रह्मेश्वर नाथ की ओर पैदल चलते हैं, और मंदिर-प्रदेश पद-स्तंभों की गति से जीता है।' } },
          { title: { en: 'The Harvest Year', hi: 'फ़सल का वर्ष' }, text: { en: 'Paddy through the monsoon, wheat across the winter plains — the work of the block that the travellers pass between the two. The cattle fairs reported after the harvest close the year’s market round.', hi: 'मानसून में धान, सर्दी के मैदानों में गेहूँ — यात्रियों के बीच से निकलने वाला प्रखंड का काम। फ़सल के बाद बताए गए पशु-मेले साल का बाज़ार चक्र पूरा करते हैं।' } },
          { title: { en: 'Season to Visit', hi: 'घूमने का मौसम' }, text: { en: 'The cool months — roughly September to April — suit the plain’s country roads. Come in July or August only for the walking pilgrimage, and be ready for the rains that attend it.', hi: 'ठंडे महीने — मोटे तौर पर सितंबर से अप्रैल — मैदान की ग्रामीण सड़कों के लिए उपयुक्त हैं। पद-यात्रा के लिए ही जुलाई-अगस्त में जाएँ, और साथ वाली वर्षा के लिए तैयार रहें।' } }
        ]
      },
      history: {
        heading: { pre: 'A Pilgrimage ', em: { en: 'Documented and Not', hi: 'प्रलेखित और अप्रलेखित' } },
        sub: { en: 'What the block’s records will bear — and what remains only tradition.', hi: 'प्रखंड के अभिलेख जो सह सकते हैं — और जो केवल परंपरा ही है।' },
        entries: [
          { period: { en: 'Undated', hi: 'तिथि अनिर्धारित' }, title: { en: 'The Temple Tradition', hi: 'मंदिर की परंपरा' }, text: { en: 'Baba Brahmeshwar Nath stands where the district’s accounts put it, in the block’s paddy country. No written date antedates the shrine in the sources we have used; its documented life begins with the walking pilgrimage that pays it the season’s visit.', hi: 'बाबा ब्रह्मेश्वर नाथ वहीं खड़े हैं जहाँ जिला के विवरण रखते हैं, प्रखंड के धान-प्रदेश में। हमारे स्रोतों में मंदिर की कोई लिखित तिथि उससे पहले नहीं आती; इसका प्रलेखित जीवन उस पद-यात्रा से शुरू होता है जो मौसम का दर्शन करने आती है।' } },
          { period: { en: 'An old season', hi: 'एक पुराना मौसम' }, title: { en: 'The Walking Yatra', hi: 'पद-यात्रा' }, text: { en: 'From the ghats of Buxar — Ram Rekha Ghat among them — the Shravan walkers have long moved toward the temple country of the sub-division. It is a lived tradition of the block rather than a dated event of the chronicles.', hi: 'बक्सर के घाटों — जिनमें राम रेखा घाट भी है — से श्रावण के पद-यात्री लंबे समय से अनुमंडल के मंदिर-प्रदेश की ओर चले हैं। यह प्रखंड की जीवित परंपरा है, इतिहास की तिथि-बद्ध घटना नहीं।' } },
          { period: { en: 'The Modern Block', hi: 'आधुनिक प्रखंड' }, title: { en: 'Brahampur Today', hi: 'आज का ब्रहमपुर' }, text: { en: 'Today Brahampur is a community-development block of the Dumraon sub-division — a large rural population carried on National Highway 84, with the railhead at Raghunathpur some three kilometres off.', hi: 'आज ब्रहमपुर डुमराँव अनुमंडल का एक विकासखंड है — राष्ट्रीय राजमार्ग 84 पर टिकी एक बड़ी ग्रामीण आबादी, और लगभग तीन किलोमीटर दूर रघुनाथपुर में रेलवे स्टेशन।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of ', em: { en: 'Brahampur', hi: 'ब्रहमपुर' } },
        sub: { en: 'The temple country, the ghats the walkers quit, and the plain between.', hi: 'मंदिर-प्रदेश, वे घाट जिनसे यात्री चलते हैं, और बीच का मैदान।' },
        items: [
          { full: 'assets/history/naulakha-mandir-buxar.jpg', alt: 'Baba Brahmeshwar Nath temple', cap: 'Baba Brahmeshwar Nath temple country', credit: 'Temple country · TheBuxar.com', wide: true },
          { full: 'assets/tourism/spiritual/ram-rekha-ghat.webp', alt: 'Ram Rekha Ghat at Buxar', cap: 'Ram Rekha Ghat at Buxar — the walk begins here (representative)', credit: 'Ghat · TheBuxar.com', tall: true },
          { full: 'assets/tourism/historical/paddy-fields.webp', alt: 'Paddy fields of the Brahampur country', cap: 'The paddy country of the block (representative)', credit: 'Farmlands · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga along the district', cap: 'The Ganga along the district’s south (representative)', credit: 'Ganga · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/aarti-diyas.webp', alt: 'Evening aarti lamps on the Ganga', cap: 'Evening lamps on the spiritual riverfront (representative)', credit: 'Ganga aarti · TheBuxar.com' },
          { full: 'assets/history/modern-buxar.jpg', alt: 'Roads of the modern district', cap: 'The road country of the modern district (representative)', credit: 'Modern Buxar · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Brahampur', hi: 'ब्रहमपुर' } },
        sub: { en: 'Where the block sits in the sub-division, and its documented position.', hi: 'प्रखंड अनुमंडल में कहाँ बसा है, और इसकी प्रलेखित स्थिति।' },
        facts: [
          { label: { en: 'Position', hi: 'स्थिति' }, value: { en: 'South of the Ganga plain · Dumraon sub-division · served by NH-84', hi: 'गंगा मैदान के दक्षिण · डुमराँव अनुमंडल · NH-84 से जुड़ा' } },
          { label: { en: 'Block', hi: 'प्रखंड' }, value: { en: 'Brahampur block (2011: ~1,96,070 people; village Brahmapur 17,057)', hi: 'ब्रहमपुर प्रखंड (2011: ~1,96,070 लोग; ब्रह्मपुर गाँव 17,057)' } },
          { label: { en: 'PIN · Nearest Rail', hi: 'पिन · निकटतम रेल' }, value: { en: '802112 · Raghunathpur (~3 km)', hi: '802112 · रघुनाथपुर (~3 किमी)' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: 'The pin below marks the verified coordinate of the block in the schematic district map — a reference point, not the temple’s own location, which we do not have from a surveyed source.', hi: 'नीचे का पिन योजनाबद्ध जिला-नक्शे में प्रखंड के सत्यापित निर्देशांक को दिखाता है — एक संदर्भ बिंदु, मंदिर का अपना स्थान नहीं, जो हमें सर्वेक्षित स्रोत से प्राप्त नहीं है।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Block', hi: 'प्रखंड पहुँचें' } },
        sub: { en: 'The documented ways into Brahampur. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'ब्रहमपुर में पहुँचने के प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'The nearest railhead is at Raghunathpur, about 3 km away; Buxar and Dumraon stations serve the wider area on the main line. Services and stoppages should be checked from the current timetable.', hi: 'निकटतम रेलवे स्टेशन लगभग 3 किमी दूर रघुनाथपुर में है; बक्सर और डुमराँव स्टेशन मुख्य लाइन पर व्यापक क्षेत्र को सेवा देते हैं। सेवाएँ और ठहराव वर्तमान समय-सारणी से जाँचे जाने चाहिए।' } },
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'Brahampur is reached through the sub-division’s road network, on the corridor of National Highway 84. The temple is reckoned about 38 km by road from Buxar town in visitors’ accounts — a figure to confirm locally before travel.', hi: 'ब्रहमपुर अनुमंडल के सड़क-जाल से होकर पहुँचा जाता है, जो राष्ट्रीय राजमार्ग 84 के मार्ग पर है। यात्रियों के वृत्तांतों में मंदिर बक्सर नगर से सड़क मार्ग द्वारा लगभग 38 किमी बताया जाता है — यात्रा से पहले स्थानीय रूप से पुष्टि करने योग्य आँकड़ा।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: 'The temple country is reached through the block’s lanes off the main road; in Shravan the pilgrims arrive on foot from the ghats of Buxar. Confirm the last stretch of road and any walking season arrangements locally.', hi: 'मंदिर-प्रदेश मुख्य मार्ग से प्रखंड की गलियों से होकर पहुँचा जाता है; श्रावण में तीर्थयात्री बक्सर के घाटों से पैदल आते हैं। सड़क का अंतिम हिस्सा और पद-यात्रा की व्यवस्थाएँ स्थानीय रूप से पुष्टि करें।' } },
          { mode: { en: 'Season', hi: 'मौसम' }, icon: 'pin', text: { en: 'Travel the plain between September and April for comfort. July and August belong to the Shravan walking season — join only if you are prepared for the rains and the crowds.', hi: 'आराम के लिए सितंबर और अप्रैल के बीच मैदान में यात्रा करें। जुलाई और अगस्त श्रावण की पद-यात्रा के हैं — केवल तभी जुड़ें यदि आप वर्षा और भीड़ के लिए तैयार हैं।' } }
        ],
        note: { en: 'The temple distance and the fair dates come from reported accounts, not surveyed records. Confirm the route, the temple’s current arrangements and the season’s calendar with local people before travelling.', hi: 'मंदिर की दूरी और मेले की तिथियाँ सर्वेक्षित अभिलेखों से नहीं, बताए गए वृत्तांतों से हैं। यात्रा से पहले स्थानीय लोगों से मार्ग, मंदिर की वर्तमान व्यवस्था और मौसम का कैलेंडर पुष्टि करें।' }
      }
    },

    /* ---------------------------------------------------------------- */
    /* 04 · CHAUSA                                                       */
    /* ---------------------------------------------------------------- */
    {
      slug: 'chausa',
      url: 'explore/chausa/',
      role: { en: 'Town · Block', hi: 'नगर · प्रखंड' },
      name: { en: 'Chausa', hi: 'चौसा' },
      subtitle: { en: 'The field of Sher Shah Suri’s victory — and the mango that carries its name', hi: 'शेरशाह सूरी की विजय का मैदान — और उसका नाम रखने वाला आम' },
      heroImage: 'assets/explore/chausa/hero.webp',
      heroCredit: { en: 'Diagram of the Battle of Chausa, 26 June 1539 · TheBuxar.com', hi: 'चौसा युद्ध का नक़्शा, 26 जून 1539 · TheBuxar.com' },
      coords: [25.50754, 83.88231],
      coordsVerified: true,
      seo: {
        title: 'Chausa — History, Battle of Chausa & Culture | TheBuxar.com',
        description: 'Chausa — the town and block about 11 km west of Buxar, field of the Battle of Chausa (26 June 1539) where Sher Shah Suri defeated Humayun, and namesake of the famous Chausa mango. History, places and how to visit.'
      },
      stats: [
        { label: { en: 'Position', hi: 'स्थिति' }, value: { en: '~11 km west of Buxar', hi: 'बक्सर से ~11 किमी पश्चिम' } },
        { label: { en: 'Town Population (2011)', hi: 'नगर जनसंख्या (2011)' }, value: { en: '9,011', hi: '9,011' } },
        { label: { en: 'Block (2011)', hi: 'प्रखंड (2011)' }, value: { en: '1,03,670 · 82 villages', hi: '1,03,670 · 82 गाँव' } },
        { label: { en: 'PIN Code', hi: 'पिन कोड' }, value: { en: '802114', hi: '802114' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Chausa is a town and community-development block of Buxar district, standing on the bank of the Ganga about 11 km west of Buxar town. It enters the histories at least twice. The first is the Battle of Chausa of 26 June 1539, when Sher Shah Suri defeated the Mughal emperor Humayun on this ground. The second is the mango: a sweet, yellow variety carries the name Chausa into the summer markets of northern India.', hi: 'चौसा बक्सर जिले का एक नगर और विकासखंड है, जो बक्सर नगर से लगभग 11 किमी पश्चिम गंगा के तट पर स्थित है। यह इतिहास में कम से कम दो बार दर्ज है। पहला 26 जून 1539 का चौसा युद्ध है, जब शेरशाह सूरी ने इसी भूमि पर मुग़ल सम्राट हुमायूँ को हराया था। दूसरा है आम: एक मीठी, पीली किस्म चौसा का नाम उत्तरी भारत के ग्रीष्म-बाज़ारों में पहुँचाती है।' },
          { en: 'The town and its block — with over a lakh people and eighty-two villages in 2011 — keep the field between farmland and market. The battle site, the mango lore, and the bronze image of Rishabhadeva that takes its name from the place are the threads of its fame.', hi: '2011 में नगर और उसके प्रखंड में एक लाख से अधिक लोग और बयासी गाँव हैं — यह मैदान खेतों और बाज़ार के बीच सँवरा है। युद्ध-स्थल, आम की कथा, और ऋषभदेव की वह कांस्य प्रतिमा जो इसी स्थान से अपना नाम लेती है — ये इसकी प्रसिद्धि के तंतु हैं।' }
        ],
        figure: {
          src: 'assets/history/sher-shah-tomb-sasaram.jpg',
          alt: 'The tomb of Sher Shah Suri at Sasaram (representative)',
          caption: { en: 'Sher Shah’s tomb at Sasaram — the victor of Chausa, whose rise the field sealed (representative).', hi: 'सासाराम में शेरशाह का मकबरा — चौसा का विजेता, जिसका उत्थान इसी मैदान ने तय किया (प्रतिनिधि)।' }
        },
        note: { en: 'Figures are from the Census of 2011. The distance is measured along the river road west of Buxar; a regional tourism note once gave a slightly different distance, so verify locally.', hi: 'आँकड़े 2011 की जनगणना के हैं। दूरी बक्सर के पश्चिम नदी-मार्ग पर मापी गई है; एक क्षेत्रीय पर्यटन-नोट में कभी थोड़ी भिन्न दूरी दी गई थी, अतः स्थानीय रूप से जाँचें।' }
      },
      why: {
        heading: { pre: 'A Field, a Fruit, ', em: { en: 'a Bronze', hi: 'एक प्रतिमा' } },
        sub: { en: 'Chausa matters through the battle that changed an empire’s path, the mango that named a season, and an early bronze of Jain tradition.', hi: 'चौसा उस युद्ध के कारण महत्वपूर्ण है जिसने साम्राज्य का मार्ग बदला, उस आम के कारण जिसने एक मौसम को नाम दिया, और जैन परंपरा की एक आरंभिक कांस्य प्रतिमा के कारण।' },
        tiles: [
          { chip: { en: 'History', hi: 'इतिहास' }, title: { en: 'The Battlefield of 1539', hi: '1539 का युद्ध-स्थल' }, text: { en: 'On 26 June 1539 Sher Shah Suri’s forces met the Mughal army of Humayun on the plains here. The victory set the foundation of Sur rule over Hindustan and scattered Humayun’s army across the river country — the town’s leading claim on history.', hi: '26 जून 1539 को शेरशाह सूरी की सेनाएँ यहीं के मैदान में हुमायूँ की मुग़ल सेना से भिड़ीं। इस विजय ने हिंदुस्तान पर सूर शासन की नींव रखी और हुमायूँ की सेना नदी-प्रदेश में बिखेर दी — यही नगर का इतिहास पर प्रमुख दावा है।' } },
          { chip: { en: 'Agriculture', hi: 'कृषि' }, title: { en: 'The Chausa Mango', hi: 'चौसा आम' }, text: { en: 'The Chausa is a named mango variety, long listed among the sweetest of northern India. Folklore links its name to Sher Shah’s victory feast; historians have not proved any connection between the block and the variety. The tale is told, the sweetness is certain.', hi: 'चौसा एक नामित आम-किस्म है, जो उत्तरी भारत की मीठी किस्मों में लंबे समय से गिनी जाती है। किवदंती इसके नाम को शेरशाह की विजय-भोज से जोड़ती है; इतिहासकारों ने प्रखंड और इस किस्म के बीच कोई संबंध सिद्ध नहीं किया। कथा कही जाती है, मिठास निश्चित है।' } },
          { chip: { en: 'Heritage', hi: 'विरासत' }, title: { en: 'The Chausa Bronze', hi: 'चौसा की कांस्य प्रतिमा' }, text: { en: 'A celebrated early medieval Indian bronze of Rishabhadeva, named for this place, is preserved in the Patna Museum. It is one of the finest known images of the first Jina — and the town’s quiet claim to the art of the ancient country.', hi: 'ऋषभदेव की एक प्रसिद्ध प्रारंभिक मध्यकालीन भारतीय कांस्य प्रतिमा, जो इसी स्थान के नाम से जानी जाती है, पटना संग्रहालय में सुरक्षित है। यह प्रथम जिन की सर्वोत्तम ज्ञात प्रतिमाओं में से एक है — और प्राचीन प्रदेश की कला पर नगर का शांत दावा।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of ', em: { en: 'Chausa', hi: 'चौसा' } },
        sub: { en: 'The documented landmarks of the block — the battle ground, the railway stop, and the mango country.', hi: 'प्रखंड के प्रलेखित स्थलचिह्न — युद्ध-भूमि, रेलवे पड़ाव, और आम का प्रदेश।' },
        items: [
          { chip: { en: 'Historical · Battlefield', hi: 'ऐतिहासिक · युद्ध-स्थल' }, title: { en: 'The Ground of the Battle of Chausa', hi: 'चौसा युद्ध की भूमि' }, loc: { en: 'Chausa · on the Ganga, west of Buxar', hi: 'चौसा · गंगा पर, बक्सर के पश्चिम' }, text: { en: 'The field on which Sher Shah Suri defeated the Mughal army of Humayun on 26 June 1539. The site is named in the district’s historical accounts as one of its principal attractions.', hi: 'वह मैदान जहाँ 26 जून 1539 को शेरशाह सूरी ने हुमायूँ की मुग़ल सेना को हराया। यह स्थल जिले के ऐतिहासिक विवरणों में इसके प्रमुख आकर्षणों में से एक माना गया है।' }, note: { en: 'The open field is part of the working countryside — no monument is described in our sources, so verify locally what is marked on the ground today.', hi: 'खुला मैदान काम करते ग्रामीण प्रदेश का हिस्सा है — हमारे स्रोतों में कोई स्मारक वर्णित नहीं है, अतः आज ज़मीन पर क्या चिह्नित है, स्थानीय रूप से जाँचें।' } },
          { chip: { en: 'Art · Museum', hi: 'कला · संग्रहालय' }, title: { en: 'The Chausa Bronze of Rishabhadeva', hi: 'ऋषभदेव की चौसा कांस्य प्रतिमा' }, loc: { en: 'Preserved in the Patna Museum', hi: 'पटना संग्रहालय में सुरक्षित' }, text: { en: 'The early medieval bronze image of Rishabhadeva recovered from this region is one of the great objects of the Patna Museum — the town’s name kept alive in the museum’s catalogue.', hi: 'इस क्षेत्र से प्राप्त प्रारंभिक मध्यकालीन ऋषभदेव की कांस्य प्रतिमा पटना संग्रहालय की महान कलाकृतियों में से एक है — संग्रहालय की सूची में नगर का नाम जीवित रखने वाली वस्तु।' } },
          { chip: { en: 'Country · Mango', hi: 'प्रदेश · आम' }, title: { en: 'The Chausa Mango Country', hi: 'चौसा आम का प्रदेश' }, loc: { en: 'Chausa block · orchards and farmlands', hi: 'चौसा प्रखंड · बाग़ और खेत' }, text: { en: 'The district of Buxar is part of the mango-growing belt of northern Bihar, and the name Chausa rides on a variety sold through the summer markets from June onward. The connection of the name to the block is folklore, not documented history.', hi: 'बक्सर जिला उत्तरी बिहार के आम-उत्पादक क्षेत्र का हिस्सा है, और चौसा नाम एक ऐसी किस्म पर सवार है जो जून से ग्रीष्म-बाज़ारों में बिकती है। नाम का प्रखंड से संबंध लोक-कथा है, प्रलेखित इतिहास नहीं।' } },
          { chip: { en: 'Railway', hi: 'रेलवे' }, title: { en: 'Chausa Railway Stop', hi: 'चौसा रेलवे पड़ाव' }, loc: { en: 'On the East Central Railway line', hi: 'पूर्व मध्य रेलवे लाइन पर' }, text: { en: 'A stopping point on the railway that links the block to Buxar and Ara — the practical gateway for the battlefield and the mango markets.', hi: 'बक्सर और आरा से प्रखंड को जोड़ने वाली रेलवे का एक पड़ाव — युद्ध-स्थल और आम-बाज़ारों का व्यावहारिक प्रवेश द्वार।' }, note: { en: 'Photography pending — this entry will carry its own original imagery after verification.', hi: 'फ़ोटो लंबित — सत्यापन के बाद इस प्रविष्टि में अपनी मूल तस्वीरें जोड़ी जाएँगी।' } }
        ]
      },
      culture: {
        heading: { pre: 'A Mango Season, ', em: { en: 'a Mango Season', hi: 'एक आम-मौसम' } },
        sub: { en: 'The rhythms of the Chausa block — an agricultural calendar set by the river and the mango.', hi: 'चौसा प्रखंड की लय — नदी और आम से निर्धारित एक कृषि-कैलेंडर।' },
        blocks: [
          { title: { en: 'The Summer Market', hi: 'ग्रीष्म बाज़ार' }, text: { en: 'From late June through August the mango ripens and the name Chausa fills the fruit markets — the block’s liveliest commerce of the warm months, measured in baskets on the roadside.', hi: 'जून के अंत से अगस्त तक आम पकता है और चौसा नाम फल-बाज़ारों में छा जाता है — गर्म महीनों का प्रखंड का सबसे जीवंत व्यापार, सड़क-किनारे टोकरियों में गिना जाने वाला।' } },
          { title: { en: 'River & Field', hi: 'नदी और खेत' }, text: { en: 'The Ganga boundary and a rich agricultural interior set the block’s rhythm — paddy in the monsoon, wheat on the canal-fed plains, and the seasonal movement of pilgrims and produce along the old river road.', hi: 'गंगा की सीमा और उपजाऊ कृषि-आंतरिक हिस्सा प्रखंड की लय तय करते हैं — मानसून में धान, नहर-सिंचित मैदानों में गेहूँ, और पुराने नदी-मार्ग पर तीर्थयात्रियों व उपज की मौसमी चाल।' } },
          { title: { en: 'Season to Visit', hi: 'घूमने का मौसम' }, text: { en: 'Regional notes recommend September to April for visiting the Chausa country — the plain is at its most open in the cool months, before the heat of the mango season arrives.', hi: 'क्षेत्रीय नोट चौसा प्रदेश की यात्रा के लिए सितंबर से अप्रैल को सुझाते हैं — आम-मौसम की गर्मी से पहले, ठंडे महीनों में यह मैदान सबसे खुला रहता है।' } }
        ]
      },
      history: {
        heading: { pre: 'An Empire’s Day, ', em: { en: 'and a Fruit’s Fame', hi: 'और एक फल की ख्याति' } },
        sub: { en: 'The documented and traditional records of Chausa, told straight — what is proven, and what is only told.', hi: 'चौसा के प्रलेखित और पारंपरिक अभिलेख, सीधे रूप में — जो सिद्ध है, और जो केवल कहा जाता है।' },
        entries: [
          { period: { en: '26 June 1539', hi: '26 जून 1539' }, title: { en: 'The Battle of Chausa', hi: 'चौसा युद्ध' }, text: { en: 'Sher Shah Suri’s army met the Mughal forces of Humayun on the plains at Chausa. The battle ended in a decisive victory for Sher Shah: Humayun’s army was scattered and he himself narrowly crossed the Ganga, pursued hard by the victors. Accounts add that the harem of the defeated emperor was taken with honour — a courtesy the chroniclers of both sides remembered.', hi: 'शेरशाह सूरी की सेना चौसा के मैदान में हुमायूँ की मुग़ल सेना से भिड़ी। युद्ध शेरशाह की निर्णायक विजय पर समाप्त हुआ: हुमायूँ की सेना तितर-बितर हो गई और वह स्वयं कठिनाई से गंगा पार कर पाया, विजेता की कड़ी ख़ोज के बावजूद। विवरण जोड़ते हैं कि पराजित सम्राट के हरम को सम्मान के साथ रखा गया — एक शिष्टता जिसे दोनों पक्षों के इतिहासकारों ने याद रखा।' } },
          { period: { en: 'After 1539', hi: '1539 के बाद' }, title: { en: 'The Name on a Mango', hi: 'आम पर अंकित नाम' }, text: { en: 'Folklore holds that Sher Shah himself gave the name Chausa to a mango after his victory. It is a good story, and the variety is real — among the noted sweet mangoes of northern India — but historians have not documented any link between the block and the fruit. Told straight: the mango’s fame is certain, its origin-lore is not.', hi: 'लोक-कथा मानती है कि शेरशाह ने स्वयं अपनी विजय के बाद एक आम को चौसा नाम दिया। यह अच्छी कहानी है, और किस्म वास्तविक है — उत्तरी भारत के विख्यात मीठे आमों में से — लेकिन इतिहासकारों ने प्रखंड और फल के बीच कोई संबंध प्रलेखित नहीं किया। सीधे रूप में: आम की प्रसिद्धि निश्चित है, उसकी उत्पत्ति-कथा नहीं।' } },
          { period: { en: 'The Modern Block', hi: 'आधुनिक प्रखंड' }, title: { en: 'Town, Block and Railway', hi: 'नगर, प्रखंड और रेलवे' }, text: { en: 'Today Chausa is a town and community-development block of the Buxar sub-division, with its own railway stop on the East Central line. The bronze Rishabhadeva recovered from the region keeps a Chausa of the early medieval world in the museum at Patna.', hi: 'आज चौसा बक्सर अनुमंडल का एक नगर और विकासखंड है, जिसका पूर्व मध्य रेलवे लाइन पर अपना रेलवे पड़ाव है। इस क्षेत्र से प्राप्त ऋषभदेव की कांस्य प्रतिमा पटना में संग्रहालय में प्रारंभिक मध्ययुगीन दुनिया के चौसा को जीवित रखती है।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of ', em: { en: 'Chausa', hi: 'चौसा' } },
        sub: { en: 'The battery of maps, records and representative country views that carry the name.', hi: 'उस नाम को ढोने वाले नक्शे, अभिलेख और प्रदेश के प्रतिनिधि दृश्य।' },
        items: [
          { full: 'assets/tourism/historical/chausa.webp', alt: 'Diagram of the Battle of Chausa', cap: 'Diagram of the Battle of Chausa, 26 June 1539', credit: 'Battle plan · TheBuxar.com', wide: true },
          { full: 'assets/history/rishabhadeva-chausa.jpg', alt: 'The Chausa bronze of Rishabhadeva', cap: 'The Chausa bronze — Rishabhadeva (Patna Museum)', credit: 'Sculpture record · TheBuxar.com', tall: true },
          { full: 'assets/tourism/historical/paddy-fields.webp', alt: 'Farmlands of the Chausa block', cap: 'The farm country of the block (representative)', credit: 'Farmlands · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga along the Chausa country', cap: 'The Ganga along which the battle was fought (representative)', credit: 'Ganga · TheBuxar.com' },
          { full: 'assets/history/sher-shah-tomb-sasaram.jpg', alt: "Sher Shah Suri's tomb at Sasaram", cap: "Sher Shah's tomb at Sasaram — the victor of Chausa (representative)", credit: 'Sasaram record · TheBuxar.com' },
          { full: 'assets/tourism/historical/buxar-railway-station.webp', alt: 'Railway station on the corridor serving Chausa', cap: 'The railway corridor that serves the block', credit: 'Railway corridor · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Chausa', hi: 'चौसा' } },
        sub: { en: 'Where the block sits in the district, and its documented position.', hi: 'प्रखंड जिले में कहाँ बसा है, और इसकी प्रलेखित स्थिति।' },
        facts: [
          { label: { en: 'Position', hi: 'स्थिति' }, value: { en: 'On the bank of the Ganga · ~11 km west of Buxar town', hi: 'गंगा के तट पर · बक्सर नगर से ~11 किमी पश्चिम' } },
          { label: { en: 'Block', hi: 'प्रखंड' }, value: { en: 'Chausa block · Buxar subdivision (2011: 1,03,670 people, 82 villages)', hi: 'चौसा प्रखंड · बक्सर अनुमंडल (2011: 1,03,670 लोग, 82 गाँव)' } },
          { label: { en: 'PIN', hi: 'पिन कोड' }, value: { en: '802114', hi: '802114' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: 'The pin below marks Chausa in the schematic district map. Only published, verified coordinates are plotted.', hi: 'नीचे का पिन योजनाबद्ध जिला-नक्शे में चौसा को दिखाता है। केवल प्रकाशित, सत्यापित निर्देशांक ही अंकित किए जाते हैं।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Block', hi: 'प्रखंड पहुँचें' } },
        sub: { en: 'The documented ways into Chausa. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'चौसा में पहुँचने के प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'Chausa has a railway stop on the East Central Railway line, convenient for the battlefield and the market town. Trains and stoppages should be checked from the current timetable.', hi: 'चौसा का पूर्व मध्य रेलवे लाइन पर अपना रेलवे पड़ाव है, जो युद्ध-स्थल और बाज़ार-नगर के लिए सुविधाजनक है। ट्रेनें और ठहराव वर्तमान समय-सारणी से जाँचे जाने चाहिए।' } },
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'About 11 km west of Buxar town along the river road, the block is an easy ride from Buxar by bus, auto or car. Slight route differences appear across sources, so ask locally for the direct crossing.', hi: 'बक्सर नगर से नदी-मार्ग पर लगभग 11 किमी पश्चिम, प्रखंड बक्सर से बस, ऑटो या कार द्वारा आसान पहुँच में है। स्रोतों में मार्ग में थोड़ा अंतर दिखता है, अतः सीधे पार के लिए स्थानीय रूप से पूछें।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: 'Within the block, the market and the railway stop sit on the main road; the battlefield lies across the farm tracks beyond, so ask locally for the current way in. The mango country is walked the same way in season.', hi: 'प्रखंड के भीतर बाज़ार और रेलवे पड़ाव मुख्य मार्ग पर हैं; युद्ध-भूमि उसके आगे खेतों के रास्तों में है, अतः स्थानीय रूप से मार्ग पूछें। मौसम में आम का प्रदेश इसी तरह पैदल देखा जाता है।' } },
          { mode: { en: 'Season', hi: 'मौसम' }, icon: 'pin', text: { en: 'Visit between September and April for the open plain. Come in late June through August only if the mango markets are your errand — the heat of that season is its own affair.', hi: 'खुले मैदान के लिए सितंबर और अप्रैल के बीच जाएँ। जून के अंत से अगस्त तक केवल तभी जाएँ यदि आम-बाज़ार ही आपका काम है — उस मौसम की गर्मी अपनी ही कहानी है।' } }
        ],
        note: { en: 'The battle ground lies in working farmland, and no monument is documented in our sources. Confirm what is marked on the ground, and current route details, with local people before travelling.', hi: 'युद्ध-भूमि काम करते खेतों में स्थित है, और हमारे स्रोतों में कोई स्मारक प्रलेखित नहीं है। यात्रा से पहले स्थानीय लोगों से ज़मीन पर जो चिह्नित है और वर्तमान मार्ग-विवरण की पुष्टि कर लें।' }
      }
    },

    /* ---------------------------------------------------------------- */
    /* 05 · ITARHI                                                       */
    /* ---------------------------------------------------------------- */
    {
      slug: 'itarhi',
      url: 'explore/itarhi/',
      role: { en: 'Area · Block', hi: 'क्षेत्र · प्रखंड' },
      name: { en: 'Itarhi', hi: 'इटाढ़ी' },
      subtitle: { en: 'A largely rural block of the Buxar plains', hi: 'बक्सर के मैदान का अधिकतर ग्रामीण प्रखंड' },
      heroImage: 'assets/explore/itarhi/hero.webp',
      heroCredit: { en: 'Paddy fields near Buxar · TheBuxar.com', hi: 'बक्सर के पास धान के खेत · TheBuxar.com' },
      coords: [25.4833, 84.0131],
      coordsVerified: true,
      seo: {
        title: 'Itarhi — The Rural Block of the Buxar Plains | TheBuxar.com',
        description: "Itarhi — the largely rural nagar panchayat and community-development block of the Buxar subdivision, lying on the alluvial lowland of Bihar's wheat-growing plains."
      },
      stats: [
        { label: { en: 'Town Population (2011)', hi: 'नगर जनसंख्या (2011)' }, value: { en: '10,275', hi: '10,275' } },
        { label: { en: 'Block Population (2011)', hi: 'प्रखंड जनसंख्या (2011)' }, value: { en: '~1,70,629', hi: '~1,70,629' } },
        { label: { en: 'Panchayats', hi: 'पंचायतें' }, value: { en: '15', hi: '15' } },
        { label: { en: 'PIN Code', hi: 'पिन कोड' }, value: { en: '802122', hi: '802122' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Itarhi is a nagar panchayat and community-development block of the Buxar subdivision. The land is low and alluvial, given over almost entirely to the harvest cycle — and the district of Buxar ranks among the best wheat-growing areas of Bihar on just such ground.', hi: 'इटाढ़ी बक्सर अनुमंडल का एक नगर पंचायत और विकासखंड है। भूमि नीची और नदी-निक्षिप्त है, जो लगभग पूर्णतः फ़सल-चक्र को समर्पित है — और बक्सर जिला ठीक ऐसी ही ज़मीन के कारण बिहार के सर्वोत्तम गेहूँ-क्षेत्रों में गिना जाता है।' },
          { en: 'Its roads now carry the block’s connection to the district — the corridor into Buxar town on one side and the run down to Dhansoi on the other — while a halt under the name Itarhi Crossing has been proposed in recent rail development plans. The block keeps its old face: fields, market days, and the long plain stretching to the horizon.', hi: 'इसकी सड़कें अब प्रखंड का जिले से संबंध ढोती हैं — एक ओर बक्सर नगर का मार्ग, दूसरी ओर धनसोई की ओर जाता रास्ता — जबकि इटाढ़ी क्रॉसिंग के नाम से एक पड़ाव हाल की रेल-विकास योजनाओं में प्रस्तावित किया गया है। प्रखंड अपना पुराना चेहरा रखता है: खेत, बाज़ार के दिन, और क्षितिज तक फैला लंबा मैदान।' }
        ],
        figure: {
          src: 'assets/tourism/historical/buxar-railway-station.webp',
          alt: "The district's rail corridor at Buxar (representative)",
          caption: { en: 'The district’s rail corridor — along which a crossing for Itarhi has been proposed in recent plans (representative).', hi: 'जिले का रेल-पथ — जिसके साथ इटाढ़ी के लिए एक क्रॉसिंग हाल की योजनाओं में प्रस्तावित है (प्रतिनिधि)।' }
        },
        note: { en: 'Figures are from the Census of 2011, district records and the elevation and scheme references indicated in the text — all of them verifiable. Surface travel details must still be checked locally.', hi: 'आँकड़े 2011 की जनगणना, जिला अभिलेखों पाठ में संकेतित ऊँचाई और योजना-संदर्भों के हैं — सभी सत्यापन योग्य। ज़मीनी यात्रा-विवरण अभी भी स्थानीय रूप से जाँचे जाने चाहिए।' }
      },
      why: {
        heading: { pre: 'The Wheat ', em: { en: 'Belt', hi: 'पट्टी' } },
        sub: { en: "Itarhi matters through the ground itself — the alluvial lowland that places the district among Bihar's great wheat areas — and through the roads and rail that are tying that country to the town.", hi: 'इटाढ़ी भूमि से ही महत्वपूर्ण है — वह नदी-निक्षिप्त समतल भूमि जो जिले को बिहार के महान गेहूँ-क्षेत्रों में रखती है — और उन सड़कों व रेल से जो उस प्रदेश को नगर से जोड़ रही हैं।' },
        tiles: [
          { chip: { en: 'Nature', hi: 'प्रकृति' }, title: { en: 'The Alluvial Lowland', hi: 'नदी-निक्षिप्त तराई' }, text: { en: 'The block lies low and flat on the plain, at an elevation of the order of 70 metres. Such ground is the making of the district’s wheat harvest — the working reason Itarhi is what it is.', hi: 'प्रखंड मैदान पर नीचा और समतल बसा है, जिसकी ऊँचाई लगभग 70 मीटर कोटि की है। ऐसी ही ज़मीन जिले की गेहूँ-फ़सल बनाती है — वह कार्यकारी कारण जिससे इटाढ़ी वह है जो वह है।' } },
          { chip: { en: 'Commerce', hi: 'वाणिज्य' }, title: { en: 'The Roads', hi: 'सड़कें' }, text: { en: 'The through-ways of the block — the road into Buxar town and the Itarhi–Dhansoi road across the plain — carry its grain, its people and its market days into the district’s economy.', hi: 'प्रखंड के मार्ग — बक्सर नगर की ओर जाने वाली सड़क और मैदान पार करती इटाढ़ी–धनसोई सड़क — इसका अनाज, इसके लोग और इसके बाज़ार-दिन जिले की अर्थव्यवस्था में ले जाते हैं।' } },
          { chip: { en: 'Connectivity', hi: 'संपर्क' }, title: { en: 'The Proposed Crossing', hi: 'प्रस्तावित क्रॉसिंग' }, text: { en: 'A halt under the name Itarhi Crossing has figured in recent railway development plans for the area. It is a reported proposal, not a completed station — a plan on paper that would put the block on the rail map.', hi: 'इटाढ़ी क्रॉसिंग के नाम से एक पड़ाव हाल की क्षेत्रीय रेल-विकास योजनाओं में शामिल रहा है। यह प्रस्ताव है, पूर्ण स्टेशन नहीं — काग़ज़ पर एक योजना जो प्रखंड को रेल-नक्शे पर ला सकती है।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of ', em: { en: 'Itarhi', hi: 'इटाढ़ी' } },
        sub: { en: 'The documented landmarks of the block — its country, its roads and the crossing proposed for it.', hi: 'प्रखंड के प्रलेखित स्थलचिह्न — इसका प्रदेश, इसकी सड़कें, और इसके लिए प्रस्तावित क्रॉसिंग।' },
        items: [
          { chip: { en: 'Country · Farmland', hi: 'प्रदेश · खेत' }, title: { en: 'The Flat Farm Country', hi: 'समतल कृषि-प्रदेश' }, loc: { en: 'Itarhi block · the alluvial plain', hi: 'इटाढ़ी प्रखंड · नदी-मैदान' }, text: { en: 'An almost entirely rural block — low, level land under the rotation of paddy and wheat, crossed by lanes whose rhythm the traveller shares with the harvest.', hi: 'लगभग पूर्णतः ग्रामीण प्रखंड — नीची, समतल भूमि जो धान-गेहूँ के चक्र के अधीन है, और जिसे पगडंडियाँ पार करती हैं जिनकी लय यात्री फ़सल के साथ बाँटता है।' } },
          { chip: { en: 'Roads · Connectivity', hi: 'सड़कें · संपर्क' }, title: { en: 'The Buxar–Itarhi and Itarhi–Dhansoi Roads', hi: 'बक्सर–इटाढ़ी और इटाढ़ी–धनसोई सड़कें' }, loc: { en: 'Through the block in two directions', hi: 'प्रखंड से होकर दो दिशाओं में' }, text: { en: 'The district’s road network reaches the block by two named ways — the road into Buxar town, and the Itarhi–Dhansoi road that runs the plain across. These corridors move the block’s produce and its commuters.', hi: 'जिले का सड़क-जाल प्रखंड तक दो नामित मार्गों से पहुँचता है — बक्सर नगर की सड़क, और मैदान पार करती इटाढ़ी–धनसोई सड़क। ये गलियारे प्रखंड की उपज और उसके यात्रियों को चलाते हैं।' } },
          { chip: { en: 'Railway · Proposed', hi: 'रेलवे · प्रस्तावित' }, title: { en: 'Itarhi Crossing', hi: 'इटाढ़ी क्रॉसिंग' }, loc: { en: 'Proposed halt · reported in rail development plans', hi: 'प्रस्तावित पड़ाव · रेल-विकास योजनाओं में बताया गया' }, text: { en: 'A halt under this name has been proposed in recent railway plans for the region. As our sources leave it, it is an intention on paper — not a working station, and to be confirmed before use.', hi: 'इस नाम का एक पड़ाव हाल की क्षेत्रीय रेल-योजनाओं में प्रस्तावित किया गया है। हमारे स्रोतों के अनुसार यह काग़ज़ पर एक इरादा है — कार्यरत स्टेशन नहीं, और उपयोग से पहले पुष्टि योग्य।' }, note: { en: 'Photography pending — this entry will carry its own original imagery after verification.', hi: 'फ़ोटो लंबित — सत्यापन के बाद इस प्रविष्टि में अपनी मूल तस्वीरें जोड़ी जाएँगी।' } }
        ]
      },
      culture: {
        heading: { pre: 'A Life of ', em: { en: 'Fields', hi: 'खेत' } },
        sub: { en: 'The rhythms of the Itarhi plain — a rural calendar written in water, wheat and market days.', hi: 'इटाढ़ी मैदान की लय — पानी, गेहूँ और बाज़ार-दिनों में लिखा ग्रामीण कैलेंडर।' },
        blocks: [
          { title: { en: 'The Harvest Year', hi: 'फ़सल का वर्ष' }, text: { en: 'The block is almost wholly rural, and its year is the rotation — paddy in the rains, wheat on the winter plain. The low, level ground does its one great work: it feeds.', hi: 'प्रखंड लगभग पूर्णतः ग्रामीण है, और इसका वर्ष चक्र है — वर्षा में धान, सर्दी के मैदान पर गेहूँ। नीची, समतल ज़मीन अपना एक महान काम करती है: खिलाती है।' } },
          { title: { en: 'Market Days', hi: 'बाज़ार के दिन' }, text: { en: 'The roads — into Buxar town and across toward Dhansoi — are the block’s artery to the market. Grain and farm goods move along them on the old market rounds of the sub-division.', hi: 'सड़कें — बक्सर नगर की ओर और धनसोई की ओर — प्रखंड की बाज़ार-धमनी हैं। अनाज और कृषि उपज अनुमंडल के पुराने बाज़ार-चक्रों के अनुसार इनसे गुजरती है।' } },
          { title: { en: 'Season to Visit', hi: 'घूमने का मौसम' }, text: { en: 'The plain is at its comfortable best from about September to April. Summer is the season of the standing crops and the heat — beautiful in its way, punishing on its roads.', hi: 'मैदान मोटे तौर पर सितंबर से अप्रैल तक आरामदायक रहता है। गर्मी खड़ी फ़सलों और ताप का मौसम है — अपने तरीके से सुंदर, पर अपनी सड़कों पर कठोर।' } }
        ]
      },
      history: {
        heading: { pre: 'Records of a ', em: { en: 'Rural Block', hi: 'ग्रामीण प्रखंड' } },
        sub: { en: 'What the block’s records will bear — town, roads, and one proposal on paper.', hi: 'प्रखंड के अभिलेख जो सह सकते हैं — नगर, सड़कें, और काग़ज़ पर एक प्रस्ताव।' },
        entries: [
          { period: { en: 'The Block', hi: 'प्रखंड' }, title: { en: 'A Nagar Panchayat and Block of Buxar', hi: 'बक्सर का नगर पंचायत एवं प्रखंड' }, text: { en: 'The Census of 2011 counts the town at 10,275 people and the block at roughly 1,70,629, spread over fifteen panchayats — a rural unit of the Buxar subdivision on the district’s lowland.', hi: '2011 की जनगणना नगर को 10,275 लोगों और प्रखंड को लगभग 1,70,629, पंद्रह पंचायतों में फैला दर्ज करती है — जिले की तराई पर बक्सर अनुमंडल की एक ग्रामीण इकाई।' } },
          { period: { en: 'The Roads', hi: 'सड़कें' }, title: { en: 'The Two Ways', hi: 'दो मार्ग' }, text: { en: 'The block’s documented connections are the Buxar–Itarhi road and the Itarhi–Dhansoi road — two named ways that set the country in motion, carrying the farm trade of the sub-division.', hi: 'प्रखंड के प्रलेखित संबंध बक्सर–इटाढ़ी सड़क और इटाढ़ी–धनसोई सड़क हैं — दो नामित मार्ग जो प्रदेश को गतिशील रखते हैं और अनुमंडल का कृषि-व्यापार ढोते हैं।' } },
          { period: { en: 'Reported', hi: 'बताया गया' }, title: { en: 'The Proposed Crossing', hi: 'प्रस्तावित क्रॉसिंग' }, text: { en: 'Itarhi Crossing has been named in recent rail development plans for the region. Until the work is done and running, it belongs to this page as a plan — noted, not promised.', hi: 'इटाढ़ी क्रॉसिंग हाल की क्षेत्रीय रेल-विकास योजनाओं में नामित है। जब तक काम पूरा होकर नहीं चलता, यह इस पृष्ठ पर एक योजना के रूप में है — संकेतित, वादा नहीं।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of ', em: { en: 'Itarhi', hi: 'इटाढ़ी' } },
        sub: { en: 'The country and corridors that make the block.', hi: 'प्रखंड को बनाने वाला प्रदेश और उसके गलियारे।' },
        items: [
          { full: 'assets/tourism/historical/paddy-fields.webp', alt: 'Farm country of the Itarhi plain', cap: 'The flat farm country of the block (representative)', credit: 'Farmlands · TheBuxar.com', wide: true },
          { full: 'assets/history/modern-buxar.jpg', alt: 'Roads of the modern district', cap: 'The road country of the modern district (representative)', credit: 'Modern Buxar · TheBuxar.com', tall: true },
          { full: 'assets/tourism/historical/buxar-railway-station.webp', alt: 'Railway corridor serving the district', cap: 'The rail corridor of the district (representative)', credit: 'Rail corridor · TheBuxar.com' },
          { full: 'assets/tourism/historical/buxar-town-1828.webp', alt: 'Historical view of Buxar town', cap: "The district town the block's roads run into (representative)", credit: 'Historical view · TheBuxar.com' },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga along the district', cap: 'The Ganga that set the lowland (representative)', credit: 'Ganga · TheBuxar.com' },
          { full: 'assets/history/naulakha-mandir-buxar.jpg', alt: 'Naulakha Mandir at Buxar', cap: "Landmark of the district's spiritual heritage (representative)", credit: 'Heritage · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Itarhi', hi: 'इटाढ़ी' } },
        sub: { en: 'Where the block sits in the subdivision, and its documented position.', hi: 'प्रखंड अनुमंडल में कहाँ बसा है, और इसकी प्रलेखित स्थिति।' },
        facts: [
          { label: { en: 'Position', hi: 'स्थिति' }, value: { en: "Buxar subdivision · the alluvial lowland north of the district's river line", hi: 'बक्सर अनुमंडल · जिले की नदी-रेखा के उत्तर में नदी-मैदान' } },
          { label: { en: 'Block', hi: 'प्रखंड' }, value: { en: 'Itarhi block (2011: ~1,70,629 people, 15 panchayats)', hi: 'इटाढ़ी प्रखंड (2011: ~1,70,629 लोग, 15 पंचायतें)' } },
          { label: { en: 'PIN · Elevation', hi: 'पिन · ऊँचाई' }, value: { en: '802122 · ~70 m', hi: '802122 · ~70 मी' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: 'The pin below marks the verified coordinate of the block in the schematic district map.', hi: 'नीचे का पिन योजनाबद्ध जिला-नक्शे में प्रखंड के सत्यापित निर्देशांक को दिखाता है।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Block', hi: 'प्रखंड पहुँचें' } },
        sub: { en: 'The documented ways into Itarhi. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'इटाढ़ी में पहुँचने के प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'The block is served by the Buxar–Itarhi road from the town side and the Itarhi–Dhansoi road across the plain. Distances and surface conditions should be confirmed locally, as always on farm roads.', hi: 'प्रखंड नगर की ओर से बक्सर–इटाढ़ी सड़क और मैदान पार करती इटाढ़ी–धनसोई सड़क से जुड़ा है। हमेशा की तरह कृषि-सड़कों पर दूरियाँ और सतह की स्थिति स्थानीय रूप से पुष्टि करें।' } },
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'A halt at Itarhi Crossing has been proposed in rail plans, but is not a working station in our sources. Rail visitors should use Buxar station on the main line and come on by road until a running halt is confirmed.', hi: 'इटाढ़ी क्रॉसिंग पर पड़ाव रेल-योजनाओं में प्रस्तावित है, पर हमारे स्रोतों में कार्यरत स्टेशन नहीं है। रेल-यात्री मुख्य लाइन पर बक्सर स्टेशन का उपयोग करें और कार्यरत पड़ाव की पुष्टि तक सड़क से आएँ।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: "The block is served from the town side by road; market villages beyond leave the district road on local lanes and bus routes. With the new corridor still taking shape, confirm the day's route locally before setting out.", hi: 'प्रखंड नगर की ओर से सड़क द्वारा जुड़ा है; आगे के बाज़ार-गाँव जिला मार्ग से स्थानीय गलियों और बस मार्गों पर जाते हैं। नया मार्ग अभी बन रहा है, अतः निकलने से पहले उस दिन का रास्ता स्थानीय रूप से पुष्टि करें।' } },
          { mode: { en: 'Season', hi: 'मौसम' }, icon: 'pin', text: { en: 'Visit the lowland between about September and April. The winter plain, green under these alluvial flats, is the true season of the block.', hi: 'तराई में लगभग सितंबर और अप्रैल के बीच जाएँ। इन नदी-क्षेत्रों के नीचे की हरी सर्दी का मैदान ही प्रखंड का सच्चा मौसम है।' } }
        ],
        note: { en: 'The proposed rail halt named in our sources is not yet a working station. Confirm current rail service, road conditions and route choices locally before travelling.', hi: 'हमारे स्रोतों में नामित प्रस्तावित रेल-पड़ाव अभी कार्यरत स्टेशन नहीं है। यात्रा से पहले वर्तमान रेल सेवा, सड़क की स्थिति और मार्ग-विकल्प स्थानीय रूप से पुष्टि करें।' }
      }
    },

    /* ---------------------------------------------------------------- */
    /* 06 · RAJPUR                                                       */
    /* ---------------------------------------------------------------- */
    {
      slug: 'rajpur',
      url: 'explore/rajpur/',
      role: { en: 'Area · Block', hi: 'क्षेत्र · प्रखंड' },
      name: { en: 'Rajpur', hi: 'राजपुर' },
      subtitle: { en: 'The wide rural flank of the district’s south-east', hi: 'जिले के दक्षिण-पूर्व की विस्तृत ग्रामीण भूमि' },
      heroImage: 'assets/explore/rajpur/hero.jpg',
      heroCredit: { en: 'Paddy fields near Buxar · TheBuxar.com', hi: 'बक्सर के पास धान के खेत · TheBuxar.com' },
      coords: null,
      coordsVerified: false,
      seo: {
        title: 'Rajpur — The Populous Plain of Buxar | TheBuxar.com',
        description: 'Rajpur — one of the most populous rural blocks of Buxar district — more than two lakh people across over two hundred villages and nineteen gram panchayats, and the name of a reserved (SC) assembly constituency.'
      },
      stats: [
        { label: { en: 'Block Population (2011)', hi: 'प्रखंड जनसंख्या (2011)' }, value: { en: '2,13,534', hi: '2,13,534' } },
        { label: { en: 'Gram Panchayats', hi: 'ग्राम पंचायतें' }, value: { en: '19', hi: '19' } },
        { label: { en: 'Villages (2011)', hi: 'गाँव (2011)' }, value: { en: '236', hi: '236' } },
        { label: { en: 'Sex Ratio (2011)', hi: 'लिंगानुपात (2011)' }, value: { en: '925', hi: '925' } }
      ],
      intro: {
        paragraphs: [
          { en: 'Rajpur is a community-development block of the Buxar subdivision and one of the most populous rural areas of the district. The Census of 2011 counted over two lakh people in the block — more than two hundred villages gathered under nineteen gram panchayats — living on a broad flank of the plain given over to paddy and wheat.', hi: 'राजपुर बक्सर अनुमंडल का एक विकासखंड है और जिले के सबसे जन-बहुल ग्रामीण क्षेत्रों में से एक है। 2011 की जनगणना ने प्रखंड में दो लाख से अधिक लोगों को गिना — उन्नीस ग्राम पंचायतों के नीचे दो सौ से अधिक गाँव — जो धान और गेहूँ को समर्पित मैदान के विस्तृत हिस्से पर रहते हैं।' },
          { en: 'The name also stands on the electoral map: Rajpur is a reserved (SC) assembly constituency, taking one of the district’s oldest civic divisions out of the village and into the polling book. It is this double life — a census landmark, and a constituency name — that this page carries.', hi: 'यह नाम चुनावी नक्शे पर भी खड़ा है: राजपुर अनुसूचित जाति (SC) के लिए आरक्षित विधानसभा क्षेत्र है, जो जिले के पुराने नागरिक विभाजनों में से एक को गाँव से निकालकर मतदान की पुस्तिका में ले जाता है। यह दोहरा जीवन — एक जनगणना-आंकड़ा, और एक निर्वाचन-क्षेत्र का नाम — यह पृष्ठ इसे ही ढोता है।' }
        ],
        figure: {
          src: 'assets/history/heritage-03.jpg',
          alt: 'The heritage country of the Buxar plain (representative)',
          caption: { en: 'The heritage country of the Buxar plain — the wider land of which Rajpur is a part (representative).', hi: 'बक्सर मैदान की विरासत-भूमि — वह बड़ा प्रदेश जिसका हिस्सा राजपुर है (प्रतिनिधि)।' }
        },
        note: { en: 'Figures are from the Census of 2011 and electoral records, all of them published sources.', hi: 'आँकड़े 2011 की जनगणना और चुनावी अभिलेखों से हैं, जो सभी प्रकाशित स्रोत हैं।' }
      },
      why: {
        heading: { pre: 'A Census, a Seat, ', em: { en: 'a Plain', hi: 'एक मैदान' } },
        sub: { en: "Rajpur matters through the numbers that make it the district's populous flank, and through the reserved seat that carries its name into the assembly.", hi: 'राजपुर उन आँकड़ों से महत्वपूर्ण है जो इसे जिले का जन-बहुल हिस्सा बनाते हैं, और उस आरक्षित सीट से जो इसका नाम विधानसभा तक ले जाती है।' },
        tiles: [
          { chip: { en: 'Demography', hi: 'जनसंख्या विज्ञान' }, title: { en: 'A Populous Plain', hi: 'जन-बहुल मैदान' }, text: { en: 'Over two lakh residents in the block at the 2011 census, spread across 236 villages and 19 gram panchayats — a rural scale that puts Rajpur among the heaviest blocks of the district.', hi: '2011 की जनगणना में प्रखंड में दो लाख से अधिक निवासी, 236 गाँवों और 19 ग्राम पंचायतों में फैले — एक ग्रामीण आकार जो राजपुर को जिले के सबसे भारी प्रखंडों में रखता है।' } },
          { chip: { en: 'Governance', hi: 'शासन' }, title: { en: 'A Reserved Seat', hi: 'आरक्षित सीट' }, text: { en: 'The block gives its name to the Rajpur (SC) assembly constituency — a seat reserved for the Scheduled Castes, one of the district’s named divisions of the state’s electoral map.', hi: 'प्रखंड अपना नाम राजपुर (SC) विधानसभा क्षेत्र को देता है — अनुसूचित जातियों के लिए आरक्षित सीट, जो राज्य के चुनावी नक्शे का एक नामित विभाजन है।' } },
          { chip: { en: 'Geography', hi: 'भूगोल' }, title: { en: "The District's Flank", hi: 'जिले का पार्श्व' }, text: { en: 'Set on the broad south-eastern run of Buxar, the block shares its borders with the surrounding blocks of the subdivision — the field country that frames the whole district.', hi: 'बक्सर के विस्तृत दक्षिण-पूर्वी हिस्से में बसा प्रखंड अनुमंडल के आस-पास के प्रखंडों से सीमा बाँटता है — वह खेत-प्रदेश जो पूरे जिले को घेरता है।' } }
        ]
      },
      famous: {
        heading: { pre: 'The Places of ', em: { en: 'Rajpur', hi: 'राजपुर' } },
        sub: { en: "The documented faces of the block — its broad villages and the name it lends the electoral map.", hi: 'प्रखंड के प्रलेखित चेहरे — इसके विस्तृत गाँव और वह नाम जो यह चुनावी नक्शे को देता है।' },
        items: [
          { img: { src: 'assets/tourism/historical/paddy-fields.webp', alt: 'The broad farm plain of the Rajpur block (representative)' }, chip: { en: 'Country · Villages', hi: 'प्रदेश · गाँव' }, title: { en: 'The Broad Plain of 236 Villages', hi: '236 गाँवों का विस्तृत मैदान' }, loc: { en: 'Rajpur block · the south-eastern flank of Buxar', hi: 'राजपुर प्रखंड · बक्सर का दक्षिण-पूर्वी हिस्सा' }, text: { en: 'The scale of the block is its landmark: more than two hundred villages under nineteen gram panchayats, living on level ground worked by paddy and wheat — a district within the district, at village scale.', hi: 'प्रखंड का आकार ही इसका स्थलचिह्न है: उन्नीस ग्राम पंचायतों के नीचे दो सौ से अधिक गाँव, धान-गेहूँ से जुते समतल मैदान पर — गाँव के पैमाने पर, जिले के भीतर एक जिला।' } },
          { img: { src: 'assets/history/archive-06.jpg', alt: 'The electoral records of the modern state (representative)' }, chip: { en: 'Assembly · SC Reserved', hi: 'विधानसभा · SC आरक्षित' }, title: { en: 'The Rajpur (SC) Constituency', hi: 'राजपुर (SC) निर्वाचन क्षेत्र' }, loc: { en: 'Named for the block · a reserved seat of the Bihar assembly', hi: 'प्रखंड के नाम पर · बिहार विधानसभा की आरक्षित सीट' }, text: { en: 'Rajpur stands in the state’s electoral roll as a reserved assembly constituency for the Scheduled Castes — the name of the block carried into the civic ledger of the constituency.', hi: 'राजपुर राज्य की मतदाता सूची में अनुसूचित जातियों के लिए आरक्षित विधानसभा क्षेत्र के रूप में खड़ा है — प्रखंड का नाम निर्वाचन-क्षेत्र की नागरिक पुस्तिका में ले जाया गया।' }, note: { en: 'Boundary and status details of the constituency change with each delimitation — always confirm against the current electoral roll.', hi: 'निर्वाचन-क्षेत्र की सीमा और स्थिति विवरण हर परिसीमन के साथ बदलते हैं — हमेशा वर्तमान मतदाता सूची से पुष्टि करें।' } }
        ],
        placeholder: { en: 'The named landmarks of this block are the ones worth the detour. Know another? Send it to us and it goes on the page.', hi: 'इस प्रखंड के नामित स्थलचिह्न वही हैं जिनके लिए चक्कर लगाना उचित है। कोई और जानते हैं? हमें भेजें और यह पृष्ठ पर जुड़ जाएगा।' }
      },
      culture: {
        heading: { pre: 'Village ', em: { en: 'Scale', hi: 'पैमाना' } },
        sub: { en: 'The culture of the block is the culture of its villages — a plain that works, seasons, and gathers at the panchayat.', hi: 'प्रखंड की संस्कृति उसके गाँवों की संस्कृति है — एक मैदान जो काम करता है, मौसम देखता है, और पंचायत पर इकट्ठा होता है।' },
        blocks: [
          { title: { en: 'The Village Year', hi: 'गाँव का वर्ष' }, text: { en: 'With more than two hundred villages in nineteen panchayats, the block’s life is written at the smallest scale — harvest, monsoon, and the weekly market of each village cluster.', hi: 'उन्नीस पंचायतों में दो सौ से अधिक गाँवों के साथ प्रखंड का जीवन सबसे छोटे पैमाने पर लिखा जाता है — फ़सल, मानसून, और हर गाँव-समूह का साप्ताहिक बाज़ार।' } },
          { title: { en: 'Paddy & Wheat', hi: 'धान और गेहूँ' }, text: { en: 'Rain-fed paddy and the winter wheat of the plain are the block’s two seasons of work — the rotation that feeds two lakh people and the country beyond.', hi: 'वर्षा-निर्भर धान और मैदान का सर्दी-गेहूँ प्रखंड के काम के दो मौसम हैं — वह चक्र जो दो लाख लोगों और आगे के प्रदेश को खिलाता है।' } },
          { title: { en: 'Season to Visit', hi: 'घूमने का मौसम' }, text: { en: 'The block opens at its kindest between about September and April. This is working country — travellers are expected to move gently through the fields and lanes.', hi: 'प्रखंड लगभग सितंबर और अप्रैल के बीच अपने सबसे मधुर रूप में खुलता है। यह काम करती हुई भूमि है — यात्रियों से अपेक्षा है कि वे खेतों और गलियों में धीरे चलें।' } }
        ]
      },
      history: {
        heading: { pre: 'Records of a ', em: { en: 'Block and Seat', hi: 'प्रखंड और सीट' } },
        sub: { en: 'The documented chapters of Rajpur — its census record, its electoral seat, and its place in the district today.', hi: 'राजपुर के प्रलेखित अध्याय — इसका जनगणना-अभिलेख, इसकी चुनावी सीट, और आज जिले में इसका स्थान।' },
        entries: [
          { period: { en: '2011', hi: '2011' }, title: { en: 'The Census Record', hi: 'जनगणना अभिलेख' }, text: { en: 'The Census of 2011 counts Rajpur at 2,13,534 people across 236 villages — among the most populous blocks of Buxar — with a recorded sex ratio of 925 females per thousand males.', hi: '2011 की जनगणना राजपुर को 236 गाँवों में 2,13,534 लोग दर्ज करती है — बक्सर के सबसे जन-बहुल प्रखंडों में — जिसमें दर्ज लिंगानुपात 925 महिलाएँ प्रति हज़ार पुरुष है।' } },
          { period: { en: 'Electoral history', hi: 'चुनावी इतिहास' }, title: { en: 'The Reserved Seat', hi: 'आरक्षित सीट' }, text: { en: 'Rajpur has carried its name into the electoral division as a Scheduled Caste-reserved assembly constituency. Its boundary and reservation have followed the state’s delimitations; the current position should always be read against the latest electoral roll.', hi: 'राजपुर ने चुनावी विभाजन में अपना नाम अनुसूचित जाति-आरक्षित विधानसभा क्षेत्र के रूप में ढोया है। इसकी सीमा और आरक्षण राज्य के परिसीमनों के पीछे चले हैं; वर्तमान स्थिति हमेशा नवीनतम मतदाता सूची के सामने पढ़ी जानी चाहिए।' } },
          { period: { en: 'Today', hi: 'आज' }, title: { en: 'The Block of Buxar', hi: 'बक्सर का प्रखंड' }, text: { en: 'Today Rajpur is a block of the Buxar subdivision, sharing its borders with the surrounding blocks of the district’s farm flank. Its governance runs through its nineteen gram panchayats.', hi: 'आज राजपुर बक्सर अनुमंडल का एक प्रखंड है, जो जिले के कृषि-पार्श्व के आस-पास के प्रखंडों से सीमा बाँटता है। इसका शासन उन्नीस ग्राम पंचायतों से चलता है।' } }
        ]
      },
      gallery: {
        heading: { pre: 'Views of ', em: { en: 'Rajpur', hi: 'राजपुर' } },
        sub: { en: 'The plain, the records and the heritage of the district that frame the block.', hi: 'प्रखंड को घेरने वाला मैदान, अभिलेख और जिले की विरासत।' },
        items: [
          { full: 'assets/tourism/historical/paddy-fields.webp', alt: 'Farm plain of Rajpur country', cap: 'The broad farm plain of the block (representative)', credit: 'Farmlands · TheBuxar.com', wide: true },
          { full: 'assets/history/archive-06.jpg', alt: 'Modern state records', cap: 'The records of the modern state (representative)', credit: 'Archive record · TheBuxar.com', tall: true },
          { full: 'assets/tourism/spiritual/ganga-sunrise.webp', alt: 'The Ganga along the district', cap: 'The Ganga that borders the district (representative)', credit: 'Ganga · TheBuxar.com' },
          { full: 'assets/tourism/historical/naulakha-mandir.webp', alt: 'Naulakha Mandir at Buxar', cap: "A landmark of the district's heritage (representative)", credit: 'Heritage · TheBuxar.com' },
          { full: 'assets/history/modern-buxar.jpg', alt: 'Modern roads of Buxar', cap: 'The town the block trades toward (representative)', credit: 'Modern Buxar · TheBuxar.com' },
          { full: 'assets/history/heritage-02.jpg', alt: 'Heritage views of Buxar country', cap: 'The heritage country of Buxar (representative)', credit: 'Heritage · TheBuxar.com', wide: true }
        ]
      },
      location: {
        heading: { pre: 'Finding ', em: { en: 'Rajpur', hi: 'राजपुर' } },
        sub: { en: 'Where the block sits in the district, and what is documented of its position.', hi: 'प्रखंड जिले में कहाँ बसा है, और इसकी स्थिति में क्या प्रलेखित है।' },
        facts: [
          { label: { en: 'Position', hi: 'स्थिति' }, value: { en: 'South-eastern flank of Buxar district · Buxar subdivision', hi: 'बक्सर जिले का दक्षिण-पूर्वी हिस्सा · बक्सर अनुमंडल' } },
          { label: { en: 'Block', hi: 'प्रखंड' }, value: { en: 'Rajpur block · 19 gram panchayats · 236 villages (2011)', hi: 'राजपुर प्रखंड · 19 ग्राम पंचायतें · 236 गाँव (2011)' } },
          { label: { en: 'Constituency', hi: 'निर्वाचन क्षेत्र' }, value: { en: 'Rajpur (SC) assembly constituency', hi: 'राजपुर (SC) विधानसभा क्षेत्र' } },
          { label: { en: 'District', hi: 'जिला' }, value: { en: 'Buxar', hi: 'बक्सर' } },
          { label: { en: 'State', hi: 'राज्य' }, value: { en: 'Bihar', hi: 'बिहार' } }
        ],
        mapNote: { en: "Rajpur is shown in the legend of the schematic district map. Distances and travel times between blocks vary with season and road condition, so confirm them locally before setting out.", hi: 'राजपुर योजनाबद्ध जिला-नक़्शे की लीजेंड में दिखाया गया है। प्रखंडों के बीच की दूरी और यात्रा समय मौसम व सड़क की हालत के अनुसार बदलते हैं, इसलिए निकलने से पहले स्थानीय रूप से पुष्टि करें।' }
      },
      visit: {
        heading: { pre: 'How to ', em: { en: 'Reach the Block', hi: 'प्रखंड पहुँचें' } },
        sub: { en: 'The documented ways toward Rajpur. Timings and fares are deliberately not quoted — they change, and they must be checked locally.', hi: 'राजपुर की ओर प्रलेखित मार्ग। समय और किराये जानबूझकर नहीं दिए गए — वे बदलते रहते हैं, और स्थानीय रूप से जाँचे जाने चाहिए।' },
        rows: [
          { mode: { en: 'By Road', hi: 'सड़क द्वारा' }, icon: 'road', text: { en: 'The block is reached through the road network of the Buxar subdivision, out of Buxar town across the farm flank. Distances, turn-offs and surface conditions should always be confirmed locally before travel.', hi: 'प्रखंड बक्सर अनुमंडल के सड़क-जाल से होकर, बक्सर नगर से कृषि-पार्श्व पार करते हुए पहुँचा जाता है। यात्रा से पहले दूरियाँ, मोड़ और सड़क की स्थिति हमेशा स्थानीय रूप से पुष्टि करें।' } },
          { mode: { en: 'By Rail', hi: 'रेल द्वारा' }, icon: 'rail', text: { en: 'No station of the block is documented in our verified sources. Visitors by train should use Buxar station on the main line and continue to the block by road.', hi: 'हमारे सत्यापित स्रोतों में प्रखंड का कोई स्टेशन प्रलेखित नहीं है। रेल-यात्री मुख्य लाइन पर बक्सर स्टेशन का उपयोग करें और सड़क से प्रखंड की ओर बढ़ें।' } },
          { mode: { en: 'Local', hi: 'स्थानीय' }, icon: 'pin', text: { en: "The block is worked through the subdivision's road network; panchayat villages sit behind on local lanes, and short bus and auto hops connect the markets. These are working routes, changing with the season — check them locally on the day.", hi: 'प्रखंड अनुमंडल की सड़क-व्यवस्था से जुड़ा है; पंचायत-गाँव पीछे स्थानीय गलियों पर हैं, और छोटी बस तथा ऑटो चालें बाज़ारों को जोड़ती हैं। ये कामकाजी मार्ग हैं, जो मौसम के अनुसार बदलते हैं — दिन में स्थानीय रूप से पूछ लें।' } },
          { mode: { en: 'Season', hi: 'मौसम' }, icon: 'pin', text: { en: 'Between September and April the block is at its most approachable. This is a working, lived plain — travel it with the caution due to any farm country.', hi: 'सितंबर और अप्रैल के बीच प्रखंड सबसे सुलभ रहता है। यह एक काम करती, बसी हुई भूमि है — किसी भी कृषि-प्रदेश के योग्य सावधानी के साथ यात्रा करें।' } }
        ],
        note: { en: 'Rajpur is a rural block — travel for the country and its villages rather than a single landmark, and confirm routes and road conditions locally before you set out.', hi: 'राजपुर एक ग्रामीण प्रखंड है — किसी एक स्थलचिह्न के बजाय प्रदेश और उसके गाँवों के लिए यात्रा करें, और निकलने से पहले मार्ग व सड़क की स्थिति स्थानीय रूप से पुष्टि करें।' }
      }
    }
  ]

  /* DISTRICT EXPLORER — shown on the hub and repeated on area pages. */
  L.districtExplorer = {
    label: { en: 'District Explorer', hi: 'जिला खोजक' },
    title: { en: 'From the Ganga Town to the Far Plains', hi: 'गंगा-नगर से दूर के मैदानों तक' },
    titlePre: { en: 'From the Ganga Town', hi: 'गंगा-नगर से' },
    titleEm: { en: 'to the Far Plains', hi: 'दूर के मैदानों तक' },
    text: { en: 'Two towns and four areas — the six places that map the district of Buxar.', hi: 'दो नगर और चार क्षेत्र — वे छह स्थान जो बक्सर जिले का नक्शा बनाते हैं।' },
    back: { en: 'All Places', hi: 'सभी स्थान' },
    galleryTap: { en: 'Tap any image to enlarge.', hi: 'बड़ा करने के लिए किसी भी चित्र पर टैप करें।' }
  }
})()