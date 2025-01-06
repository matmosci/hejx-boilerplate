module.exports = function jsonTemplateFillData(jsonTemplate, data) {
    const regex = /{{\s*(.*?)\s*}}/g;
    const json = structuredClone(jsonTemplate);

    for (const key in json) {
        if (typeof json[key] === "object")
            json[key] = jsonTemplateFillData(json[key], data);
        else if (typeof json[key] === "string" && json[key].match(regex))
            json[key] = data[key] ?? json[key];
    }

    return json;
};

// TODO
// ✕ should handle nested objects and arrays