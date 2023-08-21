import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import api from '../../api/configApi.js';
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import Swal from "sweetalert2"; 


const EditHardwareDetail = () => {
  const navigate = useNavigate();

  const {id} = useParams();
  const [hardware, setHardware] = useState('');
  const [sensor, setSensor] = useState('');

  const [hardwares, setHardwares] = useState([]);
  const [sensors, setSensors] = useState([]);

  useEffect(()=>{
    const getHardwareDetailById = async () => {
      const response = await api.get(`/hardware-details/${id}`);
      setHardware(response.data.hardware);
      setSensor(response.data.sensor);
    };

    getHardwareDetailById();
  }, [id]);

  useEffect(() => {
    const getHardwares = async () => {
        const responseHardwares = await api.get(`/hardware`);
        setHardwares(responseHardwares.data);
      }

    getHardwares();
  }, []);

  useEffect(() => {
    const getSensor = async () => {
        const responseSensors = await api.get(`/master-sensors`);
        setSensors(responseSensors.data);
      }

    getSensor();
  }, []);


const handleSubmit = async(e) => {
  e.preventDefault();

    const hardwareDetailData = {
        hardware: hardware,
        sensor: sensor
    }
            try {
                await api
                .put(`/hardware-details/${id}`, hardwareDetailData)
                .then((response) => {
                    console.log(response);
                    Swal.fire({  
                        title: 'Success',  
                        icon: 'success',  
                        text: 'Hardware Detail has been updated.',  
                    }); 
                    navigate('/hardwareDetail');
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
      <Header title="CREATE MEMBER" subtitle="Create a New Hardware Detail" />

          <form className="container" onSubmit={handleSubmit}>
              <div className="text-light">
                  <div className="card-body">

                      <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Hardware <span className="errmsg">*</span></label>
                                  <select value={hardware} onChange={e => setHardware(e.target.value)} className="form-control">
                                      <option disabled>Choose Hardware</option>
                                  {hardwares.map((hardware, index) => (
                                      <option key={hardware.hardware} value={hardware.hardware}>{hardware.hardware + ' - ' + hardware.location }</option>
                                  ))
                                  }
                                  </select>
                              </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 p-3">
                              <div className="form-group">
                                  <label>Sensor <span className="errmsg">*</span></label>
                                  <select value={sensor} onChange={e => setSensor(e.target.value)} className="form-control">
                                  <option disabled>Choose Sensor</option>
                                  {sensors.map((sensor, index) => (
                                      <option key={sensor.sensor} value={sensor.sensor}>{sensor.sensor + ' - ' + sensor.sensor_name}</option>
                                  ))
                                  }
                                  </select>
                              </div>
                          </div>
                      </div>

                  </div>
                  <div className="card-footer">
                      <button type="submit" className="btn btn-success">Save</button> &nbsp; &nbsp;
                      <Link to={'/hardwareDetail'} className="btn btn-warning">Back</Link>
                  </div>
              </div>
          </form>
 
   </div>
</Box>
  );
};

export default EditHardwareDetail;
