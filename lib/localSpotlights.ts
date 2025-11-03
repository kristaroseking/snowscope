export interface LocalSpotlight {
  type: "restaurant" | "program" | "store" | "project" | "hero";
  name: string;
  description: string;
  highlight: string;
  icon: string;
}

// Weekly rotating spotlights for each resort
// Rotates based on week number of the year
export const localSpotlights: Record<string, LocalSpotlight[]> = {
  stowe: [
    {
      type: "restaurant",
      name: "The Bench",
      description:
        "A beloved Stowe institution since 1977, The Bench serves up hearty breakfasts and lunches with a side of mountain town charm. Known for their famous 'Bench Burger' and locally-sourced ingredients, this family-run eatery has been fueling skiers for nearly five decades.",
      highlight: "Try their Vermont maple cinnamon rolls - a local favorite!",
      icon: "🍔",
    },
    {
      type: "hero",
      name: "Andrea Mead Lawrence",
      description:
        "Olympic gold medalist and environmental activist who called Stowe home. Andrea won two gold medals in slalom events at the 1952 Olympics and later became a pioneering voice for environmental conservation, fighting to protect Vermont's landscapes and advocating for cleaner air and water.",
      highlight:
        "First American alpine skier to win two gold medals in a single Olympics!",
      icon: "🏅",
    },
    {
      type: "program",
      name: "Stowe Land Trust",
      description:
        "A community-driven conservation organization protecting Stowe's working farms, forests, and natural areas since 1987. They've conserved over 7,000 acres and maintain a network of public trails that connect the community to nature year-round.",
      highlight:
        "Free public trails and educational programs for all ages throughout the year.",
      icon: "🌲",
    },
    {
      type: "store",
      name: "Shaw's General Store",
      description:
        "Operating since 1895, Shaw's is Vermont's oldest continuously operating general store. This historic landmark offers everything from penny candy to local crafts, maintaining its original tin ceiling and wooden floors while serving as a community gathering place.",
      highlight:
        "Visit the original soda fountain and grab a hand-dipped ice cream cone!",
      icon: "🏪",
    },
  ],
  "mad-river-glen": [
    {
      type: "restaurant",
      name: "American Flatbread",
      description:
        "Founded in Waitsfield's Lareau Farm, American Flatbread serves wood-fired organic pizzas in a restored 1800s barn. The restaurant embodies the Mad River Valley spirit with locally-sourced ingredients, a commitment to organic farming, and a communal dining atmosphere.",
      highlight:
        "All-organic ingredients and the pizza ovens are heated with sustainably harvested wood!",
      icon: "🍕",
    },
    {
      type: "hero",
      name: "Betsy Pratt",
      description:
        "Former Mad River Glen president and co-op pioneer who helped orchestrate the 1995 shareholder purchase that made MRG the first cooperatively owned ski area in America. Betsy's leadership preserved the mountain's unique character and 'ski it if you can' ethos for future generations.",
      highlight:
        "Led the grassroots movement that saved Mad River Glen from corporate ownership.",
      icon: "⛷️",
    },
    {
      type: "store",
      name: "Tempest Book Shop",
      description:
        "An independent bookstore in Waitsfield that's been serving the Mad River Valley since 1976. Tempest offers carefully curated selections, hosts author events, and serves as a cultural hub for the tight-knit community.",
      highlight: "One of Vermont's oldest independent bookstores!",
      icon: "📚",
    },
    {
      type: "program",
      name: "Mad River Path",
      description:
        "A non-profit organization building a 15-mile recreational path system connecting communities in the Mad River Valley. The all-season path network promotes active transportation, reduces car traffic, and provides safe routes for walking, biking, and cross-country skiing.",
      highlight:
        "Over 8 miles completed so far, with more connections being built every year!",
      icon: "🚴",
    },
  ],
  "jay-peak": [
    {
      type: "restaurant",
      name: "Miss Jay's Drive-In",
      description:
        "A nostalgic drive-in restaurant serving classic American fare in nearby Newport. Family-owned for generations, Miss Jay's is famous for their creemees (soft-serve ice cream), burgers, and friendly service that makes everyone feel like a regular.",
      highlight:
        "Open seasonally - the maple creemee is a Vermont must-try!",
      icon: "🍦",
    },
    {
      type: "project",
      name: "Kingdom Trails Association",
      description:
        "While primarily known for mountain biking, Kingdom Trails helps support the Northeast Kingdom's economy and community. This non-profit maintains over 100 miles of trails and has become a model for sustainable recreation-based economic development in rural areas.",
      highlight:
        "Generates millions in economic impact for the Northeast Kingdom community!",
      icon: "🚵",
    },
    {
      type: "hero",
      name: "Northeast Kingdom Community Action",
      description:
        "This organization has been fighting poverty and supporting families in Vermont's Northeast Kingdom since 1965. NKCA provides fuel assistance, weatherization, early childhood education, and countless other services that strengthen the fabric of this rural community.",
      highlight:
        "Serves over 10,000 individuals annually across Vermont's most rural region.",
      icon: "🤝",
    },
    {
      type: "store",
      name: "The Farmer's Daughter",
      description:
        "A charming country store and café in Newport Center featuring local products, homemade baked goods, and Vermont crafts. This community gathering spot showcases the best of Northeast Kingdom artisans and producers.",
      highlight:
        "Everything from maple syrup to handmade soaps - all locally made!",
      icon: "🧺",
    },
  ],
  sugarbush: [
    {
      type: "restaurant",
      name: "Peasant",
      description:
        "A farm-to-table restaurant in Warren's historic Pitcher Inn, Peasant celebrates Vermont's agricultural bounty with sophisticated cuisine. Chef-owner Tom Bivins sources from local farms and foragers, creating seasonal menus that showcase the Mad River Valley's terroir.",
      highlight:
        "James Beard semi-finalist with ingredients sourced within 50 miles!",
      icon: "🍽️",
    },
    {
      type: "program",
      name: "Vermont Adaptive Ski & Sports",
      description:
        "Headquartered at Sugarbush, this non-profit provides year-round sports programming for people with disabilities. From adaptive skiing to kayaking and cycling, Vermont Adaptive helps individuals of all abilities experience the joy of outdoor recreation.",
      highlight:
        "One of the largest and most comprehensive adaptive sports programs in the country!",
      icon: "🎿",
    },
    {
      type: "hero",
      name: "Deb Markowitz",
      description:
        "Former Vermont Secretary of State and Warren resident who has been a champion for sustainable development and community resilience. Deb has worked tirelessly to balance recreation, conservation, and local community needs in the Mad River Valley.",
      highlight:
        "Led Vermont's land conservation efforts and continues championing climate action.",
      icon: "🌍",
    },
    {
      type: "store",
      name: "Warren Store",
      description:
        "A Vermont institution since 1837, the Warren Store is equal parts general store, bakery, and community hub. Famous for their weekend brunch and Vermont products, this landmark has been serving locals and visitors for over 185 years.",
      highlight:
        "Their sticky buns are legendary - arrive early on weekends!",
      icon: "🥐",
    },
  ],
  killington: [
    {
      type: "restaurant",
      name: "Liquid Art Coffeehouse",
      description:
        "More than just a coffee shop, Liquid Art in Montpelier (the nearest city to Killington) showcases local artists, hosts live music, and serves fair-trade coffee. This community space embodies Vermont's commitment to art, sustainability, and supporting local creators.",
      highlight:
        "All profits support arts education programs in Vermont schools!",
      icon: "☕",
    },
    {
      type: "hero",
      name: "Preston Leete Smith",
      description:
        "Founder of Killington Resort who transformed a remote Vermont mountain into the 'Beast of the East.' Preston's vision and determination created thousands of jobs and helped establish Vermont as a premier ski destination, while his commitment to snowmaking revolutionized the industry.",
      highlight:
        "Built the ski resort from scratch starting in 1954, creating a mountain town legacy!",
      icon: "🏔️",
    },
    {
      type: "program",
      name: "Killington Mountain School",
      description:
        "This private ski academy has produced numerous Olympic and World Cup athletes while providing a rigorous academic education. KMS combines world-class ski racing training with college-prep academics, creating well-rounded student-athletes.",
      highlight:
        "Alumni have won Olympic medals and World Championship titles!",
      icon: "🎓",
    },
    {
      type: "project",
      name: "Green Mountain Club",
      description:
        "Founded in 1910, GMC maintains Vermont's Long Trail - America's oldest long-distance hiking trail. This volunteer-driven organization preserves hiking access, maintains trails, and protects Vermont's mountain landscapes for future generations.",
      highlight:
        "The Long Trail inspired the creation of the Appalachian Trail!",
      icon: "🥾",
    },
  ],
  "sunday-river": [
    {
      type: "restaurant",
      name: "Sunday River Brewing Company",
      description:
        "A family-owned brewpub in Bethel serving house-crafted beers and elevated pub fare since 1995. This local gathering spot features Maine-sourced ingredients, live music, and an atmosphere that brings the community together year-round.",
      highlight:
        "Their Mollyockett IPA is named after a legendary Native American healer who lived in the region!",
      icon: "🍺",
    },
    {
      type: "hero",
      name: "Les Otten",
      description:
        "Visionary resort developer who transformed Sunday River from a small local hill into one of New England's premier destinations. Les's innovations in snowmaking and mountain operations set new industry standards while creating economic prosperity for the Bethel region.",
      highlight:
        "His snowmaking expertise earned Sunday River the nickname 'America's First Choice'!",
      icon: "💡",
    },
    {
      type: "store",
      name: "Bonnema Pot Shop",
      description:
        "A Bethel tradition since 1979, this artisan pottery studio and gallery showcases handcrafted ceramics, local art, and Maine-made gifts. The Bonnema family creates functional and decorative pottery that celebrates Maine's natural beauty.",
      highlight: "Every piece is handmade right in their Bethel studio!",
      icon: "🏺",
    },
    {
      type: "program",
      name: "Mahoosuc Land Trust",
      description:
        "Conserving the forests, farms, and natural areas of western Maine since 1989. MLT protects over 12,000 acres and maintains public trails, ensuring that Sunday River's stunning surroundings remain wild for future generations.",
      highlight:
        "Free public access to miles of hiking trails in conserved forests!",
      icon: "🌲",
    },
  ],
  mammoth: [
    {
      type: "restaurant",
      name: "Nik-N-Willys Pizza",
      description:
        "A Mammoth Lakes institution since 1999, serving New York-style pizza by the slice or pie. This local favorite uses fresh ingredients and has become the go-to spot for affordable, delicious food that fuels mountain adventures.",
      highlight: "Open late for those après-ski cravings!",
      icon: "🍕",
    },
    {
      type: "hero",
      name: "Dave McCoy",
      description:
        "Legendary founder of Mammoth Mountain who built the resort from a rope tow in 1942 into one of North America's premier destinations. Dave's vision, determination, and 68 years of leadership created a thriving mountain community and thousands of jobs in the Eastern Sierra.",
      highlight:
        "Lived to 104 years old and was still skiing at 99! A true mountain legend.",
      icon: "🏔️",
    },
    {
      type: "program",
      name: "Mammoth Lakes Foundation",
      description:
        "Supporting quality-of-life initiatives in Mammoth Lakes since 1983. This community foundation provides scholarships, funds youth programs, supports local nonprofits, and helps ensure Mammoth remains a vibrant year-round community.",
      highlight:
        "Has awarded over $5 million in scholarships and grants to local projects!",
      icon: "🎓",
    },
    {
      type: "store",
      name: "Footloose Sports",
      description:
        "A locally-owned outdoor gear shop since 1976, Footloose has been outfitting Eastern Sierra adventurers for nearly 50 years. Their knowledgeable staff and commitment to customer service make them a cornerstone of the Mammoth community.",
      highlight:
        "Local experts who know the mountains and can point you to the best conditions!",
      icon: "🥾",
    },
  ],
  "powder-mountain": [
    {
      type: "restaurant",
      name: "The Shooting Star Saloon",
      description:
        "Utah's oldest continuously operating saloon, located in nearby Huntsville since 1879. This authentic Western bar serves Star Burgers and cold beer in a historic setting with original fixtures and an incredible local atmosphere.",
      highlight:
        "The bar and mounted animal heads are the originals from 1879!",
      icon: "🍔",
    },
    {
      type: "hero",
      name: "Alvin F. Cobabe",
      description:
        "Founder of Powder Mountain who transformed his family's sheep ranch into a ski resort in 1972. Alvin's vision preserved the mountain's natural terrain and created recreational opportunities while honoring his family's ranching heritage in the Ogden Valley.",
      highlight:
        "His family has been shepherding in the Ogden Valley since the early 1900s!",
      icon: "🐑",
    },
    {
      type: "project",
      name: "Ogden Valley Trails",
      description:
        "A volunteer organization building and maintaining non-motorized trails throughout the Ogden Valley. These trails connect communities and provide year-round recreation while preserving the valley's rural character and natural beauty.",
      highlight:
        "Miles of free trails for hiking, biking, and cross-country skiing!",
      icon: "🚴",
    },
    {
      type: "store",
      name: "Eden Store",
      description:
        "A charming general store in Eden, Utah serving the community since 1945. This local gathering spot offers groceries, gifts, and homemade sandwiches while maintaining small-town character in the heart of the Ogden Valley.",
      highlight: "Famous for their sandwiches and friendly service!",
      icon: "🏪",
    },
  ],
  "taos-ski-valley": [
    {
      type: "restaurant",
      name: "Orlando's New Mexican Café",
      description:
        "A Taos institution since 1973, Orlando's serves authentic New Mexican cuisine in a vibrant atmosphere. Famous for their red and green chile, this family-run restaurant showcases the flavors and traditions that make Northern New Mexico special.",
      highlight: "When they ask 'red or green?' the right answer is 'Christmas' (both)!",
      icon: "🌶️",
    },
    {
      type: "hero",
      name: "Ernie Blake",
      description:
        "Visionary founder of Taos Ski Valley who discovered the perfect snow basin in 1954 and built one of America's most legendary ski resorts. Ernie's commitment to skiing excellence and preservation of the mountain's natural character created a unique destination that attracts skiers worldwide.",
      highlight:
        "Created a European-style ski village in the New Mexico mountains!",
      icon: "⛷️",
    },
    {
      type: "program",
      name: "Taos Pueblo Education",
      description:
        "Supporting education and cultural preservation at Taos Pueblo, a UNESCO World Heritage Site and living Native American community. These programs ensure that traditional knowledge, language, and customs are passed to future generations.",
      highlight:
        "Taos Pueblo has been continuously inhabited for over 1,000 years!",
      icon: "🏛️",
    },
    {
      type: "store",
      name: "Taos Book Shop",
      description:
        "An independent bookstore operating since 1947, Taos Book Shop is one of the oldest in the Southwest. This cultural landmark offers rare books, local authors, and serves as a gathering place for Taos's vibrant artistic community.",
      highlight: "A beloved literary landmark for over 75 years!",
      icon: "📚",
    },
  ],
  telluride: [
    {
      type: "restaurant",
      name: "Brown Dog Pizza",
      description:
        "A Telluride favorite since 1996, Brown Dog serves wood-fired pizza with creative toppings and locally-sourced ingredients. This casual spot embodies Telluride's laid-back mountain vibe while supporting local farms and producers.",
      highlight:
        "Their outdoor patio has some of the best views in downtown Telluride!",
      icon: "🍕",
    },
    {
      type: "hero",
      name: "Tomboy Bride - Harriet Backus",
      description:
        "Author of 'Tomboy Bride,' Harriet Fish Backus documented life in Telluride's remote mining camps in the early 1900s. Her memoir preserved the stories of the pioneering women who helped build mountain communities in Colorado's San Juan Mountains.",
      highlight:
        "Her book is a Colorado classic, chronicling life at 11,500 feet in the Tomboy Mine!",
      icon: "📖",
    },
    {
      type: "program",
      name: "Telluride Adaptive Sports",
      description:
        "Providing year-round adaptive recreation programs since 1988, this non-profit serves individuals with disabilities through skiing, snowboarding, cycling, and more. Their mission ensures that everyone can experience Telluride's incredible outdoor opportunities.",
      highlight:
        "Over 500 participants each year experience mountain adventures!",
      icon: "🎿",
    },
    {
      type: "store",
      name: "Between the Covers Bookstore",
      description:
        "An independent bookstore in the heart of Telluride since 1974. This cozy shop offers carefully curated selections, hosts author events, and serves as a cultural hub for the community's literary scene.",
      highlight:
        "One of Colorado's oldest independent bookstores still thriving!",
      icon: "📚",
    },
  ],
  "kicking-horse": [
    {
      type: "restaurant",
      name: "The Wolf's Den",
      description:
        "A beloved Golden, BC restaurant serving Canadian comfort food with stunning views of the Columbia River. This local gathering spot features fresh, locally-sourced ingredients and an atmosphere that brings the community together.",
      highlight: "Try their bison burger - a Rocky Mountain specialty!",
      icon: "🍔",
    },
    {
      type: "hero",
      name: "Oberto Oberti",
      description:
        "Vancouver architect who envisioned transforming the modest Whitetooth ski area into world-class Kicking Horse Mountain Resort. Oberto's design preserved the mountain's natural beauty while creating a destination that has become an economic driver for Golden.",
      highlight:
        "His vision turned a small local hill into Canada's fourth-highest vertical!",
      icon: "🏔️",
    },
    {
      type: "program",
      name: "Wildsight Golden",
      description:
        "A grassroots environmental organization protecting wildlife habitat and promoting conservation in the Columbia Valley since 1982. Wildsight engages the community in citizen science, habitat restoration, and environmental education.",
      highlight:
        "Protecting grizzly bears, caribou, and the Columbia Valley ecosystem!",
      icon: "🐻",
    },
    {
      type: "store",
      name: "Pedal & Spoke",
      description:
        "A community bike shop in Golden providing sales, service, and rentals since 2006. This locally-owned shop supports cycling culture in the Columbia Valley and helps maintain the region's extensive trail network.",
      highlight:
        "Expert advice on the best trails and routes around Golden!",
      icon: "🚴",
    },
  ],
  fernie: [
    {
      type: "restaurant",
      name: "The Curry Bowl",
      description:
        "A Fernie favorite serving authentic Indian and Thai cuisine since 2000. This family-run restaurant brings international flavors to the mountains while sourcing locally when possible and creating a welcoming atmosphere for all.",
      highlight: "The butter chicken is legendary among Fernie locals!",
      icon: "🍛",
    },
    {
      type: "hero",
      name: "Heiko Socher",
      description:
        "Austrian ski instructor who managed Fernie Snow Valley from 1973-1997 and transformed it into a world-class destination. Heiko's European expertise and dedication to customer service set new standards and established Fernie's reputation for incredible skiing.",
      highlight:
        "His legacy lives on in Fernie's culture of skiing excellence!",
      icon: "⛷️",
    },
    {
      type: "program",
      name: "Fernie Museum & Archives",
      description:
        "Preserving Fernie's rich history from coal mining to modern ski town. This community-run museum documents the town's resilience through fires, floods, and economic changes while celebrating the local heroes who built this mountain community.",
      highlight:
        "Learn about the famous Fernie Curse and how it was finally lifted in 1964!",
      icon: "🏛️",
    },
    {
      type: "store",
      name: "The Guides Hut",
      description:
        "A locally-owned ski and bike shop that's been outfitting Fernie adventurers since 1996. The staff are passionate locals who know the terrain and provide expert advice on where to find the best powder stashes.",
      highlight:
        "They'll point you to the secret spots the tourists don't know about!",
      icon: "🎿",
    },
  ],
  niseko: [
    {
      type: "restaurant",
      name: "Rakuichi Soba",
      description:
        "A traditional soba noodle shop in Hirafu serving handmade buckwheat noodles since 1974. This family-run restaurant embodies Japanese culinary tradition and uses locally-sourced ingredients to create authentic Hokkaido flavors.",
      highlight:
        "Watch the master make soba noodles by hand - a mesmerizing art form!",
      icon: "🍜",
    },
    {
      type: "hero",
      name: "Theodor von Lerch",
      description:
        "Austrian military officer who introduced skiing to Japan in 1911 and was the first recorded skier on Mount Yotei near Niseko. Von Lerch's legacy laid the foundation for Japan's skiing culture and Niseko's eventual rise as a world-class destination.",
      highlight:
        "Considered the 'Father of Skiing in Japan' - there's a statue honoring him in Joetsu!",
      icon: "🎖️",
    },
    {
      type: "program",
      name: "Niseko Green Farm",
      description:
        "An organic farm and educational center promoting sustainable agriculture in Hokkaido. They offer farm tours, workshops, and a restaurant showcasing the incredible produce grown in Niseko's volcanic soil.",
      highlight:
        "Niseko's volcanic soil produces some of Japan's best potatoes and vegetables!",
      icon: "🌾",
    },
    {
      type: "store",
      name: "Niseko Kimono Rental",
      description:
        "A cultural experience center where visitors can rent traditional kimono and yukata while learning about Japanese customs. This local business helps preserve traditional crafts while sharing Japanese culture with international visitors.",
      highlight:
        "Perfect for a unique photo op with Mount Yotei in the background!",
      icon: "👘",
    },
  ],
  livigno: [
    {
      type: "restaurant",
      name: "Bivio Restaurant",
      description:
        "A traditional Italian restaurant in Livigno serving authentic Valtellina cuisine since 1956. This family-run establishment showcases regional specialties like pizzoccheri and bresaola while maintaining recipes passed down through generations.",
      highlight:
        "Try the pizzoccheri - a traditional buckwheat pasta dish from this region!",
      icon: "🍝",
    },
    {
      type: "hero",
      name: "Livigno Smugglers",
      description:
        "For centuries, hardy mountain dwellers smuggled goods across the Swiss-Italian border through Livigno's high passes. These 'spalloni' (porters) carried tobacco, coffee, and other goods on their backs in dangerous conditions, shaping Livigno's independent character and duty-free status.",
      highlight:
        "Some smugglers carried loads exceeding 100 pounds across 9,000-foot passes!",
      icon: "🎒",
    },
    {
      type: "program",
      name: "Livigno Alpine Museum",
      description:
        "Preserving the history and culture of this unique alpine community. The museum showcases traditional farming tools, smuggling history, and the evolution from isolated farming village to world-class resort.",
      highlight:
        "Learn how this isolated valley maintained its unique culture for centuries!",
      icon: "🏛️",
    },
    {
      type: "store",
      name: "Latteria Livigno",
      description:
        "A local dairy producing traditional Livigno cheeses since the 1960s. This cooperative showcases alpine cheesemaking traditions and offers tastings of their award-winning casera and other regional specialties.",
      highlight:
        "The cheese is made from milk from cows that graze at over 6,000 feet elevation!",
      icon: "🧀",
    },
  ],
};

// Get spotlight based on week of year
export function getWeeklySpotlight(resortId: string): LocalSpotlight | null {
  const spotlights = localSpotlights[resortId];
  if (!spotlights || spotlights.length === 0) return null;

  // Get week number of the year (1-52)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek);

  // Rotate through spotlights based on week number
  const index = weekNumber % spotlights.length;
  return spotlights[index];
}
