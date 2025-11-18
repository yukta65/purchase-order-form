import React from "react";

function TalentRow({ talent, selected, onToggle, onChange, poType }) {
  return (
    <div className="d-flex align-items-start gap-3">
      <div style={{ width: 28, marginTop: 6 }}>
        <input
          type="checkbox"
          checked={!!selected}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div>
          <strong>{talent.name}</strong>{" "}
          <small className="text-muted">({talent.email || "—"})</small>
        </div>

        {/* Show the editable fields only when selected (as required) */}
        {selected && (
          <div className="row g-2 mt-2">
            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="Assigned Rate (required)"
                value={talent.assignedRate || ""}
                onChange={(e) => onChange({ assignedRate: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="Notes (optional)"
                value={talent.notes || ""}
                onChange={(e) => onChange({ notes: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              {/* show poType to help tester understand behaviour */}
              <input
                className="form-control form-control-sm"
                value={poType || ""}
                readOnly
                title="PO Type"
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ width: 90, textAlign: "right", marginTop: 6 }}>
        <small className="text-muted">ID: {talent.id}</small>
      </div>
    </div>
  );
}

export default TalentRow;
