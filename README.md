parserooster
===

Script to convert [LIACS .xls room schedules](https://liacs.leidenuniv.nl/edu/bachelor/roosters/) to iCal files.

The script reads the spreadsheet file from stdin and it outputs iCal to stdout.
Required as arguments are the name of the calendar followed by one or more USIS/studyguide IDs to be included in the resulting calendar file.

Example usage
---

```
$ curl https://www.student.universiteitleiden.nl/binaries/content/assets/science/liacs/roosters/informatica/2019-2020/rooms-2019-2020.xls \
| ./index.js 'Computer science spring year 1' 4032CCGR6 >schedule.ics
```
