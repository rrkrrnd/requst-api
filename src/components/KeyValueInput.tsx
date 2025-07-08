import React from 'react';
import { HeaderItem, QueryParamsItem } from '../types';

interface KeyValueInputProps {
  items: (HeaderItem | QueryParamsItem)[];
  setItems: (items: (HeaderItem | QueryParamsItem)[]) => void;
  onUpdate?: (items: (HeaderItem | QueryParamsItem)[]) => void;
}

const KeyValueInput = React.memo(({ items, setItems, onUpdate }: KeyValueInputProps) => {
  const handleItemChange = (index: number, field: keyof (HeaderItem | QueryParamsItem), value: string | boolean) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value; // Type assertion for simplicity
    setItems(newItems);
    if (onUpdate) onUpdate(newItems);
  };

  const addItem = () => setItems([...items, { key: '', value: '', enabled: true }]);
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    if (onUpdate) onUpdate(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="input-group mb-2">
          <div className="input-group-text">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleItemChange(index, 'enabled', e.target.checked)}
            />
          </div>
          <input type="text" className="form-control" placeholder="Key" value={item.key} onChange={(e) => handleItemChange(index, 'key', e.target.value)} />
          <input type="text" className="form-control" placeholder="Value" value={item.value} onChange={(e) => handleItemChange(index, 'value', e.target.value)} />
          <button className="btn btn-outline-danger" onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
      <button className="btn btn-outline-primary" onClick={addItem}>Add Item</button>
    </div>
  );
});

export default KeyValueInput;
