# Smart Disaster Early Warning & Community Alert Management System

An enterprise-grade, full-stack emergency management web application designed to help civil defense administrators monitor disaster situations, broadcast immediate alerts with threat-specific safety protocols, and empower community members with real-time early warnings, local advisories, and interactive survival guides.

---

## 🌟 Key Features

### 1. User Authentication & Role-Based Access Control
- **Secure Authentication**: JWT (JSON Web Token) based authentication with BCrypt password hashing.
- **Two Roles**:
  - **Administrator (`ROLE_ADMIN`)**: Disaster command authority to publish, update, and manage emergency broadcasts, view analytical dashboards, and oversee registered community citizens.
  - **Community User (`ROLE_COMMUNITY_USER`)**: Local residents who receive prioritized alerts, filter advisories by geographic area, follow safety checklists, and acknowledge receipt.
- **1-Click Quick Demo Login**: Instant login buttons for demonstration.

### 2. Administrator Command Dashboard
- **Real-time KPI Metrics**: Total registered citizens, active disaster alerts, critical emergencies, and resolved advisories.
- **Interactive Visualizations (Recharts)**:
  - Disaster Category Breakdown (Pie/Donut chart)
  - Threat Severity Distribution (Bar chart)
- **Live Broadcast Feed**: Rapid status toggling (`ACTIVE`, `RESOLVED`, `EXPIRED`) and quick alert creation.

### 3. Disaster Alert Management (Full CRUD)
- **7 Disaster Classifications**: `FLOOD`, `CYCLONE`, `EARTHQUAKE`, `FIRE`, `LANDSLIDE`, `TSUNAMI`, `OTHER`.
- **4 Severity Danger Levels**: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` (with pulsating badges and audio siren capability).
- **Safety Protocol Templates**: 1-click standard survival instruction insertion for all hazard types.
- **Geographic Targeting**: City/district-level tagging for granular regional reach.
- **Confirmation Safety Modals**: Guarded actions before broadcasting or deleting alerts.

### 4. Community User Command Hub
- **Location-Aware Filtering**: Toggle between local district alerts and all-region advisories.
- **Life-Safety Checklist**: Interactive checkboxes for citizens to track emergency preparation steps.
- **1-Click Read Acknowledgment**: Instant feedback and timestamp recording of citizen receipt.
- **Historical Alerts Archive**: Review past disaster advisories and recovery notices.

### 5. Emergency Safety Guidelines Handbook
- Comprehensive survival manuals for Floods, Cyclones, Earthquakes, Fires, Landslides, and Tsunamis.
- Detailed **DO's** (crucial survival actions) & **DON'Ts** (fatal mistakes to avoid).
- **72-Hour Go-Bag Kit Essentials**: Recommended emergency gear for households.
- **Printable Manual Format**: Browser-optimized print mode for offline emergency binder storage.

### 6. Community Citizen Management
- Directory of all registered community members.
- Search by name, email, or phone number; filter by district.
- Account status activation and deactivation toggle.
- Citizen engagement metrics tracking alert acknowledgment rates.

### 7. Incident History & Analytics
- Complete incident archive with date/time stamps and acknowledgment counts.
- Export analytics dataset as **CSV format**.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React.js 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios, Canvas Confetti, Web Audio API |
| **Backend** | Java 21 / 24, Spring Boot 3.3.x, Spring Web, Spring Security, Spring Data JPA, Hibernate, JJWT 0.12 |
| **Database** | MySQL (Production profile) / H2 In-Memory & File DB (Default zero-config profile) |
| **Build Tools** | Apache Maven 3.9+, Node.js 18+ / npm |

---

## 📋 Default Demo Accounts

The system seeds realistic sample data on first run:

| Role | Email | Password | Assigned Location |
|---|---|---|---|
| **Administrator** | `admin@disaster.org` | `Admin@123` | Central Command HQ |
| **Community User** | `sarah.chen@example.com` | `User@123` | Coastal Region Alpha |
| **Community User** | `marcus.vance@example.com` | `User@123` | Mountain Valley District |
| **Community User** | `priya.patel@example.com` | `User@123` | River Basin Zone |
| **Community User** | `david.kim@example.com` | `User@123` | Metro Central |
| **Community User** | `elena.rostova@example.com` | `User@123` | Highland Ridge |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java JDK 17, 21, or 24** installed and configured on `PATH`.
- **Node.js 18+ and npm** installed.

---

### Step 1: Start the Spring Boot Backend

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Or on Windows if Maven is in local wrapper:* `& "C:\Users\<user>\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd" spring-boot:run`*)*

3. The backend will start on **`http://localhost:8080`**.
   - H2 Console is accessible at: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:disaster_db` (Username: `sa`, Password: empty)

#### Optional: Running with MySQL
To use MySQL instead of H2:
1. Ensure MySQL is running on port `3306`.
2. Run with the MySQL profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   *The MySQL connection string is configured in `src/main/resources/application-mysql.properties`.*

---

### Step 2: Start the React Frontend

1. Open a second terminal in the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user (`ADMIN` or `COMMUNITY_USER`).
- `POST /api/auth/login` — Authenticate and receive a JWT Bearer token.
- `GET /api/auth/me` — Fetch currently authenticated user profile.
- `PUT /api/auth/profile` — Update user profile and password.

### Disaster Alerts (`/api/alerts`)
- `GET /api/alerts/active` — Public/Auth: Retrieve active alerts prioritized by severity.
- `GET /api/alerts` — Filter alerts by `status`, `disasterType`, `severity`, `location`, or `search`.
- `GET /api/alerts/history` — Fetch historical and archived alerts.
- `GET /api/alerts/{id}` — Fetch detailed alert record.
- `POST /api/alerts` — *(Admin)* Create and broadcast a new disaster alert.
- `PUT /api/alerts/{id}` — *(Admin)* Update an existing disaster alert.
- `PATCH /api/alerts/{id}/status` — *(Admin)* Quick toggle alert status (`ACTIVE`, `RESOLVED`, `EXPIRED`).
- `DELETE /api/alerts/{id}` — *(Admin)* Delete an alert.

### Citizen Read Acknowledgments (`/api/alerts`)
- `POST /api/alerts/{id}/read` — Citizen marks alert as read & acknowledged.
- `GET /api/alerts/my-read-status` — List of all alert IDs acknowledged by current user.
- `GET /api/alerts/{id}/readers` — *(Admin)* View list of all citizens who acknowledged the alert.

### Community Management (`/api/admin/users`)
- `GET /api/admin/users` — *(Admin)* List registered citizens with location and search filters.
- `GET /api/admin/users/locations` — *(Admin)* List distinct registered districts.
- `PATCH /api/admin/users/{id}/status` — *(Admin)* Activate or deactivate a user account.
- `DELETE /api/admin/users/{id}` — *(Admin)* Delete a user record.

### Safety Guidelines (`/api/safety-guidelines`)
- `GET /api/safety-guidelines` — Retrieve all emergency guidelines.
- `GET /api/safety-guidelines/{disasterType}` — Retrieve guideline for a specific hazard.
- `POST /api/safety-guidelines` — *(Admin)* Update or create emergency instructions.

### Analytics & Dashboard (`/api/analytics`)
- `GET /api/analytics/dashboard` — *(Admin)* Get comprehensive command center statistics.
- `GET /api/analytics/user-dashboard` — Citizen personalized district statistics.

---

## 🔒 Security Architecture
- Stateless JWT Authorization via `JwtAuthenticationFilter`.
- Passwords encrypted with `BCryptPasswordEncoder` (10 rounds).
- Granular method security via `@PreAuthorize("hasAuthority('ROLE_ADMIN')")`.
- Dynamic CORS configuration allowing multi-port frontend dev servers.
