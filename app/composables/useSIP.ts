import { Invitation, Inviter } from "sip.js";

// Global SIP state using useState
const isRegistered = useState('sip.isRegistered', () => false);
const isCallActive = useState('sip.isCallActive', () => false);
const callStatus = useState<'idle' | 'connecting' | 'active' | 'incoming'>('sip.callStatus', () => 'idle');

// SIP variables (global)
let ua: any;
let registerer: any;
let activeSession: any;
let isInitialized = false;

export const useSIP = () => {
  const { user } = useAuth();
  const config = useRuntimeConfig();
  const { $createSIPUA } = useNuxtApp();

  // Initialize SIP User Agent (only once)
  const initializeSIP = () => {
    if (isInitialized) {
      console.log("SIP already initialized");
      return;
    }
    const { userAgent, registerer: reg } = $createSIPUA({
      uri: user.value?.id === 918
        ? `sip:33976@${config.public.asteriskDomain}`
        : `sip:36271@${config.public.asteriskDomain}`,
      username: user.value?.id === 918 ? "33976" : "36271",
      password: user.value?.id === 918 ? "test123" : "hello_test",
      wsServer: `wss://${config.public.asteriskDomain}:${config.public.asteriskWsPort}/ws`,
    });

    ua = userAgent;
    registerer = reg;

    ua.start().then(() => {
      registerer.register();
      isRegistered.value = true;
      isInitialized = true;
      console.log("SIP UA started and registered");
    });

    // Handle incoming calls
    ua.delegate = {
      onInvite: async (invitation: any) => {
        console.log("Incoming call...");
        activeSession = invitation;
        callStatus.value = 'incoming';
        
        await invitation.accept({
          sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } },
        });
        
        setupMedia(invitation);
        isCallActive.value = true;
        callStatus.value = 'active';
      },
    };
  };

  // Start an outbound call (local function)
  const startLocalCall = (target: string) => {
    return startCall(target);
  };

  // End the current call (local function)
  const endLocalCall = () => {
    return endCall();
  };

  // Setup media for the session
  const setupMedia = (session: any) => {
    const handler = session.sessionDescriptionHandler;
    handler.peerConnection.ontrack = (event: RTCTrackEvent) => {
      const remoteAudio = document.getElementById("remoteAudio") as HTMLAudioElement;
      if (remoteAudio && event.streams[0]) {
        remoteAudio.srcObject = event.streams[0];
      }
    };
  };

  // Cleanup SIP resources
  const cleanup = () => {
    if (activeSession) {
      activeSession.bye();
    }
    if (ua) {
      ua.stop();
    }
    isRegistered.value = false;
    isCallActive.value = false;
    callStatus.value = 'idle';
    isInitialized = false;
  };

  // Get current SIP status
  const getSIPStatus = () => ({
    isRegistered: isRegistered.value,
    isCallActive: isCallActive.value,
    callStatus: callStatus.value,
    isInitialized
  });

  return {
    // State
    isRegistered: readonly(isRegistered),
    isCallActive: readonly(isCallActive),
    callStatus: readonly(callStatus),
    
    // Methods
    initializeSIP,
    startCall: startLocalCall,
    endCall: endLocalCall,
    cleanup,
    getSIPStatus,
  };
};

// Export SIP functions for use in any component
export const startCall = (target: string) => {
  if (!ua) {
    console.error("SIP UA not initialized. Call initializeSIP() first.");
    return;
  }

  const targetURI = ua.makeURI(`sip:${target}@${useRuntimeConfig().public.asteriskDomain}`);
  const inviter = new Inviter(ua, targetURI, {
    sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } },
  });
  
  activeSession = inviter;
  callStatus.value = 'connecting';
  
  inviter.invite().then(() => {
    isCallActive.value = true;
    callStatus.value = 'active';
  }).catch((error: any) => {
    console.error("Call failed:", error);
    callStatus.value = 'idle';
  });
  
  setupMedia(inviter);
};

export const endCall = () => {
  if (activeSession) {
    activeSession.bye();
    activeSession = null;
    isCallActive.value = false;
    callStatus.value = 'idle';
  }
};

export const getSIPStatus = () => ({
  isRegistered: isRegistered.value,
  isCallActive: isCallActive.value,
  callStatus: callStatus.value,
  isInitialized
});

// Media setup function
const setupMedia = (session: any) => {
  const handler = session.sessionDescriptionHandler;
  handler.peerConnection.ontrack = (event: RTCTrackEvent) => {
    const remoteAudio = document.getElementById("remoteAudio") as HTMLAudioElement;
    if (remoteAudio && event.streams[0]) {
      remoteAudio.srcObject = event.streams[0];
    }
  };
};