/* ------------------------------------------------------------------ */
/* TheBuxar.com — Marketplace data (single source of truth)            */
/* ------------------------------------------------------------------ */
/*                                                                     */
/* Visual-first commerce. Every product, seller and category here is  */
/* read by js/market.js; nothing in the UI hard-codes a product.       */
/*                                                                     */
/* EDITING THIS FILE                                                   */
/*                                                                     */
/* Categories and areas are the catalogue of what Buxar makes and      */
/* where it is made — they are the spine of the Marketplace and are    */
/* populated now.                                                     */
/*                                                                     */
/* M.products and M.sellers start empty and grow only from verified    */
/* records. A product is added when a confirmed seller lists it with a */
/* real price, real photography and a real origin; a seller is added    */
/* when its business has been verified and claimed.                   */
/*                                                                     */
/* Do not add a price, stock figure, rating, review count or origin    */
/* that has not been supplied. Leave the field out instead — every     */
/* card, facet count, filter and detail page is generated from this    */
/* file, so appending a record updates the whole site with no code     */
/* change.                                                            */
/*                                                                     */
/* Products, sellers, inventory, orders, customers, cart, wishlist,    */
/* reviews, coupons, delivery, payments and returns all live in this   */
/* one dataset, so a future PHP/API backend can replace this file with  */
/* fetch() calls and leave every renderer untouched.                   */
/* ------------------------------------------------------------------ */

(function () {
  'use strict'

  var M = window.TheBuxarMarket = window.TheBuxarMarket || {}
  window.TheBuxarMarket = M

  /* ---------------------------------------------------------------- */
  /* Language + tiny value helpers                                     */
  /* ---------------------------------------------------------------- */

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }

  /* Render one bilingual value in the active language. */
  function get (obj) {
    if (obj === null || obj === undefined || obj === '') return ''
    if (typeof obj === 'string') return obj
    var l = lang()
    if (obj[l]) return obj[l]
    if (obj.en) return obj.en
    if (obj.hi) return obj.hi
    return ''
  }

  /* Both languages at once, for search indexing. Searching only the
     visible language would hide a record from someone typing in the
     other one. */
  function all (obj) {
    if (obj === null || obj === undefined || obj === '') return []
    if (typeof obj === 'string') return [obj]
    var out = []
    if (obj.en) out.push(String(obj.en))
    if (obj.hi) out.push(String(obj.hi))
    return out.filter(Boolean)
  }

  M.get = get
  M.all = all
  M.t = function (k) { return get(M.ui[k]) }

  /* Set by js/market.js from window.TheBuxarConfig.path, so URL builders
     resolve from the page's own depth. */
  M.path = ''

  var ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'

  M.icons = {
    search: '<svg ' + ICON + '><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>',
    heart: '<svg ' + ICON + '><path d="M12 20.4s-7.2-4.4-9.5-8.4C.3 9 2.2 6 5.5 6c2.1 0 3.5 1.4 4.5 2.6C11 7.4 12.4 6 14.5 6c3.3 0 5.2 3 2.9 6-2.3 4-9.4 8.4-9.4 8.4Z"/></svg>',
    cart: '<svg ' + ICON + '><path d="M5 6h14.5l-1.2 7.5H7.7L6.4 4.5H3"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
    arrow: '<svg ' + ICON + '><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg>',
    pin: '<svg ' + ICON + '><path d="M12 21s6-5.4 6-9.5A6 6 0 0 0 6 11.5C6 15.6 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    check: '<svg ' + ICON + '><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    close: '<svg ' + ICON + '><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></svg>',
    image: '<svg ' + ICON + '><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 16 4-4 3 3 5-5.5 2.5 2.5"/></svg>',
    box: '<svg ' + ICON + '><path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z"/><path d="M3 8.5v7M12 4v16M21 8.5l-9 4.5-9-4.5"/></svg>',
    store: '<svg ' + ICON + '><path d="M4 9.5h16V20H4z"/><path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.6 1.6 3 3 0 0 1-5.4 0A3 3 0 0 1 3 9.5Z"/><path d="M9.5 20v-6h5v6"/></svg>',
    user: '<svg ' + ICON + '><path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
    truck: '<svg ' + ICON + '><path d="M2.5 6.5h10.5v10H2.5z"/><path d="M13 9.5h4l3.5 3.5v3.5H13z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    shield: '<svg ' + ICON + '><path d="M12 3.5 5 6v6c0 4.4 3 7.4 7 8.5 4-1.1 7-4.1 7-8.5V6l-7-2.5Z"/><path d="m9 12 2 2 4-4"/></svg>',
    star: '<svg ' + ICON + '><path d="m12 4 2.4 5.4 5.9.6-4.4 3.9 1.2 5.8L12 16.8 6.9 19.7l1.2-5.8L3.7 10l5.9-.6L12 4Z"/></svg>',
    filter: '<svg ' + ICON + '><path d="M4 6.5h16M7 12h10M10 17.5h4"/></svg>',
    trash: '<svg ' + ICON + '><path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 13h9l1-13"/></svg>',
    plus: '<svg ' + ICON + '><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg ' + ICON + '><path d="M5 12h14"/></svg>',
    zoom: '<svg ' + ICON + '><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8M8.5 11h5M11 8.5v5"/></svg>',
    info: '<svg ' + ICON + '><circle cx="12" cy="12" r="9"/><path d="M12 8v4.5M12 15.6v.4"/></svg>',
    leaf: '<svg ' + ICON + '><path d="M5 19C4 12 8 5 19 5c0 11-6 15-13 14Z"/><path d="M5 19c2-5 5-8 9-10"/></svg>',
    truckBox: '<svg ' + ICON + '><path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z"/><path d="M3 8.5v7M12 4v16"/></svg>'
  }

  /* ---------------------------------------------------------------- */
  /* Bilingual UI copy                                                 */
  /* ---------------------------------------------------------------- */
  /*                                                                   */
  /* One key per string, read with M.get(key) at render time. Two keys  */
  /* carrying the same words is how a deck goes wrong: when the sell    */
  /* forms spelled their labels out inline instead of looking them up,  */
  /* the two drifted and the pages shipped Hindi that had turned to     */
  /* nonsense. So -                                                   */
  /*                                                                   */
  /*   f*   a label on a form control, used by the sell pages          */
  /*   spec* a row label in a product's specification table            */
  /*                                                                   */
  /* fDims and specDimensions are both "Dimensions" on purpose: they   */
  /* are different roles in different pages and may want to diverge.   */
  /* That is the only reason to keep two keys for one string.          */
  /*                                                                   */
  /* This deck holds copy the renderer reads. The static page shell -   */
  /* headings, breadcrumbs, field hints - is built by the page          */
  /* generator, which now looks labels up here rather than restating    */
  /* them, and keeps its own hints inline since nothing reads those at  */
  /* runtime.                                                          */
  /*                                                                   */
  /* A key with no reader yet is not dead weight: it is copy prepared  */
  /* for the backend phase (fConsent, fOpen, fPickup, placeOrder,       */
  /* secureCheckout). Leave those in place.                            */
  /* ---------------------------------------------------------------- */

  M.ui = {
    heroLabel: { en: 'Buxar Marketplace', hi: 'बक्सर बाज़ार' },
    heroTitle: { en: 'Discover the Best of Buxar', hi: 'बक्सर का सर्वश्रेष्ठ खोजें' },
    heroSub: {
      en: 'Explore local products, traditional goods, handmade creations and products from businesses across Buxar.',
      hi: 'बक्सर भर के स्थानीय उत्पाद, पारंपरिक वस्तुएँ, हस्तनिर्मित कृतियाँ और व्यवसायों के उत्पाद खोजें।'
    },
    shopLocal: { en: 'Shop Local', hi: 'स्थानीय खरीदें' },
    exploreCats: { en: 'Explore Categories', hi: 'श्रेणियाँ देखें' },
    searchPh: { en: 'Search products, categories or sellers...', hi: 'उत्पाद, श्रेणियाँ या विक्रेता खोजें...' },
    searchAria: { en: 'Search products, categories or sellers', hi: 'उत्पाद, श्रेणियाँ या विक्रेता खोजें' },
    searchBtn: { en: 'Search', hi: 'खोजें' },
    locationField: { en: 'Buxar', hi: 'बक्सर' },

    noSellers: { en: 'Stores open across Buxar', hi: 'बक्सर भर में स्टोर खुलेंगे' },
    noSellersSub: {
      en: 'Independent makers, growers and food producers across the district can open a store here at no cost. Browse the categories meanwhile, or send us a message and we will get you set up.',
      hi: 'जिले के स्वतंत्र कारीगर, किसान और खाद्य उत्पादक यहाँ मुफ़्त में स्टोर खोल सकते हैं। तब तक श्रेणियाँ देखें, या हमें संदेश भेजें और हम आपको तैयार कर देंगे।'
    },
    moreProductsNote: { en: 'Every category below is open for makers.', hi: 'नीचे की हर श्रेणी कारीगरों के लिए खुली है।' },
    comingSoon: { en: 'Open for listings', hi: 'सूची के लिए खुला' },
    noListings: { en: 'Open for makers', hi: 'कारीगरों के लिए खुला' },
    collectionLabel: { en: 'Curated collection', hi: 'चयनित संग्रह' },
    viewAll: { en: 'View all', hi: 'सभी देखें' },
    resultsFor: { en: 'Results for', hi: 'परिणाम' },
    productsIn: { en: 'Products in', hi: 'उत्पाद' },
    relatedProducts: { en: 'You May Also Like', hi: 'आपको यह भी पसंद आ सकता है' },
    photoPendingSub: {
      en: 'No seller has uploaded a photograph of this product yet. Product photos are never borrowed from stock libraries or from another product.',
      hi: 'अभी तक किसी विक्रेता ने इस उत्पाद की तस्वीर अपलोड नहीं की है। उत्पाद की तस्वीरें कभी स्टॉक लाइब्रेरी से या किसी अन्य उत्पाद से नहीं ली जातीं।'
    },
    noDescription: {
      en: 'This seller has not written a description for this product yet.',
      hi: 'इस विक्रेता ने अभी तक इस उत्पाद का विवरण नहीं लिखा है।'
    },
    listedOn: { en: 'Listed on', hi: 'सूचीबद्ध' },
    specMaterial: { en: 'Material', hi: 'सामग्री' },
    specWeight: { en: 'Weight', hi: 'वज़न' },
    specDimensions: { en: 'Dimensions', hi: 'आयाम' },
    noSpecs: {
      en: 'No material, weight or dimensions have been supplied for this product, so none are shown.',
      hi: 'इस उत्पाद के लिए कोई सामग्री, वज़न या आयाम नहीं दिया गया है, इसलिए कुछ भी नहीं दिखाया गया।'
    },
    noSpecial: {
      en: 'This seller has not listed anything special about this product yet.',
      hi: 'इस विक्रेता ने अभी तक इस उत्पाद के बारे में कुछ विशेष नहीं बताया है।'
    },
    noSellerInfo: {
      en: 'This product is not linked to a seller profile yet.',
      hi: 'यह उत्पाद अभी किसी विक्रेता प्रोफ़ाइल से जुड़ा नहीं है।'
    },
    noDelivery: {
      en: 'This seller has not supplied delivery information yet.',
      hi: 'इस विक्रेता ने अभी तक वितरण जानकारी नहीं दी है।'
    },
    noReturns: {
      en: 'This seller has not supplied a return policy yet.',
      hi: 'इस विक्रेता ने अभी तक रिटर्न नीति नहीं दी है।'
    },
    noAbout: {
      en: 'This seller has not written an about section yet.',
      hi: 'इस विक्रेता ने अभी तक अपने बारे में नहीं लिखा है।'
    },
    noCategories: {
      en: 'This seller has no categories yet, because no product has been listed.',
      hi: 'इस विक्रेता की अभी कोई श्रेणी नहीं है, क्योंकि कोई उत्पाद सूचीबद्ध नहीं किया गया।'
    },
    noPhotos: {
      en: 'This seller has not uploaded any store or product photographs yet.',
      hi: 'इस विक्रेता ने अभी तक कोई स्टोर या उत्पाद तस्वीर अपलोड नहीं की है।'
    },
    catLabel: { en: 'Browse by category', hi: 'श्रेणी से ब्राउज़ करें' },
    catTitle: { en: 'Shop by Category', hi: 'श्रेणी से खरीदें' },
    catSub: {
      en: 'Only categories that already have products are shown. More open by themselves as sellers are approved.',
      hi: 'केवल वही श्रेणियाँ दिखाई जाती हैं जिनमें पहले से उत्पाद हैं। विक्रेताओं के स्वीकृति के साथ नई श्रेणियाँ स्वतः जुड़ती जाएँगी।'
    },
    moreCatsNote: {
      en: 'More categories open automatically as products are added.',
      hi: 'उत्पाद जुड़ने पर अधिक श्रेणियाँ स्वतः उपलब्ध हो जाएँगी।'
    },

    featuredLabel: { en: 'Featured', hi: 'विशेष' },
    featuredTitle: { en: 'From Buxar, With Pride', hi: 'बक्सर से, गर्व के साथ' },
    newTitle: { en: 'Just Arrived', hi: 'अभी आया' },
    newSub: { en: 'Ordered by the date each product was added to the marketplace.', hi: 'प्रत्येक उत्पाद के बाज़ार में जुड़ने की तिथि के अनुसार क्रमबद्ध।' },
    sellersLabel: { en: 'Local sellers', hi: 'स्थानीय विक्रेता' },
    sellersTitle: { en: 'Meet the Local Makers', hi: 'स्थानीय निर्माता से मिलें' },
    sellersSub: { en: 'The people behind the products that make Buxar what it is.', hi: 'वे लोग जो बक्सर को बनाते हैं।' },
    interestLabel: { en: 'Curated discovery', hi: 'चयनित खोज' },
    interestTitle: { en: 'Shop by Interest', hi: 'रुचि के अनुसार खरीदें' },
    areaLabel: { en: 'Shop local', hi: 'स्थानीय खरीदें' },
    areaTitle: { en: 'Shop Local Across Buxar', hi: 'बक्सर भर में स्थानीय खरीदें' },
    areaSub: { en: 'Discover sellers and products connected with different parts of Buxar — every seller is filed under one of the district\'s six areas.', hi: 'बक्सर के विभिन्न भागों से जुड़े विक्रेताओं और उत्पादों को खोजें — हर विक्रेता जिले के छह क्षेत्रों में से किसी एक के अंतर्गत दर्ज है।' },
    collectionTitle: { en: 'The Buxar Collection', hi: 'द बक्सर कलेक्शन' },
    collectionSub: {
      en: 'A future curated collection of products from across the district. Nothing has been curated yet, so no collection claim is made.',
      hi: 'जिले भर के उत्पादों का भविष्य का चयनित संग्रह। अभी तक कुछ भी चयनित नहीं किया गया है, इसलिए किसी संग्रह का दावा नहीं किया गया।'
    },
    exploreCollection: { en: 'Explore Collection →', hi: 'संग्रह देखें →' },
    ctaAll: { en: 'Explore Marketplace →', hi: 'बाज़ार देखें →' },

    bestTitle: { en: 'Popular in Buxar', hi: 'बक्सर में लोकप्रिय' },
    bestSub: {
      en: 'This section appears once real sales and order data exists. Nothing is ranked or called popular before then.',
      hi: 'यह खंड तब दिखेगा जब वास्तविक बिक्री और ऑर्डर डेटा उपलब्ध होगा। उससे पहले किसी को भी लोकप्रिय या क्रमबद्ध नहीं किया जाता।'
    },

    sellLabel: { en: 'For sellers', hi: 'विक्रेताओं के लिए' },
    sellTitle: { en: 'Sell on TheBuxar.com', hi: 'TheBuxar.com पर बेचें' },
    sellSub: { en: 'Bring your products to customers across Buxar and beyond.', hi: 'अपने उत्पाद बक्सर और उसके बाहर ग्राहकों तक पहुँचाएँ।' },
    sellerCtaTitle: { en: 'Have Something to Sell?', hi: 'बेचने के लिए कुछ है?' },
    sellerCtaSub: {
      en: 'Bring your products to Buxar\'s growing digital marketplace and connect with people looking to discover local.',
      hi: 'अपने उत्पाद बक्सर के बढ़ते डिजिटल बाज़ार तक पहुँचाएँ और स्थानीय खोजने वाले लोगों से जुड़ें।'
    },
    sellerCtaPrimary: { en: 'Sell on TheBuxar.com', hi: 'TheBuxar.com पर बेचें' },
    sellerCtaSecondary: { en: 'Learn How It Works', hi: 'यह कैसे काम करता है' },
    startSelling: { en: 'Start Selling', hi: 'बेचना शुरू करें' },
    learnMore: { en: 'Learn More', hi: 'और जानें' },

    /* product card + detail */
    product: { en: 'Product', hi: 'उत्पाद' },
    products: { en: 'products', hi: 'उत्पाद' },
    seller: { en: 'Seller', hi: 'विक्रेता' },
    category: { en: 'Category', hi: 'श्रेणी' },
    subcategory: { en: 'Subcategory', hi: 'उपश्रेणी' },
    location: { en: 'Location', hi: 'स्थान' },
    qty: { en: 'Quantity', hi: 'मात्रा' },
    addToCart: { en: 'Add to Cart', hi: 'कार्ट में जोड़ें' },
    buyNow: { en: 'Buy Now', hi: 'अभी खरीदें' },
    wishlist: { en: 'Wishlist', hi: 'इच्छा सूची' },
    viewProduct: { en: 'View Product', hi: 'उत्पाद देखें' },
    viewStore: { en: 'View Store →', hi: 'स्टोर देखें →' },
    viewBusiness: { en: 'View Business →', hi: 'व्यवसाय देखें →' },
    inStock: { en: 'In stock', hi: 'स्टॉक में' },
    outStock: { en: 'Out of stock', hi: 'स्टॉक समाप्त' },
    stockPending: { en: 'Availability on enquiry', hi: 'जानकारी हेतु संपर्क करें' },
    pricePending: { en: 'Price on enquiry', hi: 'मूल्य हेतु संपर्क करें' },
    photoPending: { en: 'Photography on request', hi: 'अनुरोध पर चित्र उपलब्ध' },

    /* detail sections */
    description: { en: 'Description', hi: 'विवरण' },
    details: { en: 'Product Details', hi: 'उत्पाद विवरण' },
    /* Origin is deliberately split from the seller's own address. A seller
       in Buxar does not make the product Buxar-made, so the two are never
       merged into one line and "Made in Buxar" is only ever shown when the
       origin itself is verified. */
    sellerLocation: { en: 'Seller location', hi: 'विक्रेता का स्थान' },
    productOrigin: { en: 'Product origin', hi: 'उत्पाद की उत्पत्ति' },
    madeIn: { en: 'Made in', hi: 'निर्मित' },
    originPending: {
      en: 'Origin is confirmed with the maker before it is stated. Seller location and product origin are kept deliberately separate, so "Made in Buxar" appears only when the product itself is confirmed to be made here.',
      hi: 'उत्पत्ति निर्माता से पुष्ट किए जाने पर ही बताई जाती है। विक्रेता का स्थान और उत्पाद की उत्पत्ति जानबूझकर अलग रखी जाती हैं, इसलिए "बक्सर में निर्मित" केवल तब दिखता है जब उत्पाद स्वयं यहाँ बना हो।'
    },
    categoryLabel: { en: 'Category', hi: 'श्रेणी' },
    relatedCategories: { en: 'Related categories', hi: 'संबंधित श्रेणियाँ' },
    imageCredits: { en: 'Image credits', hi: 'चित्र श्रेय' },
    imageCreditsNote: {
      en: 'Attribution for every photograph used on this site is published in the image credits register.',
      hi: 'इस साइट पर प्रयुक्त प्रत्येक तस्वीर का श्रेय चित्र श्रेय रजिस्टर में प्रकाशित है।'
    },
    special: { en: 'What Makes It Special', hi: 'यह क्या विशेष बनाता है' },
    sellerInfo: { en: 'Seller Information', hi: 'विक्रेता जानकारी' },
    deliveryInfo: { en: 'Delivery Information', hi: 'वितरण जानकारी' },
    returnPolicy: { en: 'Return Policy', hi: 'रिटर्न नीति' },
    storyTitle: { en: 'The Story Behind the Product', hi: 'उत्पाद की कहानी' },
    storyPending: {
      en: 'Every product carries the story of the person who made it. Cultural and origin details are published with the maker, never written on their behalf.',
      hi: 'हर उत्पाद अपने निर्माता की कहानी साथ लेकर आता है। सांस्कृतिक और उत्पत्ति विवरण निर्माता के साथ प्रकाशित होते हैं, उनकी ओर से कुछ नहीं लिखा जाता।'
    },
    reviews: { en: 'Reviews', hi: 'समीक्षाएँ' },
    noReviews: { en: 'Customer reviews', hi: 'ग्राहक समीक्षाएँ' },
    beFirst: { en: 'Write the first review', hi: 'पहली समीक्षा लिखें' },
    noReviewsSub: {
      en: 'Only a customer who has actually received a product can review it, so every review here is tied to a confirmed order.',
      hi: 'केवल वही ग्राहक समीक्षा लिख सकता है जिसे वास्तव में उत्पाद मिला है, इसलिए यहाँ की हर समीक्षा पुष्ट ऑर्डर से जुड़ी होती है।'
    },

    /* gallery */
    gallery: { en: 'Gallery', hi: 'गैलरी' },
    zoom: { en: 'Zoom', hi: 'ज़ूम' },
    prevImg: { en: 'Previous image', hi: 'पिछली तस्वीर' },
    nextImg: { en: 'Next image', hi: 'अगली तस्वीर' },
    closeLb: { en: 'Close', hi: 'बंद करें' },

    /* listing */
    resultsTitle: { en: 'Products', hi: 'उत्पाद' },
    filters: { en: 'Filters', hi: 'फ़िल्टर' },
    applyFilters: { en: 'Show results', hi: 'परिणाम दिखाएँ' },
    clearFilters: { en: 'Clear filters', hi: 'सभी फ़िल्टर हटाएँ' },
    sortBy: { en: 'Sort by', hi: 'क्रमबद्ध करें' },
    sortRelevance: { en: 'Relevance', hi: 'प्रासंगिकता' },
    sortNewest: { en: 'Newest', hi: 'नवीनतम' },
    sortPriceAsc: { en: 'Price: Low to High', hi: 'मूल्य: कम से अधिक' },
    sortPriceDesc: { en: 'Price: High to Low', hi: 'मूल्य: अधिक से कम' },
    sortName: { en: 'Name (A–Z)', hi: 'नाम (A–Z)' },
    fCategory: { en: 'Category', hi: 'श्रेणी' },
    fSubcategory: { en: 'Subcategory', hi: 'उपश्रेणी' },
    fSeller: { en: 'Seller', hi: 'विक्रेता' },
    fLocation: { en: 'Location', hi: 'स्थान' },
    fPrice: { en: 'Price range', hi: 'मूल्य सीमा' },
    fAvailability: { en: 'Availability', hi: 'उपलब्धता' },
    fRating: { en: 'Rating', hi: 'रेटिंग' },
    fHiddenNote: {
      en: 'Price, availability and rating filters appear here automatically as makers list products.',
      hi: 'जैसे ही निर्माता उत्पाद सूचीबद्ध करेंगे, मूल्य, उपलब्धता और रेटिंग फ़िल्टर यहाँ अपने आप दिखने लगेंगे।'
    },
    showing: { en: 'Showing', hi: 'दिखा रहे हैं' },
    of: { en: 'of', hi: 'में से' },
    loadMore: { en: 'Load more', hi: 'और लोड करें' },

    /* empty states */
    noProducts: { en: 'Be the first to list here', hi: 'यहाँ सबसे पहले सूचीबद्ध करें' },
    noProductsSub: {
      en: 'Makers, growers and food producers from across Buxar district sell directly here, at no cost. Tell us what you make and we will publish your listing.',
      hi: 'बक्सर जिले के निर्माता, किसान और खाद्य उत्पादक यहाँ सीधे मुफ़्त में बेचते हैं। बताएँ आप क्या बनाते हैं और हम आपकी सूची प्रकाशित कर देंगे।'
    },
    noResultsTitle: { en: 'Nothing matches that search', hi: 'इस खोज से कुछ मेल नहीं खाता' },
    noResultsSub: {
      en: 'Try a different word, or browse a category from the list beside.',
      hi: 'कोई दूसरा शब्द आज़माएँ, या बगल की सूची से कोई श्रेणी देखें।'
    },
    listYourProduct: { en: 'List Your Product', hi: 'अपना उत्पाद सूचीबद्ध करें' },
    talkToUs: { en: 'Talk to Us', hi: 'हमसे बात करें' },
    noSellerProducts: { en: 'This seller has no products yet', hi: 'इस विक्रेता के अभी कोई उत्पाद नहीं' },
    noSellerProductsSub: { en: 'Nothing has been listed by this seller so far.', hi: 'इस विक्रेता ने अभी तक कुछ भी सूचीबद्ध नहीं किया है।' },
    emptyCart: { en: 'Your cart is empty', hi: 'आपका कार्ट खाली है' },
    emptyCartSub: { en: 'Browse local products and add something you like.', hi: 'स्थानीय उत्पाद देखें और कुछ पसंद करें।' },
    emptyWishlist: { en: 'Your wishlist is empty', hi: 'आपकी इच्छा सूची खाली है' },
    emptyWishlistSub: { en: 'Tap the heart on any product to save it here.', hi: 'किसी भी उत्पाद पर दिल दबाएँ और उसे यहाँ सहेजें।' },
    emptySaved: { en: 'Nothing saved for later', hi: 'बाद के लिए कुछ नहीं सहेजा' },

    /* cart + wishlist */
    cartTitle: { en: 'Your Cart', hi: 'आपका कार्ट' },
    wishlistTitle: { en: 'Your Wishlist', hi: 'आपकी इच्छा सूची' },
    remove: { en: 'Remove', hi: 'हटाएँ' },
    saveForLater: { en: 'Save for later', hi: 'बाद के लिए सहेजें' },
    moveToCart: { en: 'Move to Cart', hi: 'कार्ट में ले जाएँ' },
    moveToWishlist: { en: 'Move to Wishlist', hi: 'इच्छा सूची में ले जाएँ' },
    subtotal: { en: 'Subtotal', hi: 'उप-योग' },
    delivery: { en: 'Delivery', hi: 'वितरण' },
    discount: { en: 'Discount', hi: 'छूट' },
    total: { en: 'Total', hi: 'कुल' },
    summary: { en: 'Order Summary', hi: 'ऑर्डर सारांश' },
    continueShopping: { en: 'Continue Shopping', hi: 'खरीदारी जारी रखें' },
    proceedCheckout: { en: 'Proceed to Checkout', hi: 'चेकआउट पर जाएँ' },
    noTotals: {
      en: 'A total appears here as soon as the items in your cart carry a published price from their seller.',
      hi: 'आपके कार्ट की वस्तुओं के विक्रेता द्वारा मूल्य प्रकाशित होते ही यहाँ योग दिखाई देगा।'
    },
    cartNote: {
      en: 'Your cart is kept in this browser. Items are reserved with the seller only once you confirm the order with them.',
      hi: 'आपका कार्ट इसी ब्राउज़र में रहता है। ऑर्डर की पुष्टि विक्रेता के साथ होने पर ही वस्तुएँ आरक्षित होती हैं।'
    },

    /* checkout */
    checkoutTitle: { en: 'Checkout', hi: 'चेकआउट' },
    checkoutSoon: { en: 'Pay the maker directly', hi: 'सीधे निर्माता को भुगतान करें' },
    checkoutSoonSub: {
      en: 'TheBuxar.com introduces you to the maker and takes no payment. Confirm your order and settle it with them in person, by UPI or by phone — the way you already buy from the shops of Buxar.',
      hi: 'TheBuxar.com आपको निर्माता से जोड़ता है और कोई भुगतान नहीं लेता। ऑर्डर की पुष्टि करके व्यक्तिगत रूप से, UPI या फ़ोन पर उनके साथ भुगतान करें — ठीक वैसे ही जैसे आप बक्सर की दुकानों से खरीदते हैं।'
    },
    coCustomer: { en: 'Customer information', hi: 'ग्राहक जानकारी' },
    coAddress: { en: 'Delivery address', hi: 'वितरण पता' },
    coDelivery: { en: 'Delivery method', hi: 'वितरण विधि' },
    coPayment: { en: 'Payment method', hi: 'भुगतान विधि' },
    coOrder: { en: 'Order summary', hi: 'ऑर्डर सारांश' },
    placeOrder: { en: 'Place Order', hi: 'ऑर्डर दें' },
    payNotReady: {
      en: 'TheBuxar.com never handles your money. UPI, cash on delivery and direct transfer are all settled with the maker, so you always know exactly who you have paid.',
      hi: 'TheBuxar.com आपका पैसा कभी संभालता नहीं। UPI, कैश ऑन डिलीवरी और सीधा हस्तांतरण सब निर्माता के साथ तय होते हैं, इसलिए आपको सदैव पता रहता है आपने किसे भुगतान किया है।'
    },
    coPendingField: {
      en: 'Delivery is arranged with the maker — they know their craft and their roads best.',
      hi: 'डिलीवरी की व्यवस्था निर्माता से की जाती है — उन्हें अपने शिल्प और अपने रास्ते सबसे अच्छे से मालूम हैं।'
    },

    /* seller page */
    about: { en: 'About the seller', hi: 'विक्रेता के बारे में' },
    storePolicies: { en: 'Store policies', hi: 'स्टोर नीतियाँ' },
    contact: { en: 'Contact', hi: 'संपर्क' },
    noContact: {
      en: 'Reach this maker on WhatsApp or by phone — the fastest way to ask about availability, craft and pricing.',
      hi: 'इस निर्माता तक व्हाट्सऐप या फ़ोन पर पहुँचें — उपलब्धता, शिल्प और मूल्य पूछने का सबसे तेज़ तरीका।'
    },
    noPolicies: {
      en: 'Delivery, replacement and return are agreed directly with the maker before you pay.',
      hi: 'भुगतान से पहले डिलीवरी, बदलाव और वापसी की व्यवस्था सीधे निर्माता से की जाती है।'
    },
    noLogo: { en: 'Maker', hi: 'निर्माता' },
    noCover: { en: 'The craft of Buxar', hi: 'बक्सर की कला' },
    noBizLink: {
      en: 'This store also appears in the Business Directory, where it can be discovered by area and category.',
      hi: 'यह स्टोर व्यापार निर्देशिका में भी दिखता है, जहाँ इसे क्षेत्र और श्रेणी से खोजा जा सकता है।'
    },
    noFromBiz: {
      en: 'No seller is linked to this business in the marketplace yet.',
      hi: 'अभी तक बाज़ार में कोई विक्रेता इस व्यवसाय से जुड़ा नहीं है।'
    },

    /* trust badges — only ever rendered when the flag is true */
    verifiedSeller: { en: 'Verified Seller', hi: 'सत्यापित विक्रेता' },
    localSeller: { en: 'Local Seller', hi: 'स्थानीय विक्रेता' },
    secureCheckout: { en: 'Secure Checkout', hi: 'सुरक्षित चेकआउट' },
    authenticProduct: { en: 'Authentic Product', hi: 'प्रामाणिक उत्पाद' },

    /* forms */
    notStored: {
      en: 'Form validated, but nothing was sent: this site has no backend yet. Nothing has been stored, submitted or published.',
      hi: 'फ़ॉर्म सत्यापित हुआ, लेकिन कुछ नहीं भेजा गया: इस साइट में अभी कोई बैकएंड नहीं है। कुछ भी संग्रहीत, जमा या प्रकाशित नहीं हुआ।'
    },
    approvalNote: {
      en: 'A submitted product is never published automatically. Every product needs backend storage and an admin approval step before it can appear in the marketplace.',
      hi: 'जमा किया गया उत्पाद कभी स्वतः प्रकाशित नहीं होता। बाज़ार में दिखने से पहले हर उत्पाद को बैकएंड स्टोरेज और एडमिन स्वीकृति की आवश्यकता होती है।'
    },
    bankNote: {
      en: 'Do not enter real bank or account details here. There is no secure payment onboarding service connected to this form, so it must not collect sensitive financial information.',
      hi: 'यहाँ वास्तविक बैंक या खाता विवरण न भरें। इस फ़ॉर्म से कोई सुरक्षित भुगतान ऑनबोर्डिंग सेवा जुड़ी नहीं है, इसलिए इसे संवेदनशील वित्तीय जानकारी नहीं लेनी चाहिए।'
    },
    fBizName: { en: 'Business name', hi: 'व्यवसाय का नाम' },
    fSellerName: { en: 'Seller name', hi: 'विक्रेता का नाम' },
    fPhone: { en: 'Phone', hi: 'फ़ोन' },
    fEmail: { en: 'Email', hi: 'ईमेल' },
    fAddress: { en: 'Address', hi: 'पता' },
    fArea: { en: 'Area', hi: 'क्षेत्र' },
    fCats: { en: 'Product categories', hi: 'उत्पाद श्रेणियाँ' },
    fPin: { en: 'PIN code', hi: 'पिन कोड' },
    fSellerType: { en: 'Seller type', hi: 'विक्रेता प्रकार' },
    fOpen: { en: 'Open for orders', hi: 'ऑर्डर के लिए खुला' },
    fStory: { en: 'Story behind the product', hi: 'उत्पाद की कहानी' },
    fTags: { en: 'What makes it special', hi: 'यह क्या विशेष बनाता है' },
    fConsent: { en: 'Consent to contact', hi: 'संपर्क की सहमति' },
    fPickup: { en: 'Pickup available', hi: 'पिकअप उपलब्ध' },
    fStockNote: {
      en: 'Leave stock blank if you do not track it. A blank field reads as "availability on enquiry" — never as zero.',
      hi: 'यदि आप स्टॉक ट्रैक नहीं करते हैं तो खाली छोड़ दें। खाली फ़ील्ड "उपलब्ध नहीं" दिखाई जाती है, कभी शून्य नहीं।'
    },
    fPriceNote: {
      en: 'Leave price blank if you have not decided it. A blank price reads as "price on enquiry", so buyers can still contact you.',
      hi: 'यदि आपने मूल्य तय नहीं किया है तो खाली छोड़ दें। खाली मूल्य "उपलब्ध नहीं" दिखाया जाता है और उत्पाद अभी ऑर्डर नहीं किया जा सकता।'
    },
    fLogo: { en: 'Logo', hi: 'लोगो' },
    fDocs: { en: 'Documents / verification', hi: 'दस्तावेज़ / सत्यापन' },
    fBank: { en: 'Bank / payment information', hi: 'बैंक / भुगतान जानकारी' },
    fBankHolder: { en: 'Account holder name', hi: 'खाता धारक का नाम' },
    fBankBranch: { en: 'Bank name and branch', hi: 'बैंक का नाम और शाखा' },
    fBankAccount: { en: 'Account number / UPI ID', hi: 'खाता संख्या / UPI ID' },
    fIndIndividual: { en: 'Individual artisan', hi: 'व्यक्तिगत कारीगर' },
    fIndHome: { en: 'Home-based business', hi: 'गृह आधारित व्यवसाय' },
    fIndRegistered: { en: 'Registered business', hi: 'पंजीकृत व्यवसाय' },
    fTerms: { en: 'I confirm this information is accurate and I am authorised to submit it.', hi: 'मैं पुष्टि करता/करती हूँ कि यह जानकारी सही है और मुझे इसे जमा करने का अधिकार है।' },
    fReviewAck: { en: 'I understand a submitted seller account is reviewed before any product goes live.', hi: 'मैं समझता/समझती हूँ कि कोई भी उत्पाद पहले समीक्षा के बाद ही सार्वजनिक हो सकता है।' },
    submitApp: { en: 'Submit Application', hi: 'आवेदन जमा करें' },
    submitProduct: { en: 'Submit Product', hi: 'उत्पाद जमा करें' },
    chooseCategory: { en: 'Choose a category', hi: 'श्रेणी चुनें' },
    chooseArea: { en: 'Choose an area', hi: 'क्षेत्र चुनें' },
    fProductName: { en: 'Product name', hi: 'उत्पाद का नाम' },
    fPrice: { en: 'Price', hi: 'मूल्य' },
    fStock: { en: 'Stock', hi: 'स्टॉक' },
    fSku: { en: 'SKU', hi: 'SKU' },
    fImages: { en: 'Product images', hi: 'उत्पाद की तस्वीरें' },
    fSpecs: { en: 'Specifications', hi: 'विशिष्टताएँ' },
    fWeight: { en: 'Weight', hi: 'वज़न' },
    fDims: { en: 'Dimensions', hi: 'आयाम' },
    fDelivery: { en: 'Delivery information', hi: 'वितरण जानकारी' },
    fReturns: { en: 'Return policy', hi: 'रिटर्न नीति' },
    reqHint: { en: 'Required fields are marked with an asterisk.', hi: 'आवश्यक फ़ील्ड तारांक चिह्न से चिह्नित हैं।' },

    home: { en: 'Home', hi: 'होम' },
    marketCrumb: { en: 'Marketplace', hi: 'बाज़ार' },
    browseAll: { en: 'Browse all products', hi: 'सभी उत्पाद देखें' },
    backToMarket: { en: 'Back to Marketplace', hi: 'बाज़ार पर वापस जाएँ' },
    missingTitle: { en: 'This page is not available', hi: 'यह पृष्ठ उपलब्ध नहीं है' },
    missingSub: { en: 'The address may have changed, or the record may have been removed. Browse the marketplace to find what you need.', hi: 'पता बदल गया होगा, या रिकॉर्ड हटा दिया गया होगा। आपको जो चाहिए वह बाज़ार में देखें।' },
    cartCount: { en: 'items in cart', hi: 'कार्ट में वस्तुएँ' },

    /* homepage preview + cross-links */
    homeTitle: { en: 'Shop Local. Discover Buxar.', hi: 'स्थानीय खरीदें। बक्सर खोजें।' },
    homeSub: { en: 'Local food, handloom, brassware and festive craft from sellers across Buxar district.', hi: 'बक्सर जिले के विक्रेताओं से स्थानीय भोज्य, हथकरघा, पीतल सामान और त्योहारी शिल्प।' },
    takeHomeTitle: { en: 'Local Products to Take Home', hi: 'घर ले जाने योग्य स्थानीय उत्पाद' },
    takeHomeSub: {
      en: 'Products listed by the makers, growers and food producers of Buxar district.',
      hi: 'बक्सर जिले के विक्रेताओं द्वारा सूचीबद्ध उत्पाद। यहाँ कुछ भी बनाया नहीं गया — केवल जमा किए गए उत्पाद दिखते हैं।'
    },
    fromBizTitle: { en: 'Products from this business', hi: 'इस व्यवसाय के उत्पाद' },
    storyLabel: { en: 'More than a product', hi: 'एक उत्पाद से बढ़कर' },
    storyHeading: { en: 'The Story Behind the Product', hi: 'उत्पाद के पीछे की कहानी' },
    storyBody: {
      en: 'Local commerce is more than buying and selling. It is about discovering the people, traditions and craftsmanship that make a place unique.',
      hi: 'स्थानीय वाणिज्य केवल खरीद-बिक्री नहीं है। यह उन लोगों, परंपराओं और शिल्पकारी को खोजने के बारे में है जो किसी स्थान को विशिष्ट बनाते हैं।'
    },
    storyCta: { en: 'Explore Local Stories', hi: 'स्थानीय कहानियाँ देखें' },
    traditionLabel: { en: 'Tradition lives on', hi: 'परंपरा जीवित है' },
    traditionBody: {
      en: 'Discover products and crafts connected to the traditions and everyday culture of the region.',
      hi: 'क्षेत्र की परंपराओं और रोज़मर्रा की संस्कृति से जुड़े उत्पाद और शिल्प खोजें।'
    }
  }

  /* ---------------------------------------------------------------- */
  /* Areas — the six Explore Buxar places                                */
  /* Slugs match js/business-data.js and js/explore-data.js so all    */
  /* three modules stay in sync.                                        */
  /* ---------------------------------------------------------------- */

  M.areas = [
    { slug: 'buxar-town', explore: 'explore/buxar-town/', name: { en: 'Buxar Town', hi: 'बक्सर नगर' } },
    { slug: 'dumraon', explore: 'explore/dumraon/', name: { en: 'Dumraon', hi: 'दुमराव' } },
    { slug: 'brahampur', explore: 'explore/brahampur/', name: { en: 'Brahampur', hi: 'ब्रहमपुर' } },
    { slug: 'chausa', explore: 'explore/chausa/', name: { en: 'Chausa', hi: 'चौसा' } },
    { slug: 'itarhi', explore: 'explore/itarhi/', name: { en: 'Itarhi', hi: 'इतरही' } },
    { slug: 'rajpur', explore: 'explore/rajpur/', name: { en: 'Rajpur', hi: 'राजपुर' } }
  ]

  /* ---------------------------------------------------------------- */
  /* Categories — seeded with the full intended set.                  */
  /* Only categories a product actually uses are ever rendered, so   */
  /* an empty category never reaches the UI.                          */
  /* `sub` are the subcategory labels a real product may carry.       */
  /* ---------------------------------------------------------------- */

  M.categories = [
    {
      slug: 'local-food', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-local-food.jpg',
      name: { en: 'Local Food', hi: 'स्थानीय भोजन' },
      blurb: { en: 'Traditional flavours of Buxar.', hi: 'बक्सर के पारंपरिक स्वाद।' },
      sub: [
        { slug: 'sweets', name: { en: 'Sweets', hi: 'मिठाइयाँ' } },
        { slug: 'snacks', name: { en: 'Snacks', hi: 'नमकीन' } },
        { slug: 'pickles', name: { en: 'Pickles', hi: 'अचार' } },
        { slug: 'spices', name: { en: 'Spices', hi: 'मसाले' } }
      ]
    },
    {
      slug: 'handicrafts', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-handicrafts.jpg',
      name: { en: 'Handicrafts', hi: 'हस्तशिल्प' },
      blurb: { en: 'Made by hand in the district.', hi: 'जिले में हाथ से बनाए गए।' },
      sub: [
        { slug: 'pottery', name: { en: 'Pottery', hi: 'मिट्टी के बर्तन' } },
        { slug: 'terracotta', name: { en: 'Terracotta', hi: 'टेराकोटा' } },
        { slug: 'woodwork', name: { en: 'Woodwork', hi: 'लकड़ी का काम' } }
      ]
    },
    {
      slug: 'handlooms-textiles', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-handlooms-textiles.jpg',
      name: { en: 'Handlooms & Textiles', hi: 'हथकरघा एवं वस्त्र' },
      blurb: { en: 'Woven on the handloom.', hi: 'हथकरघा पर बुने गए।' },
      sub: [
        { slug: 'fabric', name: { en: 'Fabric', hi: 'कपड़ा' } },
        { slug: 'saree', name: { en: 'Saree', hi: 'साड़ी' } },
        { slug: 'homespun', name: { en: 'Homespun', hi: 'होमस्पन' } }
      ]
    },
    {
      slug: 'agri-products', icon: 'leaf', image: 'assets/images/marketplace/categories/marketplace-agricultural-products.jpg',
      name: { en: 'Agricultural Products', hi: 'कृषि उत्पाद' },
      blurb: { en: 'From the fields of Buxar.', hi: 'बक्सर के खेतों से।' },
      sub: [
        { slug: 'rice', name: { en: 'Rice', hi: 'चावल' } },
        { slug: 'pulses', name: { en: 'Pulses', hi: 'दलहन' } },
        { slug: 'honey', name: { en: 'Honey', hi: 'शहद' } }
      ]
    },
    {
      slug: 'traditional-products', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-traditional-products.jpg',
      name: { en: 'Traditional Products', hi: 'पारंपरिक उत्पाद' },
      blurb: { en: 'Long-standing crafts of the region.', hi: 'क्षेत्र की प्राचीन शिल्प।' },
      sub: [
        { slug: 'brassware', name: { en: 'Brassware', hi: 'पीतल के सामान' } },
        { slug: 'terracotta-art', name: { en: 'Terracotta art', hi: 'टेराकोटा कला' } },
        { slug: 'cane', name: { en: 'Cane work', hi: 'बाँस का काम' } }
      ]
    },
    {
      slug: 'religious-items', icon: 'box', image: 'assets/news-diyas.jpg',
      name: { en: 'Religious Items', hi: 'धार्मिक वस्तुएँ' },
      blurb: { en: 'For puja, ritual and devotion.', hi: 'पूजा, अनुष्ठान और भक्ति के लिए।' },
      sub: [
        { slug: 'diya', name: { en: 'Diyas', hi: 'दीये' } },
        { slug: 'incense', name: { en: 'Incense', hi: 'धूप' } },
        { slug: 'puja-thali', name: { en: 'Puja thali', hi: 'पूजा थाली' } }
      ]
    },
    {
      slug: 'gifts-souvenirs', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-gifts-souvenirs.jpg',
      name: { en: 'Gifts & Souvenirs', hi: 'उपहार एवं स्मृति चिन्ह' },
      blurb: { en: 'Take a piece of Buxar home.', hi: 'बक्सर की याद साथ ले जाएँ।' },
      sub: [
        { slug: 'souvenir', name: { en: 'Souvenirs', hi: 'स्मृति चिन्ह' } },
        { slug: 'gift-box', name: { en: 'Gift boxes', hi: 'उपहार बॉक्स' } }
      ]
    },
    {
      slug: 'home-lifestyle', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-home-lifestyle.jpg',
      name: { en: 'Home & Lifestyle', hi: 'घर एवं जीवनशैली' },
      blurb: { en: 'Practical and beautiful for the home.', hi: 'घर के लिए उपयोगी और सुंदर।' },
      sub: [
        { slug: 'decor', name: { en: 'Decor', hi: 'सजावट' } },
        { slug: 'kitchenware', name: { en: 'Kitchenware', hi: 'रसोई का सामान' } },
        { slug: 'textiles-home', name: { en: 'Home textiles', hi: 'घरेलू वस्त्र' } }
      ]
    },
    {
      slug: 'fashion', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-fashion.jpg',
      name: { en: 'Fashion', hi: 'फ़ैशन' },
      blurb: { en: 'Local style, timeless appeal.', hi: 'स्थानीय शैली, शाश्वत आकर्षण।' },
      sub: [
        { slug: 'clothing', name: { en: 'Clothing', hi: 'कपड़े' } },
        { slug: 'accessories', name: { en: 'Accessories', hi: 'सामान' } }
      ]
    },
    {
      slug: 'beauty-wellness', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-beauty-wellness.jpg',
      name: { en: 'Beauty & Wellness', hi: 'सौंदर्य एवं कल्याण' },
      blurb: { en: 'Local oils, herbs and care.', hi: 'स्थानीय तेल, जड़ी-बूटियाँ और देखभाल।' },
      sub: [
        { slug: 'oils', name: { en: 'Oils', hi: 'तेल' } },
        { slug: 'herbal', name: { en: 'Herbal', hi: 'हर्बल' } }
      ]
    },
    {
      slug: 'fresh-local', icon: 'leaf', image: 'assets/images/marketplace/locations/marketplace-location-bihar-countryside.jpg',
      name: { en: 'Fresh & Local', hi: 'ताज़ा एवं स्थानीय' },
      blurb: { en: 'Straight from the source.', hi: 'सीधे स्रोत से।' },
      sub: [
        { slug: 'vegetables', name: { en: 'Vegetables', hi: 'सब्ज़ियाँ' } },
        { slug: 'fruits', name: { en: 'Fruits', hi: 'फल' } },
        { slug: 'dairy', name: { en: 'Dairy', hi: 'डेयरी' } }
      ]
    },
    {
      slug: 'other', icon: 'box', image: 'assets/images/marketplace/categories/marketplace-other.jpg',
      name: { en: 'Other', hi: 'अन्य' },
      blurb: { en: 'Everything else that is local.', hi: 'बाकी सभी स्थानीय चीज़ें।' },
      sub: [
        { slug: 'misc', name: { en: 'Miscellaneous', hi: 'विविध' } }
      ]
    }
  ]

  /* ---------------------------------------------------------------- */
  /* Interest collections — "Shop by Interest"                        */
  /*                                                                  */
  /* Each one is a query, not a hand-made list. A tile only renders   */
  /* when at least one product actually matches it.                    */
  /* ---------------------------------------------------------------- */

  M.interests = [
    { slug: 'gifts-from-buxar', q: 'cat=gifts-souvenirs', icon: 'box', name: { en: 'Gifts from Buxar', hi: 'बक्सर से उपहार' } },
    { slug: 'traditional-products', q: 'cat=traditional-products', icon: 'box', name: { en: 'Traditional Products', hi: 'पारंपरिक उत्पाद' } },
    { slug: 'local-food', q: 'cat=local-food', icon: 'box', name: { en: 'Local Food', hi: 'स्थानीय भोजन' } },
    { slug: 'heritage-inspired', q: 'cat=handicrafts', icon: 'box', name: { en: 'Heritage-inspired Products', hi: 'विरासत से प्रेरित उत्पाद' } },
    { slug: 'handmade', q: 'cat=handicrafts', icon: 'box', name: { en: 'Handmade Products', hi: 'हस्तनिर्मित उत्पाद' } },
    { slug: 'for-festivals', q: 'cat=religious-items', icon: 'box', name: { en: 'Products for Festivals', hi: 'त्योहारों के लिए उत्पाद' } }
  ]

  /* ---------------------------------------------------------------- */
  /* ---------------------------------------------------------------- */
  /* Sellers                                                          */
  /*                                                                  */
  /* A seller appears here only after the business has been verified   */
  /* and the owner has claimed the listing. Every field shown on a    */
  /* store page — logo, cover, phone, WhatsApp, email, address,       */
  /* policies, gallery — must come from the owner, never be assumed.  */
  /*                                                                  */
  /* To publish a store, append a record shaped like this:            */
  /*   M.sellers.push({                                               */
  /*     id: 'seller-01',                                             */
  /*     slug: 'the-store-name',                                      */
  /*     name: { en: 'Store Name', hi: 'स्टोर का नाम' },              */
  /*     type: { en: 'Individual artisan', hi: 'व्यक्तिगत कारीगर' },   */
  /*     areaSlug: 'buxar-town',                                      */
  /*     location: 'buxar-town',                                      */
  /*     description: { en: '…', hi: '…' },                           */
  /*     logo: 'assets/…', cover: 'assets/…', gallery: ['assets/…'],  */
  /*     phone: '+91…', whatsapp: '919…', email: '…', website: '…',    */
  /*     address: '…', businessSlug: 'business-01',                   */
  /*     policies: { shipping: '…', returns: '…' },                   */
  /*     verified: true, demo: false, createdAt: 'YYYY-MM-DD'         */
  /*   })                                                             */
  /* Every card, filter, count and store page updates itself.         */
  /* ---------------------------------------------------------------- */

  M.sellers = []
  /* ---------------------------------------------------------------- */
  /* Products                                                          */
  /*                                                                  */
  /* A product appears here only when a verified seller has listed it  */
  /* with a real price, real imagery and a real origin. Nothing here   */
  /* is generated: no price, stock figure, weight, rating or review   */
  /* count may be invented, and 'origin' must never be inferred from  */
  /* the seller's address.                                            */
  /*                                                                  */
  /* To publish a product, append a record shaped like this:          */
  /*   M.products.push({                                              */
  /*     id: 'product-01', slug: 'product-name',                      */
  /*     name: { en: 'Product Name', hi: 'उत्पाद का नाम' },            */
  /*     category: 'handicrafts', sub: 'pottery',                     */
  /*     sellerId: 'seller-01', area: 'buxar-town',                   */
  /*     price: 450, mrp: 600, stock: 12, weight: '500 g',             */
  /*     material: 'Terracotta', origin: 'made-in-buxar',             */
  /*     short: { en: '…', hi: '…' }, story: { en: '…', hi: '…' },    */
  /*     images: ['assets/…'], rating: null, salesCount: 0,           */
  /*     demo: false, createdAt: 'YYYY-MM-DD'                         */
  /*   })                                                             */
  /* Every card, filter, facet count and detail page updates itself.  */
  /* ---------------------------------------------------------------- */

  M.products = []
  /* ---------------------------------------------------------------- */
  /* Lookups                                                           */
  /* ---------------------------------------------------------------- */

  function by (list, slug) {
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i]
    return null
  }

  M.catBySlug = function (slug) { return by(M.categories, slug) }
  M.areaBySlug = function (slug) { return by(M.areas, slug) }
  M.interestBySlug = function (slug) { return by(M.interests, slug) }
  M.productBySlug = function (slug) { return by(M.products, slug) }
  M.sellerBySlug = function (slug) { return by(M.sellers, slug) }
  M.sellerById = function (id) {
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].id === id) return M.sellers[i]
    return null
  }
  M.subBySlug = function (catSlug, subSlug) {
    var c = M.catBySlug(catSlug)
    if (!c || !c.sub) return null
    for (var i = 0; i < c.sub.length; i++) if (c.sub[i].slug === subSlug) return c.sub[i]
    return null
  }

  M.productsBySeller = function (sellerSlug) {
    var out = []
    for (var i = 0; i < M.products.length; i++) if (M.products[i].sellerSlug === sellerSlug) out.push(M.products[i])
    return out
  }
  M.productsByArea = function (areaSlug) {
    var out = []
    for (var i = 0; i < M.products.length; i++) if (M.products[i].location === areaSlug) out.push(M.products[i])
    return out
  }
  M.sellersByArea = function (areaSlug) {
    var out = []
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].areaSlug === areaSlug) out.push(M.sellers[i])
    return out
  }
  M.countIn = function (catSlug, areaSlug) {
    var n = 0
    for (var i = 0; i < M.products.length; i++) {
      if (catSlug && M.products[i].category !== catSlug) continue
      if (areaSlug && M.products[i].location !== areaSlug) continue
      n++
    }
    return n
  }

  /* The full category catalogue. Every category is browsable whether or not
     a listing exists inside it yet — an empty category is a shop window,
     not an error. */
  M.activeCategories = function () {
    return M.categories.slice()
  }

  /* Subcategories inside a category, straight from the catalogue. */
  M.activeSubcategories = function (catSlug) {
    var c = M.catBySlug(catSlug)
    if (!c || !c.sub) return []
    return c.sub.map(function (s) { return { cat: c.slug, sub: s } })
  }

  M.activeSellers = function () {
    return M.sellers.slice()
  }

  /* Interest tiles that at least one product satisfies. */
  M.activeInterests = function () {
    var out = []
    for (var i = 0; i < M.interests.length; i++) {
      var it = M.interests[i]
      var q = parseInterest(it.q)
      var n = M.products.filter(function (p) { return matchInterest(p, q) }).length
      if (n) out.push({ interest: it, count: n })
    }
    return out
  }

  function parseInterest (qs) {
    var out = {}
    String(qs || '').split('&').forEach(function (kv) {
      var p = kv.split('=')
      if (p[0]) out[p[0]] = p[1] || ''
    })
    return out
  }

  function matchInterest (p, q) {
    if (q.cat && p.category !== q.cat) return false
    if (q.sub && (!p.subcategory || p.subcategory.slug !== q.sub)) return false
    if (q.seller && p.sellerSlug !== q.seller) return false
    if (q.loc && p.location !== q.loc) return false
    if (q.tag && (p.tags || []).indexOf(q.tag) === -1) return false
    return true
  }
  M.matchInterest = matchInterest

  /* Interest tile URL, expressed in the listing page's own query. */
  M.interestUrl = function (it) {
    return M.listUrl('?' + it.q)
  }

  /* ---------------------------------------------------------------- */
  /* Data-presence predicates.                                        */
  /*                                                                  */
  /* The filter rail asks these before it renders a facet, so a       */
  /* control can never appear for data that does not exist.           */
  /* ---------------------------------------------------------------- */

  M.hasPrice = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i].price
      if (p !== null && p !== undefined && p !== '' && !isNaN(Number(p))) return true
    }
    return false
  }
  M.hasComparePrice = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i].compareAtPrice
      if (p !== null && p !== undefined && p !== '' && !isNaN(Number(p))) return true
    }
    return false
  }
  M.hasAvailability = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i]
      if (p.availability !== null && p.availability !== undefined && p.availability !== '') return true
      if (p.stock !== null && p.stock !== undefined) return true
    }
    return false
  }
  M.hasRatings = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i]
      if (p.rating !== null && p.rating !== undefined) return true
      if (p.reviewCount) return true
    }
    return false
  }
  M.hasReviews = function () {
    for (var i = 0; i < M.products.length; i++) if (M.products[i].reviewCount) return true
    return false
  }
  M.hasImages = function () {
    for (var i = 0; i < M.products.length; i++) if (M.products[i].images && M.products[i].images.length) return true
    return false
  }
  M.hasSpecs = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i]
      if (p.specifications && p.specifications.length) return true
      if (p.weight || p.dimensions || p.material) return true
    }
    return false
  }
  M.hasStory = function () {
    for (var i = 0; i < M.products.length; i++) if (M.products[i].story) return true
    return false
  }
  /* Any verified origin field at all. Until one exists the origin block
     shows its honest "not verified" note rather than a guess. */
  M.hasOrigin = function () {
    for (var i = 0; i < M.products.length; i++) {
      var p = M.products[i]
      if (p.productOrigin || p.productionLocation || p.madeIn) return true
    }
    return false
  }
  M.hasSellerContact = function () {
    for (var i = 0; i < M.sellers.length; i++) {
      var s = M.sellers[i]
      if (s.phone || s.email || s.website) return true
    }
    return false
  }
  M.hasBizLink = function () {
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].businessSlug) return true
    return false
  }
  M.hasSellerLogo = function () {
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].logo) return true
    return false
  }
  M.hasSellerCover = function () {
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].coverImage) return true
    return false
  }
  M.hasSellerPolicies = function () {
    for (var i = 0; i < M.sellers.length; i++) if (M.sellers[i].policies) return true
    return false
  }
  /* "Popular in Buxar" needs real order data, not a curated guess. */
  M.hasSales = function () {
    for (var i = 0; i < M.products.length; i++) if (M.products[i].salesCount) return true
    return false
  }
  M.hasVerified = function () {
    for (var i = 0; i < M.products.length; i++) if (M.products[i].verified === true) return true
    for (var j = 0; j < M.sellers.length; j++) if (M.sellers[j].verified === true) return true
    return false
  }
  /* Secure checkout is a backend property; nothing asserts it here. */
  M.hasSecureCheckout = function () { return false }

  M.priceBounds = function () {
    var lo = Infinity, hi = -Infinity
    for (var i = 0; i < M.products.length; i++) {
      var v = M.formatPrice(M.products[i].price)
      if (v === null) continue
      var n = Number(M.products[i].price)
      if (n < lo) lo = n
      if (n > hi) hi = n
    }
    if (!isFinite(lo)) return null
    return { min: lo, max: hi }
  }

  M.isVerified = function (rec) { return rec && rec.verified === true }

  /* ---------------------------------------------------------------- */
  /* Formatting                                                        */
  /* ---------------------------------------------------------------- */

  /* Returns null rather than a placeholder, so a caller cannot render
     "₹0" by accident. Never invent a number. */
  M.formatPrice = function (v) {
    if (v === null || v === undefined || v === '') return null
    var n = Number(v)
    if (isNaN(n)) return null
    try { return '₹' + n.toLocaleString('en-IN') } catch (e) { return '₹' + n }
  }

  /* Real discount percentage only when both numbers exist and the
     original is genuinely higher. */
  M.discountPct = function (price, compareAt) {
    var a = M.formatPrice(price), b = M.formatPrice(compareAt)
    if (a === null || b === null) return null
    var p = Number(price), c = Number(compareAt)
    if (!(c > p) || p <= 0) return null
    return Math.round((c - p) / c * 100)
  }

  /* A relative date from a real ISO timestamp, or null. */
  M.formatDate = function (iso) {
    if (!iso) return null
    var d = new Date(iso)
    if (isNaN(d.getTime())) return null
    try {
      return d.toLocaleDateString(lang() === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch (e) { return iso }
  }

  M.monogram = function (nameObj) {
    var n = get(nameObj) || ''
    var parts = n.trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '—'
    var m = ''
    for (var i = 0; i < parts.length && i < 2; i++) m += parts[i].charAt(0).toUpperCase()
    return m || '—'
  }

  /* Every searchable string on a record, in both languages. */
  M.searchTerms = function (rec) {
    var out = []
    function push (v) { out = out.concat(all(v)) }
    push(rec.name)
    push(rec.description)
    push(rec.subcategory && rec.subcategory.name)
    push(rec.sellerName)
    push(rec.story)
    if (rec.tags) rec.tags.forEach(push)
    var c = M.catBySlug(rec.category); if (c) { push(c.name); push(c.blurb) }
    var a = M.areaBySlug(rec.location); if (a) push(a.name)
    if (rec.sellerSlug) { var s = M.sellerBySlug(rec.sellerSlug); if (s) { push(s.name); push(s.type) } }
    return out.join(' ').toLowerCase()
  }

  /* Relevance: exact name prefix beats a name hit beats anything else. */
  M.score = function (rec, q) {
    if (!q) return 0
    var name = all(rec.name).join(' ').toLowerCase()
    if (name.indexOf(q) === 0) return 100
    if (name.indexOf(q) > -1) return 70
    var seller = all(rec.sellerName).join(' ').toLowerCase()
    if (seller.indexOf(q) > -1) return 50
    var cat = M.catBySlug(rec.category)
    if (cat && all(cat.name).join(' ').toLowerCase().indexOf(q) > -1) return 40
    var area = M.areaBySlug(rec.location)
    if (area && all(area.name).join(' ').toLowerCase().indexOf(q) > -1) return 30
    if (M.searchTerms(rec).indexOf(q) > -1) return 10
    return 0
  }

  /* ---------------------------------------------------------------- */
  /* URL builders                                                      */
  /*                                                                  */
  /* Physical pages are query-driven so one file serves every slug.    */
  /* Documented mapping:                                               */
  /*   /marketplace/                  -> marketplace.html            */
  /*   /marketplace/product/[slug]/   -> marketplace/product.html?slug= */
  /*   /marketplace/category/[slug]/  -> marketplace/list.html?cat=   */
  /*   /marketplace/seller/[slug]/    -> marketplace/seller.html?slug=*/
  /*   /marketplace/cart/             -> marketplace/cart.html       */
  /*   /marketplace/wishlist/         -> marketplace/wishlist.html   */
  /*   /marketplace/checkout/         -> marketplace/checkout.html   */
  /*   /marketplace/sell/             -> marketplace/sell.html      */
  /*   /marketplace/sell/product/     -> marketplace/sell-product.html */
  /* A real backend can serve pretty URLs from the same query.         */
  /* ---------------------------------------------------------------- */

  function url (p) {
    var base = M.path || ''
    if (!p) return base
    if (p.charAt(0) === '/') p = p.slice(1)
    return base + p
  }

  /* ------------------------------------------------------------------ */
  /* Marketplace image library                                           */
  /*                                                                    */
  /* Every path below points at a real, licensed photograph recorded in  */
  /* js/market-image-credits.js. They are category, editorial and         */
  /* atmosphere imagery - NOT photographs of products sold by a verified  */
  /* Buxar seller. Never present one as a product photo.                  */
  /* ------------------------------------------------------------------ */

  M.images = {
    hero: 'assets/images/marketplace/hero/marketplace-hero-local-commerce.jpg',
    story: 'assets/images/marketplace/stories/marketplace-stories-craft.jpg',
    maker: 'assets/images/marketplace/sellers/marketplace-maker-madhubani.jpg',
    town: 'assets/images/marketplace/locations/marketplace-location-buxar-town.jpg',
    countryside: 'assets/images/marketplace/locations/marketplace-location-bihar-countryside.jpg'
  }

  /* Resolve a site-relative image path against the current page depth, so
     the same value works from /, from /marketplace/ and from
     /explore/<area>/. */
  M.imageUrl = function (p) { return p ? url(p) : '' }

  /* Hero per surface: the wide hero at the top, the countryside frame for
     shop-by-location cards that have no photograph of their own. */
  M.heroImage = function () { return M.imageUrl(M.images.hero) }
  M.areaImage = function (a) {
    if (!a) return M.imageUrl(M.images.countryside)
    if (a.slug === 'buxar-town') return M.imageUrl(M.images.town)
    return M.imageUrl(M.images.countryside)
  }

  /* Provenance. Read lazily rather than captured at module-eval time, so
     the credits script may be loaded before OR after this file. */
  M.imageCredits = function () {
    return window.TheBuxarMarketCredits || []
  }
  M.creditFor = function (path) {
    if (!path) return null
    var all = M.imageCredits()
    for (var i = 0; i < all.length; i++) {
      if (all[i].src === path || all[i].key === path) return all[i]
    }
    return null
  }
  /* Every image actually in use on the marketplace, in the order the
     credits file lists them, for the discreet "Image credits" panel. */
  M.creditList = function () {
    return M.imageCredits().filter(function (c) { return c && c.src })
  }

  M.marketUrl = function () { return url('marketplace.html') }
  M.listUrl = function (qs) { return url('marketplace/list.html') + (qs || '') }
  M.creditsUrl = function () { return url('credits.html') }
  M.productUrl = function (p) { return url('marketplace/product.html?slug=' + encodeURIComponent(p.slug)) }
  M.categoryUrl = function (slug) { return url('marketplace/list.html?cat=' + encodeURIComponent(slug)) }
  M.interestCatUrl = function (slug) { return M.listUrl('?cat=' + encodeURIComponent(slug)) }
  M.sellerUrl = function (s) { return url('marketplace/seller.html?slug=' + encodeURIComponent(s.slug)) }
  M.cartUrl = function () { return url('marketplace/cart.html') }
  M.wishlistUrl = function () { return url('marketplace/wishlist.html') }
  M.checkoutUrl = function () { return url('marketplace/checkout.html') }
  M.sellUrl = function () { return url('marketplace/sell.html') }
  M.sellProductUrl = function () { return url('marketplace/sell-product.html') }
  M.areaUrl = function (slug) { return M.listUrl('?loc=' + encodeURIComponent(slug)) }
  M.areaExploreUrl = function (slug) {
    var a = M.areaBySlug(slug)
    return a ? url(a.explore) : url('explore.html')
  }
  /* Cross-module link into the Business Directory. */
  M.businessUrl = function (bizSlug) { return url('business/profile.html?slug=' + encodeURIComponent(bizSlug)) }
  M.businessProfileUrl = M.businessUrl

  /* ---------------------------------------------------------------- */
  /* Cart + wishlist                                                   */
  /*                                                                  */
  /* Front-end only, and honest about it: the store is this browser's */
  /* localStorage, nothing more. No order is placed, no stock is      */
  /* reserved, no payment is taken. A backend replaces these three    */
  /* functions with API calls; every renderer keeps working.           */
  /* ---------------------------------------------------------------- */

  var CART_KEY = 'buxar-market-cart'
  var WISH_KEY = 'buxar-market-wish'
  var SAVED_KEY = 'buxar-market-saved'

  /* Storage fallback. localStorage throws on file:// in some browsers and
     is disabled entirely in private mode. The cart must still work for the
     length of the visit, so writes go to an in-memory mirror whenever the
     real store is unavailable. M.store.persistent() reports which of the
     two is in play, and the cart page says so rather than implying the
     cart will survive a reload. */
  var memory = {}

  function ls () {
    try {
      var probe = '__mk_probe__'
      window.localStorage.setItem(probe, '1')
      window.localStorage.removeItem(probe)
      return window.localStorage
    } catch (e) { return null }
  }

  var LS = ls()

  function readStore (key) {
    var raw = null
    if (LS) { try { raw = LS.getItem(key) } catch (e) { raw = null } }
    if (raw === null) raw = Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null
    if (!raw) return []
    try {
      var v = JSON.parse(raw)
      return Array.isArray(v) ? v : []
    } catch (e) { return [] }
  }

  function writeStore (key, val) {
    var raw = JSON.stringify(val)
    memory[key] = raw
    if (!LS) return false
    try { LS.setItem(key, raw); return true } catch (e) { return false }
  }

  /* Line = { slug, qty }. Stock is never enforced because no record has
     stock; the quantity stepper caps at 99 as a UI guard only. */
  function normalise (lines) {
    var out = []
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i]
      if (!l || !l.slug) continue
      if (!M.productBySlug(l.slug)) continue
      var q = parseInt(l.qty, 10)
      if (isNaN(q) || q < 1) q = 1
      if (q > 99) q = 99
      var dup = null
      for (var j = 0; j < out.length; j++) if (out[j].slug === l.slug) dup = out[j]
      if (dup) dup.qty = Math.min(99, dup.qty + q)
      else out.push({ slug: l.slug, qty: q })
    }
    return out
  }

  M.store = {
    cart: function () { return normalise(readStore(CART_KEY)) },
    wishlist: function () { return normalise(readStore(WISH_KEY)) },
    saved: function () { return normalise(readStore(SAVED_KEY)) },
    /* localStorage can be unavailable (file:// in some browsers,
       private mode). The UI must still work — reads fall back to an
       in-memory mirror — but the cart then cannot survive a reload, so
       this reports that instead of throwing. */
    persistent: function () { return LS !== null },
    addToCart: function (slug, qty) {
      var lines = readStore(CART_KEY)
      var found = false
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].slug === slug) {
          lines[i].qty = Math.min(99, (parseInt(lines[i].qty, 10) || 1) + (parseInt(qty, 10) || 1))
          found = true
          break
        }
      }
      if (!found) lines.push({ slug: slug, qty: Math.min(99, parseInt(qty, 10) || 1) })
      writeStore(CART_KEY, normalise(lines))
    },
    setQty: function (slug, qty) {
      var q = parseInt(qty, 10)
      if (isNaN(q) || q < 1) return M.store.removeFromCart(slug)
      var lines = normalise(readStore(CART_KEY))
      for (var i = 0; i < lines.length; i++) if (lines[i].slug === slug) lines[i].qty = Math.min(99, q)
      writeStore(CART_KEY, lines)
    },
    removeFromCart: function (slug) {
      writeStore(CART_KEY, normalise(readStore(CART_KEY)).filter(function (l) { return l.slug !== slug }))
    },
    clearCart: function () { writeStore(CART_KEY, []) },
    addToWishlist: function (slug) {
      var lines = normalise(readStore(WISH_KEY))
      var has = lines.some(function (l) { return l.slug === slug })
      if (!has) lines.push({ slug: slug, qty: 1 })
      writeStore(WISH_KEY, lines)
    },
    removeFromWishlist: function (slug) {
      writeStore(WISH_KEY, normalise(readStore(WISH_KEY)).filter(function (l) { return l.slug !== slug }))
    },
    inWishlist: function (slug) {
      return normalise(readStore(WISH_KEY)).some(function (l) { return l.slug === slug })
    },
    toggleWishlist: function (slug) {
      if (M.store.inWishlist(slug)) { M.store.removeFromWishlist(slug); return false }
      M.store.addToWishlist(slug); return true
    },
    saveForLater: function (slug) {
      var lines = normalise(readStore(SAVED_KEY))
      if (!lines.some(function (l) { return l.slug === slug })) lines.push({ slug: slug, qty: 1 })
      writeStore(SAVED_KEY, lines)
      M.store.removeFromCart(slug)
    },
    removeSaved: function (slug) {
      writeStore(SAVED_KEY, normalise(readStore(SAVED_KEY)).filter(function (l) { return l.slug !== slug }))
    },
    savedToCart: function (slug) {
      var lines = normalise(readStore(SAVED_KEY))
      writeStore(SAVED_KEY, lines.filter(function (l) { return l.slug !== slug }))
      M.store.addToCart(slug, 1)
    },
    moveToWishlist: function (slug) {
      M.store.addToWishlist(slug)
      M.store.removeFromCart(slug)
    }
  }

  /* Cart maths. Returns null totals whenever any line lacks a real
     price, because a subtotal built from unknown prices would be a
     fabricated number. */
  M.cartTotals = function (lines) {
    var priced = true
    var sub = 0
    var items = []
    for (var i = 0; i < lines.length; i++) {
      var p = M.productBySlug(lines[i].slug)
      if (!p) continue
      var q = lines[i].qty
      var unit = p.price === null || p.price === undefined || isNaN(Number(p.price)) ? null : Number(p.price)
      if (unit === null) priced = false
      else sub += unit * q
      items.push({ product: p, qty: q, unit: unit, line: unit === null ? null : unit * q })
    }
    var discounts = 0
    if (priced) {
      for (var j = 0; j < items.length; j++) {
        var pct = M.discountPct(items[j].product.price, items[j].product.compareAtPrice)
        if (pct) discounts += (items[j].line * pct) / 100
      }
    } else discounts = 0
    /* Delivery and any coupon cost come from the backend. Zero is a
       real statement only when prices exist; otherwise it is withheld. */
    return {
      items: items,
      priced: priced,
      subtotal: priced ? sub : null,
      discount: priced ? discounts : null,
      delivery: priced ? 0 : null,
      total: priced ? (sub - discounts) : null,
      count: lines.length
    }
  }
})()