export const availableClasses = {
	Nursery: 1,
	LKG: 2,
	UKG: 3,
	"CLASS 1": 4,
	"CLASS 2": 5,
	"CLASS 3": 6,
	"CLASS 4": 7,
	"CLASS 5": 8,
	"CLASS 6": 9,
	"CLASS 7": 10,
	"CLASS 8": 11,
	"CLASS 9": 12,
	"CLASS 10": 13,
	"CLASS 11": 14,
	"CLASS 12": 15,
};

export const sortAvailableClasses = (classesArray) => {
	return classesArray.sort((a, b) => {
		const orderA = availableClasses?.[a];
		const orderB = availableClasses?.[b];
		return orderA - orderB;
	});
};


