from fastapi import FastAPI, HTTPException, Depends, Request
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats
import uuid
import json


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

class Answers(BaseModel):
    answers: str

def your_processing_function(list_string:Answers):
    # Convert the string to an actual list
    # Replace single quotes with double quotes to make it valid JSON.
    json_string = list_string.replace("'", '"')
    actual_list = json.loads(json_string)

    # Split the first item into two parts and combine with the rest of the list
    first_item_parts = actual_list[0].split(', ')
    parsed_data = first_item_parts + actual_list[1:]
    x = parsed_data
    def calc_result(h,l,x):
        return ( h - l ) * x + l

    def Q1(x): #transport
        if x[0] == "Combustion Engine Vehicle":
            return calc_result(6.24,1.56, float(x[1]))
        elif x[0] == "Electric Powered Car":
            return calc_result(0.054,0.0135, float(x[1]))
        elif x[0] == "Public Transport":
            return calc_result(1.288,0.307, float(x[1]))
        elif x[0] == "Bicycle":
            return calc_result(0.1553,0.038325, float(x[1]))

    def Q2(x): #airplane
        if x[2] == "4 or more":
            return 1
        elif float(x[2]) == 0:
            return 0
        elif float(x[2]) == 1:
            return 0.25
        elif float(x[2]) == 2:
            return 0.5
        elif float(x[2]) == 3:
            return 0.75
        else:
            return 0  # or return a default value if needed


    def Q3(x): #compost
        if x[3] == "Yes":
            return 0.004106035

        if x[3] == "No":
            return 0.055822917

    def Q4(x): #recycle
        return calc_result(0.904,0.226, float(x[4]))

    def Q5(x): #diet
        if x[5] == "Vegan":
            return 1.5
        if x[5] == "Vegeterian":
            return 1.7
        if x[5] == "Other diet":
            return 2.9

    def final_score_calc(Q1,Q2,Q3,Q4,Q5):
        return Q1 * 0.225 + Q2 * 0.375 + Q3 * 0.2 + Q4 * 0.1 + Q5 * 0.1

    def final_score_message(x): 
        msg = []
        if x >= 0 and x <= 5:
            msg = ["You're an Eco-Beginner! Just stepping into the world of green heroics. Time to power up your eco-abilities!","0-5.png"]

        elif x > 5 and x <= 15:
            msg = ["You're a Sprout Hero! Your eco-journey is budding. With a little more nurturing you'll grow stronger in your green quests!","5-15.png"]

        elif x > 15 and x <= 30:
            msg = ["Like a Recycle Ranger! You're learning to master the tools of sustainability. Your eco-adventures are gaining momentum!","15-30.png"]

        elif x > 30 and x <= 45:
            msg = ["As an Eco-Explorer! You're navigating the green paths well. Stay vigilant and continue your quest for a greener world!","30-45.png"]

        elif x > 45 and x <= 60:
            msg = ["You're a Nature Guardian! Actively making a positive impact. Keep up your eco-efforts to protect our planet!","45-60.png"]

        elif x > 60 and x <= 75:
            msg = ["Impressive! You're an Eco-Knight! Bravely battling against environmental challenges. Your journey to sustainability is inspiring!","60-75.png"]

        elif x > 75 and x <= 85:
            msg = ["You're a Green Sage! Nearly at the pinnacle of eco-wisdom. Your sustainable actions are a beacon of hope!","75-85.png"]

        elif x > 85 and x <= 90:
            msg = ["Wow, you're an Earth Avenger! Your superpowers are nurturing our planet back to health. Just a few steps away from eco-perfection.","85-90"]

        elif x > 90 and x <= 95:
            msg = ["As an Eco-Sentinel! you're a role model in environmental stewardship. Continue to add to your impressive legacy of sustainability.","90-95"]

        elif x > 95 and x <= 100:
            msg = ["Congratulations, Eco-Champion! You lead the parade of sustainability by inspiring others to follow in your green footsteps!","95-100"]
        return msg

    def draw_graph(mean,std_dev,result):
        unique_id = uuid.uuid4()
        # Create a unique file path for each plot
        file_path = f"../React/questionnaire-app/public/plot_{unique_id}.png"
        # Create a range of x values for the normal distribution
        x = np.linspace(mean - 4*std_dev, mean + 4*std_dev, 1000)

        # Calculate the normal distribution values
        y = stats.norm.pdf(x, mean, std_dev)

        # Plot the normal distribution
        plt.plot(x, y, label='Normal Distribution')

        # Draw a vertical line at the value of 'result'
        plt.axvline(x=result, color='k', linestyle='--', label=f"Result = {result}")

        # Shade the area to the right of the line
        plt.fill_between(x, y, where=(x > result), color='red', alpha=0.5)

        # Calculate and display the percentile of the value 'result'
        percentile = stats.norm.cdf(result, mean, std_dev)
        plt.title(f"Normal Distribution with Mean = {mean}, Std Dev = {std_dev}\n"
                f"Percentile of Result ({result}) = {percentile:.2%}")

        # Add legend and labels
        plt.legend()
        plt.xlabel('Value')
        plt.ylabel('Probability Density')

        # Show the plot
        # plt.show()
        # Save the plot
        plt.savefig(file_path)
        plt.close()
        #print(f"Your purity score:  {1- percentile:.2%}")
        return file_path

    def percentage_from_bell_curve(result, mean, std_dev):
        # Create a range of x values for the normal distribution
        x = np.linspace(mean - 4 * std_dev, mean + 4 * std_dev, 1000)

        # Calculate the normal distribution values
        y = stats.norm.pdf(x, mean, std_dev)

        # Plot the normal distribution
        plt.plot(x, y, label='Normal Distribution')

        # Draw a vertical line at the value of 'result'
        plt.axvline(x=result, color='k', linestyle='--', label=f"Result = {result}")

        # Shade the area to the right of the line
        #plt.fill_between(x, y, where=(x > result), color='red', alpha=0.5)
        plt.close()
        # Calculate and display the percentile of the value 'result'
        percentile = stats.norm.cdf(result, mean, std_dev)
        final_score = 1 - percentile
        return final_score



    
    final_score = final_score_calc(percentage_from_bell_curve(Q1(x),2.686471807,1.5),
                                percentage_from_bell_curve(Q2(x),0.5,0.25),percentage_from_bell_curve(Q3(x),0.059928952,0.03),
                                percentage_from_bell_curve(Q4(x),0.452,0.05),percentage_from_bell_curve(Q5(x),2.74,0.2))
    return [draw_graph(2.686471807,1.5,Q1(x)), draw_graph(0.5,0.25,Q2(x)), draw_graph(0.059928952,0.03,Q3(x)), draw_graph(0.452,0.05,Q4(x)), draw_graph(2.74,0.2,Q5(x)), final_score, final_score_message(final_score)]



    # our final List is [final score, string related to picture/final score, picture of character,
    # picture of graph of method of transport]

@app.post("/submit_answers")
async def submit_answers(submission: Answers):
    # Parse the JSON string to a Python object
    answers = str(json.loads(submission.answers))
    # Process the answers...
    output = your_processing_function(answers)
    print(output)
    # your_processing_function(answers)
    return {"status": "success", "message": "Answers processed", "output" : str(output)}


