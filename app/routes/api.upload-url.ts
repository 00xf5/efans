import { type ActionFunctionArgs } from "react-router";
import { getUploadUrl, getPublicUrl } from "../utils/supabase.server";
import { requireUserId } from "../utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
        return { error: "Missing identity metadata" };
    }

    try {
        const path = `${userId}/${Date.now()}-${fileName}`;
        const { uploadUrl } = await getUploadUrl(path);
        const publicUrl = getPublicUrl(path);

        return {
            uploadUrl,
            publicUrl
        };
    } catch (error: any) {
        console.error("Supabase Storage Error:", error);
        return { error: error.message };
    }
}
