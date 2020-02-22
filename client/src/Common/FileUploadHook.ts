import { useContext } from 'react';
import { AppContext } from '../Components/AppContext/AppContextProvider';
import { AuthenticationContext } from '../Components/Authentication/AuthenticationContextProvider';

export const useUploadFile = () => {
  const { token } = useContext(AuthenticationContext);
  const { fileUploadUrl } = useContext(AppContext);

  const uploadFile = (file: File) => {
    const data = new FormData();
    data.append('file', file);

    fetch(fileUploadUrl!, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  };

  return { uploadFile };
};
