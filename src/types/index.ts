import type {
  User,
  Event,
  EventAttendance,
  EventMedia,
  EventHashtag,
  Hashtag,
  TagAlongPost,
  TagAlongRequest,
  TalkAlongPost,
  TalkAlongRequest,
  Chat,
  ChatMessage,
  ChatMember,
  Ticket,
  Payment,
  Notification,
} from "@prisma/client";

export type {
  User,
  Event,
  TagAlongPost,
  TalkAlongPost,
  Chat,
  ChatMessage,
  Notification,
  Ticket,
  Payment,
};

// Extended types with relations
export type UserProfile = User & {
  hostedEvents?: Event[];
  attendances?: EventAttendance[];
  _count?: { hostedEvents: number; attendances: number; tagAlongPosts: number; talkAlongPosts: number };
};

export type EventWithDetails = Event & {
  host: User;
  media?: EventMedia[];
  attendances?: (EventAttendance & { user: User })[];
  hashtags?: (EventHashtag & { hashtag: Hashtag })[];
  _count?: { attendances: number };
};

export type TagAlongWithDetails = TagAlongPost & {
  creator: User;
  requests?: (TagAlongRequest & { user: User })[];
  _count?: { requests: number };
};

export type TalkAlongWithDetails = TalkAlongPost & {
  creator: User;
  requests?: (TalkAlongRequest & { user: User })[];
  _count?: { requests: number };
};

export type ChatWithDetails = Chat & {
  members?: (ChatMember & { user: User })[];
  messages?: (ChatMessage & { sender: User })[];
  event?: Event | null;
  tagAlong?: TagAlongPost | null;
  talkAlong?: TalkAlongPost | null;
  _count?: { messages: number };
};

export type MessageWithSender = ChatMessage & {
  sender: User;
  replyTo?: (ChatMessage & { sender: User }) | null;
};

export type TicketWithEvent = Ticket & {
  event: Event & { host: User };
  payment?: Payment | null;
};

// Feed item union
export type FeedItem =
  | { type: "event"; data: EventWithDetails }
  | { type: "tagAlong"; data: TagAlongWithDetails }
  | { type: "talkAlong"; data: TalkAlongWithDetails };
