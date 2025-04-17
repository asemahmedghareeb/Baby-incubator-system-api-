# Incubator Organization and Reservation System API

This repository provides the source code for an API that facilitates the organization and reservation of incubators. It's built using JavaScript, the Express library for web framework functionality, and Prisma for interacting with a database.

## Documentation

For detailed documentation on API endpoints, usage, and examples, please refer to the following link:
[API Documentation Link](https://trello.com/b/1RDIsdvd/api-documentation)

## Features

* **Incubator Management:**
    * Create, read, update, and delete incubators.
    * Define incubator properties such as model, capacity, and availability.
* **Reservation Management:**
    * Create, read, update, and delete reservations.
    * Associate reservations with specific incubators and time slots.
    * Manage user access and permissions for reservation creation and modification. (Implementation details depend on your chosen user authentication approach)
* **Additional Features (Optional):**
    * Implement user authentication and authorization to control access to different API functionalities.
    * Add functionalities for managing waitlists, notifications, and reminders.

## Getting Started

### Prerequisites

* Node.js and npm (or yarn) installed on your system. You can download them from https://nodejs.org/.
* A database server compatible with Prisma. Refer to the Prisma documentation for supported databases: https://www.prisma.io/docs/concepts/database-providers

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Life-Nest/backend-service.git life_nest_backend
   ```

2. Navigate to the project directory:

  ```bash
  cd life_nest_backend
  ```

3. Install dependencies:

  ```bash
  npm install
  ```

### Configuration

1. Create a .env file in the project root directory.
2. Use the variables defined in the [`.env.example`](./.env.example) file as a template to create your .env file.

### Database Setup

1. Run Prisma migrations to create the database schema:

  ```bash
  npx prisma migrate dev
  ```

2. (Optional) Seed the database with initial data (e.g., sample incubators) using Prisma migrations or a separate script.

### Running the API

1. Start the development server:

  ```bash
  npm start
  ```

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
