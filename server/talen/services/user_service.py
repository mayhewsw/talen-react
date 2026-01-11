"""
User service - handles all user-related business logic
"""
from typing import Dict
from flask_jwt_extended import create_access_token

from talen.dal.mongo_dal import MongoDAL
from talen.models.user import User, LoginStatus
from talen.exceptions import (
    AuthenticationError,
    UserAlreadyExistsError,
    UserNotFoundError,
    PermissionDeniedError
)
from talen.logger import get_logger

LOG = get_logger()


class UserService:
    """Service for user management and authentication"""

    def __init__(self, dal: MongoDAL):
        self.dal = dal

    def authenticate(self, username: str, password: str) -> Dict[str, any]:
        """
        Authenticate a user and return JWT token with user info.

        Args:
            username: User's username
            password: User's password

        Returns:
            Dictionary with access_token, username, readOnly, and admin fields

        Raises:
            AuthenticationError: If authentication fails
        """
        status = self.dal.check_user(username, password)

        if status == LoginStatus.USER_NOT_FOUND:
            LOG.warning(f"Authentication failed: user '{username}' not found")
            raise AuthenticationError("Invalid username or password")

        if status == LoginStatus.PASSWORD_INCORRECT:
            LOG.warning(f"Authentication failed: incorrect password for user '{username}'")
            raise AuthenticationError("Invalid username or password")

        # Load user and generate token
        user = self.dal.load_user(username)
        access_token = create_access_token(identity=username)

        LOG.info(f"User '{username}' authenticated successfully")

        return {
            "access_token": access_token,
            "username": user.id,
            "readOnly": user.readonly,
            "admin": user.admin
        }

    def register(self, username: str, email: str, password: str) -> User:
        """
        Register a new user.

        Args:
            username: Desired username
            email: User's email address
            password: User's password

        Returns:
            The created User object

        Raises:
            UserAlreadyExistsError: If username already exists
        """
        # Check if user already exists
        if self.dal.check_user(username, password) == LoginStatus.SUCCESS:
            LOG.warning(f"Registration failed: user '{username}' already exists")
            raise UserAlreadyExistsError(f"User '{username}' already exists")

        # Create and save user
        user = User(username, email, None, False, False)
        user.set_password(password)
        self.dal.add_user(user)

        LOG.info(f"User '{username}' registered successfully")
        return user

    def get_user(self, username: str) -> User:
        """
        Get user by username.

        Args:
            username: Username to look up

        Returns:
            User object

        Raises:
            UserNotFoundError: If user doesn't exist
        """
        user = self.dal.load_user(username)
        if not user:
            raise UserNotFoundError(f"User '{username}' not found")
        return user

    def is_readonly(self, username: str) -> bool:
        """
        Check if a user is read-only.

        Args:
            username: Username to check

        Returns:
            True if user is read-only, False otherwise

        Raises:
            UserNotFoundError: If user doesn't exist
        """
        user = self.get_user(username)
        return user.readonly

    def is_admin(self, username: str) -> bool:
        """
        Check if a user is an admin.

        Args:
            username: Username to check

        Returns:
            True if user is admin, False otherwise

        Raises:
            UserNotFoundError: If user doesn't exist
        """
        user = self.get_user(username)
        return user.admin

    def check_permission(self, username: str, operation: str = "write"):
        """
        Check if user has permission for an operation.

        Args:
            username: Username to check
            operation: Operation type ('write', 'admin', etc.)

        Raises:
            PermissionDeniedError: If user lacks permission
            UserNotFoundError: If user doesn't exist
        """
        user = self.get_user(username)

        if operation == "write" and user.readonly:
            LOG.warning(f"Permission denied: user '{username}' is read-only")
            raise PermissionDeniedError(f"User '{username}' does not have write permission")

        if operation == "admin" and not user.admin:
            LOG.warning(f"Permission denied: user '{username}' is not an admin")
            raise PermissionDeniedError(f"User '{username}' does not have admin permission")
