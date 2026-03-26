import uuid
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

from models import db, User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': 'Benutzername und Passwort erforderlich'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Ungültige Anmeldedaten'}), 401

    login_user(user)
    return jsonify(user.to_dict())


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Abgemeldet'})


@auth_bp.route('/me', methods=['GET'])
def me():
    if current_user.is_authenticated:
        return jsonify(current_user.to_dict())
    return jsonify(None)


@auth_bp.route('/request-reset', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email', '').strip()

    if not email:
        return jsonify({'error': 'E-Mail-Adresse erforderlich'}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.email:
        token = str(uuid.uuid4())
        user.reset_token = token
        user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
        db.session.commit()

        try:
            from flask_mail import Message
            from app import mail
            msg = Message(
                'Passwort zurücksetzen — Network BBS Europe',
                recipients=[user.email],
            )
            reset_url = f"{request.host_url}reset-password?token={token}"
            msg.body = f"Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:\n\n{reset_url}\n\nDer Link ist 1 Stunde gültig."
            mail.send(msg)
        except Exception:
            pass  # silently fail if mail is not configured

    # Always return success to prevent email enumeration
    return jsonify({'message': 'Falls die E-Mail-Adresse registriert ist, wurde eine E-Mail gesendet.'})


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token', '').strip()
    new_password = data.get('password', '')

    if not token or not new_password:
        return jsonify({'error': 'Token und neues Passwort erforderlich'}), 400

    if len(new_password) < 6:
        return jsonify({'error': 'Passwort muss mindestens 6 Zeichen lang sein'}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.now(timezone.utc):
        return jsonify({'error': 'Ungültiger oder abgelaufener Token'}), 400

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()

    return jsonify({'message': 'Passwort erfolgreich zurückgesetzt'})
