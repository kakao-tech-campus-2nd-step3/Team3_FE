// src/api/hooks/useDeleteFriend.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

const useDeleteFriend = (friendId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(`/friends/${friendId}`),
    onSuccess: () => {
      alert("친구가 목록에서 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};

export default useDeleteFriend;
