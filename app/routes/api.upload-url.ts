import { type ActionFunctionArgs } from "react-router";
import { getUploadUrl } from "../utils/r2.server";
import { requireUserId } from "../utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
        return { error: "Missing identity metadata" };
    }

    try {
        const key = `visions/${userId}/${Date.now()}-${fileName}`;
        const uploadUrl = await getUploadUrl(key, contentType);

        return {
            uploadUrl,
            publicUrl: `https://visions.efans.workers.dev/${key}`
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
