const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const config = require('./config/config');
const { errorHandler } = require('./utils/errorHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.ALLOWED_ORIGINS,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, config.UPLOAD_PATH)));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB connected successfully');
    
    // Only register routes that require database after successful connection
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/equipment', require('./routes/equipment'));
    app.use('/api/bookings', require('./routes/bookings'));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Server running in limited mode without database connection');
  }
};

// Default route
app.get('/', (req, res) => {
  res.send('GramiGo API is running');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle location updates
  socket.on('locationUpdate', (data) => {
    // Broadcast to specific room or client
    io.to(data.bookingId).emit('driverLocation', data);
  });
  
  // Handle booking status updates
  socket.on('statusUpdate', (data) => {
    io.to(data.bookingId).emit('bookingStatus', data);
  });
  
  // Join booking room
  socket.on('joinBooking', (bookingId) => {
    socket.join(bookingId);
  });
  
  // Leave booking room
  socket.on('leaveBooking', (bookingId) => {
    socket.leave(bookingId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
  connectDB();
}); 