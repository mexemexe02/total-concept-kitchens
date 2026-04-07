import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * On-demand gallery refresh for Coolify (or any cron) after Ethan posts to Instagram.
 * Use POST (preferred) or GET with ?secret= — some schedulers only support GET.
 */
function revalidateIfAuthorized(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/gallery");
  return NextResponse.json({ ok: true, revalidated: "/gallery" });
}

export async function POST(req: NextRequest) {
  return revalidateIfAuthorized(req);
}

export async function GET(req: NextRequest) {
  return revalidateIfAuthorized(req);
}
