// Wait until the page is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the input box, button, and result area
  const inputBox = document.getElementById("behaviorInput");
  const analyzeButton = document.getElementById("analyzeButton");
  const resultArea = document.getElementById("result");

  // When the button is clicked, run this function
  analyzeButton.addEventListener("click", function () {
    const userInput = inputBox.value.trim();

    // If the input is empty, show a message and stop
    if (userInput === "") {
      resultArea.innerText = "Please enter a behavior to analyze.";
      return;
    }

    // Show a loading message while waiting for the response
    resultArea.innerText = "Analyzing...";

    // Send the behavior to the backend
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
        // Display the AI's risk level and explanation
        resultArea.innerText = `${data.risk.toUpperCase()}: ${data.message}`;
      })
      .catch(error => {
        console.error("Error:", error);
        resultArea.innerText = "Something went wrong. Please try again.";
      });
  });
});
