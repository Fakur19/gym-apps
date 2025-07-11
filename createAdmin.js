const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management';

    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB Connected for admin creation');

        const adminEmail = 'admin@example.com'; // You can change this email
        const adminPassword = 'adminpassword'; // You can change this password

        let adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            console.log(`Admin user with email ${adminEmail} already exists.`);
        } else {
            adminUser = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });
            await adminUser.save();
            console.log(`Admin user ${adminEmail} created successfully!`);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();
