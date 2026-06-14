export type ServiceCity = {
  slug: string;
  name: string;
  region: string;
  distanceKm: number;
  population: string;
  intro: string;
  neighborhoods: string[];
  highlights: string[];
  latitude: number;
  longitude: number;
};

export const serviceCities: ServiceCity[] = [
  {
    slug: "burnaby",
    name: "Burnaby",
    region: "Metro Vancouver",
    distanceKm: 12,
    population: "250,000+",
    intro:
      "Same-day TV mounting, smart home setup, WiFi and security camera installation across Burnaby — from Metrotown high-rises to North Burnaby family homes.",
    neighborhoods: ["Metrotown", "Brentwood", "Lougheed", "Burnaby Heights", "Edmonds", "Capitol Hill"],
    highlights: [
      "Condo-friendly: stud-finder + concrete-anchor mounts for Metrotown towers",
      "Mesh WiFi optimized for 1,200+ sqft units",
      "Strata-approved camera installs",
    ],
    latitude: 49.2488,
    longitude: -122.9805,
  },
  {
    slug: "surrey",
    name: "Surrey",
    region: "South Fraser",
    distanceKm: 30,
    population: "600,000+",
    intro:
      "Surrey's go-to home tech installer — TV mounting, smart home, networking and handyman service from Newton to South Surrey and Cloverdale.",
    neighborhoods: ["Newton", "Guildford", "Fleetwood", "Cloverdale", "South Surrey", "Whalley", "Panorama Ridge"],
    highlights: [
      "Whole-home mesh WiFi for new builds",
      "Outdoor camera systems with night vision",
      "Garage TV + sound bar installs",
    ],
    latitude: 49.1913,
    longitude: -122.849,
  },
  {
    slug: "richmond",
    name: "Richmond",
    region: "Metro Vancouver",
    distanceKm: 14,
    population: "210,000+",
    intro:
      "Professional TV mounting and smart home installation throughout Richmond — Steveston heritage homes, Brighouse condos and everything in between.",
    neighborhoods: ["Steveston", "Brighouse", "Broadmoor", "Terra Nova", "Hamilton", "Thompson"],
    highlights: [
      "Cantonese & Mandarin support available",
      "In-wall cable concealment for new builds",
      "Smart blinds & lighting automation",
    ],
    latitude: 49.1666,
    longitude: -123.1336,
  },
  {
    slug: "north-vancouver",
    name: "North Vancouver",
    region: "North Shore",
    distanceKm: 15,
    population: "150,000+",
    intro:
      "North Shore home setup specialists — TV mounting, home theatre, outdoor security cameras and WiFi for North Van's Lonsdale, Deep Cove and Lynn Valley homes.",
    neighborhoods: ["Lonsdale", "Deep Cove", "Lynn Valley", "Edgemont", "Capilano", "Seymour"],
    highlights: [
      "Mountain-view picture-window TV mounts",
      "Outdoor weatherproof camera systems",
      "Wired Ethernet drops for older homes",
    ],
    latitude: 49.3199,
    longitude: -123.0724,
  },
  {
    slug: "coquitlam",
    name: "Coquitlam",
    region: "Tri-Cities",
    distanceKm: 27,
    population: "150,000+",
    intro:
      "Tri-Cities home technology pros — same-week appointments for Coquitlam, Port Coquitlam and Port Moody. TV mounts, smart homes, cameras and handyman.",
    neighborhoods: ["Burke Mountain", "Coquitlam Centre", "Westwood Plateau", "Port Coquitlam", "Port Moody", "Maillardville"],
    highlights: [
      "Burke Mountain new-build automation packages",
      "Multi-room audio for family rooms",
      "Ring/Nest doorbell + camera installs",
    ],
    latitude: 49.2838,
    longitude: -122.7932,
  },
  {
    slug: "langley",
    name: "Langley",
    region: "South Fraser",
    distanceKm: 45,
    population: "180,000+",
    intro:
      "Langley City and Township home setup — TV mounting, surround sound, security cameras and smart home installs from Walnut Grove to Aldergrove.",
    neighborhoods: ["Walnut Grove", "Willoughby", "Murrayville", "Brookswood", "Fort Langley", "Aldergrove"],
    highlights: [
      "Acreage WiFi coverage with outdoor APs",
      "Detached shop & barn camera systems",
      "Custom theatre rooms in Willoughby new builds",
    ],
    latitude: 49.1044,
    longitude: -122.6603,
  },
  {
    slug: "abbotsford",
    name: "Abbotsford",
    region: "Fraser Valley",
    distanceKm: 70,
    population: "160,000+",
    intro:
      "Fraser Valley's trusted installer — Abbotsford TV mounting, smart home, WiFi mesh, cameras and handyman service. Mission and Chilliwack also covered.",
    neighborhoods: ["Abbotsford East", "West Abbotsford", "Clearbrook", "Sumas Mountain", "Matsqui", "Aberdeen"],
    highlights: [
      "Long-range farm property WiFi",
      "Multi-camera surveillance kits",
      "Bundle pricing for new homeowners",
    ],
    latitude: 49.0504,
    longitude: -122.3045,
  },
];
