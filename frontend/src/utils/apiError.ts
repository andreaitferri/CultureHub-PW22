export function getApiErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { detail?: unknown } } })?.response;
  const detail = response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}
