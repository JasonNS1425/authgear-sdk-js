/* global Uint8Array */
import { _base64URLEncode } from "@authgear/core";

import { randomBytes, sha256String } from "./plugin";

function byteToHex(byte: number): string {
  return ("0" + byte.toString(16)).substr(-2);
}

export async function generateCodeVerifier(): Promise<string> {
  const arr = await randomBytes(32);
  let output = "";
  for (let i = 0; i < arr.length; ++i) {
    output += byteToHex(arr[i]);
  }
  return output;
}

export async function computeCodeChallenge(
  codeVerifier: string
): Promise<string> {
  const hash = await sha256String(codeVerifier);
  const base64 = _base64URLEncode(new Uint8Array(hash));
  return base64;
}
