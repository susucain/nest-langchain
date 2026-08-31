export function assertAgentFinalReply(replyText: string): void {
  if (!replyText.trim()) {
    throw new Error('Agent stream ended without a final text reply');
  }
}
