import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", async (req, res) => {
  const behavior = req.body.behavior;

  if (!behavior || behavior.trim() === "") {
    return res.json({
      risk: "none",
      message: "Please enter a behavior description."
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Classify user behavior as high, medium, or low risk and explain why."
        },
        {
          role: "user",
          content: behavior
        }
      ],
      model: "gpt-3.5-turbo"
    });

    const response = completion.choices[0].message.content;
    const [riskRaw, ...messageParts] = response.split(":");
    const risk = riskRaw.trim().toLowerCase();
    const message = messageParts.join(":").trim();

    res.json({ risk, message });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ risk: "error", message: "Failed to analyze behavior." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
