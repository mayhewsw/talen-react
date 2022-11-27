from typing import List
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import User
from talen.config import Config
import argparse
from pymongo.errors import DuplicateKeyError


def add_user(mongo_dal: MongoDAL, user: User):
    try:
        mongo_dal.add_user(user)
    except DuplicateKeyError:
        print("User with that username already exists in the db")

def update_user(mongo_dal: MongoDAL, user: User):
    delete_user(mongo_dal, user.id)
    add_user(mongo_dal, user)
    
def delete_user(mongo_dal: MongoDAL, username: str):
    user = mongo_dal.load_user(username)
    if not user:
        print(f"User {username} not found!")
    elif input(f"Please confirm deletion of user: {username}: [y/n]: ") == "y":
        mongo_dal.delete_user(username)


if __name__ == "__main__":
     
    parser = argparse.ArgumentParser()
    parser.add_argument("command", help="Whether to add, update, or delete", choices=["add", "update", "delete"], type=str)
    parser.add_argument("--username", "-u", help="Username", required=True, type=str)
    parser.add_argument("--password", "-p", help="Password", type=str)
    parser.add_argument("--email", "-m", help="Email", type=str)
    parser.add_argument("--admin", action="store_true", default=False)
    parser.add_argument("--read-only", action="store_true", default=False)
    parser.add_argument("--environment", "-e", help="Which environment to use", choices=["dev", "prod"], default="dev")

    args = parser.parse_args()

    config = Config(args.environment)
    mongo_dal = MongoDAL(config.mongo_url)

    # slightly awkward way of doing things... we set the password later
    password_hash = None 

    admin = args.admin
    readonly = args.read_only
    user = User(args.username, args.email, password_hash, admin, readonly)
    if args.password:
        user.set_password(args.password)

    if args.command == "add":
        if(not args.password or not args.email):
            print("Password and Email are required!")
        else:
            add_user(mongo_dal, user)
    elif args.command == "update":
        update_user(mongo_dal, user)
        pass
    elif args.command == "delete":
        # All this needs is the username
        delete_user(mongo_dal, args.username)
        pass
    else:
        print("Shouldn't ever get here!")
