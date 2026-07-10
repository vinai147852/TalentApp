import socket from '../socket';
import { axiosinstance } from './axiosinstance';

export const CreateNotification = async (Value) => {
  try {
    const res = await axiosinstance.post('/notification/create', {
      data: Value?.data && Value.data,
      link: Value?.link && Value.link,
      recieverId: Value?.recieverId && Value.recieverId,
      forAll: Value?.forAll && Value.forAll,
      to: Value?.to && Value.to,
      forAdmins: Value?.forAdmins && Value.forAdmins,
    });

    socket.emit('SendNotification', res.data);
  } catch (error) {
    console.log(error);
  }
};
