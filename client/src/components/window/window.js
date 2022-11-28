import React, {useRef, useState} from "react";
import Draggable from 'react-draggable'; // Both at the same time
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMinus } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faWindowRestore } from "@fortawesome/free-regular-svg-icons";


import "./window.scss"
import Resizer from "./resizer/resizer";
import { Direction } from "./resizer/direction";

const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const leftOffset = (w) => (windowWidth - w) * 0.25;
const topOffset = (h) => (windowHeight - h) * 0.5;
const defaultHeight = '450px';
const defaultWidth = "550px";

const Window = React.forwardRef(

  (props, ref) => {
    const programRef = useRef(null);
    const initWindowHeight = props.defaultHeight || defaultHeight;
    const initWindowWidth = props.defaultWidth || defaultWidth;
    const [dimensions, updateDimensions] = useState({
      delta: {
        x: leftOffset(initWindowWidth),
        y: topOffset(initWindowHeight),
        reset: false,
      },
      defaultStyle: { height: initWindowHeight, width: initWindowWidth },
      style: { height: initWindowHeight, width: initWindowWidth },
      isMaximised: false,
    });
    const handleDrag = (e, ui) => {
      const { x, y } = dimensions.delta;
      if (!dimensions.isMaximised)
        updateDimensions({ ...dimensions, delta: { x: x + ui.deltaX, y: y + ui.deltaY } });
    };
    const maximise = () => {
      console.log("maximise")
      updateDimensions({
        ...dimensions,
        style: { top: '0', bottom: '45px', left: '0', right: '0' },
        delta: { ...dimensions.delta, reset: true },
        isMaximised: true,
      });
    };
    const restore = () => {
      console.log("restore")
      updateDimensions({
        ...dimensions,
        style: { ...dimensions.defaultStyle },
        delta: { ...dimensions.delta, reset: false },
        isMaximised: false,
      });
    };
   const onResize = (event, {element, size, handle}) => {
      updateDimensions({
        ...dimensions,
        style: {width: size.width, height: size.height}
      })
    };
    const headerNavClick = event => {
      if(event.detail === 2) {
        dimensions.isMaximised ? restore() : maximise();      
      }
    }
    const handleResize = (direction, movementX, movementY) => {
      const window = programRef.current;
      if (!window) return;

      const {width, height, x, y} = window.getBoundingClientRect();

      const resizeTop = () => {
        window.style.height = `${height - movementY}px`;
        window.style.top = `${y + movementY}px`;
      }

      const resizeRight = () => {
        window.style.width = `${width + movementX}px`;
      }

      const resizeBottom = () => {
        window.style.height = `${height + movementY}px`;
      }

      const resizeLeft = () => {
        window.style.width = `${width - movementX}px`;
        window.style.left = `${x + movementX}px`;
      }

      switch(direction) {
        case Direction.TopLeft:
          resizeTop();
          resizeLeft();
          break;
        
        case Direction.Top:
          resizeTop();
          break;
        
        case Direction.TopRight:
          resizeTop();
          resizeRight();
          break;
        
        case Direction.Right:
          resizeRight();
          break;

        case Direction.BottomRight:
          resizeBottom();
          resizeRight();
          break;
        
        case Direction.Bottom:
          resizeBottom();
          break;

        case Direction.BottomLeft:
          resizeBottom();
          resizeLeft();
          break;

        case Direction.Left:
          resizeLeft();
          break;

        default:
          break;
      }
    }


 
    return (
      
      <Draggable 
        handle=".window-header-text"
        onDrag={handleDrag}
        bounds="parent"
        position={dimensions.delta.reset ? { x: 0, y: 0 } : null}
        disabled={dimensions.isMaximised ? true : false}
      >
        
          <section 
            className={"window " + props.theme}
            id={props.id} key={props.id} 
            style={{
              ...dimensions.style,
              zIndex: props.zIndex,
              borderRadius: dimensions.isMaximised ? '0px' : '10px',
            }}
            ref={programRef}
          >
              <div className="window-header" onClick={headerNavClick}>
                  <span className="window-header-text">{props.windowTitle}</span>
                  <aside className="window-header-nav">
                      <span className="window-header-nav-button window-header-nav-minimise" onClick={props.onMinimise}><FontAwesomeIcon icon={faMinus} /></span>
                      <span className="window-header-nav-button window-header-nav-maximise" onClick={dimensions.isMaximised ? restore : maximise}><FontAwesomeIcon  icon={dimensions.isMaximised ? faWindowRestore : faSquare} /></span>
                      <span className="window-header-nav-button window-header-nav-close"         style={{
                        borderRadius: dimensions.isMaximised ? '0px' : '0 10px 0 0' 
                      }}
                      onClick={props.onClose}><FontAwesomeIcon  icon={faXmark} /></span>
                  </aside>
              </div>
              <div className="window-body" 
                onClick={props.onClickWindow}>
                {props.children}
              </div>

              <Resizer onResize={handleResize} />
          </section>
          
      </Draggable>
)
  }
)

export default Window



