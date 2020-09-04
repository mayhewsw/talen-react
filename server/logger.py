import logging
from typing import Optional

def setup_logger(outpath: Optional[str] = None):
    fstring = "%(asctime)s [%(levelname)s] %(message)s"
    logging.basicConfig(format=fstring)

    logging.getLogger("talen").setLevel(logging.INFO)

def get_logger():
    return logging.getLogger("talen")