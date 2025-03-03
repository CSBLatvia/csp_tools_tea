# CSP Tools TEA
https://tools.csb.gov.lv/tea_3/

## Project Overview

This project is a web-based tool for data visualization and analysis, developed for the Central Statistical Bureau. It consists of several components that work together to provide a comprehensive data exploration platform.

## Project Components

### angular_client
- **Description**: Angular 16.2 client-side application
- **Features**:
  - Interactive data visualizations
  - Territory exploration and analysis
  - Comparative data analysis
  - External iframe components for embedding
- **Details**: See [angular_client/README.md](angular_client/README.md) for more information



### serverside_php
- **Description**: PHP backend services
- **Features**:
  - RESTful API for data retrieval
  - Data processing and aggregation
  - Translation services
  - Sitemap generation
- **Details**: See [serverside_php/README.md](serverside_php/README.md) for more information

### serverside_postgresql
- **Description**: PostgreSQL scripts
- **Features**:
  - Database schema definitions
  - Data import
  - User interface texts
  - JSON retrieval functions

## Server Directories

### csb-app (Main Application)
- `/var/www/csb_tools/tea_3` - Client application
- `/var/www/csb_tools/tea_3/php` - PHP services

### csb-ext (External Components)
- `/var/www/csb_tools/tea_3/external` - External iframe components
- `/var/www/csb_tools/tea_3/external/php` - PHP services for external components

## Development

The project is structured as a full-stack application:

1. **Frontend**: Angular 16.2 application with multiple modules for different features
2. **Backend**: PHP services that connect to PostgreSQL database
3. **Database**: PostgreSQL scripts

## Deployment

See the respective README files in each component directory for detailed deployment instructions:
- [Angular Client Deployment](angular_client/README.md)
- [PHP Services Deployment](serverside_php/README.md)
- [PostgreSQL Deployment](serverside_postgresql/README.md)
