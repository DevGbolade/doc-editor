# Duplo Platform API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    <!-- - [Credit Score Calculation](#credit-score-calculation) -->
    <!-- - [Order Details](#order-details) -->
- [Deployment](#deployment)
  - [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a real-time collaborative text editor that allows multiple users to simultaneously edit a document. The editor provides a seamless and responsive editing experience, handling concurrent updates and maintaining document consistency.

## Features

- API Endpoints:
- Real-time Collaboration:
- Document Persistence:
- User Presence:

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DevGbolade/doc-editor.git
   cd doc-editor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Configuration

Copy the `.env.example` file to `.env` and update it with your configuration:

```bash
cp .env.example .env
```

## Usage

### API Endpoints

The Backend provides the following API endpoints:

- **POST /api/documents:** Creates doc.

- **GET /api/documents/:id:** Retrieves the content of a specific document.
- **GET /api/business/:businessId/orders/metrics:** Get order metrics for a business.

## Deployment

### Docker

To deploy the backend solution as a Docker image, follow these steps:

1. **Build the Docker image:**

   ```bash
   docker compose up
   ```

The Backend will be accessible at [http://localhost:4004/api/v1](http://localhost:4004/api/v1)

The Frontend will be accessible at [http://localhost:5173/api/v1](http://localhost:5173/api/v1)

## Contributing

We welcome contributions! If you'd like to contribute to the project, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
