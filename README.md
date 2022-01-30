# [Monday.com to Power BI Adapter](https://monday-powerbi.herokuapp.com/)

This is an adapter that retrieves data from the Monday API v2 and converts to a Power BI friendly format while maintaining the API key safety.

* Converts the board items to a CSV encoded with Windows-1252
* Optionally formats a few column types to be easier to work with in Power BI
* Optionally includes subitems
* Optionally generates tokens that give access only to a specific board, so you don't have to expose your API Key in a Power BI report (Safe mode)

## Security

I won't look into your data, but you don't have to trust me. Feel free to self-host the adapter or deploy your own to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Guichaguri/MondayPowerBIAdapter/)

## Alternatives

* [Power Query M script](https://gist.github.com/Guichaguri/83a6d8ab6ce3a695dc104bb4eff9d73d)
