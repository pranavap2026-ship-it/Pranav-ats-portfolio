const m = require('mongoose');
const mk = (n, def) => m.model(n, new m.Schema(def, { timestamps: true }));
const S = { type: String, trim: true, default: '' };
const A = [String];
const N = { type: Number, default: 0 };
const ProjectSchema = new m.Schema({
  title: { ...S, required: true }, slug: { type: String, unique: true, index: true },
  short: S, categories: A, tech: A, thumbnail: S, screenshots: A, overview: S, problem: S,
  solution: S, features: A, architecture: S, challenges: S, contribution: S,
  liveUrl: S, githubUrl: S, featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true }, order: N
}, { timestamps: true });
ProjectSchema.pre('validate', function (next) {
  if (!this.slug || (this.isModified('title') && !this.isModified('slug'))) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});
module.exports = {
  Admin: mk('Admin', { email: { type: String, required: true, unique: true, lowercase: true }, password: { type: String, required: true, select: false } }),
  Profile: mk('Profile', { fullName: S, title: S, intro: S, bio: S, summary: S, objectives: S, location: S, email: S, phone: S, image: S, github: S, linkedin: S, available: { type: Boolean, default: true } }),
  Project: m.model('Project', ProjectSchema),
  Skill: mk('Skill', { name: { ...S, required: true }, category: S, order: N, visible: { type: Boolean, default: true } }),
  Experience: mk('Experience', { company: { ...S, required: true }, role: S, type: S, mode: S, duration: S, startDate: S, description: A, tech: A, achievements: A, logo: S, order: N }),
  Education: mk('Education', { institution: { ...S, required: true }, degree: S, department: S, startYear: S, endYear: S, achievements: A, order: N }),
  Certification: mk('Certification', { title: { ...S, required: true }, issuer: S, date: S, image: S, url: S, order: N }),
  Resume: mk('Resume', { url: String, publicId: String, size: Number, downloads: N }),
  ContactMessage: mk('ContactMessage', { name: S, email: S, subject: S, message: S, read: { type: Boolean, default: false }, archived: { type: Boolean, default: false } }),
  WebsiteSettings: mk('WebsiteSettings', { siteTitle: S, description: S, logo: S, favicon: S, accent: { ...S, default: '#2563eb' }, footer: S, siteUrl: S }),
  ActivityLog: mk('ActivityLog', { action: S, entity: S })
};
