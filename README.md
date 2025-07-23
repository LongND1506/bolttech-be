
---

# Bolt Car Rental – Backend

This is the backend service for the **Bolt Car Rental** system. It is built using [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/) via [TypeORM](https://typeorm.io/). The backend provides APIs to manage cars, seasonal pricing, users, authentication, and customer bookings.

---

## Entities Relation Diagram
<img width="1143" height="779" alt="image" src="https://github.com/user-attachments/assets/3fe6a790-1468-47db-959e-6b000b238223" />

---

## Prerequisites
Node.js (v20.19.3 or newer)

---

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User roles and permissions
- **Car Management**
  - Fetch available cars with seasonal pricing logic:
    - Peak: June 1 – September 14
    - Mid: March 1 – May 31 and September 15 – October 31
    - Off: November 1 – February 29
  - Add new cars with pricing for each season
- **Booking Management**
  - Book a car with:
    - Date range validation
    - Driving license expiry check
    - Stock decrement per booking
  - Fetch booking details by ID
  - Fetch all bookings or user booking history
- **User Management**
  - Register and manage users
  - Fetch user details

---

## Booking Validation Rules

- Prevents bookings with expired driving licenses (must be valid through the booking period)
- Prevents overbooking based on car stock
- Validates booking date ranges (end date must be after start date, start date must be at least tomorrow)
- Prevent duplicate bookings by the same user for the same date

---

## Technologies Used

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)

---

## Getting Started

### 1. Clone the repository

```bash
https://github.com/LongND1506/bolttech-be.git
```

### 2. Configure Environment

Create a `.env` file in the `bolttech-be` directory with your database and JWT settings. Example:

```
DATABASE_URL=postgres://user:password@localhost:5432/bolttech
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 3. Install dependencies

```bash
npm install --force
```

### 4. Run the development server

```bash
npm run dev
```

---

## Scripts

- `npm run dev` – Start the server in watch mode
- `npm run build` – Build the project
- `npm start` – Run the compiled app
- `npm test` – Run unit tests
- `npm run lint` – Lint the codebase
- `npm run format` – Format code using Prettier
- `npm run seed` – Seed the database with initial data

---

## Testing

- Unit tests are written with **Jest**
- Service and repository layers use **mocks**
- Run tests with:

```bash
npm test
```

---

## API Documentation

- Swagger UI is available at: `http://localhost:3000/api` (when the server is running)

---

Let me know if you want this README saved to your project, or if you want to customize any section!

