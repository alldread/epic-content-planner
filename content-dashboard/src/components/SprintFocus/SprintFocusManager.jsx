import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../UI/Modal';
import './SprintFocusManager.css';

const SprintFocusManager = () => {
  const { getSprintFocuses, addSprintFocus, updateSprintFocus, deleteSprintFocus } = useData();
  const [editingFocus, setEditingFocus] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const focuses = getSprintFocuses();

  const FocusForm = ({ focus, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: focus?.name || '',
      description: focus?.description || '',
      color: focus?.color || 'oklch(0.75 0.15 200)',
      products: focus?.products?.join(', ') || '',
      active: focus?.active !== undefined ? focus.active : true
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const focusData = {
        ...formData,
        products: formData.products
          .split(',')
          .map(p => p.trim())
          .filter(Boolean)
      };

      if (focus?.id) {
        updateSprintFocus(focus.id, focusData);
      } else {
        addSprintFocus(focusData);
      }
      onSave();
    };

    return (
      <form onSubmit={handleSubmit} className="focus-form">
        <div className="form-field">
          <label>
            <span>Name *</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Epic Network Launch"
            />
          </label>
        </div>

        <div className="form-field">
          <label>
            <span>Description</span>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the focus"
            />
          </label>
        </div>

        <div className="form-field">
          <label>
            <span>Color</span>
            <div className="color-picker">
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="oklch(0.75 0.15 200)"
              />
              <div
                className="color-preview"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </label>
        </div>

        <div className="form-field">
          <label>
            <span>Products/Services (comma-separated)</span>
            <textarea
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              placeholder="Product 1, Product 2, Service 1..."
              rows="3"
            />
          </label>
        </div>

        <div className="form-field">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
            <span>Active (available for selection)</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary">
            {focus?.id ? 'Update' : 'Add'} Focus
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const handleDelete = (focusId) => {
    if (window.confirm('Are you sure you want to delete this sprint focus?')) {
      deleteSprintFocus(focusId);
    }
  };

  return (
    <div className="sprint-focus-manager">
      <div className="manager-header">
        <h2>Sprint Focus Management</h2>
        <p className="text-muted">
          Manage your sprint focuses to organize your 2-week content blocks around specific products, services, or campaigns.
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="primary add-focus-btn"
        >
          + Add Sprint Focus
        </button>
      </div>

      <div className="focuses-grid">
        {focuses.map((focus) => (
          <div
            key={focus.id}
            className={`focus-card card shadow-m ${!focus.active ? 'inactive' : ''}`}
            style={{
              borderTop: `4px solid ${focus.color}`
            }}
          >
            <div className="focus-card-header">
              <h3>{focus.name}</h3>
              {!focus.active && (
                <span className="inactive-badge tiny">Inactive</span>
              )}
            </div>

            {focus.description && (
              <p className="focus-description text-muted small">
                {focus.description}
              </p>
            )}

            {focus.products && focus.products.length > 0 && (
              <div className="focus-products">
                <h4 className="tiny text-dim">Products/Services:</h4>
                <div className="product-list">
                  {focus.products.map((product, idx) => (
                    <span key={idx} className="product-chip">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="focus-actions">
              <button
                onClick={() => setEditingFocus(focus)}
                className="edit-btn"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(focus.id)}
                className="delete-btn danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Add Sprint Focus"
          size="medium"
        >
          <FocusForm
            onSave={() => setShowAddModal(false)}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {editingFocus && (
        <Modal
          isOpen={true}
          onClose={() => setEditingFocus(null)}
          title="Edit Sprint Focus"
          size="medium"
        >
          <FocusForm
            focus={editingFocus}
            onSave={() => setEditingFocus(null)}
            onCancel={() => setEditingFocus(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default SprintFocusManager;