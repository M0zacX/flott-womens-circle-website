// FIELDS PENDING CLIENT CONFIRMATION
// This config drives the Grand Table 2026 registration forms. Submissions post to
// /api/grand-table/submit/[form], which validates, stores to D1 and emails notifications
// (see src/pages/api/grand-table/submit/[form].ts and docs/GRANDTABLE-BACKEND.md).
// Field lists, labels and options are placeholders until the client signs off on final requirements.

import { fmt, event } from "./grand-table-event";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "select" | "textarea" | "file" | "country" | "number" | "checkbox";
  required?: boolean;
  options?: string[];
  accept?: string;
  placeholder?: string;
  full?: boolean;
  helper?: string;
};

export type FormStep = {
  label: string;
  fields: string[];
};

export type FormConfig = {
  id: string;
  title: string;
  intro: string;
  submitLabel: string;
  fields: Field[];
  steps?: FormStep[];
};

export const SECTORS = [
  "Agriculture, Agribusiness & Food Processing",
  "Manufacturing & Industrial Development",
  "Energy, Oil & Gas",
  "Healthcare, Medical Tourism & Global Mobility",
  "Artificial Intelligence, Technology & Digital Transformation",
  "Infrastructure, Real Estate & Development",
  "Investment, International Trade & Enterprise Growth",
];

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const enterprise: FormConfig = {
  id: "enterprise",
  title: "Enterprise Expression of Interest",
  intro: "Tell us about your business so our team can review your application for The Grand Table 2026.",
  submitLabel: "Submit expression of interest",
  fields: [
    { name: "companyName", label: "Company name", type: "text", required: true },
    { name: "contactName", label: "Contact person full name", type: "text", required: true },
    { name: "jobTitle", label: "Job title", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone (WhatsApp)", type: "tel", required: true },
    { name: "country", label: "Country", type: "country", required: true },
    { name: "cityState", label: "City/State", type: "text", required: true },
    { name: "website", label: "Website", type: "url" },
    { name: "sector", label: "Sector", type: "select", required: true, options: SECTORS },
    { name: "yearEstablished", label: "Year established", type: "number", required: true },
    { name: "employees", label: "Number of employees", type: "select", required: true, options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
    { name: "revenue", label: "Annual revenue range", type: "select", required: true, options: ["Under NGN 50M", "NGN 50M-250M", "NGN 250M-1B", "Over NGN 1B", "Prefer not to say"] },
    { name: "seeking", label: "What you are seeking", type: "select", required: true, options: ["Investment", "Partnerships", "Market access", "Expansion support", "Other"] },
    { name: "description", label: "Brief business description", type: "textarea", required: true, full: true },
    { name: "companyProfile", label: "Company profile", type: "file", accept: "application/pdf", required: true, full: true, helper: "PDF only, max 10 MB" },
  ],
  steps: [
    { label: "Company", fields: ["companyName", "website", "country", "cityState", "sector", "yearEstablished", "employees", "revenue"] },
    { label: "Contact", fields: ["contactName", "jobTitle", "email", "phone"] },
    { label: "Details", fields: ["seeking", "description", "companyProfile"] },
  ],
};

const delegate: FormConfig = {
  id: "delegate",
  title: "Delegate, Investor and Partner Registration",
  intro: `International delegates, investors and partners register here for The Grand Table 2026. Regular entry is ${fmt.usd(event.fees.regular.usd)} (${fmt.ngn(event.fees.regular.ngn)} · ${fmt.aed(event.fees.regular.aed)} · ${fmt.inr(event.fees.regular.inr)}); early bird ${fmt.ngn(event.fees.earlyBird.ngn)} / ${fmt.usd(event.fees.earlyBird.usd)}. Sponsorship tiers start at ${fmt.usd(event.sponsorTiers[0].price.usd)}. Indicative conversions; final invoice currency confirmed on registration. No payment is taken on this form.`,
  submitLabel: "Submit registration",
  fields: [
    { name: "participantType", label: "Participant type", type: "select", required: true, options: ["International delegate", "Investor", "Partner or institution"] },
    { name: "fullName", label: "Full name", type: "text", required: true },
    { name: "organisation", label: "Organisation", type: "text", required: true },
    { name: "jobTitle", label: "Job title", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "countryOfResidence", label: "Country of residence", type: "country", required: true },
    { name: "sectorsOfInterest", label: "Sectors of interest", type: "select", required: true, options: SECTORS },
    { name: "focus", label: "Investment or partnership focus", type: "select", required: true, options: ["Investment", "Partnership", "Market entry", "Networking", "Other"] },
    { name: "visaLetter", label: "Visa invitation letter required", type: "select", required: true, options: ["Yes", "No"] },
    { name: "notes", label: "Additional notes", type: "textarea", full: true },
  ],
};

const investor: FormConfig = {
  id: "investor",
  title: "Investor and Partner Enquiry",
  intro: "Tell us about your investment focus and our partnerships team will follow up with tailored opportunities.",
  submitLabel: "Submit enquiry",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true },
    { name: "organisation", label: "Organisation", type: "text", required: true },
    { name: "role", label: "Role / job title", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "country", label: "Country", type: "country", required: true },
    { name: "sectors", label: "Investment focus / sectors", type: "select", required: true, options: SECTORS },
    {
      name: "ticketSize",
      label: "Ticket size range",
      type: "select",
      required: true,
      options: ["Under $50K", "$50K–$250K", "$250K–$1M", "$1M–$5M", "Over $5M", "Not applicable"],
    },
    {
      name: "partnershipType",
      label: "Partnership type",
      type: "select",
      required: true,
      full: true,
      options: ["Equity investment", "Debt / financing", "Joint venture", "Strategic partnership", "Distribution / market access", "Other"],
    },
    { name: "message", label: "Message", type: "textarea", full: true },
    {
      name: "consent",
      label: "I agree to be contacted by Flott Women's Circle about The Grand Table 2026",
      type: "checkbox",
      required: true,
      full: true,
    },
  ],
};

const sponsor: FormConfig = {
  id: "sponsor",
  title: "Sponsorship Enquiry",
  intro: "Share a few details and our partnerships team will follow up with the sponsorship brochure.",
  submitLabel: "Submit sponsorship enquiry",
  fields: [
    { name: "companyName", label: "Company name", type: "text", required: true },
    { name: "contactName", label: "Contact person", type: "text", required: true },
    { name: "jobTitle", label: "Job title", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "country", label: "Country", type: "country", required: true },
    {
      name: "tier",
      label: "Preferred tier",
      type: "select",
      required: true,
      options: [...event.sponsorTiers.map((tier) => `${tier.name} ${fmt.usd(tier.price.usd)}`), "Undecided"],
    },
    { name: "website", label: "Website", type: "url" },
    { name: "message", label: "Message or sponsorship goals", type: "textarea", full: true },
  ],
};

const contact: FormConfig = {
  id: "contact",
  title: "General Enquiry",
  intro: "Have a question about The Grand Table 2026? Send us a message.",
  submitLabel: "Send message",
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "organisation", label: "Organisation", type: "text" },
    { name: "category", label: "Enquiry category", type: "select", required: true, options: ["General enquiry", "Enterprise registration", "Delegates and investors", "Sponsorship", "Media and press", "Partnerships", "Other"] },
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true, full: true },
  ],
};

export const forms = { enterprise, delegate, investor, sponsor, contact };
