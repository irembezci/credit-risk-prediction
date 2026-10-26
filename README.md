# Credit Risk Prediction

A machine learning-based credit risk assessment system that predicts the probability of loan default using applicant financial and credit information.

The project combines a trained XGBoost classification model with a preprocessing pipeline, FastAPI backend and web-based frontend to provide an end-to-end credit risk assessment workflow.

## Project Overview

The goal of this project is to build a complete machine learning application rather than only training a model.

The system covers the full workflow:

```text
Raw Data
   ↓
Exploratory Data Analysis
   ↓
Data Preprocessing
   ↓
Feature Engineering
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Model Explainability
   ↓
Model Serialization
   ↓
FastAPI
   ↓
Web Interface
```

The application is designed as a **decision-support tool for credit analysts**. It provides an estimated default probability and risk classification based on the information provided.

It does not make autonomous lending decisions.

## Features

• Exploratory data analysis and visualization

• Numerical and categorical feature preprocessing

• Missing value handling

• Feature encoding

• Feature scaling

• Train/test split with stratification

• Comparison of multiple classification models

• XGBoost-based credit risk prediction

• Model evaluation using Accuracy, Precision, Recall, F1-score and ROC-AUC

• SHAP-based model explainability

• Model and preprocessing pipeline serialization

• REST API built with FastAPI

• Web-based credit risk assessment interface

• Automatic loan-to-income ratio calculation

• Risk classification based on estimated default probability

## Dataset

The project uses the **Credit Risk Dataset** from Kaggle.

The dataset contains applicant and loan-related information such as:

• Age

• Annual income

• Home ownership

• Employment length

• Loan purpose

• Loan grade

• Loan amount

• Interest rate

• Previous default history

• Credit history length

The target variable is:

```text
loan_status

0 → Non-Default
1 → Default
```

## Machine Learning

Three classification models were evaluated:

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | 80.3% | 72.1% | 15.8% | 26.0% | 76.1% |
| Random Forest | 93.5% | 97.6% | 71.8% | 82.8% | 93.0% |
| XGBoost | **93.7%** | **98.3%** | **72.2%** | **83.6%** | **94.9%** |

XGBoost achieved the best overall performance and was selected as the final model.

### Final XGBoost Performance

```text
Accuracy:  93.66%
Precision: 98.28%
Recall:    72.22%
F1-score:  83.59%
ROC-AUC:   94.93%
```

Because this is a credit risk problem, recall is particularly important. Missing applicants who may default can be more costly than incorrectly flagging some low-risk applicants.

## Explainability

SHAP was used to investigate which features had the greatest influence on the XGBoost model.

Important features included:

• Loan grade

• Loan-to-income ratio

• Annual income

• Home ownership

• Loan purpose

• Interest rate

This provides additional insight into how the model arrives at its predictions.

## Application Architecture

```text
                ┌─────────────────────┐
                │      Web Frontend    │
                │ HTML / CSS / JS      │
                └──────────┬──────────┘
                           │
                           │ POST /predict
                           ▼
                ┌─────────────────────┐
                │      FastAPI         │
                │     REST API         │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    Preprocessor      │
                │ ColumnTransformer    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      XGBoost         │
                │  Classification      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Risk Assessment    │
                │ Probability / Risk   │
                └─────────────────────┘
```

## Project Structure

```text
credit-risk-prediction/
│
├── api/
│   └── main.py
│
├── data/
│   └── credit_risk_dataset.csv
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── models/
│   ├── xgb_model.pkl
│   └── preprocessor.pkl
│
├── notebooks/
│   └── credit_risk_analysis.ipynb
│
├── requirements.txt
├── README.md
└── .gitignore
```

## Installation

Clone the repository:

```bash
git clone https://github.com/USERNAME/credit-risk-prediction.git
cd credit-risk-prediction
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

Start the FastAPI server:

```bash
uvicorn api.main:app --reload
```

Open the application:

```text
http://127.0.0.1:8000/
```

The API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
    "status": "ok"
}
```

### Credit Risk Prediction

```http
POST /predict
```

The endpoint accepts applicant and loan information and returns:

• Predicted class

• Estimated default probability

• Risk level

• Loan-to-income ratio

• Applicant summary

Example response:

```json
{
    "prediction": 0,
    "prediction_label": "Non-Default",
    "default_probability": 0.0374,
    "risk_level": "Low",
    "loan_to_income_ratio": 0.2222
}
```

## Risk Classification

For this project, the estimated default probability is mapped to illustrative risk categories:

| Default Probability | Risk Level |
|---:|---|
| < 10% | Low |
| 10% – < 30% | Moderate |
| 30% – < 60% | High |
| ≥ 60% | Very High |

These thresholds are used for demonstration purposes and should not be interpreted as institutional lending policy.

## Important Considerations

This project is intended for educational and portfolio purposes.

The model's prediction should not be treated as an autonomous credit decision.

Real-world credit risk systems require additional considerations including:

• Regulatory requirements

• Fairness and bias evaluation

• Data quality monitoring

• Model validation

• Threshold calibration

• Model drift monitoring

• Human oversight

• Institution-specific credit policies

## Technologies

```text
Python
Pandas
NumPy
Scikit-learn
XGBoost
SHAP
FastAPI
Pydantic
HTML
CSS
JavaScript
```

This project was developed as a practical machine learning application covering the workflow from data analysis and model development to API integration and user-facing deployment.