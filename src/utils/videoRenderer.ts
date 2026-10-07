import { VlogVideoScript, CreatorAccount } from '../types';

export interface RenderOptions {
  resolution: '720p' | '1080p';
  aspectRatio: '9:16' | '16:9';
  includeAudio: boolean;
  burnSubtitles: boolean;
  speedMultiplier?: number;
}

export interface RenderResult {
  blob: Blob;
  url: string;
  filename: string;
  durationSec: number;
}

// Pre-load an image from URL
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback: create a blank 1x1 canvas image if loading fails
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 720;
      fallbackCanvas.height = 1280;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 720, 1280);
      }
      const fallbackImg = new Image();
      fallbackImg.src = fallbackCanvas.toDataURL();
      fallbackImg.onload = () => resolve(fallbackImg);
    };
    img.src = src;
  });
}

// Generate synthesized ambient lofi soundtrack using Web Audio API
function setupSynthesizedAudio(durationSec: number) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass();
  const dest = audioCtx.createMediaStreamDestination();

  // Master gain
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  masterGain.connect(dest);

  // Chord progression generator (Warm Lo-Fi Rhodes chords: Dm9 -> G13 -> Cmaj9 -> Am9)
  const chordNotes = [
    [293.66, 349.23, 440.0, 523.25], // Dm9
    [196.0, 246.94, 329.63, 440.0],  // G13
    [261.63, 329.63, 392.0, 493.88], // Cmaj9
    [220.0, 261.63, 329.63, 392.0],  // Am9
  ];

  const barDuration = 2.4; // ~100 BPM
  const totalBars = Math.ceil(durationSec / barDuration);

  for (let bar = 0; bar < totalBars; bar++) {
    const startTime = audioCtx.currentTime + bar * barDuration;
    const chord = chordNotes[bar % chordNotes.length];

    // Play chord tones with soft decay
    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Low-pass filter for vintage lo-fi warmth
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + barDuration * 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + barDuration);
    });

    // Soft bass note on beat 1
    const bassOsc = audioCtx.createOscillator();
    const bassGain = audioCtx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord[0] / 2, startTime);

    bassGain.gain.setValueAtTime(0.2, startTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, startTime + barDuration * 0.7);

    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start(startTime);
    bassOsc.stop(startTime + barDuration);
  }

  return { audioCtx, audioStream: dest.stream };
}

export async function renderAndDownloadVlogVideo(
  script: VlogVideoScript,
  account: CreatorAccount,
  options: RenderOptions,
  onProgress: (percent: number, statusText: string) => void
): Promise<RenderResult> {
  const isVertical = options.aspectRatio === '9:16';
  const width = isVertical ? (options.resolution === '1080p' ? 1080 : 720) : (options.resolution === '1080p' ? 1920 : 1280);
  const height = isVertical ? (options.resolution === '1080p' ? 1920 : 1280) : (options.resolution === '1080p' ? 1080 : 720);

  onProgress(5, 'Loading high-definition scene visuals...');

  // Pre-load images
  const loadedImages: HTMLImageElement[] = [];
  for (let i = 0; i < script.scenes.length; i++) {
    const sc = script.scenes[i];
    const imgSrc = sc.imagePreview || account.recentPosts[0]?.thumbnail || '';
    const img = await loadImage(imgSrc);
    loadedImages.push(img);
  }

  onProgress(15, 'Configuring HD rendering canvas & video encoder...');

  // Setup offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  // Video duration: compress scenes slightly for prompt and snappy export (3s to 5s per scene, total ~15-20s video)
  const sceneDurations = script.scenes.map((s) => Math.max(3, Math.min(6, s.durationSec)));
  const totalVideoDuration = sceneDurations.reduce((a, b) => a + b, 0);

  // Audio stream setup
  let audioStream: MediaStream | null = null;
  let audioCtxRef: AudioContext | null = null;
  if (options.includeAudio) {
    try {
      const audioSetup = setupSynthesizedAudio(totalVideoDuration);
      audioStream = audioSetup.audioStream;
      audioCtxRef = audioSetup.audioCtx;
    } catch (e) {
      console.warn('Web Audio synthesis not allowed or supported', e);
    }
  }

  // Combine video and audio stream
  const canvasStream = canvas.captureStream(30); // 30 FPS
  const combinedTracks = [...canvasStream.getVideoTracks()];
  if (audioStream) {
    combinedTracks.push(...audioStream.getAudioTracks());
  }
  const combinedStream = new MediaStream(combinedTracks);

  // Find best supported mimeType
  const supportedTypes = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  let chosenMime = 'video/webm';
  for (const t of supportedTypes) {
    if (MediaRecorder.isTypeSupported(t)) {
      chosenMime = t;
      break;
    }
  }

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: chosenMime,
    videoBitsPerSecond: options.resolution === '1080p' ? 8000000 : 4500000,
  });

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start();

  const fps = 30;
  const totalFrames = Math.floor(totalVideoDuration * fps);
  let currentFrame = 0;

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      if (audioCtxRef) {
        audioCtxRef.close().catch(() => {});
      }

      onProgress(100, 'Packaging video file...');
      const ext = chosenMime.includes('mp4') ? 'mp4' : 'webm';
      const cleanTitle = script.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const filename = `Loomix_Vlog_${cleanTitle}_${options.resolution}.${ext}`;

      const blob = new Blob(recordedChunks, { type: chosenMime });
      const url = URL.createObjectURL(blob);

      // Trigger instant automatic download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      resolve({
        blob,
        url,
        filename,
        durationSec: totalVideoDuration,
      });
    };

    recorder.onerror = (err) => {
      reject(err);
    };

    // Frame-by-frame rendering loop
    const frameIntervalMs = 1000 / fps;
    let sceneStartTime = 0;

    const renderLoop = () => {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const currentTime = currentFrame / fps;

      // Find current scene
      let accumulated = 0;
      let sceneIdx = 0;
      let sceneProgress = 0;
      let localSceneTime = 0;

      for (let i = 0; i < sceneDurations.length; i++) {
        if (currentTime <= accumulated + sceneDurations[i] || i === sceneDurations.length - 1) {
          sceneIdx = i;
          localSceneTime = currentTime - accumulated;
          sceneProgress = localSceneTime / sceneDurations[i];
          break;
        }
        accumulated += sceneDurations[i];
      }

      const scene = script.scenes[sceneIdx];
      const img = loadedImages[sceneIdx];

      // 1. Draw Image with smooth Ken Burns zoom/pan
      const zoom = 1.05 + sceneProgress * 0.08;
      const panX = Math.sin(sceneProgress * Math.PI) * (width * 0.03);

      ctx.save();
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      // Draw centered with zoom
      const drawW = width * zoom;
      const drawH = height * zoom;
      const drawX = (width - drawW) / 2 + panX;
      const drawY = (height - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 2. Cinematic Vignette and Contrast Scrim
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.05)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 3. Top Director Badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.roundRect(width * 0.05, height * 0.04, width * 0.45, height * 0.038, [12]);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${Math.round(width * 0.024)}px "JetBrains Mono", monospace`;
      ctx.fillText(
        `SCENE ${sceneIdx + 1}/${script.scenes.length} · ${scene.framing.toUpperCase()}`,
        width * 0.07,
        height * 0.065
      );

      // 4. Kinetic Subtitles & Spoken Audio
      if (options.burnSubtitles) {
        // On-screen hook callout pill
        if (scene.onScreenText) {
          const pillText = scene.onScreenText;
          ctx.font = `bold ${Math.round(width * 0.036)}px "Plus Jakarta Sans", sans-serif`;
          const textMetrics = ctx.measureText(pillText);
          const pillW = textMetrics.width + 40;
          const pillH = height * 0.045;
          const pillX = (width - pillW) / 2;
          const pillY = height * 0.72;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, [10]);
          ctx.fill();

          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#fcd34d';
          ctx.textAlign = 'center';
          ctx.fillText(pillText, width / 2, pillY + pillH * 0.68);
        }

        // Subtitle Voiceover box at bottom
        const subBoxW = width * 0.88;
        const subBoxH = height * 0.12;
        const subBoxX = (width - subBoxW) / 2;
        const subBoxY = height * 0.78;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
        ctx.beginPath();
        ctx.roundRect(subBoxX, subBoxY, subBoxW, subBoxH, [16]);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = `italic 600 ${Math.round(width * 0.032)}px "Plus Jakarta Sans", sans-serif`;

        // Wrap dialogue into 2 lines
        const words = scene.scriptVoiceover.split(' ');
        let line1 = '';
        let line2 = '';
        for (const w of words) {
          if (line1.length < 32) {
            line1 += (line1 ? ' ' : '') + w;
          } else {
            line2 += (line2 ? ' ' : '') + w;
          }
        }

        ctx.fillText(`"${line1}"`, width / 2, subBoxY + subBoxH * 0.42);
        if (line2) {
          ctx.fillText(`"${line2}"`, width / 2, subBoxY + subBoxH * 0.76);
        }
      }

      // 5. Creator Handle & Watermark
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = `bold ${Math.round(width * 0.026)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(account.handle, width * 0.06, height * 0.94);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = `normal ${Math.round(width * 0.02)}px "JetBrains Mono", monospace`;
      ctx.fillText(
        `00:${Math.floor(currentTime).toString().padStart(2, '0')} / 00:${Math.floor(totalVideoDuration).toString().padStart(2, '0')}`,
        width * 0.06,
        height * 0.965
      );

      // 6. Dynamic Audio Waveform Visualizer Bar
      const waveBars = 20;
      const barW = (width * 0.4) / waveBars;
      const startX = width * 0.54;
      for (let b = 0; b < waveBars; b++) {
        const barH = (Math.sin(currentTime * 8 + b * 0.5) + 1.2) * (height * 0.012);
        ctx.fillStyle = '#818cf8';
        ctx.fillRect(startX + b * barW, height * 0.95 - barH / 2, barW - 2, barH);
      }

      // 7. Timeline Progress Bar at bottom edge
      const progressW = (currentTime / totalVideoDuration) * width;
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, height - 8, progressW, 8);

      ctx.restore();

      currentFrame++;

      // Progress reporting
      if (currentFrame % 15 === 0) {
        const pct = Math.min(98, Math.round(15 + (currentFrame / totalFrames) * 82));
        onProgress(pct, `Rendering video frames ${currentFrame}/${totalFrames} (Scene ${sceneIdx + 1}/${script.scenes.length})...`);
      }

      // Schedule next frame with tight timing
      setTimeout(renderLoop, 16);
    };

    renderLoop();
  });
}
