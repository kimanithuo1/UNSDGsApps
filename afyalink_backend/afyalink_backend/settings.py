"""
Django settings for afyalink_backend project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(os.path.join(BASE_DIR, ".env"))

# ── SECURITY ────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'unsafe-dev-secret')
DEBUG = os.environ.get('DEBUG', 'true').lower() == 'true'

# FIX 1: ALLOWED_HOSTS must include the Render hostname.
# On Render, set env var:
#   ALLOWED_HOSTS=afyalink-backend-k6ld.onrender.com
# For local dev, also include 127.0.0.1,localhost
_raw_hosts = os.environ.get('ALLOWED_HOSTS', '127.0.0.1,localhost')
ALLOWED_HOSTS = [h.strip() for h in _raw_hosts.split(',') if h.strip()]


# ── APPLICATIONS ────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',   # must be before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'afyalink_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'afyalink_backend.wsgi.application'


# ── DATABASE ────────────────────────────────────────────────────────────────
DATABASE_URL = os.environ.get("DATABASE_URL")
DB_ENGINE = os.environ.get("DB_ENGINE", "sqlite")

if DB_ENGINE == "mysql":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ.get('MYSQL_DB', 'afyalink'),
            'USER': os.environ.get('MYSQL_USER', 'root'),
            'PASSWORD': os.environ.get('MYSQL_PASSWORD', ''),
            'HOST': os.environ.get('MYSQL_HOST', '127.0.0.1'),
            'PORT': os.environ.get('MYSQL_PORT', '3306'),
            'OPTIONS': {'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"},
        }
    }
elif DB_ENGINE in ("postgres", "postgresql"):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB', 'afyalink'),
            'USER': os.environ.get('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
            'HOST': os.environ.get('POSTGRES_HOST', '127.0.0.1'),
            'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# DATABASE_URL always wins (Render sets this automatically for Postgres add-ons)
if DATABASE_URL:
    DATABASES['default'] = dj_database_url.parse(DATABASE_URL, conn_max_age=600)


# ── AUTH ─────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ── I18N ─────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ── STATIC FILES ─────────────────────────────────────────────────────────────
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# ── CORS ─────────────────────────────────────────────────────────────────────
# FIX 2: Add the Vercel frontend URL here.
# On Render, set env var:
#   CORS_ALLOWED_ORIGINS=https://afyalink-iota.vercel.app
# For local dev: http://localhost:5173
_raw_cors = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173'
)
CORS_ALLOWED_ORIGINS = [o.strip() for o in _raw_cors.split(',') if o.strip()]

# Allow cookies/auth headers cross-origin
CORS_ALLOW_CREDENTIALS = True


# ── DRF & JWT ─────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


# ── EMAIL ─────────────────────────────────────────────────────────────────────
# FIX 3: Default backend is console (never sends real email).
# For production, use SMTP or a service like SendGrid / Mailgun.
#
# Option A — Gmail SMTP (easiest):
#   On Render, set:
#     EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
#     EMAIL_HOST=smtp.gmail.com
#     EMAIL_PORT=587
#     EMAIL_USE_TLS=True
#     EMAIL_HOST_USER=youraddress@gmail.com
#     EMAIL_HOST_PASSWORD=your-app-password   ← Gmail App Password (not your real password)
#     DEFAULT_FROM_EMAIL=youraddress@gmail.com
#     CONTACT_EMAIL_TO=jtechbyteinsights@gmail.com
#
# Option B — Console (dev only, emails print to terminal):
#   EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend'   # safe default for dev
)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'true').lower() == 'true'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@afyalink.local')
CONTACT_EMAIL_TO = os.environ.get('CONTACT_EMAIL_TO', 'jtechbyteinsights@gmail.com')


# ── MISC ─────────────────────────────────────────────────────────────────────
AFYALINK_ROLES = ('Patient', 'Practitioner', 'Facility Admin', 'Super Admin')
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── JWT LIFETIME (added fix) ──────────────────────────────────────────────────
# Default SimpleJWT access token = 5 MINUTES — caused search to fail after a
# few uses ("check your internet connection" = silent 401 after token expired).
# api.js now auto-refreshes on 401, but longer lifetime reduces friction.
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':    timedelta(days=1),    # was 5 minutes
    'REFRESH_TOKEN_LIFETIME':   timedelta(days=30),   # stay logged in for 30 days
    'ROTATE_REFRESH_TOKENS':    True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES':        ('Bearer',),
}