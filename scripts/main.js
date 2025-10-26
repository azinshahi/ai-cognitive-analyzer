document.getElementById('analyze-btn').addEventListener('click', async () => {
  const behavior = document.getElementById('behavior-input').value.trim();
  const resultDiv = document.getElementById('result');

  if (!behavior) {
    resultDiv.innerHTML = "⚠️ Please describe a behavior to analyze.";
    return;
  }

  resultDiv.innerHTML = "⏳ Analyzing behavior...";

  try {
    const response = await fetch("https://cognitive-analyzer-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ behavior })
    });

    const data = await response.json();
    resultDiv.innerHTML = `<strong>Risk Level:</strong> ${data.risk}<br><strong>Message:</strong> ${data.message}`;
  } catch (error) {
    resultDiv.innerHTML = "❌ Could not connect to backend. Please try again later.";
    console.error(error);
  }
});
