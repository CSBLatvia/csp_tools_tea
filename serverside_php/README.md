## Server Side
[http://tools.csb.gov.lv/tea_3/](http://tools.csb.gov.lv/tea_3/)

# How to Deploy to Server?

1) Update the repository with the latest changes by running `git pull`
2) Run `npm install`
3) The `package.json` file contains the script for building the production version.
4) If the npm scripts panel is not visible in the project,
   click on `package.json` and select the option `show npm scripts`

5) When the scripts panel is visible, click on `build`
6) `build` will create the production version in the `dist/php/` directory.
7) The contents of the `dist/php/` directory should be copied to this directory on the server:
   `/var/www/csb_tools/tea_3/php/`

## Gulpfile.js

The build process uses Gulp, which:
1) Cleans the `dist` directory
2) Replaces credential placeholders with actual values from the `access.json` file
3) Copies all PHP files to the `dist/php/` directory

## PHP Service Structure

The PHP service consists of the following main parts:
- `index.php` - main entry point
- `sitemap.php` - sitemap generation
- `translations.php` - translation processing
- `app/` - application code
- `conf/` - configuration files

## API Architecture

The PHP API follows an MVC-like architecture:

### Controller (`app/controller.php`)
- Main controller that routes API requests based on the `db` GET parameter
- Handles all API endpoints and initializes the appropriate model classes
- Manages HTTP headers for proper caching and security

### Models (`app/models/`)
- Organized in subdirectories by functionality:
  - `data/` - Data retrieval models
  - `ext-components/` - External components (iframe visualizations)
  - `map/` - Map-related data models
  - `menu/` - Menu and navigation data
  - `meta/` - Metadata information
  - `pop/` - Popup content
  - `route/` - Routing information
  - `title/` - Page title data
  - `translations/` - Translation data
  - `viz/` - Visualization data

### Helper Functions (`app/helpers.php`)
- `jsonGenerate()` - Formats database results as JSON responses
- `errorResponse()` - Generates standardized error responses
- `validateLang()` - Validates language parameters
- `validateNumber()` - Validates and sanitizes numeric inputs
- `validateString()` - Sanitizes string inputs
- `validateSearchString()` - Sanitizes search string inputs

### Database Connection (`conf/db_connector_pdo.php`)
- Singleton pattern for database connection management
- Uses PDO for secure database interactions
- Credentials are replaced during build process

### Request Processing (`app/request.php`)
- `makeRequest()` - Executes PostgreSQL queries and formats the results

### Status Codes (`app/status_codes.php`)
- Defines error constants used throughout the application:
  - `ERROR_WRONG_GET_PARAMS` - Invalid request parameters
  - `ERROR_DB_NOT_CONNECTED` - Database connection failure
  - `ERROR_SQL_QUERY` - SQL query execution error

## API Endpoints and Functions

The API provides various endpoints accessed via the `db` GET parameter. Each endpoint corresponds to a specific function in the Controller class, which initializes a model class and calls its `getList()` method.

### Common Response Format

All API endpoints return JSON responses with the following structure:
```json
{
  "data": [...],       // The actual data returned by the endpoint
  "info": "ok",        // Status: "ok" or "error"
  "time": "123 ms",    // Total execution time
  "time_to_get_data": "100 ms",  // Time to retrieve data (optional)
  "time_to_encode": "23 ms"      // Time to encode data (optional)
}
```

In case of an error:
```json
{
  "data": [],
  "info": "error",
  "error_code": 400,
  "error_info": "error description",
  "time": "123 ms"
}
```

### Data Endpoints

#### `data-table-list`
- **Function**: `dataTableList()`
- **Model**: `DataTableList`
- **Parameters**: None
- **Returns**: JSON array of available data tables
- **Description**: Retrieves a list of all available data tables in the system

### Menu Endpoints

#### `menu-profs`
- **Function**: `menuProfs()`
- **Model**: `MenuProfs`
- **Parameters**: None
- **Returns**: JSON array of professional categories
- **Description**: Retrieves a list of all professional categories

#### `menu-naces`
- **Function**: `menuNaces()`
- **Model**: `MenuNaces`
- **Parameters**: None
- **Returns**: JSON array of NACE codes
- **Description**: Retrieves a list of NACE codes (economic activities)

#### `menu-sectors`
- **Function**: `menuSectors()`
- **Model**: `MenuSectors`
- **Parameters**: None
- **Returns**: JSON array of economic sectors
- **Description**: Retrieves a list of economic sectors

#### `menu-territory-name`
- **Function**: `menuTerritoryName()`
- **Model**: `MenuTerritoryName`
- **Parameters**: None
- **Returns**: JSON array of territory names
- **Description**: Retrieves a list of territory names

#### `menu-territories`
- **Function**: `menuTerritories()`
- **Model**: `MenuTerritories`
- **Parameters**:
  - `level` (int): Territory level
  - `year` (int): Year for the data
- **Returns**: JSON array of territories with their properties
- **Description**: Retrieves territory data for a specific level and year
- **Example**: `?db=menu-territories&level=3&year=2022`

#### `menu-years`
- **Function**: `menuYears()`
- **Model**: `MenuYears`
- **Parameters**: None
- **Returns**: JSON array of available years
- **Description**: Retrieves a list of years for which data is available

#### `menu-scatter-values`
- **Function**: `menuScatterValues()`
- **Model**: `MenuScatterValues`
- **Parameters**: None
- **Returns**: JSON array of scatter plot values
- **Description**: Retrieves values for scatter plot visualizations

#### `menu-scatter-links`
- **Function**: `menuScatterLinks()`
- **Model**: `MenuScatterLinks`
- **Parameters**: None
- **Returns**: JSON array of scatter plot links
- **Description**: Retrieves link data for scatter plot visualizations

### External Component Endpoints

#### `map-centroids`
- **Function**: `dataMapCentroids()`
- **Model**: `MapCentroids`
- **Parameters**: None
- **Returns**: JSON array of map centroid coordinates
- **Description**: Retrieves centroid coordinates for map visualizations

#### `map-viz`
- **Function**: `dataMapViz()`
- **Model**: `MapViz`
- **Parameters**:
  - `lang` (string): Language code ('lv' or 'en')
  - `year` (int): Year for the data
  - `m1` (string): First metric
  - `m2` (string): Second metric
  - `m3` (string): Third metric (can be 'none')
  - `m4` (string): Fourth metric (can be 'none')
  - `t1` (int): Territory level (3, 4, or 7)
  - `t2` (string): Territory filter ('all' or specific territory)
- **Returns**: JSON object with map visualization data
- **Description**: Retrieves data for map visualizations
- **Example**: `?db=map-viz&lang=en&year=2022&m1=metric1&m2=metric2&m3=none&m4=none&t1=3&t2=all`

#### `flow-chart`
- **Function**: `dataFlowChart()`
- **Model**: `FlowChart`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for flow chart visualization
- **Description**: Retrieves data for flow chart visualizations

#### `lines-chart`
- **Function**: `dataLinesChart()`
- **Model**: `LinesChart`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for line chart visualization
- **Description**: Retrieves data for line chart visualizations

#### `map-territory-info`
- **Function**: `dataMapTerritoryInfo()`
- **Model**: `MapTerritoryInfo`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data with territory information
- **Description**: Retrieves detailed information about territories for maps

#### `percentage-bar`
- **Function**: `dataPercentageBar()`
- **Model**: `PercentageBar`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for percentage bar visualization
- **Description**: Retrieves data for percentage bar visualizations

#### `percentage-list`
- **Function**: `dataPercentageList()`
- **Model**: `PercentageList`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for percentage list visualization
- **Description**: Retrieves data for percentage list visualizations

#### `pie-chart`
- **Function**: `dataPieChart()`
- **Model**: `PieChart`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for pie chart visualization
- **Description**: Retrieves data for pie chart visualizations

#### `scatter-plot`
- **Function**: `dataScatterPlot()`
- **Model**: `ScatterPlot`
- **Parameters**: Varies based on implementation
- **Returns**: JSON data for scatter plot visualization
- **Description**: Retrieves data for scatter plot visualizations

### Content Endpoints

#### `pop`
- **Function**: `popTexts()`
- **Model**: `Pop`
- **Parameters**: None
- **Returns**: JSON array of popup text content
- **Description**: Retrieves text content for popups

#### `title`
- **Function**: `titleTexts()`
- **Model**: `Title`
- **Parameters**: None
- **Returns**: JSON array of title text content
- **Description**: Retrieves text content for page titles

#### `meta-client`
- **Function**: `metaClient()`
- **Model**: `MetaClient`
- **Parameters**: None
- **Returns**: JSON object with client metadata
- **Description**: Retrieves metadata for the client application

#### `translations`
- **Function**: `translations()`
- **Model**: `Translations`
- **Parameters**: None
- **Returns**: JSON array of translation key-value pairs
- **Description**: Retrieves all translation strings for the application

#### `route`
- **Function**: `route()`
- **Model**: `Route`
- **Parameters**: None
- **Returns**: JSON object with routing information
- **Description**: Retrieves routing information for the application
