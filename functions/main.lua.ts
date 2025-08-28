export async function onRequest() {
  try {
    const url = "https://0x0.st/KohP.lua";
    const resp = await fetch(url);
    if (!resp.ok) {
      return new Response("Failede", { status: 502 });
    }
    const text = await resp.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
