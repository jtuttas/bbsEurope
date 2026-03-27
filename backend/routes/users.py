from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from models import db, User, School, school_fields, school_languages

users_bp = Blueprint('users', __name__)


def _admin_required(f):
    from functools import wraps

    @wraps(f)
    @login_required
    def decorated(*args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'error': 'Nur Administratoren'}), 403
        return f(*args, **kwargs)
    return decorated


@users_bp.route('', methods=['GET'])
@_admin_required
def list_users():
    users = User.query.order_by(User.username).all()
    return jsonify([u.to_dict() for u in users])


@users_bp.route('', methods=['POST'])
@_admin_required
def create_user():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    display_name = data.get('displayName', '').strip()
    email = data.get('email', '').strip() or None

    if not username or not password or not display_name:
        return jsonify({'error': 'Benutzername, Passwort und Anzeigename erforderlich'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Benutzername bereits vergeben'}), 409

    user = User(username=username, display_name=display_name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


@users_bp.route('/<user_id>', methods=['PUT'])
@_admin_required
def update_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Benutzer nicht gefunden'}), 404

    data = request.get_json()
    display_name = data.get('displayName', '').strip()
    email = data.get('email', '').strip() or None
    password = data.get('password', '')

    if display_name:
        user.display_name = display_name
    user.email = email

    if password:
        user.set_password(password)

    db.session.commit()
    return jsonify(user.to_dict())


@users_bp.route('/<user_id>', methods=['DELETE'])
@_admin_required
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'Benutzer nicht gefunden'}), 404
    if user.username == 'admin':
        return jsonify({'error': 'Admin kann nicht gelöscht werden'}), 400

    # Cascade: erst alle Schulen (Partnerschulen) dieses Users löschen
    user_schools = School.query.filter_by(created_by=user_id).all()
    for school in user_schools:
        db.session.execute(school_fields.delete().where(school_fields.c.school_id == school.id))
        db.session.execute(school_languages.delete().where(school_languages.c.school_id == school.id))
        db.session.delete(school)

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Benutzer gelöscht'})
