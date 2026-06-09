

from slowapi import RateLimiter
from slowapi.util import get_remote_address


limiter = RateLimiter(key_func=get_remote_address)