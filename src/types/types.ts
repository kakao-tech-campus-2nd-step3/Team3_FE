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

export interface Member {
  id: number;
  nickname: string;
}

export interface Team {
  id: number;
  teamName: string;
  user: Member; // 관리자 정보
  teamMembers: Member[]; // 팀 멤버 배열
}

export interface Invitation {
  invitationId: number;
  teamId: number;
  teamName: string;
  userId: number;
  nickname: string;
  profileImage: string;
  status: string; // "PENDING" 등의 상태값
}

export interface InviteUserParams {
  teamId: number;
  nickname: string;
}

export interface TeamMember {
  userId: number;
  nickname: string;
  profileImage: string | null;
  role: "ADMIN" | "MEMBER";
}

export interface SentInvitation {
  invitationId: number;
  teamId: number;
  teamName: string;
  userId: number;
  nickname: string;
  profileImage: string | null;
  status: "PENDING";
}

export interface TeamInvitation {
  invitationId: number;
  teamId: number;
  teamName: string;
  userId: number;
  nickname: string;
  profileImage: string;
  status: string;
}
