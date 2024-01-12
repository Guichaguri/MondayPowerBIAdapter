# Monday.com to Power BI Adapter

This is an adapter that retrieves data from the Monday API v2 and converts to a Power BI friendly format while maintaining the API key safety.

* Converts the board items to a CSV encoded with Windows-1252
* Optionally formats a few column types to be easier to work with in Power BI
* Optionally includes subitems
* Optionally generates tokens that give access only to a specific board, so you don't have to expose your API Key in a Power BI report (Safe mode)
* You can deploy this tool using Docker to any cloud or on-premise server

## Running

### NodeJS

* Install NodeJS (Version 18 is recommended)
* Run `npm install` to install the dependencies
* Run `npm run build` to build assets
* Run `npm run start` to start the server

### Docker

* Install Docker
* Run `docker build . --tag monday-powerbi` to build the image
* Run `docker run -d -p 3000:3000 monday-powerbi` to run the container

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Guichaguri/MondayPowerBIAdapter/)

## Environment Variables

| Variable           | Description                            | Default                      |
|--------------------|----------------------------------------|------------------------------|
| `PORT`             | The HTTP server port number            | `3000`                       |
| `DATABASE_URL`     | The PostgreSQL database connection URL | -                            |
| `MONDAY_BASE_URL`  | The Monday API base URL                | `https://api.monday.com/v2`  |

The database is optional, and if available, allows you to generate tokens that give access only to a specific board.

## Alternatives

* [Power Query M script](https://gist.github.com/Guichaguri/83a6d8ab6ce3a695dc104bb4eff9d73d)
