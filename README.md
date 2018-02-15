parserooster
===

Script to parse [LIACS schedules](https://liacs.leidenuniv.nl/edu/bachelor/roosters/).

Example usage
---

```
$ curl https://www.student.universiteitleiden.nl/binaries/content/assets/science/liacs/roosters/zalen-inf-1e-jaar-voorjaar-17-18.xls \
| node index.js 'Informatica voorjaar 1e jaar' >schedule.ics
```
