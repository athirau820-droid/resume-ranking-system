import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import JobList from "./Component/JobList";
import Admin from "./RecruitmentDashboard/Admin";
import AdminLogin from "./RecruitmentDashboard/AdminLogin";

export class App extends Component {
  render() {
    return (
      <div>

        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/admin" element={<Admin />} />
           <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>

      </div>
    );
  }
}

export default App;
