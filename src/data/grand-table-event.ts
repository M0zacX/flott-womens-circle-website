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

export type Sector = {
  num: string;
  name: string;
  description: string;
};

export type Highlight = {
  num: string;
  title: string;
  description: string;
  icon: string;
};

export type Faq = {
  q: string;
  a: string;
};

export type Speaker = {
  name: string;
  image: EventImage;
};

export type Price = { usd: number; ngn: number; aed: number; inr: number };

export type SponsorTier = {
  name: string;
  price: Price;
  passes: number;
  featured?: boolean;
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
  },

  city: "Abuja",
  country: "Nigeria",
  cityCountry: "Abuja, Nigeria",
  heroLocationLine: "Abuja, Nigeria",

  venue: {
    // Venue name is intentionally NOT published (client request, security). City only.
    name: "Abuja, Nigeria",
    officialName: "",
    address: "",
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
    { name: "Title Sponsor", price: tierPrice(17_000), passes: 8, featured: true },
  ] satisfies SponsorTier[],

  sectors: [
    {
      num: "01",
      name: "Agriculture, Agribusiness & Food Processing",
      description: "Farming, processing and agribusiness ventures across the value chain.",
    },
    {
      num: "02",
      name: "Manufacturing & Industrial Development",
      description: "Production, industrial capacity and manufacturing partnerships.",
    },
    {
      num: "03",
      name: "Energy, Oil & Gas",
      description: "Power generation, oil and gas, and energy infrastructure.",
    },
    {
      num: "04",
      name: "Healthcare, Medical Tourism & Global Mobility",
      description: "Healthcare delivery, medical infrastructure and wellness travel.",
    },
    {
      num: "05",
      name: "Artificial Intelligence, Technology & Digital Transformation",
      description: "AI, digital platforms and emerging technology ventures.",
    },
    {
      num: "06",
      name: "Infrastructure, Real Estate & Development",
      description: "Property development, construction and infrastructure projects.",
    },
    {
      num: "07",
      name: "Investment, International Trade & Enterprise Growth",
      description: "Investment, cross-border trade and enterprise growth across markets.",
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
    },
    {
      num: "02",
      title: "Investment pipeline",
      description: "Discover opportunities ready for capital and partnership.",
    },
    {
      num: "03",
      title: "Market entry",
      description: "Gain insight into Nigeria and partner markets.",
    },
    {
      num: "04",
      title: "Strategic networking",
      description: "Connect with business leaders, institutions and partners.",
    },
    {
      num: "05",
      title: "International platform",
      description: "Be part of a gathering linking Nigeria, the UAE, India and beyond.",
    },
  ] satisfies NumberedItem[],

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
  ] satisfies Speaker[],

  organisers: {
    label: "An initiative of Flott Women's Circle in collaboration with the Indo-African Chamber of Commerce & Industry and Smart Solutions UAE",
    logos: [
      { src: "/images/grand-table/organisers/organiser-2.webp", alt: "Smart Solutions UAE", width: 420, height: 120 },
      { src: "/images/grand-table/organisers/organiser-3.webp", alt: "Indo-African Chamber of Commerce & Industry", width: 420, height: 150 },
    ] satisfies OrganiserLogo[],
  },

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
    sectors: {
      eyebrow: "Sectors",
      headingPrefix: "Seven sectors,",
      headingEmphasis: "one Table",
      body: "Enterprises and investors are matched across seven priority sectors shaping growth in Nigeria and its partner markets.",
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
      eyebrow: "Partner with us",
      headingPrefix: "Become a",
      headingEmphasis: "Sponsor",
      body: "Align your brand with an international business platform connecting enterprises, investors and global partners in Abuja.",
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
      headingPrefix: "Abuja,",
      headingEmphasis: "Nigeria",
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
      body: "Email and phone details will be announced soon.",
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
    a: `${event.date.display} in Abuja, Nigeria. Full venue details are shared directly with confirmed participants.`,
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
    a: `Yes. Regular event entry is US$114 (₦150,000 · AED 420 · ₹11,000) and early bird entry is ₦75,000 / US$56, food and drinks included. Delegate packages start at US$3,500 for two passes. Indicative conversions; final invoice currency confirmed on registration. Payment details are shared after your registration is reviewed.`,
  },
  {
    q: "What sponsorship packages are available?",
    a: "Delegate Package US$3,500 (2 passes), Corporate Partner US$5,500 (3), Silver US$7,500 (4), Gold US$9,500 (5), Platinum US$11,500 (6) and Title US$17,000 (8). Prices are also shown in NGN, AED and INR as indicative conversions; final invoice currency confirmed on registration. Request the brochure for full benefits.",
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
