import { config } from '../config.js';
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits = config.fileserverHits + 1;
    next();
}
export function middlewareLogResponses(req, res, next) {
    res.on('finish', () => {
        console.log(res.statusCode);
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
