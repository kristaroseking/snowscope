/**
 * Trail map URLs for each resort
 * These are publicly available trail map images from resort websites
 * All URLs have been verified to work as of November 2025
 */

export interface TrailMapData {
  imageUrl: string;
  pdfUrl?: string;
  source: string;
  lastUpdated?: string;
}

export const trailMapUrls: Record<string, TrailMapData> = {
  stowe: {
    imageUrl: "https://scene7.vailresorts.com/is/image/vailresorts/20251014_ST_winter-trail_map_001?wid=2000&hei=1500&fit=constrain,1&resMode=sharp2",
    pdfUrl: "https://www.stowe.com/-/aemasset/sitecore/stowe/maps/winter-2025-2026/20251014_ST_winter-trail_map_001.pdf",
    source: "Stowe Mountain Resort",
  },
  "mad-river-glen": {
    imageUrl: "https://www.madriverglen.com/wp-content/uploads/2025/06/2025-Mad-River-Glen-Trail-Map.png",
    pdfUrl: undefined,
    source: "Mad River Glen",
  },
  "jay-peak": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/wbbvpzjkgpfns68mjfxgz3r/Jay_Peak_Resort?auto=webp&width=2048",
    pdfUrl: "https://jaypeakresort.com/wp-content/uploads/2024/11/jay-peak-trail-map-2024-25.pdf",
    source: "Jay Peak Resort",
  },
  sugarbush: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/4vttspktgnfj7n7xnkrghpvm/Sugarbush?auto=webp&format=png&width=2048",
    pdfUrl: "https://www.sugarbush.com/-/media/sugarbush/maps/sug-winter-trail-map-2023-24-mapside-optimized.pdf",
    source: "Sugarbush Resort",
  },
  killington: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/3fp49twzqfrtns7jx9qm5r/Killington_Resort?auto=webp&format=png&width=2048",
    pdfUrl: "https://images.ski.com/docs/trail-maps/killington_trail-map.pdf",
    source: "Killington Resort",
  },
  "sunday-river": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/n68wbkgnhxvjpc9fscmj67v/Sunday_River?auto=webp&width=2048",
    pdfUrl: "https://cdn.sanity.io/files/k8yfdmw9/sunday-river/78ea8affe8a94b5bcd3257e17f6f17db4adca4eb.pdf",
    source: "Sunday River",
  },
  mammoth: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/vjmfxhv4wgwn2f95xt8jhjhx/Mammoth_Mountain_Ski_Area?auto=webp&width=2048",
    pdfUrl: "https://sc.mammothmountain.com/-/media/project/mammoth/library/pdfs/maps/25-26_mmsa_trailmap_brochure_web.pdf",
    source: "Mammoth Mountain",
  },
  "powder-mountain": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/6wrhkz4ztbcffqg6tfnmbmg/Powder_Mountain?auto=webp&format=png&width=2048",
    pdfUrl: undefined,
    source: "Powder Mountain",
  },
  taos: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/jv9jws58p5x8vtznm4zqf/Taos-Ski-Valley-trail-map-2025?auto=webp&width=2048",
    pdfUrl: undefined,
    source: "Taos Ski Valley",
  },
  telluride: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/nvkc8m9b4crqrk5s4bkkqwj/Telluride?auto=webp&format=png&width=2048",
    pdfUrl: "https://tellurideskiresort.com/wp-content/uploads/2425_TSR_Trail-Map_web.pdf",
    source: "Telluride Ski Resort",
  },
  "kicking-horse": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/w9qj8crf55vr3fh64k6fb7c/Kicking_Horse_Mountain_Resort?auto=webp&width=2048",
    pdfUrl: "https://kickinghorseresort.com/wp-content/uploads/2023/12/KH-trailmap-outside-WEB-2023-1.pdf",
    source: "Kicking Horse Mountain Resort",
  },
  fernie: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/tctfh8hkzvhjgfzmmmqnm3w/Fernie_Alpine_Resort?auto=webp&width=2048",
    pdfUrl: "https://skifernie.com/wp-content/uploads/2025/05/7613310359-far-Mapside-2025-FINAL.pdf",
    source: "Fernie Alpine Resort",
  },
  niseko: {
    imageUrl: "https://www.niseko.ne.jp/en/wp-content/uploads/2025/09/2025-2026_WEBMAP_EG-1-scaled.jpg",
    pdfUrl: "https://www.niseko.ne.jp/en/wp-content/uploads/2020/08/2025-2026_WEBMAP_EG.pdf",
    source: "Niseko United",
  },
  "banff-sunshine": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/pvm4kwxwcrm534kmcq3v69f6/Banff_Sunshine?auto=webp&format=png&width=2048",
    pdfUrl: "https://www.skibanff.com/wp-content/uploads/2025/09/25_TrailMap_GoatsEye_web.pdf",
    source: "Banff Sunshine Village",
  },
  livigno: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/xxpwjz8qrfvkt7gkqmh7v5w/Livigno?auto=webp&width=2048",
    pdfUrl: "https://www.livigno.eu/hubfs/Skipass%20Livigno%20mappa%20impianti%20completa%20A4-2024_2025%20(1)-1-1.pdf",
    source: "Livigno Ski Area",
  },
  "magic-mountain": {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/fq8hcjxhgchn8fkf7fvtr6/Magic_Mountain?auto=webp&format=png&width=2048",
    pdfUrl: undefined,
    source: "Magic Mountain",
  },
  sugarloaf: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/2x4vknm3xhr8gmn5bkpm8wz/Sugarloaf?auto=webp&width=2048",
    pdfUrl: undefined,
    source: "Sugarloaf",
  },
  "arapahoe-basin": {
    imageUrl: "https://www.myskimaps.com/Ski-Maps/USA/Arapahoe-Basin-Ski-Trail-Map-Frontside-2023.jpg",
    pdfUrl: "https://www.myskimaps.com/Ski-Maps/USA/Arapahoe-Basin-Ski-Trail-Map-Frontside-2023.pdf",
    source: "Arapahoe Basin",
  },
  tremblant: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/htqhgtfqb53zcgcjcpnzcgfz/Tremblant?auto=webp&format=png&width=2048",
    pdfUrl: "https://medias.tremblant.ca/pdf/cartes/carte-pistes-tremblant.pdf",
    source: "Mont Tremblant",
  },
  revelstoke: {
    imageUrl: "https://cdn.bfldr.com/WIENNW6Q/as/4b2f2mns7hsv7rv96xmffxm/Revelstoke_Canada_trail-map_2804?auto=webp&format=png&width=2048",
    pdfUrl: "https://www.revelstokemountainresort.com/site/assets/files/2840/revelstoke-mountain-resort-winter-map-2023-24.pdf",
    source: "Revelstoke Mountain Resort",
  },
};

/**
 * Get trail map data for a specific resort
 */
export function getTrailMapData(resortId: string): TrailMapData | null {
  return trailMapUrls[resortId] || null;
}
