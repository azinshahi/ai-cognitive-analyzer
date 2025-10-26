// Replace with your actual Render backend URL
const backendURL = 'https://cognitive-analyzer-backend.onrender.com/analyze';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('activity-form');
    const input = document.getElementById('activity-input');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const activity = input.value.trim();
        if (!activity) return;

        resultDiv.textContent = 'Analyzing...';

        try {
            const response = await fetch(backendURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity })
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            resultDiv.textContent = `Risk Level: ${data.riskLevel}\nExplanation: ${data.explanation}`;
        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = 'Error analyzing activity. Try again.';
        }
    });
});
