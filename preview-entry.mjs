import worker from "./dist/_worker.js/index.js";

export default {
  ...worker,
  async fetch(request, env, ctx) {
    const res = await worker.fetch(request, env, ctx);
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    return out;
  },
};
