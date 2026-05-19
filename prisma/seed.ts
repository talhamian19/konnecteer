import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.chatMessage.deleteMany();
  await prisma.rSVP.deleteMany();
  await prisma.watchParty.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.notification.deleteMany();

  // Seed Teams
  const teams = await Promise.all([
    prisma.team.create({ data: { name: "Argentina", code: "ARG", flag: "🇦🇷", group: "A" } }),
    prisma.team.create({ data: { name: "France", code: "FRA", flag: "🇫🇷", group: "A" } }),
    prisma.team.create({ data: { name: "Brazil", code: "BRA", flag: "🇧🇷", group: "B" } }),
    prisma.team.create({ data: { name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "B" } }),
    prisma.team.create({ data: { name: "Germany", code: "GER", flag: "🇩🇪", group: "C" } }),
    prisma.team.create({ data: { name: "Spain", code: "ESP", flag: "🇪🇸", group: "C" } }),
    prisma.team.create({ data: { name: "Portugal", code: "POR", flag: "🇵🇹", group: "D" } }),
    prisma.team.create({ data: { name: "Netherlands", code: "NED", flag: "🇳🇱", group: "D" } }),
  ]);

  const [argentina, france, brazil, england, germany, spain, portugal, netherlands] = teams;

  console.log("✅ Teams seeded");

  // Seed Venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: "Times Square Sports Complex",
        address: "1500 Broadway, New York, NY",
        city: "New York",
        country: "USA",
        latitude: 40.7580,
        longitude: -73.9855,
        type: "SPORTS_BAR",
        capacity: 300,
        atmosphereRating: 4.8,
        safetyRating: 4.5,
      },
    }),
    prisma.venue.create({
      data: {
        name: "Brooklyn Fan Zone",
        address: "550 Atlantic Ave, Brooklyn, NY",
        city: "New York",
        country: "USA",
        latitude: 40.6845,
        longitude: -73.9766,
        type: "FAN_ZONE",
        capacity: 500,
        atmosphereRating: 4.6,
        safetyRating: 4.7,
      },
    }),
    prisma.venue.create({
      data: {
        name: "Midtown Soccer Lounge",
        address: "245 E 49th St, New York, NY",
        city: "New York",
        country: "USA",
        latitude: 40.7549,
        longitude: -73.9693,
        type: "SPORTS_BAR",
        capacity: 150,
        atmosphereRating: 4.9,
        safetyRating: 4.8,
      },
    }),
  ]);

  console.log("✅ Venues seeded");

  // Seed Matches
  const now = new Date();
  const hoursFromNow = (h: number) => new Date(now.getTime() + h * 3600 * 1000);

  const matches = await Promise.all([
    prisma.match.create({
      data: {
        homeTeamId: argentina.id,
        awayTeamId: france.id,
        kickoffTime: hoursFromNow(2),
        venue: "Lusail Iconic Stadium",
        city: "Lusail",
        country: "Qatar",
        stage: "Group Stage",
        status: "UPCOMING",
      },
    }),
    prisma.match.create({
      data: {
        homeTeamId: brazil.id,
        awayTeamId: england.id,
        kickoffTime: hoursFromNow(5),
        venue: "Al Bayt Stadium",
        city: "Al Khor",
        country: "Qatar",
        stage: "Group Stage",
        status: "UPCOMING",
      },
    }),
    prisma.match.create({
      data: {
        homeTeamId: germany.id,
        awayTeamId: spain.id,
        kickoffTime: hoursFromNow(-1),
        venue: "Education City Stadium",
        city: "Al Rayyan",
        country: "Qatar",
        stage: "Group Stage",
        status: "LIVE",
        homeScore: 1,
        awayScore: 2,
      },
    }),
  ]);

  console.log("✅ Matches seeded");

  // Seed demo users
  const demoUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Carlos Rivera",
        email: "carlos@demo.com",
        username: "carlosriva",
        nationality: "Argentina",
        favoriteTeam: "Argentina",
        currentCity: "New York",
        languages: ["Spanish", "English"],
        goingAlone: false,
        ageRange: "25-34",
        vibeTags: ["hardcore_fan", "party_crowd"],
        bio: "Argentine football fanatic living in New York. Vamos Argentina! 🇦🇷",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Lima",
        email: "ana@demo.com",
        username: "analima",
        nationality: "Brazil",
        favoriteTeam: "Brazil",
        currentCity: "New York",
        languages: ["Portuguese", "English"],
        goingAlone: false,
        ageRange: "25-34",
        vibeTags: ["chill_viewer", "casual_fan"],
        bio: "Brazilian fan bringing the Samba vibes to NYC 🇧🇷",
      },
    }),
    prisma.user.create({
      data: {
        name: "Yuki Tanaka",
        email: "yuki@demo.com",
        username: "yukitanaka",
        nationality: "Japan",
        favoriteTeam: "Japan",
        currentCity: "New York",
        languages: ["Japanese", "English"],
        goingAlone: true,
        ageRange: "25-34",
        vibeTags: ["international_traveler", "casual_fan"],
        bio: "Japanese fan traveling to watch every match! 🇯🇵 ✈️",
      },
    }),
  ]);

  console.log("✅ Demo users seeded");

  // Seed Watch Parties
  await Promise.all([
    prisma.watchParty.create({
      data: {
        title: "Argentina Mega Watch Party 🇦🇷",
        description: "Join 200+ Argentina fans for the biggest watch party in the city!",
        matchId: matches[0].id,
        venueId: venues[0].id,
        creatorId: demoUsers[0].id,
        latitude: 40.758,
        longitude: -73.9855,
        address: "Times Square Sports Complex, New York",
        vibe: "PARTY",
        isPublic: true,
        maxAttendees: 300,
        currentAttendees: 187,
        safetyLevel: "SAFE",
        aiSummary: "High-energy Argentina fan crowd expected with 200+ attendees. Perfect for die-hard fans!",
        crowdNationalities: { Argentina: 60, USA: 20, Brazil: 8, Uruguay: 7, Other: 5 },
        popularityScore: 9.2,
        startTime: hoursFromNow(1),
        endTime: hoursFromNow(4),
      },
    }),
    prisma.watchParty.create({
      data: {
        title: "Brazil Fans — Samba Night 🇧🇷",
        description: "Chill vibes, caipirinhas, and pure Samba energy.",
        matchId: matches[1].id,
        creatorId: demoUsers[1].id,
        latitude: 40.7484,
        longitude: -73.9967,
        address: "Midtown Manhattan, New York",
        vibe: "CHILL",
        isPublic: true,
        maxAttendees: 80,
        currentAttendees: 52,
        safetyLevel: "SAFE",
        aiSummary: "Intimate Brazil fan gathering with amazing chill vibes.",
        crowdNationalities: { Brazil: 70, Portugal: 10, Colombia: 8, USA: 7, Other: 5 },
        popularityScore: 8.4,
        startTime: hoursFromNow(4),
        endTime: hoursFromNow(7),
      },
    }),
    prisma.watchParty.create({
      data: {
        title: "International Fan Zone 🌍",
        description: "Meet fans from 30+ countries! Most diverse watch party in the city.",
        creatorId: demoUsers[2].id,
        latitude: 40.7614,
        longitude: -73.9776,
        address: "Midtown East, New York",
        vibe: "INTERNATIONAL",
        isPublic: true,
        maxAttendees: 200,
        currentAttendees: 143,
        safetyLevel: "SAFE",
        aiSummary: "The most diverse watch party with fans from 30+ countries. AI translation available!",
        crowdNationalities: { Japan: 15, Morocco: 12, USA: 10, France: 8, Brazil: 7, Other: 48 },
        popularityScore: 9.5,
        startTime: hoursFromNow(25),
        endTime: hoursFromNow(28),
      },
    }),
  ]);

  console.log("✅ Watch parties seeded");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
