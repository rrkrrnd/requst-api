import React, { useState, useEffect } from 'react';

interface NewGroupModalProps {
  show: boolean;
  onClose: () => void;
  onCreateGroup: (name: string) => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({
  show,
  onClose,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (!show) {
      setGroupName(''); // Reset input when modal closes
    }
  }, [show]);

  const handleCreate = () => {
    if (groupName.trim()) {
      onCreateGroup(groupName.trim());
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Group</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="groupNameInput" className="form-label">Group Name</label>
              <input
                type="text"
                className="form-control"
                id="groupNameInput"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;