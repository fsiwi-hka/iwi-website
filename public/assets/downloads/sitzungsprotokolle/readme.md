# Structure of public/assets/downloads/sitzungsprotokolle #

> The following rules must be strictly adhered to so that `/pages/api/ sitzungsprotokolle.js` can read the files correctly and they are rendered correctly on the respective page!

## folder structure ##

sitzungsprotokolle/ <br>
├─  number_semester_year/<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYYY.pdf<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYYY.pdf<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYYY.pdf<br>
├─  number_semester_year/<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYY.pdf<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYY.pdf<br>
&nbsp;&nbsp;&nbsp;&nbsp;├─  X. Sitzungsprotokoll vom DD.MM.YYYY.pdf<br>


Each protocol must be stored in the folder corresponding to its semester.


## Naming of files and folders ##
The naming of files and folders must be strictly adhered to:

### Naming of folders ###
- **number** is important for correct sorting on the page. This is increased by one with each new semester (e.g., if SoSe24 has 01, 
  WiSe24/25 will have 02, etc.). 
  These are then sorted in descending order on the page so that the most recent semester is always at the top. The number itself is not displayed on the page.

- **semester** either 'Wintersemester' or 'Sommersemester'. This may be technically irrelevant, but should still be named uniformly.

- **year** is the year of the semester, e.g. 2024 (for the summer semester) or 2024-25 (for the winter semester).
IMPORTANT: The `-` is replaced by a ‘/’ in the script, as file names must not contain a `/`. So make sure to use the `-` between the two years of the winter semester. 

**Empty folders are not displayed on the page!**


### Naming of files ###
- The file name structure must always follow the following pattern: X. Sitzungsprotokoll vom DD.MM.YYYY.pdf
- X is the number of the session protocol (Sitzungsprotokoll) in the respective semester.
- files that don't have the file type `pdf` are ignored by the script, so make sure the file has this suffix.