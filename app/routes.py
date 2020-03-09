from flask import render_template
from app import app_flask

@app_flask.route('/')
@app_flask.route('/index')
def index():
	user = {'username': 'Viswajeet'}
	posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
	return render_template('index.html',title='Home',user=user)