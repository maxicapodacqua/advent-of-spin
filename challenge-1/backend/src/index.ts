import {
  HandleRequest,
  HttpRequest,
  HttpResponse,
  Kv,
  Router,
} from "@fermyon/spin-sdk";

type KvStoreType = ReturnType<(typeof Kv)["openDefault"]>;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const router = Router();

router.get("/data", (req) => {
  if (!req.query) {
    return {
      status: 400,
      headers: { "content-type": "application/json" },
      body: "Missing wishlist key :(",
    };
  }
  const key = Object.keys(req.query)[0];
  const store = Kv.openDefault();
  console.log("key", key);

  const wishlist = store.get(key);

  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      value: wishlist,
    }),
  };
});

router.post("/data", (req) => {
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: "POST call",
  };
});

router.all("*", () => ({
  status: 404,
  body: encoder.encode("Not found"),
}));

// async function GET(
//   request: HttpRequest,
//   store: KvStoreType
// ): Promise<HttpResponse> {
//   // store.get()
//   return {
//     status: 200,
//     headers: { "content-type": "application/json" },
//     body: "GET call",
//   };
// }
// async function POST(
//   request: HttpRequest,
//   store: KvStoreType
// ): Promise<HttpResponse> {
//   return {
//     status: 201,
//     headers: { "content-type": "application/json" },
//     body: "POST call ..",
//   };
// }
export const handleRequest: HandleRequest = async function (
  request: HttpRequest
): Promise<HttpResponse> {
  return await router.handleRequest(request);
  // const store = Kv.openDefault();
  // switch (request.method) {
  //   case "GET":
  //     return await GET(request, store);
  //   case "POST":
  //     return await POST(request, store);
  // }
  // return {
  //   status: 405,
  //   headers: { "content-type": "application/json" },
  //   body: `Invalid ${request.method} method call`,
  // };
};
