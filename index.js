#!/usr/bin/env node

const xlsx = require('xlsx');
const ical = require('ical-generator');
const _ = require('lodash');
const { cap, validDate } = require('./util.js');

if (process.argv.length < 4) {
	console.log('usage: <name of calendar> <usis IDs...>');
	console.log('\tprovide the xls file into stdin');
	console.log('\toutputs the iCal file to stdout');
	process.exit(1);
}

const name = process.argv[2];
const usisIDs = process.argv.slice(3);

function toCal (entries) {
	entries = _.chain(entries)
		.map(entry => {
			const teacher = (entry[11] || '').trim();
			return {
				start: new Date(`${entry[3]} ${entry[4]}`),
				end: new Date(`${entry[3]} ${entry[5]}`),
				location: `${cap(entry[6])} ${cap(entry[7])}`.trim(),
				usisID: entry[8],
				summary: entry[9],
				description: teacher ? `Teacher: ${entry[11]}` : '',
			};
		})
		.filter(({ start, usisID }) => {
			return usisIDs.includes(usisID) && validDate(start);
		})
		.groupBy(entry =>
			`${entry.usisID},${entry.start.getTime()},${entry.end.getTime()}`
		)
		.mapValues(values => {
			const obj = values[0];
			for (const val of values.slice(1)) {
				obj.location += `, ${val.location}`;
			}
			return obj;
		})
		.values()
		.value();

	const cal = ical({
		name,
		domain: 'lieuwe.xyz',
		events: entries,
	});
	return cal.toString();
}

function parse (buffer) {
	const workbook = xlsx.read(buffer, {
		type: 'buffer',
	});
	const sheet = workbook.Sheets[workbook.SheetNames[0]]
	const res = xlsx.utils.sheet_to_json(sheet, {
		header: 1,
	});

	const parsed = res.filter(row => row.length >= 9);
	return toCal(parsed);
}

const data = [];
process.stdin.on('data', blob => data.push(blob));
process.stdin.on('end', () => {
	const buffer = Buffer.concat(data);
	const str = parse(buffer);
	console.log(str);
});
