# SIH POC Insight

## Project Overview

SIH POC Insight is a front-end application designed to provide insights into compliance, audit, and reporting. The application is tailored to integrate seamlessly with Qlik analytics, offering a dynamic and interactive user experience with a focus on the Siemens light theme.

## Getting Started

To get started with the SIH POC Insight application, you need to set up your environment and initialize the app with specific configurations. This setup allows the application to simulate a real production environment, receiving initial parameters from another system.

### Environment Setup

Ensure your environment is correctly set up with the necessary dependencies and settings. Follow the steps below to configure your environment:

1. Clone the repository to your local machine.
2. Install the required dependencies using your package manager (e.g., `npm install` or `yarn`).
3. Set up the environment variables as needed.

### Local Configuration: `config.development.json`

The local configuration to spinup the application on localhost is defined in the public folder where a config.development.json file can be created and all the necessary env variables defined.

### Prod Configuration: `config.json`

The PROD configuration is dynamically created at runtime during the installation of Q^plus with all the required environment variables

### Startup Mock Param: `startup.json`

The application initialization is driven by a configuration file named `startup.json`. This file contains mock parameters, like Qlik Virtual Proxy, Qlik App ids for compliance, audit and reporting, that simulate receiving query parameters from another system to initialize the app. The structure of the `startup.json` file is as follows:

```json
{
    "vp": "localhost",
    "theme": "db-theme-siemens-light",
    "pages": [
        {
            "page": "compliance",
            "qlikAppId": "4e2d4117-f850-496b-8eb4-df1ff570c961"
        },
        {
            "page": "audit",
            "qlikAppId": "96d1506e-4b0e-424b-8b8c-0a2d42c97e69"
        },
        {
            "page": "reporting",
            "qlikAppId": "4e2d4117-f850-496b-8eb4-df1ff570c961"
        }
    ],
    "default": "compliance"
}
```

## Running the Application

To run the application, follow these steps:

1. Ensure the `startup.json` file is placed in the root directory of the project.
2. Start the application using the start script defined in your `package.json` (e.g., `npm start` or `yarn start`).
3. The application will initialize with the configuration specified in `startup.json`, setting up the initial view and theme based on the provided parameters.
4. To automatically login and be re-direct to the app input the following URL in the browser: https://qs-internal.databridge.ch:8084/?uid=patric.amatulli&userDirectory=VM-I-QS-DEV&returnTo=https://localhost:7005
