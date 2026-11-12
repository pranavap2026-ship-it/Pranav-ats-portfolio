const r = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const cloud = require('cloudinary').v2;
const M = require('../models');

// Cloudinary uses signed server-side uploads. Keep API secrets only in backend/.env.
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
};

const cloudinaryConfigured = Boolean(
  cloudinaryConfig.cloud_name &&
  cloudinaryConfig.api_key &&
  cloudinaryConfig.api_secret
);

if (cloudinaryConfigured) {
  cloud.config(cloudinaryConfig);
  console.log('Cloudinary credentials loaded (values hidden)');
} else {
  console.warn('Cloudinary credentials missing. Upload endpoints will return 503.');
}

const prod = process.env.NODE_ENV === 'production';
const sameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
const ck = {
  httpOnly: true,
  secure: prod || sameSite === 'none',
  sameSite,
  path: '/',
};

const bad = (message, status = 400) =>
  Object.assign(new Error(message), { status });

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (error instanceof z.ZodError) {
      return next(
        bad(`Invalid input: ${error.issues[0]?.path.join('.') || 'request'}`)
      );
    }
    next(error);
  });

const ok = (res, data) => res.json({ success: true, data });

const isAdmin = (req) => {
  try {
    return Boolean(jwt.verify(req.cookies?.token, process.env.JWT_SECRET));
  } catch {
    return false;
  }
};

const auth = (req, res, next) =>
  isAdmin(req)
    ? next()
    : res.status(401).json({ success: false, message: 'Unauthorized' });

const log = (action, entity) =>
  M.ActivityLog.create({ action, entity }).catch(() => {});

const toCloud = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!cloudinaryConfigured) {
      return reject(
        bad('Image upload is unavailable. Configure Cloudinary credentials in backend/.env.', 503)
      );
    }

    cloud.uploader
      .upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'image',
          ...options,
        },
        (error, result) => {
          if (error) {
            // Keep detailed diagnostics in the backend terminal only.
            console.error('Cloudinary upload error:', {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
              error: error.error?.message,
            });

            return reject(
              bad(
                `Cloudinary rejected the upload (${error.http_code || 'unknown status'}). Check the Cloud Name, API Key, API Secret and Cloudinary account upload permissions.`,
                502
              )
            );
          }

          if (!result?.secure_url) {
            return reject(bad('Cloudinary returned no secure image URL.', 502));
          }

          resolve(result);
        }
      )
      .end(buffer);
  });

const clean = (value) => String(value ?? '').replace(/[<>]/g, '').trim();

const strip = ({ _id, createdAt, updatedAt, __v, ...rest }) => rest;

const fields = {
  projects: [
    'title', 'slug', 'short', 'categories', 'tech', 'thumbnail',
    'screenshots', 'overview', 'problem', 'solution', 'features',
    'architecture', 'challenges', 'contribution', 'liveUrl',
    'githubUrl', 'featured', 'published', 'order',
  ],
  skills: ['name', 'category', 'order', 'visible'],
  experience: [
    'company', 'role', 'type', 'mode', 'duration', 'startDate',
    'description', 'tech', 'achievements', 'logo', 'order',
  ],
  education: [
    'institution', 'degree', 'department', 'startYear', 'endYear',
    'achievements', 'order',
  ],
  certifications: ['title', 'issuer', 'date', 'image', 'url', 'order'],
};

const pick = (body, allowed) =>
  Object.fromEntries(
    Object.entries(strip(body || {})).filter(([key]) => allowed.includes(key))
  );

const idOk = (id) => /^[a-f\d]{24}$/i.test(id);
const validUrl = (value) => !value || /^https:\/\//i.test(value);

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);

const validateResource = (key, body) => {
  const data = pick(body, fields[key]);

  for (const field of ['title', 'name', 'company', 'institution']) {
    if (data[field] != null && String(data[field]).length > 160) {
      throw bad(`${field} is too long`);
    }
  }

  for (const field of [
    'liveUrl', 'githubUrl', 'url', 'thumbnail', 'logo', 'image',
  ]) {
    if (data[field] && !validUrl(data[field])) {
      throw bad(`${field} must be an HTTPS URL`);
    }
  }

  for (const field of [
    'categories', 'tech', 'screenshots', 'features', 'description', 'achievements',
  ]) {
    if (
      data[field] != null &&
      (!Array.isArray(data[field]) || data[field].length > 50)
    ) {
      throw bad(`${field} must be an array with at most 50 items`);
    }
  }

  if (
    data.order != null &&
    (!Number.isFinite(Number(data.order)) || Math.abs(Number(data.order)) > 100000)
  ) {
    throw bad('Invalid order');
  }

  return data;
};

// Authentication
r.post(
  '/auth/login',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }),
  wrap(async (req, res) => {
    const { email, password } = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(req.body);

    const admin = await M.Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw bad('Invalid credentials', 401);
    }

    res.cookie(
      'token',
      jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
      { ...ck, maxAge: 7 * 24 * 60 * 60 * 1000 }
    );

    ok(res, { email: admin.email });
  })
);

r.post('/auth/logout', (req, res) => {
  res.clearCookie('token', ck);
  ok(res, null);
});

r.get('/auth/me', auth, (req, res) => ok(res, { admin: true }));

// Profile and website settings
const single = (path, Model) => {
  r.get(path, wrap(async (req, res) => {
    ok(res, (await Model.findOne()) || {});
  }));

  r.put(path, auth, wrap(async (req, res) => {
    const allowed =
      Model === M.Profile
        ? [
            'fullName', 'title', 'intro', 'bio', 'summary', 'objectives',
            'location', 'email', 'phone', 'image', 'github', 'linkedin',
            'available',
          ]
        : [
            'siteTitle', 'description', 'logo', 'favicon', 'accent',
            'footer', 'siteUrl',
          ];

    const data = await Model.findOneAndUpdate(
      {},
      pick(req.body, allowed),
      { upsert: true, new: true, runValidators: true }
    );

    log('Updated', path.slice(1));
    ok(res, data);
  }));
};

single('/profile', M.Profile);
single('/settings', M.WebsiteSettings);

// CRUD resources
const crud = (path, Model, sort, publicFilter = {}) => {
  r.get(path, wrap(async (req, res) => {
    const filter = req.query.all && isAdmin(req) ? {} : publicFilter;
    ok(res, await Model.find(filter).sort(sort));
  }));

  if (Model === M.Project) {
    r.get(`${path}/:slug`, wrap(async (req, res) => {
      const filter = isAdmin(req) ? {} : publicFilter;
      const project = await Model.findOne({
        slug: req.params.slug,
        ...filter,
      });

      if (!project) throw bad('Not found', 404);
      ok(res, project);
    }));
  }

  r.post(path, auth, wrap(async (req, res) => {
    const key = path.slice(1);
    const data = validateResource(key, req.body);
    const created = await Model.create(data);
    log('Created', key);
    ok(res, created);
  }));

  r.put(`${path}/:id`, auth, wrap(async (req, res) => {
    if (!idOk(req.params.id)) throw bad('Invalid item ID');

    const key = path.slice(1);
    const data = validateResource(key, req.body);

    if (key === 'projects' && data.title && !data.slug) {
      data.slug = slugify(data.title);
    }

    const updated = await Model.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!updated) throw bad('Not found', 404);
    log('Updated', key);
    ok(res, updated);
  }));

  r.delete(`${path}/:id`, auth, wrap(async (req, res) => {
    if (!idOk(req.params.id)) throw bad('Invalid item ID');

    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) throw bad('Not found', 404);

    log('Deleted', path.slice(1));
    ok(res, null);
  }));
};

crud('/projects', M.Project, { featured: -1, order: 1 }, { published: true });
crud('/skills', M.Skill, { category: 1, order: 1 }, { visible: true });
crud('/experience', M.Experience, { order: 1 });
crud('/education', M.Education, { order: 1 });
crud('/certifications', M.Certification, { order: 1 });

// File uploads
const memoryUpload = (fileFilter) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });

const imageUpload = memoryUpload((req, file, callback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return callback(bad('Only JPEG, PNG and WebP images are allowed'));
  }
  callback(null, true);
});

const pdfUpload = memoryUpload((req, file, callback) => {
  if (file.mimetype !== 'application/pdf') {
    return callback(bad('PDF only'));
  }
  callback(null, true);
});

const imageSignatureOk = (buffer) =>
  buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ||
  buffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) ||
  (
    buffer.subarray(0, 4).toString() === 'RIFF' &&
    buffer.subarray(8, 12).toString() === 'WEBP'
  );

r.post(
  '/upload',
  auth,
  imageUpload.single('file'),
  wrap(async (req, res) => {
    if (!req.file) throw bad('No file was received. Use form field name "file".');
    if (!imageSignatureOk(req.file.buffer)) {
      throw bad('File content is not a supported image');
    }

    const uploaded = await toCloud(req.file.buffer);
    ok(res, {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
    });
  })
);

// Resume
r.get('/resume', wrap(async (req, res) => {
  const resume = await M.Resume.findOne();
  ok(
    res,
    resume
      ? { exists: true, updatedAt: resume.updatedAt, downloads: resume.downloads }
      : { exists: false }
  );
}));

r.get('/resume/download', wrap(async (req, res) => {
  const resume = await M.Resume.findOne();

  if (!resume?.url) throw bad('No resume uploaded', 404);

  let resumeUrl;
  try {
    resumeUrl = new URL(resume.url);
  } catch {
    throw bad('Stored resume URL is invalid', 502);
  }

  if (
    resumeUrl.protocol !== 'https:' ||
    resumeUrl.hostname !== 'res.cloudinary.com'
  ) {
    throw bad('Stored resume URL is not trusted', 502);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(resumeUrl, {
      signal: controller.signal,
      redirect: 'error',
    });

    if (
      !response.ok ||
      !/^application\/pdf(?:;|$)/i.test(
        response.headers.get('content-type') || ''
      )
    ) {
      throw bad('Resume file is temporarily unavailable', 502);
    }

    const contentLength = Number(
      response.headers.get('content-length') || 0
    );

    if (contentLength > 10 * 1024 * 1024) {
      throw bad('Resume file exceeds the allowed size', 502);
    }

    if (!response.body) throw bad('Resume file is empty', 502);

    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      total += value.byteLength;

      if (total > 10 * 1024 * 1024) {
        await reader.cancel();
        throw bad('Resume file exceeds the allowed size', 502);
      }

      chunks.push(Buffer.from(value));
    }

    const bytes = Buffer.concat(chunks);

    if (bytes.subarray(0, 4).toString() !== '%PDF') {
      throw bad('Stored resume is not a valid PDF', 502);
    }

    await M.Resume.updateOne(
      { _id: resume._id },
      { $inc: { downloads: 1 } }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': bytes.length,
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'attachment; filename="Pranav_Resume.pdf"',
    });

    res.send(bytes);
  } finally {
    clearTimeout(timer);
  }
}));

r.post(
  '/resume/upload',
  auth,
  pdfUpload.single('file'),
  wrap(async (req, res) => {
    if (
      !req.file ||
      req.file.buffer.subarray(0, 4).toString() !== '%PDF'
    ) {
      throw bad('Upload a valid PDF');
    }

    if (req.file.size > 5 * 1024 * 1024) {
      throw bad('PDF must be 5 MB or smaller');
    }

    const oldResume = await M.Resume.findOne();

    const uploaded = await toCloud(req.file.buffer, {
      resource_type: 'raw',
      public_id: `resume-${Date.now()}.pdf`,
    });

    const resume = await M.Resume.findOneAndUpdate(
      {},
      {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        size: req.file.size,
      },
      { upsert: true, new: true }
    );

    if (oldResume?.publicId) {
      cloud.uploader
        .destroy(oldResume.publicId, { resource_type: 'raw' })
        .catch(() => {});
    }

    log('Uploaded', 'resume');
    ok(res, resume);
  })
);

r.delete('/resume', auth, wrap(async (req, res) => {
  const resume = await M.Resume.findOneAndDelete({});

  if (resume?.publicId) {
    await cloud.uploader
      .destroy(resume.publicId, { resource_type: 'raw' })
      .catch(() => {});
  }

  ok(res, null);
}));

// Contact
r.post(
  '/contact',
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
      success: false,
      message: 'Too many messages. Try again later.',
    },
  }),
  wrap(async (req, res) => {
    if (req.body.website) return ok(res, null);

    const body = z
      .object({
        name: z.string().min(2).max(80),
        email: z.string().email(),
        subject: z.string().min(2).max(120),
        message: z.string().min(10).max(2000),
      })
      .parse(req.body);

    await M.ContactMessage.create({
      name: clean(body.name),
      email: body.email,
      subject: clean(body.subject),
      message: clean(body.message),
    });

    ok(res, null);
  })
);

r.get('/contact', auth, wrap(async (req, res) => {
  ok(res, await M.ContactMessage.find().sort('-createdAt'));
}));

r.put('/contact/:id', auth, wrap(async (req, res) => {
  if (!idOk(req.params.id)) throw bad('Invalid message ID');

  const updated = await M.ContactMessage.findByIdAndUpdate(
    req.params.id,
    {
      read: Boolean(req.body.read),
      archived: Boolean(req.body.archived),
    },
    { new: true }
  );

  if (!updated) throw bad('Not found', 404);
  ok(res, updated);
}));

r.delete('/contact/:id', auth, wrap(async (req, res) => {
  if (!idOk(req.params.id)) throw bad('Invalid message ID');

  const deleted = await M.ContactMessage.findByIdAndDelete(req.params.id);
  if (!deleted) throw bad('Not found', 404);

  ok(res, null);
}));

// Dashboard statistics
r.get('/stats', auth, wrap(async (req, res) => {
  const [
    projects,
    featured,
    skills,
    messages,
    unread,
    resume,
    activity,
  ] = await Promise.all([
    M.Project.countDocuments(),
    M.Project.countDocuments({ featured: true }),
    M.Skill.countDocuments(),
    M.ContactMessage.countDocuments(),
    M.ContactMessage.countDocuments({ read: false }),
    M.Resume.findOne(),
    M.ActivityLog.find().sort('-createdAt').limit(8),
  ]);

  ok(res, {
    projects,
    featured,
    skills,
    messages,
    unread,
    downloads: resume?.downloads || 0,
    activity,
  });
}));

module.exports = r;
