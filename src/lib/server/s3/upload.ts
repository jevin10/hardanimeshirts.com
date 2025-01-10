import { env } from "$env/dynamic/private";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./client";

export async function uploadProductImage(id: number, name: string, file: Buffer): Promise<string> {
  const key = `products/${id}/${name}.webp`;

  await s3.send(new PutObjectCommand({
    Bucket: `${env.AWS_BUCKET_NAME}`,
    Key: key,
    Body: file,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000' // 1 year cache
  }));

  const imageUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return imageUrl;
}

export async function uploadPostImage(imageId: string, file: Buffer): Promise<string> {
  const key = `posts/${imageId}.webp`;

  await s3.send(new PutObjectCommand({
    Bucket: `${env.AWS_BUCKET_NAME}`,
    Key: key,
    Body: file,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000' // 1 year cache
  }));

  const imageUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return imageUrl;
}
