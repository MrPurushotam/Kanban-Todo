import { Request, Response, NextFunction } from "express";

const genericRateLimitWindowMs = 5 * 60 * 1000;
const genericMaxRequests = 100;

const genericIpMap = new Map<string, { count: number; firstRequest: number }>();

export function genericRateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || "";
    const now = Date.now();

    let entry = genericIpMap.get(ip);
    if (!entry) {
        entry = { count: 1, firstRequest: now };
        genericIpMap.set(ip, entry);
        return next();
    }

    if (now - entry.firstRequest > genericRateLimitWindowMs) {
        entry.count = 1;
        entry.firstRequest = now;
        return next();
    }

    entry.count += 1;
    if (entry.count > genericMaxRequests) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    next();
}