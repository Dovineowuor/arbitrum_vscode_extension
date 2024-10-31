from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from config import Config

Base = declarative_base()
database = Database(Config.DATABASE_URL)

class Suggestion(Base):
    __tablename__ = "suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)

    async def save(self):
        query = Suggestion.__table__.insert().values(text=self.text)
        await database.execute(query)

# Function to create the database tables
async def create_database():
    engine = create_engine(Config.DATABASE_URL)
    async with database.connection() as connection:
        await connection.run_sync(Base.metadata.create_all)
