/* ------------------------------------------------------------------ */
/* TheBuxar.com — Business Directory dataset (pure vanilla, no deps)   */
/*                                                                     */
/* Single structured data object for the whole BUSINESS DIRECTORY      */
/* module, exactly as js/explore-data.js does for EXPLORE BUXAR. Every */
/* page in the module carries only a shell; this file is the one source */
/* of truth for categories, areas, services and business records.       */
/*                                                                     */
/* DATA POLICY — read before adding a record                           */
/*   Every field below is optional. The renderer only shows a field    */
/*   when the record actually carries it, so a real listing can ship   */
/*   with nothing but a name, a category and an area.                  */
/*                                                                     */
/*   L.businesses starts empty and grows only from real listings. A     */
/*   business is added when its owner submits the details — and every   */
/*   commercial field must come from that owner, never be assumed:      */
/*     phone, whatsapp, email, website, address, coordinates, hours,    */
/*     rating and reviews.                                              */
/*                                                                     */
/*   Leave a field out rather than guessing it. The renderer shows a   */
/*   field only when the record actually carries it, so a listing can  */
/*   ship with nothing but a name, a category and an area. Appending a  */
/*   record updates every filter, count, badge and page automatically.  */
/*                                                                     */
/*                                                                     */
/* Language: bilingual via L.get() at render time. Static shells keep */
/* their data-en/data-hi markup handled by main.js.                    */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  var B = window.TheBuxarBusiness = window.TheBuxarBusiness || {}

  B.get = function (obj) {
    if (typeof obj === 'string') return obj
    return obj ? (obj[lang()] || obj.en || '') : ''
  }

  /* Every translation of a bilingual value, for search. A visitor typing
     "डेमो" into the search box while the interface is in English should
     still find "डेमो किचन" — the data holds both strings, so matching both
     invents nothing. */
  B.all = function (obj) {
    if (obj == null) return []
    if (typeof obj === 'string') return [obj]
    return [obj.en, obj.hi].filter(function (s) { return typeof s === 'string' && s })
  }

  /* Base for relative asset + page URLs. business.js reads
     window.TheBuxarConfig.path ('./' at root, '../' inside business/)
     and sets this, matching the Explore module. */
  B.path = ''

  function url (p) { return B.path + p }

  /* ------------------------------------------------------------------ */
  /* Icon system — one consistent set. 24x24, no fill, 1.5px stroke,   */
  /* round joins. Matches .cat__icon in css/sections.css. One icon     */
  /* per category, reused everywhere a category is shown.              */
  /* ------------------------------------------------------------------ */
  var ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'
  B.icons = {
    food: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 4v7a3 3 0 0 0 3 3v6M7 4v6M16.5 4c-1.7 1.2-2.5 3-2.5 5s.8 3.5 2.5 4.5V20"/></svg>',
    stay: '<svg ' + ICON + ' aria-hidden="true"><path d="M3 18v-8h13v8M16 10V6h5v12M3 18h18M3 21v-3M21 21v-3"/><circle cx="7" cy="12" r="1.6"/></svg>',
    health: '<svg ' + ICON + ' aria-hidden="true"><path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6C19 15.6 12 20 12 20Z"/><path d="M9.5 12h5M12 9.5v5"/></svg>',
    education: '<svg ' + ICON + ' aria-hidden="true"><path d="M3 8.5 12 5l9 3.5L12 12 3 8.5Z"/><path d="M7 10.6V15c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.4M20.5 9v5"/></svg>',
    shopping: '<svg ' + ICON + ' aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    retail: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 9h16v3a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 12V9Z"/><path d="M4 9 6 4h12l2 5M9 14.5V19M15 14.5V19"/></svg>',
    professional: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 20h16M6.5 20V9.5h5V20M11.5 13.5h6V20"/><path d="M3 9.5 9 4l3.5 5.5"/></svg>',
    automobile: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 16v-3.2L6 8h12l2 4.8V16"/><path d="M4 16h16M4 16v2h3v-2M17 16v2h3v-2"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/></svg>',
    realestate: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 20V10l8-6 8 6v10"/><path d="M9.5 20v-6h5v6"/></svg>',
    finance: '<svg ' + ICON + ' aria-hidden="true"><path d="M12 3.5v17M16 7.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7.5"/></svg>',
    construction: '<svg ' + ICON + ' aria-hidden="true"><path d="M3 20h18M6 20v-6h5v6M11 20V9h5v11M16 20v-3h4v3"/><path d="M3 14h18"/></svg>',
    travel: '<svg ' + ICON + ' aria-hidden="true"><path d="M3 7.5h18v9H3z"/><path d="M3 11h18M6.5 14h3M8 7.5V5h8v2.5"/><circle cx="16.5" cy="14" r="1.4"/></svg>',
    beauty: '<svg ' + ICON + ' aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 8v8M9.5 9.5v5M14.5 9.5v5"/></svg>',
    services: '<svg ' + ICON + ' aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0-5.2 5.2L4 17v3h3l5.3-5.3a4 4 0 0 0 5.2-5.2l-2.6 2.6-2-2 2.6-2.6Z"/></svg>',
    other: '<svg ' + ICON + ' aria-hidden="true"><circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/></svg>',
    /* UI icons */
    pin: '<svg ' + ICON + ' aria-hidden="true"><path d="M12 21s6-5.4 6-9.5A6 6 0 0 0 6 11.5C6 15.6 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    search: '<svg ' + ICON + ' aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>',
    phone: '<svg ' + ICON + ' aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
    chat: '<svg ' + ICON + ' aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 21l1.4-4.7A8.5 8.5 0 1 1 20.5 12Z"/></svg>',
    mail: '<svg ' + ICON + ' aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    globe: '<svg ' + ICON + ' aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5Z"/></svg>',
    clock: '<svg ' + ICON + ' aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/></svg>',
    star: '<svg ' + ICON + ' aria-hidden="true"><path d="m12 4 2.4 5.4 5.9.6-4.4 3.9 1.2 5.8L12 16.8 6.9 19.7l1.2-5.8L3.7 10l5.9-.6L12 4Z"/></svg>',
    check: '<svg ' + ICON + ' aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    close: '<svg ' + ICON + ' aria-hidden="true"><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></svg>',
    arrow: '<svg ' + ICON + ' aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>',
    filter: '<svg ' + ICON + ' aria-hidden="true"><path d="M4 6.5h16M7 12h10M10 17.5h4"/></svg>',
    image: '<svg ' + ICON + ' aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17 4.5-4 3 2.6 3-2.6 4.5 4"/></svg>',
    building: '<svg ' + ICON + ' aria-hidden="true"><path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20M3.5 20h17"/><path d="M8 8h4M8 12h4M8 16h4"/></svg>'
  }

  /* ------------------------------------------------------------------ */
  /* Shared UI strings                                                 */
  /* ------------------------------------------------------------------ */
  B.ui = {
    dirLabel: { en: 'Business Directory', hi: 'व्यापार निर्देशिका' },
    dirTitle: { en: "Discover Buxar's Local Businesses", hi: 'बक्सर के स्थानीय व्यवसाय खोजें' },
    dirSub: { en: 'Find trusted businesses, services, shops, restaurants, professionals and local enterprises across Buxar.', hi: 'बक्सर भर के विश्वसनीय व्यवसाय, सेवाएँ, दुकानें, रेस्तराँ, पेशेवर और स्थानीय उद्यम खोजें।' },
    searchLabel: { en: 'Search', hi: 'खोजें' },
    searchPh: { en: 'Search businesses, services or products...', hi: 'व्यवसाय, सेवाएँ या उत्पाद खोजें...' },
    searchBtn: { en: 'Search', hi: 'खोजें' },
    locField: { en: 'Buxar', hi: 'बक्सर' },
    quickCats: { en: 'Browse by category', hi: 'श्रेणी से ब्राउज़ करें' },
    moreCatsNote: { en: 'More categories open automatically as listings are added.', hi: 'सूचियाँ जुड़ने पर अधिक श्रेणियाँ स्वतः उपलब्ध हो जाएँगी।' },
    featuredLabel: { en: 'Featured in Buxar', hi: 'बक्सर में विशेष' },
    featuredTitle: { en: 'Discover Local Businesses', hi: 'स्थानीय व्यवसाय खोजें' },
    byCategory: { en: 'Explore by Category', hi: 'श्रेणी से खोजें' },
    byLocation: { en: 'Explore by Location', hi: 'स्थान से खोजें' },
    byLocationSub: { en: 'Every business is filed under one of the district\u2019s six areas.', hi: 'हर व्यवसाय जिले के छह क्षेत्रों में से किसी एक के अंतर्गत दर्ज है।' },
    lookingFor: { en: 'What are you looking for?', hi: 'आप क्या खोज रहे हैं?' },
    lookingForSub: { en: 'Jump straight to the kind of business you need.', hi: 'सीधे अपनी ज़रूरत के व्यवसाय पर पहुँचें।' },
    ownerTitle: { en: 'Own a business in Buxar?', hi: 'बक्सर में व्यवसाय हैं?' },
    ownerSub: { en: 'Add your business to TheBuxar.com.', hi: 'अपना व्यवसाय TheBuxar.com पर जोड़ें।' },
    listBusiness: { en: 'List your business', hi: 'अपना व्यवसाय जोड़ें' },
    claimBusiness: { en: 'Claim your business', hi: 'अपना व्यवसाय क्लेम करें' },
    ctaAll: { en: 'Explore Business Directory \u2192', hi: 'व्यापार निर्देशिका देखें \u2192' },
    viewAllArea: { en: 'View all businesses \u2192', hi: 'सभी व्यवसाय देखें \u2192' },

    /* Listing invitations */
    joinDirectory: { en: 'List your business', hi: 'अपना व्यवसाय सूचीबद्ध करें' },
    joinDirectorySub: {
      en: 'Shops, services, restaurants, clinics, workshops and institutions across Buxar district can list here free. Send us your details and we will publish your page.',
      hi: 'बक्सर जिले की दुकानें, सेवाएँ, रेस्तराँ, क्लिनिक, कार्यशालाएँ और संस्थाएँ यहाँ मुफ़्त में सूचीबद्ध हो सकती हैं। अपना विवरण भेजें और हम आपका पेज प्रकाशित कर देंगे।'
    },

    /* Listing page */
    resultsLabel: { en: 'Directory', hi: 'निर्देशिका' },
    resultsFor: { en: 'Results', hi: 'परिणाम' },
    filters: { en: 'Filters', hi: 'फ़िल्टर' },
    filtersOpen: { en: 'Filters', hi: 'फ़िल्टर' },
    applyFilters: { en: 'Show results', hi: 'परिणाम दिखाएँ' },
    clearAll: { en: 'Clear filters', hi: 'सभी फ़िल्टर हटाएँ' },
    sortBy: { en: 'Sort by', hi: 'क्रमबद्ध करें' },
    sortRelevance: { en: 'Relevance', hi: 'प्रासंगिकता' },
    sortNewest: { en: 'Newest', hi: 'नवीनतम' },
    sortName: { en: 'Name (A\u2013Z)', hi: 'नाम (A\u2013Z)' },
    fCategory: { en: 'Category', hi: 'श्रेणी' },
    fLocation: { en: 'Location', hi: 'स्थान' },
    fType: { en: 'Business type', hi: 'व्यवसाय का प्रकार' },
    fService: { en: 'Service', hi: 'सेवा' },
    fVerified: { en: 'Verified only', hi: 'केवल सत्यापित' },
    fVerifiedNone: { en: 'No verified listing has been submitted yet, so this filter stays hidden.', hi: 'अभ तक कोई सत्यापित सूची प्रस्तुत नहीं हुई है, इसलिए यह फ़िल्टर छिपा रहता है।' },
    fOpenNow: { en: 'Open now', hi: 'अभी खुला' },
    fPrice: { en: 'Price category', hi: 'मूल्य श्रेणी' },
    showing: { en: 'Showing', hi: 'दिखा रहे हैं' },
    of: { en: 'of', hi: 'में से' },
    businesses: { en: 'businesses', hi: 'व्यवसाय' },
    loadMore: { en: 'Load more', hi: 'और लोड करें' },
    prev: { en: 'Previous', hi: 'पिछला' },
    next: { en: 'Next', hi: 'अगला' },
    page: { en: 'Page', hi: 'पृष्ठ' },
    of2: { en: 'of', hi: '/' },
    viewDetails: { en: 'View details', hi: 'विवरण देखें' },
    noResultsTitle: { en: 'No businesses found', hi: 'कोई व्यवसाय नहीं मिला' },
    noResultsSub: { en: 'Try another category or location.', hi: 'कोई दूसरी श्रेणी या स्थान आज़माएँ।' },
    noAreaTitle: { en: 'No listings in this area yet', hi: 'इस क्षेत्र में अभी कोई सूची नहीं' },
    noAreaSub: { en: 'This area has no submitted listings yet. Browse the whole directory instead.', hi: 'इस क्षेत्र में अभी कोई सूची प्रस्तुत नहीं हुई है। इसके बजाय पूरी निर्देशिका देखें।' },
    /* A bad or retired profile URL, not an empty search result. */
    missingTitle: { en: 'This listing is not available', hi: 'यह सूची उपलब्ध नहीं है' },
    missingSub: {
      en: 'The address may have changed or the listing may have been removed. Browse the directory to find what you need.',
      hi: 'पता बदल गया होगा या सूची हटा दी गई होगी। आपको जो चाहिए वह निर्देशिका में देखें।',
    },
    browseAll: { en: 'Browse all businesses', hi: 'सभी व्यवसाय देखें' },

    /* Profile */
    about: { en: 'About', hi: 'परिचय' },
    services: { en: 'Services', hi: 'सेवाएँ' },
    contact: { en: 'Contact', hi: 'संपर्क' },
    location: { en: 'Location', hi: 'स्थान' },
    hours: { en: 'Business hours', hi: 'व्यावसायिक समय' },
    photos: { en: 'Photos', hi: 'फ़ोटो' },
    reviews: { en: 'Reviews', hi: 'समीक्षाएँ' },
    related: { en: 'Related businesses', hi: 'संबंधित व्यवसाय' },
    callNow: { en: 'Call', hi: 'कॉल करें' },
    whatsapp: { en: 'WhatsApp', hi: 'व्हाट्सएप' },
    directions: { en: 'Directions', hi: 'दिशा' },
    website: { en: 'Website', hi: 'वेबसाइट' },
    email: { en: 'Email', hi: 'ईमेल' },

    noPhoneNote: { en: 'This business prefers to be reached in person or through the Buxar business desk.', hi: 'यह व्यवसाय व्यक्तिगत रूप से या बक्सर व्यापार डेस्क के माध्यम से संपर्क करना पसंद करता है।' },
    noAddressNote: { en: 'This business is located within Buxar district. Ask at the district business desk for its exact location.', hi: 'यह व्यवसाय बक्सर जिले में स्थित है। सटीक स्थान के लिए जिला व्यापार डेस्क से पूछें।' },
    getDirections: { en: 'Get directions', hi: 'दिशा प्राप्त करें' },
    comingSoon: { en: 'Reviews', hi: 'समीक्षाएँ' },
    comingSoonSub: {
      en: 'Share your experience of this business to help other customers choose with confidence.',
      hi: 'अन्य ग्राहकों के सही चुनाव में मदद के लिए इस व्यवसाय का अपना अनुभव साझा करें।'
    },
    noPhotos: { en: 'Gallery', hi: 'गैलरी' },
    noPhotosSub: { en: 'The owner adds the logo, storefront, interior and product photographs for this listing.', hi: 'मालिक इस सूची का लोगो, दुकान, आंतरिक और उत्पाद फ़ोटो जोड़ते हैं।' },
    photoCredit: { en: 'Photo', hi: 'फ़ोटो' },
    profileNote: {
      en: 'Every detail on this page is published by the business itself. Where a field is not shown, the business has not published it — get in touch and ask.',
      hi: 'इस पृष्ठ का हर विवरण स्वयं व्यवसाय द्वारा प्रकाशित है। जहाँ कोई फ़ील्ड नहीं दिखाया गया, व्यवसाय ने उसे प्रकाशित नहीं किया है — संपर्क करके पूछ लें।'
    },

    /* Add / claim */
    addTitle: { en: 'Add your business', hi: 'अपना व्यवसाय जोड़ें' },
    addSub: {
      en: 'Listing is free. Tell us about the business and we will build and publish your page.',
      hi: 'सूचीबद्ध करना मुफ़्त है। व्यवसाय के बारे में बताएँ और हम आपका पेज बनाकर प्रकाशित कर देंगे।'
    },
    claimTitle: { en: 'Claim this business', hi: 'इस व्यवसाय को क्लेम करें' },
    claimSub: {
      en: 'Claiming lets an owner keep their own listing up to date — photographs, timings, offers and contact details.',
      hi: 'क्लेम करने से मालिक अपनी सूची स्वयं अद्यतन रख सकता है — फ़ोटो, समय, ऑफ़र और संपर्क विवरण।'
    },
    fName: { en: 'Business name', hi: 'व्यवसाय का नाम' },
    fCategory: { en: 'Category', hi: 'श्रेणी' },
    fSubcategory: { en: 'Subcategory', hi: 'उपश्रेणी' },
    fDescription: { en: 'Description', hi: 'विवरण' },
    fPhone: { en: 'Phone', hi: 'फ़ोन' },
    fWhatsapp: { en: 'WhatsApp', hi: 'व्हाट्सएप' },
    fEmail: { en: 'Email', hi: 'ईमेल' },
    fWebsite: { en: 'Website', hi: 'वेबसाइट' },
    fAddress: { en: 'Street address', hi: 'सड़क पता' },
    fArea: { en: 'Area', hi: 'क्षेत्र' },
    fMap: { en: 'Map location', hi: 'मानचित्र स्थान' },
    fHours: { en: 'Opening hours', hi: 'खुलने का समय' },
    fServices: { en: 'Services offered', hi: 'दी जाने वाली सेवाएँ' },
    fSocial: { en: 'Social links', hi: 'सोशल लिंक' },
    fLogo: { en: 'Logo', hi: 'लोगो' },
    fCover: { en: 'Cover image', hi: 'कवर इमेज' },
    fGallery: { en: 'Gallery', hi: 'गैलरी' },
    fTerms: { en: 'Terms &amp; verification', hi: 'शर्तें और सत्यापन' },
    submitBusiness: { en: 'Submit business', hi: 'व्यवसाय जमा करें' },
    claimSubmit: { en: 'Send claim request', hi: 'क्लेम अनुरोध भेजें' },
    chooseCategory: { en: 'Choose a category', hi: 'श्रेणी चुनें' },
    chooseArea: { en: 'Choose an area', hi: 'क्षेत्र चुनें' },
    notStored: {
      en: 'Form validated, but nothing was sent: this site has no backend yet. Nothing has been stored or published.',
      hi: 'फ़ॉर्म सत्यापित हुआ, लेकिन कुछ भी नहीं भेजा गया: इस साइट में अभी कोई बैकएंड नहीं है। कुछ भी संग्रहीत या प्रकाशित नहीं हुआ।'
    },
    requiredHint: { en: 'Required fields are marked with an asterisk.', hi: 'आवश्यक फ़ील्ड तारांक चिह्न से चिह्नित हैं।' },

    /* Area page integration */
    verifiedBadge: { en: 'Verified', hi: 'सत्यापित' },
    openNow: { en: 'Open now', hi: 'अभी खुला' },
    closedNow: { en: 'Closed', hi: 'बंद' },
    noRating: { en: 'New listing', hi: 'नई सूची' },
    home: { en: 'Home', hi: 'होम' },
    pending: { en: 'Ask the business for this detail.', hi: 'यह विवरण व्यवसाय से पूछें।' },
    phone: { en: 'Phone', hi: 'फ़ोन' },
    photogPending: {
      en: 'Photographs are added by the business as its work is published.',
      hi: 'व्यवसाय अपना काम प्रकाशित करते हुए फ़ोटो जोड़ता है।'
    },
    galleryTap: { en: 'Tap any photo to enlarge.', hi: 'बड़ा करने के लिए किसी भी फ़ोटो पर टैप करें।' },
    sortDistance: { en: 'Distance', hi: 'दूरी' },

    areaBizTitle: { en: 'Businesses in this area', hi: 'इस क्षेत्र के व्यवसाय' },
    areaBizSub: {
      en: 'Local businesses filed under this area of Buxar district.',
      hi: 'बक्सर जिले के इस क्षेत्र में दर्ज स्थानीय व्यवसाय।'
    },
    tourismBizTitle: { en: 'Explore nearby businesses', hi: 'आस-पास के व्यवसाय देखें' },
    tourismBizSub: {
      en: 'Businesses are matched to a destination once their own location is confirmed.',
      hi: 'व्यवसाय का अपना स्थान पुष्ट होने पर उसे संबंधित गंतव्य से जोड़ा जाता है।'
    }
  }

  /* ------------------------------------------------------------------ */
  /* Areas — the six Explore Buxar places. Slugs match js/explore-data.js */
  /* so the two modules stay in sync.                                  */
  /* ------------------------------------------------------------------ */
  B.areas = [
    { slug: 'buxar-town', url: 'explore/buxar-town/', name: { en: 'Buxar Town', hi: 'बक्सर नगर' } },
    { slug: 'dumraon', url: 'explore/dumraon/', name: { en: 'Dumraon', hi: 'दुमराव' } },
    { slug: 'brahampur', url: 'explore/brahampur/', name: { en: 'Brahampur', hi: 'ब्रहमपुर' } },
    { slug: 'chausa', url: 'explore/chausa/', name: { en: 'Chausa', hi: 'चौसा' } },
    { slug: 'itarhi', url: 'explore/itarhi/', name: { en: 'Itarhi', hi: 'इतरही' } },
    { slug: 'rajpur', url: 'explore/rajpur/', name: { en: 'Rajpur', hi: 'राजपुर' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Categories — seeded with the full set the directory intends to      */
  /* carry. Only categories that at least one record actually uses are  */
  /* rendered, so an empty category never reaches the UI.              */
  /* ------------------------------------------------------------------ */
  B.categories = [
    { slug: 'healthcare', icon: 'health', name: { en: 'Healthcare & Public Health', hi: 'स्वास्थ्य एवं जन स्वास्थ्य' }, blurb: { en: 'Hospitals, primary health centres and clinics.', hi: 'अस्पताल, प्राथमिक स्वास्थ्य केंद्र और क्लिनिक।' }, find: { en: 'Find a Doctor', hi: 'एक डॉक्टर खोजें' } },
    { slug: 'education', icon: 'education', name: { en: 'Schools & Colleges', hi: 'विद्यालय एवं महाविद्यालय' }, blurb: { en: 'Schools, colleges and education offices.', hi: 'विद्यालय, महाविद्यालय और शिक्षा कार्यालय।' }, find: { en: 'Find a School', hi: 'एक विद्यालय खोजें' } },
    { slug: 'police-emergency', icon: 'services', name: { en: 'Police & Emergency', hi: 'पुलिस एवं आपातकाल' }, blurb: { en: 'Police stations, circles and emergency contacts.', hi: 'पुलिस थाने, सर्कल और आपातकालीन संपर्क।' }, find: { en: 'Emergency Contacts', hi: 'आपातकालीन संपर्क' } },
    { slug: 'civic-offices', icon: 'other', name: { en: 'Civic & District Offices', hi: 'नागरिक एवं जिला कार्यालय' }, blurb: { en: 'District administration, block and municipal offices.', hi: 'जिला प्रशासन, प्रखंड और नगरपालिका कार्यालय।' }, find: { en: 'Find an Office', hi: 'एक कार्यालय खोजें' } },
    { slug: 'finance', icon: 'finance', name: { en: 'Banks & Finance', hi: 'बैंक एवं वित्त' }, blurb: { en: 'Banks and financial services in the district.', hi: 'जिले में बैंक और वित्तीय सेवाएँ।' }, find: { en: 'Find a Bank', hi: 'एक बैंक खोजें' } },
    { slug: 'utilities', icon: 'services', name: { en: 'Power & Utilities', hi: 'विद्युत एवं उपयोगिता' }, blurb: { en: 'Electricity, water and public utilities.', hi: 'बिजली, जल और सार्वजनिक उपयोगिता।' }, find: { en: 'Find a Utility', hi: 'एक उपयोगिता खोजें' } },
    { slug: 'community', icon: 'other', name: { en: 'Community & NGOs', hi: 'समुदाय एवं एनजीओ' }, blurb: { en: 'NGOs and community organisations.', hi: 'एनजीओ और सामुदायिक संगठन।' }, find: { en: 'Find an Organisation', hi: 'एक संगठन खोजें' } },
    { slug: 'restaurants-food', icon: 'food', name: { en: 'Restaurants & Food', hi: 'रेस्तराँ और भोजन' }, blurb: { en: 'Eateries, food counters and local cuisine.', hi: 'भोजनालय, फ़ूड काउंटर और स्थानीय भोजन।' }, find: { en: 'Find a Restaurant', hi: 'एक रेस्तराँ खोजें' } },
    { slug: 'hotels-stays', icon: 'stay', name: { en: 'Hotels & Stays', hi: 'होटल और ठहरना' }, blurb: { en: 'Hotels, guest houses and places to stay.', hi: 'होटल, अतिथि गृह और ठरने की जगहें।' }, find: { en: 'Find a Hotel', hi: 'एक होटल खोजें' } },
    { slug: 'shopping', icon: 'shopping', name: { en: 'Shopping', hi: 'खरीदारी' }, blurb: { en: 'Shops, boutiques and retail stores.', hi: 'दुकानें, बुटीक और खुदरा भंडार।' }, find: { en: 'Find a Shop', hi: 'एक दुकान खोजें' } },
    { slug: 'retail', icon: 'retail', name: { en: 'Retail', hi: 'फुटरायल' }, blurb: { en: 'General retail and everyday goods.', hi: 'सामान्य फुटरायल और रोज़मर्रा का सामान।' }, find: { en: 'Find a Retailer', hi: 'एक फुटरायलर खोजें' } },
    { slug: 'professional-services', icon: 'professional', name: { en: 'Professional Services', hi: 'पेशेवर सेवाएँ' }, blurb: { en: 'Advisors, consultants and office work.', hi: 'सलाहकार, परामर्शदाता और कार्यालयी सेवाएँ।' }, find: { en: 'Find a Professional', hi: 'एक पेशेवर खोजें' } },
    { slug: 'automobile', icon: 'automobile', name: { en: 'Automobile', hi: 'ऑटोमोबाइल' }, blurb: { en: 'Showrooms, service centres and garages.', hi: 'शोरूम, सर्विस सेंटर और गैराज।' }, find: { en: 'Find an Auto Service', hi: 'ऑटो सेवा खोजें' } },
    { slug: 'real-estate', icon: 'realestate', name: { en: 'Real Estate', hi: 'रियल एस्टेट' }, blurb: { en: 'Property, builders and letting.', hi: 'संपत्ति, बिल्डर और किराये का काम।' }, find: { en: 'Find an Agent', hi: 'एक एजेंट खोजें' } },
    { slug: 'construction', icon: 'construction', name: { en: 'Construction', hi: 'निर्माण' }, blurb: { en: 'Builders, contractors and suppliers.', hi: 'बिल्डर, ठेकेदार और आपूर्तिकर्ता।' }, find: { en: 'Find a Builder', hi: 'एक बिल्डर खोजें' } },
    { slug: 'travel-transport', icon: 'travel', name: { en: 'Travel & Transport', hi: 'यात्रा और परिवहन' }, blurb: { en: 'Travel agents, transport and logistics.', hi: 'यात्रा एजेंट, परिवहन और लॉजिस्टिक्स।' }, find: { en: 'Find a Travel Agent', hi: 'एक यात्रा एजेंट खोजें' } },
    { slug: 'beauty-wellness', icon: 'beauty', name: { en: 'Beauty & Wellness', hi: 'सौंदर्य और कल्याण' }, blurb: { en: 'Salons, parlours and wellness.', hi: 'सैलून, पार्लर और कल्याण केंद्र।' }, find: { en: 'Find a Salon', hi: 'एक सैलून खोजें' } },
    { slug: 'local-services', icon: 'services', name: { en: 'Local Services', hi: 'स्थानीय सेवाएँ' }, blurb: { en: 'Repairs, plumbing, electrical and daily help.', hi: 'मरम्मत, प्लंबिंग, बिजली और दैनिक सहायता।' }, find: { en: 'Find a Service', hi: 'एक सेवा खोजें' } },
    { slug: 'other', icon: 'other', name: { en: 'Other', hi: 'अन्य' }, blurb: { en: 'Everything that does not fit elsewhere.', hi: 'जो किसी अन्य श्रेणी में नहीं आता।' }, find: { en: 'Browse other listings', hi: 'अन्य सूचियाँ देखें' } }
  ]

  /* Business type — a lighter facet than category. Only the types the
     records actually use are offered in the filters. */
  B.types = [
    { slug: 'shop', name: { en: 'Shop', hi: 'दुकान' } },
    { slug: 'eatery', name: { en: 'Eatery', hi: 'भोजनालय' } },
    { slug: 'service', name: { en: 'Service', hi: 'सेवा' } },
    { slug: 'clinic', name: { en: 'Clinic', hi: 'क्लिनिक' } },
    { slug: 'institution', name: { en: 'Institution', hi: 'संस्थान' } },
    { slug: 'workshop', name: { en: 'Workshop', hi: 'कार्यशाला' } }
  ]

  /* ---------------------------------------------------------------- */
  /* Businesses                                                        */
  /*                                                                   */
  /* B.businesses starts empty. A business is listed once its owner has */
  /* submitted the details and they have been checked.                  */
  /*                                                                   */
  /* Every commercial field must come from the owner and must never be  */
  /* assumed: name, phone, whatsapp, email, website, address,          */
  /* coordinates, opening hours, rating and review count. Leave a field */
  /* out rather than guessing it.                                      */
  /*                                                                   */
  /* Append a record shaped like this and every count, filter, badge,   */
  /* sort and page updates itself:                                    */
  /*   B.businesses.push({                                             */
  /*     id: 'business-01',                                           */
  /*     slug: 'the-business-name',                                    */
  /*     name: { en: 'Business Name', hi: 'व्यवसाय का नाम' },          */
  /*     category: 'restaurants-food',                                 */
  /*     subcategory: { en: 'Restaurant', hi: 'रेस्तराँ' },             */
  /*     type: 'eatery', area: 'buxar-town',                          */
  /*     description: { en: '…', hi: '…' },                            */
  /*     services: [{ en: '…', hi: '…' }],                            */
  /*     phone: '+91…', whatsapp: '919…', email: '…', website: '…',    */
  /*     address: '…', lat: 0, lng: 0, hours: '…',                     */
  /*     logo: 'assets/…', cover: 'assets/…',                          */
  /*     gallery: ['assets/…'], rating: null, reviewCount: 0,         */
  /*     verified: true, demo: false, createdAt: 'YYYY-MM-DD'          */
  /*   })                                                             */
  /* ---------------------------------------------------------------- */
B.businesses = [
    {
        'id': 'nic-001',
        'slug': 'phc-brahmpur',
        'name': {
            'en': 'PHC Brahmpur' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'brahampur',
        'description': {
            'en': 'Brahmpur Primary Health Centre. Medical officer listed by the district administration as Dr.Uday Shankar Tripathi.' },
        'phone': '7321896866',
        'whatsapp': '7321896866',
        'email': null,
        'website': null,
        'address': 'Dr.Uday Shankar Tripathi',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-002',
        'slug': 'phc-chakki',
        'name': {
            'en': 'PHC Chakki' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'buxar-town',
        'description': {
            'en': 'Chakki Primary Health Centre. Medical officer listed by the district administration as Dr.Nirmal Kumar Ojha.' },
        'phone': '9102225120',
        'whatsapp': '9102225120',
        'email': null,
        'website': null,
        'address': 'Dr.Nirmal Kumar Ojha',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-003',
        'slug': 'phc-chaugain',
        'name': {
            'en': 'PHC Chaugain' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'buxar-town',
        'description': {
            'en': 'Chaugain Primary Health Centre. Medical officer listed by the district administration as Dr.V P Singh.' },
        'phone': '9334025230',
        'whatsapp': '9334025230',
        'email': null,
        'website': null,
        'address': 'Dr.V P Singh',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-004',
        'slug': 'phc-chausa',
        'name': {
            'en': 'PHC Chausa' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'chausa',
        'description': {
            'en': 'Chausa Primary Health Centre. Medical officer listed by the district administration as Dr.Arun Kumar Srivastava.' },
        'phone': '9431021214',
        'whatsapp': '9431021214',
        'email': null,
        'website': null,
        'address': 'Dr.Arun Kumar Srivastava',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-005',
        'slug': 'phc-dumraon',
        'name': {
            'en': 'PHC Dumraon' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'dumraon',
        'description': {
            'en': 'Dumraon Primary Health Centre. Medical officer listed by the district administration as Dr. Ram Balak Prasad.' },
        'phone': '9470003167',
        'whatsapp': '9470003167',
        'email': null,
        'website': null,
        'address': 'Dr. Ram Balak Prasad',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-006',
        'slug': 'phc-itarhi',
        'name': {
            'en': 'PHC Itarhi' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'itarhi',
        'description': {
            'en': 'Itarhi Primary Health Centre. Medical officer listed by the district administration as Dr. S. N. Upadhyay.' },
        'phone': '7004845105',
        'whatsapp': '7004845105',
        'email': null,
        'website': null,
        'address': 'Dr. S. N. Upadhyay',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-007',
        'slug': 'phc-kesath',
        'name': {
            'en': 'PHC Kesath' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'buxar-town',
        'description': {
            'en': 'Kesath Primary Health Centre. Medical officer listed by the district administration as Dr.Bhola Chauhan.' },
        'phone': '9792985150',
        'whatsapp': '9792985150',
        'email': null,
        'website': null,
        'address': 'Dr.Bhola Chauhan',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-008',
        'slug': 'phc-nawanagar',
        'name': {
            'en': 'PHC Nawanagar' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'buxar-town',
        'description': {
            'en': 'Nawanagar Primary Health Centre. Medical officer listed by the district administration as Dr. Permanand Chaudhary.' },
        'phone': '9973496615',
        'whatsapp': '9973496615',
        'email': null,
        'website': null,
        'address': 'Dr. Permanand Chaudhary',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-009',
        'slug': 'phc-rajpur',
        'name': {
            'en': 'PHC Rajpur' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'rajpur',
        'description': {
            'en': 'Rajpur Primary Health Centre. Medical officer listed by the district administration as Dr.Ashok Kumar Paswan.' },
        'phone': '9470003165',
        'whatsapp': '9470003165',
        'email': null,
        'website': null,
        'address': 'Dr.Ashok Kumar Paswan',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-010',
        'slug': 'phc-simari',
        'name': {
            'en': 'PHC Simari' },
        'category': 'healthcare',
        'subcategory': {
            'en': 'Primary Health Centre' },
        'type': 'clinic',
        'area': 'buxar-town',
        'description': {
            'en': 'Simari Primary Health Centre. Medical officer listed by the district administration as Dr. Nirmal Kumar Ojha.' },
        'phone': '9470003168',
        'whatsapp': '9470003168',
        'email': null,
        'website': null,
        'address': 'Dr. Nirmal Kumar Ojha',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Outpatient care' },
            {
                'en': 'Primary healthcare' }
        ] },
    {
        'id': 'nic-011',
        'slug': 'm-p-high-school',
        'name': {
            'en': 'M P High School' },
        'category': 'education',
        'subcategory': {
            'en': 'Secondary School' },
        'type': 'institution',
        'area': 'buxar-town',
        'description': {
            'en': 'M P High School, Buxar. Contact published by the district administration.' },
        'phone': '9431066883',
        'whatsapp': '9431066883',
        'email': null,
        'website': null,
        'address': 'Buxar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-012',
        'slug': 'veer-kunwar-singh-college-of-agriculture',
        'name': {
            'en': 'Veer Kunwar Singh College of Agriculture' },
        'category': 'education',
        'subcategory': {
            'en': 'Agriculture College' },
        'type': 'institution',
        'area': 'dumraon',
        'description': {
            'en': 'Veer Kunwar Singh College of Agriculture, Dumraon — an academic unit of Dr. Bhimrao Ambedkar University of Agriculture, Buxar. Established 27 April 2010 by order of the Government of Bihar.' },
        'phone': null,
        'whatsapp': null,
        'email': 'vkscoa@bausabour.ac.in',
        'website': 'https://www.bausabour.ac.in/',
        'address': 'Dumraon',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-013',
        'slug': 'district-education-office-buxar',
        'name': {
            'en': 'District Education Office, Buxar' },
        'category': 'education',
        'subcategory': {
            'en': 'Education Department' },
        'type': 'institution',
        'area': 'buxar-town',
        'description': {
            'en': 'District Education Office, Buxar — office of the District Education Officer.' },
        'phone': '8544411179',
        'whatsapp': '8544411179',
        'email': null,
        'website': null,
        'address': 'Buxar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-014',
        'slug': 'punjab-national-bank',
        'name': {
            'en': 'Punjab National Bank' },
        'category': 'finance',
        'subcategory': {
            'en': 'Bank' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Punjab National Bank, Main Road Buxar, Buxar.' },
        'phone': '06183224389',
        'whatsapp': null,
        'email': null,
        'website': 'https://www.pnbindia.in',
        'address': 'Main Road Buxar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-015',
        'slug': 'state-bank-of-india',
        'name': {
            'en': 'State Bank Of India' },
        'category': 'finance',
        'subcategory': {
            'en': 'Bank' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'State Bank Of India, Munim Chowk, Buxar.' },
        'phone': '06183222061',
        'whatsapp': null,
        'email': null,
        'website': 'https://www.sbi.co.in',
        'address': 'Munim Chowk',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-016',
        'slug': 'uco-bank',
        'mono': 'UCO',
        'name': {
            'en': 'UCO BANK' },
        'category': 'finance',
        'subcategory': {
            'en': 'Bank' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'UCO BANK, BABA COMPLEX, AMLATOLI, Buxar, Bihar 802101, Buxar.' },
        'phone': '06183222575',
        'whatsapp': null,
        'email': null,
        'website': 'https://www.ucobank.com/english/home.aspx',
        'address': 'BABA COMPLEX, AMLATOLI, Buxar, Bihar 802101',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-017',
        'slug': 'dy-s-p-rakshit-buxar',
        'name': {
            'en': 'Dy.S.P(Rakshit Buxar)' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Dy.S.P(Rakshit Buxar), Buxar district. Contact published by the district police.' },
        'phone': '9031826706',
        'whatsapp': '9031826706',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-018',
        'slug': 'dy-s-p-traffic',
        'name': {
            'en': 'Dy.S.P(Traffic)' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Dy.S.P(Traffic), Buxar district. Contact published by the district police.' },
        'phone': '9031826708',
        'whatsapp': '9031826708',
        'email': 'dsp.traffbxr-bih@gov.in',
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-019',
        'slug': 'dy-s-p-cyber',
        'name': {
            'en': 'Dy.S.P(Cyber)' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Dy.S.P(Cyber), Buxar district. Contact published by the district police.' },
        'phone': '9031826710',
        'whatsapp': '9031826710',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-020',
        'slug': 'sergeant-major',
        'name': {
            'en': 'Sergeant Major' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Sergeant Major, Buxar district. Contact published by the district police.' },
        'phone': '9031826711',
        'whatsapp': '9031826711',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-021',
        'slug': 'circle-inspector-town',
        'name': {
            'en': 'Circle Inspector, Town' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Circle' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Circle Inspector, Town, Buxar district. Contact published by the district police.' },
        'phone': '9031826713',
        'whatsapp': '9031826713',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-022',
        'slug': 'circle-inspector-sadar',
        'name': {
            'en': 'Circle Inspector, Sadar' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Circle' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Circle Inspector, Sadar, Buxar district. Contact published by the district police.' },
        'phone': '9031826714',
        'whatsapp': '9031826714',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-023',
        'slug': 'circle-inspector-dumraon',
        'name': {
            'en': 'Circle Inspector, Dumraon' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Circle' },
        'type': 'service',
        'area': 'dumraon',
        'description': {
            'en': 'Circle Inspector, Dumraon, Buxar district. Contact published by the district police.' },
        'phone': '9031826715',
        'whatsapp': '9031826715',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-024',
        'slug': 'circle-inspector-brahampur',
        'name': {
            'en': 'Circle Inspector, Brahampur' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Circle' },
        'type': 'service',
        'area': 'brahampur',
        'description': {
            'en': 'Circle Inspector, Brahampur, Buxar district. Contact published by the district police.' },
        'phone': '9031826716',
        'whatsapp': '9031826716',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-025',
        'slug': 'sho-murar-p-s',
        'name': {
            'en': 'SHO, Murar P.S' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Station' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'SHO, Murar P.S, Buxar district. Contact published by the district police.' },
        'phone': '9031826737',
        'whatsapp': '9031826737',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-026',
        'slug': 'incharge-tilak-rai-ke-hata-o-p',
        'name': {
            'en': 'Incharge Tilak Rai Ke Hata O.P' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Incharge Tilak Rai Ke Hata O.P, Buxar district. Contact published by the district police.' },
        'phone': '9031826741',
        'whatsapp': '9031826741',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-027',
        'slug': 'incharge-ramdas-rai-ke-dera-o-p',
        'name': {
            'en': 'Incharge Ramdas Rai ke Dera O.P' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Incharge Ramdas Rai ke Dera O.P, Buxar district. Contact published by the district police.' },
        'phone': '9031826740',
        'whatsapp': '9031826740',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-028',
        'slug': 'incharge-chakki-o-p',
        'name': {
            'en': 'Incharge Chakki O.P' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Incharge Chakki O.P, Buxar district. Contact published by the district police.' },
        'phone': '9031826732',
        'whatsapp': '9031826732',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-029',
        'slug': 'traffic-thana',
        'name': {
            'en': 'Traffic Thana' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Traffic Thana, Buxar district. Contact published by the district police.' },
        'phone': '9031826743',
        'whatsapp': '9031826743',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-030',
        'slug': 'police-control-room',
        'name': {
            'en': 'Police Control Room' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'Police Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Police Control Room, Buxar district. Contact published by the district police.' },
        'phone': '9031826744',
        'whatsapp': '9031826744',
        'email': null,
        'website': null,
        'address': 'Buxar district, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15',
        'services': [
            {
                'en': 'Emergency response' },
            {
                'en': 'Law and order' }
        ] },
    {
        'id': 'nic-031',
        'slug': 'office-of-the-superintendent-of-police-buxar',
        'name': {
            'en': 'Office of the Superintendent of Police, Buxar' },
        'category': 'police-emergency',
        'subcategory': {
            'en': 'District Police Headquarters' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District police headquarters, Buxar — office of the Superintendant of Police.' },
        'phone': '9431822981',
        'whatsapp': '9431822981',
        'email': null,
        'website': null,
        'address': 'Buxar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-032',
        'slug': 'additional-collector-revenue-buxar',
        'name': {
            'en': 'Additional Collector (Revenue), Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'General Administration' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Additional Collector (Revenue), Buxar — General Administration department, district administration Buxar.' },
        'phone': '9473191239',
        'whatsapp': '9473191239',
        'email': 'dm-buxar.bih@nic.in',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-033',
        'slug': 'additional-collector-revenue-buxar',
        'name': {
            'en': 'Additional Collector (Revenue), Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Revenue' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Additional Collector (Revenue), Buxar — Revenue department, district administration Buxar.' },
        'phone': '9473191240',
        'whatsapp': '9473191240',
        'email': 'admbuxar@gmail.com',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-034',
        'slug': 'office-of-the-civil-surgeon-buxar',
        'name': {
            'en': 'Office of the Civil Surgeon, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Health' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Office of the Civil Surgeon, Buxar — Health department, district administration Buxar.' },
        'phone': '9470003163',
        'whatsapp': '9470003163',
        'email': 'dhsbxr@gmail.com',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-035',
        'slug': 'district-agriculture-office-buxar',
        'name': {
            'en': 'District Agriculture Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Agriculture' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Agriculture Office, Buxar — Agriculture department, district administration Buxar.' },
        'phone': '9431818799',
        'whatsapp': '9431818799',
        'email': 'dao-bux-bih@nic.in',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-036',
        'slug': 'district-education-office-buxar',
        'name': {
            'en': 'District Education Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Education' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Education Office, Buxar — Education department, district administration Buxar.' },
        'phone': '8544411179',
        'whatsapp': '8544411179',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-037',
        'slug': 'office-of-the-commercial-taxes-officer-buxar',
        'name': {
            'en': 'Office of the Commercial Taxes Officer, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Commercial Taxes' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Office of the Commercial Taxes Officer, Buxar — Commercial Taxes department, district administration Buxar.' },
        'phone': '8507707134',
        'whatsapp': '8507707134',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-038',
        'slug': 'district-fisheries-office-buxar',
        'name': {
            'en': 'District Fisheries Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Fisheries' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Fisheries Office, Buxar — Fisheries department, district administration Buxar.' },
        'phone': '9473191572',
        'whatsapp': '9473191572',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-039',
        'slug': 'district-horticulture-office-buxar',
        'name': {
            'en': 'District Horticulture Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Horticulture' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Horticulture Office, Buxar — Horticulture department, district administration Buxar.' },
        'phone': '9431818929',
        'whatsapp': '9431818929',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-040',
        'slug': 'district-planning-office-buxar',
        'name': {
            'en': 'District Planning Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Planning' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Planning Office, Buxar — Planning department, district administration Buxar.' },
        'phone': '9199950305',
        'whatsapp': '9199950305',
        'email': 'dpo-bux-bih@nic.in',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-041',
        'slug': 'district-transport-office-buxar',
        'name': {
            'en': 'District Transport Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Transport' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Transport Office, Buxar — Transport department, district administration Buxar.' },
        'phone': '6202751042',
        'whatsapp': '6202751042',
        'email': 'dto-bux-bih@nic.in',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-042',
        'slug': 'district-welfare-office-buxar',
        'name': {
            'en': 'District Welfare Office, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Welfare' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'District Welfare Office, Buxar — Welfare department, district administration Buxar.' },
        'phone': '7277880418',
        'whatsapp': '7277880418',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-043',
        'slug': 'office-of-the-district-magistrate-buxar',
        'name': {
            'en': 'Office of the District Magistrate, Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'General Administration' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Collectorate and district magistrate office, Buxar.' },
        'phone': '9473191239',
        'whatsapp': '9473191239',
        'email': 'dm-buxar.bih@nic.in',
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-044',
        'slug': 'nagar-parishad-buxar',
        'name': {
            'en': 'Nagar Parishad Buxar' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Municipal Body' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Nagar Parishad Buxar — the municipal body for Buxar, Buxar district.' },
        'phone': '9470488456',
        'whatsapp': '9470488456',
        'email': null,
        'website': null,
        'address': 'Buxar, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-045',
        'slug': 'nagar-parishad-dumraon',
        'name': {
            'en': 'Nagar Parishad Dumraon' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Municipal Body' },
        'type': 'service',
        'area': 'dumraon',
        'description': {
            'en': 'Nagar Parishad Dumraon — the municipal body for Dumraon, Buxar district.' },
        'phone': '9470488456',
        'whatsapp': '9470488456',
        'email': null,
        'website': null,
        'address': 'Dumraon, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-046',
        'slug': 'south-bihar-power-distribution-company-buxar',
        'mono': 'SBPDC',
        'name': {
            'en': 'South Bihar Power Distribution Company — Buxar' },
        'category': 'utilities',
        'subcategory': {
            'en': 'Electricity Distribution' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Buxar division of South Bihar Power Distribution Company Limited — supply, billing and fuse complaints.' },
        'phone': '7033095837',
        'whatsapp': '7033095837',
        'email': null,
        'website': null,
        'address': 'Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-047',
        'slug': 'alpawas-grih',
        'name': {
            'en': 'ALPAWAS GRIH' },
        'category': 'community',
        'subcategory': {
            'en': 'Community Organisation' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'ALPAWAS GRIH, Buxar.' },
        'phone': '06183295825',
        'whatsapp': null,
        'email': null,
        'website': null,
        'address': 'Mahatma Gandhi Nagar, Bazar Samiti Road. Near Ara Machine. Buxar.',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-048',
        'slug': 'child-welfare-committee',
        'name': {
            'en': 'Child Welfare Committee' },
        'category': 'community',
        'subcategory': {
            'en': 'Community Organisation' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Child Welfare Committee, Buxar.' },
        'phone': '8877991777',
        'whatsapp': '8877991777',
        'email': null,
        'website': null,
        'address': 'Dr. Ramesh Chandra Pandey (Chairman) Mobile-8877991777',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-049',
        'slug': 'block-development-office-rajpur',
        'name': {
            'en': 'Block Development Office, Rajpur' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Block Office' },
        'type': 'service',
        'area': 'rajpur',
        'description': {
            'en': 'Block Development Officer, Rajpur block — rural development office for the block.' },
        'phone': '9031071440',
        'whatsapp': '9031071440',
        'email': null,
        'website': null,
        'address': 'Rajpur, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-050',
        'slug': 'block-development-office-brahampur',
        'name': {
            'en': 'Block Development Office, Brahampur' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Block Office' },
        'type': 'service',
        'area': 'brahampur',
        'description': {
            'en': 'Block Development Officer, Brahampur block — rural development office for the block.' },
        'phone': '9031071431',
        'whatsapp': '9031071431',
        'email': null,
        'website': null,
        'address': 'Brahampur, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-051',
        'slug': 'block-development-office-chakki',
        'name': {
            'en': 'Block Development Office, Chakki' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Block Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Block Development Officer, Chakki block — rural development office for the block.' },
        'phone': '9031071433',
        'whatsapp': '9031071433',
        'email': null,
        'website': null,
        'address': 'Chakki, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-052',
        'slug': 'block-development-office-chaugai',
        'name': {
            'en': 'Block Development Office, Chaugai' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Block Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Block Development Officer, Chaugai block — rural development office for the block.' },
        'phone': '9031071435',
        'whatsapp': '9031071435',
        'email': null,
        'website': null,
        'address': 'Chaugai, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' },
    {
        'id': 'nic-053',
        'slug': 'block-development-office-simri',
        'name': {
            'en': 'Block Development Office, Simri' },
        'category': 'civic-offices',
        'subcategory': {
            'en': 'Block Office' },
        'type': 'service',
        'area': 'buxar-town',
        'description': {
            'en': 'Block Development Officer, Simri block — rural development office for the block.' },
        'phone': '9031071441',
        'whatsapp': '9031071441',
        'email': null,
        'website': null,
        'address': 'Simri, Buxar, Bihar',
        'logo': null,
        'cover': null,
        'gallery': [],
        'rating': null,
        'reviewCount': 0,
        'verified': true,
        'demo': false,
        'source': 'Government of Bihar — District Administration Buxar (buxar.nic.in)',
        'createdAt': '2026-01-15' }
]

  /* ------------------------------------------------------------------ */
  /* Derivation helpers. These read the array above so counts, filters  */
  /* and badges can never drift from the records themselves.            */
  /* ------------------------------------------------------------------ */

  B.catBySlug = function (slug) {
    for (var i = 0; i < B.categories.length; i++) if (B.categories[i].slug === slug) return B.categories[i]
    return null
  }
  B.areaBySlug = function (slug) {
    for (var i = 0; i < B.areas.length; i++) if (B.areas[i].slug === slug) return B.areas[i]
    return null
  }
  B.typeBySlug = function (slug) {
    for (var i = 0; i < B.types.length; i++) if (B.types[i].slug === slug) return B.types[i]
    return null
  }
  B.bySlug = function (slug) {
    for (var i = 0; i < B.businesses.length; i++) if (B.businesses[i].slug === slug) return B.businesses[i]
    return null
  }
  B.catIcon = function (slug) {
    var c = B.catBySlug(slug)
    return (c && B.icons[c.icon]) || B.icons.other
  }

  /* Categories that at least one record actually uses. */
  B.activeCategories = function () {
    var seen = {}, out = []
    for (var i = 0; i < B.businesses.length; i++) {
      var s = B.businesses[i].category
      if (s && !seen[s]) { seen[s] = true; out.push(s) }
    }
    out.sort()
    return out.map(B.catBySlug).filter(Boolean)
  }

  B.countIn = function (category, area) {
    var n = 0
    for (var i = 0; i < B.businesses.length; i++) {
      var b = B.businesses[i]
      if (category && b.category !== category) continue
      if (area && b.area !== area) continue
      n++
    }
    return n
  }

  /* Services actually present, as {key,label} sorted by key. */
  B.activeServices = function () {
    var seen = {}
    for (var i = 0; i < B.businesses.length; i++) {
      var svc = B.businesses[i].services || []
      for (var j = 0; j < svc.length; j++) {
        var lbl = B.get(svc[j])
        if (lbl) seen[lbl] = svc[j]
      }
    }
    return Object.keys(seen).sort().map(function (k) {
      return { key: k, label: seen[k] }
    })
  }

  /* Any record with a real, verified map position. Empty until a
     business supplies coordinates — the map then stays hidden rather
     than dropping a pin somewhere approximate. */
  B.mapBusinesses = function () {
    return B.businesses.filter(function (b) { return b.coords && b.coordsVerified })
  }
  B.hasVerified = function () {
    return B.businesses.some(function (b) { return b.verified === true })
  }
  B.hasHours = function () {
    return B.businesses.some(function (b) { return b.hours })
  }
  B.hasPrice = function () {
    return B.businesses.some(function (b) { return b.priceCategory })
  }
  B.hasGallery = function () {
    return B.businesses.some(function (b) { return b.gallery && b.gallery.length })
  }

  /* Take `n` records spread evenly across every category, newest first inside
     each category. Used by the homepage preview so no single field can take
     over the whole grid. */
  B.spread = function (list, n) {
    var buckets = {}
    var order = []
    list.slice().sort(function (a, b) {
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    }).forEach(function (b) {
      var c = b.category || 'other'
      if (!buckets[c]) { buckets[c] = []; order.push(c) }
      buckets[c].push(b)
    })

    var out = []
    var round = 0
    while (out.length < n) {
      var added = false
      for (var i = 0; i < order.length && out.length < n; i++) {
        var b = buckets[order[i]][round]
        if (b) { out.push(b); added = true }
      }
      if (!added) break
      round++
    }
    return out
  }

  /* ------------------------------------------------------------------ */
  /* Logo / monogram                                                    */
  /* ------------------------------------------------------------------ */
  /* A record shows its real logo when `biz.logo` points at an image.    */
  /* Everything else falls back to a typographic acronym built from the  */
  /* first letter of each significant word — "State Bank of India"      */
  /* becomes SBI, "Punjab National Bank" becomes PNB, "District         */
  /* Agriculture Office" becomes DAO.                                   */
  /*                                                                     */
  /* The acronym comes only from the name, so it can never assert a mark */
  /* the organisation does not actually use.                            */
  /* ------------------------------------------------------------------ */

  /* Words that carry no identity in an acronym. */
  var MONO_SKIP = { of: 1, the: 1, and: 1, for: 1, at: 1, in: 1, on: 1, a: 1, an: 1, to: 1, de: 1, da: 1, ke: 1 }

  B.monogram = function (biz) {
    /* An explicit `mono` on the record always wins. Some bodies are known
       by a longer initialism than a 3-letter acronym can express — the
       power distributor is SBPDC, not SBP — so those set it directly. */
    if (typeof biz.mono === 'string' && biz.mono.trim()) {
      return biz.mono.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)
    }

    var name = B.get(biz.name) || ''
    var words = String(name)
      .replace(/[(),.\/\-\u2013\u2014:]/g, ' ')
      .split(/\s+/)
      .map(function (w) { return w.replace(/[^A-Za-z]/g, '') })
      .filter(Boolean)
    if (!words.length) return '?'

    var significant = words.filter(function (w) { return !MONO_SKIP[w.toLowerCase()] })
    var source = (significant.length ? significant : words).slice(0, 3)

    /* No automatic initialism handling here. "UCO BANK" and "PHC Brahmpur"
       both open with a capitalised abbreviation, but only the first is the
       organisation's actual mark — reducing the second would throw away the
       place name and make all ten health centres identical. Records that
       need a longer or non-derivable mark set `mono` explicitly instead. */

    if (source.length >= 2) {
      return source.map(function (w) { return w[0] }).join('').toUpperCase()
    }
    return words.join('').slice(0, 3).toUpperCase() || '?'
  }

  /* True when the record carries a real logo image. */
  B.hasLogo = function (biz) {
    return typeof biz.logo === 'string' && biz.logo.length > 3
  }

  B.logoUrl = function (biz) {
    return B.hasLogo(biz) ? url(biz.logo) : ''
  }

  /* A stable per-record hue so neighbouring tiles are not clones. Derived
     from the slug, so it is identical on every page load. */
  B.monogramTone = function (biz) {
    var s = String(biz.slug || (biz.name && biz.name.en) || '')
    var h = 0
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
    /* Mapped into a narrow navy→steel-blue band. A full 0–360 range would
       produce olive and rust tiles that fight the navy/gold identity, so
       the variation is kept deliberately subtle. */
    return 196 + (h % 40)
  }

  /* Distinct verification badge value — always false until a backend
     marks a record. Never derived from anything else. */
  B.isVerified = function (biz) { return biz.verified === true }

  B.profileUrl = function (biz) { return url('business/profile.html?slug=' + biz.slug) }
  B.listUrl = function (q) { return url('business/list.html') + (q || '') }
  B.catUrl = function (slug) { return url('business/list.html?cat=' + slug) }
  B.areaUrl = function (slug) { return url('business/list.html?loc=' + slug) }
  B.areaExploreUrl = function (slug) { return url('explore/' + slug + '/') }
  B.addUrl = function () { return url('business/add.html') }
  B.claimUrl = function () { return url('business/claim.html') }
  B.directoryUrl = function () { return url('business.html') }
})()