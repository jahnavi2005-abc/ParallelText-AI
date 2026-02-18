import os

class DataLoader:
    @staticmethod
    def load_from_file(file_path: str) -> str:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()

    @staticmethod
    def load_raw(text: str) -> str:
        return text
