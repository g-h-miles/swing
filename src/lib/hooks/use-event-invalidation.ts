import { useRef } from 'react';
import { useEventListener } from "./use-event-listener";
import { useQueryClient } from '@tanstack/react-query';

export function useEventInvalidation() {
  const queryClient = useQueryClient();
  const mediaDevices = useRef(navigator.mediaDevices);

  useEventListener('devicechange', () => {
    console.log('Device changed');
    queryClient.invalidateQueries({ queryKey: ['webcams'] });
  }, mediaDevices);

  // useEventListener('online', () => {
  //   queryClient.invalidateQueries({ queryKey: ['user-status'] });
  // });

  // useEventListener('visibilitychange', () => {
  //   if (!document.hidden) {
  //     queryClient.invalidateQueries({ queryKey: ['notifications'] });
  //   }
  // });
}
