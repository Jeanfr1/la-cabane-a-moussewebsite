// Single source for every business fact on the page (rendered into the HTML at build time).
// Sources: 07-integracao/dados.json + FONTES.md (PagesJaunes, Cirkwi, annuaire-entreprises, 11/10/2026).
// TODO(cabane): confirm the Instagram URL and swap the map search for the Google place link (cid).
export const site = {
  name: 'La Cabane à Mousse',
  fullName: 'La Cabane à Mousse Herbignac',
  descriptor: 'Cave & Bar à Bières en Brière',
  url: 'https://la-cabane-a-mousse-herbignac.vercel.app',
  phone: '07 60 21 77 18',
  phoneHref: 'tel:+33760217718',
  phoneIntl: '+33760217718',
  street: '21 avenue de la Monneraye (RD33)',
  postalCode: '44410',
  city: 'Herbignac',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=La+Cabane+a+Mousse+21+avenue+de+la+Monneraye+Herbignac',
  instagramUrl: 'https://www.instagram.com/lacabaneamousse.herbignac/',
  // day index follows Date#getDay (0 = dimanche)
  hours: [
    { label: 'Lundi à vendredi', value: '11h–21h', days: [1, 2, 3, 4, 5], opens: '11:00', closes: '21:00' },
    { label: 'Samedi', value: '10h–21h', days: [6], opens: '10:00', closes: '21:00' },
    { label: 'Dimanche', value: 'fermé', days: [0] },
  ],
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarOrPub',
  name: site.fullName,
  description: `${site.descriptor}. Location de tireuses.`,
  url: site.url,
  telephone: site.phoneIntl,
  image: `${site.url}/og-v1.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.street,
    postalCode: site.postalCode,
    addressLocality: site.city,
    addressCountry: 'FR',
  },
  openingHoursSpecification: site.hours
    .filter((h) => h.opens)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]),
      opens: h.opens,
      closes: h.closes,
    })),
  sameAs: [site.instagramUrl],
};
