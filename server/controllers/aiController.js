import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";

// Helper function: extract text from PDF
async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

  let text = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

// Controller: summarize PDF
export const summarizePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found");
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    // ✅ Initialize OpenAI client *inside* the handler
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const text = (await extractPdfText(req.file.path)).slice(0, 8000);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Summarize the following PDF content into concise bullet points:\n\n${text}`,
        },
      ],
    });

    const summary = completion.choices?.[0]?.message?.content || "No summary generated.";
    fs.unlinkSync(req.file.path);

    res.json({ summary });
  } catch (err) {
    console.error("❌ PDF Summarization Error:", err);
    res.status(500).json({ error: "Failed to summarize PDF" });
  }
};
