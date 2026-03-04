const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connect = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Profile = require('./models/profile');
const Journal = require('./models/journal');
const Mood = require('./models/mood');
const authMiddleware = require('./middleware/auth');

require('dotenv').config();
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


// POST /api/health
// This route returns OK if the api is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// POST /api/signup
// This routes handles new account creation
app.post('/api/signup',async (req, res) => {

  try {
    // get account details
    const {email, password, username} = req.body;

    // make sure email and username are provided
    if (!email || !username) {
      return res.status(400).json({ error: 'Email and username are required' });
    }

    // check if email is already in use --> return error if in use
    const existing = await User.findOne({email});
    // console.log(existing);
    if (existing) {
      return res.status(409).json({error: 'Email already in use'})
    }

    // hash password (bcrypt with 12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // create new user in database
    const newUser = await User.create({email, passwordHash, createdAt: new Date()});

    // create user profile
    await Profile.create({userId: newUser._id, username});

    //create JWT for new user
    const authToken = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    // return success with JWT
    res.status(201).json({authToken});
  }
  catch(err) {
    res.status(500).json({error:'Server Error', message: err.message});
  }
});


// POST /api/login
// This routes handles login with an existing account
app.post('/api/login',async (req, res) => {
  // console.log(req.body);
  try {
    // get login attempt info
    const {email, password} = req.body
    // console.log(email, password);

    // check if email is valid
    const validUser = await User.findOne({email});
    // console.log(validUser);
    if (!validUser) {
      return res.status(409).json({error: 'No account found with that email.'})
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(password, validUser.passwordHash);
    // console.log(validPassword);
    if (!validPassword) {
      return res.status(409).json({error: 'Incorrect password.'})
    }

    // update lastLogin
    await User.findByIdAndUpdate(validUser._id, {lastLogin: new Date()});

    //create JWT valid for 7 days
    const authToken = jwt.sign({userId:validUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    // return jwt
    res.status(200).json({authToken});
  }
  catch(err) {
    res.status(500).json({error:'Server Error', message: err.message});
  }
});


// DELETE /api/user/:id
// protected route that deletes a user
app.delete('/api/user/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // convert both to strings to avoid ObjectId type mismatch
    if (req.userId.toString() !== id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.findByIdAndDelete(id);
    await Profile.findOneAndDelete({ userId: id });

    res.status(200).json({ message: 'Account deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET /api/profile
// protected route that returns a user's profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    //fetch profile associated with userId
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.status(200).json(profile);
  }
  catch(err) {
    res.status(500).json({error:'Server Error', message: err.message});
  }
})


// PATCH /api/profile
// protected route that updates a user's profile
app.patch('/api/profile', authMiddleware, async (req, res) => {
  try {
    // get fields to update from request body
    const { username, preferences } = req.body;

    // find and update the profile linked to the logged in user
    const updated = await Profile.findOneAndUpdate(
        { userId: req.userId },
        { username, preferences },
        { new: true, runValidators: true } // ← add runValidators to trigger enum check on updates
    );

    if (!updated) return res.status(404).json({ error: 'Profile not found' });

    res.status(200).json(updated);

  } catch (err) {
    // catch validation errors specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid value provided', message: err.message });
    }
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET /api/journals
// protected route that returns a user's journal entries
app.get('/api/journals', authMiddleware, async (req, res) => {
  try {
    //fetch journals associated with userId
    const journals = await Journal.find({ userId: req.userId });
    if (!journals) return res.status(404).json({ error: 'Profile not found' });

    res.status(200).json(journals);
  }
  catch(err) {
    res.status(500).json({error:'Server Error', message: err.message});
  }
})


// POST /api/journals
// protected route that creates a new journal entry
app.post('/api/journals', authMiddleware, async (req, res) => {
  try {
    // get journal details from request body
    const { title, body } = req.body;

    // make sure title is provided
    if (!title) {
      return res.status(400).json({ error: 'journal title is required' });
    }

    // make sure body is provided
    if (!body) {
      return res.status(400).json({ error: 'journal body is required' });
    }

    // create journal entry linked current user
    const entry = await Journal.create({
      userId: req.userId,
      title: title,
      body: body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json(entry);

  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
})


// PATCH /api/journal/:id
// Updates an existing journal entry
app.patch('/api/journals/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    // find the journal entry
    const entry = await Journal.findById(id);
    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });

    // make sure the logged in user owns this entry
    if (entry.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // update the entry
    const updated = await Journal.findByIdAndUpdate(
        id,
        { title, body, updatedAt: new Date() },
        { new: true } // returns the updated document
    );

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});


// DELETE /api/journal/:id
// deletes an existing journal entry of the user
app.delete('/api/journals/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // find the journal entry
    const entry = await Journal.findById(id);
    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });

    // make sure the logged in user owns this entry
    if (entry.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // delete the entry
    await entry.deleteOne();

    res.status(200).json({ message: 'Journal entry deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET /api/moods
// protected route that returns a user's mood entries'
app.get('/api/moods', authMiddleware, async (req, res) => {
  try {
    //fetch journals associated with userId
    const moods = await Mood.find({ userId: req.userId });
    if (!moods) return res.status(404).json({ error: 'Moods not found' });

    res.status(200).json(moods);
  }
  catch(err) {
    res.status(500).json({error:'Server Error', message: err.message});
  }
})


// POST /api/mood
// Creates a new mood log for the logged in user
app.post('/api/moods', authMiddleware, async (req, res) => {
  try {
    const { mood } = req.body;

    // make sure mood is provided
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // create mood log linked to the logged in user
    const log = await Mood.create({
      userId: req.userId,
      mood,
      createdAt: new Date(),
      new: true, runValidators: true
    });

    res.status(201).json(log);

  } catch (err) {
    // catch invalid mood value
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid mood value', message: err.message });
    }
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});


// DELETE /api/moods/:id
// deletes an existing mood entry of the user
app.delete('/api/moods/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    // find the mood entry
    const entry = await Mood.findById(id);
    if (!entry) return res.status(404).json({ error: 'Mood entry not found' });

    // make sure the logged in user owns this entry
    if (entry.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // delete the entry
    await entry.deleteOne();

    res.status(200).json({ message: 'Mood entry deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET /api/verify
// protected route that returns a JWT if the user is authenticated
app.get('/api/verify', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});

connect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;