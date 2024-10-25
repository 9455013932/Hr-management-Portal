import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import {machineId, machineIdSync} from 'node-machine-id';
const SystemInfo = () => {
  const [machineId, setMachineId] = useState(null);

  useEffect(() => {
    const fetchMachineId = async () => {
      try {
        const response = await axios.get('/api/v1/system-info');
        setMachineId(response.data.machineId);
      } catch (error) {
        console.error('Error fetching machine ID:', error);
      }
    };

    fetchMachineId();
  }, []);
  const userType=sessionStorage.getItem('userType')

  return (
    <div>
      <h1>System Info : {userType}</h1>
      <p>Machine ID: {machineId}</p>
    </div>
  );
};

export default SystemInfo;
