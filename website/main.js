/**************** EMAIL INIT ****************/
emailjs.init("mEi5pt3D10V3vlnWt");

/**************** ELEMENTS ****************/
const form = document.getElementById("topsisForm");
const submitBtn = document.getElementById("submitBtn");
const loading = document.getElementById("loading");
const success = document.getElementById("success");
const resultsSection = document.getElementById("resultsSection");
const resultsContainer = document.getElementById("resultsContainer");
const downloadResultBtn = document.getElementById("downloadResultBtn");
const sendEmailCheckbox = document.getElementById("sendEmail");
const emailSection = document.getElementById("emailSection");

let csvHeaders = null;
let csvData = null;
let lastResultCSV = null;

/**************** EMAIL TOGGLE ****************/
sendEmailCheckbox.addEventListener("change", () => {
    emailSection.classList.toggle("active", sendEmailCheckbox.checked);
});

/**************** FILE UPLOAD (CSV + EXCEL) ****************/
document.getElementById("csvFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const fileError = document.getElementById("fileError");
    fileError.style.display = "none";

    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            let parsed;

            if (ext === "csv") {
                parsed = parseCSV(event.target.result);
            } 
            else if (ext === "xlsx" || ext === "xls") {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                parsed = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            } 
            else {
                throw new Error("Only CSV or Excel files are allowed");
            }

            csvHeaders = parsed[0];
            csvData = parsed.slice(1);
            validateCSVData(parsed);

        } catch (err) {
            fileError.textContent = err.message;
            fileError.style.display = "block";
            csvData = null;
        }
    };

    ext === "csv"
        ? reader.readAsText(file)
        : reader.readAsArrayBuffer(file);
});

/**************** FORM SUBMIT ****************/
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!csvData) {
        alert("Please upload a valid CSV or Excel file");
        return;
    }

    const weightsInput = document.getElementById("weights").value.trim();
    const impactsInput = document.getElementById("impacts").value.trim();
    const emailInput = document.getElementById("email").value.trim();

    const weights = weightsInput.split(",").map(Number);
    const impacts = impactsInput.split(",").map(i => i.trim());

    if (weights.some(isNaN)) {
        alert("Weights must be numeric");
        return;
    }

    submitBtn.disabled = true;
    loading.style.display = "block";
    success.style.display = "none";

    try {
        const results = calculateTOPSIS(csvData, weights, impacts);
        lastResultCSV = convertToCSV(csvHeaders, results);

        displayResults(csvHeaders, results);

        if (sendEmailCheckbox.checked) {
            if (!emailInput.includes("@")) {
                alert("Enter a valid email address");
            } else {
                await emailjs.send(
                    "Topsis",                 // ✅ SERVICE ID
                    "template_q1v0vsp",       // ✅ TEMPLATE ID
                    {
                        to_email: emailInput,
                        to_name: emailInput.split("@")[0],
                        weights: weightsInput,
                        impacts: impactsInput,
                        result_csv: lastResultCSV
                    }
                );
            }
        }

        resultsSection.style.display = "block";
        success.style.display = "block";

    } catch (err) {
        alert("Error: " + err.message);
    }

    loading.style.display = "none";
    submitBtn.disabled = false;
});

/**************** DISPLAY RESULTS ****************/
function displayResults(headers, results) {
    let html = "<table class='results-table'><tr>";

    headers.forEach(h => {
        html += `<th>${h}</th>`;
    });

    html += "<th>Topsis Score</th><th>Rank</th></tr>";

    results.forEach(row => {
        html += "<tr>";
        headers.forEach((_, i) => {
            html += `<td>${row["col" + i]}</td>`;
        });
        html += `<td>${row.topsisScore}</td>`;
        html += `<td><b>${row.rank}</b></td>`;
        html += "</tr>";
    });

    html += "</table>";
    resultsContainer.innerHTML = html;
}

/**************** DOWNLOAD CSV ****************/
downloadResultBtn.addEventListener("click", () => {
    if (!lastResultCSV) return;

    const blob = new Blob([lastResultCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "topsis_results.csv";
    a.click();

    URL.revokeObjectURL(url);
});
