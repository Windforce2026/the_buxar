/* ------------------------------------------------------------------ */
/* TheBuxar.com — Listing verticals                                   */
/*                                                                     */
/* Five new verticals share one data model and one renderer, because    */
/* they behave identically: a set of categories, a set of records,     */
/* search, a category rail and a region filter.                        */
/*                                                                     */
/*   F  food          restaurants, cafes, hotels, caterers, sweets      */
/*   S  services      the directory's Local Services group             */
/*   J  jobs          openings across the district                    */
/*   PR property      sale, rent, plots, commercial, agricultural      */
/*   C  classifieds   everything the portal does not give a page of    */
/*                                                                     */
/* EVERY record array below is deliberately empty. No restaurant, hotel, */
/* vacancy or plot has been invented to make a page look finished. A   */
/* page with no records shows a plain, useful empty state and a way    */
/* for the owner to submit — which is the honest state of affairs and  */
/* also the state the client can fill in without anyone editing code.  */
/*                                                                     */
/* Fields marked REQUIRED are what a real record needs. The optional    */
/* ones simply enrich it. Nothing here is rendered unless it exists.   */
/*                                                                     */
/* Language: bilingual throughout.                                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var L = window.TheBuxarListings = window.TheBuxarListings || {}
  window.TheBuxarListings = L

  var T = function (en, hi) { return { en: en, hi: hi } }
  function cat (slug, en, hi, nounEn, nounHi) {
    return { slug: slug, name: T(en, hi), noun: T(nounEn || (en + 's'), nounHi || hi) }
  }

  L.get = function (o) {
    if (typeof o === 'string') return o
    return o ? (o[L.lang()] || o.en || '') : ''
  }
  L.lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }

  L.path = function () {
    var c = window.TheBuxarConfig || {}
    return typeof c.path === 'string' ? c.path : './'
  }

  /* ------------------------------------------------------------------ */
  /* Food                                                               */
  /* ------------------------------------------------------------------ */
  var F = {
    key: 'food',
    icon: 'food',
    label: T('Food', 'भोजन'),
    page: 'food.html',
    title: T('Food & Restaurants in Buxar', 'बक्सर में भोजन और रेस्तराँ'),
    lead: T('Restaurants, cafes, sweet shops, caterers and places to stay — across Buxar.', 'बक्सर भर के रेस्तराँ, कैफ़े, मिठाई की दुकानें, केटरर और ठहरने की जगह।'),
    categories: [
      cat('restaurants', 'Restaurant', 'रेस्तराँ', 'Restaurants', 'रेस्तराँ'),
      cat('cafes', 'Cafe', 'कैफ़े', 'Cafes', 'कैफ़े'),
      cat('dhaba', 'Dhaba & Highway Food', 'ढाबा और हाईवे फूड', 'Dhabas', 'ढाबे'),
      cat('street-food', 'Street Food', 'स्ट्रीट फूड', 'Street Food Stalls', 'स्ट्रीट फूड'),
      cat('sweets', 'Sweet Shop', 'मिठाई की दुकान', 'Sweet Shops', 'मिठाई की दुकानें'),
      cat('bakery', 'Bakery', 'बेकरी', 'Bakeries', 'बेकरी'),
      cat('caterers', 'Caterer', 'केटरर', 'Caterers', 'केटरर'),
      cat('banquet-halls', 'Banquet Hall', 'बैंकट हॉल', 'Banquet Halls', 'बैंकट हॉल'),
      cat('hotels', 'Hotel', 'होटल', 'Hotels', 'होटल'),
      cat('guest-house', 'Guest House', 'गेस्ट हाउस', 'Guest Houses', 'गेस्ट हाउस')
    ],
    /* What a real record carries. Used by the submit form and the card. */
    fields: [
      { k: 'veg', en: 'Vegetarian only', hi: 'शुद्ध शाकाहारी', type: 'bool' },
      { k: 'cuisine', en: 'Cuisine', hi: 'व्यंजन', type: 'text' },
      { k: 'priceForTwo', en: 'Approx. cost for two', hi: 'दो लोगों की अनुमानित लागत', type: 'money' },
      { k: 'hours', en: 'Opening hours', hi: 'खुलने का समय', type: 'text' },
      { k: 'delivery', en: 'Home delivery', hi: 'होम डिलीवरी', type: 'bool' }
    ],
    /* A directory listing in the Hospitality group is a real restaurant,
       hotel or caterer, so those are surfaced here rather than being
       entered twice. Nothing is copied — the card links to the listing. */
    fromDirectory: 'hospitality',
    submit: { en: 'Add your restaurant or hotel', hi: 'अपना रेस्तराँ या होटल जोड़ें' }
  }

  /* ------------------------------------------------------------------ */
  /* Services                                                           */
  /* ------------------------------------------------------------------ */
  var serviceCats = []
  try {
    var bz = window.TheBuxarBusiness
    if (bz && bz.subsOf) serviceCats = bz.subsOf('local-services')
  } catch (e) {}

  var S = {
    key: 'services',
    icon: 'services',
    label: T('Services', 'सेवाएँ'),
    page: 'services.html',
    title: T('Local Services in Buxar', 'बक्सर में स्थानीय सेवाएँ'),
    lead: T('Electricians, plumbers, carpenters, mechanics, repairs and daily help — across Buxar.', 'बक्सर भर के इलेक्ट्रीशियन, प्लंबर, बढ़ई, मैकेनिक, मरम्मत और दैनिक सहायता।'),
    categories: serviceCats.length ? serviceCats : [
      cat('electricians', 'Electrician', 'इलेक्ट्रीशियन'),
      cat('plumbers', 'Plumber', 'प्लंबर'),
      cat('carpenters', 'Carpenter', 'बढ़ई'),
      cat('painters', 'Painter', 'पेंटर'),
      cat('ac-repair', 'AC Repair', 'एसी रिपेयर'),
      cat('appliance-repair', 'Appliance Repair', 'उपकरण रिपेयर'),
      cat('mechanics', 'Mechanic', 'मैकेनिक'),
      cat('cleaning-services', 'Cleaning Service', 'सफ़ाई सेवा'),
      cat('security-services', 'Security Service', 'सुरक्षा सेवा'),
      cat('packers-movers', 'Packers & Movers', 'पैकर्स एंड मूवर्स')
    ],
    fields: [
      { k: 'callOutFee', en: 'Call-out charge', hi: 'आने का शुल्क', type: 'money' },
      { k: 'available', en: 'Available', hi: 'उपलब्ध', type: 'text' },
      { k: 'experience', en: 'Years of experience', hi: 'अनुभव के वर्ष', type: 'number' },
      { k: 'homeVisit', en: 'Home visit', hi: 'घर पर आना', type: 'bool' }
    ],
    fromDirectory: 'local-services',
    submit: { en: 'List your service', hi: 'अपनी सेवा सूचीबद्ध करें' }
  }

  /* ------------------------------------------------------------------ */
  /* Jobs                                                               */
  /* ------------------------------------------------------------------ */
  var J = {
    key: 'jobs',
    icon: 'briefcase',
    label: T('Jobs', 'रोज़गार'),
    page: 'jobs.html',
    title: T('Jobs in Buxar', 'बक्सर में रोज़गार'),
    lead: T('Openings for government, schools, banks, shops and local employers across the district.', 'ज़िले में सरकारी, विद्यालय, बैंक, दुकान और स्थानीय नियोक्ताओं के पद।'),
    categories: [
      cat('government', 'Government Job', 'सरकारी नौकरी', 'Government Jobs', 'सरकारी नौकरियाँ'),
      cat('teaching', 'Teaching', 'शिक्षण कार्य', 'Teaching Jobs', 'शिक्षण कार्य'),
      cat('nursing', 'Medical & Nursing', 'चिकित्सा एवं नर्सिंग', 'Medical Jobs', 'चिकित्सा पद'),
      cat('banking', 'Banking', 'बैंकिंग', 'Banking Jobs', 'बैंकिंग पद'),
      cat('police', 'Police & Defence', 'पुलिस एवं रक्षा', 'Police Jobs', 'पुलिस पद'),
      cat('driving', 'Driving', 'ड्राइविंग', 'Driving Jobs', 'ड्राइविंग पद'),
      cat('sales', 'Sales', 'बिक्री', 'Sales Jobs', 'बिक्री पद'),
      cat('construction', 'Construction & Labour', 'निर्माण एवं मज़दूरी', 'Construction Work', 'निर्माण कार्य'),
      cat('it', 'IT & Office', 'आईटी एवं कार्यालय', 'IT Jobs', 'आईटी पद'),
      cat('internship', 'Internship', 'इंटर्नशिप', 'Internships', 'इंटर्नशिप'),
      cat('work-from-home', 'Work From Home', 'घर से काम', 'Work From Home Jobs', 'घर से काम')
    ],
    fields: [
      { k: 'salary', en: 'Salary', hi: 'वेतन', type: 'money' },
      { k: 'qualification', en: 'Qualification', hi: 'योग्यता', type: 'text' },
      { k: 'experience', en: 'Experience required', hi: 'आवश्यक अनुभव', type: 'text' },
      { k: 'applyBy', en: 'Apply before', hi: 'आवेदन की अंतिम तिथि', type: 'date' },
      { k: 'employment', en: 'Type of job', hi: 'नौकरी का प्रकार', type: 'text' }
    ],
    submit: { en: 'Post a job', hi: 'नौकरी पोस्ट करें' }
  }

  /* ------------------------------------------------------------------ */
  /* Property                                                           */
  /* ------------------------------------------------------------------ */
  var PR = {
    key: 'property',
    icon: 'home',
    label: T('Property', 'संपत्ति'),
    page: 'property.html',
    title: T('Property in Buxar', 'बक्सर में संपत्ति'),
    lead: T('Houses, flats, plots, shops and agricultural land — for sale or rent, across the district.', 'ज़िले में मकान, फ़्लैट, प्लॉट, दुकान और कृषि भूमि — बेचने या किराये के लिए।'),
    categories: [
      cat('house-sale', 'House for Sale', 'बिक्री हेतु मकान', 'Houses for Sale', 'बिक्री हेतु मकान'),
      cat('house-rent', 'House on Rent', 'किराये हेतु मकान', 'Houses for Rent', 'किराये हेतु मकान'),
      cat('flat-sale', 'Flat for Sale', 'बिक्री हेतु फ़्लैट', 'Flats for Sale', 'बिक्री हेतु फ़्लैट'),
      cat('flat-rent', 'Flat on Rent', 'किराये हेतु फ़्लैट', 'Flats for Rent', 'किराये हेतु फ़्लैट'),
      cat('plot-sale', 'Plot for Sale', 'बिक्री हेतु प्लॉट', 'Plots for Sale', 'बिक्री हेतु प्लॉट'),
      cat('shop-sale', 'Shop for Sale', 'बिक्री हेतु दुकान', 'Shops for Sale', 'बिक्री हेतु दुकान'),
      cat('shop-rent', 'Shop on Rent', 'किराये हेतु दुकान', 'Shops for Rent', 'किराये हेतु दुकान'),
      cat('commercial-rent', 'Commercial Rent', 'व्यावसायिक किराया', 'Commercial Rentals', 'व्यावसायिक किराया'),
      cat('agricultural', 'Agricultural Land', 'कृषि भूमि', 'Agricultural Land', 'कृषि भूमि'),
      cat('factory', 'Factory / Industrial Plot', 'कारखाना / औद्योगिक भूमि', 'Industrial Properties', 'औद्योगिक संपत्ति')
    ],
    fields: [
      { k: 'price', en: 'Price', hi: 'कीमत', type: 'money' },
      { k: 'area', en: 'Built-up area', hi: 'निर्मित क्षेत्र', type: 'text' },
      { k: 'bedrooms', en: 'Bedrooms', hi: 'कमरे', type: 'number' },
      { k: 'facing', en: 'Facing', hi: 'आमने-सामने', type: 'text' },
      { k: 'furnished', en: 'Furnished', hi: 'सजा हुआ', type: 'bool' },
      { k: 'water', en: 'Water supply', hi: 'जल आपूर्ति', type: 'text' }
    ],
    submit: { en: 'Post your property', hi: 'अपनी संपत्ति पोस्ट करें' }
  }

  /* ------------------------------------------------------------------ */
  /* Classifieds                                                        */
  /* ------------------------------------------------------------------ */
  var C = {
    key: 'classifieds',
    icon: 'tag',
    label: T('Classifieds', 'विज्ञापन'),
    page: 'classifieds.html',
    title: T('Classifieds in Buxar', 'बक्सर के विज्ञापन'),
    lead: T('One short ad for anything that does not need a page of its own — a vehicle, a seat, a lesson, a lost item.', 'जिसके लिए अलग पेज की ज़रूरत नहीं — वाहन, सीट, ट्यूशन, खोई हुई वस्तु।'),
    categories: [
      cat('vehicles', 'Vehicles', 'वाहन', 'Vehicles', 'वाहन'),
      cat('buy-sell', 'Buy & Sell', 'खरीद-बेच', 'Buy & Sell', 'खरीद-बेच'),
      cat('matrimony', 'Matrimony', 'शादी', 'Matrimony', 'शादी'),
      cat('tuition', 'Tuition & Classes', 'ट्यूशन एवं कक्षाएँ', 'Tuition', 'ट्यूशन'),
      cat('lost-found', 'Lost & Found', 'खोया-पाया', 'Lost & Found', 'खोया-पाया'),
      cat('events', 'Events & Services', 'आयोजन एवं सेवाएँ', 'Event Services', 'आयोजन सेवाएँ'),
      cat('furniture', 'Furniture & Household', 'फर्नीचर एवं घरेलू', 'Furniture', 'फर्नीचर'),
      cat('general', 'General Notice', 'सामान्य सूचना', 'General Notices', 'सामान्य सूचनाएँ')
    ],
    fields: [
      { k: 'price', en: 'Price', hi: 'कीमत', type: 'money' },
      { k: 'condition', en: 'Condition', hi: 'स्थिति', type: 'text' },
      { k: 'postedBy', en: 'Posted by', hi: 'पोस्ट करने वाला', type: 'text' }
    ],
    submit: { en: 'Place a classified ad', hi: 'विज्ञापन दें' },
    /* Classifieds that genuinely belong to another page route there
       instead of being duplicated here. */
    redirects: [
      { slug: 'property', href: 'property.html', en: 'Property', hi: 'संपत्ति' },
      { slug: 'jobs', href: 'jobs.html', en: 'Jobs', hi: 'रोज़गार' },
      { slug: 'services', href: 'services.html', en: 'Services', hi: 'सेवाएँ' }
    ]
  }

  /* ------------------------------------------------------------------ */
  /* Records — empty by design                                          */
  /*                                                                     */
  /* To publish a listing, add an object here. The minimum is slug,      */
  /* name, category and area; everything else is shown only if present.  */
  /*                                                                     */
  /*   F.records = [{                                                      */
  /*     slug: 'sharma-sweets',                                           */
  /*     name: { en: 'Sharma Sweets', hi: 'शर्मा मिठाई' },                 */
  /*     category: 'sweets',                                              */
  /*     area: 'buxar-city',                                              */
  /*     phone: '06183224389',                                            */
  /*     cuisine: { en: 'Traditional', hi: 'पारंपरिक' },                     */
  /*     priceForTwo: { en: '₹200', hi: '₹200' }                          */
  /*   }]                                                                 */
  /* ------------------------------------------------------------------ */
  L.verticals = { F: F, S: S, J: J, PR: PR, C: C }
  ;['F', 'S', 'J', 'PR', 'C'].forEach(function (k) {
    L.verticals[k].records = []
    L.verticals[k].byKey = function (key) {
      var m = { F: F, S: S, J: J, PR: PR, C: C }
      return m[key] || null
    }
  })

  L.byKey = function (key) { return L.verticals[key] || null }

  /* Records that belong to a vertical, in the order a reader expects:
     newest first, then anything marked featured. */
  L.itemsOf = function (key) {
    var v = L.byKey(key)
    if (!v) return []
    var out = v.records.slice()
    out.sort(function (a, b) {
      var fa = a.featured ? 0 : 1, fb = b.featured ? 0 : 1
      if (fa !== fb) return fa - fb
      return String(b.date || '').localeCompare(String(a.date || ''))
    })
    return out
  }

  /* The categories that actually hold a record, in taxonomy order. */
  L.activeCategories = function (key) {
    var v = L.byKey(key)
    if (!v) return []
    var seen = {}
    v.records.forEach(function (r) { if (r.category) seen[r.category] = true })
    return v.categories.filter(function (c) { return seen[c.slug] })
  }

  L.catName = function (key, slug) {
    var v = L.byKey(key)
    if (!v) return ''
    for (var i = 0; i < v.categories.length; i++) {
      if (v.categories[i].slug === slug) return L.get(v.categories[i].name)
    }
    return ''
  }
})()
