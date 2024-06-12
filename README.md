# Early Warning System - Frontend

This repository contains the frontend of an IoT platform designed for the detection of early warnings of river overflows. The platform is designed to collect data from level, flow and rainfall sensors, and provide real-time alerts through a web interface.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/)
* You have a `<Windows/Linux/Mac>` machine. State here which OSes are supported and which are not.
* You have read `<guide/link/documentation_related_to_project>`.

## Setting up the Development Environment

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`

## Environment Variables

This project uses Angular's environment.ts file for managing environment variables. You will find two files in the `/environments` folder:

- `environment.ts`: This is used for development.
- `environment.prod.ts`: This is used for production.

<!-- TODO: Edit this -->
To run this project, you will need to set the following variables in the appropriate file:

- `API_URL`: The URL of the backend API
- `SENSOR_ID`: The ID of the sensor to monitor

For example, your `environment.ts` file might look like this:

```typescript
export const environment = {
    production: false,
    API_URL: 'http://localhost:3000/api',
    SENSOR_ID: '123456789'
};
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

