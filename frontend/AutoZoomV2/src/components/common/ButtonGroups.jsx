import { ButtonGroup, Button, Tooltip } from "@chakra-ui/react";
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";

// A mixed button group component for Fetch, Download All, Delete All, and row-specific Download and Delete actions
function ButtonGroups({
  onFetch,
  onDownloadAll,
  onDeleteAll,
  onDownload,
  onDelete,
  searchPerformed,
  downloadsInitiated,
  areRecordingsAvailable,
  isRowSpecific,
  recording,
}) {
  // For table actions
  if (isRowSpecific) {
    return (
      <ButtonGroup>
        <Tooltip label="Download" placement="top">
          <Button
            onClick={() => onDownload(recording)}
            colorScheme="teal"
            size="sm"
          >
            <DownloadIcon />
          </Button>
        </Tooltip>
        <Tooltip label="Delete" placement="top">
          <Button
            onClick={() => onDelete(recording)}
            colorScheme="red"
            size="sm"
          >
            <DeleteIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
    // For modal action buttons
  } else {
    return (
      <ButtonGroup my={2}>
        <Button onClick={onFetch}>Fetch Recordings</Button>
        {searchPerformed && (
          <>
            <Button
              onClick={onDownloadAll}
              colorScheme="teal"
              disabled={!areRecordingsAvailable}
            >
              Download All
            </Button>
            {downloadsInitiated && (
              <Button
                onClick={onDeleteAll}
                colorScheme="red"
                disabled={!areRecordingsAvailable}
              >
                Delete All
              </Button>
            )}
          </>
        )}
      </ButtonGroup>
    );
  }
}

export default ButtonGroups;
