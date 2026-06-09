import logging



logging.basicConfig(
    level=logging.INFO,
    filename="backend/log/app.log",
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger("rentora_logger")