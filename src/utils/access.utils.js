const Roles = {
    USER: 0,
    EMPLOYEE: 1,
    ORDERS_VIEW: 2,
    ORDERS_EDIT: 3,
    CUSTOMERS_VIEW: 4,
    CUSTOMERS_EDIT: 5,
    INDEXES_VIEW: 6,
    INDEXES_EDIT: 7,
    PRODUCTS_VIEW: 8,
    PRODUCTS_EDIT: 9,
    DESIGNS_VIEW: 10,
    DESIGNS_EDIT: 11,
};

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
