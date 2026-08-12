// Calls Google's Gemini API (free tier — get a key at https://aistudio.google.com/apikey,
// no credit card required) to evaluate a candidate's spoken/typed explanation of a DSA
// solution, mimicking a technical interviewer. The API key lives only in the backend .env
// file and is never exposed to the browser.

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are a staff-level technical interviewer running a bar-raiser round at a top tech company. You are evaluating a candidate's SPOKEN explanation (given here as a transcript) of how they solved a DSA problem, together with their written approach notes and code. Be rigorous, specific, and fair — like a real interview debrief, not a cheerleader. Respond with ONLY raw JSON, no markdown fences, no preamble, matching exactly this schema:
{"overallScore": number 0-10, "rating": "Strong Hire" | "Hire" | "Lean Hire" | "No Hire", "sectionScores": [{"name":"Communication","score":number0to10},{"name":"Problem-Solving","score":number0to10},{"name":"Coding","score":number0to10},{"name":"Complexity Analysis","score":number0to10}], "shortcomings": [string, ...max 5], "suggestions": [string, ...max 5], "modelAnswer": string}`;

async function evaluateTranscript(req, res) {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message:
        'AI evaluation is not configured yet. Get a free key at https://aistudio.google.com/apikey and add it as GEMINI_API_KEY in backend/.env.',
    });
  }

  const { problem, transcript } = req.body;
  if (!transcript || !transcript.trim()) {
    return res.status(400).json({ message: 'transcript is required.' });
  }
  if (!problem) {
    return res.status(400).json({ message: 'problem context is required.' });
  }

  const activeVersion = (problem.codeVersions || [])[problem.activeVersionIndex || 0] || {};

  const userPrompt = `PROBLEM: ${problem.title || 'Untitled'}
DESCRIPTION: ${problem.description || '(none provided)'}
DIFFICULTY: ${problem.difficulty}
MY WRITTEN APPROACH NOTES: ${problem.approach || '(none provided)'}
MY CODE (${activeVersion.language || 'python'}):
${activeVersion.code || '(no code yet)'}
MY CLAIMED COMPLEXITY: time ${problem.timeComplexity || '—'}, space ${problem.spaceComplexity || '—'}

CANDIDATE'S SPOKEN TRANSCRIPT (this is what to evaluate primarily):
"""${transcript}"""

Evaluate as described and return only the JSON object.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(502).json({ message: 'The AI evaluator is temporarily unavailable. Please try again.' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let report;
    try {
      report = JSON.parse(clean);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', text);
      return res.status(502).json({ message: 'The AI evaluator returned an unexpected response. Please try again.' });
    }

    res.json({ report });
  } catch (err) {
    console.error('Evaluation request failed:', err);
    res.status(502).json({ message: 'Could not reach the AI evaluator. Please try again.' });
  }
}

module.exports = { evaluateTranscript };
