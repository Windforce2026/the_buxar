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
/*   Nothing here is a real business. The eight records in            */
/*   L.businesses are DEMO records (demo: true). They exist only to    */
/*   prove the layout, filters, sorting and empty states work. They    */
/*   deliberately carry:                                             */
/*     - no phone, whatsapp, email, website or social links            */
/*     - no address, coordinates or opening hours                      */
/*     - no rating and no reviews                                     */
/*     - verified: false                                              */
/*   The UI renders those as honest empty states rather than inventing */
/*   values. Replace them by appending real records to the array; every */
/*   filter, count, badge and page updates itself with no code change.  */
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

    /* Demo / data-honesty strings */
    demoBadge: { en: 'Demo record', hi: 'डेमो रिकॉर्ड' },
    demoNotice: {
      en: 'No business listings have been submitted yet. The records below are clearly marked demo placeholders that exist only to show how a real listing will look. No phone numbers, addresses, ratings, opening hours or verification badges have been invented.',
      hi: 'अभ तक कोई व्यवसाय सूचीबद्ध नहीं की गई है। नीचे दिए गए रिकॉर्ड स्पष्ट रूप से चिह्नित डेमो प्लेसहोल्डर हैं, जो केवल यह दिखाने के लिए हैं कि वास्तविक सूची कैसी दिखेगी। कोई फ़ोन नंबर, पता, रेटिंग, खुलने का समय या सत्यापन बैज नहीं बनाया गया है।'
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
    notProvided: { en: 'Not provided yet', hi: 'अभी उपलब्ध नहीं' },
    noPhoneNote: { en: 'No phone number has been submitted for this listing.', hi: 'इस सूची के लिए कोई फ़ोन नंबर प्रस्तुत नहीं किया गया है।' },
    noAddressNote: { en: 'No street address or coordinates have been submitted, so no map position is shown rather than an approximate one.', hi: 'कोई पता या निर्देशांक प्रस्तुत नहीं किया गया है, इसलिए अनुमानित स्थान के बजाय कोई मानचित्र स्थिति नहीं दिखाई गई।' },
    getDirections: { en: 'Get directions', hi: 'दिशा प्राप्त करें' },
    comingSoon: { en: 'Reviews coming soon', hi: 'समीक्षाएँ जल्द आ रही हैं' },
    comingSoonSub: {
      en: 'No review system exists yet, and no reviews have been written. Nothing here is invented \u2014 this panel is ready for real reviews when they arrive.',
      hi: 'अभी कोई समीक्षा प्रणाली नहीं है, और कोई समीक्षा लिखी नहीं गई है। यहाँ कुछ भी बनाया नहीं गया \u2014 यह पैनल वास्तविक समीक्षाओं के लिए तैयार है।'
    },
    noPhotos: { en: 'No photos yet', hi: 'अभी कोई फ़ोटो नहीं' },
    noPhotosSub: { en: 'Logo, cover, interior and product photos can be added by the owner once the listing is claimed.', hi: 'सूची क्लेम होने पर मालिक लोगो, कवर, आंतरिक और उत्पाद फ़ोटो जोड़ सकते हैं।' },
    photoCredit: { en: 'Photo', hi: 'फ़ोटो' },
    demoProfileNote: {
      en: 'This is a demo record. Every field below is empty on purpose \u2014 the profile renders the honest empty state rather than placeholder contact details.',
      hi: 'यह एक डेमो रिकॉर्ड है। नीचे का हर फ़ील्ड जानबूझकर खाली है \u2014 प्रोफ़ाइल नकली संपर्क विवरण के बजाय ईमानदार खाली स्थिति दिखाती है।'
    },

    /* Add / claim */
    addTitle: { en: 'Add your business', hi: 'अपना व्यवसाय जोड़ें' },
    addSub: {
      en: 'This form is the front-end structure only. There is no database behind it yet, so submitting it does not store or publish anything.',
      hi: 'यह फ़ॉर्म केवल फ्रंट-एंड संरचना है। इसके पीछे अभी कोई डेटाबेस नहीं है, इसलिए इसे जमा करने से कुछ भी संग्रहीत या प्रकाशित नहीं होता।'
    },
    claimTitle: { en: 'Claim this business', hi: 'इस व्यवसाय को क्लेम करें' },
    claimSub: {
      en: 'Claiming lets an owner update their own listing. No verification service is connected yet \u2014 a submission is not checked by anyone at the moment.',
      hi: 'क्लेम करने से मालिक अपनी सूची अपडेट कर सकता है। अभी कोई सत्यापन सेवा जुड़ी नहीं है \u2014 इस समय कोई जमा आवेदन किसी द्वारा जाँचा नहीं जाता।'
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
    noRating: { en: 'No rating yet', hi: 'अभी कोई रेटिंग नहीं' },
    home: { en: 'Home', hi: 'होम' },
    pending: { en: 'Not added yet.', hi: 'अभी नहीं जोड़ा गया।' },
    phone: { en: 'Phone', hi: 'फ़ोन' },
    photogPending: {
      en: 'Photography pending — real imagery can be added once this listing is claimed.',
      hi: 'फ़ोटोग्राफ़ी लंबित — सूची क्लेम होने पर वास्तविक तस्वीरें जोड़ी जा सकती हैं।'
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
      en: 'Nearby businesses are matched to a destination only once verified location data exists. Nothing is guessed here.',
      hi: 'आस-पास के व्यवसाय तभी किसी गंतव्य से जुड़ते हैं जब सत्यापित स्थान डेटा उपलब्ध हो। यहाँ कुछ भी अनुमान नहीं लगाया गया।'
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
    { slug: 'restaurants-food', icon: 'food', name: { en: 'Restaurants & Food', hi: 'रेस्तराँ और भोजन' }, blurb: { en: 'Eateries, food counters and local cuisine.', hi: 'भोजनालय, फ़ूड काउंटर और स्थानीय भोजन।' }, find: { en: 'Find a Restaurant', hi: 'एक रेस्तराँ खोजें' } },
    { slug: 'hotels-stays', icon: 'stay', name: { en: 'Hotels & Stays', hi: 'होटल और ठहरना' }, blurb: { en: 'Hotels, guest houses and places to stay.', hi: 'होटल, अतिथि गृह और ठरने की जगहें।' }, find: { en: 'Find a Hotel', hi: 'एक होटल खोजें' } },
    { slug: 'healthcare', icon: 'health', name: { en: 'Healthcare', hi: 'स्वास्थ्य सेवा' }, blurb: { en: 'Clinics, hospitals, diagnostics and care.', hi: 'क्लिनिक, अस्पताल, निदान और देखभाल।' }, find: { en: 'Find a Doctor', hi: 'एक डॉक्टर खोजें' } },
    { slug: 'education', icon: 'education', name: { en: 'Education', hi: 'शिक्षा' }, blurb: { en: 'Schools, colleges and training centres.', hi: 'विद्यालय, महाविद्यालय और प्रशिक्षण केंद्र।' }, find: { en: 'Find a School', hi: 'एक विद्यालय खोजें' } },
    { slug: 'shopping', icon: 'shopping', name: { en: 'Shopping', hi: 'खरीदारी' }, blurb: { en: 'Shops, boutiques and retail stores.', hi: 'दुकानें, बुटीक और खुदरा भंडार।' }, find: { en: 'Find a Shop', hi: 'एक दुकान खोजें' } },
    { slug: 'retail', icon: 'retail', name: { en: 'Retail', hi: 'फुटरायल' }, blurb: { en: 'General retail and everyday goods.', hi: 'सामान्य फुटरायल और रोज़मर्रा का सामान।' }, find: { en: 'Find a Retailer', hi: 'एक फुटरायलर खोजें' } },
    { slug: 'professional-services', icon: 'professional', name: { en: 'Professional Services', hi: 'पेशेवर सेवाएँ' }, blurb: { en: 'Advisors, consultants and office work.', hi: 'सलाहकार, परामर्शदाता और कार्यालयी सेवाएँ।' }, find: { en: 'Find a Professional', hi: 'एक पेशेवर खोजें' } },
    { slug: 'automobile', icon: 'automobile', name: { en: 'Automobile', hi: 'ऑटोमोबाइल' }, blurb: { en: 'Showrooms, service centres and garages.', hi: 'शोरूम, सर्विस सेंटर और गैराज।' }, find: { en: 'Find an Auto Service', hi: 'ऑटो सेवा खोजें' } },
    { slug: 'real-estate', icon: 'realestate', name: { en: 'Real Estate', hi: 'रियल एस्टेट' }, blurb: { en: 'Property, builders and letting.', hi: 'संपत्ति, बिल्डर और किराये का काम।' }, find: { en: 'Find an Agent', hi: 'एक एजेंट खोजें' } },
    { slug: 'finance', icon: 'finance', name: { en: 'Finance', hi: 'वित्त' }, blurb: { en: 'Banks, agents and financial services.', hi: 'बैंक, एजेंट और वित्तीय सेवाएँ।' }, find: { en: 'Find a Bank', hi: 'एक बैंक खोजें' } },
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

  /* ------------------------------------------------------------------ */
  /* Demo records.                                                     */
  /*                                                                     */
  /* Read this before adding a real one: these eight are placeholders.  */
  /* They carry a name, a category, an area, a subcategory, a demo      */
  /* description, a list of demo service labels and timestamps — and */
  /* nothing else. Every contact field is null on purpose, every        */
  /* `verified` flag is false, every rating is null. The renderer       */
  /* shows an honest empty state for each of those instead of          */
  /* inventing a value.                                                 */
  /*                                                                     */
  /* To add a real business, append an object with the same shape.      */
  /* Nothing else needs to change: counts, filters, badges, sorting,    */
  /* pagination and the "verified" filter all read from this array.     */
  /* ------------------------------------------------------------------ */
  B.businesses = [
    {
      id: 'demo-01',
      slug: 'demo-kitchen-buxar-town',
      name: { en: 'Demo Kitchen', hi: 'डेमो किचन' },
      category: 'restaurants-food',
      subcategory: { en: 'Restaurant', hi: 'रेस्तराँ' },
      type: 'eatery',
      area: 'buxar-town',
      description: {
        en: 'Placeholder record. It exists to show the business card, the profile layout and the contact empty state \u2014 not to describe a real eatery.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। यह व्यापार कार्ड, प्रोफ़ाइल लेआउट और संपर्क खाली स्थिति दिखाने के लिए है \u2014 किसी वास्तविक भोजनालय का वर्णन करने के लिए नहीं।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder service A', hi: 'प्लेसहोल्डर सेवा A' },
        { en: 'Placeholder service B', hi: 'प्लेसहोल्डर सेवा B' },
        { en: 'Placeholder service C', hi: 'प्लेसहोल्डर सेवा C' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-01-12',
      updatedAt: '2026-01-12',
      demo: true
    },
    {
      id: 'demo-02',
      slug: 'demo-clinic-buxar-town',
      name: { en: 'Demo Clinic', hi: 'डेमो क्लिनिक' },
      category: 'healthcare',
      subcategory: { en: 'Clinic', hi: 'क्लिनिक' },
      type: 'clinic',
      area: 'buxar-town',
      description: {
        en: 'Placeholder record. It carries no doctor name, no registration number and no address, because none has been verified.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। इसमें कोई डॉक्टर का नाम, पंजीकरण संख्या या पता नहीं है, क्योंकि कुछ भी सत्यापित नहीं है।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder consultation', hi: 'प्लेसहोल्डर परामर्श' },
        { en: 'Placeholder diagnostics', hi: 'प्लेसहोल्डर निदान' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-02-03',
      updatedAt: '2026-02-03',
      demo: true
    },
    {
      id: 'demo-03',
      slug: 'demo-electronics-buxar-town',
      name: { en: 'Demo Electronics', hi: 'डेमो इलेक्ट्रॉनिक्स' },
      category: 'shopping',
      subcategory: { en: 'Retail store', hi: 'खुदरा भंडार' },
      type: 'shop',
      area: 'buxar-town',
      description: {
        en: 'Placeholder record. Brand names, prices and stock are deliberately absent \u2014 inventing them would misrepresent a real trade.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। ब्रांड नाम, मूल्य और स्टॉक जानबूझकर नहीं दिए गए \u2014 उन्हें बनाना वास्तविक व्यापार का गलत प्रतिनिधित्व करेगा।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder service A', hi: 'प्लेसहोल्डर सेवा A' },
        { en: 'Placeholder repair', hi: 'प्लेसहोल्डर मरम्मत' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-02-20',
      updatedAt: '2026-02-20',
      demo: true
    },
    {
      id: 'demo-04',
      slug: 'demo-stay-dumraon',
      name: { en: 'Demo Stay', hi: 'डेमो स्टे' },
      category: 'hotels-stays',
      subcategory: { en: 'Guest house', hi: 'अतिथि गृह' },
      type: 'shop',
      area: 'dumraon',
      description: {
        en: 'Placeholder record. Room count, tariff and amenities are left empty because none has been verified.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। कमरों की संख्या, किराया और सुविधाएँ खाली छोड़ी गई हैं क्योंकि कुछ भी सत्यापित नहीं है।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder rooms', hi: 'प्लेसहोल्डर कमरे' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-03-05',
      updatedAt: '2026-03-05',
      demo: true
    },
    {
      id: 'demo-05',
      slug: 'demo-salon-brahampur',
      name: { en: 'Demo Salon', hi: 'डेमो सैलून' },
      category: 'beauty-wellness',
      subcategory: { en: 'Salon', hi: 'सैलून' },
      type: 'shop',
      area: 'brahampur',
      description: {
        en: 'Placeholder record. No staff names or price lists are shown, because none has been verified.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। किसी कर्मचारी का नाम या मूल्य सूची नहीं दिखाई गई, क्योंकि कुछ भी सत्यापित नहीं है।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder haircut', hi: 'प्लेसहोल्डर हेयरकट' },
        { en: 'Placeholder facial', hi: 'प्लेसहोल्डर फेशियल' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-03-22',
      updatedAt: '2026-03-22',
      demo: true
    },
    {
      id: 'demo-06',
      slug: 'demo-academy-chausa',
      name: { en: 'Demo Academy', hi: 'डेमो अकादमी' },
      category: 'education',
      subcategory: { en: 'Training centre', hi: 'प्रशिक्षण केंद्र' },
      type: 'institution',
      area: 'chausa',
      description: {
        en: 'Placeholder record. No affiliation, registration or faculty details are claimed.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। किसी संबंधन, पंजीकरण या शिक्षक विवरण का दावा नहीं किया गया।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder course A', hi: 'प्लेसहोल्डर कोर्स A' },
        { en: 'Placeholder course B', hi: 'प्लेसहोल्डर कोर्स B' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-04-08',
      updatedAt: '2026-04-08',
      demo: true
    },
    {
      id: 'demo-07',
      slug: 'demo-auto-works-itarhi',
      name: { en: 'Demo Auto Works', hi: 'डेमो ऑटो वर्क्स' },
      category: 'automobile',
      subcategory: { en: 'Service centre', hi: 'सर्विस सेंटर' },
      type: 'workshop',
      area: 'itarhi',
      description: {
        en: 'Placeholder record. No brands serviced, licence or workshop address are listed.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। किसी ब्रांड, लाइसेंस या कार्यशाला पते की सूची नहीं दी गई।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder servicing', hi: 'प्लेसहोल्डर सर्विसिंग' },
        { en: 'Placeholder repair', hi: 'प्लेसहोल्डर मरम्मत' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-04-27',
      updatedAt: '2026-04-27',
      demo: true
    },
    {
      id: 'demo-08',
      slug: 'demo-hardware-rajpur',
      name: { en: 'Demo Hardware', hi: 'डेमो हार्डवेयर' },
      category: 'local-services',
      subcategory: { en: 'Hardware', hi: 'हार्डवेयर' },
      type: 'shop',
      area: 'rajpur',
      description: {
        en: 'Placeholder record. This is the only record filed under Rajpur, so the area page shows a single entry rather than an invented list.',
        hi: 'प्लेसहोल्डर रिकॉर्ड। यह राजपुर में दर्ज एकमात्र रिकॉर्ड है, इसलिए क्षेत्र पृष्ठ बनाई सूची के बजाय एक प्रविष्टि दिखाता है।'
      },
      address: null,
      coords: null,
      coordsVerified: false,
      phone: null,
      whatsapp: null,
      email: null,
      website: null,
      socialLinks: [],
      services: [
        { en: 'Placeholder supply', hi: 'प्लेसहोल्डर आपूर्ति' }
      ],
      hours: null,
      logo: null,
      coverImage: null,
      gallery: [],
      verified: false,
      rating: null,
      reviewCount: 0,
      priceCategory: null,
      createdAt: '2026-05-14',
      updatedAt: '2026-05-14',
      demo: true
    }
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

  /* Two-letter monogram used in place of a logo. Never a substitute for
     real photography — it is a typographic placeholder, deliberately
     plain, so an unbranded record cannot look like a real brand. */
  B.monogram = function (biz) {
    var name = B.get(biz.name) || '?'
    var parts = name.trim().split(/\s+/).filter(function (w) { return /[a-z]/i.test(w) })
    var mono = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0])
      : name.replace(/[^a-z]/gi, '').slice(0, 2)
    return (mono || '?').toUpperCase()
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