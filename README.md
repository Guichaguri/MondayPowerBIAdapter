# Monday.com to Power BI Adapter

This is an adapter that retrieves data from the Monday API v2 and converts to a Power BI friendly format while maintaining the API key safety.

* Converts the board items to a CSV encoded with Windows-1252
* Optionally formats a few column types to be easier to work with in Power BI
* Optionally generates tokens that give access only to a specific board, so you don't have to expose your API Key in a Power BI report (Safe mode)

## Alternatives

* [Power Query M script](https://gist.github.com/Guichaguri/83a6d8ab6ce3a695dc104bb4eff9d73d)
