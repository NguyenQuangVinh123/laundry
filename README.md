# Laundry Management System

## Description
This project is a Laundry Management System designed to help users manage their laundry tasks efficiently. It provides features for tracking laundry items, managing customer details, and generating reports of laundry activities.

## Technologies Used
- **Next.js**: A React framework for building server-side rendered applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making requests to the server.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Creatable Select**: A React component for creating and selecting options.
- **Prisma**: An ORM (Object-Relational Mapping) tool for interacting with the database.
- **PostgreSQL**: A relational database management system for storing data.

## Database Setup

This project uses **PostgreSQL** as the database to store all the laundry management data. To interact with the database, we use **Prisma** as the ORM (Object-Relational Mapping) tool.

### Setting Up PostgreSQL
1. Create a PostgreSQL database instance on your preferred hosting provider (e.g., Heroku, AWS, or Vercel).
2. Update your `.env` file with the database connection string:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

### Using Prisma
- To generate the Prisma client, run:
  ```bash
  npx prisma generate
  ```
- To run migrations, use:
  ```bash
  npx prisma migrate dev --name init
  ```

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd laundry
   ```
2. Install dependencies:
   ```bash
   yarn add
   ```
3. Run the development server:
   ```bash
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel
When deploying your application on Vercel, make sure to set the environment variables in the Vercel dashboard:
- Add the `DATABASE_URL` variable with your PostgreSQL connection string.
- Ensure that the Prisma client is generated before deployment by including the `prisma generate` command in your build step.

## Usage
- Navigate through the application to manage laundry items and customers.
- Use the admin features to check and manage all entries.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.