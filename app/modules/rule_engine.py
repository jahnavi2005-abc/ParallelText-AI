import re

class RuleEngine:
    def __init__(self):
        # Basic dictionary for demonstration
        self.positive_words = {"good", "great", "excellent", "amazing", "wonderful", "happy", "success", "love"}
        self.negative_words = {"bad", "terrible", "poor", "awful", "failure", "hate", "sad", "wrong"}
        
        # Compiled patterns
        self.patterns = {
            "email": re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"),
            "date": re.compile(r"\d{4}-\d{2}-\d{2}"),
            "phone": re.compile(r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b")
        }

    def analyze_sentiment(self, text: str) -> float:
        """
        Simple dictionary-based sentiment analysis.
        Returns a score between -1.0 (negative) and 1.0 (positive).
        """
        if not text:
            return 0.0
            
        words = text.lower().split()
        score = 0
        total_relevant = 0
        
        for word in words:
            # Simple stripping of punctuation
            word = word.strip(".,!?\"'")
            if word in self.positive_words:
                score += 1
                total_relevant += 1
            elif word in self.negative_words:
                score -= 1
                total_relevant += 1
                
        if total_relevant == 0:
            return 0.0
            
        return score / total_relevant

    def detect_patterns(self, text: str) -> dict:
        """
        Scans text for defined regex patterns.
        """
        results = {}
        for name, pattern in self.patterns.items():
            matches = pattern.findall(text)
            if matches:
                results[name] = matches
        return results

rule_engine = RuleEngine()
