#!/usr/bin/env node

const xlsx = require('xlsx');
const ical = require('ical-generator');
const uniqBy = require('lodash.uniqby');

function safeString (str) {
	return str || '';
}

function cap (str) {
	str = safeString(str);
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

if (process.argv.length !== 3) {
	console.log('usage: <name of calendar>');
	console.log('\tprovide the xls file into stdin');
	console.log('\toutputs the iCal file to stdout');
	process.exit(1);
}

const name = process.argv[2];

function toCal (entries) {
	entries = entries.map(entry => ({
		start: new Date(`${entry[2]} ${entry[3]}`),
		end: new Date(`${entry[2]} ${entry[4]}`),
		location: `${cap(entry[5])} ${cap(entry[6])}`.trim(),
		summary: entry[8],
	}));

	entries = uniqBy(entries, entry =>
		`${entry.start.getTime()}-${entry.end.getTime()}`);

	const res = ical({
		name,
		domain: 'lieuwe.xyz',
		events: entries,
	}).toString();
	console.log(res);
}

function parse (buffer) {
	const workbook = xlsx.read(buffer, {
		type: 'buffer',
	});
	const sheet = workbook.Sheets[workbook.SheetNames[0]]
	const res = xlsx.utils.sheet_to_json(sheet, {
		header: 1,
	});

	const parsed = res.slice(4).filter(row => row.length >= 9);
	toCal(parsed);
}

const data = [];
process.stdin.on('data', blob => data.push(blob));
process.stdin.on('end', () => {
	const buffer = Buffer.concat(data);
	parse(buffer);
});
