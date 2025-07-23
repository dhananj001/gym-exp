# Gym‑Exp – Modern Gym Management Web App

**Gym‑Exp** is a production-ready Gym Management System tailored for gym owners to manage memberships, payments, and monitor growth trends through an interactive dashboard. Built using **React** (with **Shadcn/UI** and **Tailwind CSS**) for a rich user experience, and **Laravel 12** (with **MySQL** and **Eloquent ORM**) for a robust backend.

> This full-stack project demonstrates end-to-end architecture ideal for real-world business needs.

---

## Features

### Dashboard Overview

* **Stats at a Glance**:

  * ✅ Total Members
  * 🟢 Active Members
  * 🔴 Expired Members
  * 💰 Total Revenue

* **Visual Charts**:

  * Monthly New Members Trend (Line Chart)
  * Monthly Revenue Trend (Line Chart)
    
> Visual Representation of Charts
  
  <img width="1901" height="972" alt="image" src="https://github.com/user-attachments/assets/5a52e492-e929-4320-8c25-2ad2a1dea9b5" />
  
  * Membership Type Distribution (Pie Chart)
  * Payment Status Distribution (Bar Chart)

> Visual Representation of Charts

  <img width="1890" height="969" alt="image" src="https://github.com/user-attachments/assets/cda74589-19a5-4b78-8241-928d5695380a" />

  * **Recent Members** section with quick access

---

### 👥 Member Management

* **Member List**:

  * Search by name or email
  * Filter by: All, Active, Expired
 
> Visual Representation of Members List [GIF]

![Members List](https://github.com/user-attachments/assets/12ce42fa-805a-4080-bd79-da7854e3a340)


* **Member Details Modal**:

  * Full personal & membership info
  * Shows:

    * Membership expiry countdown
    * Payment status badge (Paid / Unpaid)
   
> Visual Representation of Member Details Modal

<img width="1573" height="819" alt="image" src="https://github.com/user-attachments/assets/fe843e8c-4cdb-419e-bcf6-91ee1cb324e6" />


* **Add New Member Form**:

  * Split into two compact steps:

    * **Step 1** – Personal Information

      * Name, Email, Phone, Birthdate (with auto age calculation), Gender, Address
    * **Step 2** – Membership Information

      * Type (1 / 3 / 6 months or 1 year)
      * From → To date auto-calculation
      * Payment details (amount, status, method)
      * 
> Visual Representation of Add New Member Form [GIF]

![add new member](https://github.com/user-attachments/assets/8cf295fe-0a80-4464-8977-ea7ad94346bd)

---

### UI / UX Highlights

* Responsive layout using **Tailwind CSS v4**
* Component-based UI with **Shadcn/UI** (Radix-based)
* Built-in **Dark Mode** toggle
* Compact and dynamic form steps for better usability

> Visual Representation of Dark Mode

<img width="1523" height="825" alt="image" src="https://github.com/user-attachments/assets/7e28c8af-511b-4524-88cb-ca0cedbfef99" />

---

## Application Architecture

This project is structured using a modern full-stack MVC approach:

* **Laravel 12** (Backend):

  * Handles **routing**, **controllers**, **models**, **validation**, and **authentication**
  * Uses **Eloquent ORM** to interact with a **MySQL** database
  * Exposes clean API endpoints for frontend consumption

* **React + Inertia.js** (Frontend):

  * Acts as the **View** layer in the MVC pattern
  * Enables dynamic, JavaScript-powered UI with a **SPA-like experience**
  * Communicates with Laravel via Inertia responses instead of REST or GraphQL

>  This hybrid Laravel + React architecture provides the power of structured backend logic with the flexibility of modern frontend interactivity.

---

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | **React**, Shadcn/UI, Tailwind CSS v4          |
| Backend  | **Laravel 12**, PHP 8.2+, Inertia.js           |
| Database | **MySQL** with **Eloquent ORM**                |
| Styling  | Tailwind CSS + Radix-based components          |
| Charts   | Charting libraries (e.g., Chart.js / Recharts) |
| Tooling  | Vite, Composer, npm, Artisan                   |

---

## Getting Started

### 1⃣ Clone the Repository

```bash
git clone https://github.com/dhananj001/gym-exp.git
cd gym-exp
```

### 2⃣ Backend Setup (Laravel + MySQL)

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

> Configure your `.env` to connect to your MySQL database.

### 3⃣ Frontend Setup (React + Tailwind + Shadcn)

```bash
npm install
npm run dev
```

---

## Folder Structure (Simplified)

```
gym-exp/
├── app/                # Laravel Controllers, Models
├── resources/
│   ├── js/             # React Pages, Components
│   └── views/          # Optional Blade files
├── routes/web.php      # Laravel Routes
├── public/             # Static Assets
├── tailwind.config.js  # TailwindCSS Config
└── .env                # Environment Variables
```

---

## Future Enhancements

* 🧾 Invoicing & PDF Receipt Generation
* 🗓️ Workout scheduling and calendar view
* 🢑 Role-based permissions (Admin / Trainer)
* 📦 Docker + CI/CD for deployment

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Made with 💻 by [Dhananjay Borse](https://github.com/dhananj001) 
