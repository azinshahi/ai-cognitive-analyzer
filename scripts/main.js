document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("riskForm");
  const userInput = document.getElementById("userInput");
  const resultBox = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = userInput.value.trim();
    if (!input) {
      resultBox.textContent = "⚠️ Please enter a behavior description.";
      resultBox.style.color = "orange";
      return;
    }

    resultBox.textContent = "Analyzing behavior...";
    resultBox.style.color = "gray";

    try {
      const response = await fetch("https://cognitive-analyzer-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await response.json();

      if (data.risk) {
        let color;
        if (data.risk.toLowerCase() === "high") color = "red";
        else if (data.risk.toLowerCase() === "medium") color = "orange";
        else color = "green";

        resultBox.innerHTML = `
          <strong>Risk Level:</strong> <span style="color:${color};text-transform:capitalize">${data.risk}</span><br>
          <strong>Explanation:</strong> ${data.message}
        `;
      } else {
        resultBox.textContent = "⚠️ Unexpected response from AI.";
        resultBox.style.color = "gray";
      }
    } catch (err) {
      console.error(err);
      resultBox.textContent = "❌ Error connecting to the AI service.";
      resultBox.style.color = "red";
    }
  });
});
