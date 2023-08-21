import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../api/configApi.js';
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import Swal from "sweetalert2"; 


const AddHardware = () => {
  const navigate = useNavigate();

  const [hardware, setHardware] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

const handleSubmit = async(e) => {
  e.preventDefault();

    const hardwareData = {
        hardware: hardware,
        location: location,
        timezone: timezone,
        local_time: localTime,
        latitude: latitude,
        longitude: longitude
    }
            try {
                await api
                .post(`/hardware`, hardwareData)
                .then((response) => {
                    console.log(response);
                    Swal.fire({  
                        title: 'Success', 
                        icon: 'success',  
                        text: 'New Hardware has been saved.',  
                    }); 
                    navigate('/hardware');
                });
                
            } catch (error) {
                if (error.response) {
                    console.log(error.response);
                    console.log("server responded");
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            }
    };

  return (
    <Box m="20px">
    <div style={{ bottom:0, left:0, top:0, right:0, zIndex: 0, overflow: 'hidden'}}>
      <Header title="CREATE HARDWARE" subtitle="Create a New Hardware" />
          <form className="container" onSubmit={handleSubmit}>
              <div className="text-light">
                  <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Hardware <span className="errmsg">*</span></label>
                                  <input value={hardware} onChange={e => setHardware(e.target.value)} className="form-control" required></input>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Location <span className="errmsg">*</span></label>
                                  <input value={location} onChange={e => setLocation(e.target.value)} className="form-control" required></input>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Time Zone <span className="errmsg">*</span></label>
                                  <input type="number" value={timezone} onChange={e => setTimezone(e.target.value)} className="form-control" required></input>
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Local Time <span className="errmsg">*</span></label>
                                  <input type="datetime-local" value={localTime} onChange={e => setLocalTime(e.target.value)} className="form-control" required></input>
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Latitude <span className="errmsg">*</span></label>
                                  <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} step="any" min="-90" max="90" className="form-control" required></input>
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Longitude <span className="errmsg">*</span></label>
                                  <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} step="any" min="-180" max="180" className="form-control" required></input>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="card-footer">
                      <button type="submit" className="btn btn-success">Save</button> &nbsp; &nbsp;
                      <Link to={'/hardware'} className="btn btn-warning">Back</Link>
                  </div>
              </div>
          </form>
    </div>
    </Box>
  );
};

export default AddHardware;
