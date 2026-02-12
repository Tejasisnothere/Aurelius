import os


current_file_path = os.path.abspath(__file__)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(current_file_path)))
DATA_PATH = "C:/Users/Tejas/Downloads/Data"
AUDIO_DATA_PATH = os.path.join(DATA_PATH, "Audio")
TEXT_DF_PATH = os.path.join(ROOT_DIR, 'intent_extractor', 'artifacts', 'textDF')
AUDIO_DF_PATH = os.path.join(ROOT_DIR, 'intent_extractor', 'artifacts', 'audioDF')



# ARTIFACTS_PATH = os.path.join(ROOT_DIR, "artifacts") 
# LOGS_PATH = os.path.join(ROOT_DIR, "logs")           
