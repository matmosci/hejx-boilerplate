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

module.exports = { compare };
