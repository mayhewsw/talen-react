"""
Custom exception hierarchy for TALEN application.
All exceptions include proper HTTP status codes for API responses.
"""


class TALENException(Exception):
    """
    Base exception for all TALEN errors.
    All custom exceptions should inherit from this.
    """
    status_code = 500

    def __init__(self, message: str = None):
        super().__init__(message)
        self.message = message or self.__class__.__name__


class ValidationError(TALENException):
    """Raised when request validation fails"""
    status_code = 400


class AuthenticationError(TALENException):
    """Raised when authentication fails"""
    status_code = 401


class PermissionDeniedError(TALENException):
    """Raised when user lacks permission for an operation"""
    status_code = 403


class ResourceNotFoundError(TALENException):
    """Base class for not found errors"""
    status_code = 404


class DocumentNotFoundError(ResourceNotFoundError):
    """Raised when a document cannot be found"""
    pass


class UserNotFoundError(ResourceNotFoundError):
    """Raised when a user cannot be found"""
    pass


class DatasetNotFoundError(ResourceNotFoundError):
    """Raised when a dataset cannot be found"""
    pass


class ConflictError(TALENException):
    """Raised when a resource conflict occurs (e.g., duplicate user)"""
    status_code = 409


class UserAlreadyExistsError(ConflictError):
    """Raised when attempting to create a user that already exists"""
    pass


class InternalServerError(TALENException):
    """Raised for unexpected internal errors"""
    status_code = 500


class DatabaseError(InternalServerError):
    """Raised when database operations fail"""
    pass


class ExternalServiceError(TALENException):
    """Raised when external service (e.g., GitHub) fails"""
    status_code = 502  # Bad Gateway
