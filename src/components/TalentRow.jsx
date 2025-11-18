import React from "react";

function TalentRow({ talent, selected, onToggle, onChange, poType }) {
  return (
    <div className="d-flex align-items-center mb-2">
      <div style={{ width: 30 }}>
        <input
          type="checkbox"
          checked={!!selected}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div>
          <strong>{talent.name}</strong>{" "}
          <small className="text-muted">({talent.email})</small>
        </div>
        {selected && (
          <div className="row g-2 mt-2">
            <div className="col-6">
              <input
                className="form-control form-control-sm"
                placeholder="Assigned Rate (required)"
                value={talent.assignedRate || ""}
                onChange={(e) => onChange({ assignedRate: e.target.value })}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control form-control-sm"
                placeholder="Notes (optional)"
                value={talent.notes || ""}
                onChange={(e) => onChange({ notes: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ width: 110, textAlign: "right" }}>
        <small className="text-muted">ID: {talent.id}</small>
      </div>
    </div>
  );
}

export default TalentRow;
