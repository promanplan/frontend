/**
 * Audio recording utility functions
 */

// Create a window-level reference for the MediaRecorder
if (typeof window !== 'undefined') {
  window.mediaRecorder = null;
}

export const recordAudio = (stream: MediaStream) => {
  // Create a new MediaRecorder instance with appropriate MIME type
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });
  
  // Store the recorder in the window object for global access
  if (typeof window !== 'undefined') {
    window.mediaRecorder = mediaRecorder;
  }
  
  let audioChunks: Blob[] = [];

  // Set up data available handler
  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  });

  // Start recording with timeslice to ensure data is available during recording
  mediaRecorder.start(100); // Get data every 100ms

  const promise = new Promise<Blob>((resolve) => {
    // Resolve the promise with the complete audio data when recording stops
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioChunks = [];
      resolve(audioBlob);
    });
  });

  return promise;
};

// Helper to stop the MediaRecorder
export const stop = () => {
  if (typeof window !== 'undefined' && window.mediaRecorder && window.mediaRecorder.state !== "inactive") {
    window.mediaRecorder.stop();
  }
};

// Augment window interface to include mediaRecorder
declare global {
  interface Window {
    mediaRecorder: MediaRecorder | null;
  }
}
