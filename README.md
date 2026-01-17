# Notodo | Productivity Manager

**Notodo** is a comprehensive productivity application designed to streamline daily tasks and thought organization. Built with the MERN stack, it offers a seamless, mobile-responsive experience with secure authentication and real-time database synchronization.

---

## Live Application

**View the Live Deployment here:** [https://notodo-app-deploy.vercel.app](https://notodo-app-deploy.vercel.app)

**Important Note on Performance:**
The backend is hosted on a free-tier server. If the application has not been accessed recently, the **initial login or data fetch may take up to 60 seconds** while the server wakes up. Subsequent requests will be instantaneous.

---

## Key Features

**Authentication**
* Secure user registration and login using JSON Web Tokens (JWT).
* Guest Login mode for instant access without account creation.
* Password hashing using Bcrypt for enhanced security.

**Task Management**
* Full CRUD (Create, Read, Update, Delete) capabilities for tasks.
* Status tracking with visual completion indicators.
* Clean, minimalist dashboard interface.

**Smart Notes**
* Create rich text notes with title and content.
* **Pinning System:** Mark important notes to keep them at the top of the grid.
* **Categorization:** Organize notes by custom categories (Work, Personal, Ideas).
* **Search & Filter:** Real-time search functionality to locate information quickly.

**User Interface**
* **Mobile First Design:** Fully responsive layout that adapts to phones, tablets, and desktops.
* **Responsive Navigation:** Custom navigation bar optimized for mobile usage.
* **Interactive Feedback:** Toast notifications for success and error states.

---

## Technical Stack

**Frontend**
* React.js (Vite)
* Tailwind CSS
* Axios
* React Router DOM

**Backend**
* Node.js
* Express.js
* Mongoose (ODM)

**Database**
* MongoDB Atlas (Cloud)

**Deployment**
* **Client:** Vercel
* **Server:** Render

---

