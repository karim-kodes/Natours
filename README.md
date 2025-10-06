# 🌍 Natours Tour Booking Application

**Natours** is a full-featured, responsive tour booking web application built with Node.js, Express, MongoDB, and Pug. It allows users to browse, book, and review exciting tours around the world.

## 🚀 Features

- User authentication (sign up, log in, password reset)
- Role-based access (user, admin, guide, lead-guide)
- Tour browsing and filtering
- Tour detail pages with reviews and maps
- Secure online payments with Stripe
- Account management (update info, change password)
- Admin dashboard for managing tours, users, and reviews
- Email notifications for sign-up and password reset

## 🧰 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: Pug templates, HTML/CSS/JavaScript
- **Authentication**: JSON Web Tokens (JWT)
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Security**: Helmet, rate limiting, sanitization, etc.
- **Dev Tools**: Nodemon, Postman, ESLint

## 📂 Project Structure

│
├── controllers/ # Route controllers
├── models/ # Mongoose models
├── routes/ # Express routes
├── dev-data/ # Sample tour/user/review data
├── public/ # Static assets (CSS, images, JS)
├── views/ # Pug templates
├── utils/ # Utility functions
├── app.js # Main Express app setup
├── server.js # Entry point
├── config.env # Environment variables (not pushed to GitHub)
└── package.json # Project metadata and scripts

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/karim-kodes/natours.git
   cd natours
   ```
   npm install
2. **Install dependencies**

npm install

3. **Create environment variables**

Create a file named config.env in the root directory and add:

PORT=3000
NODE_ENV=development
DATABASE=<your-mongo-uri>
DATABASE_PASSWORD=<your-password>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=your-email
EMAIL_PASSWORD=your-email-password
STRIPE_SECRET_KEY=your-stripe-key

4. **Run the development server**

npm run dev

5. **Import sample data (optional)**

npm run import:dev-data

🌐 Live Demo

Coming soon

🛡️ Security Features

Data sanitization against NoSQL injection and XSS

Rate limiting to prevent brute-force attacks

Helmet to secure HTTP headers

CORS support

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License

This project is open-source and available under the MIT License.

👨‍💻 Author

Abdikarim Mohamed Abdi
