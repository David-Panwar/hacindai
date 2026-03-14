const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// console.log("Gemini key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fixCode(repoDir, bugs) {

  try {

    const fixes = [];

    if (!bugs || bugs.length === 0) {
      return fixes;
    }

    const filePath = path.join(repoDir, "src/calculator.js");

    if (!fs.existsSync(filePath)) {
      console.log("File not found:", filePath);
      return fixes;
    }

    const code = fs.readFileSync(filePath, "utf8");

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

    const prompt = `
You are an AI DevOps agent that fixes code errors.

Detected Bug:
${JSON.stringify(bugs)}

Code:
${code}

Rules:
1. Fix the bug
2. Return ONLY the corrected code
3. Do NOT include explanation
4. Do NOT include markdown
`;

    const result = await model.generateContent(prompt);

    let fixedCode = result.response.text();

    // remove accidental markdown blocks
    fixedCode = fixedCode.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "");

    fs.writeFileSync(filePath, fixedCode);

    fixes.push({
      file: "src/calculator.js",
      bug_type: bugs[0].bug_type,
      status: "Fixed"
    });

    return fixes;

  } catch (error) {

    console.error("AI Fix Agent Error:", error);

    return [{
      status: "AI_FIX_FAILED",
      error: error.message
    }];

  }

}

module.exports = { fixCode };