import json
from intent_extractor.constants.application import DATA_PATH
from intent_extractor.logging.logger import logger
from intent_extractor.exception import IRException
import os


class ReviewIngestor:
    def __init__(self, filename):
        
        self.filename = filename
        self.file_path = os.path.join(DATA_PATH, "Reviews", self.filename)


    def impot_data(self):
        try:
            with open(self.file_path, 'r') as fp:
                content = fp.readlines()
                


        except Exception as e:
            raise IRException(e)