function safeString (str) {
	return str || '';
}

function cap (str) {
	str = safeString(str);
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function validDate (date) {
	return !Number.isNaN(date.valueOf());
}

module.exports = {
	safeString,
	cap,
	validDate,
};
