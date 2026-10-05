/* ------------------------------------------------------------------ */
/* TheBuxar.com — Current Buxar / News dataset (pure vanilla, no deps) */
/*                                                                     */
/* Single structured data object for the CURRENT BUXAR module.        */
/* The HTML pages carry only a shell; this file is the one source of  */
/* truth for news articles, events, festivals and city-life topics.   */
/*                                                                     */
/* Language: bilingual via N.get() at render time. Static shells keep */
/* their data-en/data-hi markup handled by main.js.                  */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  var N = window.TheBuxarNews = window.TheBuxarNews || {}

  N.get = function (obj) {
    if (typeof obj === 'string') return obj
    return obj ? (obj[lang()] || obj.en || '') : ''
  }

  /* Base for relative asset + page URLs. news.js reads
     window.TheBuxarConfig.path ('./' at root) and sets this. */
  N.path = ''

  function url (p) { return N.path + p }

  /* ------------------------------------------------------------------ */
  /* Icon system                                                         */
  /* ------------------------------------------------------------------ */
  var ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
  N.icons = {
    arrow: '<svg ' + ICON + '><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>',
    calendar: '<svg ' + ICON + '><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    pin: '<svg ' + ICON + '><path d="M12 21s6-5.4 6-9.5A6 6 0 0 0 6 11.5C6 15.6 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    clock: '<svg ' + ICON + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    tag: '<svg ' + ICON + '><path d="M3 12V4h8l9 9-8 8-9-9Z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
    image: '<svg ' + ICON + '><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 16 4-4 3 3 5-5.5 2.5 2.5"/></svg>',
    doc: '<svg ' + ICON + '><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    share: '<svg ' + ICON + '><circle cx="6" cy="12" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="m8.2 10.8 6.6-3.6M8.2 13.2l6.6 3.6"/></svg>'
  }

  /* ------------------------------------------------------------------ */
  /* Bilingual UI copy                                                   */
  /* ------------------------------------------------------------------ */
  N.ui = {
    heroLabel: { en: 'Current Buxar', hi: 'करेंट बक्सर' },
    heroTitle: { en: 'Buxar, Today', hi: 'बक्सर, आज' },
    heroSub: {
      en: 'Discover the people, events, celebrations, stories and developments shaping Buxar right now.',
      hi: 'बक्सर को आज आकार देने वाले लोगों, कार्यक्रमों, त्योहारों, कहानियों और विकास को जानें।'
    },
    exploreLatest: { en: 'Explore Latest', hi: 'ताज़ा देखें' },
    viewEvents: { en: 'View Events', hi: 'कार्यक्रम देखें' },

    featuredLabel: { en: 'Featured Story', hi: 'मुख्य कहानी' },
    featuredTitle: { en: 'Stories from Buxar', hi: 'बक्सर की कहानियाँ' },
    featuredSub: {
      en: 'The people, places and moments that define Buxar — told with care and pride.',
      hi: 'बक्सर को परिभाषित करने वाले लोग, स्थान और पल — ध्यान और गर्व के साथ कही गईं।'
    },
    readStory: { en: 'Read Story →', hi: 'कहानी पढ़ें →' },

    durgaLabel: { en: 'Durga Ji · Durga Puja', hi: 'दुर्गा जी · दुर्गा पूजा' },
    durgaTitle: { en: 'Durga Puja in Buxar', hi: 'बक्सर में दुर्गा पूजा' },
    durgaSub: {
      en: 'A celebration of devotion, community and tradition.',
      hi: 'भक्ति, समुदाय और परंपरा का उत्सव।'
    },
    durgaBody: {
      en: 'Durga Puja brings together devotion, art and community across Buxar. Pandals, cultural programs and devotional gatherings mark the season with colour and celebration.',
      hi: 'दुर्गा पूजा बक्सर भर में भक्ति, कला और समुदाय को एक साथ लाती है। पंडल, सांस्कृतिक कार्यक्रम और भक्ति समारोह मौसम को रंग और उत्सव से सजाते हैं।'
    },
    durgaNote: {
      en: 'Dates, venues and organisers will be published here as celebrations are confirmed.',
      hi: 'तिथियाँ, स्थान और आयोजक यहाँ प्रकाशित किए जाएँगे जैसे ही उत्सव की पुष्टि होगी।'
    },
    viewEventDetails: { en: 'View Event Details →', hi: 'कार्यक्रम विवरण देखें →' },

    durgaEventsTitle: { en: 'Durga Puja Events', hi: 'दुर्गा पूजा कार्यक्रम' },
    durgaEventsSub: {
      en: 'Discover the celebrations, pandals and cultural programs of the season.',
      hi: 'मौसम के उत्सव, पंडल और सांस्कृतिक कार्यक्रमों को जानें।'
    },
    viewDetails: { en: 'View Details →', hi: 'विवरण देखें →' },

    galleryTitle: { en: 'Moments of Devotion & Celebration', hi: 'भक्ति और उत्सव के पल' },
    gallerySub: {
      en: 'A visual glimpse of the festive season — devotion, light and celebration.',
      hi: 'त्योहारी मौसम की एक दृश्य झलक — भक्ति, रोशनी और उत्सव।'
    },

    moreThanTitle: { en: 'More Than a Festival', hi: 'एक त्योहार से बढ़कर' },
    moreThanBody: {
      en: 'Behind the celebrations are faith, community, tradition, art and music — the threads that bind a district together.',
      hi: 'उत्सवों के पीछे भक्ति, समुदाय, परंपरा, कला और संगीत है — वे धागे जो एक जिले को बाँधते हैं।'
    },
    moreThanCta: { en: 'Read Story →', hi: 'कहानी पढ़ें →' },

    festivalsTitle: { en: 'Festivals & Culture', hi: 'त्योहार एवं संस्कृति' },
    festivalsSub: {
      en: 'The cultural calendar of Buxar — festivals, traditions and celebrations.',
      hi: 'बक्सर का सांस्कृतिक कैलेंडर — त्योहार, परंपराएँ और उत्सव।'
    },

    upcomingTitle: { en: 'Upcoming Events', hi: 'आगामी कार्यक्रम' },
    upcomingSub: {
      en: 'What is on in Buxar — festivals, gatherings and cultural programs.',
      hi: 'बक्सर में क्या हो रहा है — त्योहार, जमावड़े और सांस्कृतिक कार्यक्रम।'
    },
    viewEvent: { en: 'View Event →', hi: 'कार्यक्रम देखें →' },

    latestTitle: { en: 'Latest from Buxar', hi: 'बक्सर से ताज़ा' },
    latestSub: {
      en: 'The latest stories, updates and developments from across Buxar.',
      hi: 'बक्सर भर की ताज़ा कहानियाँ, अपडेट और विकास।'
    },
    readMore: { en: 'Read More →', hi: 'और पढ़ें →' },

    cityLifeTitle: { en: 'Life in Buxar', hi: 'बक्सर में जीवन' },
    cityLifeSub: {
      en: 'Evergreen editorial topics about the city — its markets, ghats, food, culture and people.',
      hi: 'शहर के लिए सादा संपादकीय विषय — इसके बाज़ार, घाट, भोजन, संस्कृति और लोग।'
    },

    photosTitle: { en: 'Buxar, As It Happens', hi: 'बक्सर, जैसा हो रहा है' },
    photosSub: {
      en: 'Streets, ghats, markets, festivals and local life — a portrait of the district in photographs.',
      hi: 'सड़कें, घाट, बाज़ार, त्योहार और स्थानीय जीवन — तस्वीरों में जिले की तस्वीर।'
    },

    articleTitle: { en: 'Story', hi: 'कहानी' },
    notFoundStory: {
      en: 'This story could not be found. It may have been renamed, or the link may be out of date.',
      hi: 'यह कहानी नहीं मिली। हो सकता है इसका नाम बदल गया हो, या लिंक पुराना हो।'
    },
    notFoundEvent: {
      en: 'This event could not be found. Dates and venues change, so the link may be out of date.',
      hi: 'यह कार्यक्रम नहीं मिला। तिथि और स्थान बदलते रहते हैं, इसलिए लिंक पुराना हो सकता है।'
    },
    backToCurrent: { en: 'Back to Current Buxar', hi: 'करेंट बक्सर पर वापस' },
    relatedStories: { en: 'Related Stories', hi: 'संबंधित कहानियाँ' },
    relatedEvents: { en: 'Related Events', hi: 'संबंधित कार्यक्रम' },
    shareStory: { en: 'Share this story', hi: 'यह कहानी साझा करें' },
    linkCopied: { en: 'Link copied', hi: 'लिंक कॉपी हो गया' },
    source: { en: 'Source', hi: 'स्रोत' },
    author: { en: 'Author', hi: 'लेखक' },
    verifiedContent: { en: 'Verified content', hi: 'सत्यापित सामग्री' },
    editorialNote: {
      en: 'Read the latest editions of Current Buxar for full reporting on the people, places and decisions shaping the district.',
      hi: 'जिले के लोगों, स्थानों और निर्णयों पर पूरी रिपोर्टिंग के लिए करेंट बक्सर का नवीनतम संस्करण पढ़ें।'
    },

    eventDetailTitle: { en: 'Event', hi: 'कार्यक्रम' },
    eventDate: { en: 'Date', hi: 'तिथि' },
    eventTime: { en: 'Time', hi: 'समय' },
    eventVenue: { en: 'Venue', hi: 'स्थान' },
    eventLocation: { en: 'Location', hi: 'स्थान' },
    eventOrganizer: { en: 'Organizer', hi: 'आयोजक' },
    eventContact: { en: 'Contact', hi: 'संपर्क' },
    eventDescription: { en: 'Description', hi: 'विवरण' },
    eventGallery: { en: 'Gallery', hi: 'गैलरी' },
    backToEvents: { en: 'Back to Events', hi: 'कार्यक्रमों पर वापस' },
    eventNote: {
      en: 'Dates, venues and organisers are published here as each celebration is confirmed by its organisers.',
      hi: 'तिथि, स्थान और आयोजक यहाँ प्रकाशित किए जाते हैं जैसे ही संबंधित आयोजक उत्सव की पुष्टि करते हैं।'
    }
  }

  /* ------------------------------------------------------------------ */
  /* News categories (filter chips)                                       */
  /* ------------------------------------------------------------------ */
  N.categories = [
    { slug: 'all', name: { en: 'All', hi: 'सभी' } },
    { slug: 'current-buxar', name: { en: 'Current Buxar', hi: 'करेंट बक्सर' } },
    { slug: 'durga-puja', name: { en: 'Durga Puja', hi: 'दुर्गा पूजा' } },
    { slug: 'events', name: { en: 'Events', hi: 'कार्यक्रम' } },
    { slug: 'culture', name: { en: 'Culture', hi: 'संस्कृति' } },
    { slug: 'business', name: { en: 'Business', hi: 'व्यापार' } },
    { slug: 'tourism', name: { en: 'Tourism', hi: 'पर्यटन' } },
    { slug: 'community', name: { en: 'Community', hi: 'समुदाय' } },
    { slug: 'news', name: { en: 'News', hi: 'समाचार' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Event filter categories                                              */
  /* ------------------------------------------------------------------ */
  N.eventFilters = [
    { slug: 'all', name: { en: 'All', hi: 'सभी' } },
    { slug: 'religious', name: { en: 'Religious', hi: 'धार्मिक' } },
    { slug: 'cultural', name: { en: 'Cultural', hi: 'सांस्कृतिक' } },
    { slug: 'community', name: { en: 'Community', hi: 'समुदाय' } },
    { slug: 'business', name: { en: 'Business', hi: 'व्यापार' } },
    { slug: 'education', name: { en: 'Education', hi: 'शिक्षा' } },
    { slug: 'sports', name: { en: 'Sports', hi: 'खेल' } },
    { slug: 'civic', name: { en: 'Government / Civic', hi: 'सरकारी / नागरिक' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Festivals & culture — content categories                            */
  /* ------------------------------------------------------------------ */
  N.festivals = [
    { slug: 'durga-puja', name: { en: 'Durga Puja', hi: 'दुर्गा पूजा' } },
    { slug: 'chhath', name: { en: 'Chhath', hi: 'छठ' } },
    { slug: 'ram-navami', name: { en: 'Ram Navami', hi: 'राम नवमी' } },
    { slug: 'diwali', name: { en: 'Diwali', hi: 'दिवाली' } },
    { slug: 'holi', name: { en: 'Holi', hi: 'होली' } },
    { slug: 'makar-sankranti', name: { en: 'Makar Sankranti', hi: 'मकर संक्रांति' } },
    { slug: 'religious', name: { en: 'Religious Events', hi: 'धार्मिक कार्यक्रम' } },
    { slug: 'cultural', name: { en: 'Cultural Programs', hi: 'सांस्कृतिक कार्यक्रम' } }
  ]

  /* ------------------------------------------------------------------ */
  /* City life — evergreen editorial topics                               */
  /* ------------------------------------------------------------------ */
  N.cityLife = [
    { slug: 'markets', name: { en: 'Markets', hi: 'बाज़ार' }, blurb: { en: 'Local bazaars and shopping streets.', hi: 'स्थानीय बाज़ार और खरीदारी की गलियाँ।' } },
    { slug: 'ganga', name: { en: 'Ganga', hi: 'गंगा' }, blurb: { en: 'The river and its ghats.', hi: 'नदी और उसके घाट।' } },
    { slug: 'food', name: { en: 'Food', hi: 'भोजन' }, blurb: { en: 'Local flavours and sweet houses.', hi: 'स्थानीय स्वाद और मिठाई घर।' } },
    { slug: 'culture', name: { en: 'Culture', hi: 'संस्कृति' }, blurb: { en: 'Arts, music and traditions.', hi: 'कला, संगीत और परंपराएँ।' } },
    { slug: 'education', name: { en: 'Education', hi: 'शिक्षा' }, blurb: { en: 'Schools, colleges and learning.', hi: 'विद्यालय, महाविद्यालय और शिक्षा।' } },
    { slug: 'youth', name: { en: 'Youth', hi: 'युवा' }, blurb: { en: 'Young people and new ideas.', hi: 'युवा और नए विचार।' } },
    { slug: 'business', name: { en: 'Business', hi: 'व्यापार' }, blurb: { en: 'Local enterprise and markets.', hi: 'स्थानीय उद्यम और बाज़ार।' } },
    { slug: 'public-spaces', name: { en: 'Public Spaces', hi: 'सार्वजनिक स्थान' }, blurb: { en: 'Parks, ghats and gathering places.', hi: 'पार्क, घाट और मिलन स्थल।' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Durga Puja gallery                                                  */
  /* ------------------------------------------------------------------ */
  N.durgaGallery = [
    { src: 'assets/news-aarti.jpg', caption: { en: 'Ganga Arati at the ghats', hi: 'घाटों पर गंगा आरती' } },
    { src: 'assets/news-diyas.jpg', caption: { en: 'Earthen diyas at dusk', hi: 'ढलान पर मिट्टी के दीये' } },
    { src: 'assets/tourism/spiritual/aarti-diyas.webp', caption: { en: 'Festival lamps on the water', hi: 'जल पर त्योहारी दीप' } },
    { src: 'assets/news-diyas.jpg', caption: { en: 'Religious items for the season', hi: 'मौसम के लिए धार्मिक वस्तुएँ' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Photography gallery — Buxar life                                    */
  /* ------------------------------------------------------------------ */
  N.photos = [
    { src: 'assets/hero-buxar-sunset.jpg', caption: { en: 'Ganga at sunset', hi: 'गंगा सूर्यास्त में' } },
    { src: 'assets/dest-ghats.jpg', caption: { en: 'Ganga ghats', hi: 'गंगा घाट' } },
    { src: 'assets/hero-buxar-morning.jpg', caption: { en: 'Morning on the river', hi: 'नदी पर सुबह' } },
    { src: 'assets/dest-temple.jpg', caption: { en: 'Temple architecture', hi: 'मंदिर वास्तुकला' } },
    { src: 'assets/prod-fabrics.jpg', caption: { en: 'Handloom textiles', hi: 'हथकरघा वस्त्र' } },
    { src: 'assets/hero-buxar-night.jpg', caption: { en: 'Night on the river', hi: 'नदी पर रात' } }
  ]

  /* ------------------------------------------------------------------ */
  /* Articles                                                             */
  /* ------------------------------------------------------------------ */

  N.articles = [
    {
      id: 'demo-story-01',
      slug: 'demo-story-buxar',
      demo: true,
      category: 'current-buxar',
      title: { en: 'A Story from Buxar', hi: 'बक्सर की एक कहानी' },
      excerpt: {
        en: 'The people, places and moments of Buxar — stories that capture the spirit of the district.',
        hi: 'बक्सर के लोग, स्थान और पल — कहानियाँ जो जिले की आत्मा को समेटती हैं।'
      },
      content: null,
      image: 'assets/hero-buxar-sunset.jpg',
      gallery: [],
      date: null,
      author: null,
      source: null,
      location: null,
      featured: true,
      tags: []
    }
  ]

  N.events = [
    {
      id: 'demo-durga-01',
      slug: 'demo-durga-puja',
      demo: true,
      category: 'religious',
      title: { en: 'Durga Puja Celebrations', hi: 'दुर्गा पूजा उत्सव' },
      description: {
        en: 'Discover the celebrations, pandals and cultural programs of the Durga Puja season.',
        hi: 'दुर्गा पूजा के मौसव के उत्सव, पंडल और सांस्कृतिक कार्यक्रमों को जानें।'
      },
      image: 'assets/news-aarti.jpg',
      gallery: [],
      date: null,
      startTime: null,
      endTime: null,
      venue: null,
      location: null,
      organizer: null,
      contact: null,
      coordinates: null,
      featured: true
    }
  ]

  /* ------------------------------------------------------------------ */
  /* URL builders                                                        */
  /* ------------------------------------------------------------------ */
  N.articleUrl = function (a) { return url('news/article.html?slug=' + encodeURIComponent(a.slug)) }
  N.eventUrl = function (e) { return url('news/event.html?slug=' + encodeURIComponent(e.slug)) }
  N.imageUrl = function (p) { return p ? url(p) : '' }
})()
