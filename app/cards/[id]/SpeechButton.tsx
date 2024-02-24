"use client";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton } from "@mui/material";
import { useEffect, useRef } from 'react';

const lang = "en-US";
export function SpeechButton({ text }: { text: string }) {
    const speechRef = useRef<{
        synth: SpeechSynthesis;
        voice: SpeechSynthesisVoice | undefined;
    } | null>(null);
    const updateVoices = () => {
        if (!speechRef.current) {
            return;
        }
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const langVoices = voices.filter((v) => v.lang === lang);
        if (langVoices.length === 0) {
            return;
        }
        // prefer not local service
        langVoices.sort((a, b) => Number(a.localService) - Number(b.localService));
        speechRef.current.voice = langVoices[0];
    };
    useEffect(() => {
        const synth = window.speechSynthesis;
        speechRef.current = { synth, voice: undefined };
        synth.onvoiceschanged = updateVoices;
        updateVoices();
    }, []);
    return (
        <IconButton onClick={(() => {
            if (!speechRef.current) {
                return;
            }
            const { synth, voice } = speechRef.current;
            const utterance = new SpeechSynthesisUtterance(text);
            if (voice) {
                utterance.voice = voice;
            } else {
                utterance.lang = lang;
            }
            synth.speak(utterance);
        })}>
            <VolumeUpIcon />
        </IconButton>
    );
}