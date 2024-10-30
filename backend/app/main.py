import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import Suggestion, create_database, database
# from generate_suggestion import generate_suggestion

app = FastAPI()

# Define Pydantic model for the request body
class SuggestionRequest(BaseModel):
    text: str

# Initialize the database on startup
@app.on_event("startup")
async def startup():
    await database.connect()
    await create_database()

# Disconnect from the database on shutdown
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Endpoint for generating suggestions
@app.post("/api/suggest")
async def suggest(suggestion_request: SuggestionRequest):
    text = suggestion_request.text
    if not text:
        raise HTTPException(status_code=400, detail="No input text provided")
    
    # Generate a suggestion using the model
    # suggestion = await generate_suggestion(text)
    
    # Store the generated suggestion in the database
    # new_suggestion = Suggestion(text=suggestion)
    # await new_suggestion.save()  # Save suggestion asynchronously

    return {"suggestion": 'suggestion'}
