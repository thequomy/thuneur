interface Env {
  DISCORD_WEBHOOK: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const webhookUrl = env.DISCORD_WEBHOOK;
  let body: string;
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const data = await request.json();
      body = JSON.stringify(data);
    } else {
      body = await request.text();
    }
  } catch (e) {
    return new Response("Failed to read request body", { status: 400, headers: corsHeaders });
  }

  if (!body || body.trim().length === 0) {
    return new Response("Empty body", { status: 400, headers: corsHeaders });
  }

  try {
    const discordResp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await discordResp.text();
    if (!discordResp.ok) {
      return new Response(`${discordResp.status}: ${text}`, {
        status: 502,
        headers: corsHeaders,
      });
    }
    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (e: any) {
    return new Response(`${e.message || e}`, { status: 500, headers: corsHeaders });
  }
};
