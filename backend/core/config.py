import os
from dotenv import load_dotenv, find_dotenv

# Load from .env if present; fallback to .env.example for missing keys
env_path = find_dotenv(".env", usecwd=True)
if env_path:
    load_dotenv(env_path, override=True)
example_path = find_dotenv(".env.example", usecwd=True)
if example_path:
    load_dotenv(example_path, override=False)

MONGO_URI = os.getenv("MONGO_URI", "")
DB_NAME = os.getenv("DB_NAME", "interview_coach")
JWT_SECRET = os.getenv("JWT_SECRET", "")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
# Groq is used for speech-to-text (Whisper). See POST /api/interview/transcribe.
# The .env.example placeholder is loaded as a fallback, so treat it as unset.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
if GROQ_API_KEY.startswith("your_"):
    GROQ_API_KEY = ""
GROQ_STT_MODEL = os.getenv("GROQ_STT_MODEL", "whisper-large-v3-turbo")
SESSION_MAX_QUESTIONS = int(os.getenv("SESSION_MAX_QUESTIONS", "100"))
DAILY_QUESTION_LIMIT = 60
INTERVIEW_DEFAULT_QUESTIONS = int(os.getenv("INTERVIEW_DEFAULT_QUESTIONS", "10"))
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "30"))
SUPERADMIN_EMAIL = os.getenv("SUPERADMIN_EMAIL", "")
SUPERADMIN_PASSWORD = os.getenv("SUPERADMIN_PASSWORD", "")
SAVE_RESUME_BY_DEFAULT = os.getenv("SAVE_RESUME_BY_DEFAULT", "false").lower() == "true"
# Removed WEEKLY_RESET_DAY as we moved to daily quotas
JWT_EXPIRATION_SECONDS = int(os.getenv("JWT_EXPIRATION_SECONDS", "18000")) # Default 5 hours

# Local/demo credentials. Enabled by default only outside Render/production.
IS_PRODUCTION = bool(
    os.getenv("RENDER")
    or os.getenv("RENDER_EXTERNAL_URL")
    or os.getenv("PRODUCTION")
    or os.getenv("ENVIRONMENT", "").lower() == "production"
)
ENABLE_TEST_CREDENTIALS = os.getenv(
    "ENABLE_TEST_CREDENTIALS",
    "false" if IS_PRODUCTION else "true"
).lower() == "true"
TEST_USER_EMAIL = os.getenv("TEST_USER_EMAIL", "test@example.com")
TEST_USER_PASSWORD = os.getenv("TEST_USER_PASSWORD", "Test123!")
TEST_ADMIN_EMAIL = os.getenv("TEST_ADMIN_EMAIL", "admin@icp-solution.com")
TEST_ADMIN_PASSWORD = os.getenv("TEST_ADMIN_PASSWORD", "Admin123!")
TEST_ADMIN_INVITE_CODE = os.getenv("TEST_ADMIN_INVITE_CODE", "ICP-DEMO-ADMIN")

# Admin Security
ADMIN_ALLOWLIST = os.getenv("ADMIN_ALLOWLIST", "127.0.0.1,::1").split(",")

# EmailJS Configuration
EMAILJS_PUBLIC_KEY = os.getenv("EMAILJS_PUBLIC_KEY", "")
EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID", "")
EMAILJS_TEMPLATE_ID = os.getenv("EMAILJS_TEMPLATE_ID", "")

# Admin Resume Notification EmailJS
ADMIN_EMAILJS_PUBLIC_KEY = os.getenv("ADMIN_EMAILJS_PUBLIC_KEY", "")
ADMIN_EMAILJS_SERVICE_ID = os.getenv("ADMIN_EMAILJS_SERVICE_ID", "")
ADMIN_EMAILJS_TEMPLATE_ID = os.getenv("ADMIN_EMAILJS_TEMPLATE_ID", "")

# Admin Alert EmailJS Configuration
ADMIN_ALERT_EMAILJS_PUBLIC_KEY = os.getenv("ADMIN_ALERT_EMAILJS_PUBLIC_KEY", "")
ADMIN_ALERT_EMAILJS_SERVICE_ID = os.getenv("ADMIN_ALERT_EMAILJS_SERVICE_ID", "")
ADMIN_ALERT_EMAILJS_TEMPLATE_ID = os.getenv("ADMIN_ALERT_EMAILJS_TEMPLATE_ID", "")

# Forgot Password EmailJS Configuration
FORGOT_PASSWORD_EMAILJS_PUBLIC_KEY = os.getenv("FORGOT_PASSWORD_EMAILJS_PUBLIC_KEY", "")
FORGOT_PASSWORD_EMAILJS_SERVICE_ID = os.getenv("FORGOT_PASSWORD_EMAILJS_SERVICE_ID", "")
FORGOT_PASSWORD_EMAILJS_TEMPLATE_ID = os.getenv("FORGOT_PASSWORD_EMAILJS_TEMPLATE_ID", "")
FORGOT_PASSWORD_EMAILJS_ACCESS_TOKEN = os.getenv("FORGOT_PASSWORD_EMAILJS_ACCESS_TOKEN", "")

# Careerjet Configuration
CAREERJET_API_KEY = os.getenv("CAREERJET_API_KEY", "")
CAREERJET_WIDGET_ID = os.getenv("CAREERJET_WIDGET_ID", "")
