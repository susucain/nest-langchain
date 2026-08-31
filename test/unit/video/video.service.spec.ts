import { assertAgentFinalReply } from '../../../src/video/agent-reply.validation';

describe('assertAgentFinalReply', () => {
  it('rejects a stream that has no final assistant text', () => {
    expect(() => assertAgentFinalReply('')).toThrow(
      'Agent stream ended without a final text reply',
    );
  });

  it('accepts a non-empty final assistant reply', () => {
    expect(() => assertAgentFinalReply('  已为你整理完成。  ')).not.toThrow();
  });
});
