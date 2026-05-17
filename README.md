# EduMind AI

Мультиагентный AI-ассистент для студентов Казахстана и СНГ.

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | Next.js 14 App Router + TypeScript |
| Стили | Tailwind CSS + shadcn/ui |
| База данных | Prisma + PostgreSQL (Neon) |
| Аутентификация | NextAuth v5 |
| AI | Vercel AI SDK + Anthropic Claude API |
| Платежи | Stripe (USD) + PayBox.money (KZT) |
| Rate limiting | Upstash Redis |
| Деплой | Vercel |
| i18n | next-intl (RU / EN / KZ) |

## Агенты

| Агент | Описание | Цвет |
|-------|----------|------|
| ⚡ Маршрутизатор | Автоматически выбирает лучшего агента | Lime |
| 🧠 Репетитор | Объясняет темы простым языком | Teal |
| 🎯 Тесты | Адаптивные тесты по слабым местам | Violet |
| 🔍 Поиск | Академический поиск и источники | Sky |
| 🎓 Наставник | Мотивация, streak, прогресс | Orange |
| 📝 Писатель | Курсовые, рефераты, дипломные | Pink |
| 🔬 Исследователь | Анализ тем и академическая база | Amber |
| 📐 Форматтер | ГОСТ оформление и библиография | Slate |
| 🎨 Презентации | Слайды с экспортом в PPTX | Lime |

## Быстрый старт

```bash
# 1. Clone
git clone https://github.com/your-org/edumind-ai.git
cd edumind-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Run database migrations
npx prisma migrate dev

# 5. Start development server
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## Деплой на Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Import в Vercel Dashboard
# → vercel.com/new → Import Git Repository

# 3. Добавить переменные окружения из .env.example

# 4. Deploy
```

**Важно:** Убедись что все переменные из `.env.example` добавлены в Vercel Environment Variables.

## Тарифы

| Plan | Цена | Запросы | Экспорт |
|------|------|---------|---------|
| Free | $0 | 50/день | — |
| Student Pro | $9/мес | Безлимит | DOCX + PPTX |
| Academic+ | $19/мес | Безлимит | Всё + API |
| University | $6/студент/мес | Безлимит | Всё + LMS |

Оплата: **USD (Stripe)** или **KZT (PayBox.money)**

## Структура проекта

```
src/
├── app/
│   ├── (auth)/          # Login / Register
│   ├── (dashboard)/     # Chat, Documents, Slides, Dashboard
│   ├── (marketing)/     # Landing, Pricing, About
│   ├── admin/           # Admin panel
│   └── api/             # All API routes
├── components/
│   ├── chat/            # Chat interface + agents
│   ├── documents/       # Document editor
│   ├── slides/          # Slide editor
│   ├── layout/          # Sidebar, header
│   └── ui/              # Toast, buttons, etc.
├── hooks/               # useAgentChat, useSidebar
├── i18n/                # RU / EN / KZ translations
├── lib/
│   ├── agents/          # 9 AI agents
│   ├── docx/            # DOCX generator
│   ├── rag/             # PDF embeddings + retrieval
│   └── ...
└── types/               # TypeScript types
```

## API Routes

| Route | Method | Описание |
|-------|--------|----------|
| `/api/chat` | POST | Streaming chat с агентами |
| `/api/documents` | GET/POST | Список/создание документов |
| `/api/documents/export` | POST | DOCX экспорт |
| `/api/slides/generate` | POST | AI генерация слайдов |
| `/api/slides/export` | POST | PPTX экспорт |
| `/api/writer/generate` | POST | Генерация академических документов |
| `/api/upload` | POST | PDF загрузка для RAG |
| `/api/stripe/create-checkout` | POST | Stripe checkout |
| `/api/paybox/create-payment` | POST | PayBox оплата |
| `/api/health` | GET | Health check |
| `/api/waitlist` | POST | Запись в waitlist |
| `/api/admin/stats` | GET | Статистика (admin only) |

---

Сделано с любовью в Казахстане
