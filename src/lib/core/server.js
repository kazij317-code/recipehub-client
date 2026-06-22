import { getTokenServer } from "../session/session";
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, "") : null;

if (!baseUrl) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is required for server-side API calls."
  );
}

export const serverMution = async (path, data, method) => {
  const token = await getTokenServer();
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
    },
  };

  // Only include body for methods that need it
  if (data !== null && data !== undefined && method !== "DELETE") {
    fetchOptions.body = JSON.stringify(data);
  }

  const res = await fetch(`${baseUrl}${path}`, fetchOptions);

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  return await res.json();
};
