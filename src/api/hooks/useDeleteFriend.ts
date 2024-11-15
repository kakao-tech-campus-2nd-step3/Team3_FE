// src/api/hooks/useDeleteFriend.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

const useDeleteFriend = (friendId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(`/api/friends/${friendId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};

export default useDeleteFriend;
