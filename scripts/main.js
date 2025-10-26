document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const behaviorInput = document.getElementById("behaviorInput");
  const resultDiv = document.getElementById("result");

  analyzeBtn.addEventListener("click", async () => {
    const behavior = behaviorInput.value.trim();

    if (!behavior) {
      resultDiv.textContent = "⚠️ Please describe a behavior first.";
      return;
    }

    resultDiv.textContent = "⏳ Analyzing behavior...";

    try {
      const response = await fetch("https://cognitive-analyzer-backend.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ behavior })
      });

      const data = await response.json();

      if (data && data.message) {
        resultDiv.innerHTML = `
          <strong>Risk Level:</strong> ${data.risk || "unknown"}<br>
          <strong>Message:</strong> ${data.message}
        `;
      } else {
        resultDiv.textContent = "❌ Unexpected response from the AI server.";
      }

    } catch (error) {
      console.error("Error connecting to backend:", error);
      resultDiv.textContent = "🚫 Could not connect to backend. Please try again later.";
    }
  });
});
