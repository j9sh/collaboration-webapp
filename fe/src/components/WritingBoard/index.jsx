import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';

export const WritingBoard = () => {
    const [content, setContent] = useState("Edit me!");
    const handleChanges = (event) => {
        setContent(event.target.value);
        socket.emit("content-changed", event.target.value);
    };
    useEffect(() => {
        // Checks for any new content and reflects the same on the page.
        socket.on("new-content-received", newContent => {
            setContent(newContent);
        });
    }, []);
    return (
        <div>
            <textarea
                value={content}
                onChange={e => handleChanges(e)}
                rows={10} // Set the number of visible rows
                cols={50} // Set the number of visible columns
                style={{ resize: 'none' }} // Prevent resizing
            />
        </div>
    )
};
