// JSON-LD for /grand-table/.
// sameAs stays empty until Marcus confirms live, owned profile URLs.
// Add those URLs to organizationSameAs or personSameAs below — they are omitted from the page until then.
// Do not guess LinkedIn, Instagram, Google Business Profile, or any other profile.
// Do not point this page at thegrandtable.com. The canonical URL is https://flottwomenscircle.com/grand-table/.
// Do not copy event.date.countdownTarget into startDate. That value is only a countdown anchor; the page says the time is to be announced.

import { event, type Speaker } from "./grand-table-event";

export const GT_SITE = "https://flottwomenscircle.com";
/** Path passed to Layout, which resolves it against GT_SITE. */
export const GT_CANONICAL_PATH = "/grand-table/";
export const GT_PAGE_URL = new URL(GT_CANONICAL_PATH, GT_SITE).href;

export const ORGANIZATION_ID = `${GT_SITE}/#organization`;
export const SAFIYA_ID = `${GT_PAGE_URL}#safiya-umar`;
export const EVENT_ID = `${GT_PAGE_URL}#event`;

/**
 * Live, owned profile URLs for Flott Women's Circle.
 * Example, once confirmed: a LinkedIn company page or Google Business Profile.
 * Leave this empty until each URL is live.
 */
export const organizationSameAs: string[] = [];

/**
 * Live, owned profile URLs for Safiya Umar.
 * Example, once confirmed: her LinkedIn profile.
 * Leave this empty until each URL is live.
 */
export const personSameAs: string[] = [];

const ORG_NAME = "Flott Women's Circle";
/** Site-wide meta description, without the leading name. */
const ORG_DESCRIPTION =
  "A women-focused wellness, personal development, and empowerment community rooted in Nigeria and growing across the MENA region.";
/** Published role on the team and founder sections. */
const FOUNDER_ROLE = "Founder & Group CEO";
/** Convener card line that names an affiliation rather than a job title. */
const IACCI_LINE = "Indo-African Chamber of Commerce & Industry (IACCI)";

type JsonLd = Record<string, unknown>;

function absolute(path: string): string {
  return new URL(path, GT_SITE).href;
}

function claimedSameAs(urls: readonly string[]): string[] | undefined {
  const sameAs: string[] = [];
  for (const raw of urls) {
    const url = raw.trim();
    if (!url) continue;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`sameAs entry is not an absolute URL: ${url}`);
    }
    if (parsed.protocol !== "https:") {
      throw new Error(`sameAs entry must use https: ${url}`);
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "thegrandtable.com" || host.endsWith(".thegrandtable.com")) {
      throw new Error("Do not use thegrandtable.com. The canonical event URL is https://flottwomenscircle.com/grand-table/.");
    }
    if (!sameAs.includes(parsed.href)) sameAs.push(parsed.href);
  }
  return sameAs.length > 0 ? sameAs : undefined;
}

function withSameAs(node: JsonLd, urls: readonly string[]): JsonLd {
  const sameAs = claimedSameAs(urls);
  return sameAs ? { ...node, sameAs } : node;
}

export const grandTableDescription = `${event.name} ${event.year}: an initiative of ${ORG_NAME} in collaboration with the Indo-African Chamber of Commerce & Industry and Smart Solutions UAE, connecting enterprises, investors and global opportunities. ${event.venue.officialName}, ${event.venue.address}, ${event.date.display} (${event.date.timeDisplay}).`;

function safiyaJobTitles(): string[] {
  const roles = event.convener.titles.filter((title) => title !== IACCI_LINE);
  const host = roles.filter((title) => title.startsWith("Convener"));
  const others = roles.filter((title) => !title.startsWith("Convener"));
  return [...host, FOUNDER_ROLE, ...others];
}

function safiyaDescription(): string {
  const body = event.copy.convener.body.join(" ");
  return `${event.convener.name} is the founder and group CEO of ${ORG_NAME} and host of ${event.name} ${event.year}. ${body}`;
}

function featuredPerson(person: Speaker): JsonLd {
  return {
    "@type": "Person",
    name: person.name,
    ...(person.title ? { jobTitle: person.title } : {}),
    ...(person.image ? { image: absolute(person.image.src) } : {}),
  };
}

/** No public prices (Safiya, 2026-11-09): a single priceless Offer, not one per package/currency. */
function offer(): JsonLd {
  return {
    "@type": "Offer",
    url: GT_PAGE_URL,
    availability: "https://schema.org/InStock",
    seller: { "@id": ORGANIZATION_ID },
  };
}

/** Matches the live vendor Event markup; event.venue.address does not decompose cleanly into these parts. */
function eventLocation(): JsonLd {
  return {
    "@type": "Place",
    name: event.venue.officialName,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Opposite Frazer Suites, Tropic Galleria",
      addressLocality: "Central Business District, Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
  };
}

function organizationNode(): JsonLd {
  return withSameAs(
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: ORG_NAME,
      url: `${GT_SITE}/`,
      description: ORG_DESCRIPTION,
      email: event.contactDetails.email,
      logo: {
        "@type": "ImageObject",
        url: absolute("/images/flott-women-circle-logo.png"),
        // Pixel size of public/images/flott-women-circle-logo.png.
        width: 4763,
        height: 1044,
      },
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "No. 6 Ubiaja Crescent, Garki 2",
          addressLocality: "Abuja",
          addressRegion: "FCT",
          addressCountry: "NG",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "No.1 Sheikh Mohammed Bin Zayed Boulevard, Downtown Dubai",
          addressLocality: "Dubai",
          addressCountry: "AE",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "event coordination",
        email: event.contactDetails.email,
        telephone: event.contactDetails.phones.map((phone) => phone.tel),
        url: GT_PAGE_URL,
        availableLanguage: "English",
      },
      founder: { "@id": SAFIYA_ID },
    },
    organizationSameAs,
  );
}

function personNode(): JsonLd {
  const affiliation = event.convener.titles.includes(IACCI_LINE)
    ? [{ "@type": "Organization", name: IACCI_LINE }]
    : undefined;
  return withSameAs(
    {
      "@type": "Person",
      "@id": SAFIYA_ID,
      name: event.convener.name,
      url: GT_PAGE_URL,
      description: safiyaDescription(),
      jobTitle: safiyaJobTitles(),
      image: {
        "@type": "ImageObject",
        url: absolute(event.convener.image.src),
        width: event.convener.image.width,
        height: event.convener.image.height,
        caption: event.convener.image.alt,
      },
      worksFor: { "@id": ORGANIZATION_ID },
      ...(affiliation ? { affiliation } : {}),
      performerIn: { "@id": EVENT_ID },
    },
    personSameAs,
  );
}

function eventNode(): JsonLd {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date.iso)) {
    throw new Error(
      "Grand Table startDate must be a calendar date (YYYY-MM-DD). The page says the time is to be announced, so do not invent one.",
    );
  }
  return {
    "@type": "Event",
    "@id": EVENT_ID,
    name: `${event.name} ${event.year}`,
    description: grandTableDescription,
    url: GT_PAGE_URL,
    startDate: event.date.iso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "en",
    image: [absolute("/images/gt-hero-poster.webp")],
    location: eventLocation(),
    organizer: {
      "@id": ORGANIZATION_ID,
      "@type": "Organization",
      name: ORG_NAME,
      url: GT_SITE,
      email: event.contactDetails.email,
      telephone: event.contactDetails.phones.map((phone) => phone.tel),
    },
    contributor: event.organisers.logos.map((logo) => ({
      "@type": "Organization",
      name: logo.alt,
    })),
    performer: [
      { "@id": SAFIYA_ID, "@type": "Person", name: event.convener.name },
      ...event.dignitaries.map(featuredPerson),
      ...event.speakers.map(featuredPerson),
    ],
    offers: offer(),
  };
}

function assertGraph(graph: JsonLd[]) {
  const byId = new Map(graph.filter((node) => typeof node["@id"] === "string").map((node) => [node["@id"] as string, node]));
  const org = byId.get(ORGANIZATION_ID);
  const person = byId.get(SAFIYA_ID);
  const hosted = byId.get(EVENT_ID);
  if (!org || org["@type"] !== "Organization" || org.name !== ORG_NAME) {
    throw new Error("Grand Table JSON-LD is missing the Flott Women's Circle Organization node.");
  }
  if (!person || person["@type"] !== "Person" || person.name !== event.convener.name) {
    throw new Error("Grand Table JSON-LD is missing the Safiya Umar Person node.");
  }
  if (!hosted || hosted["@type"] !== "Event") {
    throw new Error("Grand Table JSON-LD is missing The Grand Table Event node.");
  }
  const organizer = hosted.organizer as JsonLd | undefined;
  if (organizer?.["@id"] !== ORGANIZATION_ID) {
    throw new Error("Event organizer must reference the Flott Women's Circle organization.");
  }
  if (hosted.startDate !== event.date.iso || String(hosted.startDate).includes("T")) {
    throw new Error("Event startDate must stay the published calendar date, with no invented time.");
  }
  if (hosted.url !== GT_PAGE_URL || person.url !== GT_PAGE_URL) {
    throw new Error("Person and Event URLs must be the /grand-table/ canonical.");
  }
  const performers = hosted.performer as JsonLd[];
  const expectedPerformers = 1 + event.dignitaries.length + event.speakers.length;
  if (performers.length !== expectedPerformers || performers[0]?.["@id"] !== SAFIYA_ID) {
    throw new Error("Event performers must keep every dignitary and speaker, and link Safiya's Person node.");
  }
  if (organizationSameAs.every((url) => url.trim() === "") && "sameAs" in org) {
    throw new Error("Organization sameAs should be omitted until profile URLs are added.");
  }
  if (personSameAs.every((url) => url.trim() === "") && "sameAs" in person) {
    throw new Error("Person sameAs should be omitted until profile URLs are added.");
  }
  if (JSON.stringify(graph).toLowerCase().includes("thegrandtable.com")) {
    throw new Error("Grand Table JSON-LD must not reference thegrandtable.com.");
  }
  const serialized = JSON.stringify(graph).toLowerCase();
  if (serialized.includes("price") || /\b\d{3,}(\.\d+)?\s*(usd|ngn|aed|inr)\b/.test(serialized)) {
    throw new Error("Grand Table JSON-LD must not publish any price, priceCurrency, or ticket amount (Safiya, 2026-11-09).");
  }
}

export function buildGrandTableJsonLd(): JsonLd {
  const graph = [personNode(), organizationNode(), eventNode()];
  assertGraph(graph);
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function grandTableJsonLdHtml(): string {
  return JSON.stringify(buildGrandTableJsonLd(), null, 2).replace(/</g, "\\u003c");
}
