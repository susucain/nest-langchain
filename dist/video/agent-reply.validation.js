"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAgentFinalReply = assertAgentFinalReply;
function assertAgentFinalReply(replyText) {
    if (!replyText.trim()) {
        throw new Error('Agent stream ended without a final text reply');
    }
}
//# sourceMappingURL=agent-reply.validation.js.map