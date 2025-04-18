# JohanSan Control Dashboard

A modern Angular UI dashboard for building controllers management. This project provides a clean interface for monitoring controller requests and health with features like filtering, notifications, and request management.

![Dashboard Screenshot](src/assets/dashboard-screenshot.png)

## Features

- Controller requests management
- Filter and sort controller data
- Add new controller requests
- View controller health metrics
- Real-time notifications
- Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [npm](https://www.npmjs.com/) (v8.x or later)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/johansancontrol-dashboard.git
   cd johansancontrol-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   
   > **Note:** The `--legacy-peer-deps` flag is needed to resolve Angular Material dependencies.

## Running the Application

1. Start the development server:
   ```bash
   ng serve
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

## Building for Production

To build the application for production:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/johansancontrol-dashboard/browser` directory.

## Project Structure

```
johansancontrol-dashboard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── dashboard/
│   │   │   ├── controller-requests/
│   │   │   ├── controller-health/
│   │   │   ├── add-request-modal/
│   │   │   └── notification/
│   │   ├── models/
│   │   │   └── controller.model.ts
│   │   ├── services/
│   │   │   └── controller.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.routes.ts
│   ├── assets/
│   ├── styles.scss
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Connecting to Backend

This project includes a mock service for demonstration. To connect to a real backend:

1. Update the `controller.service.ts` file to make actual HTTP requests
2. Configure the API endpoints in an environment file
3. Implement proper error handling and loading states

## Additional Commands

- Run unit tests: `ng test`
- Run linting: `ng lint`
- Generate new component: `ng generate component component-name`
- Generate new service: `ng generate service service-name`

## License

[MIT License](LICENSE)
