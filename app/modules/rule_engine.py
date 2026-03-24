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
            "phone": re.compile(r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"),
            "url": re.compile(r"https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+"),
            "currency": re.compile(r"\$\d+(?:,\d{3})*(?:\.\d{2})?")
        }
        
        self.stop_words = {"the", "and", "is", "in", "it", "to", "of", "for", "on", "with", "as", "at", "by", "an", "this", "that", "are", "from", "be", "or", "was", "not"}

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

    def extract_keywords(self, text: str, top_n: int = 3) -> list:
        if not text:
            return []
        
        words = text.lower().split()
        counts = {}
        for word in words:
            word = word.strip(".,!?\"'()[]{}*:;")
            if len(word) > 3 and word not in self.stop_words and word.isalpha():
                counts[word] = counts.get(word, 0) + 1
                
        sorted_words = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return [word for word, count in sorted_words[:top_n]]

rule_engine = RuleEngine()
