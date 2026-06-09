# from argon2 import PasswordHasher

# pwd_context = PasswordHasher()

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)      

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

pwd_context = PasswordHasher()

def hash_password(password: str) -> str:
    """Hash a password using Argon2"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its Argon2 hash"""
    try:
        return pwd_context.verify(hashed_password, plain_password)
    except InvalidHashError:
        print(f"Invalid hash format: {hashed_password[:50]}...")
        return False
    except VerificationError:
        return False
    except Exception as e:
        print(f"Password verification error: {e}")
        return False