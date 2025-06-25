import { useQuery} from '@tanstack/react-query';
import { getAvailableWebcams } from '../webcams';

export function useAvailableWebcams() {

  return useQuery({
    queryKey: ['webcams'],
    queryFn: getAvailableWebcams,
    retry: 1,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,

  });
}
