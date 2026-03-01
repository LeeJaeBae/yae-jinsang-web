import { NextResponse } from "next/server";

export const revalidate = 300; // 5분 캐시

export async function GET() {
  try {
    // GitHub 다운로드 수
    const ghRes = await fetch(
      "https://api.github.com/repos/LeeJaeBae/yae-jinsang/releases",
      { next: { revalidate: 300 } }
    );
    const releases = await ghRes.json();
    let downloads = 0;
    for (const r of releases) {
      for (const a of r.assets || []) {
        downloads += a.download_count || 0;
      }
    }

    // Supabase에서 등록 업소 수 + 등록된 진상 수
    const supabaseUrl = "https://jwxwjgcbarbfigucarod.supabase.co";
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eHdqZ2NiYXJiZmlndWNhcm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjUyNTgsImV4cCI6MjA4NzQ0MTI1OH0.YtAbcj3j2AMTgV_iwi9ZgII8x0py0JTShsh0qX-FBGs";

    const [shopsRes, tagsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/shops?select=id&limit=1000`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        next: { revalidate: 300 },
      }),
      fetch(`${supabaseUrl}/rest/v1/tags?select=id&limit=1000`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        next: { revalidate: 300 },
      }),
    ]);

    const shops = await shopsRes.json();
    const tags = await tagsRes.json();

    const realDownloads = downloads;
    const realShops = Array.isArray(shops) ? shops.length : 0;
    const realTags = Array.isArray(tags) ? tags.length : 0;

    return NextResponse.json({
      downloads: Math.max(realDownloads, 89),
      shops: Math.max(realShops, 89),
      tags: Math.max(realTags, 89),
    });
  } catch (e) {
    return NextResponse.json({ downloads: 0, shops: 0, tags: 0 });
  }
}
