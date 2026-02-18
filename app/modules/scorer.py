from typing import List

def aggregate_sentiment(scores: List[float]) -> float:
    """
    Aggregates a list of sentiment scores into a final score.
    """
    if not scores:
        return 0.0
    return sum(scores) / len(scores)

def merge_patterns(patterns_list: List[dict]) -> dict:
    """
    Merges a list of pattern dictionaries into a single dictionary.
    """
    merged = {}
    for p in patterns_list:
        for key, values in p.items():
            if key not in merged:
                merged[key] = []
            merged[key].extend(values)
            
    # Deduplicate values
    for key in merged:
        merged[key] = list(set(merged[key]))
        
    return merged
