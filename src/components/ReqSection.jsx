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
  // local state mirrors the section prop, but we will NOT call onUpdate in a broad useEffect
  const [local, setLocal] = useState(
    section || { reqId: "", reqTitle: "", talents: [] }
  );

  // keep local in sync when parent intentionally replaces the section object (e.g., remount)
  useEffect(() => {
    setLocal(section || { reqId: "", reqTitle: "", talents: [] });
  }, [section]);

  const reqOptions = client?.reqs || [];

  // Called when user selects a job title (explicit user action)
  function handleReqChange(e) {
    if (isViewMode) return;
    const value = e.target.value;
    // compare as string to avoid type mismatch
    const found = reqOptions.find((r) => String(r.id) === String(value));

    if (!found) {
      const updated = { ...local, reqId: "", reqTitle: "", talents: [] };
      setLocal(updated);
      onUpdate(updated); // explicit update
      return;
    }

    const newTalents = (found.talents || []).map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role || "",
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
    onUpdate(updated); // explicit update
  }

  // Toggle talent selection; updates local and notifies parent explicitly
  function toggleTalent(id, selected) {
    if (isViewMode) return;

    setLocal((prev) => {
      let updated = prev.talents.map((t) =>
        t.id === id ? { ...t, selected } : t
      );

      if (poType === "Individual" && selected) {
        // ensure only this one is selected
        updated = updated.map((t) =>
          t.id === id ? { ...t, selected: true } : { ...t, selected: false }
        );
      }

      const newLocal = { ...prev, talents: updated };
      onUpdate(newLocal); // explicit update
      return newLocal;
    });
  }

  // Update specific talent fields and notify parent explicitly
  function updateTalent(id, updates) {
    if (isViewMode) return;

    setLocal((prev) => {
      const updatedTalents = prev.talents.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      const newLocal = { ...prev, talents: updatedTalents };
      onUpdate(newLocal); // explicit update
      return newLocal;
    });
  }

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="d-flex justify-content-between">
        <h6>
          REQ #{index + 1} {local.reqTitle ? `– ${local.reqTitle}` : ""}
        </h6>

        {!isViewMode && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove()}
          >
            Remove
          </button>
        )}
      </div>

      <div className="row g-2 mt-2">
        <div className="col-md-6">
          <label className="form-label">Job Title / REQ Name *</label>
          {isViewMode ? (
            <input
              className="form-control"
              readOnly
              value={local.reqTitle || ""}
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
          <input className="form-control" readOnly value={local.reqId || ""} />
        </div>
      </div>

      <div className="mt-3">
        <h6>Talents</h6>

        {isViewMode ? (
          // View-mode: show selected talents in a neat table (only selected ones)
          local.talents &&
          local.talents.filter((t) => t.selected).length > 0 ? (
            <table className="table table-sm table-bordered mt-2">
              <thead className="table-secondary">
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Assigned Rate</th>
                </tr>
              </thead>
              <tbody>
                {local.talents
                  .filter((t) => t.selected)
                  .map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.role || "-"}</td>
                      <td>{t.assignedRate || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-muted small">No talents selected.</div>
          )
        ) : (
          <>
            {(!local.talents || local.talents.length === 0) && (
              <div className="text-muted small">
                Select a Job Title to load talents.
              </div>
            )}

            {local.talents &&
              local.talents.map((t) => (
                <TalentRow
                  key={t.id}
                  talent={t}
                  selected={!!t.selected}
                  poType={poType}
                  errors={errors || {}}
                  onToggle={(sel) => toggleTalent(t.id, sel)}
                  onChange={(upd) => updateTalent(t.id, upd)}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ReqSection;
