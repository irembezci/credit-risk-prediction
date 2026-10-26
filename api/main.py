from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import joblib
from typing import Literal
from pydantic import BaseModel, Field
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "xgb_model.pkl"
PREPROCESSOR_PATH = BASE_DIR / "models" / "preprocessor.pkl"

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


app = FastAPI(
    title="Credit Risk Prediction API",
    description="API for predicting credit default risk using XGBoost.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


class CreditRiskInput(BaseModel):
    person_age: int = Field(gt=0)
    person_income: float = Field(gt=0)

    person_home_ownership: Literal[
        "RENT",
        "OWN",
        "MORTGAGE",
        "OTHER"
    ]

    person_emp_length: float = Field(ge=0)

    loan_intent: Literal[
        "PERSONAL",
        "EDUCATION",
        "MEDICAL",
        "VENTURE",
        "HOMEIMPROVEMENT",
        "DEBTCONSOLIDATION"
    ]

    loan_grade: Literal[
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G"
    ]

    loan_amnt: float = Field(gt=0)
    loan_int_rate: float = Field(ge=0)

    cb_person_default_on_file: Literal["Y", "N"]

    cb_person_cred_hist_length: int = Field(ge=0)


@app.post("/predict")
def predict_credit_risk(data: CreditRiskInput):

    # Convert input data to DataFrame
    input_data = pd.DataFrame([data.model_dump()])

    # Calculate loan-to-income ratio
    loan_to_income_ratio = data.loan_amnt / data.person_income

    # Add calculated feature required by the model
    input_data["loan_percent_income"] = loan_to_income_ratio

    # Transform input using the saved preprocessor
    transformed_data = preprocessor.transform(input_data)

    # Model prediction
    prediction = model.predict(transformed_data)[0]
    probability = model.predict_proba(transformed_data)[0, 1]

    # Determine risk level
    if probability < 0.10:
        risk_level = "Low"
    elif probability < 0.30:
        risk_level = "Moderate"
    elif probability < 0.60:
        risk_level = "High"
    else:
        risk_level = "Very High"

    return {
        "prediction": int(prediction),
        "prediction_label": (
            "Default" if prediction == 1 else "Non-Default"
        ),
        "default_probability": round(float(probability), 4),
        "risk_level": risk_level,
        "loan_to_income_ratio": round(float(loan_to_income_ratio), 4),

        "applicant_summary": {
            "annual_income": data.person_income,
            "loan_amount": data.loan_amnt,
            "loan_grade": data.loan_grade,
            "previous_default": data.cb_person_default_on_file,
            "employment_length": data.person_emp_length
        }
    }


# Serve frontend
app.mount(
    "/",
    StaticFiles(
        directory=BASE_DIR / "frontend",
        html=True
    ),
    name="frontend"
)