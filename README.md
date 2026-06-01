# HireMate

HireMate is an AI interview preparation platform for candidates who want realistic practice before facing a real hiring panel. It combines resume understanding, role-aware interview questions, voice-enabled practice, readiness scoring, and job discovery in one workspace.

The project is built as a full-stack web app with companion desktop and mobile wrappers, so the same experience can be used from a browser, Windows installer, or Android app.

## What HireMate Does

HireMate helps a candidate move through the preparation loop:

1. Upload or build a professional profile.
2. Get AI feedback on resume quality, skills, role fit, and improvement areas.
3. Start a mock interview tailored to the target role.
4. Answer questions through text or voice.
5. Receive an interview readiness score and feedback.
6. Review interview history and continue improving.
7. Search jobs that match the detected role, skills, and location.

## Core Modules

### Resume Intelligence

HireMate accepts PDF and DOCX resumes, extracts text, validates whether the document is resume-like, and returns structured feedback. The analysis includes:

- Overall resume score
- Advantages and weak points
- Improvement suggestions
- Extracted keywords
- Detected target role
- Location hints
- Contact, education, experience, project, skill, certification, and language sections

Candidates can also use the guided profile builder when a scanned or image-heavy resume cannot be parsed reliably.

### Mock Interview Engine

The interview module generates role-aware questions using the candidate profile and target job title. It supports:

- Technical questions
- Behavioral questions
- Situational prompts
- Problem-solving questions
- Beginner, Intermediate, and Advanced difficulty modes
- Interview history
- Early session ending
- Readiness scoring at completion
- Voice input and text-to-speech output in supported browsers/devices

### Job Search

HireMate includes a Careerjet-backed job search flow that can use the candidate's detected role and location to help find relevant listings.

### Admin Portal

The admin experience provides protected access for reviewing saved candidate submissions. Admins can:

- View saved resumes and extracted text
- Preview uploaded files
- Filter by status or tags
- Update notes and review status
- Delete stored submissions
- View basic platform metrics

## Tech Stack

| Area | Technology |
| --- | --- |
| Backend | FastAPI, Python, Motor, MongoDB |
| Frontend | HTML, CSS, Bootstrap, Vue 3, Axios |
| AI | Mistral AI |
| Resume parsing | python-docx, pypdf, pdfminer, pdfplumber, OCR fallback |
| Auth | JWT, bcrypt password hashing |
| Rate control | SlowAPI plus custom daily quotas |
| Desktop wrapper | Tauri |
| Mobile wrapper | Flutter WebView |
| Deployment | Docker, Nginx, Render configuration |

## Repository Layout

```text
backend/        FastAPI app, API routes, services, models, database setup
frontend/       Static web UI, pages, JavaScript, styles, PWA files
mobile_app/     Flutter WebView app for mobile packaging
src-tauri/      Tauri desktop wrapper
apps/           Built APK/MSI artifacts
Dockerfile      Container build for backend + Nginx frontend serving
render.yaml     Render deployment configuration
```

## Local Setup

### Requirements

- Python 3.10 or newer
- MongoDB connection string
- Mistral API key for live AI responses
- Node.js and Rust only if you want to build the Tauri desktop app
- Flutter only if you want to rebuild the mobile app

### Environment

Create a `.env` file in the project root. You can start from `.env.example`.

Minimum useful values:

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=interview_coach
JWT_SECRET=replace_with_a_strong_secret
JWT_ALGORITHM=HS256
MISTRAL_API_KEY=your_mistral_api_key
```

Local demo credentials are available through:

```env
ENABLE_TEST_CREDENTIALS=true
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Test123!
TEST_ADMIN_EMAIL=admin@icp-solution.com
TEST_ADMIN_PASSWORD=Admin123!
TEST_ADMIN_INVITE_CODE=ICP-DEMO-ADMIN
```

Disable demo credentials before production deployment.

## Run Locally

From the repository root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

If you are not using the existing virtual environment, install dependencies first:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

## Demo Login

User account:

```text
Email: test@example.com
Password: Test123!
```

Admin account:

```text
URL: http://127.0.0.1:8000/static/pages/icp-admin-auth-9f2d8b4e.html
Email: admin@icp-solution.com
Password: Admin123!
Invite Code: ICP-DEMO-ADMIN
```

## Desktop App

The desktop wrapper is powered by Tauri and points to the existing frontend files.

```powershell
npm install
npm run tauri dev
```

To build an installer:

```powershell
npm run tauri build
```

More details are available in `DESKTOP_APP.md`.

## Mobile App

The mobile app lives in `mobile_app/` and uses Flutter WebView to load the deployed HireMate experience.

```powershell
cd mobile_app
flutter pub get
flutter run
```

## Deployment

The project includes Docker and Render configuration for a combined Nginx + FastAPI deployment.

```powershell
docker build -t hiremate .
docker run -p 80:80 hiremate
```

The container serves the frontend through Nginx and proxies API requests to the FastAPI backend.

## Tutorial Video

```text
Demo Video: https://drive.google.com/drive/folders/1A7ZD9fRPk11QmCELHwnvSvv9gxTFdGTU?usp=sharing
Live App: add hosted URL here, if available
```

## License

This project is distributed under the MIT License. See `LICENSE` for details.
