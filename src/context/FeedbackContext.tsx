"use client";

import React from 'react'
import { createContext } from "react";

interface Feedback {
    feedback: {
        message: string,
        type: string
    },
    setFeedback: (feedback: { message: string, type: string }) => void
};

const defaultValue = {
    feedback: {
        message: "",
        type: ""
    },
    setFeedback: () => { throw new Error("setFeedback called outside FeedbackProvider") }
};

export const FeedbackContext = createContext<Feedback>(defaultValue);

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
    const [ feedback, setFeedback ] = React.useState<{ message: string, type: string }>({
        message: "",
        type: ""
    });

    return (
        <FeedbackContext.Provider value={{ feedback, setFeedback }}>
            {children}
        </FeedbackContext.Provider>
    )
}