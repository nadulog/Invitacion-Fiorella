import http from "node:http";

const proxy = http.createServer((request, response) => {
  const upstream = http.request({
    hostname: "::1",
    port: 3001,
    path: request.url,
    method: request.method,
    headers: { ...request.headers, host: "localhost:3001" },
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  upstream.on("error", () => {
    response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    response.end("La vista previa se está iniciando. Volvé a intentar en unos segundos.");
  });
  request.pipe(upstream);
});

proxy.listen(5173, "0.0.0.0");
