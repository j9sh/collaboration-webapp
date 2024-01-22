import React, { useEffect, useRef } from 'react';
import { socket } from '../../socket';

export const DrawingBoard = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const currentPos = {};
        let drawing = false;

        // User-defined functions.
        const drawLine = (x0, y0, x1, y1, emit) => {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            
            // When you don't want to emit the event to other sockets.
            if (!emit) { return; }
            const w = canvas.width;
            const h = canvas.height;
            socket.emit("draw-new-canvas", {
                x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h
            });
        };
        const onMouseDown = (event) => {
            drawing = true;
            currentPos.x = event.clientX;
            currentPos.y = event.clientY;
        };
        const onMouseMove = (event) => {
            if (!drawing) { return; }
            drawLine(
                currentPos.x,
                currentPos.y,
                event.clientX,
                event.clientY,
                true
            );
            currentPos.x = event.clientX;
            currentPos.y = event.clientY;
        };
        const onMouseUp = (event) => {
            if (!drawing) { return; }
            drawing = false;
            drawLine(
                currentPos.x,
                currentPos.y,
                event.clientX,
                event.clientY,
                true
            );
        };
        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // To limit the number of events per second.
        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime();
            return function() {
                const time = new Date().getTime();
                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        };

        // Event listeners.
        canvas.addEventListener("mousedown", onMouseDown, false);
        canvas.addEventListener("mouseup", onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);      
        window.addEventListener('resize', onResize, false);
        onResize();

        // Checks for any new content and reflects the same on the page.
        socket.on("new-canvas-received", newContent => {
            const w = canvas.width;
            const h = canvas.height;
            drawLine(
                newContent.x0 * w,
                newContent.y0 * h,
                newContent.x1 * w,
                newContent.y1 * h
            );
        });
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                style={{
                    border: "1px solid black",
                }}
            />
        </div>
    )
};
