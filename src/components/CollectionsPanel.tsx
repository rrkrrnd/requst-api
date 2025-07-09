import React, { useState } from 'react';
import { CollectionItem } from '../types';
import NewGroupModal from './NewGroupModal';
import EditCollectionModal from './EditCollectionModal';

interface CollectionsPanelProps {
  collections: CollectionItem[];
  filter: string;
  setFilter: (filter: string) => void;
  loadRequest: (request: CollectionItem) => void;
  deleteCollectionItem: (id: number) => void;
  getMethodColor: (method: string) => string;
  createCollectionGroup: (name: string) => void;
  saveCollectionsLayout: (newLayout: CollectionItem[]) => void;
}

const CollectionsPanel = ({
  collections,
  filter,
  setFilter,
  loadRequest,
  deleteCollectionItem,
  getMethodColor,
  createCollectionGroup,
  saveCollectionsLayout,
}: CollectionsPanelProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [draggedItem, setDraggedItem] = useState<CollectionItem | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);

  // Expand all groups by default
  React.useEffect(() => {
    const initialExpandedGroups = new Set<number>();
    collections.forEach(item => {
      if (item.type === 'group' && item.id !== undefined) {
        initialExpandedGroups.add(item.id);
      }
    });
    setExpandedGroups(initialExpandedGroups);
  }, [collections]);

  const handleNewGroup = () => {
    setShowNewGroupModal(true);
  };

  const handleEditCollection = (item: CollectionItem) => {
    setEditingCollection(item);
    setShowEditModal(true);
  };

  const handleSaveEditedCollection = (id: number, name: string, url: string, parentId: number | null) => {
    const newLayout = collections.map(item => {
      if (item.id === id) {
        return { ...item, name, url, parentId };
      }
      return item;
    });
    saveCollectionsLayout(newLayout);
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
    const draggedItemSource: CollectionItem = {
        type: 'request', // Default to 'request' if not present
        ...JSON.parse(e.dataTransfer.getData('application/json'))
    };

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

    if (dropTarget && dropTarget.type === 'group' && draggedItemSource.type === 'request') {
        if (dropTarget.id !== undefined) {
            itemToMove.parentId = dropTarget.id;

            const currentChildrenInNewLayout = newLayout.filter(item => item.parentId === dropTarget.id);

            let insertionIndex;
            if (currentChildrenInNewLayout.length > 0) {
                const lastChild = currentChildrenInNewLayout[currentChildrenInNewLayout.length - 1];
                insertionIndex = newLayout.findIndex(item => item.id === lastChild.id) + 1;
            } else {
                insertionIndex = newLayout.findIndex(item => item.id === dropTarget.id) + 1;
            }
            newLayout.splice(insertionIndex, 0, itemToMove);
        } else {
            console.warn("Drop target group has no ID, cannot set parentId.");
            itemToMove.parentId = null;
        }
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
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div className="flex-grow-1 d-flex align-items-center" onClick={() => isGroup ? toggleGroup(item.id as number) : loadRequest(item)} style={{ cursor: 'pointer' }}>
              {isGroup && (
                <span className={`me-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} style={{display: 'inline-block'}}>▶</span>
              )}
              {!isGroup && <span className={`badge bg-${getMethodColor(item.method || '')} me-2`}>{item.method}</span>}
              <span>{item.name}</span>
            </div>
            <div className="d-flex align-items-center">
              <button className="btn btn-sm btn-outline-primary py-0 px-1 me-2" onClick={(e) => { e.stopPropagation(); handleEditCollection(item); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
              </button>
              <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={(e) => { e.stopPropagation(); deleteCollectionItem(item.id as number); }}>X</button>
            </div>
          </div>
        </li>
        {isExpanded && children.map(child => renderCollectionItem(child, depth + 1))}
      </React.Fragment>
    );
  };

  const topLevelItems = collections.filter(item => !item.parentId);
  const groups = collections.filter(item => item.type === 'group');

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

      <EditCollectionModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        collection={editingCollection}
        groups={groups}
        onSave={handleSaveEditedCollection}
      />
    </div>
  );
};

export default CollectionsPanel;
