const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL || '/api/v1';

    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/reviews(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        // If we want to revoke for non-admins to certain routes, we could check req.originalUrl
        // For now, if req is to an admin route we can revoke
        const adminRegex = /\/api\/v1\/users(.*)/; // example
        // We will keep it simple. Only allow if valid token.
        return false;
    }
    return false;
}

module.exports = authJwt;
