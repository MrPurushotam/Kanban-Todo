import { NextFunction, Request, Response } from "express";

const aiRateLimitWindowMs = 60 * 60 * 1000;
const aiMaxRequests = 5;

const aiIpMap = new Map<string, { count: number; firstRequest: number }>();

export function aiPromptRateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || "";
    const now = Date.now();

    let entry = aiIpMap.get(ip);
    if (!entry) {
        entry = { count: 1, firstRequest: now };
        aiIpMap.set(ip, entry);
        return next();
    }

    if (now - entry.firstRequest > aiRateLimitWindowMs) {
        entry.count = 1;
        entry.firstRequest = now;
        return next();
    }

    entry.count += 1;
    if (entry.count > aiMaxRequests) {
        return res.status(429).json({ message: "AI prompt rate limit exceeded. Please try again later." });
    }
    next();
}