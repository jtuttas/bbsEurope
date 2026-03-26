import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Association tables
school_fields = db.Table(
    'school_fields',
    db.Column('school_id', db.String(36), db.ForeignKey('schools.id'), primary_key=True),
    db.Column('field', db.String(50), primary_key=True),
)

school_languages = db.Table(
    'school_languages',
    db.Column('school_id', db.String(36), db.ForeignKey('schools.id'), primary_key=True),
    db.Column('language', db.String(50), primary_key=True),
)


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    display_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    reset_token = db.Column(db.String(256), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'displayName': self.display_name,
            'email': self.email,
            'isAdmin': self.is_admin,
        }


class School(db.Model):
    __tablename__ = 'schools'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(300), nullable=False)
    city = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    creator = db.relationship('User', backref='schools')

    def get_fields(self):
        rows = db.session.execute(
            school_fields.select().where(school_fields.c.school_id == self.id)
        ).fetchall()
        return [r.field for r in rows]

    def get_languages(self):
        rows = db.session.execute(
            school_languages.select().where(school_languages.c.school_id == self.id)
        ).fetchall()
        return [r.language for r in rows]

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'country': self.country,
            'website': self.website,
            'fields': self.get_fields(),
            'languages': self.get_languages(),
            'description': self.description,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'createdBy': self.creator.display_name if self.creator else None,
            'createdByUserId': self.created_by,
        }
