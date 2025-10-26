// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analyzer-form');
    const input = document.getElementById('userInput');
    const result = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userInput = input.value.trim();
        if (!userInput) {
            result.textContent = "⚠️ Please enter a behavior description.";
            return;
        }

        result.textContent = "⏳ Analyzing behavior...";

        try {
            const response = await fetch('https://cognitive-analyzer-backend.onrender.com/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ activity: userInput })
            });

            const data = await response.json();

            if (data.riskLevel && data.explanation) {
                result.innerHTML = `
                    <strong>Risk Level:</strong> ${data.riskLevel}<br>
                    <em>${data.explanation}</em>
                `;
            } else if (data.message) {
                result.textContent = data.message;
            } else {
                result.textContent = "⚠️ Unexpected response from server.";
            }
        } catch (error) {
            console.error(error);
            result.textContent = "❌ Error connecting to the AI service.";
        }
    });
});
