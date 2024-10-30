from transformers import pipeline
import time
from huggingface_hub import login
import os 
import dotenv
# Login to Hugging Face Hub if needed
login(os.getenv('HF_TOKEN'))

# Initialize a model that doesn’t require flash_attn
generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

def generate_suggestion(prompt, retries=3, delay=2):
    """Generates a response using Hugging Face's text generation model with retry on error."""
    for attempt in range(retries):
        try:
            response = generator(prompt, max_length=200, num_return_sequences=1)
            return response[0]['generated_text']
        except Exception as e:
            if attempt < retries - 1:
                print(f"Generation error encountered: {e}. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2
            else:
                print("Error: Text generation failed after multiple retries.")
                return None

if __name__ == "__main__":
    prompt = input("Enter your prompt: ")
    suggestion = generate_suggestion(prompt)
    if suggestion:
        print("Generated Code Suggestion:\n")
        print(suggestion)
    else:
        print("Failed to generate a suggestion.")
