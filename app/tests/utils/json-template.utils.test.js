const jsonTemplateFillData = require("../../src/utils/json-template.utils");

describe("jsonTemplateFillData", () => {
    test("should replace placeholders with corresponding data values", () => {
        const template = {
            name: "{{ name }}",
            age: "{{ age }}",
            address: {
                city: "{{ city }}",
                zip: "{{ zip }}"
            }
        };
        const data = {
            name: "John Doe",
            age: 30,
            city: "New York",
            zip: "10001"
        };
        const result = jsonTemplateFillData(template, data);
        expect(result).toEqual({
            name: "John Doe",
            age: 30,
            address: {
                city: "New York",
                zip: "10001"
            }
        });
    });

    test("should handle nested objects and arrays", () => {
        const template = {
            user: {
                name: "{{ name }}",
                hobbies: ["{{ hobby1 }}", "{{ hobby2 }}"]
            }
        };
        const data = {
            name: "Jane Doe",
            hobby1: "Reading",
            hobby2: "Traveling"
        };
        const result = jsonTemplateFillData(template, data);
        expect(result).toEqual({
            user: {
                name: "Jane Doe",
                hobbies: ["Reading", "Traveling"]
            }
        });
    });

    test("should leave placeholders unchanged if no corresponding data is found", () => {
        const template = {
            name: "{{ name }}",
            age: "{{ age }}",
            address: {
                city: "{{ city }}",
                zip: "{{ zip }}"
            }
        };
        const data = {
            name: "John Doe"
        };
        const result = jsonTemplateFillData(template, data);
        expect(result).toEqual({
            name: "John Doe",
            age: "{{ age }}",
            address: {
                city: "{{ city }}",
                zip: "{{ zip }}"
            }
        });
    });

    test("should handle templates without placeholders", () => {
        const template = {
            name: "John Doe",
            age: 30
        };
        const data = {
            name: "Jane Doe",
            age: 25
        };
        const result = jsonTemplateFillData(template, data);
        expect(result).toEqual({
            name: "John Doe",
            age: 30
        });
    });

    test("should handle empty template and data", () => {
        const template = {};
        const data = {};
        const result = jsonTemplateFillData(template, data);
        expect(result).toEqual({});
    });
});