import phonesModel from "../model/phonesModel.js"
import { categoryMap } from "../util/categoryMap.js"

export const getProductsByCategory = async (category) => {
    return await categoryMap[category].find()
}

export const getPhonesByOptions = async (options) => {
    const query = {}

    Object.keys(options).forEach((key) => {
        const value = options[key]

            if (key === "price" && typeof value === "object") {
                query.price = {
                    $gte: value.min ?? 0,
                    $lte: value.max ?? Number.MAX_SAFE_INTEGER
                }

            } else if (key === "size" && Array.isArray(value)) {
                const sizeConditions = [];

                value.forEach(range => {
                    const trimmed = range.trim();

                    if (trimmed.startsWith("<")) {
                        const num = parseFloat(trimmed.replace(/[^\d.]/g, ""));

                        if (!isNaN(num)) {
                            sizeConditions.push({ "camera_and_display.size": { $lt: num } });
                        }
                    } else if (trimmed.startsWith(">")) {
                        const num = parseFloat(trimmed.replace(/[^\d.]/g, ""));

                        if (!isNaN(num)) {
                            sizeConditions.push({ "camera_and_display.size": { $gt: num} });
                        }
                    } else if (trimmed.includes("-")) {
                        const parts = trimmed.replace(/[^\d.-]/g, " ").split(" ").filter(Boolean);

                        const from = parseFloat(parts[0]);
                        const to = parseFloat(parts[2]); console.log(from, to)
                        if (!isNaN(from) && !isNaN(to)) {
                            sizeConditions.push({ "camera_and_display.size": { $gte: from, $lte: to } });
                        }
                    }
                });

                if (sizeConditions.length > 0) {
                    query["$or"] = sizeConditions;
                }



        } else if (Array.isArray(value)) {
            if (value.length > 0) {
                query[key] = { $in: value }
            }

        } else if (typeof value === "string" || typeof value === "number") {
            query[key] = value
        }
    })

    const products = await phonesModel.find(query)

    return products
}

export const getProductById = async (category, id) => {
    return await categoryMap[category].findById(id)
}
