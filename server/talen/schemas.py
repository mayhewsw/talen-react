"""
Request/response validation schemas using marshmallow
"""
from marshmallow import Schema, fields, validate, ValidationError


class UserAuthSchema(Schema):
    """Schema for user authentication (login)"""
    username = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    password = fields.Str(required=True, validate=validate.Length(min=1))


class UserRegisterSchema(Schema):
    """Schema for user registration"""
    username = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))


class SaveDocSchema(Schema):
    """Schema for saving document annotations"""
    sentences = fields.List(fields.List(fields.Str()), required=True)
    labels = fields.List(fields.List(fields.Str()), required=True)
    docid = fields.Str(required=True)
    dataset = fields.Str(required=True)
    default_labels = fields.List(fields.List(fields.Str()), required=False)
    path = fields.Str(required=False)


class CopyToGithubSchema(Schema):
    """Schema for GitHub export request"""
    repo_name = fields.Str(required=True, validate=validate.Length(min=1))
    dataset_key = fields.Str(required=True, validate=validate.Length(min=1))


def validate_request(schema: Schema, data: dict) -> tuple:
    """
    Validate request data against a schema

    Args:
        schema: Marshmallow schema instance
        data: Request data to validate

    Returns:
        tuple: (validated_data, error_dict)
        If validation succeeds: (validated_data, None)
        If validation fails: (None, error_dict)
    """
    try:
        validated_data = schema.load(data)
        return validated_data, None
    except ValidationError as err:
        return None, err.messages
