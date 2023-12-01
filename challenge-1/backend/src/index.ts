import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

async function GET(request: HttpRequest): Promise<HttpResponse> {
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: "GET call",
  };
}
async function POST(request: HttpRequest): Promise<HttpResponse> {
  return {
    status: 201,
    headers: { "content-type": "application/json" },
    body: "POST call ..",
  };
}
export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  switch (request.method) {
    case "GET":
      return await GET(request);
    case "POST":
      return await POST(request);
  }
  return {
    status: 405,
    headers: { "content-type": "application/json" },
    body: `Invalid ${request.method} method call`,
  };
};
