"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwtFunctions_1 = require("../utils/jwtFunctions");
function authenticate(req, res, next) {
    const cookieAuthToken = req.cookies.token;
    if (!cookieAuthToken) {
        return res.status(401).json({ error: 'User Unauthorized.', success: false });
    }
    const data = (0, jwtFunctions_1.verifyToken)(cookieAuthToken);
    if (data.success) {
        req.userId = data.userId;
        req.username = data.username;
        req.email = data.email;
        return next();
    }
    if (!data.success && data.jwtExpire) {
        console.log("JWT Expired - Clearing cookie");
        res.clearCookie("token");
        res.clearCookie("authenticate");
        return res.status(400).json({ error: "Jwt Expired", success: false });
    }
    return res.status(400).json({ error: "Session expired.", success: false });
}
exports.authenticate = authenticate;
