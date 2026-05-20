import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding V2 database...");

  // Clear existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatMember.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.tagAlongRequest.deleteMany();
  await prisma.talkAlongRequest.deleteMany();
  await prisma.eventAttendance.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.eventHashtag.deleteMany();
  await prisma.tagAlongHashtag.deleteMany();
  await prisma.talkAlongHashtag.deleteMany();
  await prisma.eventMedia.deleteMany();
  await prisma.boostedEvent.deleteMany();
  await prisma.report.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.tagAlongPost.deleteMany();
  await prisma.talkAlongPost.deleteMany();
  await prisma.event.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hash = await bcrypt.hash("password123", 12);
  const [alex, priya, marcus] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@konnecteer.com",
        username: "alexr",
        passwordHash: hash,
        bio: "Event organizer & connector. Always down for new experiences.",
        location: "New York City",
        isVerified: true,
        image: "https://i.pravatar.cc/150?img=11",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya@konnecteer.com",
        username: "priyasharma",
        passwordHash: hash,
        bio: "Tech & fitness enthusiast. Love hiking and hackathons.",
        location: "San Francisco",
        isVerified: true,
        image: "https://i.pravatar.cc/150?img=23",
      },
    }),
    prisma.user.create({
      data: {
        name: "Marcus Thompson",
        email: "marcus@konnecteer.com",
        username: "marcust",
        passwordHash: hash,
        bio: "Music producer and concert lover. Always at shows.",
        location: "Los Angeles",
        image: "https://i.pravatar.cc/150?img=52",
      },
    }),
  ]);

  // Create hashtags
  const tagNames = ["networking", "outdoor", "music", "fitness", "tech", "food", "travel", "art", "community", "hiking"];
  const hashtags: Record<string, { id: string }> = {};
  for (const tag of tagNames) {
    hashtags[tag] = await prisma.hashtag.create({
      data: { tag, useCount: Math.floor(Math.random() * 100) + 5 },
    });
  }

  // Create events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Rooftop Networking Night",
        description: "Connect with founders, builders, and creatives at NYC's hottest rooftop venue. Drinks, music, and real conversations.",
        hostId: alex.id,
        location: "230 Fifth Ave Rooftop, New York",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        category: "NETWORKING",
        isFree: false,
        price: 25,
        maxAttendees: 100,
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        status: "ACTIVE",
        rankScore: 95,
        isBoosted: true,
        boostExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        viewCount: 342,
      },
    }),
    prisma.event.create({
      data: {
        title: "Morning Trail Run — Griffith Park",
        description: "5K scenic trail run through Griffith Park. All fitness levels welcome! We finish with coffee at a nearby cafe.",
        hostId: priya.id,
        location: "Griffith Park, Los Angeles",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        category: "FITNESS",
        isFree: true,
        maxAttendees: 30,
        coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
        status: "ACTIVE",
        rankScore: 78,
        viewCount: 156,
      },
    }),
    prisma.event.create({
      data: {
        title: "Underground Music Showcase",
        description: "4 emerging artists performing live jazz, indie, and electronic. Limited tickets — an intimate 80-person venue in Brooklyn.",
        hostId: marcus.id,
        location: "The Lot Radio, Brooklyn NY",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        category: "MUSIC",
        isFree: false,
        price: 15,
        maxAttendees: 80,
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
        status: "ACTIVE",
        rankScore: 82,
        viewCount: 210,
      },
    }),
    prisma.event.create({
      data: {
        title: "Street Food Festival",
        description: "30+ food vendors, live music, and local artisans. Free entry — just show up hungry!",
        hostId: alex.id,
        location: "Prospect Park, Brooklyn",
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: "FOOD",
        isFree: true,
        coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        status: "ACTIVE",
        rankScore: 65,
        viewCount: 420,
      },
    }),
    prisma.event.create({
      data: {
        title: "AI & Startups Hackathon",
        description: "24-hour hackathon. Build, pitch, win. $5K prize pool. Teams of 2-4. Food and Red Bull provided.",
        hostId: priya.id,
        location: "WeWork SOMA, San Francisco",
        startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        category: "TECH",
        isFree: false,
        price: 10,
        maxAttendees: 200,
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        status: "ACTIVE",
        rankScore: 88,
        viewCount: 534,
      },
    }),
  ]);

  // Link hashtags to events
  await prisma.eventHashtag.createMany({
    data: [
      { eventId: events[0].id, hashtagId: hashtags["networking"].id },
      { eventId: events[1].id, hashtagId: hashtags["fitness"].id },
      { eventId: events[1].id, hashtagId: hashtags["outdoor"].id },
      { eventId: events[2].id, hashtagId: hashtags["music"].id },
      { eventId: events[4].id, hashtagId: hashtags["tech"].id },
    ],
  });

  // Create event chats
  for (const event of events) {
    await prisma.chat.create({
      data: {
        type: "EVENT",
        eventId: event.id,
        members: { create: { userId: event.hostId, isAdmin: true } },
      },
    });
  }

  // Create attendances
  await prisma.eventAttendance.createMany({
    data: [
      { eventId: events[0].id, userId: priya.id },
      { eventId: events[0].id, userId: marcus.id },
      { eventId: events[1].id, userId: alex.id },
      { eventId: events[2].id, userId: priya.id },
      { eventId: events[4].id, userId: marcus.id },
    ],
  });

  // Create Tag Along posts
  const tagAlong1 = await prisma.tagAlongPost.create({
    data: {
      creatorId: priya.id,
      title: "Sunday sunrise hike — anyone?",
      description: "Casual 2-hour sunrise hike at Marin Headlands. Easy trail, gorgeous views. I have a car, can give 2 people a lift.",
      location: "Marin Headlands, CA",
      activity: "Hiking",
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      maxPeople: 4,
      category: "HIKE",
      vibeTags: ["early-bird", "chill", "nature-lover"],
      status: "ACTIVE",
      rankScore: 72,
    },
  });

  const tagAlong2 = await prisma.tagAlongPost.create({
    data: {
      creatorId: marcus.id,
      title: "Coffee & vinyl browsing Saturday morning",
      description: "Hitting a few record stores in the East Village then grabbing brunch. Looking for people who love music and good coffee.",
      location: "East Village, New York",
      activity: "Coffee & Shopping",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      maxPeople: 3,
      category: "MUSIC",
      vibeTags: ["music-lover", "chill", "city-explorer"],
      status: "ACTIVE",
      rankScore: 55,
    },
  });

  // Create tag along chats
  await prisma.chat.create({
    data: {
      type: "TAG_ALONG",
      tagAlongPostId: tagAlong1.id,
      members: { create: { userId: priya.id, isAdmin: true } },
    },
  });
  await prisma.chat.create({
    data: {
      type: "TAG_ALONG",
      tagAlongPostId: tagAlong2.id,
      members: { create: { userId: marcus.id, isAdmin: true } },
    },
  });

  // Create Talk Along posts
  const talkAlong1 = await prisma.talkAlongPost.create({
    data: {
      creatorId: alex.id,
      title: "What's the best way to find community in a new city?",
      description: "I just moved to NYC and struggling to meet genuine people outside of work. Would love to hear strategies from others who've navigated this.",
      topic: "Life Advice",
      status: "ACTIVE",
      memberCount: 1,
      rankScore: 85,
    },
  });

  const talkAlong2 = await prisma.talkAlongPost.create({
    data: {
      creatorId: priya.id,
      title: "Is building in public worth it for indie hackers?",
      description: "I've been building in public for 3 months. Pros: accountability, feedback, followers. Cons: competition, distraction. Thoughts?",
      topic: "Entrepreneurship",
      status: "ACTIVE",
      memberCount: 1,
      rankScore: 91,
    },
  });

  // Create talk along chats
  await prisma.chat.create({
    data: {
      type: "TALK_ALONG",
      talkAlongPostId: talkAlong1.id,
      members: { create: { userId: alex.id, isAdmin: true } },
    },
  });
  await prisma.chat.create({
    data: {
      type: "TALK_ALONG",
      talkAlongPostId: talkAlong2.id,
      members: { create: { userId: priya.id, isAdmin: true } },
    },
  });

  // Create private chat between alex and priya
  await prisma.chat.create({
    data: {
      type: "PRIVATE",
      members: {
        create: [
          { userId: alex.id },
          { userId: priya.id },
        ],
      },
      messages: {
        create: [
          { senderId: alex.id, content: "Hey Priya! Loved your talk at the hackathon 👋" },
          { senderId: priya.id, content: "Thanks Alex! Great to connect. Are you going to the rooftop event?" },
        ],
      },
    },
  });

  console.log("✅ Seeded:");
  console.log(`  👥 3 users (email: alex@konnecteer.com, priya@konnecteer.com, marcus@konnecteer.com — pw: password123)`);
  console.log(`  🎉 ${events.length} events`);
  console.log(`  🏃 2 tag alongs`);
  console.log(`  💬 2 talk alongs`);
  console.log(`  #️⃣  ${tagNames.length} hashtags`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
