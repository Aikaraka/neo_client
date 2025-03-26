"use server";

export async function callServerAction(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  return response.json();
}
