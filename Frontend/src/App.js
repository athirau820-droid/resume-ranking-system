import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import JobList from "./Component/JobList";
import Admin from "./RecruitmentDashboard/Admin";

export class App extends Component {
  render() {
    return (
      <div>

        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </div>
    );
  }
}

export default App;