import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://bccyzexrlqorhvwoenjm.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * GENERATE UPLOAD URL
 * Similar to R2 logic, but for Supabase Storage.
 * Note: Supabase uses createSignedUploadUrl for this flow.
 */
export async function getUploadUrl(path: string) {
    const { data, error } = await supabase.storage
        .from("visions")
        .createSignedUploadUrl(path);

    if (error) throw error;
    return {
        uploadUrl: data.signedUrl,
        token: data.token
    };
}

/**
 * UPLOAD DIRECTLY (SERVER-SIDE)
 */
export async function uploadToSupabase(path: string, body: Buffer | Uint8Array, contentType: string) {
    const { data, error } = await supabase.storage
        .from("visions")
        .upload(path, body, {
            contentType,
            upsert: true
        });

    if (error) throw error;
    return data;
}

/**
 * GET PUBLIC URL
 */
export function getPublicUrl(path: string) {
    const { data } = supabase.storage
        .from("visions")
        .getPublicUrl(path);

    return data.publicUrl;
}
