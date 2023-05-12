const mongoose = require('mongoose');

class Database {
  static async connect() {
    try {
      // MongoDB database connection URL
      const url = 'mongodb://localhost:27017';

      // Connect to MongoDB
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  static close() {
    mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

module.exports = Database;