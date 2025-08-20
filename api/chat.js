// /api/chat.js — Vercel Serverless Function (OpenAI Responses API)
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
      "Responde en español, breve (≤120 palabras) y con 1 emoji máximo.",
      "Evita política actual y contenido sexual explícito. Sé amable y creativa.",
    ].join(" ");

    // --- Construcción de 'input' (Responses API) ---
    // Regla: system/user => input_text; assistant (o 'maria') => output_text
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
      ...messages.map(toItem),
    ];

    const model = process.env.OPENAI_MODEL || "gpt-5-mini";

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        temperature: 1,
        max_output_tokens: 500,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || resp.statusText || "OpenAI error";
      return res.status(resp.status).json({ error: msg });
    }

    // --- Extracción robusta del texto de salida ---
    let reply = "";
    if (typeof data.output_text === "string" && data.output_text.trim()) {
      reply = data.output_text;
    } else if (Array.isArray(data.output)) {
      // Busca el primer mensaje del assistant y toma su 'output_text'
      const msg = data.output.find(
        (o) => o.type === "message" && o.role === "assistant"
      );
      if (msg?.content?.length) {
        const textPart = msg.content.find((c) => c.type === "output_text");
        reply = textPart?.text || "";
      }
    }

    // Si quedó incompleto por tokens, avisa (opcional)
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
