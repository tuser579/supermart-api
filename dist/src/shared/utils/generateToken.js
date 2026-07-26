"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jwt_config_1 = require("../config/jwt.config");
const generateTokens = (payload) => {
    const accessToken = jwt_config_1.jwtConfig.signAccessToken(payload);
    const refreshToken = jwt_config_1.jwtConfig.signRefreshToken(payload);
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
//# sourceMappingURL=generateToken.js.map