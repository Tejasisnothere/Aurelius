import json
from intent_extractor.constants.application import DATA_PATH
from intent_extractor.logging.logger import logger
# from intent_extractor.exception import IRException
import matplotlib.pyplot as plt
import os
import seaborn as sns
import pandas as pd




class ReviewIngestor:
    def __init__(self, product_type, batch):
        
        self.prod = product_type
        self.batch = batch
        self.file_path = os.path.join(DATA_PATH, "Reviews",  self.prod, 'split_batches', f'batch_{self.batch}.jsonl.gz')

        self.df = None




    def import_data(self):
        try:

            
            self.df = pd.read_json(self.file_path, compression="gzip", lines=True)
            # sns.hisplot(self.df['rating'])
            # plt.show()
            print(self.df.head())




        except Exception as e:
            raise IRException(e)
        


RV = ReviewIngestor('Appliances', 0)
RV.import_data()

