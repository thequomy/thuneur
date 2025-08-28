
interface Env {
  DISCORD_WEBHOOK: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const webhookUrl = env.DISCORD_WEBHOOK;
  if (!webhookUrl) {
    return new Response("Missing", {
      status: 500,
      headers: corsHeaders,
    });
  }

  let body: string;
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const json = await request.json();
      body = JSON.stringify(json);
    } else {
      body = await request.text();
    }
  } catch (e) {
    return new Response("Couldn't parse request body", {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (!body || body.trim() === "") {
    return new Response("Empty body", {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await resp.text();
    if (!resp.ok) {
      return new Response(`${resp.status}: ${text}`, {
        status: 502,
        headers: corsHeaders,
      });
    }
    return new Response("Sent", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e: any) {
    return new Response(`Fetch error: ${e.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
};
