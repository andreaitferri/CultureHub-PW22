# CultureHub

### Digitalizzazione dei processi aziendali in un'impresa culturale

**Project Work 22 – Università Telematica Pegaso**

**Corso di Laurea:** Informatica per le Aziende Digitali (L-31)  
**Tema 1:** La digitalizzazione dell'impresa  
**Settori scientifico-disciplinari:** INF/01 – Informatica; ING-IND/35 – Ingegneria Economico-Gestionale

---

## About the Project

CultureHub is a full-stack web application developed as part of the Project Work 22 for the Bachelor's Degree in Informatica per le Aziende Digitali at Università Telematica Pegaso.

The project demonstrates how digital technologies can improve the management of cultural organizations, such as foundations, museums, galleries and cultural associations.

The platform is designed for a simulated cultural foundation and centralizes the management of cultural collections, events, reservations, users and feedback.

## Main Features

- **Digital Catalog:** management of cultural works and categories.
- **Event Management:** creation and administration of cultural events.
- **Online Bookings:** event reservations with capacity controls.
- **User Management:** authentication and role-based access control.
- **Feedback Management:** collection and moderation of visitor feedback.
- **Admin Dashboard:** overview of activities and operational indicators.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| API | REST, HTTP, JSON |
| Authentication | JWT |
| Testing | Python unittest, Playwright |

## Architecture

CultureHub follows a client-server architecture:

**React Frontend → REST API → FastAPI Backend → PostgreSQL Database**

The application separates the user interface, business logic and data persistence layers.

## Repository Structure

```text
CultureHub-PW22/
├── frontend/
├── backend/
├── docs/
└── README.md
```

## Documentation

The project documentation covers:

- System architecture and technical choices
- Database schema and entity relationships
- UML diagrams
- REST API documentation
- Installation and execution instructions
- Functional tests and usage scenarios
- Prototype limitations and possible future developments

## Project Scope

CultureHub is an academic prototype developed for a simulated cultural organization. It is not a production deployment.

The project focuses on the digitalization of business processes and the practical application of software architecture, database management and web development concepts.

## Author

**Andrea Ferri**  
Università Telematica Pegaso  
Informatica per le Aziende Digitali (L-31)

## Academic Purpose

This repository contains the source code and technical documentation developed for Project Work 22.

The project is intended for educational and demonstration purposes.
