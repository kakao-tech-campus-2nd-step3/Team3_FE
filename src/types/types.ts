export interface Friend {
  friendId: number;
  friendName: string;
  friendProfileImage: string;
  createdAt: string;
}

export interface SentRequest {
  id: number;
  receiverId: number;
  receiverNames: string;
  friendProfileName: string;
  status: string;
}

export interface ReceivedRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  friendProfileImage: string;
  status: string;
}

export interface SearchResult {
  id: number;
  nickName: string;
  profileImage: string;
}
