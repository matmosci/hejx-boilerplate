const crypto = require('crypto');

let oAuthToken = null;

async function request(config) {
    const response = await fetch(config.url, {
        method: config.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getOAuthToken()}`
        },
        body: JSON.stringify(config.body)
    });
    if (response.status === 401) {
        await getOAuthToken(true);
        return request(config);
    };
    return response.json();
};

async function getOAuthToken(force = false) {
    if (!oAuthToken || force) oAuthToken = (await generateOAuthToken()).access_token;
    return oAuthToken;
};

async function generateOAuthToken() {
    const response = await fetch(`${global.config.PAYU.api_url}/pl/standard/user/oauth/authorize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${global.config.PAYU.client_id}&client_secret=${global.config.PAYU.client_secret}`
    });
    return response.json();
};

function compare(object) {
    const incoming_signature = signatureHeaderToObject(object.signature_header).signature;
    const expected_signature = crypto.createHash('md5').update(object.json + object.second_key).digest('hex');
    return incoming_signature === expected_signature;
};

function signatureHeaderToObject(signatureHeader) {
    return signatureHeader.split(";").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
    }, {});
};

module.exports = { request, compare };
