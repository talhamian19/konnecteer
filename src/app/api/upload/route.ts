import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "events";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const fileName = `${session.user.id}/${Date.now()}.${ext}`;

    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: file.type, upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
