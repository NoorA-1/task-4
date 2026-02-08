export default function UsersToolbar({
  disabled,
  onBlock,
  onUnblock,
  onDelete,
  onDeleteUnverified,
  selectedCount,
}) {
  return (
    <div className="d-flex align-items-center gap-2 mb-2">
      <button
        className="btn btn-outline-danger"
        disabled={disabled}
        onClick={onBlock}
      >
        Block
      </button>

      <button
        className="btn btn-outline-secondary"
        disabled={disabled}
        onClick={onUnblock}
        title="Unblock selected"
      >
        <i className="bi bi-unlock" />
      </button>

      <button
        className="btn btn-outline-secondary"
        disabled={disabled}
        onClick={onDelete}
        title="Delete selected"
      >
        <i className="bi bi-trash" />
      </button>

      <button
        className="btn btn-outline-secondary ms-2"
        onClick={onDeleteUnverified}
        title="Delete all unverified"
      >
        <i className="bi bi-person-x" />
      </button>

      <div className="ms-auto text-muted small">Selected: {selectedCount}</div>
    </div>
  );
}
