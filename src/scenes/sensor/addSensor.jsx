import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from '../../api/configApi.js';
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import Swal from "sweetalert2"; 


const AddSensor = () => {
  const navigate = useNavigate();

  const [sensor, setSensor] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [unit, setUnit] = useState('');

const handleSubmit = async(e) => {
  e.preventDefault();

    const sensorData = {
        sensor: sensor,
        sensor_name: sensorName,
        unit: unit
    }
            try {
                await api
                .post(`/master-sensors`, sensorData)
                .then((response) => {
                    console.log(response);
                    Swal.fire({  
                        title: 'Success', 
                        icon: 'success',  
                        text: 'New Sensor has been saved.',  
                    }); 
                    navigate('/sensors');
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
      <Header title="CREATE SENSOR" subtitle="Create a New Sensor" />
          <form className="container" onSubmit={handleSubmit}>
              <div className="text-light">
                  <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Sensor <span className="errmsg">*</span></label>
                                  <input value={sensor} onChange={e => setSensor(e.target.value)} className="form-control"></input>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Sensor Name <span className="errmsg">*</span></label>
                                  <input value={sensorName} onChange={e => setSensorName(e.target.value)} className="form-control"></input>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Unit <span className="errmsg">*</span></label>
                                  <input value={unit} onChange={e => setUnit(e.target.value)} className="form-control"></input>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="card-footer">
                      <button type="submit" className="btn btn-success">Save</button> &nbsp; &nbsp;
                      <Link to={'/sensors'} className="btn btn-warning">Back</Link>
                  </div>
              </div>
          </form>
    </div>
    </Box>
  );
};

export default AddSensor;
