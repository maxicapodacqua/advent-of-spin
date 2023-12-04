import {
  HandleRequest,
  HttpRequest,
  HttpResponse,
  Kv,
} from "@fermyon/spin-sdk";

type KvStoreType = ReturnType<(typeof Kv)["openDefault"]>;

const decoder = new TextDecoder();

function getFirstQueryStringParameter(uri: string): string | null {
  const urlObj = new URL(uri);
  // @ts-ignore
  const queryParams = urlObj.searchParams.keys() as Array<string>;

  if (queryParams.length == 0) {
    return null;
  }

  return queryParams[0];
}

async function GET(
  request: HttpRequest,
  store: KvStoreType
): Promise<HttpResponse> {
  const key = getFirstQueryStringParameter(request.uri);

  if (!key) {
    return {
      status: 400,
      headers: { "content-type": "application/json" },
      body: "Missing wishlist key :(",
    };
  }

  const result = store.get(key);
  let body = "";
  if (result) {
    body = decoder.decode(result);
  }

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body,
  };
}
async function POST(
  request: HttpRequest,
  store: KvStoreType
): Promise<HttpResponse> {
  const key = getFirstQueryStringParameter(request.uri);

  if (!key) {
    return {
      status: 400,
      headers: { "content-type": "application/json" },
      body: "Missing wishlist key :(",
    };
  }

  const body: { value: string } = JSON.parse(request.text());
  store.set(key, request.text());
  return {
    status: 201,
    headers: { "content-type": "application/json" },
    body: request.text(),
  };
}
export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  const store = Kv.openDefault();
  switch (request.method) {
    case "GET":
      return await GET(request, store);
    case "POST":
      return await POST(request, store);
  }
  return {
    status: 405,
    headers: { "content-type": "application/json" },
    body: `Invalid ${request.method} method call`,
  };
};
