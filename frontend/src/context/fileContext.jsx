import { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [fileId, setFileId] = useState(null);

  return (
    <FileContext.Provider value={{ fileId, setFileId }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);
