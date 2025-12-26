#!/usr/bin/env python3
"""
Development user initialization script.
Creates test users for local development.

Usage:
    python scripts/init_dev_users.py
"""
import os
import sys

# Add parent directory to path so we can import talen
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from talen.config import Config
from talen.dal.mongo_dal import MongoDAL
from talen.models.user import User, LoginStatus
from talen.logger import get_logger, setup_logger

setup_logger()
LOG = get_logger()


def create_dev_users(mongo_dal: MongoDAL):
    """Create development test users"""
    users_created = 0

    # Test user 'a'
    if mongo_dal.check_user("a", "a") == LoginStatus.USER_NOT_FOUND:
        user = User("a", "user_a@example.com", None, False, True)
        user.set_password("a")
        mongo_dal.add_user(user)
        LOG.info("Created test user 'a' (admin)")
        users_created += 1
    else:
        LOG.info("Test user 'a' already exists")

    # Test user 'b'
    if mongo_dal.check_user("b", "b") == LoginStatus.USER_NOT_FOUND:
        user = User("b", "user_b@example.com", None, False, False)
        user.set_password("b")
        mongo_dal.add_user(user)
        LOG.info("Created test user 'b' (regular user)")
        users_created += 1
    else:
        LOG.info("Test user 'b' already exists")

    return users_created


def main():
    """Main entry point"""
    # Get environment
    env = os.environ.get("ENV", "dev")

    if env == "prod":
        LOG.error("This script should not be run in production!")
        LOG.error("Set ENV=dev or ENV=test to run this script")
        sys.exit(1)

    LOG.info(f"Initializing development users for environment: {env}")

    # Load config and connect to database
    config = Config(env)
    mongo_dal = MongoDAL(config.mongo_url)

    # Create test users
    users_created = create_dev_users(mongo_dal)

    LOG.info(f"Development user initialization complete. Created {users_created} new users.")


if __name__ == "__main__":
    main()
