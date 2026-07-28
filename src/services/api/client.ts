/**
 * Base HTTP client wrapper for backend / AI API service integrations.
 */
export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  public static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  public static async post<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}
