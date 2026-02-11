from intent_extractor.logging import logger
from intent_extractor.exception import asrException
import requests



class Cloudinary:
    def __init__(self):
        pass

    def loadWav(url):
        url = "http://res.cloudinary.com/dtzavevsb/video/upload/v1770579765/hiumkkouxbdjzgbhwxpq.mp3"
        resp = requests.get(url=url)
        
        flag = True
    
        if resp.status_code == 200:
            with open("downloaded_audio.mp3", "wb") as f:
                f.write(resp.content)
            logger.INFO("MP3 downloaded successfully!")
            
        else:
            logger.error("Failed to download, status code:", resp.status_code)
            flag = False
        
        
        return flag

    
