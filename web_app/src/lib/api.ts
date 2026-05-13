function normalizeApiBaseUrl(value?: string) {
  const baseUrl = value?.replace(/\/$/, "") || "http://localhost:5000/api";

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

type RequestOptions = RequestInit & {
  fallbackData?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { fallbackData, headers, ...rest } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error((errorBody as { message?: string }).message || "Request failed");
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallbackData !== undefined) {
      return fallbackData as T;
    }

    throw error;
  }
}

export { API_BASE_URL };
