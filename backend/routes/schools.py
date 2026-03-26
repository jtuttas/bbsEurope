from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from models import db, School, school_fields, school_languages

schools_bp = Blueprint('schools', __name__)


@schools_bp.route('', methods=['GET'])
@login_required
def list_schools():
    query = School.query.order_by(School.created_at.desc())
    schools = query.all()
    return jsonify([s.to_dict() for s in schools])


@schools_bp.route('/<school_id>', methods=['GET'])
@login_required
def get_school(school_id):
    school = db.session.get(School, school_id)
    if not school:
        return jsonify({'error': 'Schule nicht gefunden'}), 404
    return jsonify(school.to_dict())


@schools_bp.route('', methods=['POST'])
@login_required
def create_school():
    data = request.get_json()
    error = _validate_school(data)
    if error:
        return jsonify({'error': error}), 400

    school = School(
        name=data['name'].strip(),
        city=data['city'].strip(),
        country=data['country'],
        website=data.get('website', '').strip() or None,
        description=data.get('description', '').strip() or None,
        created_by=current_user.id,
    )
    db.session.add(school)
    db.session.flush()

    _set_fields_and_languages(school.id, data.get('fields', []), data.get('languages', []))
    db.session.commit()

    return jsonify(school.to_dict()), 201


@schools_bp.route('/<school_id>', methods=['PUT'])
@login_required
def update_school(school_id):
    school = db.session.get(School, school_id)
    if not school:
        return jsonify({'error': 'Schule nicht gefunden'}), 404

    if not current_user.is_admin and school.created_by != current_user.id:
        return jsonify({'error': 'Keine Berechtigung'}), 403

    data = request.get_json()
    error = _validate_school(data)
    if error:
        return jsonify({'error': error}), 400

    school.name = data['name'].strip()
    school.city = data['city'].strip()
    school.country = data['country']
    school.website = data.get('website', '').strip() or None
    school.description = data.get('description', '').strip() or None

    # Clear existing and re-set
    db.session.execute(school_fields.delete().where(school_fields.c.school_id == school.id))
    db.session.execute(school_languages.delete().where(school_languages.c.school_id == school.id))
    _set_fields_and_languages(school.id, data.get('fields', []), data.get('languages', []))
    db.session.commit()

    return jsonify(school.to_dict())


@schools_bp.route('/<school_id>', methods=['DELETE'])
@login_required
def delete_school(school_id):
    school = db.session.get(School, school_id)
    if not school:
        return jsonify({'error': 'Schule nicht gefunden'}), 404

    if not current_user.is_admin and school.created_by != current_user.id:
        return jsonify({'error': 'Keine Berechtigung'}), 403

    db.session.execute(school_fields.delete().where(school_fields.c.school_id == school.id))
    db.session.execute(school_languages.delete().where(school_languages.c.school_id == school.id))
    db.session.delete(school)
    db.session.commit()

    return jsonify({'message': 'Schule gelöscht'})


def _validate_school(data):
    if not data.get('name', '').strip():
        return 'Schulname ist erforderlich'
    if not data.get('city', '').strip():
        return 'Stadt ist erforderlich'
    if not data.get('country', '').strip():
        return 'Land ist erforderlich'
    if not data.get('fields') or len(data['fields']) < 1:
        return 'Mindestens eine Fachrichtung ist erforderlich'
    return None


def _set_fields_and_languages(school_id, fields, languages):
    for f in fields:
        db.session.execute(school_fields.insert().values(school_id=school_id, field=f))
    for lang in languages:
        db.session.execute(school_languages.insert().values(school_id=school_id, language=lang))
