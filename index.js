import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === FRAME 1: WELCOME SCREEN ===
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`
    <html>
      <head>
        <meta property="og:title" content="Wolfplet" />
        <meta property="og:description" content="AI wolf that talks with you onchain." />
        <meta property="og:image" content="https://yourdomain.com/wolfplet-preview.png" />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://yourdomain.com/wolfplet-preview.png" />
        <meta property="fc:frame:input:text" content="Say something to Wolfplet..." />
        <meta property="fc:frame:button:1" content="Send" />
        <meta property="fc:frame:post_url" content="https://yourdomain.com/api/chat" />
      </head>
      <body></body>
    </html>
  `);
});

// === FRAME 2: CHAT REPLY ===
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body?.untrustedData?.inputText || "Hello Wolfplet!";
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Wolfplet, a wise yet playful AI wolf that lives onchain. You reply concisely, with personality, like a mysterious digital wolf who has seen many blockchains.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.set("Content-Type", "text/html");
    res.send(`
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent("Wolfplet says: " + reply)}" />
          <meta property="fc:frame:input:text" content="Reply to Wolfplet..." />
          <meta property="fc:frame:button:1" content="Send" />
          <meta property="fc:frame:post_url" content="https://yourdomain.com/api/chat" />
        </head>
        <body></body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send("Error generating response");
  }
});

app.listen(3000, () => console.log("🐺 Wolfplet Chat Frame running on port 3000"));
