const form = document.getElementById("credit-form");
const result = document.getElementById("result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
        person_age: Number(
            document.getElementById("person_age").value
        ),

        person_income: Number(
            document.getElementById("person_income").value
        ),

        person_home_ownership:
            document.getElementById("person_home_ownership").value,

        person_emp_length: Number(
            document.getElementById("person_emp_length").value
        ),

        loan_intent:
            document.getElementById("loan_intent").value,

        loan_grade:
            document.getElementById("loan_grade").value,

        loan_amnt: Number(
            document.getElementById("loan_amnt").value
        ),

        loan_int_rate: Number(
            document.getElementById("loan_int_rate").value
        ),

        cb_person_default_on_file:
            document.getElementById("cb_person_default_on_file").value,

        cb_person_cred_hist_length: Number(
            document.getElementById("cb_person_cred_hist_length").value
        )
    };

    result.style.display = "block";
    result.innerHTML = "<p>Analyzing credit risk...</p>";

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const prediction = await response.json();

        if (!response.ok) {
            throw new Error(
                prediction.detail || "Prediction failed."
            );
        }

        const probability =
            (prediction.default_probability * 100).toFixed(2);

        const loanToIncome =
            (prediction.loan_to_income_ratio * 100).toFixed(2);

        const applicant = prediction.applicant_summary;

        const previousDefault =
            applicant.previous_default === "Y"
                ? "Yes"
                : "No";

        result.innerHTML = `
            <h2>Credit Risk Assessment</h2>

            <div class="risk-summary">
                <div>
                    <span class="summary-label">Risk Assessment</span>
                    <div class="result-value">
                        ${prediction.risk_level} Risk
                    </div>
                </div>

                <div>
                    <span class="summary-label">
                        Estimated Default Probability
                    </span>
                    <div class="probability">
                        ${probability}%
                    </div>
                </div>
            </div>

            <h2>Applicant Profile</h2>

            <div class="applicant-grid">

                <div class="profile-item">
                    <span>Annual Income</span>
                    <strong>
                        $${Number(applicant.annual_income).toLocaleString()}
                    </strong>
                </div>

                <div class="profile-item">
                    <span>Loan Amount</span>
                    <strong>
                        $${Number(applicant.loan_amount).toLocaleString()}
                    </strong>
                </div>

                <div class="profile-item">
                    <span>Loan / Income Ratio</span>
                    <strong>${loanToIncome}%</strong>
                </div>

                <div class="profile-item">
                    <span>Credit Grade</span>
                    <strong>${applicant.loan_grade}</strong>
                </div>

                <div class="profile-item">
                    <span>Previous Default</span>
                    <strong>${previousDefault}</strong>
                </div>

                <div class="profile-item">
                    <span>Employment Length</span>
                    <strong>${applicant.employment_length} years</strong>
                </div>

            </div>

            <h2>Assessment Summary</h2>

            <p class="summary-text">
                The model estimates a
                <strong>${probability}%</strong>
                probability of default and currently classifies
                this applicant as
                <strong>${prediction.risk_level.toLowerCase()} risk</strong>.
            </p>

            <p class="decision-note">
                This assessment is intended to support credit analysis
                and should be considered alongside institutional
                credit policies and additional applicant information.
            </p>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="error">
                Error: ${error.message}
            </p>
        `;
    }
});