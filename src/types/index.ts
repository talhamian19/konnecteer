export type VibeTag =
  | "hardcore_fan"
  | "casual_fan"
  | "party_crowd"
  | "chill_viewer"
  | "international_traveler"
  | "family_friendly";

export type PartyVibe = "HARDCORE" | "CASUAL" | "PARTY" | "FAMILY" | "CHILL" | "INTERNATIONAL";
export type SafetyLevel = "SAFE" | "MODERATE" | "CAUTION";
export type MatchStatus = "UPCOMING" | "LIVE" | "FINISHED" | "POSTPONED";
export type RSVPStatus = "GOING" | "MAYBE" | "NOT_GOING";
export type NotificationType =
  | "MATCH_REMINDER"
  | "WATCH_PARTY_ALERT"
  | "AI_RECOMMENDATION"
  | "CHAT_UPDATE"
  | "RSVP_CONFIRMATION"
  | "FRIEND_REQUEST"
  | "PARTY_CANCELLED";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  username: string | null;
  bio: string | null;
  nationality: string | null;
  favoriteTeam: string | null;
  currentCity: string | null;
  languages: string[];
  goingAlone: boolean;
  ageRange: string | null;
  vibeTags: string[];
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string | null;
  group: string | null;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: Date;
  venue: string;
  city: string;
  country: string;
  stage: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  watchPartiesCount?: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
  capacity: number | null;
  imageUrl: string | null;
  atmosphereRating: number | null;
  safetyRating: number | null;
}

export interface WatchParty {
  id: string;
  title: string;
  description: string | null;
  match?: Match | null;
  venue?: Venue | null;
  creator: Pick<UserProfile, "id" | "name" | "image" | "username">;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  vibe: PartyVibe;
  isPublic: boolean;
  maxAttendees: number | null;
  currentAttendees: number;
  safetyLevel: SafetyLevel;
  aiSummary: string | null;
  crowdNationalities: Record<string, number> | null;
  popularityScore: number;
  imageUrl: string | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  rsvps?: RSVPWithUser[];
}

export interface RSVPWithUser {
  id: string;
  status: RSVPStatus;
  user: Pick<UserProfile, "id" | "name" | "image" | "username">;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: Pick<UserProfile, "id" | "name" | "image" | "username" | "nationality">;
  matchId: string | null;
  watchPartyId: string | null;
  translatedContent: Record<string, string> | null;
  isPinned: boolean;
  isMeetup: boolean;
  emoji: string | null;
  replyTo?: ChatMessage | null;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: Date;
}

export interface AIRecommendation {
  watchPartyId: string;
  matchScore: number;
  reasons: string[];
  aiSummary: string;
  suggestedAction: string;
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  type: "watch_party" | "venue" | "fan_zone";
  label: string;
  data: WatchParty | Venue;
  popularityScore?: number;
}

export interface FilterOptions {
  nationality?: string;
  vibe?: PartyVibe;
  maxDistance?: number;
  minAttendees?: number;
  maxAttendees?: number;
  safetyLevel?: SafetyLevel;
  isGoingAlone?: boolean;
}
