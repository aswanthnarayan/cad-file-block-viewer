import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

const BlockDetailModal = ({ open, onClose, block }) => (
  <Dialog open={open} handler={onClose} size="md">
    <DialogHeader>Block Details</DialogHeader>
    <DialogBody>
      {block ? (
        <div className="space-y-2 text-base">
          <div><strong>ID:</strong> {block.id}</div>
          <div><strong>File ID:</strong> {block.file_id ?? '-'}</div>
          <div><strong>Name:</strong> {block.name}</div>
          <div><strong>Type:</strong> <span className="capitalize">{block.type}</span></div>
          <div>
            <strong>Coordinates:</strong> {block.coordinates ? (
              <span>
                x: {block.coordinates.x ?? 0}, y: {block.coordinates.y ?? 0}, z: {block.coordinates.z ?? 0}
              </span>
            ) : "N/A"}
          </div>
          <div><strong>Created At:</strong> {formatDate(block.created_at || block.createdAt)}</div>
          <div><strong>Updated At:</strong> {formatDate(block.updatedAt)}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </DialogBody>
    <DialogFooter>
      <Button color="red" onClick={onClose}>Close</Button>
    </DialogFooter>
  </Dialog>
);

export default BlockDetailModal;