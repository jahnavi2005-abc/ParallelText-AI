import csv
import random

# Data pools
positive_fragments = [
    "I love this product.", "It is amazing!", "Best service ever.", 
    "Highly recommended.", "Great experience.", "So happy with the result.",
    "Excellent quality.", "Wonderful support team."
]
negative_fragments = [
    "This is terrible.", "I hate it.", "Worst experience ever.", 
    "Do not buy this.", "Poor quality.", "Absolute failure.",
    "Very disappointed.", "Waste of money."
]
patterns = [
    "Contact support@example.com based on ticket 123.",
    "Call us at 555-0199 for help.",
    "Meeting on 2025-12-25.",
    "Reach out to admin@company.org.",
    "Phone: 123-456-7890."
]

def generate_large_csv(filename="large_test_data.csv", rows=5000):
    print(f"Generating {rows} rows for {filename}...")
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "content"])
        
        for i in range(1, rows + 1):
            # Mix sentiments and patterns
            sentiment = random.choice([positive_fragments, negative_fragments])
            text_parts = random.sample(sentiment, k=2)
            if random.random() > 0.7:
                text_parts.append(random.choice(patterns))
            
            content = " ".join(text_parts)
            writer.writerow([i, content])
    print("Done!")

def generate_long_text(filename="long_text.txt", repeats=500):
    print(f"Generating long text file {filename}...")
    with open(filename, "w", encoding="utf-8") as f:
        for _ in range(repeats):
            f.write(" ".join(random.sample(positive_fragments + negative_fragments + patterns, k=3)) + "\n")
    print("Done!")

if __name__ == "__main__":
    generate_large_csv()
    generate_long_text()
