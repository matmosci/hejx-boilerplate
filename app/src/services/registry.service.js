const registry = require('../../data/items.json');

module.exports = {
    findByName,
    findByNameAndType,
};

// findByName
function findByName(name) {
    return registry.find(item => item.name === name);
}

/**
 * 
 * @param {string} name 
 * @param {string} type 
 * @returns {object}
 */
function findByNameAndType(name, type) {
    return registry.find(item => item.name === name && item.type === type);
};
