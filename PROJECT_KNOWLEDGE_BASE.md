# PharmaCode07 — Complete Project Architecture & Knowledge Base

> **Document Version:** 1.0.0  
> **Last Updated:** September 2026  
> **Live Production Platform:** [https://pharmacode07-9wva.onrender.com](https://pharmacode07-9wva.onrender.com)  
> **Repository:** [pharmacode07/pharmacode07-platform](https://github.com/pharmacode07/pharmacode07-platform)

---

## 📋 Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [Target Competitive Exams & Academic Curriculum](#2-target-competitive-exams--academic-curriculum)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Database Design & 15 Mongoose Models](#4-database-design--15-mongoose-models)
5. [The 4 Core Preparation Pillars](#5-the-4-core-preparation-pillars)
6. [CBT Examination Simulator Mechanics](#6-cbt-examination-simulator-mechanics)
7. [E-Commerce, Checkout & Payment Lifecycle](#7-e-commerce-checkout--payment-lifecycle)
8. [Admin Cockpit & Management Systems](#8-admin-cockpit--management-systems)
9. [Security, Access Control & Anti-Scraping Architecture](#9-security-access-control--anti-scraping-architecture)
10. [SEO, Search Indexing & Google Knowledge Graph](#10-seo-search-indexing--google-knowledge-graph)
11. [Complete Technology Stack & Dependencies](#11-complete-technology-stack--dependencies)
12. [Complete REST API Route Directory](#12-complete-rest-api-route-directory)
13. [Environment Configuration & Deployment Architecture](#13-environment-configuration--deployment-architecture)

---

## 1. Executive Summary & Purpose

**PharmaCode07** is a specialized, production-grade EdTech and examination simulation platform designed to bridge the gap between traditional pharmacy education and high-stakes government recruitment examinations.

In India, pharmacy graduates (B.Pharm) and diploma holders (D.Pharm) face intense competition for government pharmacist roles (Railways, ESIC, State Selection Boards, AIIMS, and Defense forces). Traditional education focuses on theory, whereas competitive exams demand **computer-based speed, accuracy under negative marking penalties, and non-technical aptitude** (reasoning, mathematics, current affairs).

PharmaCode07 provides:
* A high-fidelity Computer-Based Test (CBT) examination simulator modeling real exam interfaces.
* High-yield mock test series, solved Previous Year Question papers (PYQs), and model papers.
* Complete Pharmacy Council of India (PCI) syllabus notes.
* Comprehensive non-technical preparation modules.
* An e-commerce and subscription system with secure payment gateway integration.

---

## 2. Target Competitive Exams & Academic Curriculum

### A. Central & State Government Recruitment Exams
1. **RRB Pharmacist (2027):** Railway Recruitment Board central exam.
2. **ESIC Pharmacist:** Employees' State Insurance Corporation medical posts.
3. **OSSSC Pharmacist (2026):** Odisha Sub-Ordinate Staff Selection Commission.
4. **GSSSB Junior Pharmacist (2026):** Gujarat Subordinate Service Selection Board.
5. **AIIMS CRE Pharmacist (2026):** Common Recruitment Examination for all AIIMS institutes.
6. **CISF ASI Pharmacist (2026):** Central Industrial Security Force Assistant Sub-Inspector.
7. **UPSSSC Pharmacist:** Uttar Pradesh Subordinate Services Selection Commission.
8. **BFUHS Pharmacist:** Baba Farid University of Health Sciences, Punjab.

### B. Academic Curriculum (PCI Syllabus)
* **B.Pharm (Semesters 1 through 8):** Pharmacology, Pharmaceutics, Medicinal Chemistry, Pharmacognosy, Pharmaceutical Analysis, Jurisprudence, Human Anatomy & Physiology (HAP), and Hospital/Clinical Pharmacy.
* **D.Pharm (1st & 2nd Year):** Foundational pharmacy diploma curriculum.

---

## 3. System Architecture & Data Flow

PharmaCode07 is built on a **decoupled service-oriented architecture (SOA)** with strict separation of concerns across presentation, routing, business logic, and data persistence.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (SPA)                            │
│  React 18 + Vite 5 + Tailwind CSS 3.4 + React Router DOM 6              │
│  Context Providers: AuthContext | CartContext | ToastContext            │
│  CBT Engine: Local Timer + Palette State Machine + LocalStorage Cache   │
│  SEO: React Helmet Async + Schema.org JSON-LD Structured Data           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / REST (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    GATEWAY & REVERSE PROXY LAYER                        │
│  Render Static Edge / Cloudflare CDN                                    │
│  SPA Client Rewrite Rule: /* -> /index.html                             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXPRESS API LAYER                             │
│  Security Pipeline: Helmet | CORS | express-rate-limit | MongoSanitize  │
│  Body Parsers: express.json({limit: '10mb'}) | express.urlencoded      │
│  Router Switchboard: /api/auth | /api/test-series | /api/payments ...   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (LOGIC)                           │
│  authService       - HS256 JWT, Bcrypt hashing, Email OTPs              │
│  testSeriesService - Test retrieval, anti-scraping MCQ randomization    │
│  attemptService    - CBT scoring, negative penalty, rationale lookup    │
│  paymentService    - Razorpay HMAC verification, atomic free checkout   │
│  couponService     - Atomic voucher redemption, validity checking       │
│  adminService      - Bulk question importer, draft management           │
└──────────────┬─────────────────────┬─────────────────────┬──────────────┘
               │                     │                     │
               ▼                     ▼                     ▼
┌─────────────────────────┐ ┌────────────────┐ ┌─────────────────────────┐
│      MONGODB ATLAS      │ │    RAZORPAY    │ │       CLOUDINARY        │
│  15 Mongoose Collections│ │ Payment Webhook│ │ Secure PDF & Image CDN  │
│  Atomic Transactions    │ │ HMAC-SHA256    │ │ Watermarked Assets      │
└─────────────────────────┘ └────────────────┘ └─────────────────────────┘
```

---

## 4. Database Design & 15 Mongoose Models

The database resides on **MongoDB Atlas** and is managed via **Mongoose 8.3**. The system uses 15 structured schemas:

| # | Model | Collection | Primary Responsibility |
| :- | :--- | :--- | :--- |
| 1 | **User** | `users` | User profiles, credentials, role (`user` / `admin`), email verification status, and four purchase enrollment arrays (`purchasedTests`, `purchasedMaterials`, `purchasedSingleModels`, `purchasedNonPharma`). |
| 2 | **TestSeries** | `testseries` | Full-length exam packages (title, exam category, price, discount, validity in days, thumbnail, isPublished draft flag, and target folder references). |
| 3 | **FolderItem** | `folderitems` | Hierarchical sub-folders within a test series (`Model Papers`, `Previous Year Papers`, `Subject-Wise Tests`) containing references to specific test papers. |
| 4 | **TestPaper** | `testpapers` | Individual examination papers containing the full questions array (question text, options array, correctOption, clinical explanation, difficulty level, marks, negativeMarks, and duration). |
| 5 | **TestAttempt** | `testattempts` | Historical exam submissions recording student ID, paper ID, answers map, question-by-question status, positive score, negative penalty, net score, and percentage. |
| 6 | **Order** | `orders` | Financial transaction records storing student ID, items array, total amount, discount applied, coupon code, Razorpay order ID, payment ID, signature, and status (`created`, `paid`, `failed`). |
| 7 | **Purchase** | `purchases` | Access grant ledger recording which user owns which content item, purchase date, expiry date (typically 365 days), and transaction reference. |
| 8 | **Coupon** | `coupons` | Promo vouchers supporting percentage or flat discounts, expiry dates, minimum order values, and atomic usage counters (`usedCount` vs `maxUses`). |
| 9 | **StudyPack** | `studypacks` | Bundled academic revision packages (e.g. PCI B.Pharm Semester notes) with pricing and thumbnail. |
| 10 | **StudyPackItem** | `studypackitems` | Individual curriculum units and subjects attached to a parent `StudyPack`. |
| 11 | **StudyMaterial** | `studymaterials` | Individual downloadable PDF study notes, subject classifications, semester mappings, and Cloudinary URLs. |
| 12 | **SingleModelPaper** | `singlemodelpapers` | Standalone mock papers sold individually without requiring a full test series bundle. |
| 13 | **NonPharmaResource**| `nonpharmaresources`| Non-technical study modules (Reasoning, Numerical Ability, Monthly Current Affairs, General Studies). |
| 14 | **Contact** | `contacts` | Student inquiries and support messages submitted via the public contact form. |
| 15 | **Notification** | `notifications` | Platform-wide administrative announcements and student alerts. |

---

## 5. The 4 Core Preparation Pillars

PharmaCode07 organizes all educational offerings into four distinct pillars:

### Pillar 1: Full-Length CBT Test Series
* Dedicated packages for major recruitment drives (RRB, ESIC, OSSSC, GSSSB, AIIMS CRE, CISF ASI, UPSSSC, BFUHS).
* Each series contains **3 structured sub-folders**:
  1. *Full-Length Model Papers* (Timed full mock examinations).
  2. *Previous Year Solved Papers (PYQs)* (Real past papers with solutions).
  3. *Subject-Wise CBT Drills* (Targeted practice in Pharmacology, Jurisprudence, etc.).
* Enrolled students receive 365-day unlimited re-attempt access.

### Pillar 2: Single Model Papers
* Low-cost standalone mock tests for rapid skill evaluation.
* Allows students to take a quick diagnostic test without committing to a full series package.

### Pillar 3: PCI Study Notes Repository
* Structured notes mapped directly to the official Pharmacy Council of India (PCI) syllabus.
* Covers B.Pharm Semesters 1 through 8 and D.Pharm 1st/2nd Year.
* Includes in-browser PDF preview and secure download streaming.

### Pillar 4: Non-Pharma Hub
* Most state and central pharmacist exams dedicate 20% to 40% of questions to non-technical topics.
* Provides dedicated modules for:
  - Numerical Aptitude & Quantitative Ability.
  - Logical & Analytical Reasoning.
  - Monthly Current Affairs & General Awareness.
  - State-specific General Knowledge (e.g. Gujarat GK for GSSSB, Odisha GK for OSSSC).

---

## 6. CBT Examination Simulator Mechanics

The CBT exam interface is engineered to replicate the real National Testing Agency (NTA) and TCS iON testing environments:

### A. 5-State Question Palette
Every question in an active exam is tracked using a reactive color-coded matrix:
1. **Not Visited (Grey):** Question not yet viewed.
2. **Not Answered (Red):** Question viewed but skipped without selecting an option.
3. **Answered (Green):** Answer chosen and saved.
4. **Marked for Review (Purple):** Flagged for later review without selecting an option.
5. **Answered & Marked for Review (Purple with Green Dot):** Answer selected, but flagged for final confirmation. *Counts toward grading.*

### B. Timer & Cheating Mitigation
* Client-side countdown timer based on actual paper duration.
* Background timestamp reconciliation prevents tab-sleep throttling from freezing the clock.
* Visual toast warnings alert the student at **5 minutes remaining**.
* Automated submission worker locks inputs and submits responses instantly when the clock reaches zero.

### C. Scoring Engine & Post-Exam Analytics
* Automated scoring formula:  
  ```
  Net Score = (Correct Answers × MarksPerQuestion) - (Incorrect Answers × NegativeMarkPenalty)
  ```
* Standard negative penalty: **-0.25 marks** per wrong answer (configurable per paper).
* Unanswered and "Marked for Review without answer" questions incur **0 penalty**.
* Instant scorecard displays: Total Score, Accuracy %, Time Spent, Category Breakdown, and Question-by-Question Clinical Rationales.

---

## 7. E-Commerce, Checkout & Payment Lifecycle

### A. User-Scoped Cart Architecture
* The cart state is managed via `CartContext` and is tied strictly to the authenticated user ID.
* Automatic guards prevent students from adding items they already own.

### B. Dual-Mode Transaction Flow
1. **Paid Orders (Razorpay Gateway):**
   - Client sends cart payload to `/api/payments/create-order`.
   - Backend validates price, applies coupon, and generates an official Razorpay Order ID.
   - Client opens the native Razorpay checkout modal (UPI, Cards, NetBanking).
   - On successful payment, client posts the payment credentials (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`) to `/api/payments/verify`.
   - Backend performs **HMAC-SHA256 cryptographic signature validation** using the secret key.
   - Upon verification, the student's purchase array is atomically updated, and access is granted for 365 days.

2. **Free Checkout (Zero-Cost Bypass):**
   - When a student redeems a 100% discount coupon or enrolls in a free promotional paper, the request is routed to `/api/payments/free-checkout`.
   - The backend validates that `finalAmount === 0`, generates an internal order record, and bypasses the external banking gateway entirely.

### C. Atomic Coupon Redemption
* Coupons are updated using MongoDB's atomic `findOneAndUpdate` with `$inc: { usedCount: 1 }` and `$gte` constraints.
* Prevents race conditions and double-spending during simultaneous checkout bursts.

---

## 8. Admin Cockpit & Management Systems

The platform includes a dedicated, role-protected administrative dashboard (`/admin`) equipped with:

1. **Test Series & Paper CMS:** Create, edit, and organize test series and multi-tier sub-folders.
2. **Draft / Unpublished Mode:** Content items have an `isPublished` toggle. Drafts are only visible to authenticated administrators.
3. **Bulk MCQ Importer:** Intelligent text parser that converts structured text or CSV into full question schemas (question, 4 options, correct answer key, and explanation).
4. **Study Notes & PDF Manager:** Upload study notes with automatic Cloudinary asset synchronization.
5. **Coupon Management:** Create percentage or flat vouchers, set usage limits, and define expiration dates.
6. **Analytics & Metrics:** Real-time visibility into total registered students, active enrollments, revenue, and support tickets.

---

## 9. Security, Access Control & Anti-Scraping Architecture

* **HS256 JWT Pinning:** Tokens are cryptographically signed with the `HS256` algorithm and verified against active user account state.
* **Role-Based Access Control (RBAC):** Middleware chain (`protect` ➔ `adminOnly`) prevents unauthorized access to administrative routes.
* **Digital Paywall:** Test paper question banks are inaccessible without verifying purchase claims in `user.purchasedTests`.
* **Anti-Scraping Practice Caps:** The public practice MCQ endpoint scrambles question banks using MongoDB's `$sample` aggregation and caps results at 25 questions per request.
* **ReDoS Protection:** User search terms in marketplace queries are sanitized using regex escape helpers to eliminate Regular Expression Denial of Service risks.
* **Rate Limiting:** IP-based request throttling on authentication routes (preventing brute-force password attempts) and file download routes.
* **Database Sanitization:** `express-mongo-sanitize` strips any `$` or `.` operators from request parameters to neutralize NoSQL injection exploits.
* **HTTP Security Headers:** `helmet` sets Content Security Policy (CSP), X-Frame-Options (clickjacking protection), and HSTS.

---

## 10. SEO, Search Indexing & Google Knowledge Graph

The platform implements complete enterprise search engine optimization:

1. **Google Site Name & Knowledge Graph Schema (JSON-LD):**
   - Embedded `schema.org/WebSite` and `schema.org/EducationalOrganization` structured data in `index.html`.
   - Forces Google Search to recognize the entity as **"PharmaCode07"** rather than generic domain names.
2. **Multi-Resolution Favicon System:**
   - `favicon-48.png` & `favicon-96.png` (Engineered specifically for Google's official 48px-multiple search snippet requirement).
   - `favicon-192.png` & `favicon-512.png` (Engineered for Android/PWA mobile home screen shortcuts).
   - `favicon.ico` (Binary 48px legacy Windows fallback).
   - Clean, cropped Capsule + DNA logo on transparent background without illegible micro-text.
3. **Dynamic Head Management:**
   - `react-helmet-async` renders unique page titles, meta descriptions, and canonical tags across all 14 routes.
4. **Robots & Sitemaps:**
   - `robots.txt` disallows private paths (`/admin`, `/checkout`, `/attempt`, `/dashboard`) while allowing search engines to index public study hubs.
   - `sitemap.xml` provides search engines with daily crawl frequencies and priority weightings.
   - Fully verified on **Google Search Console** and **Microsoft Bing Webmaster Tools**.

---

## 11. Complete Technology Stack & Dependencies

### Frontend Architecture
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.23.0",
  "react-helmet-async": "^3.0.0",
  "vite": "^5.2.0",
  "tailwindcss": "^3.4.3",
  "axios": "^1.6.8",
  "lucide-react": "^0.372.0",
  "canvas-confetti": "^1.9.3"
}
```

### Backend Architecture
```json
{
  "node": ">=18.0.0",
  "express": "^4.19.2",
  "mongoose": "^8.3.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "razorpay": "^2.9.2",
  "cloudinary": "^2.10.1",
  "multer": "^2.2.0",
  "nodemailer": "^9.0.5",
  "helmet": "^8.3.0",
  "express-rate-limit": "^8.7.0",
  "express-mongo-sanitize": "^2.2.0",
  "cors": "^2.8.5",
  "compression": "^1.8.1",
  "morgan": "^1.10.0"
}
```

---

## 12. Complete REST API Route Directory

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register candidate profile.
* `POST /api/auth/login` — Authenticate candidate / admin and issue JWT.
* `GET  /api/auth/me` — Retrieve active profile and verified purchase array.
* `POST /api/auth/verify-email` — Verify email address with 6-digit OTP.
* `POST /api/auth/forgot-password` — Dispatch password reset token via email.
* `POST /api/auth/reset-password` — Reset password using verified token.

### Test Series & CBT Engine (`/api/test-series`)
* `GET  /api/test-series` — List published test series with filters.
* `GET  /api/test-series/:id` — Retrieve series details and sub-folder structure.
* `GET  /api/test-series/paper/:id` — Fetch full question paper for enrolled candidate attempt.
* `GET  /api/test-series/practice-mcqs` — Anti-scraping randomized free practice questions.

### CBT Attempts (`/api/attempts`)
* `POST /api/attempts/submit` — Submit exam response, evaluate score, save attempt.
* `GET  /api/attempts/:id` — Retrieve scorecard, category breakdown, and rationales.
* `GET  /api/attempts/my-attempts` — Retrieve candidate exam history.

### Study Notes & Materials (`/api/materials`)
* `GET  /api/materials/packs` — List published curriculum study packs.
* `GET  /api/materials/packs/:slug` — Retrieve study pack units and syllabus.
* `GET  /api/materials/download/:id` — Authorized stream delivery of study PDF.

### Standalone Model Papers (`/api/single-models`)
* `GET  /api/single-models` — List standalone mock papers.
* `GET  /api/single-models/:id` — Retrieve single paper details.

### Non-Pharma Hub (`/api/non-pharma`)
* `GET  /api/non-pharma` — List aptitude, reasoning, and GK resources.

### Orders & Payments (`/api/payments`)
* `POST /api/payments/create-order` — Create verified Razorpay order with coupon calculation.
* `POST /api/payments/verify` — Cryptographically verify HMAC signature and enroll student.
* `POST /api/payments/free-checkout` — Atomic enrollment for 100% discount or free tests.

### Coupons (`/api/coupons`)
* `POST /api/coupons/apply` — Validate coupon code against minimum order and usage caps.

### Administration (`/api/admin`)
* `GET  /api/admin/test-series` — List all series (including unpublished drafts).
* `POST /api/admin/test-series` — Create or edit test series package.
* `POST /api/admin/test-papers` — Create test paper and question sub-schemas.
* `POST /api/admin/bulk-import` — Import questions via raw text/CSV parser.
* `GET  /api/admin/stats` — System metrics, active enrollments, and revenue.

---

## 13. Environment Configuration & Deployment Architecture

### Environment Variables
```env
# Core Server Configuration
PORT=5000
NODE_ENV=production
CLIENT_URL=https://pharmacode07-9wva.onrender.com

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/pharmacode?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_signing_key
JWT_EXPIRE=30d

# Payment Processing (Razorpay)
RAZORPAY_KEY_ID=rzp_live_YourKeyId
RAZORPAY_KEY_SECRET=YourRazorpaySecret

# Asset Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Dispatcher (Nodemailer TLS)
EMAIL_SERVICE=gmail
EMAIL_USER=pharmacode07exams@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=PharmaCode07 <pharmacode07exams@gmail.com>
```

### Production Infrastructure
* **Frontend:** Hosted on Render as a Static Site. Cloudflare edge distribution delivers static assets with HTTP/2 and Brotli/Gzip compression. Client routes are rewritten via `/* -> /index.html`.
* **Backend:** Hosted on Render as a Node.js Web Service. Runs in production mode behind an automated health-checked reverse proxy.
* **Database:** MongoDB Atlas M0/M10 replica set with automated backups and network IP access whitelisting.

---

<p align="center">
  <strong>PharmaCode07 Platform Architecture &copy; 2026. All rights reserved.</strong>
</p>
