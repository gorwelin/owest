import React, { useState, useEffect } from 'react';

import { Direction } from './direction';
import '../window.scss'

const Resizer = ({onResize}) => {
    const [direction, setDirection] = useState('');
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!direction) return;
    
            onResize(direction, e.movementX, e.movementY);
        }

        if(mouseDown) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [mouseDown, direction, onResize]);

    useEffect(() => {
        const handleMouseUp = () => setMouseDown(false);

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, []);

    const handleMouseDown = (direction) => () => {
        setDirection(direction);
        setMouseDown(true);
    }


    return (
      <>
      
      <div className="window-border-top-left" onMouseDown={handleMouseDown(Direction.TopLeft)}></div>
                <div className="window-border-top" onMouseDown={handleMouseDown(Direction.Top)}></div>
                <div className="window-border-top-right" onMouseDown={handleMouseDown(Direction.TopRight)}></div>
                <div className="window-border-right" onMouseDown={handleMouseDown(Direction.Right)}></div>
                <div className="window-border-bottom-right" onMouseDown={handleMouseDown(Direction.BottomRight)}></div>
                <div className="window-border-bottom" onMouseDown={handleMouseDown(Direction.Bottom)}></div>
                <div className="window-border-bottom-left" onMouseDown={handleMouseDown(Direction.BottomLeft)}></div>
                <div className="window-border-left" onMouseDown={handleMouseDown(Direction.Left)}></div>
      </>
    )
  }
  export default Resizer