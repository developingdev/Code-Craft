import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from './auth';
import { authMiddleware, AuthRequest } from './middleware';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const prisma = new PrismaClient();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3001').split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() });
});

// Dashboard
app.get('/api/dashboard', (_req, res) => {
  res.json({
    status: 'ready',
    projectsReady: 3,
    deployTargets: 2,
    updatedAt: new Date().toISOString()
  });
});

// Auth schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: hashPassword(parsed.data.password)
      }
    });

    const token = generateToken(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !comparePassword(parsed.data.password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create project
const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
});

app.post('/api/projects', authMiddleware, async (req: AuthRequest, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        userId: req.userId!
      }
    });
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// List projects
app.get('/api/projects', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({ where: { userId: req.userId } });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project
app.get('/api/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// AI agent endpoint (placeholder)
app.post('/api/agent/chat', authMiddleware, async (req: AuthRequest, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  // Placeholder - would integrate with OpenAI here
  res.json({
    response: 'AI agent feature coming soon. Set OPENAI_API_KEY to enable.',
    userId: req.userId
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
