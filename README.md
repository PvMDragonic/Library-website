<h1 align="center">Web Library Project 📚</h1>
<p align="center">A fullstack application for storing, cataloging and reading .pdf and .epub files in the browser.</p>

## About
Basically, this is "Google Books at home".

### History
This came to be from a bootcamp on the basics of web development using React and NodeJS when I got an intership during my final year at university. Too bad I was hired late and only arrived at the very last day of the bootcamp, so all I was left with was a very basic "completed" project (comprised of a simplistic GUI to execute the basic CRUD actions) which I understood almost nothing about, seeing as I had no React knowledge and only basic experience with web development overall.

Later, then, I decided to smooth out the project’s rough edges while studying React, and ~~the rest is history~~ HOLY MOLY, THANKFULLY GIT REBASE IS A THING, or else this would've run for a Guines entry on the world's biggest spaghetti! 

## Features
- Responsive desktop and mobile designs;
- Light and dark color mode selection option;
- English and Portuguese language selection option;
- Homepage with book cards for each saved book;
- Book info displayed on each card, including cover and file type;
- Searchbar for title-based searches;
- Filter options for tag, author or publisher;
- Book creation form with optional parameters;
- Multiple authors per book support;
- Automatic metadata fetching upon file selection;
- Drag-and-drop file selection option;
- Book cover customization option;
- Option to edit and/or delete a book after it's creation;
- Tag system to catalogue each book;
- Tag editing page for further customization;
- Reader settings to customize the experience;
- Many more tids and bits!

## Installation
- Create a `library` PostgreSQL database.
- Then, execute the `books.sql` file found in `backend/src/database`.
    - The file contains queries to make all of the necessary tables.
- Open a terminal window inside `library-website/backend` and then...
    - `npm i` — install all of the back-end node packages;
    - `npm run dev` — run the back-end.
- Open *another* terminal window inside `library-website/frontend` and then...
    - `npm i` — install all of the front-end node packages;
    - `npm run dev` — run the front-end.
- Open your web browser and go to `localhost:3000` to see the application.

## Credits
### Original project
- **[Biblioteca](https://github.com/fabianojunior139/Biblioteca)**
### Technologies and dependencies
- **[Node.js](https://nodejs.org/)**;
- **[Axios](https://axios-http.com/)**;
- **[Express](https://expressjs.com/)**;
- **[PostgreSQL](https://www.postgresql.org/)**;
- **[TypeScript](https://www.typescriptlang.org/)**;
- **[React](https://reactjs.org/)**;
- **[React-colorful](https://github.com/omgovich/react-colorful)**;
- **[React-pdf](https://github.com/diegomura/react-pdf)**;
- **[React Reader](https://github.com/gerhardsletten/react-reader)**;
- **[Bootstrap Icons](https://icons.getbootstrap.com/)**

# P.S.
Note to self — Never ever again have the brainlet idea of happy-go-lucking a complex application under the guise of "Just for learning, bruv". For fuck sakes, my software development methodologies teacher right now...