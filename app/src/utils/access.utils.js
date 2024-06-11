const Roles = require("../config/roles.config");

function isAccessToRole(access, posFromRight = 0) {
    return Boolean((access >> posFromRight) & 1);
};

// TODO create interface to generate user access with function below
function boolArrayToAccess(boolArr) {
    const binaryStr = boolArr.reduce((acc, val) => {
        return acc + (val ? "1" : "0");
    }, "");
    return parseInt(binaryStr, 2);
};

function accessToBoolArray(access) {
    const binaryStr = access.toString(2);
    return Array.from(binaryStr).map(bit => bit === '1');
};

function accessToRolesArray(access) {
    const arr = accessToBoolArray(access);
    const roles = [];
    for (let i = 0; i < arr.length; i++)
        if (arr[i])
            roles.push(Object.entries(Roles).find(e => e[1] === i)[0])
    return roles;
};

module.exports = { Roles, isAccessToRole, accessToRolesArray, boolArrayToAccess, accessToBoolArray };
