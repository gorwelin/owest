import React from "react";
import {Helmet} from "react-helmet";
 
// We use Route in order to define the different routes of our application
import {BrowserRouter, Route, Routes } from "react-router-dom";
import "typeface-montserrat";
 
// We import all the components we need in our app
import Navbar from "./components/navbar/navbar";
import WindowsApp from "./components/windowsApp/windowsApp";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";

import "./App.scss"
 


const App = () => {
 return (
   <div>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Owen West - Full-Stack Web Developer</title>
        <link rel="icon" href="assets/images/windows_11_start2.png"></link>
    </Helmet>
     {/*<Navbar />*/}
     <BrowserRouter>
     <Routes>
       <Route exact path="/" element={<WindowsApp />} />
       <Route exact path="/record-list" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/create" element={<Create />} />
     </Routes>

     </BrowserRouter>


     <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
     <link href="https://fonts.googleapis.com/css?family=PT+Serif" rel="stylesheet"></link>
     
   </div>
 );
};
 
export default App;