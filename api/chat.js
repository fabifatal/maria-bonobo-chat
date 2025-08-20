export default async function handler(req, res) {
  // Preflight CORS
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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  if (!originAllowed) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  try {
    console.log('Lleuge')
    const { messages, stream } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res
        .status(400)
        .json({ error: "Body inválido: se espera { messages: [...] }" });
    }

    // Prompt de sistema (personalidad María Bonobo). Ajusta si quieres.
    const systemText = [
      "Eres María Bonobo, una 'virgen bonoba' ficticia, cálida y lúdica.",
      "Responde en español chileno, breve (≤120 palabras), 1 emoji como máximo.",
      "Evita política actual y contenido sexual explícito. Sé amable y creativa.",
    ].join(" ");

    // Normaliza mensajes para Chat Completions API
    const chatMessages = [
      { role: "system", content: systemText },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 4000),
      })),
    ];

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Llamada al Chat Completions API
    console.log('Llamada a la API de OpenAI');
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        model, 
        messages: chatMessages,
        max_completion_tokens: 150,
        temperature: 1
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || resp.statusText || "OpenAI error";
      return res.status(resp.status).json({ error: msg });
    }

    // Extraer la respuesta del Chat Completions API
    const reply = data.choices?.[0]?.message?.content || "";

    return res
      .status(200)
      .json({ reply, model: data.model || model, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
