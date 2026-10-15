/* ------------------------------------------------------------------ */
/* TheBuxar.com — Directory taxonomy                                   */
/*                                                                     */
/* Seven groups. The first six are the client's specification, adopted  */
/* verbatim as the group and sub-category list:                        */
/*                                                                     */
/*   Retail · Professional Services · Local Services                   */
/*   Healthcare · Education · Hospitality                             */
/*                                                                     */
/* The seventh, Civic & Public, keeps the district's government          */
/* offices — the health centres, police stations, banks, schools and   */
/* block offices already published in the directory. Nothing was        */
/* reclassified or lost when the taxonomy was reorganised.              */
/*                                                                     */
/* `B.categories` stays a FLAT list of every group and sub-category so  */
/* the existing renderer, facet rail and URL scheme keep working        */
/* unchanged. `B.groups` is the new tree the UI renders.               */
/*                                                                     */
/* Every sub-category carries the icon used on its card and the         */
/* plural noun shown on the card, so nothing is rendered twice.        */
/*                                                                     */
/* Language: bilingual throughout.                                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var B = window.TheBuxarBusiness
  var T = function (en, hi) { return { en: en, hi: hi } }

  /* Shorthand for a sub-category: slug, singular label, plural noun. */
  function sub (slug, en, hi, pluralEn, pluralHi, icon) {
    return {
      slug: slug,
      name: T(en, hi),
      noun: T(pluralEn || (en + 's'), pluralHi || hi),
      icon: icon
    }
  }

  B.groups = [
    /* ---------------------------------------------------------------- */
    {
      slug: 'retail',
      icon: 'shopping',
      name: T('Retail', 'खुदरा'),
      blurb: T('Shops and stores for everyday needs.', 'रोज़मर्रा की ज़रूरतों की दुकानें।'),
      subs: [
        sub('clothing', 'Clothing Store', 'कपड़ा दुकान', 'Clothing Stores', 'कपड़ा दुकानें', 'shopping'),
        sub('jewellery', 'Jeweller', 'ज्वेलर', 'Jewellers', 'ज्वेलर्स', 'shopping'),
        sub('footwear', 'Footwear Shop', 'जूता दुकान', 'Footwear Shops', 'जूता दुकानें', 'shopping'),
        sub('electronics', 'Electronics Shop', 'इलेक्ट्रॉनिक्स दुकान', 'Electronics Shops', 'इलेक्ट्रॉनिक्स दुकानें', 'shopping'),
        sub('mobile-shops', 'Mobile Shop', 'मोबाइल दुकान', 'Mobile Shops', 'मोबाइल दुकानें', 'shopping'),
        sub('furniture', 'Furniture Shop', 'फर्नीचर दुकान', 'Furniture Shops', 'फर्नीचर दुकानें', 'building'),
        sub('hardware', 'Hardware Store', 'हार्डवेयर दुकान', 'Hardware Stores', 'हार्डवेयर दुकानें', 'construction'),
        sub('building-materials', 'Building Material Supplier', 'निर्माण सामग्री आपूर्तिकर्ता', 'Building Material Suppliers', 'निर्माण सामग्री आपूर्तिकर्ता', 'construction'),
        sub('grocery', 'Grocery Store', 'किराना दुकान', 'Grocery Stores', 'किराना दुकानें', 'shopping'),
        sub('medical-stores', 'Medical Store', 'दवा दुकान', 'Medical Stores', 'दवा दुकानें', 'health'),
        sub('books-stationery', 'Books & Stationery', 'किताबें व स्टेशनरी', 'Books & Stationery', 'किताबें व स्टेशनरी', 'shopping'),
        sub('spare-parts', 'Spare Parts', 'स्पेयर पार्ट्स', 'Spare Parts Dealers', 'स्पेयर पार्ट्स विक्रेता', 'automobile')
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      slug: 'professional',
      icon: 'professional',
      name: T('Professional Services', 'पेशेवर सेवाएँ'),
      blurb: T('Advisors, consultants and office work.', 'सलाहकार, परामर्शदाता और कार्यालयी सेवाएँ।'),
      subs: [
        sub('lawyers', 'Lawyer', 'वकील', 'Lawyers', 'वकील', 'professional'),
        sub('chartered-accountants', 'Chartered Accountant', 'चार्टर्ड अकाउंटेंट', 'Chartered Accountants', 'चार्टर्ड अकाउंटेंट', 'finance'),
        sub('architects', 'Architect', 'आर्किटेक्ट', 'Architects', 'आर्किटेक्ट', 'construction'),
        sub('engineers', 'Engineer', 'इंजीनियर', 'Engineers', 'इंजीनियर', 'construction'),
        sub('consultants', 'Consultant', 'सलाहकार', 'Consultants', 'सलाहकार', 'professional'),
        sub('insurance-agents', 'Insurance Agent', 'बीमा एजेंट', 'Insurance Agents', 'बीमा एजेंट', 'finance'),
        sub('financial-services', 'Financial Service', 'वित्तीय सेवा', 'Financial Services', 'वित्तीय सेवाएँ', 'finance'),
        sub('digital-marketing', 'Digital Marketing Agency', 'डिजिटल मार्केटिंग एजेंसी', 'Digital Marketing Agencies', 'डिजिटल मार्केटिंग एजेंसियाँ', 'professional'),
        sub('it-services', 'IT Service', 'आईटी सेवा', 'IT Services', 'आईटी सेवाएँ', 'professional')
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      slug: 'local-services',
      icon: 'services',
      name: T('Local Services', 'स्थानीय सेवाएँ'),
      blurb: T('Repairs, plumbing, electrical and daily help.', 'मरम्मत, प्लंबिंग, बिजली और दैनिक सहायता।'),
      subs: [
        sub('electricians', 'Electrician', 'इलेक्ट्रीशियन', 'Electricians', 'इलेक्ट्रीशियन', 'services'),
        sub('plumbers', 'Plumber', 'प्लंबर', 'Plumbers', 'प्लंबर', 'services'),
        sub('carpenters', 'Carpenter', 'बढ़ई', 'Carpenters', 'बढ़ई', 'services'),
        sub('painters', 'Painter', 'पेंटर', 'Painters', 'पेंटर', 'services'),
        sub('ac-repair', 'AC Repair', 'एसी रिपेयर', 'AC Repair', 'एसी रिपेयर', 'services'),
        sub('appliance-repair', 'Appliance Repair', 'उपकरण रिपेयर', 'Appliance Repair', 'उपकरण रिपेयर', 'services'),
        sub('mechanics', 'Mechanic', 'मैकेनिक', 'Mechanics', 'मैकेनिक', 'automobile'),
        sub('cleaning-services', 'Cleaning Service', 'सफ़ाई सेवा', 'Cleaning Services', 'सफ़ाई सेवाएँ', 'services'),
        sub('security-services', 'Security Service', 'सुरक्षा सेवा', 'Security Services', 'सुरक्षा सेवाएँ', 'services'),
        sub('packers-movers', 'Packers & Movers', 'पैकर्स एंड मूवर्स', 'Packers & Movers', 'पैकर्स एंड मूवर्स', 'services')
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      slug: 'healthcare',
      icon: 'health',
      name: T('Healthcare', 'स्वास्थ्य सेवा'),
      blurb: T('Hospitals, clinics, diagnostics and care.', 'अस्पताल, क्लिनिक, निदान और देखभाल।'),
      subs: [
        sub('hospitals', 'Hospital', 'अस्पताल', 'Hospitals', 'अस्पताल', 'health'),
        sub('clinics', 'Clinic', 'क्लिनिक', 'Clinics', 'क्लिनिक', 'health'),
        sub('doctors', 'Doctor', 'डॉक्टर', 'Doctors', 'डॉक्टर', 'health'),
        sub('diagnostic-centres', 'Diagnostic Centre', 'डायग्नोस्टिक सेंटर', 'Diagnostic Centres', 'डायग्नोस्टिक सेंटर', 'health'),
        sub('dental-clinics', 'Dental Clinic', 'दंत क्लिनिक', 'Dental Clinics', 'दंत क्लिनिक', 'health'),
        sub('physiotherapy', 'Physiotherapy', 'फ़िज़ियोथेरेपी', 'Physiotherapy', 'फ़िज़ियोथेरेपी', 'health'),
        sub('pharmacies', 'Pharmacy', 'फ़ार्मेसी', 'Pharmacies', 'फ़ार्मेसियाँ', 'health')
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      slug: 'education',
      icon: 'education',
      name: T('Education', 'शिक्षा'),
      blurb: T('Schools, colleges and training centres.', 'विद्यालय, महाविद्यालय और प्रशिक्षण केंद्र।'),
      subs: [
        sub('schools', 'School', 'विद्यालय', 'Schools', 'विद्यालय', 'education'),
        sub('colleges', 'College', 'महाविद्यालय', 'Colleges', 'महाविद्यालय', 'education'),
        sub('coaching-centres', 'Coaching Centre', 'कोचिंग सेंटर', 'Coaching Centres', 'कोचिंग सेंटर', 'education'),
        sub('computer-institutes', 'Computer Institute', 'कंप्यूटर संस्थान', 'Computer Institutes', 'कंप्यूटर संस्थान', 'education'),
        sub('skill-centres', 'Skill Centre', 'कौशल केंद्र', 'Skill Centres', 'कौशल केंद्र', 'education'),
        sub('libraries', 'Library', 'पुस्तकालय', 'Libraries', 'पुस्तकालय', 'education')
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      slug: 'hospitality',
      icon: 'stay',
      name: T('Hospitality', 'आतिथ्य'),
      blurb: T('Hotels, eateries and event venues.', 'होटल, भोजनालय और समारोह स्थल।'),
      subs: [
        sub('hotels', 'Hotel', 'होटल', 'Hotels', 'होटल', 'stay'),
        sub('restaurants', 'Restaurant', 'रेस्तराँ', 'Restaurants', 'रेस्तराँ', 'food'),
        sub('cafes', 'Cafe', 'कैफ़े', 'Cafes', 'कैफ़े', 'food'),
        sub('banquet-halls', 'Banquet Hall', 'बैंकट हॉल', 'Banquet Halls', 'बैंकट हॉल', 'stay'),
        sub('marriage-halls', 'Marriage Hall', 'शादी का हॉल', 'Marriage Halls', 'शादी के हॉल', 'stay'),
        sub('caterers', 'Caterer', 'केटरर', 'Caterers', 'केटरर', 'food')
      ]
    },

    /* ---------------------------------------------------------------- */
    /* Civic & Public — where the district's own offices live. These are   */
    /* real, published government contacts, not shops.                    */
    {
      slug: 'civic',
      icon: 'building',
      name: T('Civic & Public', 'सार्वजनिक एवं नागरिक'),
      blurb: T('Government offices, schools and essential services of the district.', 'जिले के सरकारी कार्यालय, विद्यालय और आवश्यक सेवाएँ।'),
      subs: [
        sub('public-health', 'Primary Health Centre', 'प्राथमिक स्वास्थ्य केंद्र', 'Primary Health Centres', 'प्राथमिक स्वास्थ्य केंद्र', 'health'),
        sub('police', 'Police Station', 'पुलिस थाना', 'Police Stations', 'पुलिस थाने', 'services'),
        sub('civic-offices', 'District Office', 'जिला कार्यालय', 'District Offices', 'जिला कार्यालय', 'building'),
        sub('banks', 'Bank', 'बैंक', 'Banks', 'बैंक', 'finance'),
        sub('block-offices', 'Block Office', 'प्रखंड कार्यालय', 'Block Offices', 'प्रखंड कार्यालय', 'building'),
        sub('municipal', 'Municipal Body', 'नगरपालिका', 'Municipal Bodies', 'नगरपालिकाएँ', 'building'),
        sub('utilities', 'Utility Office', 'उपयोगिता कार्यालय', 'Utility Offices', 'उपयोगिता कार्यालय', 'services'),
        sub('community-orgs', 'Community Organisation', 'सामुदायिक संगठन', 'Community Organisations', 'सामुदायिक संगठन', 'other')
      ]
    }
  ]

  /* ------------------------------------------------------------------ */
  /* Flatten to a single list so every existing lookup keeps working.     */
  /* Group entries carry `subs`; sub entries carry their parent group.   */
  /* ------------------------------------------------------------------ */
  B.categories = []
  B.groups.forEach(function (g) {
    var flat = {
      slug: g.slug,
      icon: g.icon,
      name: g.name,
      blurb: g.blurb,
      group: true,
      parent: null
    }
    B.categories.push(flat)
    g.subs.forEach(function (s) {
      B.categories.push({
        slug: s.slug,
        icon: s.icon || g.icon,
        name: s.name,
        noun: s.noun,
        blurb: g.blurb,
        group: false,
        parent: g.slug
      })
    })
  })

  /* Group lookup, and the sub-categories belonging to a group. */
  B.groupBySlug = function (slug) {
    for (var i = 0; i < B.groups.length; i++) {
      if (B.groups[i].slug === slug) return B.groups[i]
    }
    return null
  }

  B.subsOf = function (groupSlug) {
    var g = B.groupBySlug(groupSlug)
    return g ? g.subs : []
  }

  /* Which group does this slug belong to? Accepts a group slug or a
     sub-category slug and always answers with the group. */
  B.parentGroupOf = function (slug) {
    var c = B.catBySlug(slug)
    if (!c) return null
    return c.group ? c.slug : c.parent
  }

  /* Every slug inside a group, the group itself first. */
  B.slugsInGroup = function (groupSlug) {
    var out = [groupSlug]
    B.subsOf(groupSlug).forEach(function (s) { out.push(s.slug) })
    return out
  }
})()