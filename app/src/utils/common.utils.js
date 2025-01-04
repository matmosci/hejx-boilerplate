module.exports = {
    keyValueArraysToObject
};

function keyValueArraysToObject(keys, values) {
    return keys.reduce((acc, key, i) => {
        acc[key] = values[i];
        return acc;
    }, {});
};