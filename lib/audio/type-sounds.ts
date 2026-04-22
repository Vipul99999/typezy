"use client";

type SoundKind = "type" | "backspace" | "finish";

let audioContext: AudioContext | null = null;

function getAudioContextCtor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || null;
}

export async function warmTypeSound() {
  const AudioContextCtor = getAudioContextCtor();
  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextCtor();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  return audioContext.state === "running" ? audioContext : null;
}

function createSound(context: AudioContext, kind: SoundKind) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  const now = context.currentTime;
  if (kind === "type") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(620, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.025, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    oscillator.start(now);
    oscillator.stop(now + 0.055);
    return;
  }

  if (kind === "backspace") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(240, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.02, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    oscillator.start(now);
    oscillator.stop(now + 0.065);
    return;
  }

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(540, now);
  oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.08);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  oscillator.start(now);
  oscillator.stop(now + 0.17);
}

export async function playTypeSound(kind: SoundKind) {
  const context = await warmTypeSound();
  if (!context) {
    return false;
  }

  createSound(context, kind);
  return true;
}
