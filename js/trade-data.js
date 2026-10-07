/* ------------------------------------------------------------------ */
/* TheBuxar.com — Trade & Industry dataset (pure vanilla, no deps)    */
/*                                                                     */
/* Single structured data object for the TRADE & INDUSTRY module.    */
/* The HTML pages carry only a shell; this file is the one source of  */
/* truth for economic themes, business categories, trade locations   */
/* and opportunity cards.                                            */
/*                                                                     */
/* DATA POLICY — read before adding a record                          */
/*   Nothing here is a real statistic, projection or investment      */
/*   claim. Every descriptive field is deliberately conservative and  */
/*   qualitative. Where a figure could not be verified it is null     */
/*   and the renderer shows an honest empty state instead.           */
/*   No production figure, growth rate, market size or ranking is    */
/*   invented anywhere in this file.                                 */
/*                                                                     */
/*   Edit the values below to update content — every section        */
/*   updates with no code change.                                    */
/*                                                                     */
/* Language: bilingual via T.get() at render time. Static shells keep */
/* their data-en/data-hi markup handled by main.js.                 */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  var T = window.TheBuxarTrade = window.TheBuxarTrade || {}

  T.get = function (obj) {
    if (typeof obj === 'string') return obj
    return obj ? (obj[lang()] || obj.en || '') : ''
  }

  /* Base for relative asset + page URLs. trade.js reads
     window.TheBuxarConfig.path ('./' at root) and sets this. */
  T.path = ''

  function url (p) { return T.path + p }

  /* ------------------------------------------------------------------ */
  /* Icon system — one consistent set. 24x24, no fill, 1.5px stroke.    */
  /* ------------------------------------------------------------------ */
  var ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
  T.icons = {
    retail: '<svg ' + ICON + '><path d="M4 9h16v3a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 12V9Z"/><path d="M4 9 6 4h12l2 5M9 14.5V19M15 14.5V19"/></svg>',
    food: '<svg ' + ICON + '><path d="M4 4v7a3 3 0 0 0 3 3v6M7 4v6M16.5 4c-1.7 1.2-2.5 3-2.5 5s.8 3.5 2.5 4.5V20"/></svg>',
    health: '<svg ' + ICON + '><path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.6 12 20 12 20Z"/><path d="M9.5 12h5M12 9.5v5"/></svg>',
    education: '<svg ' + ICON + '><path d="M3 8.5 12 5l9 3.5L12 12 3 8.5Z"/><path d="M7 10.6V15c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.4M20.5 9v5"/></svg>',
    professional: '<svg ' + ICON + '><path d="M4 20h16M6.5 20V9.5h5V20M11.5 13.5h6V20"/><path d="M3 9.5 9 4l3.5 5.5"/></svg>',
    construction: '<svg ' + ICON + '><path d="M3 20h18M6 20v-6h5v6M11 20V9h5v11M16 20v-3h4v3"/><path d="M3 14h18"/></svg>',
    automobile: '<svg ' + ICON + '><path d="M4 16v-3.2L6 8h12l2 4.8V16"/><path d="M4 16h16M4 16v2h3v-2M17 16v2h3v-2"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/></svg>',
    transport: '<svg ' + ICON + '><path d="M3 7.5h18v9H3z"/><path d="M3 11h18M6.5 14h3M8 7.5V5h8v2.5"/><circle cx="16.5" cy="14" r="1.4"/></svg>',
    finance: '<svg ' + ICON + '><path d="M12 3.5v17M16 7.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7.5"/></svg>',
    realestate: '<svg ' + ICON + '><path d="M4 20V10l8-6 8 6v10"/><path d="M9.5 20v-6h5v6"/></svg>',
    agriculture: '<svg ' + ICON + '><path d="M5 19C4 12 8 5 19 5c0 11-6 15-13 14Z"/><path d="M5 19c2-5 5-8 9-10"/></svg>',
    manufacturing: '<svg ' + ICON + '><path d="M3 20V9l6 4V9l6 4V5l6 4v11"/><path d="M3 20h18"/></svg>',
    enterprise: '<svg ' + ICON + '><path d="M4 20V9l5 4V9l5 4V5l6 4v11"/><path d="M4 20h16"/></svg>',
    commerce: '<svg ' + ICON + '><path d="M5 6h14.5l-1.2 7.5H7.7L6.4 4.5H3"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
    opportunity: '<svg ' + ICON + '><path d="M12 3l1.8 4.6 4.9.7-3.5 3.4.9 4.9L12 13.8 7.9 16.6l.9-4.9L3.7 10l4.9-.7z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
    market: '<svg ' + ICON + '><path d="M4 9.5h16V20H4z"/><path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.6 1.6 3 3 0 0 1-5.4 0A3 3 0 0 1 3 9.5Z"/><path d="M9.5 20v-6h5v6"/></svg>',
    arrow: '<svg ' + ICON + '><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>'
  }

  /* ------------------------------------------------------------------ */
  /* Bilingual UI copy                                                  */
  /* ------------------------------------------------------------------ */
  T.ui = {
    heroLabel: { en: 'Trade & Industry', hi: 'व्यापार एवं उद्योग' },
    heroTitle: { en: 'Where Tradition Meets Enterprise', hi: 'जहाँ परंपरा मिलती है उद्यम से' },
    heroSub: {
      en: "Explore the businesses, markets, industries and opportunities shaping Buxar's economic future.",
      hi: 'बक्सर के आर्थिक भविष्य को आकार देने वाले व्यवसायों, बाज़ारों, उद्योगों और अवसरों को खोजें।'
    },
    exploreBusiness: { en: 'Explore Business', hi: 'व्यवसाय देखें' },
    visitMarketplace: { en: 'Visit Marketplace', hi: 'बाज़ार देखें' },

    economyLabel: { en: 'The Economy of Buxar', hi: 'बक्सर की अर्थव्यवस्था' },
    economyTitle: { en: 'Built on Enterprise, Trade & Opportunity', hi: 'उद्यम, व्यापार और अवसर पर निर्मित' },
    economyBody: {
      en: "Buxar's economy rests on a long tradition of local commerce. Agriculture and food businesses anchor daily life, while retail, transport and small enterprises keep the district's markets moving. A growing digital presence is opening new routes for local producers and sellers to reach customers.",
      hi: 'बक्सर की अर्थव्यवस्था स्थानीय वाणिज्य की लंबी परंपरा पर टिकी है। कृषि और खाद्य व्यवसाय दैनिन जीवन को संभालते हैं, जबकि खुदरा, परिवहन और छोटे उद्यम जिले के बाज़ारों को चलाते हैं। बढ़ती डिजिटल उपस्थिति स्थानीय उत्पादकों और विक्रेताओं के लिए नए रास्ते खोल रही है।'
    },


    agriLabel: { en: 'Agriculture & Local Commerce', hi: 'कृषि एवं स्थानीय वाणिज्य' },
    agriTitle: { en: 'From Local Production to Local Markets', hi: 'स्थानीय उत्पादन से स्थानीय बाज़ारों तक' },
    agriBody: {
      en: 'The link between farmer, trader and consumer runs through Buxar\'s local markets. Agricultural produce, food products and everyday goods move from farms and small workshops into shops and marketplaces across the district.',
      hi: 'किसान, व्यापारी और उपभोक्ता के बीच का संबंध बक्सर के स्थानीय बाज़ारों से होकर गुज़रता है। कृषि उत्पाद, खाद्य उत्पाद और रोज़मर्रा की सामग्री खेतों और छोटे कार्यशालाओं से जिले भर की दुकानों और बाज़ारों में पहुँचती है।'
    },
    agriCta: { en: 'Explore Local Commerce', hi: 'स्थानीय वाणिज्य देखें' },

    ecosystemLabel: { en: 'Buxar Business Ecosystem', hi: 'बक्सर व्यापार पारिस्थितिकी तंत्र' },
    ecosystemTitle: { en: 'A District of Enterprises', hi: 'उद्यमों का जिला' },
    ecosystemSub: {
      en: 'Every category below connects to the Business Directory, where local enterprises are listed and discovered.',
      hi: 'नीचे दी गई हर श्रेणी व्यापार निर्देशिका से जुड़ी है, जहाँ स्थानीय उद्यम सूचीबद्ध और खोजे जाते हैं।'
    },
    exploreBusinesses: { en: 'Explore Businesses →', hi: 'व्यवसाय देखें →' },

    locationsLabel: { en: 'Trade Across Buxar', hi: 'बक्सर भर में व्यापार' },
    locationsTitle: { en: 'Commerce in Every Corner', hi: 'हर कोने में वाणिज्य' },
    locationsSub: {
      en: 'Each of the district\'s six areas carries its own commercial character — from the busy markets of Buxar Town to the agricultural trade of the surrounding blocks.',
      hi: 'जिले के छहों क्षेत्रों का अपना व्यापारिक स्वभाव है — बक्सर नगर के व्यस्त बाज़ारों से लेकर आसपास के प्रखंडों के कृषि व्यापार तक।'
    },
    explore: { en: 'Explore →', hi: 'देखें →' },

    bridgeLabel: { en: 'From Local Trade to Digital Marketplace', hi: 'स्थानीय व्यापार से डिजिटल बाज़ार तक' },
    bridgeTitle: { en: "Take Buxar's Commerce Online", hi: 'बक्सर का व्यापार ऑनलाइन लें' },
    bridgeSub: {
      en: 'Discover how local businesses and products can reach customers through TheBuxar.com.',
      hi: 'जानें कैसे स्थानीय व्यवसाय और उत्पाद TheBuxar.com के माध्यम से ग्राहकों तक पहुँच सकते हैं।'
    },
    bizCardTitle: { en: 'Business Directory', hi: 'व्यापार निर्देशिका' },
    bizCardSub: { en: 'Discover local businesses and services.', hi: 'स्थानीय व्यवसाय और सेवाएँ खोजें।' },
    bizCardCta: { en: 'Explore Businesses →', hi: 'व्यवसाय देखें →' },
    mkCardTitle: { en: 'Marketplace', hi: 'बाज़ार' },
    mkCardSub: { en: 'Discover products from local sellers.', hi: 'स्थानीय विक्रेताओं के उत्पाद खोजें।' },
    mkCardCta: { en: 'Shop Local →', hi: 'स्थानीय खरीदें →' },

    oppLabel: { en: 'Opportunities in Buxar', hi: 'बक्सर में अवसर' },
    oppTitle: { en: 'Possibilities Across the District', hi: 'जिले भर में संभावनाएँ' },
    oppSub: {
      en: 'These themes highlight where local enterprise is growing and where new opportunities are emerging across the district.',
      hi: 'ये विषय बताते हैं कि स्थानीय उद्यम कहाँ बढ़ रहा है और जिले भर में नए अवसर कहाँ उभर रहे हैं।'
    },

    ctaLabel: { en: 'Join the Growth', hi: 'विकास से जुड़ें' },
    ctaTitle: { en: "Be Part of Buxar's Growing Economy", hi: 'बक्सर की बढ़ती अर्थव्यवस्था का हिस्सा बनें' },
    ctaSub: {
      en: 'Discover businesses, connect with local commerce and explore opportunities across Buxar.',
      hi: 'व्यवसायों को खोजें, स्थानीय वाणिज्य से जुड़ें और बक्सर भर में अवसरों का पता लगाएँ।'
    },
    ctaBusiness: { en: 'Explore Business', hi: 'व्यवसाय देखें' },
    ctaMarketplace: { en: 'Explore Marketplace', hi: 'बाज़ार देखें' }
  }

  /* ------------------------------------------------------------------ */
  /* Business ecosystem categories — link to the Business Directory      */
  /* ------------------------------------------------------------------ */
  T.categories = [
    { slug: 'retail', icon: 'retail', name: { en: 'Retail', hi: 'खुदरा' }, blurb: { en: 'Shops and stores serving everyday needs.', hi: 'रोज़मर्रा की ज़रूरतों की दुकानें।' } },
    { slug: 'food-hospitality', icon: 'food', name: { en: 'Food & Hospitality', hi: 'भोजन एवं आतिथ्य' }, blurb: { en: 'Restaurants, sweet houses and eateries.', hi: 'रेस्तराँ, मिठाई घर और भोजनालय।' } },
    { slug: 'healthcare', icon: 'health', name: { en: 'Healthcare', hi: 'स्वास्थ्य सेवा' }, blurb: { en: 'Clinics, hospitals and pharmacies.', hi: 'क्लीनिक, अस्पताल और दवाखाने।' } },
    { slug: 'education', icon: 'education', name: { en: 'Education', hi: 'शिक्षा' }, blurb: { en: 'Schools, colleges and coaching centres.', hi: 'विद्यालय, महाविद्यालय और कोचिंग केंद्र।' } },
    { slug: 'professional-services', icon: 'professional', name: { en: 'Professional Services', hi: 'पेशेवर सेवाएँ' }, blurb: { en: 'Legal, accounting and consultancy work.', hi: 'कानूनी, लेखा और परामर्श कार्य।' } },
    { slug: 'construction', icon: 'construction', name: { en: 'Construction', hi: 'निर्माण' }, blurb: { en: 'Building, contractors and materials.', hi: 'निर्माण, ठेकेदार और सामग्री।' } },
    { slug: 'automobile', icon: 'automobile', mono: 'AUTO', name: { en: 'Automobile', hi: 'मोटर वाहन' }, blurb: { en: 'Vehicle sales, service and repair.', hi: 'वाहन बिक्री, सर्विस और मरम्मत।' } },
    { slug: 'transport', icon: 'transport', name: { en: 'Transport', hi: 'परिवहन' }, blurb: { en: 'Goods and passenger movement.', hi: 'माल और यात्री परिवहन।' } },
    { slug: 'finance', icon: 'finance', name: { en: 'Finance', hi: 'वित्त' }, blurb: { en: 'Banking, insurance and money services.', hi: 'बैंकिंग, बीमा और धन सेवाएँ।' } },
    { slug: 'real-estate', icon: 'realestate', name: { en: 'Real Estate', hi: 'रियल एस्टेट' }, blurb: { en: 'Property, land and housing.', hi: 'संपत्ति, भूमि और आवास।' } },
    { slug: 'agriculture', icon: 'agriculture', mono: 'AGRI', name: { en: 'Agriculture', hi: 'कृषि' }, blurb: { en: 'Farms, produce and agro-services.', hi: 'खेत, उपज और कृषि सेवाएँ।' } },
    { slug: 'manufacturing', icon: 'manufacturing', name: { en: 'Manufacturing', hi: 'विनिर्माण' }, blurb: { en: 'Small industries and workshops.', hi: 'छोटे उद्योग और कार्यशालाएँ।' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Trade locations — the six Explore Buxar areas                       */
  /* Descriptions are factual and conservative.                         */
  /* ------------------------------------------------------------------ */
  T.locations = [
    {
      slug: 'buxar-town',
      name: { en: 'Buxar Town', hi: 'बक्सर नगर' },
      image: 'assets/explore/buxar-town/hero.webp',
      blurb: { en: 'The district headquarters and busiest market centre, on the Ganga.', hi: 'जिला मुख्यालय और सबसे व्यस्त बाज़ार केंद्र, गंगा तट पर।' }
    },
    {
      slug: 'dumraon',
      name: { en: 'Dumraon', hi: 'दुमराँव' },
      image: 'assets/explore/dumraon/hero.webp',
      blurb: { en: 'A historic town with an active local market and agricultural trade.', hi: 'एक ऐतिहासिक नगर, सक्रिय स्थानीय बाज़ार और कृषि व्यापार के साथ।' }
    },
    {
      slug: 'brahampur',
      name: { en: 'Brahampur', hi: 'ब्रहमपुर' },
      image: 'assets/tourism/historical/naulakha-mandir.webp',
      blurb: { en: 'A block with local shops and agricultural commerce.', hi: 'स्थानीय दुकानों और कृषि वाणिज्य वाला प्रखंड।' }
    },
    {
      slug: 'chausa',
      name: { en: 'Chausa', hi: 'चौसा' },
      image: 'assets/explore/chausa/hero.webp',
      blurb: { en: 'Known for its mango markets and rural trade.', hi: 'अपने आम बाज़ारों और ग्रामीण व्यापार के लिए जाना जाता है।' }
    },
    {
      slug: 'itarhi',
      name: { en: 'Itarhi', hi: 'इटाढ़ी' },
      image: 'assets/explore/itarhi/hero.webp',
      blurb: { en: 'A growing local market serving surrounding villages.', hi: 'आसपास के गाँवों की सेवा करने वाला बढ़ता स्थानीय बाज़ार।' }
    },
    {
      slug: 'rajpur',
      name: { en: 'Rajpur', hi: 'राजपुर' },
      image: 'assets/explore/rajpur/hero.jpg',
      blurb: { en: 'A local trade point for nearby rural communities.', hi: 'आसपास के ग्रामीण समुदायों के लिए स्थानीय व्यापार केंद्र।' }
    }
  ]

  /* ------------------------------------------------------------------ */
  /* Opportunity cards                                                   */
  /* ------------------------------------------------------------------ */
  T.opportunities = [
    { icon: 'enterprise', name: { en: 'Business', hi: 'व्यापार' }, blurb: { en: 'Start or grow a local enterprise.', hi: 'स्थानीय उद्यम शुरू करें या बढ़ाएँ।' } },
    { icon: 'commerce', name: { en: 'Trade', hi: 'व्यापार' }, blurb: { en: 'Connect producers with markets.', hi: 'उत्पादकों को बाज़ारों से जोड़ें।' } },
    { icon: 'opportunity', name: { en: 'Tourism', hi: 'पर्यटन' }, blurb: { en: 'Hospitality and visitor services.', hi: 'आतिथ्य और पर्यटक सेवाएँ।' } },
    { icon: 'food', name: { en: 'Hospitality', hi: 'आतिथ्य' }, blurb: { en: 'Food, lodging and local experiences.', hi: 'भोजन, आवास और स्थानीय अनुभव।' } },
    { icon: 'market', name: { en: 'Digital Commerce', hi: 'डिजिटल वाणिज्य' }, blurb: { en: 'Reach customers online.', hi: 'ऑनलाइन ग्राहकों तक पहुँचें।' } },
    { icon: 'opportunity', name: { en: 'Local Entrepreneurship', hi: 'स्थानीय उद्यमिता' }, blurb: { en: 'Build something of your own.', hi: 'अपना कुछ बनाएँ।' } }
  ]

  /* ------------------------------------------------------------------ */
  /* URL builders                                                        */
  /* ------------------------------------------------------------------ */
  T.businessUrl = function () { return url('business.html') }
  T.marketplaceUrl = function () { return url('marketplace.html') }
  T.exploreUrl = function (slug) { return url('explore/' + slug + '/') }

  /* ------------------------------------------------------------------ */
  /* Image library — licensed editorial photographs                     */
  /* ------------------------------------------------------------------ */
  T.images = {
    hero: 'assets/images/marketplace/hero/marketplace-hero-local-commerce.jpg',
    economy: 'assets/images/marketplace/categories/marketplace-agricultural-products.jpg',
    agriculture: 'assets/images/marketplace/locations/marketplace-location-bihar-countryside.jpg',
    story: 'assets/images/marketplace/stories/marketplace-stories-craft.jpg'
  }

  T.imageUrl = function (p) { return p ? url(p) : '' }
})()
