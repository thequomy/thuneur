export async function onRequest() {
  const fileUrl = new URL("../../aio.lua", import.meta.url);
  const luaFile = await (await fetch(fileUrl)).text();
  return new Response(luaFile, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
