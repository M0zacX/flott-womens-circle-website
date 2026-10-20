import type { APIRoute } from "astro";
import { COOKIE_NAME } from "../../../lib/gt/auth";

export const prerender = false;

const handler: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(COOKIE_NAME, { path: "/" });
  return redirect("/grand-table/admin/login");
};

export const GET = handler;
export const POST = handler;
