Saya telah melihat gambar yang Anda bagikan, yang menunjukkan daftar file di folder `migrations` dan `seeders` untuk proyek Knowlytics MVP. Berdasarkan file-file tersebut, saya dapat memperbarui `README.md` untuk mencerminkan struktur database yang lebih lengkap, termasuk tabel-tabel tambahan seperti `Categories`, `Lessons`, `UserProfiles`, dan `CourseCategories`, serta hubungan antar tabel yang sesuai. Saya juga akan memperbarui bagian **Sequelize CLI Commands** untuk mencakup perintah pembuatan model dan migrasi yang sesuai dengan file yang ada.

Berikut adalah `README.md` yang telah diperbarui:

---

# Knowlytics MVP

![Knowlytics Banner](https://via.placeholder.com/1200x300.png?text=Knowlytics+-+Minimal+EdTech+Platform)

**Knowlytics MVP** is a minimal implementation of an Education Technology (EdTech) platform designed to demonstrate core functionality for online learning. Users can register as either students or instructors, log in, and browse courses. Students can purchase existing courses using Stripe, while instructors cannot create courses. Invoices are generated using EasyInvoice after each successful purchase, providing a seamless experience for tracking transactions.

This MVP focuses on essential features to validate the concept, with plans for future enhancements like email notifications, file uploads, and additional analytics.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema (ERD)](#database-schema-erd)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Sequelize CLI Commands](#sequelize-cli-commands)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **User Authentication**:

  - Secure registration and login system using session management (`express-session`) and password hashing with `bcrypt`.
  - Role-based access for Students and Instructors.
  - Token-based integration with Stripe using `jsonwebtoken` for customer management.

- **Role-Based Access**:

  - **Student**: Browse courses, purchase courses via Stripe, and view purchased courses.
  - **Instructor**: Create courses (linked via `userId` in `Courses`).

- **Course Management**:

  - Browse courses and view course details.
  - Purchase courses using Stripe (for Students).
  - Instructors can add courses through a simple interface.

- **Payment Integration**:

  - Integrated with Stripe (`stripe`) for secure online payments.
  - Supports payment processing for course purchases.

- **Invoice Generation**:
  - Generates PDF invoices using EasyInvoice (`easyinvoice`) after successful purchases.
  - Invoices are stored locally for record-keeping.

---

## Technologies Used

### Backend

- **Express.js**: Web framework for Node.js to handle routing and server logic.
- **Sequelize**: ORM for PostgreSQL to manage database models, migrations, and seeders.
- **PostgreSQL**: Database for storing user, course, and purchase data.
- **bcrypt**: For secure password hashing.
- **express-session**: For session management.
- **jsonwebtoken (JWT)**: For token-based authentication with Stripe.
- **easyinvoice**: For generating PDF invoices after purchases.
- **stripe**: For payment processing and customer management.
- **dotenv**: For managing environment variables (e.g., Stripe and EasyInvoice credentials).

### Frontend

- **HTML/EJS**: Templating engine for rendering dynamic views.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern styling.

### Language

- **JavaScript**: For both backend (Node.js) and frontend logic.

---

## Database Schema (ERD)

The project uses the following tables with their relationships:

- **Users**: Stores user data (`id`, `username`, `email`, `password`, `role` where `role` is either `student` or `instructor`).
- **Courses**: Stores course data (`id`, `name`, `description`, `price`, `userId`).
- **UserCourses**: Junction table for **Many-to-Many** relationship between `Users` (Students) and `Courses` (purchases), with `stripePaymentId` to track payments.
- **Categories**: Stores category data (`id`, `name`).
- **CourseCategories**: Junction table for **Many-to-Many** relationship between `Courses` and `Categories`.
- **Lessons**: Stores lesson data (`id`, `title`, `content`, `courseId`).
- **UserProfiles**: Stores user profile data (`id`, `fullName`, `phone`, `userId`).

### Relationships

- **One-to-Many**: `Users` → `Courses` (via `userId` in `Courses` where `userId` links to an Instructor).
- **Many-to-Many**: `Users` ↔ `Courses` (via `UserCourses` for student purchases).
- **Many-to-Many**: `Courses` ↔ `Categories` (via `CourseCategories`).
- **One-to-Many**: `Courses` → `Lessons` (via `courseId` in `Lessons`).
- **One-to-One**: `Users` → `UserProfiles` (via `userId` in `UserProfiles`).

Below is the ERD for the Knowlytics database:

![Knowlytics ERD](https://drive.google.com/u/0/drive-viewer/AKGpihaeGL60c9CG-c7-QkQTzN_7L_fxOWvTnf7qOTQ28LHWMo_ZN0euC0X5Q9vnmCwRzC8lRsfBamJlTtco1l1stFA0sjLxks92iQ=s1600-rw-v1)

---

## Project Structure

```
knowlytics/
├── config/
│   ├── config.json           # Database configuration for Sequelize
│   └── stripe.js             # Stripe configuration
├── data/
│   ├── users.json            # Seed data for Users
│   ├── courses.json          # Seed data for Courses
│   ├── categories.json       # Seed data for Categories
│   ├── lessons.json          # Seed data for Lessons
│   ├── userCourses.json      # Seed data for UserCourses
│   ├── courseCategories.json # Seed data for CourseCategories
│   └── userProfiles.json     # Seed data for UserProfiles
├── migrations/               # Sequelize migrations
├── models/                   # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── course.js
│   ├── category.js
│   ├── lesson.js
│   ├── userProfile.js
│   ├── userCourse.js
│   └── courseCategory.js
├── seeders/                  # Sequelize seeders
├── controllers/
│   └── controller.js         # All controller logic
├── views/
│   ├── partials/
│   │   └── navbar.ejs       # Navbar partial
│   ├── landing.ejs          # Landing page
│   ├── login.ejs            # Login page
│   ├── register.ejs         # Register page
│   ├── courses.ejs          # List of courses
│   ├── courseDetail.ejs     # Course detail page
│   ├── myCourses.ejs        # List of purchased courses
│   └── instructor/
│       ├── courses.ejs      # Instructor course management
│       └── addCourse.ejs    # Form to add a course
├── routes/
│   ├── index.js             # Routes for user-related functionality
│   └── instructorRouter.js  # Routes for instructor-related functionality
├── invoices/                # Folder for generated invoices
├── .env                     # Environment variables (e.g., Stripe credentials)
├── .gitignore               # Git ignore file
├── app.js                   # Main application file
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## Prerequisites

Before setting up Knowlytics MVP, ensure you have the following installed:

- **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (v12 or higher): [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm** (v6 or higher): Included with Node.js installation
- **Git**: [Download Git](https://git-scm.com/downloads) (for cloning the repository)
- **Stripe Account**: Register at [Stripe](https://stripe.com/) to obtain your `STRIPE_SECRET_KEY`.
- **EasyInvoice Account**: Register at [EasyInvoice](https://app.budgetinvoice.com/register) to obtain your `EASYINVOICE_API_KEY`.

---

## Installation

Follow these steps to set up and run Knowlytics MVP on your local machine:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/knowlytics.git
   cd knowlytics
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This will install all required packages, including:

   - `express`
   - `sequelize`
   - `pg` (PostgreSQL driver)
   - `express-session`
   - `bcryptjs`
   - `jsonwebtoken`
   - `ejs`
   - `easyinvoice`
   - `stripe`
   - `dotenv`

3. **Setup PostgreSQL Database**:

   - Create a PostgreSQL database named `Knowlytics_DB`:
     ```bash
     psql -U postgres -c "CREATE DATABASE Knowlytics_DB;"
     ```
   - Update the `config/config.json` file with your database credentials:
     ```json
     {
       "development": {
         "username": "postgres",
         "password": "postgres",
         "database": "Knowlytics_DB",
         "host": "localhost",
         "dialect": "postgres",
         "idle": 500
       },
       "test": {
         "username": "postgres",
         "password": "postgres",
         "database": "Knowlytics_test",
         "host": "localhost",
         "dialect": "postgres",
         "idle": 500
       },
       "production": {
         "username": "postgres",
         "password": "postgres",
         "database": "knowlytics_prod",
         "host": "localhost",
         "dialect": "postgres",
         "idle": 500
       }
     }
     ```

4. **Setup Environment Variables**:

   - Create a `.env` file in the root directory and add your credentials:
     ```env
     STRIPE_SECRET_KEY=your-stripe-secret-key
     EASYINVOICE_API_KEY=your-easyinvoice-api-key
     ```
   - Replace `your-stripe-secret-key` with your Stripe secret key (obtainable from the Stripe Dashboard).
   - Replace `your-easyinvoice-api-key` with your EasyInvoice API key (obtainable after registering at EasyInvoice).
   - Ensure `.env` is added to `.gitignore`:
     ```gitignore
     node_modules/
     .env
     invoices/
     ```

5. **Setup Stripe and EasyInvoice**:

   - **Stripe**: Register for a Stripe account at [Stripe](https://stripe.com/) to get your `STRIPE_SECRET_KEY`. Use test mode for development.
   - **EasyInvoice**: Register at [EasyInvoice](https://app.budgetinvoice.com/register) to get your `EASYINVOICE_API_KEY`. The free tier allows up to 25 invoices per 15 days.

6. **Run Migrations**:

   ```bash
   npx sequelize-cli db:migrate
   ```

   This will create the tables:

   - `Users`
   - `Courses`
   - `Categories`
   - `UserCourses`
   - `CourseCategories`
   - `Lessons`
   - `UserProfiles`

7. **Run Seeders**:

   ```bash
   npx sequelize-cli db:seed:all
   ```

   This will populate the database with sample data for:

   - Users (with roles: `student`, `instructor`)
   - Courses
   - Categories
   - Lessons
   - UserCourses
   - CourseCategories
   - UserProfiles

8. **(Optional) Setup Tailwind CSS Locally**:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

   Update `tailwind.config.js`:

   ```javascript
   module.exports = {
     content: ["./views/**/*.ejs"],
     theme: { extend: {} },
     plugins: [],
   };
   ```

   Create `public/css/input.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   Add script to `package.json`:

   ```json
   "scripts": {
     "build:css": "tailwindcss -i ./public/css/input.css -o ./public/css/output.css --watch"
   }
   ```

   Run:

   ```bash
   npm run build:css
   ```

9. **Run the Application**:

   ```bash
   node app.js
   ```

   The application will be running at `http://localhost:3000`.

---

## Usage

1. **Register and Login**:

   - Visit `http://localhost:3000/register` to create an account (choose role: `student` or `instructor`).
   - Login at `http://localhost:3000/login`.

2. **Browse and Purchase Courses**:

   - Go to `http://localhost:3000/courses` to browse available courses.
   - Click "View Details" to see course information.
   - Students can purchase a course via Stripe by clicking "Daftar Sekarang" on the course detail page.
   - After a successful purchase, an invoice will be generated and saved in the `invoices/` folder.

3. **View Purchased Courses**:

   - Students can see their purchased courses at `http://localhost:3000/my-courses`.

4. **Instructor Dashboard**:

   - Instructors can manage courses at `http://localhost:3000/instructor/courses`.
   - Add new courses via `http://localhost:3000/instructor/courses/add`.

---

## Sequelize CLI Commands

The following Sequelize CLI commands were used to create models, migrations, and seeders:

```bash
# Initialize Sequelize
npx sequelize-cli init

# Create Models and Migrations
npx sequelize-cli model:generate --name User --attributes "username:string,email:string,password:string,role:string"
npx sequelize-cli model:generate --name Course --attributes "name:string,description:string,price:integer,userId:integer"
npx sequelize-cli model:generate --name Category --attributes "name:string"
npx sequelize-cli model:generate --name Lesson --attributes "title:string,content:string,courseId:integer"
npx sequelize-cli model:generate --name UserProfile --attributes "fullName:string,phone:string,userId:integer"

# Create Junction Tables
npx sequelize-cli migration:generate --name create-user-courses
npx sequelize-cli migration:generate --name create-course-category

# Add Foreign Key Constraints
npx sequelize-cli migration:generate --name add-fk-constraint-to-userCourses-userId
npx sequelize-cli migration:generate --name add-fk-constraint-to-userCourses-courseId
npx sequelize-cli migration:generate --name add-fk-constraint-to-courseCategories-courseId
npx sequelize-cli migration:generate --name add-fk-constraint-to-courseCategories-categoryId
npx sequelize-cli migration:generate --name add-fk-constraint-to-userProfiles-userId
npx sequelize-cli migration:generate --name add-fk-constraint-to-lessons-courseId

# Run Migrations
npx sequelize-cli db:migrate

# Run Seeders
npx sequelize-cli db:seed:all
```

---

## Contributing

We welcome contributions to improve Knowlytics MVP! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any inquiries, please contact:

- **Fadhal** (fadhal.kerja@gmail.com)
- **Iqbal** (iqbalfarhan13@yahoo.com)

---

### Key Updates:

1. **Database Schema (ERD)**:

   - Added `Categories`, `CourseCategories`, `Lessons`, and `UserProfiles` tables based on the migration and seeder files.
   - Updated relationships to include the new tables, such as the Many-to-Many relationship between `Courses` and `Categories` via `CourseCategories`, One-to-Many between `Courses` and `Lessons`, and One-to-One between `Users` and `UserProfiles`.

2. **Project Structure**:

   - Added `categories.json`, `lessons.json`, `courseCategories.json`, and `userProfiles.json` to the `data/` folder to reflect the seeders.
   - Added corresponding model files (`category.js`, `lesson.js`, `userProfile.js`, `userCourse.js`, `courseCategory.js`) to the `models/` folder.

3. **Sequelize CLI Commands**:

   - Updated to include commands for generating the `Category`, `Lesson`, and `UserProfile` models, as well as the `CourseCategories` junction table.
   - Added commands for creating foreign key constraints as seen in the migration files.

4. **Installation**:
   - Updated the migration and seeder steps to include the new tables (`Categories`, `CourseCategories`, `Lessons`, `UserProfiles`).
