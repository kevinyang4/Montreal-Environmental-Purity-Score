from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionnaireBase(BaseModel):
    amount:float
    category:str
    description:str
    is_income:bool
    date:str

class QuestionnaireModel(QuestionnaireBase):
    id:int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/questionnaire/", response_model=QuestionnaireModel)
async def create_questionnaire(questionnaire: QuestionnaireBase,db:db_dependency):
    db_questionnaire = models.Questionnaire(**questionnaire.model_dump())
    db.add(db_questionnaire)
    db.commit()
    db.refresh(db.questionnaire)
    return db_questionnaire

@app.get("/questionnaire/", response_model=List[QuestionnaireModel])
async def read_questionnaire(db: db_dependency,skip: int=0, limit:int =100):
        questionnaire = db.query(models.Questionnaire).offset(skip).limit(limit).all()
        return questionnaire