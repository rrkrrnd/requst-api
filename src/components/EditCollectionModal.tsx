import React, { useState, useEffect } from 'react';
import { CollectionItem } from '../types';

interface EditCollectionModalProps {
  show: boolean;
  onClose: () => void;
  collection: CollectionItem | null;
  groups: CollectionItem[];
  onSave: (id: number, name: string, url: string, parentId: number | null) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({ show, onClose, collection, groups, onSave }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setUrl(collection.url || '');
      setSelectedGroup(collection.parentId || null);
    }
  }, [collection]);

  if (!show) {
    return null;
  }

  const handleSave = () => {
    if (collection && collection.id !== undefined) {
      onSave(collection.id, name, url, selectedGroup);
      onClose();
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{collection?.type === 'group' ? 'Edit Group' : 'Edit Collection'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="collectionName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="collectionName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {collection?.type !== 'group' && (
              <div className="mb-3">
                <label htmlFor="collectionUrl" className="form-label">URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="collectionUrl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}
            {collection?.type !== 'group' && (
              <div className="mb-3">
                <label htmlFor="collectionGroup" className="form-label">Group</label>
                <select
                  className="form-select"
                  id="collectionGroup"
                  value={selectedGroup === null ? 'unassigned' : selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value === 'unassigned' ? null : Number(e.target.value))}
                >
                  <option value="unassigned">Unassigned</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;
