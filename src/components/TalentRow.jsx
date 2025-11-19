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
      <div className="d-flex align-items-start gap-3">
        <input
          type="checkbox"
          checked={!!selected}
          disabled={isViewMode}
          onChange={(e) => onToggle(e.target.checked)}
          style={{ transform: "scale(1.2)", marginTop: 6 }}
        />

        <div style={{ flex: 1 }}>
          <div>
            <strong>{talent.name}</strong>{" "}
            <small className="text-muted">({talent.email || "—"})</small>
          </div>

          {selected && (
            <div className="row g-2 mt-2">
              <div className="col-md-4">
                <label className="form-label small">Assigned Rate *</label>
                <input
                  className={
                    "form-control form-control-sm " +
                    (errors[`rate_${talent.id}`] ? "is-invalid" : "")
                  }
                  value={talent.assignedRate || ""}
                  readOnly={isViewMode}
                  onChange={(e) => onChange({ assignedRate: e.target.value })}
                  placeholder="Assigned Rate"
                />
                {errors[`rate_${talent.id}`] && (
                  <div className="invalid-feedback">
                    {errors[`rate_${talent.id}`]}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label small">Notes</label>
                <input
                  className="form-control form-control-sm"
                  value={talent.notes || ""}
                  readOnly={isViewMode}
                  onChange={(e) => onChange({ notes: e.target.value })}
                  placeholder="Optional"
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
