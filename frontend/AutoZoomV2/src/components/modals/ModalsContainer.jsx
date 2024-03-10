import React from "react";
import { useMeetingContext } from "../../contexts/MeetingContext";
import { useModalsContext } from "../../contexts/ModalsContext";
import DownloadRecordingsModal from "../DownloadRecordingsModal";
import UsersModal from "../UsersModal";

const ModalsContainer = () => {
  const {
    usersMap,
    displayErrorToast,
    displaySuccessToast,
    formatBytes,
    apiBaseUrl,
  } = useMeetingContext() || {};
  const {
    closeLiveUsersModal,
    isLiveUsersModalOpen,
    isRecordingsModalOpen,
    closeRecordingsModal,
  } = useModalsContext();
  return (
    <>
      {/* Users Occupation Box */}
      <UsersModal onClose={closeLiveUsersModal} isOpen={isLiveUsersModalOpen} />

      {/* Download & Delete Recordings Box */}
      <DownloadRecordingsModal
        isRecordingsModalOpen={isRecordingsModalOpen}
        closeRecordingsModal={closeRecordingsModal}
        usersMap={usersMap}
        displayErrorToast={displayErrorToast}
        displaySuccessToast={displaySuccessToast}
        formatBytes={formatBytes}
        apiBaseUrl={apiBaseUrl}
      />
    </>
  );
};

export default ModalsContainer;
