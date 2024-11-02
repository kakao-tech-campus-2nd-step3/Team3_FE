export interface Friend {
  userId: number;
  nickname: string;
  profileImage: string;
}

export interface SentRequest {
  id: number;
  receiverId: number;
  receiverName: string;
  profileImage: string;
  status: string;
}

export interface ReceivedRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  profileImage: string;
  status: string;
}

export interface SearchResult {
  id: number;
  nickname: string;
  profileImage: string;
}
