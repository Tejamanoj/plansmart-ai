/**
 * Base HTTP client wrapper with timeout support for backend / AI API service integrations.
 */
export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  private static defaultTimeoutMs = 30000; // 30 second timeout for slow AI calls

  public static async get<T>(endpoint: string, timeoutMs = this.defaultTimeoutMs): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('The AI generation service timed out (took longer than 30 seconds). Please try again.');
      }
      throw err;
    }
  }

  public static async post<T, B>(endpoint: string, body: B, timeoutMs = this.defaultTimeoutMs): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('The AI model generation timed out (took longer than 30 seconds). Please try again.');
      }
      throw err;
    }
  }
}
