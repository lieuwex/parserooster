#!/usr/bin/env node

const http = require('http');
const url = require('url');
const xlsx = require('xlsx');
const ical = require('ical-generator');
const uniqBy = require('lodash.uniqby');

if (process.argv.length < 5) {
	console.log(`usage: <name of calendar> <source URL of schedule> <destination for ics file>`);
	process.exit(1);
}

const name = process.argv[2];
const src = url.parse(process.argv[3]);
const dest = process.argv[4];

function toCal (entries) {
	entries = entries.map(entry => ({
		start: new Date(`${entry[2]} ${entry[3]}`),
		end: new Date(`${entry[2]} ${entry[4]}`),
		location: `${entry[5]} ${entry[6]}`,
		summary: entry[8],
	}));

	entries = uniqBy(entries, entry =>
		`${entry.start.getTime()}-${entry.end.getTime()}`);

	ical({
		name,
		domain: 'lieuwe.xyz',
		events: entries,
	}).saveSync(dest);
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

http.get(src, res => {
	const data = [];

	res.on('data', blob => data.push(blob));
	res.on('end', () => {
		const buffer = Buffer.concat(data);
		parse(buffer);
	});
})
