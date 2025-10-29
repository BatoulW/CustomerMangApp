# CustomerMangApp

A **Customer Order Tracking Dashboard** web application where users can create customers. generates automatically orders every 1 min, and see live order updates.

---

## 🌟 Features

- Customer Management (CRUD)
- Automatic order generation per customer
- Real-time order updates on the dashboard **(NOT WORKING)**
- Orders list
- Angular 20 frontend with Material UI
- .NET 8 backend using EF Core and BackgroundService for order simulation

---

## 🧰 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Angular 20, Angular Material, RxJS |
| Backend   | .NET 8 Web API, Entity Framework Core, BackgroundService |SignalR
| Database  | SQL Server LocalDB |

---

## 📂 Project Structure
CustomerMangApp/
- CustomerMangApp.API/  --> .NET 8 Web API project
- CustomerMangApp.UI/   --> # Angular 20 frontend project
- CustomerMangApp.sln 
- DatabaseScript 
- README.md
---

## ⚙️ Prerequisites

- Visual Studio 2022 Community
- .NET 8 SDK
- Node.js + npm (for Angular)
- SQL Server LocalDB

---

## 📝 Backend Setup (ASP.NET Core API)

1. Open `CustomerMangApp.sln` in Visual Studio 2022.
2. Open Package Manager Console, set default project to `CustomerMangApp.API`.
3. execute **CustMang Scripts.sql** to create the database manually.
4. Run the API project.

## ⚠️ Note on API Port
This project’s backend API is currently configured to run on **port 7116**:
If your machine assigns a different port when running the API, you will need to **update the Angular frontend** to match that port.

Update **`apiUrl`** in **cust-manag.service.ts** to match your API port. 

## 📝 Frontend Setup (Angular 20 UI)

1. Open terminal in CustomerMangApp.UI.

2. Run below commande:
   - npm install
   - ng serve

3. Open browser: http://localhost:4200


 
