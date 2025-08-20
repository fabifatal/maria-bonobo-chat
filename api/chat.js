// /api/chat.js — Vercel Serverless Function (OpenAI Responses API)
// Requiere Node 20+ (ESM) y que exista data/maria-bonobo.json en el repo.
// Importación compatible con Node.js estándar
let lore = null;
try {
  lore = require("../data/maria-bonobo.json");
} catch (error) {
  console.warn("No se pudo cargar lore de maria-bonobo.json:", error.message);
  lore = { songs: [], facts: [], band: {} };
}

// --- util: seleccionar canciones relevantes y armar conocimiento conciso ---
function pickLoreText(loreData, userText = "") {
  if (!loreData) return null;
  const q = String(userText || "").toLowerCase();

  // score simple por coincidencia en título / themes / mood
  const scored = (loreData.songs || [])
    .map((s) => {
      const title = (s.title || "").toLowerCase();
      const themes = (s.themes || []).map((t) => String(t).toLowerCase());
      const mood = (s.mood || []).map((m) => String(m).toLowerCase());
      let score = 0;
      if (q && title && q.includes(title)) score += 3;
      if (q && themes.some((t) => q.includes(t))) score += 2;
      if (q && mood.some((m) => q.includes(m))) score += 1;
      return { score, s };
    })
    .sort((a, b) => b.score - a.score);

  const top =
    scored[0]?.score > 0
      ? scored
          .filter((x) => x.score > 0)
          .slice(0, 2)
          .map((x) => x.s)
      : (loreData.songs || []).slice(0, 2);

  const lines = [];
  if (loreData.band?.bio) lines.push(`BIO: ${loreData.band.bio}`);
  if (top.length) {
    lines.push("CANCIONES POSIBLES:");
    top.forEach((t) => {
      const themes = Array.isArray(t.themes) ? t.themes.join(", ") : "";
      const mood = Array.isArray(t.mood) ? t.mood.join(", ") : "";
      const frag = t.snippet_10w ? `"${t.snippet_10w}"` : "";
      lines.push(
        `- ${
          t.title
        } — temas: ${themes} — mood: ${mood} — frag(≤10w): ${frag} — link: ${
          t.url || "s/URL"
        }`
      );
    });
  }
  if (Array.isArray(loreData.facts) && loreData.facts.length) {
    lines.push("DATOS:", ...loreData.facts.slice(0, 2));
  }
  return lines.join("\n");
}

export default async function handler(req, res) {
  // --- CORS ---
  const allowlist = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  const originAllowed =
    !allowlist.length || (origin && allowlist.includes(origin));
  if (originAllowed && origin)
    res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });
  if (!originAllowed)
    return res.status(403).json({ error: "Origin not allowed" });

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Falta la API key de OpenAI" });
    }

    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Body inválido: se espera { messages: [...] }" });
    }

    // Persona del sistema
    const systemText = [
      "Eres María Bonobo, una 'virgen bonoba' ficticia, cálida y lúdica.",
      "Responde en español, ≤120 palabras y 1 emoji máximo.",
      "Si el usuario pide música o ánimo, recomienda 1 canción de la banda y explica por qué encaja (1 frase).",
      "Si piden letras: solo fragmentos ≤10 palabras o parafrasea.",
      "Usa el conocimiento adjunto de la banda SOLO si es relevante; si no, responde sin inventar.",
    ].join(" ");

    // Texto del último user para guiar selección
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.role !== "assistant");
    const knowledgeText = pickLoreText(lore, lastUser?.content || "");

    // --- Construcción de 'input' (Responses API)
    const normRole = (r) =>
      r === "assistant" || r === "maria" ? "assistant" : "user";
    const toItem = (m) => {
      const role = normRole(m.role);
      const text = String(m.content || "").slice(0, 4000);
      const type = role === "assistant" ? "output_text" : "input_text";
      return { role, content: [{ type, text }] };
    };

    const input = [
      { role: "system", content: [{ type: "input_text", text: systemText }] },
      ...(knowledgeText
        ? [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: `CONOCIMIENTO DE LA BANDA:\n${knowledgeText}`,
                },
              ],
            },
          ]
        : []),
      ...messages.map(toItem),
    ];

    const model = process.env.OPENAI_MODEL || "gpt-5-mini";
    const body = {
      model,
      input,
      temperature: 1,
      reasoning: { effort: "low" }, // reduce tokens de razonamiento
      max_output_tokens: 500,
    };

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || resp.statusText || "OpenAI error";
      return res.status(resp.status).json({ error: msg });
    }

    // --- Extraer texto de salida ---
    let reply = "";
    if (typeof data.output_text === "string" && data.output_text.trim()) {
      reply = data.output_text;
    } else if (Array.isArray(data.output)) {
      const msg = data.output.find(
        (o) => o.type === "message" && o.role === "assistant"
      );
      const textPart = msg?.content?.find?.((c) => c.type === "output_text");
      reply = textPart?.text || "";
    }

    const incomplete =
      data.status === "incomplete" &&
      data.incomplete_details?.reason === "max_output_tokens";

    return res.status(200).json({
      reply,
      model: data.model || model,
      id: data.id,
      incomplete,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
