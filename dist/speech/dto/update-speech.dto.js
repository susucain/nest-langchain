"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpeechDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_speech_dto_1 = require("./create-speech.dto");
class UpdateSpeechDto extends (0, mapped_types_1.PartialType)(create_speech_dto_1.CreateSpeechDto) {
}
exports.UpdateSpeechDto = UpdateSpeechDto;
//# sourceMappingURL=update-speech.dto.js.map