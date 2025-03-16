const fs = require('fs');
const path = require('path');
const { parse } = require("csv-parse/sync");

function toJson(filePath) {
    const filePathAbs = path.join(__dirname, `../../data/${filePath}`);
    const data = fs.readFileSync(filePathAbs);
    return parse(data, { columns: true, skip_empty_lines: true, relax_column_count: true });
};

function getProduct(csvProduct) {
    return {
        "name": csvProduct.name.toLowerCase().replace(/ /g, '-'),
        "title": csvProduct.name,
        "description": csvProduct.description,
        "imageUrl": csvProduct.image_0,
        "galleryUrls": [
            csvProduct.image_1,
            csvProduct.image_2,
            csvProduct.image_3,
            csvProduct.image_4,
        ],
        "parameters": [
            {
                "type": "quantity",
                "name": "quantity",
                "title": "Quantity",
                "value": 1,
                "min": 1,
                "max": Number(csvProduct.quantity)
            }
        ],
        "weight": Number(csvProduct.weight),
        "prices": [
            { "source": "example.csv", "id": Number(csvProduct.id), "qty": 1 }
        ]
    }
};

module.exports = { toJson, getProduct };