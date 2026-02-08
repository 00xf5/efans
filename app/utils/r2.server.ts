import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _s3: S3Client | null = null;
let _bucket: string | null = null;

function getS3() {
    if (!_s3) {
        _s3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACCOUNT_ID || "placeholder"}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || "placeholder",
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "placeholder",
            },
        });
    }
    return _s3;
}

function getBucket() {
    if (!_bucket) {
        _bucket = process.env.R2_BUCKET_NAME || "efans-visions";
    }
    return _bucket;
}


/**
 * GENERATE UPLOAD URL
 * Creators use this to securely upload their essence directly to R2.
 */
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: getBucket(),
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(getS3(), command, { expiresIn: 3600 });
}

/**
 * GENERATE VIEW URL (PRIVATE)
 * Returns a temporary 1-hour link for Unlocked Visions.
 */
export async function getViewUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: getBucket(),
        Key: key,
    });

    return await getSignedUrl(getS3(), command, { expiresIn: 3600 });
}

/**
 * UPLOAD DIRECTLY (SERVER-SIDE)
 * Useful for small assets or background processing.
 */
export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: getBucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
    });

    return await getS3().send(command);
}
