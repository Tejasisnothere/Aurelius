import noisereduce as nr
from intent_extractor.logging.logger import logger
from intent_extractor.exception import asrException
from intent_extractor.constant.application import AUDIO_DATA_PATH
import librosa
import os
import soundfile as sf
import numpy as np


class AudioPreprocessing:
    def __init__(self, filename):
        self.audio_path = os.path.join(AUDIO_DATA_PATH, filename)
        self.filename = filename
        self.y, self.sr = librosa.load(self.audio_path, sr=None)
    

    def calcNoise(self):
        

        
        noise_clip = self.y[:int(0.5*self.sr)]
        noise_profile = nr.reduce_noise(y=self.y, sr=self.sr, y_noise=noise_clip, prop_decrease=0.0)


        noise_rms = np.sqrt(np.mean(noise_profile**2))
        
        

        if(noise_rms>0.1):
            logger.info(f'noisy audio, noise rms = {noise_rms}')
        else:
            logger.info(f'noise rms={noise_rms}')



    def deNoise(self):


        try:
        
                
            y, sr = librosa.load(self.audio_path, sr=None)






            noise_clip = y[:int(0.5*sr)]
            reduced_noise_audio = nr.reduce_noise(y=y, sr=sr, y_noise=noise_clip)

            

            sf.write(self.audio_path, reduced_noise_audio, sr)

        except Exception as e:
            raise asrException(e)        