# ACMI Collection Data Explorer

This is an Alpha version of a collection data explorer for the ACMI lending collection dataset, available at https://github.com/ACMILabs/collection

While this project can be forked, it's really just an example of the sorts of web apps that could be built against this dataset, and we'd love to see what you come up with.

## Specifics of this web app

This is a client-side web app written using [React JS](https://facebook.github.io/react/) for the frontend, with [Firebase](http://firebase.google.com/) used as a database to serve the JSON from the collection dataset. There's quite a few steps to get up and running, but using this tech stack means that you can write and host a web app without having to configure servers. And since Firebase offers a really good free tier, it's a good place to get started building data explorers.

It assumes that it will be hosted at a `/dataexplorer` subdirectory.

## Getting started

These getting started steps assume that you'll be comfortable using a terminal, and are using a computer with a bash terminal, [Python](https://www.python.org/), [Node JS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) pre-installed.

### Building JSON files and setting up Firebase to serve the data

Before running the web app, we'll need to build a large JSON file to upload to Firebase.

1. Download the `collections_data.tsv` file from the ACMI Collection data set located: https://github.com/ACMILabs/collection, and place it in a `src` directory relative to the `utils` directory in this repo. (/utils/src)
2. From the command-line go to the `utils` directory and run `python tsv_to_json_bundle.py`
3. The script will convert the TSV to individual JSON files and a few different json bundles, with pre-calculated indexes and stats objects.
4. Locate the file `dist/collections_data.json`
5. Create an account at https://firebase.google.com, and follow their instructions to upload a JSON file for your database. Import the file just created (`collections_data.json`) and wait for it to upload.
6. Take the URL for your Firebase database, and place it in the `databaseURL` property of the Firebase config settings in `js/app.js`.

### Set up and build the web app

1. With Node and NPM installed, run `npm install` from the terminal. This web app uses Web Pack to bundle and minify packages, and works best if web pack is installed globally. You may need administrator access, and to use `sudo` at the command line to get this to work, depending on your environment.
2. Install web pack globally with `npm install -g webpack`
3. Install web pack dev server globally with `npm install -g webpack-dev-server`
4. Make sure that your repo is in a directory named `dataexplorer`
5. From the command-line, run `npm start` to spin up the local webpack development server
6. Open up `localhost:8080/dataexplorer` in a web browser, and you should have a working version of the data explorer running on your local PC, serving data from a Firebase database.

### Issues?

This project is in alpha, and many parts of the code are rough around the edges. If you've discovered issues you would like fixed, log an Issue with us here in this repo.