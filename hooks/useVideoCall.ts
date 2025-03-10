import { useState } from 'react'

export const useVideoCall = () => {
    const [open, setOpen] = useState(false);

    const toggleVideoCall = () => {
        setOpen(!open);
    }


    return {open, toggleVideoCall}
}