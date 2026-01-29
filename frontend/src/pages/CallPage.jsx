import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../utils/api';
import useAuthUser from '../hooks/useAuthUser';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser: user, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user, //this will run only when authUser is available and !! is a trick to covert to boolean
  });

  // useEffect(() => {
  //   const initCall = async () => {
  //     if (!tokenData?.token || !user || !callId) return;
  //     try {
  //       console.log('Initializing stream video client...');

  //       const user2 = {
  //         id: user._id,
  //         name: user.fullName,
  //         image: user.profilePic,
  //       };

  //       const videoClient = new StreamVideoClient({
  //         apiKey: STREAM_API_KEY,
  //         user2,
  //         token: tokenData.token,
  //       });

  //       const callInstance = videoClient.call('default', callId);
  //       await callInstance.join({ create: true });

  //       console.log('Joined call successfully');

  //       setClient(videoClient);
  //       setCall(callInstance);
  //     } catch (error) {
  //       console.error('Error joining call:', error);
  //       toast.error('Could not join the call. Please try again.');
  //     } finally {
  //       setIsConnecting(false);
  //     }
  //   };
  //   initCall();
  // }, [tokenData, user, callId]);

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return;

      try {
        const streamUser = {
          id: user._id,
          name: user.fullName,
          image: user.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: streamUser,
          tokenProvider: async () => tokenData.token,
        });

        await videoClient.connectUser(streamUser);

        const callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error('Error joining call:', error);
        toast.error('Could not join the call. Please try again.');
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      client?.disconnectUser();
    };
  }, [tokenData?.token, user, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate('/');

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
