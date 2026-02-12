import re
import spacy
from bs4 import BeautifulSoup
import emoji
from intent_extractor.logging.logger import logger


nlp = spacy.load("en_core_web_sm")

class Preprocessor:
    def __init__(self, text):
        self.text = text

    def clean_text(self):
        text = self.text

        text = BeautifulSoup(text, "html.parser").get_text()

        text = re.sub(r"http\S+|www\S+", "", text)

        text = re.sub(r"\S+@\S+", "", text)

        text = re.sub(r"\s+", " ", text)

        text = text.strip()

        return text


    def preprocess_for_absa(self, lowercase=False, lemmatize=False):
        text=self.text
        text = self.clean_text()

        if lowercase:
            text = text.lower()

        doc = nlp(text)

        processed_tokens = []

        for token in doc:

            if token.is_space:
                continue

            word = token.text

            if lemmatize and token.pos_ != "PROPN":
                word = token.lemma_

            processed_tokens.append(word)

        final_text = " ".join(processed_tokens)

        final_text = emoji.demojize(final_text)

        return final_text
