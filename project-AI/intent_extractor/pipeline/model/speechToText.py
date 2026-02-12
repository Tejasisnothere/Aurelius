from intent_extractor.logging.logger import logger

# from asr.exception import asrException
# from faster_whisper import WhisperModel
from intent_extractor.constants.application import AUDIO_DATA_PATH, DF_PATH
import os 
from dotenv import load_dotenv
import requests
import time
import googletrans
import asyncio
from googletrans import Translator
from langdetect import detect
import pandas as pd




### pyannote environment 

load_dotenv()
API_KEY = os.environ['PYANNOTE']

class TranscribeGeneral:

    def __init__(self,filename):
        self.filename = filename
        self.audio_path = os.path.join(AUDIO_DATA_PATH, self.filename)

        
        self.presigned_url = ""
        self.object_key = ""


        self.native_extract = ""
        
    
    def uploadPyPan(self):
        input_path = self.audio_path  
        object_key = "my-meeting-recording"     

        

        
        response = requests.post(
            "https://api.pyannote.ai/v1/media/input",
            json={"url": f"media://{object_key}"},
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            }
        )
        response.raise_for_status()
        data = response.json()
        presigned_url = data["url"]

        logger.info(f"Pre-signed URL obtained: {presigned_url}")

        
        with open(input_path, "rb") as f:
            upload_response = requests.put(presigned_url, data=f)
        upload_response.raise_for_status()
        logger.info("Upload successful!")

        self.presigned_url = presigned_url
        self.object_key = object_key

        
    
    def transcribe_diarize(self):
        self.uploadPyPan()

        OBJECT_KEY = self.object_key

        url = "https://api.pyannote.ai/v1/diarize"
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "url": f"media://{OBJECT_KEY}",
            "model": "precision-2",
            "transcription": True,
            "numSpeakers": 2
        }

        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.text}")
            exit()

        resp_json = response.json()
        job_id = resp_json["jobId"]
        # logger.info("Job created:", resp_json)

        status_url = f"https://api.pyannote.ai/v1/jobs/{job_id}"

        while True:
            status_resp = requests.get(status_url, headers={"Authorization": f"Bearer {API_KEY}"}).json()
            
            if status_resp["status"] == "succeeded":
                print("Diarization + transcription succeeded!")
                # print(status_resp["output"])

                lst = status_resp['output']['turnLevelTranscription']
                for i in lst:
                    self.native_extract += i['text']+' '

                print(self.native_extract)
                return lst
                print()
                for i in lst:
                    print(i['text'], end=" ")
                print('\n')
                break
            elif status_resp["status"] in ("failed", "canceled"):
                print("Job did not succeed:", status_resp)
                break
            else:
                print("Job status:", status_resp["status"], "- waiting...")
                time.sleep(5)

            

    def detect_lang(self):
        
        
        language = detect(self.native_extract)
        print(language)

        return language

        

    def translate(self):
        translator = Translator()

        dir_out = self.transcribe_diarize()

        lang = self.detect_lang()

        if lang=='en':
            return

        async def translate_segments(segments):
            for segment in segments:



                translated = await translator.translate(segment["text"], dest="en")
                segment["text_en"] = translated.text
            return segments
        

        diarization_output = asyncio.run(translate_segments(dir_out))

        df = pd.DataFrame(data={'start':[], 'end':[], 'speaker':[], 'text_en':[]})

        for i in diarization_output:
            df.loc[len(df)] = [i['start'], i['end'], i['speaker'], i['text_en'].lower()]
        
        df_store_path = os.path.join(DF_PATH, "diarized_translated_text_df.csv")
        df.to_csv(df_store_path)
        

        print(diarization_output)

        print("\n\n\n")

        for i in df.iloc():
            print(i['text_en'], end=" ")


if __name__ == "__main__":
    TG = TranscribeGeneral('cropped_german_call.wav')
    TG.translate()