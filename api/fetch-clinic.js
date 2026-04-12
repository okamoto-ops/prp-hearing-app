import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, clinicName } = req.body;
  if (!url && !clinicName) {
    return res.status(400).json({ error: "url または clinicName が必要です" });
  }

  try {
    const prompt = url
      ? `次のURLのWebページを取得し、医療機関の情報を抽出してください。URL: ${url}

以下のJSON形式のみで回答してください。情報が見つからない場合は空文字にしてください。前置きや説明は一切不要です。

{
  "clinicName": "医療機関の正式名称（医療法人名＋クリニック名）",
  "clinicAddress": "所在地の住所（都道府県から）",
  "clinicZip": "郵便番号",
  "clinicPhone": "電話番号",
  "directorName": "院長・管理者名",
  "clinicUrl": "公式サイトURL",
  "department": "診療科",
  "notes": "その他参考情報"
}`
      : `「${clinicName}」という医療機関をWeb検索で調査し、以下のJSON形式のみで回答してください。情報が見つからない場合は空文字にしてください。前置きや説明は一切不要です。

{
  "clinicName": "医療機関の正式名称（医療法人名＋クリニック名）",
  "clinicAddress": "所在地の住所（都道府県から）",
  "clinicZip": "郵便番号",
  "clinicPhone": "電話番号",
  "directorName": "院長・管理者名",
  "clinicUrl": "公式サイトURL",
  "department": "診療科",
  "notes": "その他参考情報"
}`;

    const tools = url
      ? [{ type: "web_search_20250305", name: "web_search" }]
      : [{ type: "web_search_20250305", name: "web_search" }];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools,
      system:
        "あなたは日本の医療機関情報を調査するアシスタントです。指定された形式のJSONのみを返してください。説明文・前置き・マークダウンは一切不要です。",
      messages: [{ role: "user", content: prompt }],
    });

    // テキストブロックを結合
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    // JSON抽出
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(200).json({
        success: false,
        message: "情報を取得できませんでした",
        raw: text.slice(0, 200),
      });
    }

    const info = JSON.parse(match[0]);
    return res.status(200).json({ success: true, data: info });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
