import slugify from "slugify";
import db from "../models/index.js";
const { School } = db;
export const generateSlug = async (name) => {
	let baseSlug = slugify(name, {
		lower: true,
		strict: true,
		trim: true,
	});
	let counter = 1;
	while (true) {
		const exist = await School.findOne({ slug: baseSlug });
		if (!exist) break;
		baseSlug = `${baseSlug}-${counter}`;
		counter++;
	}

	return baseSlug;
};
