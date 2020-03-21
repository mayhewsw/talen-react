# from flask import Flask, session, request, flash, redirect, render_template, url_for
# from flask_wtf import FlaskForm
# from wtforms import StringField, PasswordField, BooleanField, SubmitField
# from wtforms.validators import DataRequired
# from flask_sqlalchemy import SQLAlchemy
# from flask_session import Session
# import random
# from config import Config

# app = Flask(__name__)
# app.config.from_object(Config)
# Session(app)
# db = SQLAlchemy(app)

# if __name__ == "__main__":
#     # this needs to come after db???
#     from models import User

# class LoginForm(FlaskForm):
#     username = StringField('Username', validators=[DataRequired()])
#     password = PasswordField('Password', validators=[DataRequired()])
#     remember_me = BooleanField('Remember Me')
#     submit = SubmitField('Sign In')

# class RegisterForm(FlaskForm):
#     username = StringField('Username', validators=[DataRequired()])
#     password = PasswordField('Password', validators=[DataRequired()])
#     email = StringField("Email", validators=[DataRequired()])
#     submit = SubmitField('Register')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     if form.validate_on_submit():
#         # Login and validate the user.
#         # user should be an instance of your `User` class

#         flash('Logged in successfully.')
#         username = request.form["username"]
#         print(f"hello {username}")
#         session['username'] = username

#         next = request.args.get('next')
#         # is_safe_url should check if the url is safe for redirects.
#         # See http://flask.pocoo.org/snippets/62/ for an example.
#         #if not is_safe_url(next):
#         #    return abort(400)

#         return redirect(next or url_for('index'))
#     elif "username" in session:
#         return redirect(url_for('index'))
#     return render_template('login.html', form=form)


# @app.route('/add_user', methods=['GET', 'POST'])
# def add_user():
        
#     username = request.form["username"]
#     email = request.form["email"]
#     password = request.form["password"]
    
#     new_user = User(username=username, email=email, admin=False)
#     new_user.set_password(password)
#     db.session.add(new_user)
#     db.session.commit()

#     users=User.query.all()

#     return render_template('show_users.html', users=users)


# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     form = RegisterForm()
#     return render_template('register.html', form=form)


# @app.route('/index')
# def index():
#     return render_template('index.html', greeting=session["username"] or "USER")

# if __name__ == "__main__":
#     app.debug=True
#     app.run()

from flask import Flask
from flask_login import LoginManager
from views import bp
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
Session(app)
CORS(app)

db = SQLAlchemy(app)

login_manager = LoginManager()

if __name__ == "__main__":
    # this needs to come after db???
    from models import User

    @login_manager.user_loader
    def load_user(user_id) -> User:
        print(f"load_user happening {user_id}")
        user = User.query.filter_by(username=user_id).first()
        print(user)
        return user

    login_manager.init_app(app)
    app.register_blueprint(bp, url_prefix='/api')

    #from app import views # noqa

    app.run(debug=True)
