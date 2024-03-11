import { useState, useContext, createContext } from "react";

const ModalsContext = createContext();

export const ModalsProvider = ({ children }) => {
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isLiveUsersModalOpen, setIsLiveUsersModalOpen] = useState(false);

  const openLiveUsersModal = () => setIsLiveUsersModalOpen(true);
  const closeLiveUsersModal = () => setIsLiveUsersModalOpen(false);

  const openRecordingsModal = () => setIsRecordingsModalOpen(true);
  const closeRecordingsModal = () => setIsRecordingsModalOpen(false);
  return (
    <ModalsContext.Provider
      value={{
        openLiveUsersModal,
        closeLiveUsersModal,
        openRecordingsModal,
        closeRecordingsModal,
        isRecordingsModalOpen,
        isLiveUsersModalOpen,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export const useModalsContext = () => useContext(ModalsContext);
