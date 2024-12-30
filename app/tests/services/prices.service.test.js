const mockPrices = [
    { id: 1, price: 10 },
    { id: 2, price: [[1, 10], [10, 8], [100, 5]] },
    { id: 3, price: { 1: 10, 10: 8, 100: 5 } }
];

jest.mock("../../data/prices.json", () => mockPrices);

const { getPrice } = require("../../src/services/prices.service");

describe("getPrice", () => {
    test("should return the price for a given id and quantity when price is a number", () => {
        const price = getPrice(1, 5);
        expect(price).toBe(10);
    });

    test("should return the price for a given id and quantity when price is an array", () => {
        const price1 = getPrice(2, 5);
        const price2 = getPrice(2, 10);
        const price3 = getPrice(2, 100);
        expect(price1).toBe(10);
        expect(price2).toBe(8);
        expect(price3).toBe(5);
    });

    test("should return the price for a given id and quantity when price is an object", () => {
        const price1 = getPrice(3, 5);
        const price2 = getPrice(3, 10);
        const price3 = getPrice(3, 100);
        expect(price1).toBe(10);
        expect(price2).toBe(8);
        expect(price3).toBe(5);
    });

    test("should return null if the id does not exist", () => {
        const price = getPrice(4, 5);
        expect(price).toBeNull();
    });

    test("should return null if the quantity does not match any price range", () => {
        const price = getPrice(2, 0);
        expect(price).toBeNull();
    });
});