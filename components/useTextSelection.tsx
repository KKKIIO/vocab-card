"use client";
import { useEffect, useRef, useState } from "react";

export function useTextSelection<T extends Node>() {
    // we need a reference to the element wrapping the text in order to determine
    // if the selection is the selection we are after
    const ref = useRef<T>(null);

    // we store info about the current Range here
    const [range, setRange] = useState<FilledRange | null>(null);

    // In this effect we're registering for the documents "selectionchange" event
    useEffect(() => {
        function handleChange() {
            // get selection information from the browser
            const selection = window.getSelection();

            // we only want to proceed when we have a valid selection
            if (!selection ||
                selection.isCollapsed ||
                !ref.current ||
                // and the selection is in the ref.current element
                !ref.current.contains(selection.anchorNode) ||
                !ref.current.contains(selection.focusNode)) {
                setRange(null);
                return;
            }

            const range = selection.getRangeAt(0);
            setRange({
                startContainer: range.startContainer,
                startOffset: range.startOffset,
                endContainer: range.endContainer,
                endOffset: range.endOffset,
            });
        }

        document.addEventListener("selectionchange", handleChange);
        return () => document.removeEventListener("selectionchange", handleChange);
    }, []);

    return { range, ref };
}

export interface FilledRange {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
}
