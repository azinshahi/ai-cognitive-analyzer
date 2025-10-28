document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("behaviorInput");
  const analyzeButton = document.getElementById("analyzeButton");
  const resultArea = document.getElementById("result");

  analyzeButton.addEventListener("click", function () {
    const userInput = inputBox.value.trim();

    if (userInput === "") {
      resultArea.innerText = "Please enter a behavior to analyze.";
      return;
    }

    resultArea.innerText = "Analyzing...";

    fetch("https://cognitive-analyzer-backend.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ behavior: userInput })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        resultArea.innerText = `${data.risk.toUpperCase()}: ${data.message}`;
      })
      .catch(error => {
        console.error("Error:", error);
        resultArea.innerText = "Something went wrong. Please try again.";
      });
  });
});
