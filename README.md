# GramiGo - Agricultural Equipment Booking Platform

GramiGo is a full-stack, mobile-first platform where farmers and agricultural workers can rent, book, or hire agricultural equipment (tractors, tillers, threshers, water pumps, etc.) on-demand. The platform supports real-time equipment availability, live tracking, driver/operator assignment, pricing, and booking.

## Features

### Farmer (Customer) Features
- Login/Signup (Mobile OTP, Google Auth)
- Location detection (GPS or manual pin drop)
- Equipment search (filter by type, location, availability)
- Real-time availability map (like Ola/Uber)
- Equipment detail page (images, specs, reviews, price/hr or per km)
- Instant booking or schedule in advance
- Live status updates (Booked > On the way > Working > Completed)
- Live tracking of equipment
- In-app messaging or call operator
- Online/offline payment option
- Booking history and repeat booking

### Equipment Owner/Operator Features
- Register and list equipment (with image, type, price, availability)
- Accept/decline bookings
- Set availability calendar
- GPS sharing for tracking
- View earnings and completed jobs
- Operator ratings/reviews

### Admin Features
- Approve equipment and owners
- Verify driver/operator ID
- Manage users
- Ban/suspend accounts
- View analytics (most booked equipment, peak times, location heatmaps)
- Revenue dashboard

### Additional Features
- Multilingual support (Hindi, English, Bhojpuri etc.)
- Voice search (for rural farmers)
- AI-powered smart suggestions (based on land size or crop type)
- Push notifications (status updates, discounts, alerts)
- Referral rewards system
- Crop-season based recommendations (e.g., during harvest season)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend (Web)**: React, Tailwind CSS
- **Frontend (Mobile)**: React Native
- **Real-time**: Socket.IO
- **Authentication**: JWT, OTP (Twilio)
- **Maps**: Google Maps API
- **Payments**: Razorpay / PhonePe

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/gramigo.git
cd gramigo
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gramigo
JWT_SECRET=your_jwt_secret
NODE_ENV=development
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Install frontend dependencies
```
cd ../frontend
npm install
```

5. Start the development servers
```
# In backend directory
npm run dev

# In frontend directory
npm start
```

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/send-otp` - Send OTP for phone verification
- `POST /api/auth/verify-otp` - Verify OTP

### User Routes
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/verify` - Verify user (admin only)
- `GET /api/users/dashboard` - Get user dashboard stats

### Equipment Routes
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `POST /api/equipment/:id/reviews` - Add review to equipment
- `PUT /api/equipment/:id/availability` - Update equipment availability
- `GET /api/equipment/nearby` - Get nearby equipment

### Booking Routes
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/tracking` - Update tracking information
- `POST /api/bookings/:id/rating` - Add rating for completed booking

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com). 