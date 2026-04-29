export enum FeedbackStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved'
}

export interface Flora {
  id?: string;
  name: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  fact?: string;
}

export interface Fauna {
  id?: string;
  name: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  fact?: string;
}

export interface HistoryItem {
  id?: string;
  title: string;
  period?: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface Feedback {
  id?: string;
  name: string;
  email: string;
  message: string;
  status: FeedbackStatus;
  createdAt: any; // Firestore Timestamp
}
