import { type ActionFunctionArgs } from "react-router";
import { getUploadUrl, getPublicUrl } from "../utils/supabase.server";
import { requireUserId } from "../utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    console.log("Upload URL Request for User:", userId);
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
        return Response.json({ error: "Missing identity metadata" }, { status: 400 });
    }

    try {
        const path = `${userId}/${Date.now()}-${fileName}`;
        const result = await getUploadUrl(path);

        if (!result || !result.uploadUrl) {
            throw new Error("Failed to generate secure upload channel");
        }

        const publicUrl = getPublicUrl(path);

        return Response.json({
            uploadUrl: result.uploadUrl,
            publicUrl
        });
    } catch (error: any) {
        console.error("Supabase Storage Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
