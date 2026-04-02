# 📁 DRDO GPF Management System

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Oracle](https://img.shields.io/badge/Oracle-XE-red?style=flat-square&logo=oracle)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A full-stack web application built for **DRDO** to manage **General Provident Fund (GPF)** records of employees. It handles everything from GPF account management, yearly closing balances, subscriptions, advances, withdrawals, sanction details, to detailed report generation.

---

## 📸 Screenshots

> _Add screenshots of your app here_

---

## 🚀 Features

- 🔐 **JWT Authentication** — Login, Register, Change Password, Forgot Password via security questions
- 👤 **User Profile** — View and manage profile, password expiry enforcement
- 📂 **GPF Account Management** — Search by account number or personnel number
- 📅 **Yearly Closing Balances** — Track year-wise GPF closing balances per employee
- 💰 **Subscriptions** — Add monthly GPF subscription and refund entries
- 📝 **Applications** — Submit Temporary Advance and Final Withdrawal applications
- 📋 **Sanction Details** — Manage bill numbers, DV numbers, installments, recovery dates
- 🔢 **Purpose Codes** — Purpose E (non-refundable withdrawals) and Purpose F (refundable advances)
- 📊 **Reports** — Summary report for all employees + per-user calculation sheet with 7.1% interest
- 🏷️ **Work Status Filtering** — Filter employees by Officer / Industrial / Non-Industrial
- 🌗 **Light/Dark Theme** — Toggle between themes
- ✨ **Animated Page Transitions** — Smooth navigation with reduced-motion support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|------------|---------|
| React | 19 |
| Vite | 7 |
| React Router | v6 |
| Axios | ^1.13 |

### Backend
| Technology | Version |
|------------|---------|
| Java | 17 |
| Spring Boot | 4.0 |
| Spring Security + JWT | JJWT 0.11.5 |
| Spring Data JPA / Hibernate | - |
| Oracle Database XE | - |
| Flyway | - |

---

## 📁 Project Structure

```
DRDO-GPF/
├── drdo-FrontEnd/
│   ├── src/
│   │   ├── components/        # All UI pages and components
│   │   ├── contexts/          # ThemeContext
│   │   ├── services/          # API service layer (userService)
│   │   ├── App.jsx            # Routes and page transitions
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── drdo-BackEnd/loginregister/
    └── src/main/java/com/adithya/loginregister/
        ├── config/            # SecurityConfig, CORS, JWT entry points
        ├── controller/        # REST API controllers
        ├── entity/            # JPA entities (DB tables)
        ├── payload/           # Request / Response DTOs
        ├── repository/        # Spring Data JPA repositories
        ├── service/           # Business logic (AuthenticationService)
        └── util/              # JwtUtil
```

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `USERS` | System users — credentials, security questions, password expiry |
| `GPF` | Employee master — account number, personnel number, name, designation, DOB, retirement date, basic pay, service date |
| `GPF_YEARS` | Year-wise closing balances (pass number + year = unique) |
| `GPF_SUB_DETAILS` | Monthly subscription and refund entries |
| `GPF_USR_DETAILS` | Employee GPF applications — amount, type (E/F), purpose, house address |
| `GPF_SANCTION_DETAILS` | Sanction records — loan type, bill/DV details, installments, recovery dates |
| `GPF_PURPOSE_E` | Purpose codes for non-refundable (final) withdrawals |
| `GPF_PURPOSE_F` | Purpose codes for refundable (temporary) advances |

Database migrations are managed by **Flyway** (V1 → V23) and run automatically on startup.

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- Oracle Database XE running on `localhost:1521/xe`

---

## 🏃 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/drdo-gpf.git
cd drdo-gpf
```

### 2. Backend Setup

Update database credentials in `application.properties` if needed:

```properties
spring.datasource.url=jdbc:oracle:thin:@//localhost:1521/xe
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Then run:

```bash
cd drdo-BackEnd/loginregister
./mvnw spring-boot:run
```

Backend starts at **http://localhost:8081**

### 3. Frontend Setup

```bash
cd drdo-FrontEnd
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**
All `/api` requests are automatically proxied to the backend.

---

## 🔌 API Reference

<details>
<summary><strong>Auth — /api/auth</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT token |
| POST | `/change-password` | Change password |
| GET | `/security-questions/{userId}` | Get security questions for a user |
| POST | `/verify-security-answers` | Verify answers for password recovery |

</details>

<details>
<summary><strong>GPF Accounts — /api/gpf</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all` | Get all GPF employee records |
| GET | `/search?query=` | Search by account number or personnel number |
| GET | `/account/{accountNumber}` | Get a single GPF record |

</details>

<details>
<summary><strong>GPF Years — /api/gpf-years</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all` | Get all year-wise closing balance records |
| GET | `/person/{persNumber}` | Get all year records for an employee |
| GET | `/search?query=` | Search by pass number |
| POST | `/save` | Add a new yearly closing balance |
| GET | `/by-work-status?workStatus=&year=` | Filter employees by work status for a given year |

</details>

<details>
<summary><strong>Subscriptions — /api/gpf-sub-details</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/by-pers/{persNumber}` | Get all subscription records for an employee |
| POST | `/save` | Add a new subscription/refund entry |
| DELETE | `/{id}` | Delete a subscription record |

</details>

<details>
<summary><strong>Sanction Details — /api/gpf-sanction-details</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `` | Get all sanction records |
| GET | `/{id}` | Get a sanction record by ID |
| GET | `/pers-no/{persNo}` | Get all sanction records for an employee |
| GET | `/loan-type/{loanType}` | Filter by loan type |
| POST | `` | Create a new sanction record |
| PUT | `/{id}` | Update a sanction record |
| DELETE | `/{id}` | Delete a sanction record |

</details>

<details>
<summary><strong>User Applications — /api/gpf-usr-details</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/by-persno/{persno}` | Get applications for an employee |
| POST | `/save` | Submit a new GPF application |

</details>

<details>
<summary><strong>Purpose Codes — /api/gpf-purpose-e &amp; /api/gpf-purpose-f</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all` | Get all purpose codes (E = final withdrawal, F = temporary advance) |

</details>

<details>
<summary><strong>Reports — /api/reports</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/summary` | Summary report for all employees (closing balance, subscriptions, 7.1% interest) |
| GET | `/calculation-sheet/{persNumber}` | Full calculation sheet for one employee |

</details>

---

## 🧪 Test Data

Sample SQL data for testing is available in:

```
test-data/COMBINED_GPF_DATA.sql
```

---

## 🔑 Key Configuration

```properties
server.port=8081
jwt.expiration-ms=3600000        # Token valid for 1 hour
spring.flyway.enabled=true       # Auto-runs DB migrations on startup
```

---

## 👨‍💻 Author

**Adithya**
- Built for DRDO GPF management

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
