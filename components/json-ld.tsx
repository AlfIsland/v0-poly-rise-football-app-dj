// JSON-LD structured data for SEO
// This is exported as static data that can be used by search engines

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "PolyRISE Football",
  description:
    "Elite youth football training organization focused on developing athletic excellence, discipline, and leadership in K-12 athletes.",
  url: "https://polyrisefootball.com",
  logo: "https://polyrisefootball.com/poly-rise-logo.png",
  image: "https://polyrisefootball.com/poly-rise-logo.png",
  telephone: "+1-817-658-3300",
  email: "polyrise@polyrisefootball.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dripping Springs",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Place",
    name: "Austin, Texas and expanding nationwide",
  },
  sport: "American Football",
  sameAs: [
    "https://www.instagram.com/polyrisefootball/",
    "https://www.facebook.com/PolyRiseFootball",
    "https://www.tiktok.com/@polyrisefootball",
    "https://www.youtube.com/@PolyRiseFootball",
  ],
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://polyrisefootball.com/#localbusiness",
  name: "PolyRISE Football",
  description:
    "Elite youth football training for kids ages 5-18 in Austin, Texas. Professional NFL-experienced coaches offering SAQ training, strength conditioning, 7v7 tournaments, and college recruitment support.",
  url: "https://polyrisefootball.com",
  telephone: "+1-817-658-3300",
  email: "polyrise@polyrisefootball.com",
  image: "https://polyrisefootball.com/poly-rise-logo.png",
  logo: "https://polyrisefootball.com/poly-rise-logo.png",
  priceRange: "$275-$500/month",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dripping Springs",
    addressRegion: "TX",
    addressCountry: "US",
  },
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What age groups do you train?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We train athletes from kindergarten through 12th grade (ages 5-18). Our programs are designed to meet each athlete where they are in their development journey.",
      },
    },
    {
      "@type": "Question",
      name: "How much does youth football training cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our programs range from $275-$500 per month. Player Development is $350/month, 360 Elite with college recruitment support is $500/month, and Girls Player Development starts at $275/month for 2 days per week.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer football training for girls?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We have a dedicated Girls Player Development program with options for 2 days per week ($275/month) or 3 days per week ($325/month).",
      },
    },
    {
      "@type": "Question",
      name: "Do you help with college football recruitment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our 360 Elite program ($500/month) includes a professional recruiting profile, 7 email blasts per month to college coaches, yearly college visits, and NIL & financial literacy classes.",
      },
    },
    {
      "@type": "Question",
      name: "Where is PolyRISE Football located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are based in Austin, Texas with training facilities at Swift Sessions. We also offer camps in Marble Falls, TX and are expanding to cities nationwide.",
      },
    },
  ],
}
