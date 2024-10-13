export interface Friend {
  friend_id: number;
  friend_name: string;
  friend_profile_image: string;
  created_at: string;
}

export interface SentRequest {
  id: number;
  receiver_id: number;
  receiver_name: string;
  status: string;
}

export interface ReceivedRequest {
  id: number;
  requester_id: number;
  requester_name: string;
  status: string;
}

export interface SearchResult {
  id: number;
  nickname: string;
  profile_image: string;
}
