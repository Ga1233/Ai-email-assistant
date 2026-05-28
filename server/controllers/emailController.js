const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory history store (resets on server restart)
let emailHistory = [];
let historyIdCounter = 1;

// GENERATE EMAIL REPLY
exports.generateEmailReply = async (req, res) => {
  try {
    const { email, tone } = req.body;

    if (!email || !tone) {
      return res.status(400).json({ message: "Email content and tone are required." });
    }

    const prompt = `You are an AI corporate email assistant.

Write a professional email reply.

Rules:
- Keep reply concise
- Use proper formatting
- Sound human-like
- End professionally

Tone: ${tone}

Original Email:
${email}

Write only the email reply, nothing else.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    // Save to in-memory history
    const record = {
      _id: String(historyIdCounter++),
      originalEmail: email,
      generatedReply: responseText,
      tone,
      createdAt: new Date().toISOString(),
    };
    emailHistory.unshift(record);

    res.status(200).json(record);

  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({
      message: "Server encountered an error generating the reply.",
      error: error.message,
    });
  }
};

// GET HISTORY
exports.getHistory = async (req, res) => {
  try {
    res.status(200).json(emailHistory);
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ message: "Server Error fetching history" });
  }
};

// DELETE HISTORY ITEM
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    emailHistory = emailHistory.filter((item) => item._id !== id);
    res.status(200).json({ message: "History deleted" });
  } catch (error) {
    console.error("Delete History Error:", error);
    res.status(500).json({ message: "Server Error deleting history" });
  }
};

// CLEAR ALL HISTORY
exports.clearHistory = async (req, res) => {
  try {
    emailHistory = [];
    res.status(200).json({ message: "All history cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server Error clearing history" });
  }
};
