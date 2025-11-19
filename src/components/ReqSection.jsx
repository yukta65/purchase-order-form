import React, { useEffect, useState } from "react";
import TalentRow from "./TalentRow";

export default function ReqSection({
  section,
  index,
  client,
  poType,
  onUpdate,
  onRemove,
  isViewMode,
  errors = {},
}) {
  const [local, setLocal] = useState(
    section || { reqId: "", reqTitle: "", talents: [] }
  );

  useEffect(() => {
    setLocal(section || { reqId: "", reqTitle: "", talents: [] });
  }, [section]);

  const reqOptions = client?.reqs || [];

  function handleReqChange(e) {
    if (isViewMode) return;
    const value = e.target.value;
    const found = reqOptions.find((r) => String(r.id) === String(value));
    if (!found) {
      const updated = { ...local, reqId: "", reqTitle: "", talents: [] };
      setLocal(updated);
      onUpdate(updated);
      return;
    }
    const mappedTalents = (found.talents || []).map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role || "",
      selected: false,
      assignedRate: "",
      notes: "",
    }));
    const updated = {
      ...local,
      reqId: found.id,
      reqTitle: found.title,
      talents: mappedTalents,
    };
    setLocal(updated);
    onUpdate(updated);
  }

  function toggleTalent(id, selected) {
    if (isViewMode) return;
    setLocal((prev) => {
      let updatedTalents = prev.talents.map((t) =>
        t.id === id ? { ...t, selected } : t
      );
      if (poType === "Individual" && selected) {
        updatedTalents = updatedTalents.map((t) =>
          t.id === id ? { ...t, selected: true } : { ...t, selected: false }
        );
      }
      const updated = { ...prev, talents: updatedTalents };
      onUpdate(updated);
      return updated;
    });
  }

  function updateTalent(id, updates) {
    if (isViewMode) return;
    setLocal((prev) => {
      const updatedTalents = prev.talents.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      const updated = { ...prev, talents: updatedTalents };
      onUpdate(updated);
      return updated;
    });
  }

  return (
    <div className="req-box mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-muted small">Job Title / REQ</div>
          <h6 className="mb-1">{local.reqTitle || `REQ #${index + 1}`}</h6>
        </div>

        {!isViewMode && (
          <button className="remove-btn" onClick={() => onRemove()}>
            Remove
          </button>
        )}
      </div>

      <div className="row g-2 mt-2">
        <div className="col-md-6">
          <label className="po-label small">Job Title / REQ Name *</label>
          {isViewMode ? (
            <input
              className="form-control po-input"
              readOnly
              value={local.reqTitle || ""}
            />
          ) : (
            <select
              value={local.reqId || ""}
              onChange={handleReqChange}
              className={
                "form-select po-select " + (errors?.req ? "is-invalid" : "")
              }
            >
              <option value="">Select Job Title</option>
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
          <label className="po-label small">Job ID / REQ ID</label>
          <input
            className="form-control po-input"
            readOnly
            value={local.reqId || ""}
          />
        </div>
      </div>

      <div className="mt-3">
        <h6 className="mb-1">Talents</h6>
        {errors?.talents && (
          <div className="text-danger small mb-2">{errors.talents}</div>
        )}
        {isViewMode ? (
          local.talents.filter((t) => t.selected).length === 0 ? (
            <div className="text-muted small">No talents selected.</div>
          ) : (
            <table className="table table-sm table-bordered">
              <thead className="table-secondary">
                <tr>
                  <th>Name</th>
                  <th>Role/Email</th>
                  <th>Assigned Rate</th>
                </tr>
              </thead>
              <tbody>
                {local.talents
                  .filter((t) => t.selected)
                  .map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.role || t.email}</td>
                      <td>{t.assignedRate || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )
        ) : (
          <>
            {!local.talents || local.talents.length === 0 ? (
              <div className="text-muted small">
                Select a Job Title to load talents.
              </div>
            ) : (
              local.talents.map((t) => (
                <TalentRow
                  key={t.id}
                  talent={t}
                  selected={t.selected}
                  poType={poType}
                  errors={errors}
                  onToggle={(s) => toggleTalent(t.id, s)}
                  onChange={(u) => updateTalent(t.id, u)}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
