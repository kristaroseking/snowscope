export interface ResortHistory {
  founded: string;
  summary: string;
  funFact: string;
}

export const resortHistories: Record<string, ResortHistory> = {
  stowe: {
    founded: "1937",
    summary:
      "Stowe Mountain Resort opened in 1937 and quickly became known as 'The Ski Capital of the East.' The resort was pioneered by early ski enthusiasts who carved trails like the Bruce Trail (1933) and the famous Nose Dive (1934) on Vermont's highest peak, Mt. Mansfield. In 1940, Stowe became the first ski area in Vermont to install a chairlift - a single chair that remained in service until 1986.",
    funFact:
      "Stowe was the second ski area in all of New England to have a chairlift (after Gunstock in 1937), and the world's longest single chairlift famously broke down on its very first day of operation!",
  },
  "mad-river-glen": {
    founded: "1948",
    summary:
      "Mad River Glen opened to the public in 1948 with a unique single-person chairlift bringing skiers to the top of General Stark Mountain. The resort has maintained its old-school character by banning snowboarding and preserving its historic single chair lift. In 1995, a group of dedicated skiers purchased the property, making it the first cooperatively owned ski area in the United States.",
    funFact:
      "The famous 'Ski It If You Can' bumper sticker was created in 1984 and can be found on cars all over the country. The resort's single chair is the only one of its kind in the lower 48 states and is the fastest fixed grip lift in North America at 600 feet per minute!",
  },
  "jay-peak": {
    founded: "1957",
    summary:
      "Jay Peak was incorporated by Harold Haynes in 1955, purchased its first T-bar lift, and opened for skiing in January 1957. Many of the resort's ski trails were carved during the 1950s by Walter Foeger, an Austrian former racer who had previously trained the Spanish Olympic ski team. The resort is famous for its aerial tramway, the only one of its type in Vermont, which was built in 1966.",
    funFact:
      "Jay Peak's iconic tramway is the only one in Vermont and the only tram in the U.S. that allows dogs to ride to the summit! It takes about 10 minutes to reach the 4,000-foot summit, where on clear days you can see deep into Canada.",
  },
  sugarbush: {
    founded: "1958",
    summary:
      "Sugarbush opened on Christmas Day in 1958 by Damon and Sara Gadd along with Jack Murphy. The resort opened with the greatest vertical rise in the East, attracting Ivy-League educated skiers and quickly becoming a premier destination in Vermont's Mad River Valley. The Gadds sold the resort in 1977, and it has changed hands several times, with Alterra Mountain Company acquiring it in 2020.",
    funFact:
      "The resort's name 'Sugarbush' comes from the sugar maple trees that cover the mountainside, which are tapped each spring for Vermont's famous maple syrup production.",
  },
  killington: {
    founded: "1958",
    summary:
      "Originally called Killington Basin Ski Area, the resort opened on December 13, 1958, on Vermont's second highest mountain. The project was championed by Perry H. Merrill (Father of Vermont's State Parks) and developed by Preston Leete Smith. In the 1960s, Killington was an early adopter of snowmaking equipment and expanded at a pace 'well above industry standards,' eventually earning the nickname 'The Beast of the East.'",
    funFact:
      "Killington is the largest ski resort in the Eastern United States with 155 trails across six interconnected mountain peaks and is famous for having one of the longest ski seasons in the East, often opening in October and closing in June!",
  },
  "sunday-river": {
    founded: "1959",
    summary:
      "Sunday River first opened on December 19, 1959, as Sunday River Skiway. The area was developed by a small group of ski enthusiasts from neighboring Bethel, Maine, who climbed Locke Mountain to determine where the first lift and trails would be built. It started as a minor local ski hill with surface lifts, later adding the Barker Double as the first chair. The resort has since grown into one of the largest in the Northeast.",
    funFact:
      "Sunday River spans eight interconnected mountain peaks and is famous in New England for its extensive snowmaking capabilities, earning it the nickname 'America's First Choice' for reliable early-season skiing.",
  },
  mammoth: {
    founded: "1955",
    summary:
      "Mammoth Mountain was founded by Dave McCoy, a hydrographer for the Los Angeles Department of Water and Power who noticed the mountain consistently held more snow than others. McCoy set up a rope tow in 1942 where lift tickets cost 'a smile.' The resort received its Forest Service permit in 1953, and the first ski lift was built in 1955. McCoy ran the resort for an incredible 68 years before selling in 2005.",
    funFact:
      "Mammoth boasts the longest ski season in California - the record was set in 1994-95 when the resort stayed open for over 10 months, from October 8 to August 13! Dave McCoy lived to be 104 and was still racing bicycles competitively into his 70s.",
  },
  "powder-mountain": {
    founded: "1972",
    summary:
      "Powder Mountain opened on February 19, 1972, on land owned by founder Alvin F. Cobabe. The property's history traces back to the early 1900s when Alvin's father, Frederick, was a 15-year-old orphan who began tending camp for a local shepherd. Fred eventually bought the livestock company with its 8,000 acres in 1948, which his son later developed into a ski resort. The first season featured only the Sundown Lift, which was lit for night skiing.",
    funFact:
      "Netflix co-founder Reed Hastings acquired Powder Mountain in 2023 and now serves as CEO & Chairman. The resort boasts over 8,400 acres of terrain - more than any other ski resort in the United States!",
  },
  "taos-ski-valley": {
    founded: "1955",
    summary:
      "Taos Ski Valley was founded in 1955 by Ernie and Rhoda Blake, who discovered the perfect snow basin north of Wheeler Peak during a flight. Ernie had previously managed Santa Fe Ski Basin before creating his own resort. The resort's location was once the site of a small copper mining town called Twining in the 1800s. The first J-bar lift was installed in 1956, and the original run, Snakedance, opened in 1957.",
    funFact:
      "For decades, Taos was famous for its 'No Snowboarding' policy and expert-only reputation. The resort finally allowed snowboarders starting in 2008, ending a 50-year ban. Taos still maintains one of the highest percentages of expert terrain in North America at 51%!",
  },
  telluride: {
    founded: "1972",
    summary:
      "Telluride Ski Resort was founded by businessman Joe Zoline, who bought two ranches on the mountain in 1968. He hired Emile Allais, a French Olympic skier, to design the mountain layout. The resort officially opened on December 22, 1972, with five lifts and a day lodge. In 1978, Ron Allred and Jim Wells purchased the area and significantly expanded it, eventually installing the nation's first free gondola in 1996 connecting Telluride and Mountain Village.",
    funFact:
      "Telluride was a Wild West silver mining town in the 1880s where Butch Cassidy robbed his first bank in 1889! The town's name allegedly comes from 'To-Hell-You-Ride,' referring to the dangerous journey to reach it. Today, the free gondola is still the only one of its kind in North America.",
  },
  "kicking-horse": {
    founded: "2000",
    summary:
      "Kicking Horse Mountain Resort opened on December 8, 2000, becoming the first new resort to open in the Canadian Rockies in 25 years. It evolved from the smaller Whitetooth Ski Area, which the town of Golden sold in 1997 with 92.8% community approval. Vancouver architect Oberto Oberti led the transformation, and the expanded resort reopened with the Eagle Eye Gondola and Catamount chair. The resort was later acquired by Resorts of the Canadian Rockies in 2011-12.",
    funFact:
      "Kicking Horse has the fourth highest vertical drop in Canada at 4,133 feet and is famous for its champagne powder. The resort's name comes from the nearby Kicking Horse River, which was named after a horse kicked a pack off a explorer's back while crossing the river in 1858!",
  },
  fernie: {
    founded: "1962",
    summary:
      "Fernie Snow Valley Ski Resort officially opened on January 10, 1962, built with donated land from Galloway Lumber and an enthusiastic army of volunteers. In 1963, the resort opened with a handle tow, a rope tow, a T-Bar and a day lodge. Heiko Socher took over as manager in 1973 and expanded operations to seven days a week. When Heiko and Linda sold to Resorts of the Canadian Rockies in 1997, the name was changed to Fernie Alpine Resort.",
    funFact:
      "Fernie is legendary for its incredible snowfall - the area receives an average of 29 feet (9 meters) of light, dry powder annually! The town also has a famous curse: from 1904 to 1964, Fernie suffered numerous fires, floods, and explosions, allegedly due to a curse from a Ktunaxa chief whose family was mistreated by the town's founder.",
  },
  niseko: {
    founded: "1961",
    summary:
      "Skiing in Niseko dates back to 1912 when Austrian Lieutenant Colonel Theodor von Lerch became the first recorded skier in the area. The modern ski industry began with the Niseko Kogen Kanko lifts entering operation on December 17, 1961. The area expanded with the Alpen lifts in 1965, Annupuri Ski Resort in 1972, and Niseko Village in 1982. Electronic lift tickets were introduced in 1993, and by 1998 all lifts were accessible with a single pass, forming what's now known as Niseko United.",
    funFact:
      "Niseko receives an average of 50+ feet (15 meters) of powder annually - more than almost anywhere else on Earth! The resort is famous for 'Japow' (Japanese powder) and has become an international destination, with street signs in four languages. It's now the most popular ski destination in Asia!",
  },
  livigno: {
    founded: "1958",
    summary:
      "Livigno became a ski resort in 1953, with the first ski lift built in 1958. Before becoming a winter sports destination, Livigno was a small, isolated farming community largely cut off from the rest of Italy during harsh winters. The town has a unique history dating back centuries - in 1910, the Italian government officially declared the area tax-free, a status that traces back to the sixteenth century and was confirmed by Austria around 1840, then by Italy and the European Economic Community in 1960.",
    funFact:
      "Livigno is known as 'Little Tibet' due to its high elevation (6,000 feet) and is a duty-free zone where you can shop without paying taxes! The resort will host freestyle skiing and snowboarding events for the 2026 Winter Olympics in Milan-Cortina.",
  },
};
