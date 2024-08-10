const express = require('express');
const accountRoutes = express.Router();
const { getDb } = require('../db/conn');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

// Account Registration
accountRoutes.route("/register").post(async (req, res) => {
    const { firstname, lastname, email, phoneNumber, password } = req.body;

    try {
        console.log('Received registration request for email:', email);

        const db = getDb();
        const collection = db.collection('accounts');

        // Check for duplicate email
        const existingAccount = await collection.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); 

        const newAccount = {
            firstname,
            lastname,
            email,
            phoneNumber,
            password: hashedPassword,
            savings: 0,
            checking: 0,
            role: ''
        };

        const result = await collection.insertOne(newAccount);

        req.session.userId = result.insertedId;

        res.status(201).json(newAccount);
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Account Login
accountRoutes.route("/login").post(async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request received');
    console.log('Request body:', req.body);

    try {
        const db = getDb();
        const collection = db.collection('accounts');

        const user = await collection.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.password) {
            console.log('Password field is missing in user document');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user._id;
        console.log('Login successful. Session userId set to:', user._id);
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Invalid email or password');
        res.status(500).json({ error: 'Server error' });
    }
});

// Account Logout
accountRoutes.route("/logout").post(async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Account Summary
accountRoutes.route("/account_summary").get(async (req, res) => {
    if (!req.session.userId) {
        console.log('Unauthorized access attempt');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Authorized access. Fetching account summary for userId:', req.session.userId);

    try {
        const db = getDb();
        const collection = db.collection('accounts');
        const userId = new ObjectId(req.session.userId); // Convert session userId to ObjectId
        const user = await collection.findOne({ _id: userId });

        if (!user) {
            console.log('User not found for userId:', req.session.userId);
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error('Error retrieving account summary:', error);
        res.status(500).json({ error: 'Failed to retrieve account summary' });
    }
});

// Account Balance
accountRoutes.route("/account_balance").get(async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = getDb();
        const collection = db.collection('accounts');
        const userId = new ObjectId(req.session.userId); // Convert session userId to ObjectId
        const user = await collection.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            savings: user.savings,
            checking: user.checking,
        });
    } catch (error) {
        console.error('Error retrieving account balance:', error);
        res.status(500).json({ error: 'Failed to retrieve account balance' });
    }
});

// Update Account Balance
accountRoutes.route("/update_balances").put(async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { savings, checking } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const db = getDb();
        const collection = db.collection('accounts');

        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newSavings = parseFloat(user.savings) + parseFloat(savings);
        const newChecking = parseFloat(user.checking) + parseFloat(checking);

        if (newSavings < 0 || newChecking < 0) {
            return res.status(400).json({ error: 'Cannot withdraw beyond $0' });
        }

        await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { savings: newSavings, checking: newChecking } }
        );

        res.json({ savings: newSavings, checking: newChecking });
    } catch (error) {
        console.error('Error updating account balance:', error);
        res.status(500).json({ error: 'Failed to update account balance' });
    }
});

module.exports = accountRoutes;
