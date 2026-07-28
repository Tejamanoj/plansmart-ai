export interface AIPromptContext {
  destination: string;
  days: number;
  budget: number;
  style: string;
  interests: string[];
}

export interface AIServiceResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
