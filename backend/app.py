import os
from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail

from config import Config
from models import db, User

login_manager = LoginManager()
mail = Mail()


def create_app():
    app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
    app.config.from_object(Config)

    CORS(app, supports_credentials=True, origins=['http://localhost:5173'])

    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, user_id)

    @login_manager.unauthorized_handler
    def unauthorized():
        from flask import jsonify
        return jsonify({'error': 'Nicht autorisiert'}), 401

    from routes.auth import auth_bp
    from routes.schools import schools_bp
    from routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(schools_bp, url_prefix='/api/schools')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    # Serve React frontend
    @app.route('/')
    @app.route('/<path:path>')
    def serve_frontend(path=''):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        return app.send_static_file('index.html')

    with app.app_context():
        db.create_all()
        _seed_admin(app)

    return app


def _seed_admin(app):
    """Create default admin user if it doesn't exist."""
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            display_name='Administrator',
            is_admin=True,
        )
        admin.set_password(app.config['ADMIN_PASSWORD'])
        db.session.add(admin)
        db.session.commit()


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
