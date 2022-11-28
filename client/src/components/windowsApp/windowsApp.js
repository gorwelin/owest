import React, {useRef, useState, useEffect} from "react";

import gsap from 'gsap';
import Tooltip from '@mui/material/Tooltip';
import $ from "jquery";

import "./windowsApp.scss";
import windows_11_start from "../../assets/images/windows_11_start2.png";
import about_intro_picture from "../../assets/images/owen_west_with_dog.jpg";
import person_programming from "../../assets/images/person-programming.mp4"

import Window from "../window/window";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faBatteryThreeQuarters, faVolumeHigh, faWifi, faArrowsRotate, faAngleUp, faMoon } from '@fortawesome/free-solid-svg-icons'
import {faSun} from '@fortawesome/free-regular-svg-icons';


 
const WindowsApp = (props) => {

  const ref = React.createRef();
  const [maxZIndex, updateMaxZIndex] = useState(10)
  const [windowsOpen, setWindowsOpen] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [windowsList, updateWindowsList] = useState([
    {
      isOpen: false,
      isMinimised: false,
      active: false,
      content: (<Window 
        ref={ref} 
        onClickWindow={() => onClickWin("window-home")} 
        onMinimise={() => minimiseWindow("window-home")}
        onClose={() => closeWindow("window-home")} 
        windowTitle={"A few more details.."}
        theme={darkMode ? "dark" : "light"}
        stylesheet={"../windowsApp/windowsStyles/home.scss"}
        id="window-home" key="window-home" className={"" + darkMode ? "dark" : "light"}>
          <div className="home-wrapper">
            <header className="home-header">
              <video className='home-intro-video' autoPlay loop muted>
                <source src={person_programming} type='video/mp4' />
              </video>
              <div className="home-name">
                <h1>Owen West t</h1>
                <span className="home-subtitle">Full-Stack Engineer</span>
              </div>
            </header>

            
            <h1>This is  Window 1</h1><p>test</p>
          </div>
      </Window>)
    },
    {
      isOpen: false,
      isMinimised: false,
      active: false,
      content: (<Window 
        ref={ref} 
        onClickWindow={() => onClickWin("window-about")} 
        onMinimise={() => minimiseWindow("window-about")}
        onClose={() => closeWindow("window-about")} 
        windowTitle={"A little about me..."}
        id="window-about" key="window-about" className={darkMode ? "dark" : "light"}>
          <div className="about-wrapper">
            <div className="about-intro">
              <img className="about-intro-image" src={about_intro_picture} alt="Owen West and his dog, Cooper" />
              <aside></aside>
            </div>
            <h1>This is  Window 1</h1><p>test</p>
          </div>
        </Window>)
    }
    

  ])
  
  let fullDate = new Date().toLocaleDateString("en-UK", {year: 'numeric', month: 'long', day: 'numeric'})
  let [date, updateDate] = useState(new Date().toLocaleDateString());
  let [time, updateTime] = useState(new Date().toLocaleTimeString().slice(0,-3));

  let timer = 0;
  let delay = 250;
  let prevent = false;
  
  useEffect(() => {
    setInterval(() => {
      updateDate(new Date().toLocaleDateString());
      updateTime(new Date().toLocaleTimeString().slice(0,-3));
    }, 15000);
  }, []); 

  const toggleTheme = () => {
    let darkmode = darkMode;


    let windoList = document.getElementsByClassName("window")

    /**
     * TODO: fix bug where it doesn't apply when apps to close
     */
    for (const windo of windoList) {
      if(darkMode) {
        windo.classList.remove("dark");
        windo.classList.remove("light");
        windo.classList.add("light");
      } else {
        windo.classList.remove("dark");
        windo.classList.remove("light");
        windo.classList.add("dark");
      }
    }

    
    setDarkMode(!darkMode)


  }

  const updateActiveWindow = (windowID) => {
    console.log("updateActiveWindow")
    let windows = [...windowsList];
    let windowIndex = windows?.findIndex(wind => wind.content.key === windowID);
    let windowNavButton = document.getElementById("windows-nav-button-" + windowID)

    console.log(windows[windowIndex])
    if(windows[windowIndex].isOpen) {
      windows[windowIndex].active = true;
      windowNavButton.classList.add("windows-nav-button-active") 
    } else {
      windows[windowIndex].active = false;
      windowNavButton.classList.remove("windows-nav-button-active") 
    }


    windows.forEach(windo => {
      
        if(windo.content.key !== windowID) {
          windo.active = false;
          document.getElementById("windows-nav-button-" + windo.content.key).classList.remove("windows-nav-button-active")
        }
    })

    updateWindowsList(windows)
  }

  const loadWindow = (window) => {
    let windows = [...windowsList];  
    
    let windowIndex = windows?.findIndex(wind => wind.content.key === window.content.key);
    windows[windowIndex].isOpen = true;          
    updateWindowsList(windows)
    setWindowsOpen([...windowsOpen, window?.content]);

    let windowOpenIndicator = document.getElementById("windows-nav-button-" + window.content.key).getElementsByClassName("windows-nav-button-isopen")[0]
    gsap.to(windowOpenIndicator, {width: 7.5})
    updateActiveWindow(window.content.key)
    
  }

  const prevPos = useRef();
  const minimiseWindow = (key) => {

    let windows = [...windowsList];  
    let windowElement = document.getElementById(key);
    let windowBounds = windowElement.getBoundingClientRect();

    let windowIndex = windows?.findIndex(wind => wind.content.key === key);
    if(windows[windowIndex].active) {
      if(!windows[windowIndex].isMinimised) {
        prevPos.current = windowBounds;
        gsap.to("#" + key, {x:"-50%", y:"150%", scale: 0})
        
      } else  {
        windowElement.style.transform = 0;
        gsap.to("#" + key, {x: prevPos.current.x - prevPos.current.x, y: prevPos.current.y - prevPos.current.y, scale: 1})
      }
    } else {
      updateActiveWindow(key);
    }

    windows[windowIndex].isMinimised = !(windows[windowIndex].isMinimised);
    updateWindowsList(windows)
  }

  const closeWindow = (key) => {
    console.log("closeWindow")
    console.table(windowsList)
    gsap.to("#" + key, {scale: 0.75, y: '20%', opacity: 0, duration: 0.2}).then( () => {
      let windows = [...windowsList];  
      let window = windows.find(wind => wind.content.key === key);
      let windowIndex = windows?.findIndex(wind => wind.content.key === key);
      
      windows[windowIndex].isOpen = false;    
      updateWindowsList(windows)
      

      let windowsOpenList = [...windowsOpen]
      windowsOpenList.splice(windowsOpenList.findIndex(windo => windo.key === key))

      setWindowsOpen(windowsOpenList)

      let windowOpenIndicator = document.getElementById("windows-nav-button-" + window.content.key).getElementsByClassName("windows-nav-button-isopen")[0]
      gsap.to(windowOpenIndicator, {width: 0})

      updateActiveWindow(key);
      console.log("after open")
    console.table(windowsList)
    })
  }

  const onClickWin = (windowID) => {
    if(windowsList.filter(window => window.isOpen).length > 0) {
      updateActiveWindow(windowID);
    } 
  }

  const clickWindowsNavIcon = (key) => {
    let window = windowsList.find(wind => wind.content.key === key);

    if(!window.isOpen) {
      loadWindow(window)
    } else {
      minimiseWindow(window.content.key)
    }
  }
  const handleClick = (key) => {
    timer = setTimeout(function() {
      if (!prevent) {
        document.getElementById("windows-shortcut-" + key).classList.toggle("active-shortcut")
      }
      prevent = false;
    }, delay);
  }
  const handleDoubleClick = (key) => {
    clearTimeout(timer);
    prevent = true;
    loadWindow(windowsList.find(window => window.content.key === key))
  }
  $(document).click(function() {
    var id = $(this).id;
    if (id !== 'active-shortcut') {
      $(".active-shortcut").removeClass("active-shortcut")
    }
  });
  /**
   * TODO: Add comments
   */
  useEffect(() => {
    windowsList.forEach(window => {
      let windowElement = document.getElementById(window.content.key)
      if(windowElement) {
        if(window.active) {
          windowElement.classList.add("window-active")
          windowElement.style.zIndex = maxZIndex;
          updateMaxZIndex(maxZIndex + 1)
        } else {
          windowElement.classList.remove("window-active")
        }
      }

    })

  }, [windowsList]) 

      return (
        <div className={"windows-wrapper " + (darkMode ? 'dark' : 'light')}>
          {windowsList.map((window) =>
            window.isOpen ? window.content : ""
          )}

          <div className="windows-shortcuts">
              <div className={"windows-shortcut " + (darkMode ? "dark" : "light")} id="windows-shortcut-window-home" windowindex={"window-home"} onClick={() => handleClick("window-home")} 
              onDoubleClick = {() => handleDoubleClick("window-home")}>
                <FontAwesomeIcon icon={faFile} testcase={"window-home"} className="windows-shortcut-icon"/>
                <span className="windows-shortcut-title">Home.exe</span>
              </div>
              <div className={"windows-shortcut " + (darkMode ? "dark" : "light")} id="windows-shortcut-window-about" windowindex={"window-about"}  onClick={() => handleClick("window-about")} 
              onDoubleClick = {() => handleDoubleClick("window-about")}>
                <FontAwesomeIcon icon={faFile} testcase={"window-about"} className="windows-shortcut-icon"/>
                <span className="windows-shortcut-title">About me.py</span>
              </div>
              <div className={"windows-shortcut " + (darkMode ? "dark" : "light")} id="windows-shortcut-window-about" windowindex={"window-about"}  onClick={() => handleClick("window-about")} 
              onDoubleClick = {() => handleDoubleClick("window-about")}>
                <FontAwesomeIcon icon={faFile} testcase={"window-about"} className="windows-shortcut-icon"/>
                <span className="windows-shortcut-title">Services.java</span>
              </div>
              <div className={"windows-shortcut " + (darkMode ? "dark" : "light")} id="windows-shortcut-window-about" windowindex={"window-about"}  onClick={() => handleClick("window-about")} 
              onDoubleClick = {() => handleDoubleClick("window-about")}>
                <FontAwesomeIcon icon={faFile} testcase={"window-about"} className="windows-shortcut-icon"/>
                <span className="windows-shortcut-title">Portfolio.cs</span>
              </div>
              <div className={"windows-shortcut " + (darkMode ? "dark" : "light")} id="windows-shortcut-window-about" windowindex={"window-about"}  onClick={() => handleClick("window-about")} 
              onDoubleClick = {() => handleDoubleClick("window-about")}>
                <FontAwesomeIcon icon={faFile} testcase={"window-about"} className="windows-shortcut-icon"/>
                <span className="windows-shortcut-title">Lets Talk</span>
              </div>
          </div>
       
        <div className={"windows-nav " + (darkMode ? "dark" : "light")}>
          <nav className="windows-nav-buttons">
            <Tooltip title="Not yet implemented" placement="top">
              <div className={"windows-nav-button " + (darkMode ? "dark" : "light")}>
                <img className="windows-nav-start" src={windows_11_start} alt="Windows Start Logo"/>
              </div>
            </Tooltip>

            <div className={"windows-nav-button " + (darkMode ? "dark" : "light")} id="windows-nav-button-window-home" onClick={() => clickWindowsNavIcon("window-home")}>
              <AccountCircleIcon className={"windows-nav-about-icon " + (darkMode ? "dark" : "light")}/>
              <span className={"windows-nav-button-isopen " + (darkMode ? "dark" : "light")}></span>
            </div>
            <div className={"windows-nav-button " + (darkMode ? "dark" : "light")} id="windows-nav-button-window-about" onClick={() => clickWindowsNavIcon("window-about")}>
              <AccountCircleIcon className={"windows-nav-about-icon " + (darkMode ? "dark" : "light")} />
              <span className={"windows-nav-button-isopen " + (darkMode ? "dark" : "light")}></span>
            </div>
          </nav>
          <div className={"windows-status " + (darkMode ? "dark" : "light")}>
            <Tooltip title="Not yet implemented" placement="top">
              <FontAwesomeIcon icon={faAngleUp} className={"windows-status-icontray-button " + (darkMode ? "dark" : "light")} />
            </Tooltip>
            <Tooltip title="Toggle between light and dark mode" placement="top">
              <FontAwesomeIcon icon={darkMode ? faMoon : faSun} className={"windows-status-icontray-button windows-status-icontray-darkmode " + (darkMode ? "dark" : "light")} onClick={() => toggleTheme()}/>
            </Tooltip>
            <Tooltip title="Get the latest features and security improvements with the newest Windows 11 update. (not really! this isn't actually Windows!)" placement="top">
              <FontAwesomeIcon icon={faArrowsRotate} className={"windows-status-update " + (darkMode ? "dark" : "light")} />
            </Tooltip>
            <Tooltip
              title={
                <React.Fragment>
                  {"English (United States)"}<br /> {'United Kingdom'}
                </React.Fragment>
            }>
              <span className={"windows-status-language " + (darkMode ? "dark" : "light")}>
                ENG <br />
                UK
              </span>
            </Tooltip>
              <div className={"windows-status-indicators " + (darkMode ? "dark" : "light")}>
                <Tooltip title={
                  <React.Fragment>
                    {'BT_N0T_R34L'}<br />{'Internet access'}
                  </React.Fragment>
                  } placement="top">
                  <FontAwesomeIcon icon={faWifi} />
                </Tooltip>
                <Tooltip title="Speakers (Intel® Smart Sound Technology for MIPI SoundWire® Audio): 87%" placement="top">
                  <FontAwesomeIcon icon={faVolumeHigh} />
                </Tooltip>
                <Tooltip title="Battery status: 56% remaining" placement="top">
                  <FontAwesomeIcon icon={faBatteryThreeQuarters} />
                </Tooltip>
              </div>
            <Tooltip 
              title={
                fullDate
              }
              placement="top">
              <div className={"windows-status-dates-notifs " + (darkMode ? "dark" : "light")}>
                <div className="windows-status-datetime">
                  <span>{time}</span>
                  <span>{date}</span>
                </div>
                <span className={"windows-status-notifications " + (darkMode ? "dark" : "light")}>0</span>
              </div>
            </Tooltip>



          </div>
          
          
        </div>
      </div>
      )

    


}

export default React.memo(WindowsApp);