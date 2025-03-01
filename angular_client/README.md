# Client Side (Angular 16.2.12)

This project consists of two main parts:

## csb-app - Website Client-Side Project
The main application that serves as the primary user interface.

Server directory:
###### /var/www/csb_tools/tea_3/

## csb-ext - External iframe Components Project
A collection of standalone components that can be embedded in iframes.

Server directory:
###### /var/www/csb_tools/tea_3/external/

## Development Servers

To run the development server for csb-app project:
```
npm run serve-app
```

To run the development server for csb-ext project:
```
npm run serve-ext
```

## Building for Production

To build the csb-app project for production:
```
npm run build-app
```

To build the csb-ext project for production:
```
npm run build-ext
```

## Translations

To export translations to SQL:
```
npm run translations-to-SQL
```

To import translations from SQL:
```
npm run translations-from-SQL
```

## Project Structure

### Main Application (csb-app)

The main application is structured as follows:

- **src/app**: Contains the main application code
  - **components-shared-all**: Shared components used across the entire application
  - **components-shared-ui**: UI components shared across different modules
  - **directives**: Custom Angular directives
  - **model**: Data models, services, and value objects
  - **mod-***: Feature modules (landing, map, territory, compare, etc.)
  - **pipes**: Custom Angular pipes
  - **ui-controls**: Reusable UI control components
  - **view-***: View components for different sections of the application

### External Components (csb-ext)

The external components project is structured as follows:

- **src/ext**: Contains the external components code
  - **mod-external/modules**: Contains various visualization modules that can be embedded in iframes
    - **map-territory**: Map territory visualization
    - **map-viz**: Map visualization
    - **percentage-bar**: Percentage bar chart
    - **percentage-list**: Percentage list visualization
    - **pie-chart**: Pie chart visualization
    - **lines-chart**: Line chart visualization
    - **flow-chart**: Flow chart visualization
    - **scatter-plot**: Scatter plot visualization

## Main Application Modules

The application is organized into several feature modules:

- **mod-landing**: The landing page module
- **mod-territory**: Territory view module
- **mod-compare**: Comparison view module
- **mod-map**: Map visualization module
- **mod-about**: About page module
- **mod-about-api**: API documentation module
- **mod-iframe**: Iframe embedding module
- **mod-translations-admin**: Translation administration module

## External Iframe Components

The project includes several standalone components that can be embedded in iframes:

1. **ext-map-territory**: Displays territories on a map
2. **ext-map-viz**: Provides map visualizations with various layers
3. **ext-percentage-bar**: Displays percentage data as a bar chart
4. **ext-percentage-list**: Shows percentage data as a list
5. **ext-pie-chart**: Renders data as a pie chart
6. **ext-lines-chart**: Displays data as a line chart
7. **ext-flow-chart**: Shows data flow between entities
8. **ext-scatter-plot**: Displays data points on a scatter plot

These components can be accessed via URLs following this pattern:
```
/external/:lang/:component-type/:year/:M1/:M2/:T1/:T2/:M3/:M4/[additional-params]
```

## Map Visualizations

The project includes several map visualization components:

- **MapVizModule**: The main map visualization module that provides:
  - Territory mapping
  - Choropleth maps
  - Circle visualizations
  - Sector visualizations
  - Region visualizations
  - Interactive legends
  - Layer controls

The map visualizations use Mapbox GL for rendering and support various data visualization techniques:

- Circle size to represent quantity
- Color to represent categories or values
- Sectors to show proportions
- Region highlighting

## Chart Visualizations

The project includes several chart visualization components:

- **Pie Charts**: For showing proportions
- **Line Charts**: For showing trends over time
- **Flow Charts**: For showing relationships between entities
- **Scatter Plots**: For showing correlations between variables
- **Percentage Lists/Bars**: For comparing percentages across categories

These visualizations are built using Highcharts and D3.js libraries.

## Translation System

The project includes a comprehensive translation system:

- Translations are stored in JSON format
- The system supports multiple languages (currently Latvian and English)
- Translations can be imported from and exported to SQL
- A translation administration interface is available at the `/text_editor` route

## Project Architecture

The application follows a modular architecture:

- **Core Services**: Provided by the model service and related services
- **Feature Modules**: Self-contained modules for specific features
- **Shared Components**: Reusable components shared across modules
- **External Components**: Standalone components that can be embedded in iframes

The application uses Angular's lazy loading to improve performance by loading modules only when needed.

## Technologies Used

- **Angular 16.2.12**: The core framework
- **Clarity Design System**: For UI components
- **Highcharts**: For chart visualizations
- **D3.js**: For custom visualizations
- **Mapbox GL**: For map visualizations
- **iframe-resizer**: For responsive iframes
