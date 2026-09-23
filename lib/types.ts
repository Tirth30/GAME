export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Pick<User, "id" | "name">;

// Deliberately contains no submitter identity or identifying metadata.
export type Feedback = {
  id: string;
  targetUserId: string;
  pro: string;
  con: string;
  comment?: string;
  createdAt: string;
};

export type Session = { id: string; userId: string; expiresAt: string };
export type SubmissionRecord = { submitted: true; createdAt: string };
