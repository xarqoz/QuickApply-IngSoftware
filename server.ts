import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { createHash, randomUUID } from 'crypto';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const dataDir = path.resolve(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'quickapply.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  userId TEXT PRIMARY KEY,
  fullName TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedIn TEXT,
  portfolio TEXT,
  experience TEXT,
  education TEXT,
  skills TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  jobData TEXT NOT NULL,
  status TEXT NOT NULL,
  appliedDate TEXT NOT NULL,
  score INTEGER,
  createdAt TEXT NOT NULL
);
`);

const hashPassword = (password: string) =>
  createHash('sha256').update(password).digest('hex');

const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const insertUser = db.prepare(
  'INSERT INTO users (id, email, passwordHash, createdAt) VALUES (?, ?, ?, ?)'
);
const upsertProfile = db.prepare(
  `INSERT INTO profiles (userId, fullName, email, phone, location, linkedIn, portfolio, experience, education, skills, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ON CONFLICT(userId) DO UPDATE SET
     fullName=excluded.fullName,
     email=excluded.email,
     phone=excluded.phone,
     location=excluded.location,
     linkedIn=excluded.linkedIn,
     portfolio=excluded.portfolio,
     experience=excluded.experience,
     education=excluded.education,
     skills=excluded.skills,
     updatedAt=excluded.updatedAt`
);
const getProfileByUserId = db.prepare('SELECT * FROM profiles WHERE userId = ?');
const getApplicationsByUserId = db.prepare('SELECT * FROM applications WHERE userId = ? ORDER BY createdAt DESC');
const insertApplication = db.prepare(
  'INSERT INTO applications (id, userId, jobData, status, appliedDate, score, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  const existing = findUserByEmail.get(email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'El correo ya está registrado.' });
  }

  const id = randomUUID();
  const passwordHash = hashPassword(password);
  insertUser.run(id, email.toLowerCase(), passwordHash, new Date().toISOString());

  res.json({ userId: id, email: email.toLowerCase() });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  const user = findUserByEmail.get(email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
  }

  res.json({ userId: user.id, email: user.email });
});

app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = getProfileByUserId.get(userId);
  if (!profile) {
    return res.json({ userId, profile: null });
  }

  res.json({ userId, profile: {
    personalInfo: {
      fullName: profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      linkedIn: profile.linkedIn || '',
      portfolio: profile.portfolio || '',
    },
    experience: profile.experience ? JSON.parse(profile.experience) : [],
    education: profile.education ? JSON.parse(profile.education) : [],
    skills: profile.skills ? JSON.parse(profile.skills) : [],
  }});
});

app.post('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  if (!data || !data.personalInfo) {
    return res.status(400).json({ error: 'Perfil inválido.' });
  }

  upsertProfile.run(
    userId,
    data.personalInfo.fullName || '',
    data.personalInfo.email || '',
    data.personalInfo.phone || '',
    data.personalInfo.location || '',
    data.personalInfo.linkedIn || '',
    data.personalInfo.portfolio || '',
    JSON.stringify(data.experience || []),
    JSON.stringify(data.education || []),
    JSON.stringify(data.skills || []),
    new Date().toISOString(),
  );

  res.json({ success: true });
});

app.get('/api/applications/:userId', (req, res) => {
  const { userId } = req.params;
  const applications = getApplicationsByUserId.all(userId).map((row: any) => ({
    ...row,
    jobData: JSON.parse(row.jobData),
  }));
  res.json({ applications });
});

app.post('/api/applications/:userId', (req, res) => {
  const { userId } = req.params;
  const { job, score } = req.body;
  if (!job || !job.id) {
    return res.status(400).json({ error: 'Trabajo inválido.' });
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  insertApplication.run(id, userId, JSON.stringify(job), 'pending', now, score ?? 0, now);
  res.json({ success: true, applicationId: id });
});

const fillWithHeuristics = (profile: any, pageFields: string[]) => {
  const normalized = (value?: string) => (value ?? '').trim();
  const personal = profile.personalInfo || {};

  const mapping: Record<string, string> = {};

  pageFields.forEach((field) => {
    const key = field.toLowerCase();

    if (key.includes('name')) {
      mapping[field] = normalized(personal.fullName) || normalized(profile.fullName);
      return;
    }
    if (key.includes('email')) {
      mapping[field] = normalized(personal.email) || normalized(profile.email);
      return;
    }
    if (key.includes('phone') || key.includes('telefono') || key.includes('tel')) {
      mapping[field] = normalized(personal.phone);
      return;
    }
    if (key.includes('address') || key.includes('location') || key.includes('direccion')) {
      mapping[field] = normalized(personal.location);
      return;
    }
    if (key.includes('linkedin')) {
      mapping[field] = normalized(personal.linkedIn);
      return;
    }
    if (key.includes('portfolio') || key.includes('web') || key.includes('site')) {
      mapping[field] = normalized(personal.portfolio);
      return;
    }
    if (key.includes('company') || key.includes('empresa') || key.includes('organization')) {
      mapping[field] = profile.experience?.[0]?.company || '';
      return;
    }
    mapping[field] = '';
  });

  return mapping;
};

app.post('/api/ai/autofill', async (req, res) => {
  const { profile, pageFields } = req.body;
  if (!profile || !Array.isArray(pageFields)) {
    return res.status(400).json({ error: 'Datos de autofill inválidos.' });
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    return res.json({ mapping: fillWithHeuristics(profile, pageFields), source: 'heuristic' });
  }

  try {
    const prompt = `Dada esta información de usuario y estos nombres de campos de formulario, genera un objeto JSON que asigne cada campo a un valor. Usa solo valores permitidos por la información del usuario. Usuario: ${JSON.stringify(profile)} Campos: ${JSON.stringify(pageFields)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
    });

    const json = await response.json();
    const text = json?.choices?.[0]?.message?.content || '';
    let mapping = fillWithHeuristics(profile, pageFields);

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        mapping = { ...mapping, ...parsed };
      }
    } catch {
      // fallback a heurística si la IA no devuelve JSON válido
    }

    res.json({ mapping, source: 'openai' });
  } catch (error) {
    res.json({ mapping: fillWithHeuristics(profile, pageFields), source: 'heuristic', error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
