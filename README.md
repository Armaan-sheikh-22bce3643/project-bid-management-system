# Project Bid Management System (PBMS)

A full-stack web application designed to manage business opportunities, bids, projects, meetings, and internal request forms through a centralized platform.

## Overview

The Project Bid Management System (PBMS) provides a structured workflow for tracking business opportunities and managing project-related activities.

The application combines a React frontend with a Java Spring Boot backend and a MySQL database.

## Key Features

- **Authentication:** User login with JWT-based authentication.
- **Dashboard:** Centralized overview of the application.
- **Opportunity Management:** Manage and track business opportunities.
- **Bid Management:** Organize and manage bids.
- **Project Management:** Maintain project information.
- **Meeting Management:** Manage meeting records.
- **Internal Request Forms (IRF):** Manage internal requests.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite, Tailwind CSS |
| Backend | Java, Spring Boot, Spring Security |
| Database | MySQL |
| Authentication | JWT |
| Infrastructure | Docker, Docker Compose |
| Build Tools | Maven, npm |
| Version Control | Git, GitHub |

## Project Structure

```text
project-management-system/
├── backend/
│   └── pms/
├── frontend/
├── infra/
│   └── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Java and Maven
- Node.js and npm
- Docker Desktop

### 1. Clone the repository

```bash
git clone https://github.com/Armaan-sheikh-22bce3643/project-bid-management-system.git
cd project-bid-management-system
```

### 2. Configure the database

Create a file named `infra/.env` with your local development credentials:

```env
MYSQL_ROOT_PASSWORD=your_root_password
DB_PASSWORD=your_database_password
```

Start MySQL:

```bash
cd infra
docker compose up -d
cd ..
```

### 3. Start the backend

Configure the `DB_PASSWORD` environment variable to match your database configuration.

From the project root, run:

```powershell
cd backend/pms
.\mvnw.cmd spring-boot:run
```

The backend runs at:

`http://localhost:8080`

### 4. Start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## Future Improvements

- Role-based access control
- Advanced search and filtering
- Reporting and analytics
- Deployment to a cloud hosting platform
- Automated testing and CI/CD pipelines

## Author

**Mohammad Armaan Sheikh**

GitHub: [Armaan-sheikh-22bce3643](https://github.com/Armaan-sheikh-22bce3643)