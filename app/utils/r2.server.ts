/**
 * CLOUDFLARE R2 VISION VAULT
 * High-performance media storage with presigned security.
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET = process.env.R2_BUCKET_NAME || "efans-visions";

/**
 * GENERATE UPLOAD URL
 * Creators use this to securely upload their essence directly to R2.
 */
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(S3, command, { expiresIn: 3600 });
}

/**
 * GENERATE VIEW URL (PRIVATE)
 * Returns a temporary 1-hour link for Unlocked Visions.
 */
export async function getViewUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });

    return await getSignedUrl(S3, command, { expiresIn: 3600 });
}

/**
 * UPLOAD DIRECTLY (SERVER-SIDE)
 * Useful for small assets or background processing.
 */
export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
    });

    return await S3.send(command);
}
