import { axiosinstance } from './axiosinstance';
import { isMobile } from 'react-device-detect';

export const CreateAdminLogs = async ({ Id, status }) => {
  try {
    const res = await axiosinstance.post('/adminlogs/create', {
      userId: Id,
      device: isMobile ? 'Mobile' : 'Laptop',
      status,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
