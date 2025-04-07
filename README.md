# Knowlytics

![Knowlytics Banner](https://via.placeholder.com/1200x300.png?text=Knowlytics+-+Empower+Knowledge+with+Analytics)

**Knowlytics** is a platform designed to empower users with knowledge through advanced data analytics. By combining learning tools with powerful analytical capabilities, it provides actionable insights for better decision-making. Ideal for projects focused on education, data science, and technology-driven solutions.

This project is an Education Technology (EdTech) platform where users can register, log in, browse courses, purchase courses using Midtrans Payment Gateway, and access learning materials (videos and PDFs). It includes role-based access for Buyers, Sellers, and Admins, with advanced analytics features such as course popularity statistics, purchase trends, and personalized course recommendations.

---

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
  - Secure registration and login system with middleware, session management (`express-session`), and password hashing using `bcrypt`.
  - Token-based authentication using `jsonwebtoken` (MVP feature).
- **Role-Based Access**:
  - **Buyer**: Browse courses, purchase courses via Midtrans, view purchased courses, see purchase history, and receive personalized course recommendations.
  - **Seller**: Create courses (via `userId` in `Courses`).
  - **Admin**: Perform CRUD operations on courses and view analytics (e.g., courses per category, popular courses).
- **Course Management**:
  - Browse courses with search and sort functionality (using Sequelize operators).
  - View course details, including videos (YouTube/Google Drive) and PDFs (Google Drive), accessible only after successful purchase.
  - Purchase courses using Midtrans Payment Gateway (for Buyers).
  - Admin can add, edit, and delete courses with interactive delete notifications.
- **Analytics and Insights**:
  - Admin dashboard with statistics:
    - Number of courses per category (visualized with Chart.js).
    - Top 5 popular courses based on purchases.
  - Purchase history with a graph of purchases per month (visualized with Chart.js).
  - Course recommendations for Buyers based on purchased categories.
- **Payment Integration**:
  - Integrated with Midtrans Payment Gateway for secure online payments.
  - Supports various payment methods (credit/debit cards, bank transfers, e-wallets) via Midtrans Snap.
- **Responsive Design**:
  - Built with Tailwind CSS for a modern, responsive UI.
  - Interactive notifications using SweetAlert2 (for delete confirmation) and Toastify-js (for success messages).

---

## Technologies Used

### Backend
- **Express.js**: Web framework for Node.js to handle routing and server logic.
- **Sequelize**: ORM for PostgreSQL to manage database models, migrations, and seeders.
- **PostgreSQL**: Database for storing user, course, and purchase data.
- **bcrypt**: For password hashing.
- **express-session**: For session management.
- **jsonwebtoken (JWT)**: For token-based authentication (MVP feature).
- **midtrans-client**: For integrating Midtrans Payment Gateway.
- **dotenv**: For managing environment variables (e.g., Midtrans credentials).

### Frontend
- **HTML/EJS**: Templating engine for rendering dynamic views.
- **Tailwind CSS**: Utility-first CSS framework for responsive and modern styling.
- **Chart.js**: For data visualization (graphs in analytics).
- **SweetAlert2**: For interactive delete confirmation with Promise Chaining.
- **Toastify-js**: For toast notifications after successful actions.

### Language
- **JavaScript**: For both backend (Node.js) and frontend logic.

---

## Database Schema (ERD)

The project uses the following tables with their relationships:

- **Users**: Stores user data (id, username, email, password, role).
- **UserProfiles**: Stores user profile data (id, userId, fullName, phone) - **One-to-One** with `Users`.
- **Courses**: Stores course data (id, name, description, duration, userId, videoUrl, pdfUrl).
- **Categories**: Stores category data (id, name).
- **CourseCategories**: Junction table for **Many-to-Many** relationship between `Courses` and `Categories`.
- **UserCourses**: Junction table for **Many-to-Many** relationship between `Users` (Buyers) and `Courses` (purchases).

### Relationships
- **One-to-One**: `Users` ↔ `UserProfiles` (via `userId`).
- **One-to-Many**: `Users` → `Courses` (via `userId`).
- **Many-to-Many**: 
  - `Courses` ↔ `Categories` (via `CourseCategories`).
  - `Users` ↔ `Courses` (via `UserCourses`).

Below is the ERD for the Knowlytics database:

![Knowlytics ERD](https://github.com/your-username/knowlytics/raw/main/images/erd.png)

---

## Project Structure

```
knowlytics/
├── config/
│   ├── config.json           # Database configuration for Sequelize
│   └── midtrans.js           # Midtrans configuration
├── data/
│   ├── users.json            # Seed data for Users
│   ├── userProfiles.json     # Seed data for UserProfiles
│   ├── courses.json          # Seed data for Courses
│   ├── categories.json       # Seed data for Categories
│   ├── courseCategories.json # Seed data for CourseCategories
│   └── userCourses.json      # Seed data for UserCourses
├── migrations/               # Sequelize migrations
├── models/                   # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── userProfile.js
│   ├── course.js
│   └── category.js
├── seeders/                  # Sequelize seeders
├── controllers/
│   └── controller.js         # All controller logic
├── views/
│   ├── partials/
│   │   └── navbar.ejs       # Navbar partial
│   ├── landing.ejs          # Landing page
│   ├── login.ejs            # Login page
│   ├── register.ejs         # Register page
│   ├── courses.ejs          # List of courses with search and recommendations
│   ├── courseDetail.ejs     # Course detail page with video and PDF
│   ├── myCourses.ejs        # List of purchased courses
│   ├── purchaseHistory.ejs  # Purchase history with analytics
│   └── admin/
│       ├── dashboard.ejs    # Admin dashboard with analytics
│       ├── courses.ejs      # Admin course management
│       ├── addCourse.ejs    # Form to add a course
│       └── editCourse.ejs   # Form to edit a course
├── routes/
│   └── index.js             # All routes
├── helpers/
│   └── helper.js            # Helper functions (formatDuration, formatDate)
├── middleware/
│   └── auth.js              # Authentication and authorization middleware
├── public/
│   └── css/                 # Tailwind CSS output (if using local Tailwind)
│       └── output.css
├── .env                     # Environment variables (e.g., Midtrans credentials)
├── .gitignore               # Git ignore file
├── app.js                   # Main application file
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## Prerequisites

Before setting up Knowlytics, ensure you have the following installed:

- **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (v12 or higher): [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm** (v6 or higher): Included with Node.js installation
- **Git**: [Download Git](https://git-scm.com/downloads) (for cloning the repository)

---

## Installation

Follow these steps to set up and run Knowlytics on your local machine:

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
   - `bcrypt`
   - `jsonwebtoken`
   - `ejs`
   - `sweetalert2`
   - `toastify-js`
   - `chart.js`
   - `midtrans-client` (for Midtrans Payment Gateway)
   - `dotenv` (for environment variables)

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
   - Create a `.env` file in the root directory and add your Midtrans credentials:
     ```env
     MIDTRANS_SERVER_KEY=YOUR_SERVER_KEY
     MIDTRANS_CLIENT_KEY=YOUR_CLIENT_KEY
     ```
   - Replace `YOUR_SERVER_KEY` and `YOUR_CLIENT_KEY` with your actual Midtrans credentials.
   - Ensure `.env` is added to `.gitignore` to prevent it from being uploaded to GitHub.

5. **Setup Midtrans Configuration**:
   - Register for a Midtrans account at [Midtrans](https://midtrans.com/).
   - Obtain your **Merchant ID**, **Client Key**, and **Server Key** from the Midtrans dashboard.
   - The credentials should be added to the `.env` file as shown above.
   - Configure the **Notification URL** in the Midtrans dashboard to point to `http://localhost:3000/midtrans-notification` (or your production URL).

6. **Run Migrations**:
   ```bash
   npx sequelize-cli db:migrate
   ```

   This will create the following tables:
   - `Users`
   - `UserProfiles`
   - `Courses`
   - `Categories`
   - `CourseCategories`
   - `UserCourses`

7. **Run Seeders**:
   ```bash
   npx sequelize-cli db:seed:all
   ```

   This will populate the database with sample data, including:
   - Users (with roles: `buyer`, `seller`, `admin`)
   - User profiles
   - Courses (with video and PDF URLs)
   - Categories
   - Course-Category relationships
   - Purchase history

8. **(Optional) Setup Tailwind CSS Locally**:
   If you prefer to use Tailwind CSS locally instead of the CDN:
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
   - Visit `http://localhost:3000/register` to create an account (choose role: `buyer` or `seller`).
   - Login at `http://localhost:3000/login`.
   - Admin account can be accessed using:
     - Email: `admin1@example.com`
     - Password: `admin12345`

2. **Browse and Purchase Courses**:
   - Go to `http://localhost:3000/courses` to browse available courses with search and sort functionality.
   - Click "View Details" to see course information.
   - Buyers can purchase a course via Midtrans Payment Gateway and access its video (YouTube/Google Drive) and PDF (Google Drive) materials after successful payment.

3. **View Purchased Courses and History**:
   - Buyers can see their purchased courses at `http://localhost:3000/my-courses`.
   - Purchase history with analytics (purchases per month) is available at `http://localhost:3000/purchase-history`.

4. **Admin Dashboard**:
   - Admins can access the dashboard at `http://localhost:3000/admin/dashboard` to view analytics:
     - Number of courses per category (bar chart).
     - Top 5 popular courses based on purchases.
   - Manage courses (CRUD) at `http://localhost:3000/admin/courses`.

---

## Sequelize CLI Commands

The following Sequelize CLI commands were used to create models and migrations:

```bash
# Initialize Sequelize
npx sequelize-cli init

# Create Models and Migrations
npx sequelize-cli model:generate --name User --attributes "username:string,email:string,password:string,role:string"
npx sequelize-cli model:generate --name UserProfile --attributes "userId:integer,fullName:string,phone:string"
npx sequelize-cli model:generate --name Course --attributes "name:string,description:string,duration:integer,userId:integer,videoUrl:string,pdfUrl:string"
npx sequelize-cli model:generate --name Category --attributes "name:string"

# Create Junction Tables
npx sequelize-cli migration:generate --name create-course-categories
npx sequelize-cli migration:generate --name create-user-courses

# Add Columns
npx sequelize-cli migration:generate --name add-videoUrl-and-pdfUrl-to-courses
```

---

## Contributing

We welcome contributions to improve Knowlytics! To contribute:

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
- **Iqbal** (iqbal@example.com)
