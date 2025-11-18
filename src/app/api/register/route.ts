import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("officialLetter") as File;

        if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Initialize Supabase
        const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // service key — server only!
        );

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filePath = `OfficialRequestLetterResponse/${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
        .from("Official request letter")
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
        });

        if (error) {
        console.error(error);
        return NextResponse.json({ error: "Upload error" }, { status: 500 });
        }

        // OPTIONAL: Get public URL
        const { data: urlData } = supabase.storage
        .from("Official request letter")
        .getPublicUrl(filePath);

        return NextResponse.json({
        message: "Success",
        uploadedPath: filePath,
        publicUrl: urlData.publicUrl,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
