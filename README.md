# SpendWise — Personal Expense Tracker

A modern full-stack web application designed to help users track everyday expenses, categorize spending, and gain visual financial insights.

Built with **React.js** for a sleek, responsive user interface, **Java Spring Boot 3** for high-performance REST APIs, and a **Persistent H2 File-Based Database** ensuring data remains preserved across application restarts and page refreshes without requiring external database software installation.

---

## 🌟 Features

- **Record Expenses**: Add expenses with Title, Amount, Category, Date, Payment Method (Cash, Credit Card, UPI, etc.), and optional Notes.
- **Strict Input Validation**:
  - Rejects empty or whitespace-only titles (`@NotBlank`, minimum 2 characters).
  - Rejects non-positive or zero amounts (`@Positive`, minimum 0.01).
  - Date and category validation.
  - Returns friendly structured error feedback in the UI and detailed validation messages via API.
- **Live Spending Dashboard**:
  - **Total Spending**: Dynamically computed across all expenses or filtered records.
  - **This Month's Spending**: Real-time aggregation of current calendar month activity.
  - **Today's Spending**: Instant summary of today's expenditures.
  - **Spending Insights**: Average per transaction and highest recorded expense.
- **Visual Analytics**:
  - Category spending distribution with color-coded badges and percentage breakdown bars.
  - Monthly spending trajectory timeline visualization.
- **Interactive Expense List & Table**:
  - Clean glassmorphic table displaying all expense details, categories, dates, and amounts.
  - **Category Filtering**: Quick filter chips for *Food & Dining*, *Travel & Transport*, *Shopping*, *Bills & Utilities*, *Entertainment*, *Health & Fitness*, *Education*, and *Other*.
  - **Live Search**: Instant search by title or notes.
  - **Date Range Filters**: Presets for *All Time*, *Today*, *Past 7 Days*, *This Month*, or *Custom Date Range*.
  - **Sorting**: Sort by Date (newest/oldest), Amount (highest/lowest), or Title (A–Z).
- **Edit & Delete Records**:
  - In-place Edit modal with pre-filled inputs and real-time validation.
  - Safe Delete confirmation modal with expense summary before deletion.
- **Data Export**: Export filtered expenses to a CSV spreadsheet with one click.
- **Currency & Theme Personalization**:
  - Multi-currency switcher (USD `$`, EUR `€`, GBP `£`, INR `₹`, JPY `¥`, CAD `C$`, AUD `A$`).
  - Dark Mode and Light Mode toggle with smooth transitions, persisted in `localStorage`.
- **Celebration Micro-Delight**: Interactive confetti explosion when recording a new expense!

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Component-based UI, Lucide Icons, Canvas Confetti |
| **Styling** | Vanilla CSS Design System | Glassmorphism, custom CSS variables, responsive design |
| **Backend** | Java 17 + Spring Boot 3.3.4 | Spring Web, Spring Data JPA, Jakarta Bean Validation |
| **API Documentation** | Springdoc OpenAPI / Swagger UI | Interactive API documentation at `/swagger-ui.html` |
| **Data Storage** | MySQL 8.0 / MySQL Connector/J | Persistent relational database (`expensetracker`) |
| **HTTP Client** | Axios | REST communication with proxy configuration |
| **Build Tools** | Apache Maven 3.9 & Node.js / npm | Standalone executable JAR & Vite pipeline |

---

## 🗄️ Database Selection & Setup

### Database Chosen: MySQL 8.0

The application is configured to use **MySQL** as its primary persistent production database:
- **Automatic Schema Creation**: The JDBC connection string includes `createDatabaseIfNotExist=true`, which automatically creates the `expensetracker` database upon initial connection.
- **Hibernate Auto-DDL**: Hibernate automatically creates and updates the `expenses` table schema and indexes upon startup (`spring.jpa.hibernate.ddl-auto=update`).
- **Flexible Environment Configuration**: Database host, port, credentials, and name can be customized via standard environment variables or in `application.properties`.

### Database Configuration (`application.properties`)
```properties
# MySQL Connection Configuration
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/expensetracker?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate MySQL Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

### Manual Database Creation (Optional)
If you prefer creating the database manually in MySQL CLI or MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS expensetracker;
```

### Environment Variables
Override default credentials when running the JAR:
```bash
# On Linux / macOS / Bash:
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/expensetracker?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="your_username"
export SPRING_DATASOURCE_PASSWORD="your_password"
java -jar target/expense-tracker-api-1.0.0.jar

# On Windows PowerShell:
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
java -jar target\expense-tracker-api-1.0.0.jar
```

### Optional H2 Profile Fallback
To run without a local MySQL server installed, activate the H2 profile:
```bash
java -jar target/expense-tracker-api-1.0.0.jar --spring.profiles.active=h2
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8081/api/expenses`  
Interactive Swagger UI: `http://localhost:8081/swagger-ui.html`

| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `GET` | `/api/expenses` | List all expenses (with optional filters) | None | `200 OK` |
| `GET` | `/api/expenses/{id}` | Get single expense by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/expenses` | Create a new expense record | `ExpenseRequest` JSON | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/expenses/{id}` | Update existing expense | `ExpenseRequest` JSON | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/expenses/{id}` | Delete an expense permanently | None | `204 No Content` / `404 Not Found` |
| `GET` | `/api/expenses/summary` | Get totals and category breakdown | None | `200 OK` |
| `GET` | `/api/expenses/categories` | Get all available categories | None | `200 OK` |

### Sample Request (`POST /api/expenses`)
```json
{
  "title": "Whole Foods Grocery",
  "amount": 64.50,
  "category": "Food & Dining",
  "date": "2026-10-27",
  "paymentMethod": "Credit Card",
  "notes": "Weekly produce and snacks"
}
```

### Sample Validation Error Response (`400 Bad Request`)
When an empty title or amount `<= 0` is sent:
```json
{
  "timestamp": "2026-10-27T01:51:42.574",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input parameters provided",
  "validationErrors": {
    "title": "Title is required and cannot be empty",
    "amount": "Amount must be greater than zero"
  }
}
```

---

## 🚀 Running Locally

### Prerequisites
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+** & **npm** (`node -v`, `npm -v`)

### Option A: One-Click Launch (Recommended)
Double-click `start-all.bat` or run in PowerShell:
```powershell
.\start-all.ps1
```
This automatically starts both the Spring Boot API (Port 8081) and React Frontend (Port 5173).

---

### Option B: Running Services Individually

#### 1. Backend (Java Spring Boot)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/expense-tracker-api-1.0.0.jar
```
The backend will start at: `http://localhost:8081`

#### 2. Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: `http://localhost:5173` (proxies `/api` requests to `http://localhost:8081`).

---

### Option C: Unified Single-JAR Production Mode
You can package the React frontend directly into the Spring Boot JAR:
```powershell
.\build-and-run-jar.ps1
```
Or manually:
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Copy build into Spring Boot static resources
# Windows PowerShell:
Copy-Item -Path "dist\*" -Destination "..\backend\src\main\resources\static\" -Recurse -Force

# 3. Package and run Spring Boot
cd ../backend
mvn package -DskipTests
java -jar target/expense-tracker-api-1.0.0.jar
```
Now, navigating to `http://localhost:8081/` serves both the React application and the REST API from a single process!

---

## ☁️ Deployment Instructions

### 1. Docker & Docker Compose
A multi-stage `Dockerfile` is provided in the repository root. It compiles both the React frontend and Spring Boot backend into an ultra-slim OpenJDK 17 runtime image:
```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f
```
The container exposes port `8081` and mounts `./backend/data` as a persistent volume so data survives container restarts.

---

### 2. Cloud Deployment on Render (One-Click)
1. Fork or push this repository to GitHub.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** → **Blueprint** and connect your repository.
4. Render will detect `render.yaml` and deploy the Docker service automatically with a persistent disk for the database.
5. Your app will be live at `https://your-app-name.onrender.com`.

---

### 3. Cloud Deployment on Railway
1. Sign in to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Railway automatically detects the `Dockerfile`.
4. Add a Volume mounted at `/app/data` to ensure persistent storage.
5. Set the environment variable `PORT=8081`. Railway will assign a public URL.

---

### 4. Separate Frontend on Vercel + Backend on Render / Railway
If you prefer hosting the React frontend on Vercel:
1. Import the repository in [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. In `vercel.json`, replace `YOUR-SPRING-BOOT-BACKEND.onrender.com` with your live backend URL.
4. Deploy!

---

## 🧪 Testing

### Backend Unit & Integration Tests
Run automated tests with Maven:
```bash
cd backend
mvn test
```
Includes Mockito and JUnit 5 tests validating:
- Expense retrieval by ID.
- Expense creation with valid input.
- Expense deletion logic.
- Input validation constraints.

---

## 📁 Project Structure

```
personal-expense-tracker/
├── Dockerfile                   # Multi-stage production container build
├── docker-compose.yml           # Compose file with persistent volume
├── render.yaml                  # Render cloud blueprint
├── vercel.json                  # Vercel deployment configuration
├── start-all.ps1                # PowerShell launcher script
├── start-all.bat                # Windows Batch launcher script
├── build-and-run-jar.ps1        # Unified JAR packaging & runner
├── README.md                    # Project documentation
│
├── backend/                     # Java Spring Boot REST API
│   ├── pom.xml                  # Maven dependencies & build plugins
│   ├── data/                    # Persistent H2 database storage directory
│   └── src/
│       ├── main/
│       │   ├── java/com/expensetracker/
│       │   │   ├── ExpenseTrackerApplication.java
│       │   │   ├── config/      # CORS, SPA routing, Data seed initializer
│       │   │   ├── controller/  # REST endpoints & OpenAPI annotations
│       │   │   ├── dto/         # Request & Summary response DTOs
│       │   │   ├── exception/   # Global exception & validation handler
│       │   │   ├── model/       # Expense JPA Entity
│       │   │   ├── repository/  # Spring Data JPA Repository
│       │   │   └── service/     # Business logic & analytics service
│       │   └── resources/
│       │       ├── application.properties
│       │       └── static/      # Pre-packaged React production build
│       └── test/                # JUnit 5 & Mockito test suite
│
└── frontend/                    # React.js Single Page Application
    ├── package.json             # NPM dependencies (Axios, Lucide, Confetti)
    ├── vite.config.js           # Vite dev config with /api proxy to backend
    ├── index.html               # Google Fonts & SEO metadata
    └── src/
        ├── main.jsx             # React DOM root entry
        ├── App.jsx              # Main dashboard orchestrator
        ├── index.css            # Glassmorphic Design System & dark/light themes
        ├── components/
        │   ├── Header.jsx       # App bar, API status, theme & currency controls
        │   ├── StatsCards.jsx   # KPI metric cards (Total, Month, Today, Insights)
        │   ├── AnalyticsSection.jsx # Category breakdown & monthly chart
        │   ├── ExpenseFilters.jsx   # Search, category pills, date & sort
        │   ├── ExpenseTable.jsx # Responsive table & cards with CRUD actions
        │   ├── ExpenseModal.jsx # Add/Edit modal with field validation
        │   ├── DeleteConfirmModal.jsx # Deletion safety prompt
        │   └── Toast.jsx        # Notification alert banners
        ├── services/
        │   └── api.js           # Axios API service client
        └── utils/
            └── constants.js     # Categories, currencies, and CSV export logic
```
