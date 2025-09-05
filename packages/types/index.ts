export type Role = 'PARTICIPANT' | 'MODERATOR' | 'PRESENTER' | 'OWNER';

export interface JoinEventPayload {
  eventSlug: string;
  role?: Role;
  displayName?: string;
}

export interface ClientToServerEvents {
  joinEvent: (payload: JoinEventPayload) => void;

  // Q&A
  submitQuestion: (payload: { sessionId: string; text: string }) => void;
  upvoteQuestion: (payload: { questionId: string }) => void;
  moderateQuestion: (payload: { questionId: string; status: 'APPROVED' | 'HIDDEN' }) => void;

  // Polls
  startPoll: (payload: { pollId: string }) => void;
  stopPoll: (payload: { pollId: string }) => void;
  submitPollResponse: (payload: { pollId: string; responseData: any }) => void;
}

export interface ServerToClientEvents {
  eventJoined: (payload: { event: any; user: any }) => void;
  error: (payload: { message: string }) => void;

  // Q&A
  newQuestion: (question: any) => void;
  questionUpdated: (question: any) => void;

  // Polls
  pollStarted: (poll: any) => void;
  pollResultsUpdated: (payload: { pollId: string; results: any }) => void;
  pollStopped: (poll: any) => void;
}
