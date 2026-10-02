const SOUND_PREFERENCE_KEY = 'notification_sound_enabled';

export const isNotificationSoundEnabled = (): boolean =>
  localStorage.getItem(SOUND_PREFERENCE_KEY) === 'true';

export const setNotificationSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem(SOUND_PREFERENCE_KEY, String(enabled));
};

export const playNotificationSound = (): void => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.35);
    oscillator.onended = () => void ctx.close();
  } catch {
    // audio playback unsupported or blocked by the browser - ignore
  }
};
