import React from 'react';
import { logout } from '../utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
  });
  return { logoutMutation: mutate };
};

export default useLogout;
