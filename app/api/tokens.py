from flask import jsonify, g
from app import db
from app.api import bp
from app.api.auth import basic_auth, token_auth


@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
	token = g.current_user.get_token()
	token_expiration = g.current_user.get_token_expiration()
	db.session.commit()
	response = jsonify({'token': token, 'expiration':token_expiration})
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
	g.current_user.revoke_token()
	db.session.commit()
	return '', 204