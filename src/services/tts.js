// services/tts.js — Text-to-Speech wrapper using Web Speech API

let currentUtterance = null;

/**
 * Speak text aloud using the browser's native speechSynthesis API.
 * Cancels any currently playing speech before starting.
 *
 * @param {string} text - The text to speak
 * @param {object} [options]
 * @param {number} [options.rate=1] - Speech rate (0.5 to 2)
 * @param {string} [options.lang='en-US'] - BCP 47 language tag
 * @param {number} [options.pitch=1] - Pitch (0 to 2)
 * @returns {Promise<void>} Resolves when speech ends, rejects on error
 */
export function speak(text, { rate = 1, lang = 'en-US', pitch = 1 } = {}) {
    if (!window.speechSynthesis || !text?.trim()) return Promise.resolve();

    // Cancel any in-progress speech
    stop();

    return new Promise((resolve, reject) => {
        const utt = new SpeechSynthesisUtterance(text.trim());
        utt.lang = lang;
        utt.rate = Math.max(0.5, Math.min(2, rate));
        utt.pitch = Math.max(0, Math.min(2, pitch));

        // Try to pick a good English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === lang && v.localService) ||
            voices.find(v => v.lang === lang) ||
            voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (preferred) utt.voice = preferred;

        utt.onend = () => {
            currentUtterance = null;
            resolve();
        };
        utt.onerror = (event) => {
            currentUtterance = null;
            // 'interrupted' and 'canceled' are normal when we call stop()
            if (event.error === 'interrupted' || event.error === 'canceled') {
                resolve();
                return;
            }
            reject(new Error(`TTS error: ${event.error}`));
        };

        currentUtterance = utt;
        window.speechSynthesis.speak(utt);
    });
}

/**
 * Stop any currently playing speech.
 */
export function stop() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentUtterance = null;
}

/**
 * Check if speech synthesis is currently speaking.
 */
export function isSpeaking() {
    return window.speechSynthesis?.speaking ?? false;
}

/**
 * Check if TTS is supported in this browser.
 */
export function isTTSSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
