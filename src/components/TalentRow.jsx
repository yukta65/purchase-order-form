import React from "react";

function TalentRow({
  talent,
  selected,
  onToggle,
  onChange,
  isViewMode,
  errors,
}) {
  return (
    <div className="border rounded p-2 mb-2 bg-white">
      <div className="d-flex align-items-center gap-3">
        {/* CHECKBOX */}
        <input
          type="checkbox"
          checked={selected}
          disabled={isViewMode}
          onChange={(e) => onToggle(e.target.checked)}
          style={{ transform: "scale(1.3)" }}
        />

        <div style={{ flex: 1 }}>
          <strong>{talent.name}</strong>{" "}
          <small className="text-muted">({talent.email})</small>
          {/* SHOW FIELDS ONLY IF SELECTED */}
          {selected && (
            <div className="row g-2 mt-2">
              {/* RATE */}
              <div className="col-md-4">
                <label className="form-label small">Assigned Rate *</label>
                <input
                  className={
                    "form-control form-control-sm " +
                    (errors[`rate_${talent.id}`] ? "is-invalid" : "")
                  }
                  readOnly={isViewMode}
                  value={talent.assignedRate}
                  onChange={(e) => onChange({ assignedRate: e.target.value })}
                  placeholder="Enter rate"
                />
                {errors[`rate_${talent.id}`] && (
                  <div className="invalid-feedback">
                    {errors[`rate_${talent.id}`]}
                  </div>
                )}
              </div>

              {/* NOTES */}
              <div className="col-md-4">
                <label className="form-label small">Notes</label>
                <input
                  className="form-control form-control-sm"
                  readOnly={isViewMode}
                  value={talent.notes}
                  onChange={(e) => onChange({ notes: e.target.value })}
                  placeholder="Optional notes"
                />
              </div>
            </div>
          )}
        </div>

        <small className="text-muted">ID: {talent.id}</small>
      </div>
    </div>
  );
}

export default TalentRow;
