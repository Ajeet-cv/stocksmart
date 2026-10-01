# StockSmart — Enterprise Retail Inventory Management System

StockSmart is a full-stack Enterprise Retail Inventory Management System built with **Spring Boot 3**, **MySQL**, and **Angular 19**. It provides real-time stock tracking, product & category management, supplier coordination, purchase order workflows, Point of Sale (POS) sales management, and barcode lookup capabilities.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Angular 19 (Standalone Components, RxJS, ChangeDetectorRef)
- **Styling**: Tailwind CSS, Custom CSS Utilities, Lucide Icons
- **HTTP**: HttpClient with JWT Bearer Interceptor & Auth Guard

### Backend
- **Framework**: Java 17+, Spring Boot 3.x
- **Security**: Spring Security, JWT (JSON Web Tokens), BCrypt Password Encoder
- **Persistence**: Spring Data JPA / Hibernate, MySQL 8.0
- **Build Tool**: Apache Maven

---

## ✨ Key Features & Modules

- 🔒 **Authentication & Authorization**: Secure JWT-based Login & Registration with role-based access and password encryption.
- 📊 **Executive Dashboard**: Real-time KPI metric cards (Total Products, Stock Count, Valuation, Low Stock Alerts), Inventory Distribution chart, Recent Activity stream, and Quick Action controls.
- 📦 **Product Management**: Full CRUD operations for retail inventory products including SKU tracking, pricing, category linking, and reorder levels.
- 🏷️ **Category Management**: Categorize inventory items with active status indicators and automatic item counts.
- 🚚 **Supplier Management**: Vendor registry tracking contact details, email addresses, phone numbers, and physical addresses.
- 🏬 **Inventory Control**: Real-time stock balance tracking, low-stock warnings, healthy stock metrics, stock movements (Stock In / Stock Out), and location tracking.
- 🧾 **Purchase Orders**: Process itemized purchase receipts from suppliers with status tracking (*RECEIVED*, *PENDING*, *CANCELLED*).
- 🛒 **Point of Sale (POS)**: Checkout interface with real-time stock deduction, cart management, and bill total calculation.
- 🔍 **Barcode Lookup**: Rapid item lookup by scanning barcodes or searching SKUs.
- 🌱 **Database Seeder**: Pre-configured database initializer (`DataInitializer.java`) automatically seeding sample categories, suppliers, inventory items, and purchases.

---

## 📂 Directory Structure

```text
stocksmart/
├── backend/                             # Spring Boot Backend
│   ├── src/main/java/com/hcl/stocksmart/
│   │   ├── config/                      # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/                  # REST Controllers (Auth, Product, Category, Supplier, etc.)
│   │   ├── dto/                         # Request & Response DTOs
│   │   ├── entity/                      # JPA Entities (User, Product, Inventory, Purchase, etc.)
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JWT Filter & Token Utilities
│   │   └── service/                     # Business Logic Services
│   ├── src/main/resources/
│   │   └── application.properties       # DB connection & server port settings
│   └── pom.xml                          # Maven dependencies
│
├── frontend/                            # Angular 19 Frontend
│   ├── src/app/
│   │   ├── components/                  # UI Views (Dashboard, Products, Categories, POS, etc.)
│   │   ├── guards/                      # Angular Route Guards (AuthGuard)
│   │   ├── interceptors/                # AuthInterceptor for JWT injection
│   │   ├── models/                      # TypeScript Data Interfaces
│   │   └── services/                    # REST API Services
│   ├── package.json                     # Frontend dependencies
│   └── angular.json                     # Angular CLI configuration
│
├── .gitignore                           # Git ignore configurations
└── README.md                            # Project documentation
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **JDK**: Java 17 or higher
- **Node.js**: Node v18+ & npm
- **Database**: MySQL Server 8.0 running on localhost (default port `3307` or adjust in `application.properties`)

---

### Step 1: Database Setup
1. Open MySQL Client or Workbench.
2. Create the database schema:
   ```sql
   CREATE DATABASE IF NOT EXISTS stocksmart;
   ```

---

### Step 2: Configure & Launch Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Update database credentials in `src/main/resources/application.properties` if required:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3307/stocksmart?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   server.port=5656
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend server will start on `http://localhost:5656`.*

---

### Step 3: Install & Launch Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular dev server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:4200`.

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & obtain JWT token |
| `POST` | `/api/auth/register` | Register a new user account |
| `GET` | `/api/products` | Retrieve all products |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/categories` | Retrieve product categories |
| `GET` | `/api/suppliers` | Retrieve suppliers list |
| `GET` | `/api/inventory` | Retrieve stock levels & inventory records |
| `GET` | `/api/purchases` | Retrieve purchase orders |
| `POST` | `/api/purchases` | Create purchase order |
| `POST` | `/api/sales` | Record sales transaction |

---

## 📝 License

This project is created for demonstration and educational purposes. All rights reserved.
