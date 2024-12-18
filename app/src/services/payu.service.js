const crypto = require('crypto');

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

async function generateOAuthToken() {
    const response = await fetch(`${global.config.PAYU.api_url}/pl/standard/user/oauth/authorize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${global.config.PAYU.client_id}&client_secret=${global.config.PAYU.client_secret}`
    });
    const token = await response.json();
    return token;
};

module.exports = { compare, generateOAuthToken };
