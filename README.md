# Network BBS Europe

Webbasierte Anwendung zur Vernetzung europäischer Berufsschulen. Netzwerkschulen können Partnerschulen recherchieren, nach Fachrichtungen, Ländern oder Unterrichtssprachen filtern und neue Schulen in die Datenbank eintragen.

## Tech-Stack

| Komponente | Technologie |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS 3, react-i18next |
| **Backend** | Python 3.12, Flask 3.1, SQLAlchemy, Flask-Login |
| **Datenbank** | PostgreSQL 16 (Azure Flexible Server) |
| **Containerisierung** | Docker (Multi-Stage Build) |
| **CI/CD** | GitHub Actions → GitHub Container Registry |

## Voraussetzungen

- Python ≥ 3.10
- Node.js ≥ 20
- PostgreSQL-Datenbank (lokal oder Azure)

## Installation

### 1. Repository klonen

```bash
git clone <repo-url>
cd bbsEurope
```

### 2. Umgebungsvariablen

Eine `.env`-Datei im Projektroot anlegen:

```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=pgadmin
POSTGRES_PASSWORD=<passwort>
POSTGRES_DATABASE=postgres
POSTGRES_SSL_MODE=require
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require

# Flask
FLASK_SECRET_KEY=<zufälliger-schlüssel>
FLASK_ENV=development

# Admin-Account (wird beim ersten Start angelegt)
ADMIN_PASSWORD=<sicheres-passwort>

# Mail (für Passwort-Reset)
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=noreply@example.com
MAIL_PASSWORD=<mail-passwort>
MAIL_DEFAULT_SENDER=noreply@example.com
```

### 3. Backend

```bash
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r backend/requirements.txt
```

### 4. Frontend

```bash
cd frontend
npm install
cd ..
```

## Entwicklung starten

**Backend** (Port 5000):

```bash
cd backend
python app.py
```

**Frontend** (Port 5173, Proxy auf Backend):

```bash
cd frontend
npm run dev
```

Die Anwendung ist dann unter http://localhost:5173 erreichbar.

## Produktions-Build

### Frontend bauen

```bash
cd frontend
npm run build
```

Die statischen Dateien landen in `frontend/dist/` und werden vom Flask-Backend ausgeliefert.

### Docker

```bash
docker build -t bbs-europe .
docker run -p 8000:8000 --env-file .env bbs-europe
```

Die Anwendung ist dann unter http://localhost:8000 erreichbar.

## Projektstruktur

```
bbsEurope/
├── backend/
│   ├── app.py              # Flask App-Factory + Blueprints
│   ├── config.py           # Konfiguration aus .env
│   ├── models.py           # SQLAlchemy-Modelle (User, School)
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py         # Login, Logout, Passwort-Reset
│       ├── schools.py      # CRUD Schulen
│       └── users.py        # Admin: Nutzerverwaltung
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Hauptkomponente
│   │   ├── constants.js    # Länder, Fachrichtungen, Sprachen
│   │   ├── i18n.js         # i18next-Konfiguration
│   │   ├── components/     # React-Komponenten
│   │   ├── context/        # AuthContext, ToastContext
│   │   └── locales/        # de.json, en.json, fr.json, es.json
│   ├── package.json
│   └── vite.config.js
├── .env                    # Umgebungsvariablen (nicht im Git)
├── .github/workflows/      # CI/CD Pipeline
├── Dockerfile
└── PRD.md
```

## Sprachen

Die Oberfläche ist in vier Sprachen verfügbar: **Deutsch**, **Englisch**, **Französisch** und **Spanisch**. Die Sprache kann über den Header umgeschaltet werden.

## Rollen

| Rolle | Berechtigungen |
|---|---|
| **Admin** | Schulen anlegen/bearbeiten/löschen, Nutzer verwalten |
| **Netzwerkschule** | Eigene Schulen anlegen/bearbeiten/löschen |
| **Gast** (nicht eingeloggt) | Schulen ansehen und filtern |

Der Admin-Account (`admin`) wird beim ersten Start automatisch mit dem in `.env` hinterlegten Passwort erstellt.

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
