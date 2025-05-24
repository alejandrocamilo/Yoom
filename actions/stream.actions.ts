"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const api_secret_key = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!apiKey) throw new Error("No Api Key");
  if (!api_secret_key) throw new Error("No Api Secret Key");
  if (!user) throw new Error("No user logged in");

  const client = new StreamClient(apiKey, api_secret_key);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.generateUserToken({
    user_id: user.id,
    exp,
    iat: issued,
  });

  return token;
};
