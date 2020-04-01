import { useContext, useState } from 'react';
import { AppContext } from '../Components/AppContext/AppContextProvider';
import { AuthenticationContext } from '../Components/Authentication/AuthenticationContextProvider';
import { UploadedFile } from './Interfaces/UploadedFile';

export const useUploadFile = () => {
  const { token } = useContext(AuthenticationContext);
  const { filesEndpoint } = useContext(AppContext);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);

    const response = await fetch(filesEndpoint!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const uploadFile = await response.json();
    setFiles([...files, uploadFile]);
  };

  return { uploadFile, files };
};
