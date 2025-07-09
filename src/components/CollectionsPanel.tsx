import React, { useState } from 'react';
import { CollectionItem } from '../types';
import NewGroupModal from './NewGroupModal';

interface CollectionsPanelProps {
  collections: CollectionItem[];
  filter: string;
  setFilter: (filter: string) => void;
  editingCollectionId: number | null;
  editingCollectionName: string;
  setEditingCollectionName: (name: string) => void;
  saveCollectionName: (id: number) => void;
  cancelEditingCollectionName: () => void;
  loadRequest: (request: CollectionItem) => void;
  startEditingCollectionName: (item: CollectionItem) => void;
  deleteCollectionItem: (id: number) => void;
  getMethodColor: (method: string) => string;
  createCollectionGroup: (name: string) => void;
  saveCollectionsLayout: (newLayout: CollectionItem[]) => void;
}

const CollectionsPanel = ({
  collections,
  filter,
  setFilter,
  editingCollectionId,
  editingCollectionName,
  setEditingCollectionName,
  saveCollectionName,
  cancelEditingCollectionName,
  loadRequest,
  startEditingCollectionName,
  deleteCollectionItem,
  getMethodColor,
  createCollectionGroup,
  saveCollectionsLayout,
}: CollectionsPanelProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [draggedItem, setDraggedItem] = useState<CollectionItem | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  const handleNewGroup = () => {
    setShowNewGroupModal(true);
  };

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, item: CollectionItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropTarget: CollectionItem | null) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedItemSource: CollectionItem = JSON.parse(e.dataTransfer.getData('application/json'));

    if (!draggedItemSource || draggedItemSource.id === dropTarget?.id) {
        setDraggedItem(null);
        return;
    }

    if (draggedItemSource.type === 'group' && dropTarget) {
        let currentParentId = dropTarget.parentId;
        if (dropTarget.id === draggedItemSource.id) return;
        while (currentParentId) {
            if (currentParentId === draggedItemSource.id) {
                console.error("Cannot drop a group into its own descendant.");
                return;
            }
            currentParentId = collections.find(c => c.id === currentParentId)?.parentId;
        }
    }

    const newLayout = [...collections];
    const draggedIndex = newLayout.findIndex(i => i.id === draggedItemSource.id);
    if (draggedIndex === -1) return;

    const [itemToMove] = newLayout.splice(draggedIndex, 1);

    if (dropTarget && dropTarget.type === 'group') {
        itemToMove.parentId = dropTarget.id;
        const dropTargetIndex = newLayout.findIndex(i => i.id === dropTarget.id);
        newLayout.splice(dropTargetIndex + 1, 0, itemToMove);
    } else {
        itemToMove.parentId = dropTarget?.parentId ?? null;
        const dropIndex = dropTarget ? newLayout.findIndex(i => i.id === dropTarget.id) : newLayout.length;
        newLayout.splice(dropIndex, 0, itemToMove);
    }

    saveCollectionsLayout(newLayout);
    setDraggedItem(null);
  };

  const renderCollectionItem = (item: CollectionItem, depth: number) => {
    const isGroup = item.type === 'group';
    const isExpanded = isGroup && expandedGroups.has(item.id as number);
    const children = isGroup ? collections.filter(c => c.parentId === item.id) : [];

    return (
      <React.Fragment key={item.id}>
        <li
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          className={`list-group-item list-group-item-action ${draggedItem?.id === item.id ? 'dragging' : ''}`}
          style={{ paddingLeft: `${depth * 20 + 10}px`, cursor: 'grab' }}
        >
          {editingCollectionId === item.id ? (
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-sm me-2"
                value={editingCollectionName}
                onChange={(e) => setEditingCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCollectionName(item.id as number)}
                autoFocus
              />
              <button className="btn btn-sm btn-success py-0 px-1 me-1" onClick={() => saveCollectionName(item.id as number)}>Save</button>
              <button className="btn btn-sm btn-secondary py-0 px-1" onClick={cancelEditingCollectionName}>Cancel</button>
            </div>
          ) : (
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div className="flex-grow-1 d-flex align-items-center" onClick={() => isGroup ? toggleGroup(item.id as number) : loadRequest(item)} style={{ cursor: 'pointer' }}>
                {isGroup && (
                  <span className={`me-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} style={{display: 'inline-block'}}>▶</span>
                )}
                {!isGroup && <span className={`badge bg-${getMethodColor(item.method || '')} me-2`}>{item.method}</span>}
                <span>{item.name}</span>
                <button className="btn btn-link btn-sm p-0 ms-2" onClick={(e) => { e.stopPropagation(); startEditingCollectionName(item); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg>
                </button>
              </div>
              <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteCollectionItem(item.id as number); }}>X</button>
            </div>
          )}
        </li>
        {isExpanded && children.map(child => renderCollectionItem(child, depth + 1))}
      </React.Fragment>
    );
  };

  const topLevelItems = collections.filter(item => !item.parentId);

  return (
    <div className="tab-pane fade h-100" id="collections" role="tabpanel">
      <div className="p-2 d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Filter by name or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button className="btn btn-sm btn-outline-primary" onClick={handleNewGroup}>Group</button>
      </div>
      <ul className="list-group list-group-flush" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, null)}>
        {topLevelItems.map(item => renderCollectionItem(item, 0))}
      </ul>

      <NewGroupModal
        show={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
        onCreateGroup={createCollectionGroup}
      />
    </div>
  );
};

export default CollectionsPanel;
