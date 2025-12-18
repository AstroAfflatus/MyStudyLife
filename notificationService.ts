
import * as Tone from 'tone';

export const NotificationService = {
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  },

  playPremiumSound: async () => {
    try {
      // Ensure Tone.js context is initialized
      if (Tone.getContext().state !== 'running') {
        await Tone.start();
      }
      
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { 
            attack: 0.1, 
            decay: 0.3, 
            sustain: 0.4, 
            release: 2 
        }
      }).toDestination();

      // Premium Resonance Engine
      const reverb = new Tone.Reverb({ decay: 5, wet: 0.4 }).toDestination();
      const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
      synth.connect(reverb);
      synth.connect(chorus);
      
      const now = Tone.now();
      // Ultra-Luxe Harmonic Sequence (Ascending Arpeggio)
      synth.triggerAttackRelease("E4", "2n", now);
      synth.triggerAttackRelease("G4", "2n", now + 0.15);
      synth.triggerAttackRelease("C5", "1n", now + 0.3);
      
      console.debug("Luxury Scholar Chime Pulse executed.");
    } catch (e) {
      console.warn("Audio Context init required user interaction. Postponed chime pulse.", e);
    }
  },

  send: async (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'https://iili.io/flTBGFn.jpg'
      });
      await NotificationService.playPremiumSound();
    } else {
      // Background pulse sound always executes if initialized
      await NotificationService.playPremiumSound();
    }
  }
};
