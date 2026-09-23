// Storage contract: route handlers and business logic depend on these modules,
// while all persistence is handled by the server-only S3 adapter.
// AWS credentials are read only from server-side environment variables.
// Object prefixes: users/, email-index/, feedback/, sessions/,
// and submissions/<submitterUserId>/<targetUserId>.json.
export * from "./users";
export * from "./feedback";
export * from "./sessions";
