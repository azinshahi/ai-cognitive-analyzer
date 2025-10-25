// Temporary simple logic until we connect real AI
async function runAnalysis() {
    const input = document.getElementById("userInput").value;
    const result = document.getElementById("result");
    const feedbackBox = document.getElementById("feedbackBox");

    if (!input.trim()) {
        result.innerText = "Please enter a behavior first.";
        feedbackBox.style.backgroundColor = "transparent";
        return;
    }

    // Temporary placeholder until AI connection
    result.innerText = "Analyzing behavior...";
    feedbackBox.style.backgroundColor = "#333";

    setTimeout(() => {
        result.innerText = "This is a placeholder result — the AI connection comes next.";
        feedbackBox.style.backgroundColor = "#555";
    }, 1500);
}
