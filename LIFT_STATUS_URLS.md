# Lift Status & Conditions URLs - Resort Research

This document contains the official lift status, trail report, and conditions URLs for all resorts in the SNOWSCOPE application. Use this as a reference for implementing live lift status scraping.

## Implementation Status

- ✅ **Stowe** - Live scraping implemented
- ✅ **Mad River Glen** - Live scraping implemented
- ✅ **Jay Peak** - Live scraping implemented
- ✅ **Sugarbush** - Live scraping implemented
- ✅ **Killington** - Live scraping implemented
- ✅ **Sunday River** - Live scraping implemented
- ✅ **Mammoth** - Live scraping implemented
- ⏳ **All others** - Weather-based projections only

---

## Northeast USA Resorts

### Stowe Mountain Resort (Vermont)
**Status:** ✅ Implemented
**Primary URL:** https://www.stowe.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx
**API/Data Format:** JavaScript object `FR.TerrainStatusFeed` embedded in HTML
**Notes:** Currently scraping via regex parsing of embedded JSON data

### Mad River Glen (Vermont)
**Primary URL:** https://www.madriverglen.com/conditions/
**Notes:** Independent resort with unique policies. Likely requires HTML parsing.

### Jay Peak Resort (Vermont)
**Primary URLs:**
- Snow Report: https://jaypeakresort.com/skiing-riding/snow-report-maps/snow-report
- Detailed Report: https://digital.jaypeakresort.com/conditions/snow-report/snow-report/
- Printable: https://digital.jaypeakresort.com/conditions/snow-report/printable-report/
- Today at Jay: https://jaypeakresort.com/todayatjay

**Notes:** Multiple endpoints available for different data formats

### Sugarbush Resort (Vermont)
**Primary URL:** https://www.sugarbush.com/mountain/conditions
**Additional:** https://www.sugarbush.com/mountain
**Notes:** Covers both Lincoln Peak and Mt. Ellen (111 trails, 16 lifts)

### Killington Resort (Vermont)
**Primary URLs:**
- Lift & Trail Report: https://www.killington.com/the-mountain/conditions-weather/lifts-trails-report/
- Current Conditions: https://www.killington.com/the-mountain/conditions-weather/current-conditions-weather/

**Notes:** Largest ski resort in the East - separate pages for lifts/trails and weather

### Sunday River (Maine)
**Primary URLs:**
- Mountain Report: https://www.sundayriver.com/mountain-report
- Lifts & Trails: https://www.sundayriver.com/lifts-and-trails-status

**Notes:** Two main endpoints for comprehensive data

---

## Western USA Resorts

### Mammoth Mountain (California)
**Primary URLs:**
- Mountain Report: https://www.mammothmountain.com/on-the-mountain/mountain-report
- On The Mountain: https://www.mammothmountain.com/on-the-mountain

**Notes:** Includes forecast, lift status, and trail maps

### Powder Mountain (Utah)
**Primary URL:** https://powdermountain.com/conditions
**Additional:** https://powdermountain.com/powderhaven-conditions
**Notes:** Includes snow updates, terrain reports, lift status, and webcams. Opens December 12, 2025.

### Taos Ski Valley (New Mexico)
**Primary URLs:**
- Lifts & Trails: https://www.skitaos.com/mountain/lifts-trails
- Mountain Info: https://www.skitaos.com/mountain

**Phone:** (575) 776-2916 (Snow Report line, updated daily)
**Notes:** Provides real-time trail status updates

### Telluride Ski Resort (Colorado)
**Primary URLs:**
- Mobile App Info: https://tellurideskiresort.com/app/
- Snow Report PDF: https://tellurideskiresort.com/snow-report-pdf/

**Notes:** Resort heavily promotes their mobile app for real-time conditions

---

## Canada Resorts

### Kicking Horse Mountain Resort (British Columbia)
**Primary URLs:**
- Lift Status: https://kickinghorseresort.com/conditions/lift-status/
- Trail Report: https://kickinghorseresort.com/conditions/trail-report/
- Snow Report: https://kickinghorseresort.com/conditions/snow-report/

**Notes:** Well-organized conditions section with dedicated pages. 120+ trails, 3,486 acres.

### Fernie Alpine Resort (British Columbia)
**Primary URLs:**
- Trail Report: https://skifernie.com/conditions/trail-report/
- Open Runs: https://skifernie.com/conditions/open-runs-report/
- Snow Report: https://skifernie.com/conditions/snow-report/

**Notes:** Opens December 5, 2025 for 2025/26 season

---

## International Resorts

### Niseko United (Hokkaido, Japan)
**Primary URLs:**
- Lift Status: https://www.niseko.ne.jp/en/niseko-lift-status/
- Snow Report: https://www.niseko.ne.jp/en/niseko-snow-report/
- Trail Map: https://www.niseko.ne.jp/en/map/

**Individual Resort:**
- Hanazono: https://hanazononiseko.com/en/winter/resort/lift-status

**Notes:** Four interconnected resorts (Annupuri, Niseko Village, Grand Hirafu, Hanazono). English interface available.

### Livigno Ski Area (Lombardy, Italy)
**Primary URL:** https://www.livigno.eu/en/lifts

**Third-Party Reports:**
- SkiResort.info: https://www.skiresort.info/ski-resort/livigno/snow-report/
- OnTheSnow: https://www.onthesnow.co.uk/lombardia/livigno/skireport
- Bergfex: https://www.bergfex.com/livigno/schneebericht/

**Notes:** 31 lifts, 115km of pistes. Summer lift operations June-September 2025.

---

## Implementation Notes

### Data Extraction Methods

1. **JavaScript Object Parsing** (Stowe model)
   - Look for embedded JavaScript objects in HTML
   - Use regex to extract JSON data
   - Parse and format into our data structure

2. **HTML Parsing**
   - Most resorts will require DOM parsing
   - Look for structured tables or div elements
   - May need to handle different status text formats

3. **API Endpoints**
   - Some resorts may have undocumented JSON APIs
   - Check network tab when loading conditions pages
   - Look for XHR/fetch requests

4. **Mobile App APIs**
   - Some resorts (like Telluride) have mobile apps
   - May be able to reverse-engineer API endpoints
   - Typically more structured than web scraping

### Challenges to Consider

- **Anti-scraping measures**: Some sites may block automated requests
- **Different data formats**: Each resort structures data differently
- **Multi-language sites**: International resorts may require language parameter
- **Off-season closures**: Many sites show no data during summer
- **Authentication**: Some resorts may require login for full data
- **Rate limiting**: Implement caching and respect robots.txt
- **Legal considerations**: Review each resort's terms of service

### Recommended Implementation Priority

**Tier 1 (High Priority):**
1. Stowe ✅ (Already done)
2. Mammoth (Large California resort)
3. Killington (Largest East Coast resort)
4. Niseko (International appeal)

**Tier 2 (Medium Priority):**
5. Jay Peak (Good data structure)
6. Sugarbush (Popular VT resort)
7. Telluride (Premium destination)
8. Kicking Horse (Well-organized API)

**Tier 3 (Lower Priority):**
9. Mad River Glen (Smaller, independent)
10. Sunday River
11. Powder Mountain
12. Taos
13. Fernie
14. Livigno

### Cache Strategy

- **Stowe (implemented)**: 5 minutes (`next: { revalidate: 300 }`)
- **Recommended for others**: 5-15 minutes during operating hours
- **Off-peak/night**: 30-60 minutes
- **Store last successful fetch**: Display "last updated" timestamp

### Error Handling

- Gracefully fall back to weather-based projections
- Show clear messaging when live data unavailable
- Log errors for monitoring
- Retry logic with exponential backoff

---

## Next Steps

1. **Test Scraping**: Try fetching and parsing data from each URL
2. **Document Structures**: Map out data structure for each resort
3. **Build Scrapers**: Create resort-specific scraping functions
4. **Add Tests**: Ensure scrapers handle various conditions
5. **Implement Caching**: Use Next.js caching strategies
6. **Monitor Performance**: Track success rates and response times

---

Last Updated: 2025-01-02
