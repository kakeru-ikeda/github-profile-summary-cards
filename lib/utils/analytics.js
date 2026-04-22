"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAnalytics = void 0;
const crypto_1 = __importDefault(require("crypto"));
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;
/**
 * Generates a consistent client_id based on the username.
 * If no username is provided, it generates a random UUID.
 *
 * @param {string} [username] - The username to hash.
 * @return {string} The generated client ID.
 */
const getClientId = (username) => {
    if (!username)
        return crypto_1.default.randomUUID();
    return crypto_1.default.createHash('sha256').update(username).digest('hex');
};
// ...
/**
 * Sends an event to GA4 via the Measurement Protocol.
 * Accepts headers to extract user-specific data (IP and User-Agent)
 * provided by the Vercel Edge Network.
 *
 * @param {string} eventName - The name of the event.
 * @param {Record<string, any>} [params] - Event parameters.
 * @param {IncomingHttpHeaders} [headers] - Request headers.
 */
function sendAnalytics(eventName_1) {
    return __awaiter(this, arguments, void 0, function* (eventName, params = {}, headers // Pass Vercel request headers here (plain object)
    ) {
        var _a;
        // Only execute in Vercel environment with valid credentials
        if (!process.env.VERCEL || !GA_MEASUREMENT_ID || !GA_API_SECRET)
            return;
        // Destructure to remove sensitive PII (username) from the final payload
        const { username } = params, cleanParams = __rest(params, ["username"]);
        const clientId = getClientId(username);
        // Extract user IP and User-Agent from Vercel-injected headers
        // Vercel headers are plain objects (string | string[] | undefined)
        const forwardedFor = headers === null || headers === void 0 ? void 0 : headers['x-forwarded-for'];
        const ip = ((_a = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)) === null || _a === void 0 ? void 0 : _a.split(',')[0]) || '';
        const userAgent = headers === null || headers === void 0 ? void 0 : headers['user-agent'];
        const ua = Array.isArray(userAgent) ? userAgent[0] : userAgent || '';
        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
        const payload = {
            client_id: clientId,
            // GA4 Measurement Protocol supports top-level overrides for UA and IP
            user_agent: ua,
            ip_override: ip,
            events: [
                {
                    name: eventName,
                    params: Object.assign(Object.assign({}, cleanParams), { 
                        // Use provided session_id or fallback to a timestamp-based ID to ensure session separation
                        session_id: cleanParams.session_id || Date.now().toString(), engagement_time_msec: 100 })
                }
            ]
        };
        try {
            const response = yield fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                // Native fetch timeout implementation available in Node.js 18+
                signal: AbortSignal.timeout(2000)
            });
            if (!response.ok) {
                const errorText = yield response.text();
                console.error('GA4 Error Response:', errorText);
            }
        }
        catch (e) {
            // Log error but do not throw to prevent breaking the main application flow
            console.error('Analytics error (ignored):', e instanceof Error ? e.message : e);
        }
    });
}
exports.sendAnalytics = sendAnalytics;
