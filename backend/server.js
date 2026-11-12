require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.set('trust proxy', 1);

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const sameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();

if (!['lax', 'strict', 'none'].includes(sameSite)) {
  throw new Error('COOKIE_SAME_SITE must be lax, strict, or none');
}

if (
  sameSite === 'none' &&
  process.env.NODE_ENV === 'production' &&
  !allowedOrigins.every((origin) => origin.startsWith('https://'))
) {
  throw new Error('SameSite=None requires HTTPS CLIENT_URL origins');
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);

// CSRF origin allowlist for browser-originated state changes.
app.use((req, res, next) => {
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (
    stateChangingMethods.includes(req.method) &&
    req.headers.origin &&
    !allowedOrigins.includes(req.headers.origin)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Request origin not allowed',
    });
  }

  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api', require('./routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not found',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with that unique value already exists',
    });
  }

  if (error.name === 'AbortError') {
    return res.status(502).json({
      success: false,
      message: 'Upstream file request timed out',
    });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Submitted data is invalid',
    });
  }

  if (error.name === 'MulterError' && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Uploaded file is too large',
    });
  }

  if (error.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
    });
  }

  // Log the actual server-side error, but never log request secrets or .env values.
  console.error('API error:', {
    name: error.name,
    message: error.message,
    status: error.status,
    cloudinaryCode: error.http_code,
  });

  return res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : 'Server error',
  });
});

let server;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    server = app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
