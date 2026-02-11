import os


current_file_path = os.path.abspath(__file__)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(current_file_path)))
DATA_PATH = "C:\Users\Tejas\Downloads\Data"

# AUDIO_DATA_PATH = os.path.join(ROOT_DIR, "Audio")
# ARTIFACTS_PATH = os.path.join(ROOT_DIR, "artifacts") 
# LOGS_PATH = os.path.join(ROOT_DIR, "logs")           
# DF_PATH = os.path.join(ROOT_DIR, 'asr', 'artifacts')