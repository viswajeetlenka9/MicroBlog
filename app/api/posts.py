from app.api import bp
from flask import jsonify, request, url_for, g, abort
from app.models import User, Post
from app import db
from app.api.errors import bad_request
from app.api.auth import token_auth


@bp.route('/posts/<int:id>', methods=['GET'])
@token_auth.login_required
def get_post_of_user(id):
	user = User.query.get_or_404(id)
	page = request.args.get('page', 1, type=int)
	per_page = min(request.args.get('per_page', 5, type=int), 100)
	data = Post.to_collection_dict(user.posts.order_by(Post.timestamp.desc()), page, per_page,'api.get_post_of_user', id=id)
	response = jsonify(data)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response


@bp.route('/posts/<string:username>', methods=['GET'])
@token_auth.login_required
def get_post_of_user_by_username(username):
	user = User.query.filter_by(username=username).first_or_404()
	page = request.args.get('page', 1, type=int)
	per_page = min(request.args.get('per_page', 5, type=int), 100)
	data = Post.to_collection_dict(user.posts.order_by(Post.timestamp.desc()), page, per_page,'api.get_post_of_user_by_username', username=username)
	response = jsonify(data)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response


@bp.route('/posts', methods=['GET'])
@token_auth.login_required
def get_all_posts():
	page = request.args.get('page', 1, type=int)
	per_page = min(request.args.get('per_page', 5, type=int), 100)
	data = Post.to_collection_dict(Post.query.order_by(Post.timestamp.desc()), page, per_page, 'api.get_all_posts')
	response = jsonify(data)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response


@bp.route('/posts', methods=['POST'])
@token_auth.login_required
def create_post():
	data = request.get_json() or {}
	if 'user_id' not in data or 'body' not in data:
		return bad_request('must include user_id and body fields')
	if User.query.filter_by(id=data['user_id']).first():
		post = Post()
		post.from_dict(data)
		db.session.add(post)
		db.session.commit()
		response = jsonify(post.to_dict())
		response.status_code = 201
		response.headers['Location'] = url_for('api.get_post_of_user', id=post.user_id)
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response
	return bad_request('username not found')

