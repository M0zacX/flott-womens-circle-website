// This config drives the content for the Grand Table event landing page,
// kept data-driven so future editions can reuse the same page markup.

export type EventImage = {
  src: string;
  srcSmall?: string;
  alt: string;
  width: number;
  height: number;
};

export type Credit = {
  text: string;
  url?: string;
};

export type NumberedItem = {
  num: string;
  title: string;
  description: string;
};

export type ReasonItem = NumberedItem & { icon: string };

export type Sector = {
  num: string;
  name: string;
  description: string;
  icon: string;
};

export type Highlight = {
  num: string;
  title: string;
  description: string;
  icon: string;
};

export type Convener = {
  name: string;
  role: string;
  founderRole: string;
  image: EventImage;
};

export type Faq = {
  q: string;
  a: string;
};

export type Speaker = {
  name: string;
  title?: string;
  image: EventImage;
};

/** Consistent fallback so every speaker/dignitary card shows a second line, even before a formal title is confirmed. */
export const SPEAKER_FALLBACK_TITLE = "Speaker, The Grand Table 2026";

export type CompanyLogo = { name: string; src: string; width: number; height: number; displayHeight: number };

const person = (dir: string, slug: string, name: string, title: string): Speaker => ({
  name,
  title,
  image: { src: `/images/grand-table/${dir}/${slug}.webp`, alt: `${name}, ${title}`, width: 600, height: 800 },
});

export type Price = { usd: number; ngn: number; aed: number; inr: number };

export type SponsorTier = {
  name: string;
  price: Price;
  passes: number;
  featured?: boolean;
  badge?: string;
};

/** Indicative mid-market rates, 1 USD = … (open.er-api.com, updated 21 Oct 2026 04:02 Dubai). */
export const fxRates = { ngn: 1332.68, aed: 3.6725, inr: 95.0, asOf: "21 October 2026" };

const roundTo = (v: number, step: number) => Math.round(v / step) * step;
/** Tier rounding: NGN ₦50,000, AED 50, INR ₹1,000. */
const tierPrice = (usd: number): Price => ({
  usd,
  ngn: roundTo(usd * fxRates.ngn, 50_000),
  aed: roundTo(usd * fxRates.aed, 50),
  inr: roundTo(usd * fxRates.inr, 1_000),
});

export const fmt = {
  usd: (n: number) => `US$${n.toLocaleString("en-US")}`,
  ngn: (n: number) => `₦${n.toLocaleString("en-US")}`,
  aed: (n: number) => `AED ${n.toLocaleString("en-US")}`,
  inr: (n: number) => `₹${n.toLocaleString("en-US")}`,
};
export const secondaryLine = (p: Price) => `${fmt.ngn(p.ngn)} · ${fmt.aed(p.aed)} · ${fmt.inr(p.inr)}`;
export const conversionNote = "Indicative conversions; final invoice currency confirmed on registration.";
export const exchangeRateNote = `Based on indicative mid-market rates as of ${fxRates.asOf}: 1 USD ≈ ₦${fxRates.ngn.toLocaleString("en-US")} · AED ${fxRates.aed} · ₹${fxRates.inr}. NGN, AED and INR figures are rounded for display; the US dollar amount is the reference price.`;

export type OrganiserLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const event = {
  name: "The Grand Table",
  edition: "Edition I",
  year: "2026",
  tagline: "Connecting Enterprises, Investors & Global Opportunities",

  date: {
    iso: "2026-12-05",
    display: "Saturday 5 December 2026",
    short: "05.12.26",
    countdownTarget: "2026-12-05T09:00:00+01:00",
    timeDisplay: "Time to be announced",
  },

  city: "Abuja",
  country: "Nigeria",
  cityCountry: "Abuja, Nigeria",
  heroLocationLine: "Tropic Galleria, Central Business District, Abuja, Nigeria",

  venue: {
    name: "Tropic Galleria",
    officialName: "Tropic Galleria",
    address: "Central Business District, Abuja, Nigeria",
    mapsUrl: "",
    heroImage: {
      src: "/images/grand-table/venue/venue-hall-1512.webp",
      srcSmall: "/images/grand-table/venue/venue-hall-960.webp",
      alt: "Grand event hall in Abuja",
      width: 1512,
      height: 1008,
    } satisfies EventImage,
    gallery: [
      {
        src: "/images/grand-table/venue/venue-hall-detail-1400.webp",
        alt: "Banquet tables set in the event hall",
        width: 1400,
        height: 933,
      },
      {
        src: "/images/grand-table/venue/venue-entrance-1400.webp",
        srcSmall: "/images/grand-table/venue/venue-entrance-800.webp",
        alt: "Palm-lined venue grounds in Abuja",
        width: 1400,
        height: 933,
      },
      {
        src: "/images/grand-table/venue/venue-hall-1512.webp",
        srcSmall: "/images/grand-table/venue/venue-hall-960.webp",
        alt: "Grand event hall in Abuja",
        width: 1400,
        height: 933,
      },
    ] satisfies EventImage[],
    credits: [
      {
        text: "Jummy001 via Wikimedia Commons (CC BY-SA 4.0)",
        url: "https://commons.wikimedia.org/wiki/User:Jummy001",
      },
      { text: "Forefront NG" },
    ] satisfies Credit[],
  },

  fees: {
    // Individual event entry. Early bird NGN is the deck's own figure.
    regular: { usd: 114, ngn: 150_000, aed: 420, inr: 11_000 } satisfies Price,
    earlyBird: { usd: 56, ngn: 75_000, aed: 205, inr: 5_300 } satisfies Price,
  },

  sponsorTiers: [
    { name: "Delegate Package", price: tierPrice(3_500), passes: 2 },
    { name: "Corporate Partner", price: tierPrice(5_500), passes: 3 },
    { name: "Silver Sponsor", price: tierPrice(7_500), passes: 4 },
    { name: "Gold Sponsor", price: tierPrice(9_500), passes: 5 },
    { name: "Platinum Sponsor", price: tierPrice(11_500), passes: 6 },
    { name: "Title Sponsor", price: tierPrice(17_000), passes: 8, featured: true, badge: "Limited to one organisation" },
  ] satisfies SponsorTier[],

  sectors: [
    {
      num: "01",
      name: "Agriculture, Agribusiness & Food Processing",
      description: "Farming, processing and agribusiness ventures across the value chain.",
      icon: '<path d="M6 23c0-9.5 6-17 17-17-1 10.5-7.5 17-17 17Z"/><path d="M6 23c3.5-5.5 8-10 13-13"/>',
    },
    {
      num: "02",
      name: "Manufacturing & Industrial Development",
      description: "Production, industrial capacity and manufacturing partnerships.",
      icon: '<circle cx="14" cy="14" r="4.25"/><path d="M14 4v3.5M14 20.5V24M24 14h-3.5M7.5 14H4M20.9 7.1l-2.5 2.5M9.6 18.4l-2.5 2.5M20.9 20.9l-2.5-2.5M9.6 9.6l-2.5-2.5"/>',
    },
    {
      num: "03",
      name: "Energy, Oil & Gas",
      description: "Power generation, oil and gas, and energy infrastructure.",
      icon: '<path d="M15.5 3 7 15.5h6L11.5 25 21 12.5h-6L15.5 3Z"/>',
    },
    {
      num: "04",
      name: "Healthcare, Medical Tourism & Global Mobility",
      description: "Healthcare delivery, medical infrastructure and wellness travel.",
      icon: '<path d="M3 15h5l2.5-6.5L14 20l2.5-9 2 4H25"/>',
    },
    {
      num: "05",
      name: "Artificial Intelligence, Technology & Digital Transformation",
      description: "AI, digital platforms and emerging technology ventures.",
      icon: '<circle cx="14" cy="14" r="3"/><path d="M14 2v6M14 20v6M2 14h6M20 14h6M6 6l4.2 4.2M17.8 17.8 22 22M22 6l-4.2 4.2M10.2 17.8 6 22"/>',
    },
    {
      num: "06",
      name: "Infrastructure, Real Estate & Development",
      description: "Property development, construction and infrastructure projects.",
      icon: '<path d="M6 25V6l8-3 8 3v19"/><path d="M6 25h16M10 11h2M10 15h2M10 19h2M16 11h2M16 15h2M16 19h2"/>',
    },
    {
      num: "07",
      name: "Investment, International Trade & Enterprise Growth",
      description: "Investment, cross-border trade and enterprise growth across markets.",
      icon: '<path d="M4 21 11 14l4 4 9-9"/><path d="M18.5 9H24v5.5"/>',
    },
  ] satisfies Sector[],

  objectives: [
    {
      num: "01",
      title: "Enterprise Development",
      description: "Equipping enterprises with the structures, skills and networks needed to grow into new markets.",
    },
    {
      num: "02",
      title: "Investment Connections",
      description: "Linking investors directly with enterprises and projects ready for capital and partnership.",
    },
    {
      num: "03",
      title: "International Market Access",
      description: "Opening practical pathways for enterprises to enter and operate within international markets.",
    },
    {
      num: "04",
      title: "Strategic Partnerships",
      description: "Facilitating partnerships between businesses, investors and institutions across regions.",
    },
    {
      num: "05",
      title: "Business Expansion",
      description: "Supporting enterprises as they scale operations beyond their home markets.",
    },
  ] satisfies NumberedItem[],

  delegateReasons: [
    {
      num: "01",
      title: "Curated enterprise access",
      description: "Meet enterprises across seven priority sectors.",
      icon: '<path d="M4 14.5 9 9.5l4 4 2-2 4 4 5-5"/><path d="M4 14.5V21a2 2 0 0 0 2 2h3M24 14.5V21a2 2 0 0 1-2 2h-3"/>',
    },
    {
      num: "02",
      title: "Investment pipeline",
      description: "Discover opportunities ready for capital and partnership.",
      icon: '<path d="M4 23V15M10.5 23V9.5M17 23v-7M23.5 23V5"/>',
    },
    {
      num: "03",
      title: "Market entry",
      description: "Gain insight into Nigeria and partner markets.",
      icon: '<path d="M14 25s8-8.7 8-14.3a8 8 0 1 0-16 0C6 16.3 14 25 14 25Z"/><circle cx="14" cy="10.5" r="2.75"/>',
    },
    {
      num: "04",
      title: "Strategic networking",
      description: "Connect with business leaders, institutions and partners.",
      icon: '<circle cx="7" cy="8" r="3"/><circle cx="21" cy="8" r="3"/><circle cx="14" cy="21" r="3"/><line x1="9.5" y1="10" x2="12" y2="18.5"/><line x1="18.5" y1="10" x2="16" y2="18.5"/><line x1="10" y1="8" x2="18" y2="8"/>',
    },
    {
      num: "05",
      title: "International platform",
      description: "Be part of a gathering linking Nigeria, the UAE, India and beyond.",
      icon: '<circle cx="14" cy="14" r="10"/><ellipse cx="14" cy="14" rx="4.2" ry="10"/><path d="M4 11h20M4 17h20"/>',
    },
  ] satisfies ReasonItem[],

  enterpriseSteps: [
    {
      num: "01",
      title: "Submit your Expression of Interest",
      description: "Complete the online form and upload your company profile as a PDF.",
    },
    {
      num: "02",
      title: "Review",
      description: "Our team reviews every submission.",
    },
    {
      num: "03",
      title: "Confirmation",
      description: "Shortlisted enterprises are contacted with next steps.",
    },
    {
      num: "04",
      title: "Participate",
      description: "Prepare for showcase and investor meetings in Abuja.",
    },
  ] satisfies NumberedItem[],

  highlights: [
    {
      num: "01",
      title: "Enterprise Showcase",
      description: "Selected enterprises present their businesses to investors and partners.",
      icon: '<rect x="4" y="4" width="20" height="13" rx="1"/><line x1="14" y1="17" x2="14" y2="23"/><line x1="9" y1="23" x2="19" y2="23"/>',
    },
    {
      num: "02",
      title: "Investor Meetings",
      description: "Structured conversations between enterprises and investors.",
      icon: '<circle cx="11" cy="14" r="7"/><circle cx="17" cy="14" r="7"/>',
    },
    {
      num: "03",
      title: "International Delegations",
      description: "Delegates from Nigeria, the UAE, India and other markets.",
      icon: '<circle cx="14" cy="14" r="10"/><ellipse cx="14" cy="14" rx="4.2" ry="10"/><line x1="4" y1="14" x2="24" y2="14"/>',
    },
    {
      num: "04",
      title: "Sector Sessions",
      description: "Focused discussions across the seven priority sectors.",
      icon: '<rect x="4" y="4" width="8" height="8" rx="1"/><rect x="16" y="4" width="8" height="8" rx="1"/><rect x="4" y="16" width="8" height="8" rx="1"/><rect x="16" y="16" width="8" height="8" rx="1"/>',
    },
    {
      num: "05",
      title: "Partnership Building",
      description: "Introductions that open strategic partnerships and market access.",
      icon: '<path d="M11.5 17.5a5 5 0 0 1 0-7.07l2-2a5 5 0 0 1 7.07 7.07l-1 1"/><path d="M16.5 10.5a5 5 0 0 1 0 7.07l-2 2a5 5 0 0 1-7.07-7.07l1-1"/>',
    },
    {
      num: "06",
      title: "Networking",
      description: "Time to connect with business leaders, institutions and sponsors.",
      icon: '<circle cx="7" cy="8" r="3"/><circle cx="21" cy="8" r="3"/><circle cx="14" cy="21" r="3"/><line x1="9.5" y1="10" x2="12" y2="18.5"/><line x1="18.5" y1="10" x2="16" y2="18.5"/><line x1="10" y1="8" x2="18" y2="8"/>',
    },
  ] satisfies Highlight[],

  speakers: [
    {
      name: "Bouchra Izaabel",
      image: {
        src: "/images/grand-table/speakers/bouchra-izaabel.webp",
        alt: "Bouchra Izaabel",
        width: 600,
        height: 800,
      },
    },
    {
      name: "Dr. Sahar Gul Bukhari",
      image: {
        src: "/images/grand-table/speakers/sahar-gul-bukhari.webp",
        alt: "Dr. Sahar Gul Bukhari",
        width: 600,
        height: 800,
      },
    },
    person("speakers", "jem-felicilda", "Jem Felicilda", "MD, Knightsbridge Group UAE"),
    person("speakers", "magdy-al-sheikh", "Magdy Al Sheikh", "CEO/Founder, Armada Internationals Dubai"),
    person("speakers", "maroua-kotti", "Maroua Kotti", "CEO, Harmonie Medicale Tunisia"),
    person("speakers", "batoul-kherbiek", "Dr Batoul Salman Kherbiek", "Global Bridge Builder, Imperial UK"),
    person("speakers", "elena-krystal", "Elena Krystal", "Co-Founder, Global Academy of Happiness"),
    person("speakers", "daibah-garba", "Barrister Mrs Daibah Garba", "Legal Consultant, Federal Ministry of Justice"),
    person("speakers", "aisha-bilal", "Aisha Bilal", "Founder/CEO, Structured Spaces"),
  ] satisfies Speaker[],

  dignitaries: [
    person("dignitaries", "salem-al-shamsi", "H.E. Salem Saeed Al Shamsi", "Ambassador of the UAE to the Federal Republic of Nigeria"),
    person("dignitaries", "sunanda-rajendran", "Dr. Mrs. Sunanda Rajendran", "Secretary-General, IACCI"),
    person("dignitaries", "zayyan-ibrahim", "H.E. Ambassador Zayyan Ibrahim", "Consul General of Nigeria in Dubai & the Northern Emirates"),
    person("dignitaries", "mohammed-al-neyadi", "H.E. Mohammed Saeed Bakhit Al Neyadi", "Former Director-General, UAE General Authority of Islamic Affairs & Endowments"),
    person("dignitaries", "adeshola-onadipe", "Amb. Adeshola Helen Onadipe", "President, African-Arab Women Chamber of Commerce; Founder, Ladies in Business Magazine Global"),
  ] satisfies Speaker[],

  companies: [
    { name: "Horrie Autos Limited", src: "/images/grand-table/companies/horrie-autos.webp", width: 282, height: 141, displayHeight: 57 },
    { name: "Structured Spaces", src: "/images/grand-table/companies/structured-spaces.webp", width: 275, height: 145, displayHeight: 58 },
    { name: "FertiClinic Ras Al Khaimah", src: "/images/grand-table/companies/ferticlinic-rak.webp", width: 403, height: 98, displayHeight: 39 },
    { name: "DTOPAZ Jewellery", src: "/images/grand-table/companies/dtopaz-jewellery.webp", width: 106, height: 199, displayHeight: 80 },
    { name: "Meenasu Foodstuff Trading LLC", src: "/images/grand-table/companies/meenasu-foodstuff.webp", width: 214, height: 186, displayHeight: 75 },
    { name: "TourMate", src: "/images/grand-table/companies/tourmate.webp", width: 342, height: 115, displayHeight: 46 },
    { name: "doTERRA", src: "/images/grand-table/companies/doterra.webp", width: 252, height: 158, displayHeight: 63 },
    { name: "Knightsbridge Group", src: "/images/grand-table/companies/knightsbridge-group.webp", width: 280, height: 142, displayHeight: 57 },
    { name: "Sidra Healthcare", src: "/images/grand-table/companies/sidra-healthcare.webp", width: 284, height: 140, displayHeight: 56 },
  ] satisfies CompanyLogo[],

  mediaPartner: { name: "Ladies in Business Magazine Global (LBMG)", src: "/images/grand-table/companies/lbmg.webp", width: 370, height: 127, displayHeight: 64 } satisfies CompanyLogo,

  contactDetails: {
    email: "info@flottwomenscircle.com",
    phones: [
      { display: "+234 703 488 9488", tel: "+2347034889488", whatsapp: "2347034889488" },
      { display: "+234 907 737 2995", tel: "+2349077372995", whatsapp: "2349077372995" },
      { display: "+971 55 644 1087", tel: "+971556441087" },
    ],
  },

  organisers: {
    label: "An initiative of Flott Women's Circle in collaboration with the Indo-African Chamber of Commerce & Industry and Smart Solutions UAE",
    logos: [
      { src: "/images/grand-table/organisers/organiser-2.webp", alt: "Smart Solutions UAE", width: 420, height: 120 },
      { src: "/images/grand-table/organisers/organiser-3.webp", alt: "Indo-African Chamber of Commerce & Industry", width: 420, height: 150 },
    ] satisfies OrganiserLogo[],
  },

  convener: {
    name: "Safiya Umar",
    role: "Convener, The Grand Table",
    founderRole: "Founder & Group CEO, Flott Women's Circle",
    image: { src: "/images/founder-safiya.jpg", alt: "Safiya Umar, Convener", width: 798, height: 1200 },
  } satisfies Convener,

  copy: {
    hero: {
      eyebrow: "An initiative of Flott Women’s Circle",
      travelLine: "Nigeria • UAE • India • Beyond",
    },
    about: {
      eyebrow: "About the event",
      headingPrefix: "Where Business Meets",
      headingEmphasis: "Opportunity",
      body: "The Grand Table 2026 is an international business platform initiated by Flott Women’s Circle that brings enterprises, investors and global partners together in Abuja to unlock investment, open international markets and build lasting partnerships across Nigeria, the UAE, India and beyond.",
      initiatedBy: "An initiative of Flott Women’s Circle in collaboration with the Indo-African Chamber of Commerce & Industry and Smart Solutions UAE",
    },
    convener: {
      eyebrow: "From the convener",
      headingPrefix: "A table set by",
      headingEmphasis: "Safiya Umar",
      body: [
        "Safiya Umar founded Flott Women's Circle to turn community into capacity — practical skills, safe spaces and the right support systems for women to grow. The Grand Table is that mission's next chapter.",
        "As convener, she is bringing enterprises, investors and global partners to one table in Abuja — opening real pathways to capital, markets and partnership across Nigeria, the UAE, India and beyond.",
      ],
    },
    whyAttend: {
      eyebrow: "Why attend",
      headingPrefix: "Five reasons to",
      headingEmphasis: "take your seat",
      body: "Delegates, investors and partners join The Grand Table 2026 for direct access to vetted enterprises, investment-ready opportunities and a genuinely international room.",
    },
    sectors: {
      eyebrow: "Sectors",
      headingPrefix: "Seven sectors,",
      headingEmphasis: "one Table",
      body: "Enterprises and investors are matched across seven priority sectors shaping growth in Nigeria and its partner markets.",
    },
    register: {
      eyebrow: "Tickets & registration",
      headingPrefix: "Choose how you",
      headingEmphasis: "join the Table",
      body: "Three ways to take part on 5 December 2026 — as an enterprise, a delegate or investor, or a sponsor. Pick your track below.",
      tracksLabel: "Choose your track",
      tracks: {
        enterprise: "Enterprise",
        delegate: "Delegate & Investor",
        sponsor: "Sponsor",
      },
    },
    enterprise: {
      eyebrow: "For enterprises",
      headingPrefix: "Apply as an",
      headingEmphasis: "Enterprise",
      body: "Enterprises across the seven priority sectors can submit an Expression of Interest to be considered for showcase, investor meetings and international partnership opportunities at The Grand Table 2026.",
      notice: "submitting an Expression of Interest does not guarantee selection, investment or funding. All submissions are reviewed and successful enterprises will be contacted directly.",
      formOpens: "Form opens with launch on 29 October 2026",
    },
    delegates: {
      eyebrow: "Delegates & investors",
      headingPrefix: "Join the room where",
      headingEmphasis: "deals begin",
      body: "International delegates and investors join The Grand Table 2026 in Abuja to meet vetted enterprises, explore new markets and build partnerships across Nigeria, the UAE, India and beyond.",
      reasonsLabel: "Five reasons to participate",
      feeLabel: "Regular event entry",
      feeNote: "Payment details are shared after your registration is reviewed.",
      formTabsLabel: "Choose how you'd like to register",
      tabs: {
        delegate: "Delegate",
        investor: "Investor/Partner",
      },
    },
    sponsorship: {
      eyebrow: "Tickets & registration",
      headingPrefix: "Choose how you",
      headingEmphasis: "join the Table",
      body: "From a single delegate seat to becoming our exclusive Title Sponsor — every tier includes delegate passes to The Grand Table 2026 in Abuja.",
      attendeeLabel: "Attendee entry",
      sponsorLabel: "Sponsorship tiers",
      importantInfo: [
        "Submitting a sponsorship enquiry or delegate registration does not guarantee a place; all submissions are reviewed and confirmed directly.",
        "Payment details and an invoice are shared only after your registration or enquiry is reviewed — no payment is taken on this page.",
        "Showcases, exhibition stands and investor introductions are subject to availability at the time of confirmation.",
        "The Title Sponsor tier is limited to one organisation for this edition.",
      ],
    },
    dignitaries: {
      eyebrow: "Distinguished guests",
      headingPrefix: "Honoured",
      headingEmphasis: "Dignitaries",
    },
    companies: {
      eyebrow: "At the Table",
      heading: "Participating companies",
      mediaLabel: "Media partner",
    },
    speakers: {
      eyebrow: "Voices at the Table",
      heading: "Speakers",
      moreToCome: "More speakers to be announced.",
    },
    experience: {
      eyebrow: "Event experience",
      headingPrefix: "Six moments that define",
      headingEmphasis: "the Table",
    },
    venue: {
      eyebrow: "Venue",
      headingPrefix: "Tropic Galleria,",
      headingEmphasis: "Abuja",
    },
    faq: {
      eyebrow: "FAQ",
      headingPrefix: "Questions,",
      headingEmphasis: "answered",
    },
    contact: {
      eyebrow: "Contact",
      headingPrefix: "Get in",
      headingEmphasis: "touch",
      body: "For sponsorships, delegate participation and strategic partnership discussions, reach our event coordination team.",
      emailLabel: "Event coordination",
      phoneLabel: "Call & WhatsApp",
    },
  },
};

const sectorsSentence = `${event.sectors
  .slice(0, -1)
  .map((sector) => sector.name)
  .join(", ")}, and ${event.sectors[event.sectors.length - 1].name}.`;

export const faqs: Faq[] = [
  {
    q: "When and where is The Grand Table 2026?",
    a: `${event.date.display} (${event.date.timeDisplay}) at ${event.venue.officialName}, ${event.venue.address}.`,
  },
  {
    q: "Who can take part?",
    a: "Enterprises, international delegates, investors, partners and sponsors.",
  },
  {
    q: "Which sectors are included?",
    a: sectorsSentence,
  },
  {
    q: "Does applying guarantee selection?",
    a: "No. Submitting an Expression of Interest does not guarantee selection, investment or funding. All submissions are reviewed.",
  },
  {
    q: "What do I need to apply as an enterprise?",
    a: "Complete the online Expression of Interest form and upload your company profile as a PDF.",
  },
  {
    q: "Is there a delegate participation fee?",
    a: `Yes. Regular event entry is ${fmt.usd(event.fees.regular.usd)} (${fmt.ngn(event.fees.regular.ngn)} · ${fmt.aed(event.fees.regular.aed)} · ${fmt.inr(event.fees.regular.inr)}) and early bird entry is ${fmt.ngn(event.fees.earlyBird.ngn)} / ${fmt.usd(event.fees.earlyBird.usd)}, food and drinks included. Sponsorship tiers start at ${fmt.usd(event.sponsorTiers[0].price.usd)} for ${event.sponsorTiers[0].passes} passes. Indicative conversions; final invoice currency confirmed on registration. Payment details are shared after your registration is reviewed.`,
  },
  {
    q: "What sponsorship packages are available?",
    a: `${event.sponsorTiers.map((t) => `${t.name} ${fmt.usd(t.price.usd)} (${t.passes} passes)`).join(", ")}. Prices are also shown in NGN, AED and INR as indicative conversions; final invoice currency confirmed on registration. The Title Sponsor tier is limited to one organisation. Request the brochure for full benefits.`,
  },
  {
    q: "When do registrations open?",
    a: "Online submissions open on 29 October 2026.",
  },
  {
    q: "Who is organising the event?",
    a: "The Grand Table 2026 is an initiative of Flott Women's Circle, in collaboration with the Indo-African Chamber of Commerce & Industry and Smart Solutions.",
  },
];
