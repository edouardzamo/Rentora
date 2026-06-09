# test_token.py
from backend.schemas.jwt import verify_access_token

# Get your token from localStorage (copy from browser)
# Run this in browser console first to get token:
# console.log(localStorage.getItem("access_token"))

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE0LCJyb2xlIjoibGFuZGxvcmQiLCJleHAiOjE3ODA2OTA2ODB9.3bmZZqbKsS-gVcfVgkDuiM8R7ErRU7G5vaqbhI4BOhI"  # Paste your token here

result = verify_access_token(token)
print(f"Verification result: {result}")