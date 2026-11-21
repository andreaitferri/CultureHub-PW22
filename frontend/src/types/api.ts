export type RoleName = 'Admin' | 'Operatore' | 'Visitatore';

export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  role: { id: number; name: RoleName };
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type Category = { id: number; name: string; description?: string | null };
export type WorkStatus = 'active' | 'archived';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected';
export type FeedbackModerationStatus = 'pending' | 'approved' | 'rejected';
export type Work = {
  id: number;
  title: string;
  author?: string | null;
  description?: string | null;
  image_url?: string | null;
  status: WorkStatus;
  category_id: number;
  category: Category;
};
export type Event = {
  id: number;
  title: string;
  description?: string | null;
  location: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  status: EventStatus;
};
export type Booking = {
  id: number;
  user_id: number;
  event_id: number;
  seats: number;
  status: BookingStatus;
  created_at: string;
};
export type Feedback = {
  id: number;
  user_id: number;
  event_id?: number | null;
  booking_id?: number | null;
  rating: number;
  comment: string;
  moderation_status: FeedbackModerationStatus;
  created_at: string;
};
