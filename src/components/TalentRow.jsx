import React from "react";

function TalentRow({ talent, selected, onToggle, onChange, poType, errors }) {
  const rateError = errors?.[`rate_${talent.id}`];

  return (
    <div className="border rounded p-2 mb-2 bg-white">
      <div className="d-flex align-items-center gap-3">
        {/* SELECT CHECKBOX */}
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onToggle(e.target.checked)}
        />

        {/* TALENT INFO */}
        <div className="flex-grow-1">
          <strong>{talent.name}</strong>
          <div className="text-muted small">{talent.role}</div>
        </div>

        {/* ASSIGNED RATE FIELD */}
        {selected && (
          <div className="col-md-3">
            <label className="form-label small">Assigned Rate *</label>
            <input
              type="number"
              className={
                "form-control " + (rateError ? "is-invalid border-danger" : "")
              }
              value={talent.assignedRate || ""}
              onChange={(e) =>
                onChange({
                  assignedRate: e.target.value,
                })
              }
            />
            {rateError && <div className="text-danger small">{rateError}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentRow;
