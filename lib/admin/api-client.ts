"use client"

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function apiRequest<T = unknown>(
  url: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })

  let data: any = null
  try {
    data = await response.json()
  } catch {}

  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `/admin/login?next=${next}`
    throw new ApiError("Uw sessie is verlopen. Log opnieuw in.", 401)
  }
  if (!response.ok) {
    throw new ApiError(data?.error ?? "Er ging iets mis. Probeer het opnieuw.", response.status)
  }
  return data as T
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Er ging iets mis. Probeer het opnieuw."
}
