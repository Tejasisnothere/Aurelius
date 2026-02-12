import nltk
import torch
import spacy
from nltk.tokenize import sent_tokenize
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
from intent_extractor.pipeline.preprocessor.textPreprocessor import Preprocessor

nltk.download('punkt')


nlp = spacy.load("en_core_web_sm")


MODEL_NAME = "yangheng/deberta-v3-large-absa-v1.1"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

model.eval()  # inference mode


class AspectSentimentAnalysis:
    
    def __init__(self, review_text):
        self.review_text = review_text

    # -------------------------
    # 1️⃣ Extract aspects
    # -------------------------
    def extract_aspects(self, sentence):
        doc = nlp(sentence)
        aspects = []

        for chunk in doc.noun_chunks:
            aspects.append(chunk.text.lower())

        return list(set(aspects))

    # -------------------------
    # 2️⃣ Predict sentiment for ONE (sentence, aspect) pair
    # -------------------------
    def get_aspect_sentiment(self, sentence, aspect):

        encoded = tokenizer(
            sentence,
            aspect,
            return_tensors="pt",
            truncation=True,
            padding=True
        )

        with torch.no_grad():
            output = model(**encoded)

        scores = F.softmax(output.logits, dim=1)
        predicted_class = torch.argmax(scores, dim=1).item()

        label_map = {
            0: "negative",
            1: "neutral",
            2: "positive"
        }

        return label_map[predicted_class], scores.tolist()[0]

    # -------------------------
    # 3️⃣ Full ABSA pipeline
    # -------------------------
    def aspect_based_sentiment_analysis(self):

        results = []

        sentences = sent_tokenize(self.review_text)

        for sentence in sentences:

            aspects = self.extract_aspects(sentence)

            for aspect in aspects:

                sentiment, confidence = self.get_aspect_sentiment(sentence, aspect)

                results.append({
                    "sentence": sentence,
                    "aspect": aspect,
                    "sentiment": sentiment,
                    "confidence": confidence
                })

        return results


if __name__ == "__main__":

    review = """The cooling performance is excellent but the installation process was frustrating.
Noise levels are high.
I would like to see some improvement in the case of Headphones."""

    pr = Preprocessor(review)
    asp = AspectSentimentAnalysis(review)

    output = asp.aspect_based_sentiment_analysis()

    for item in output:
        print(item)
