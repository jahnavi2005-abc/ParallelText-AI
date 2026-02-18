from typing import List, Generator

def split_text(text: str, chunk_size: int = 1000) -> Generator[str, None, None]:
    """
    Splits text into chunks of approximately `chunk_size` characters.
    Tries to split on whitespace to avoid breaking words.
    """
    if not text:
        return

    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size
        if end >= text_len:
            yield text[start:]
            break
        
        # Try to find a space to break on
        while end > start and not text[end].isspace():
            end -= 1
        
        if end == start:
            # No space found, force break
            end = start + chunk_size
        
        yield text[start:end].strip()
        start = end
