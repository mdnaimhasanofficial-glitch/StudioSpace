export type StudioCategory =
  | "Photo"
  | "Sound Stage"
  | "Podcast"
  | "Music"
  | "Video";

export interface Studio {
  slug: string;
  name: string;
  category: StudioCategory;
  tagline: string;
  description: string;
  location: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  amenities: string[];
  image: string;
  gallery: string[];
  /** Rendered as a hero slide on the home page. */
  hero?: boolean;
}

const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const studios: Studio[] = [
  {
    slug: "the-white-room",
    name: "The White Room",
    category: "Photo",
    tagline: "120m² cyclorama with full blackout",
    description:
      "A seamless white cyc wall built for fashion, product, and editorial shoots. Grip and lighting packages are on site, the freight elevator fits a full set build, and the blackout blinds turn day into night on command.",
    location: "DUMBO, Brooklyn",
    pricePerHour: 85,
    rating: 4.9,
    reviews: 128,
    amenities: [
      "Cyclorama — 120m²",
      "Blackout blinds",
      "Freight elevator",
      "Makeup station",
      "1 Gbps Wi-Fi",
      "Street parking",
    ],
    image: photo("photo-1497015289639-54688650d173"),
    gallery: [
      photo("photo-1516035069371-29a1b244cc32"),
      photo("photo-1621111848501-8d3634f82336"),
      photo("photo-1516724562728-afc824a36e84"),
    ],
    hero: true,
  },
  {
    slug: "sound-stage-9",
    name: "Sound Stage 9",
    category: "Sound Stage",
    tagline: "Isolated live room with control booth",
    description:
      "A proper live room with an isolated control booth, a house PA, and a backline that is tuned and ready. Built for band sessions, live takes, and small audience recordings.",
    location: "Long Island City, Queens",
    pricePerHour: 140,
    rating: 4.8,
    reviews: 74,
    amenities: [
      "Isolated live room",
      "Control booth",
      "House PA system",
      "Drum kit",
      "Loading dock",
      "Green room",
    ],
    image: photo("photo-1598387993441-a364f854c3e1"),
    gallery: [
      photo("photo-1598387181032-a3103a2db5b3"),
      photo("photo-1598488035139-bdbb2231ce04"),
      photo("photo-1505373877841-8d25f7d46678"),
    ],
    hero: true,
  },
  {
    slug: "the-podcast-lounge",
    name: "The Podcast Lounge",
    category: "Podcast",
    tagline: "Four-mic lounge setup, streaming-ready",
    description:
      "Four-mic lounge setup with acoustic panels, RØDECaster II, and headphone monitoring for every seat. Walk in, press record, and leave with a mixed file.",
    location: "Williamsburg, Brooklyn",
    pricePerHour: 60,
    rating: 4.9,
    reviews: 212,
    amenities: [
      "4-mic setup",
      "RØDECaster Pro II",
      "Acoustic panels",
      "Lounge seating",
      "Headphone monitoring",
      "Streaming-ready",
    ],
    image: photo("photo-1581368135153-a506cf13b1e1"),
    gallery: [
      photo("photo-1589903308904-1010c2294adc"),
      photo("photo-1590602847861-f357a9332bbc"),
      photo("photo-1478737270239-2f02b77fc618"),
    ],
    hero: true,
  },
  {
    slug: "analog-arms",
    name: "Analog Arms",
    category: "Music",
    tagline: "Analog console and a vintage guitar wall",
    description:
      "A warm tracking room built around an analog console, a wall of vintage guitars, and two isolation booths. Tape machine on standby if you want it.",
    location: "Bushwick, Brooklyn",
    pricePerHour: 95,
    rating: 4.7,
    reviews: 66,
    amenities: [
      "Analog mixing console",
      "Vintage guitar wall",
      "Two isolation booths",
      "Tape machine",
      "In-house engineer (add-on)",
    ],
    image: photo("photo-1598488035139-bdbb2231ce04"),
    gallery: [
      photo("photo-1519508234439-4f23643125c1"),
      photo("photo-1598653222000-6b7b7a552625"),
      photo("photo-1571330735066-03aaa9429d89"),
    ],
  },
  {
    slug: "producer-pod",
    name: "Producer Pod",
    category: "Music",
    tagline: "Home-style production pod with vocal booth",
    description:
      "A focused production room with nearfield monitors, a MIDI keyboard, and a treated vocal booth off to the side. Late-night slots available.",
    location: "Ridgewood, Queens",
    pricePerHour: 45,
    rating: 4.6,
    reviews: 91,
    amenities: [
      "Nearfield monitors",
      "MIDI keyboard",
      "Vocal booth",
      "Coffee bar",
      "Late-night access",
    ],
    image: photo("photo-1598653222000-6b7b7a552625"),
    gallery: [
      photo("photo-1478737270239-2f02b77fc618"),
      photo("photo-1589903308904-1010c2294adc"),
      photo("photo-1621111848501-8d3634f82336"),
    ],
  },
  {
    slug: "lens-loft",
    name: "Lens Loft",
    category: "Photo",
    tagline: "Daylight loft with gear rental on site",
    description:
      "North-facing daylight all afternoon, a rental shelf of lenses and strobes, and a blackout option when you need it. Wardrobe rack and makeup station included.",
    location: "Greenpoint, Brooklyn",
    pricePerHour: 70,
    rating: 4.8,
    reviews: 58,
    amenities: [
      "North-facing daylight",
      "Gear rental on site",
      "Makeup station",
      "Wardrobe rack",
      "Blackout option",
      "Freight elevator",
    ],
    image: photo("photo-1516035069371-29a1b244cc32"),
    gallery: [
      photo("photo-1497015289639-54688650d173"),
      photo("photo-1516724562728-afc824a36e84"),
      photo("photo-1621600411688-4be93cd68504"),
    ],
  },
  {
    slug: "the-cutting-room",
    name: "The Cutting Room",
    category: "Video",
    tagline: "Edit suite with colour-calibrated display",
    description:
      "A quiet edit suite with a colour-calibrated display, surround monitoring, and fast NAS storage. Bring your drives or use ours.",
    location: "Fort Greene, Brooklyn",
    pricePerHour: 55,
    rating: 4.7,
    reviews: 43,
    amenities: [
      "Colour-calibrated display",
      "Surround monitoring",
      "NAS storage",
      "Client sofa",
      "Late-night access",
    ],
    image: photo("photo-1574717024653-61fd2cf4d44d"),
    gallery: [
      photo("photo-1621600411688-4be93cd68504"),
      photo("photo-1621111848501-8d3634f82336"),
      photo("photo-1516724562728-afc824a36e84"),
    ],
  },
  {
    slug: "midnight-rehearsal",
    name: "Midnight Rehearsal",
    category: "Sound Stage",
    tagline: "Full backline, open around the clock",
    description:
      "A rehearsal room with full backline, a drum kit, and a PA with mics ready to go. Doors never close — book a 3am slot if that is when the song arrives.",
    location: "Bushwick, Brooklyn",
    pricePerHour: 50,
    rating: 4.6,
    reviews: 87,
    amenities: [
      "Full backline",
      "Drum kit",
      "PA with mics",
      "Lounge corner",
      "24/7 access",
    ],
    image: photo("photo-1598387181032-a3103a2db5b3"),
    gallery: [
      photo("photo-1519508234439-4f23643125c1"),
      photo("photo-1598488035139-bdbb2231ce04"),
      photo("photo-1461784121038-f088ca1e7714"),
    ],
  },
];

export const studioCategories: StudioCategory[] = [
  "Photo",
  "Sound Stage",
  "Podcast",
  "Music",
  "Video",
];

export function getAllStudios(): Studio[] {
  return studios;
}

export function getStudioBySlug(slug: string): Studio | undefined {
  return studios.find((studio) => studio.slug === slug);
}

export function getHeroSlides(): Studio[] {
  return studios.filter((studio) => studio.hero);
}

export function getFeaturedStudios(count = 3): Studio[] {
  return studios.filter((studio) => !studio.hero).slice(0, count);
}

export function getSimilarStudios(slug: string, count = 3): Studio[] {
  const current = getStudioBySlug(slug);
  const sameCategory = studios.filter(
    (studio) => studio.slug !== slug && studio.category === current?.category,
  );
  const rest = studios.filter(
    (studio) =>
      studio.slug !== slug && studio.category !== current?.category,
  );
  return [...sameCategory, ...rest].slice(0, count);
}
