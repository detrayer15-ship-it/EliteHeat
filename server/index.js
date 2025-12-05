const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eliteheat';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB подключен'))
  .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ==================== МОДЕЛИ ====================

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: String,
  bio: String,
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActive: Date,
  achievements: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// Progress Model
const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  score: Number,
  answer: String,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const Progress = mongoose.model('Progress', ProgressSchema);

// Project Model
const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  problem: String,
  solution: String,
  audience: String,
  templateId: String,
  tasks: [{
    id: String,
    title: String,
    completed: Boolean,
    category: String,
  }],
  progress: { type: Number, default: 0 },
  stage: { type: String, default: 'idea' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', ProjectSchema);

// ==================== MIDDLEWARE ====================

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }
  next();
};

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер работает' });
});

// ==================== AUTH ====================

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    // Создание токена
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        level: user.level,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Обновление последней активности
    user.lastActive = new Date();
    await user.save();

    // Создание токена
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        level: user.level,
        streak: user.streak,
        achievements: user.achievements,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

// Получение профиля
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      points: req.user.points,
      level: req.user.level,
      streak: req.user.streak,
      achievements: req.user.achievements,
      avatar: req.user.avatar,
      bio: req.user.bio,
    },
  });
});

// Обновление профиля
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    req.user.name = name || req.user.name;
    req.user.bio = bio || req.user.bio;
    req.user.avatar = avatar || req.user.avatar;

    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        bio: req.user.bio,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// ==================== PROGRESS ====================

// Сохранение прогресса
app.post('/api/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId, lessonId, completed, score, answer } = req.body;

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId,
      lessonId,
    });

    if (progress) {
      // Обновление существующего прогресса
      progress.completed = completed;
      progress.score = score;
      progress.answer = answer;
      if (completed && !progress.completedAt) {
        progress.completedAt = new Date();

        // Начисление очков
        req.user.points += 10;
        await req.user.save();
      }
    } else {
      // Создание нового прогресса
      progress = new Progress({
        userId: req.user._id,
        courseId,
        lessonId,
        completed,
        score,
        answer,
        completedAt: completed ? new Date() : null,
      });

      if (completed) {
        req.user.points += 10;
        await req.user.save();
      }
    }

    await progress.save();

    res.json({ progress, points: req.user.points });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сохранения прогресса' });
  }
});

// Получение прогресса пользователя
app.get('/api/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
});

// Получение прогресса по курсу
app.get('/api/progress/:courseId', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
      courseId: req.params.courseId,
    });
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
});

// ==================== PROJECTS ====================

// Получение проектов пользователя
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения проектов' });
  }
});

// Создание проекта
app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      userId: req.user._id,
      ...req.body,
    });

    await project.save();

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания проекта' });
  }
});

// Обновление проекта
app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    Object.assign(project, req.body);
    project.updatedAt = new Date();

    await project.save();

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления проекта' });
  }
});

// Удаление проекта
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    res.json({ message: 'Проект удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления проекта' });
  }
});

// ==================== GAMIFICATION ====================

// Начисление очков
app.post('/api/gamification/points', authMiddleware, async (req, res) => {
  try {
    const { points, reason } = req.body;

    req.user.points += points;

    // Проверка повышения уровня (каждые 100 очков = новый уровень)
    const newLevel = Math.floor(req.user.points / 100) + 1;
    if (newLevel > req.user.level) {
      req.user.level = newLevel;
    }

    await req.user.save();

    res.json({
      points: req.user.points,
      level: req.user.level,
      message: `+${points} очков за ${reason}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка начисления очков' });
  }
});

// Получение достижений
app.post('/api/gamification/achievement', authMiddleware, async (req, res) => {
  try {
    const { achievementId } = req.body;

    if (!req.user.achievements.includes(achievementId)) {
      req.user.achievements.push(achievementId);
      req.user.points += 50; // Бонус за достижение
      await req.user.save();
    }

    res.json({
      achievements: req.user.achievements,
      points: req.user.points,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения достижения' });
  }
});

// Рейтинг пользователей
app.get('/api/gamification/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name points level avatar')
      .sort({ points: -1 })
      .limit(100);

    res.json({ leaderboard: users });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения рейтинга' });
  }
});

// ==================== ADMIN ====================

// Получение всех пользователей (только для админа)
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

// Изменение роли пользователя
app.put('/api/admin/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.role = role;
    await user.save();

    res.json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка изменения роли' });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
});
