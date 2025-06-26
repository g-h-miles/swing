import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const getPermission = async (name: PermissionName) => {
  const permission = await navigator.permissions.query({ name: name as PermissionName });
  return permission;
}

export function useCameraPermission() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['camera-permission'],
    queryFn: () => getPermission('camera' as PermissionName),
    retry: 1,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

    const testData = queryClient.getQueryData(['camera-permission']) as PermissionStatus;


  useEffect(() => {
    if (testData) {
      const handlePermissionChange = () => {
        queryClient.invalidateQueries({ queryKey: ['camera-permission'] });
      };

      testData.addEventListener('change', handlePermissionChange);

      return () => {
        testData.removeEventListener('change', handlePermissionChange);
      };
    }
  }, [testData, queryClient]);



  return query;
}

export function useMicrophonePermission() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['microphone-permission'],
    queryFn: () => getPermission('microphone' as PermissionName),
    retry: 1,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      const handlePermissionChange = () => {
        queryClient.invalidateQueries({ queryKey: ['microphone-permission'] });
      };

      query.data.addEventListener('change', handlePermissionChange);

      return () => {
        query.data.removeEventListener('change', handlePermissionChange);
      };
    }
  }, [query.data, queryClient]);

  return query;
}


