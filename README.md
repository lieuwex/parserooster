parserooster
===

Script to convert [LIACS .xls room schedules](https://liacs.leidenuniv.nl/edu/bachelor/roosters/) to iCal files.

The script reads the spreadsheet file from stdin and it outputs iCal to stdout.

Example usage
---

```
$ curl https://www.student.universiteitleiden.nl/binaries/content/assets/science/liacs/roosters/zalen-inf-1e-jaar-voorjaar-17-18.xls \
| ./index.js 'Computer science spring year 1' >schedule.ics
```
