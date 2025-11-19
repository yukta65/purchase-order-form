import React, { useEffect, useState } from "react";
import TalentRow from "./TalentRow";

function ReqSection({
  section,
  index,
  client,
  poType,
  onUpdate,
  onRemove,
  isViewMode,
  errors,
}) {
  const [local, setLocal] = useState(
    section || { reqId: "", reqTitle: "", talents: [] }
  );

  // Sync when parent section prop changes (e.g., remount or new data)
  useEffect(() => {
    setLocal(section || { reqId: "", reqTitle: "", talents: [] });
  }, [section]);

  const reqOptions = client?.reqs || [];

  // Called when user selects a job title
  function handleReqChange(e) {
    if (isViewMode) return;
    const value = e.target.value;
    // compare as string to avoid type mismatch
    const found = reqOptions.find((r) => String(r.id) === String(value));

    if (found) {
      const newTalents = (found.talents || []).map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        selected: false,
        assignedRate: t.assignedRate || "",
        notes: t.notes || "",
      }));

      const updated = {
        ...local,
        reqId: found.id,
        reqTitle: found.title,
        talents: newTalents,
      };
      setLocal(updated);
      // inform parent once (explicit), avoids useEffect loops
      onUpdate(updated);
    } else {
      const updated = { ...local, reqId: "", reqTitle: "", talents: [] };
      setLocal(updated);
      onUpdate(updated);
    }
  }

  // Toggle talent selection; updates local and notifies parent
  function toggleTalent(id, selected) {
    if (isViewMode) return;
    setLocal((prev) => {
      let updated = prev.talents.map((t) =>
        t.id === id ? { ...t, selected } : t
      );
      if (poType === "Individual" && selected) {
        // unselect others
        updated = updated.map((t) =>
          t.id === id ? { ...t, selected: true } : { ...t, selected: false }
        );
      }
      const newLocal = { ...prev, talents: updated };
      onUpdate(newLocal);
      return newLocal;
    });
  }

  // Update specific talent fields and notify parent
  function updateTalent(id, updates) {
    if (isViewMode) return;
    setLocal((prev) => {
      const updated = prev.talents.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      const newLocal = { ...prev, talents: updated };
      onUpdate(newLocal);
      return newLocal;
    });
  }

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">
          REQ #{index + 1}
          {local.reqTitle ? ` - ${local.reqTitle}` : ""}
        </h6>
        {!isViewMode && (
          <button className="btn btn-sm btn-danger" onClick={() => onRemove()}>
            Remove
          </button>
        )}
      </div>

      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Job Title / REQ Name *</label>
          {isViewMode ? (
            <input
              className="form-control"
              value={local.reqTitle || ""}
              readOnly
            />
          ) : (
            <select
              className={"form-select " + (errors?.req ? "is-invalid" : "")}
              value={local.reqId || ""}
              onChange={handleReqChange}
            >
              <option value="">Select job title</option>
              {reqOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          )}
          {errors?.req && (
            <div className="text-danger small mt-1">{errors.req}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">REQ ID</label>
          <input className="form-control" value={local.reqId || ""} readOnly />
        </div>
      </div>

      <div className="mt-3">
        <h6>Talents</h6>
        {(!local.talents || local.talents.length === 0) && (
          <div className="text-muted small">No talents for this REQ.</div>
        )}

        {local.talents &&
          local.talents.map((t) => (
            <TalentRow
              key={t.id}
              talent={t}
              selected={!!t.selected}
              isViewMode={isViewMode}
              errors={errors || {}}
              onToggle={(s) => toggleTalent(t.id, s)}
              onChange={(u) => updateTalent(t.id, u)}
            />
          ))}

        {errors?.talents && (
          <div className="text-danger small mt-2">{errors.talents}</div>
        )}
      </div>
    </div>
  );
}

export default ReqSection;
