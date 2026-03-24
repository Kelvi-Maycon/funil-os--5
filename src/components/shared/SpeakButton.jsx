import { useState, useCallback } from 'react';
import { speak, stop, isTTSSupported } from '../../services/tts.js';
import { VolumeIcon } from './icons.jsx';

/**
 * A small icon button that speaks text aloud using TTS.
 *
 * @param {object} props
 * @param {string} props.text - The text to speak
 * @param {string} [props.lang='en-US'] - Language for TTS
 * @param {number} [props.rate=1] - Speech rate
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.size=15] - Icon size
 */
export default function SpeakButton({ text, lang = 'en-US', rate = 1, className = '', size = 15 }) {
    const [speaking, setSpeaking] = useState(false);

    const handleClick = useCallback(async (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (speaking) {
            stop();
            setSpeaking(false);
            return;
        }

        setSpeaking(true);
        try {
            await speak(text, { lang, rate });
        } catch {
            // Silently ignore TTS errors
        } finally {
            setSpeaking(false);
        }
    }, [text, lang, rate, speaking]);

    if (!isTTSSupported()) return null;

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${speaking
                    ? 'bg-[#eef0ec] text-[#35403A] border border-[#CED1C6] shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 border border-neutral-200/60'
                } ${className}`}
            title={speaking ? 'Parar áudio' : 'Ouvir pronúncia'}
            aria-label={speaking ? 'Parar áudio' : 'Ouvir pronúncia'}
        >
            <VolumeIcon size={size} className={speaking ? 'animate-pulse' : ''} />
        </button>
    );
}
