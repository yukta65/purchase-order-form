import React from "react";

export default function TalentRow({
  talent,
  selected,
  onToggle,
  onChange,
  poType,
  errors = {},
}) {
  const rateError = errors?.[`rate_${talent.id}`];

  return (
    <div className="talent-box d-flex align-items-start">
      <div style={{ width: 40, marginTop: 6 }}>
        <input
          type="checkbox"
          checked={!!selected}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div className="talent-name">
          {talent.name}{" "}
          <small className="text-muted">
            ({talent.role || talent.email || "—"})
          </small>
        </div>

        {selected && (
          <div className="row g-2 mt-2">
            <div className="col-md-3">
              <label className="po-label small">Assigned Rate *</label>
              <input
                type="number"
                className={
                  "form-control form-control-sm po-input " +
                  (rateError ? "is-invalid" : "")
                }
                value={talent.assignedRate || ""}
                onChange={(e) => onChange({ assignedRate: e.target.value })}
              />
              {rateError && (
                <div className="text-danger small mt-1">{rateError}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="po-label small">Notes</label>
              <input
                className="form-control form-control-sm po-input"
                value={talent.notes || ""}
                onChange={(e) => onChange({ notes: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <label className="po-label small">
                Contract Duration (Months)
              </label>
              <input
                type="number"
                className="form-control form-control-sm po-input"
                value={talent.contractDuration || ""}
                onChange={(e) => onChange({ contractDuration: e.target.value })}
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
