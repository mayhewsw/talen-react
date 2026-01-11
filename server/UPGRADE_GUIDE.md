# Phase 1 Security Upgrade Guide

This document outlines the Phase 1 security and dependency upgrades completed for the TALEN server application.

## Summary of Changes

### 1. Dependency Upgrades

All major dependencies have been updated to their latest stable versions:

| Package | Old Version | New Version |
|---------|------------|-------------|
| Flask | 1.0.2 | 3.1.0 |
| Flask-JWT | 0.3.2 (deprecated) | Removed |
| Flask-JWT-Extended | N/A | 4.7.1 (new) |
| PyJWT | 1.4.2 | 2.9.0 |
| Werkzeug | 2.0.2 | 3.1.3 |
| Flask-CORS | 3.0.7 | 5.0.0 |
| gunicorn | 20.1.0 | 23.0.0 |
| pymongo | 4.0.1 | 4.10.1 |
| marshmallow | N/A | 3.23.2 (new) |
| python-dotenv | N/A | 1.0.1 (new) |

See [requirements.txt](requirements.txt) for the complete list.

### 2. Security Improvements

#### Removed Hardcoded SECRET_KEY
- **Before**: Fallback to hardcoded secret key in [config.py:23](talen/config.py#L23)
- **After**: Application exits with error if `SECRET_KEY` environment variable is not set
- **Action Required**: You MUST set the `SECRET_KEY` environment variable before running the application

#### JWT Authentication Modernization
- **Before**: Used deprecated Flask-JWT (unmaintained since 2016)
- **After**: Migrated to Flask-JWT-Extended with modern security features
- **Breaking Change**: Authentication flow has changed (see API Changes below)

#### Improved Error Handling
- **Before**: Inconsistent error responses (e.g., `jsonify(400)`)
- **After**: Proper HTTP status codes with descriptive error messages
- **Example**: `return jsonify({"msg": "User not found"}), 404`

#### Request Validation
- **Before**: No input validation
- **After**: Marshmallow schemas validate all POST endpoints
- **Security Benefit**: Prevents injection attacks and malformed data

### 3. API Changes

#### Authentication Endpoint
The authentication endpoint behavior has changed:

**Before (Flask-JWT):**
```python
POST /auth
{"username": "user", "password": "pass"}

Response:
{"access_token": "token", "username": "user", "readOnly": false, "admin": true}
```

**After (Flask-JWT-Extended):**
```python
POST /users/authenticate
{"username": "user", "password": "pass"}

Response:
{"access_token": "token", "username": "user", "readOnly": false, "admin": true}
```

**Note**: The endpoint path has changed from `/auth` to `/users/authenticate`. Update your client accordingly.

#### Error Response Format
All error responses now include a `"msg"` field with a description:

```json
{
  "msg": "Invalid username or password"
}
```

Validation errors include an additional `"errors"` field:

```json
{
  "msg": "Validation error",
  "errors": {
    "username": ["Missing data for required field."],
    "email": ["Not a valid email address."]
  }
}
```

#### JWT Protected Endpoints
All endpoints decorated with `@jwt_required()` now expect the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

The token is no longer passed in the URL query string.

### 4. New Files

#### `.env.example`
Template for required environment variables. Copy to `.env` and fill in your values:

```bash
cp .env.example .env
# Edit .env with your actual values
```

Required variables:
- `SECRET_KEY` - Flask secret key (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)
- `MONGO_USERNAME` - MongoDB username (for remote databases)
- `MONGO_PASSWORD` - MongoDB password (for remote databases)
- `GITHUB_USERNAME` - GitHub username (for export functionality)
- `GITHUB_PASSWORD` - GitHub password or token

#### `talen/schemas.py`
New file containing Marshmallow validation schemas for request validation.

## Migration Steps

### Step 1: Install Updated Dependencies

```bash
cd server
pip install -r requirements.txt
```

**Note**: It's recommended to use a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Set Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Generate a secure SECRET_KEY:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. Edit `.env` and add your actual values:
   ```bash
   SECRET_KEY=<generated-secret-key>
   MONGO_USERNAME=<your-mongo-username>
   MONGO_PASSWORD=<your-mongo-password>
   GITHUB_USERNAME=<your-github-username>
   GITHUB_PASSWORD=<your-github-token>
   ENV=dev
   PORT=8080
   ```

### Step 3: Update Client Code

If you have a React/JavaScript client, update the authentication endpoint:

**Before:**
```javascript
fetch('/auth', {
  method: 'POST',
  body: JSON.stringify({username, password})
})
```

**After:**
```javascript
fetch('/users/authenticate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username, password})
})
```

### Step 4: Test the Application

1. Start the development server:
   ```bash
   python app.py
   ```

2. Verify the application starts without errors

3. Test authentication:
   ```bash
   curl -X POST http://localhost:8080/users/authenticate \
     -H "Content-Type: application/json" \
     -d '{"username":"a","password":"a"}'
   ```

4. Test protected endpoints with the JWT token:
   ```bash
   curl http://localhost:8080/users/me \
     -H "Authorization: Bearer <token-from-previous-step>"
   ```

### Step 5: Update Production Deployment

1. Set environment variables in your production environment
2. Update any deployment scripts to use the new environment variables
3. Update any reverse proxy configurations if the authentication endpoint path changed
4. Deploy and test

## Potential Issues and Solutions

### Issue: Application won't start - "SECRET_KEY environment variable is required"

**Solution**: Set the `SECRET_KEY` environment variable as described in Step 2 above.

### Issue: JWT tokens from old system don't work

**Solution**: This is expected. All users will need to log in again after the upgrade to receive new JWT tokens. Old tokens are incompatible with Flask-JWT-Extended.

### Issue: Client receives 401 Unauthorized errors

**Solution**:
- Ensure the client is sending the JWT token in the `Authorization` header
- Format: `Authorization: Bearer <token>`
- Verify the token hasn't expired (default: 6 hours)

### Issue: Import errors for new dependencies

**Solution**: Ensure you've run `pip install -r requirements.txt` in your virtual environment.

### Issue: Tests are failing

**Solution**: Tests may need to be updated to use the new authentication system. Update test fixtures to use Flask-JWT-Extended's `create_access_token()` function.

## Code Changes Reference

### Files Modified
- [requirements.txt](requirements.txt) - All dependency versions updated
- [app.py](app.py) - JWT initialization changed from Flask-JWT to Flask-JWT-Extended
- [talen/config.py](talen/config.py) - Removed hardcoded SECRET_KEY, added validation
- [talen/views.py](talen/views.py) - Updated all endpoints with proper error handling and validation

### Files Added
- [.env.example](.env.example) - Environment variable template
- [talen/schemas.py](talen/schemas.py) - Request validation schemas
- [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md) - This file

## Validation Schemas

The following endpoints now use Marshmallow validation:

1. **POST /users/authenticate** - `UserAuthSchema`
   - Requires: `username` (1-100 chars), `password` (min 1 char)

2. **POST /users/register** - `UserRegisterSchema`
   - Requires: `username` (1-100 chars), `email` (valid email), `password` (min 6 chars)

3. **POST /savedoc** - `SaveDocSchema`
   - Requires: `sentences`, `labels`, `docid`, `dataset`

4. **POST /copy_to_github** - `CopyToGithubSchema`
   - Requires: `repo_name`, `dataset_key`

## Next Steps (Future Phases)

Phase 1 focused on critical security updates. Future phases will address:

**Phase 2 - Code Quality:**
- Remove vestigial code (suggestions.py, tmp.py files)
- Separate serialization from models
- Fix the "dummy annotation" hack
- Make database operations atomic

**Phase 3 - Architecture:**
- Add service layer between views and DAL
- Implement API versioning (/api/v1/)
- Add OpenAPI/Swagger documentation
- Improve test coverage

## Support

If you encounter issues during the upgrade:

1. Check the logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure you're using the correct Python version (3.9+)
4. Try running with `flask run --debug` for more detailed error messages

For additional help, refer to the official documentation:
- [Flask 3.x Documentation](https://flask.palletsprojects.com/)
- [Flask-JWT-Extended Documentation](https://flask-jwt-extended.readthedocs.io/)
- [Marshmallow Documentation](https://marshmallow.readthedocs.io/)
