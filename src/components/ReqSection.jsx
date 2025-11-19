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
  errors = {},
}) {
  const [local, setLocal] = useState(section);

  useEffect(() => {
    setLocal(section);
  }, [section]);

  const reqOptions = client?.reqs || [];

  // --- Job Title Change ---
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

  // --- Talent Checkbox Toggle ---
  function toggleTalent(id, selected) {
    if (isViewMode) return;

    setLocal((prev) => {
      let updatedTalents = prev.talents.map((t) =>
        t.id === id ? { ...t, selected } : t
      );

      // Individual PO: Only one allowed
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

  // --- Update Talent Fields ---
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
    <div className="req-box p-3 border rounded mb-3">
      {/* Title + Remove */}
      <div className="d-flex justify-content-between align-items-start">
        <h6 className="mb-1">
          REQ #{index + 1} {local.reqTitle ? `- ${local.reqTitle}` : ""}
        </h6>

        {!isViewMode && (
          <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      {/* Job Title / REQ Name */}
      <div className="row g-2 mt-1">
        <div className="col-md-6">
          <label className="form-label small">Job Title / REQ Name *</label>

          {isViewMode ? (
            <input
              className="form-control"
              readOnly
              value={local.reqTitle || ""}
            />
          ) : (
            <select
              className={"form-select " + (errors?.req ? "is-invalid" : "")}
              value={local.reqId}
              onChange={handleReqChange}
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

        {/* REQ ID */}
        <div className="col-md-6">
          <label className="form-label small">REQ ID</label>
          <input className="form-control" readOnly value={local.reqId || ""} />
        </div>
      </div>

      {/* Talent Section */}
      <div className="mt-3">
        <h6 className="mb-1">Talents</h6>

        {/* ERROR — For Group PO require >=2 */}
        {errors?.talents && (
          <div className="text-danger small mb-2">{errors.talents}</div>
        )}

        {/* VIEW MODE */}
        {isViewMode ? (
          <>
            {local.talents.filter((t) => t.selected).length === 0 ? (
              <div className="text-muted small">No talents selected.</div>
            ) : (
              <table className="table table-bordered table-sm mt-2">
                <thead className="table-secondary">
                  <tr>
                    <th>Name</th>
                    <th>Email / Role</th>
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
            )}
          </>
        ) : (
          <>
            {!local.talents.length ? (
              <div className="text-muted small">
                Select a Job Title to load talents.
              </div>
            ) : (
              local.talents.map((t) => (
                <TalentRow
                  key={t.id}
                  talent={t}
                  selected={t.selected}
                  errors={errors}
                  poType={poType}
                  onToggle={(val) => toggleTalent(t.id, val)}
                  onChange={(update) => updateTalent(t.id, update)}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReqSection;
