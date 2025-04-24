const DeleteZonePopup = ({
  selectedZoneRef,
  selectedPresetMarker,
  drawnItems,
  setSelectedZoneName,
  setShowDeletePopup,
}) => {
  const handleDelete = () => {
    // Remove the zone layer and the marker
    drawnItems.removeLayer(selectedZoneRef.current);
    selectedPresetMarker?.remove(); // Remove the marker if it's present

    // Reset the selected zone and hide the delete popup
    setSelectedZoneName(null);
    setShowDeletePopup(false);
    selectedZoneRef.current = null;
  };

  return (
    <div className="mt-4 flex flex-col gap-2  pt-2">
      {setShowDeletePopup && (
        <div className="bg-white  rounded shadow p-3">
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!setShowDeletePopup && (
        <button
          onClick={() => setShowDeletePopup(true)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete Zone
        </button>
      )}
    </div>
  );
};

export default DeleteZonePopup;
