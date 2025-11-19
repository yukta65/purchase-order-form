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
  const [local, setLocal] = useState(section);

  useEffect(() => {
    setLocal(section);
  }, [section]);

  // Notify parent when important fields change
  useEffect(() => {
    onUpdate({
      reqId: local.reqId,
      reqTitle: local.reqTitle,
      talents: local.talents,
    });
  }, [local.reqId, local.reqTitle, local.talents]);

  const reqOptions = client?.reqs || [];

  function handleReqChange(e) {
    if (isViewMode) return;

    const value = e.target.value;
    const found = reqOptions.find((r) => r.id === value);

    if (found) {
      const mappedTalents = found.talents.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        selected: false,
        assignedRate: "",
        notes: "",
      }));

      setLocal((prev) => ({
        ...prev,
        reqId: found.id,
        reqTitle: found.title,
        talents: mappedTalents,
      }));
    } else {
      setLocal((prev) => ({
        ...prev,
        reqId: "",
        reqTitle: "",
        talents: [],
      }));
    }
  }

  function toggleTalent(id, selected) {
    if (isViewMode) return;

    setLocal((prev) => {
      let updated = [...prev.talents];

      if (poType === "Individual") {
        updated = updated.map((t) =>
          t.id === id ? { ...t, selected } : { ...t, selected: false }
        );
      } else {
        updated = updated.map((t) => (t.id === id ? { ...t, selected } : t));
      }

      return { ...prev, talents: updated };
    });
  }

  function updateTalent(id, updates) {
    if (isViewMode) return;

    setLocal((prev) => ({
      ...prev,
      talents: prev.talents.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }

  return (
    <div className="border p-3 mb-3 rounded bg-light">
      <div className="d-flex justify-content-between">
        <h6>
          REQ #{index + 1} {local.reqTitle && ` - ${local.reqTitle}`}
        </h6>

        {!isViewMode && (
          <button className="btn btn-sm btn-danger" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      <div className="row g-2">
        {/* REQ NAME */}
        <div className="col-md-6">
          <label className="form-label">Job Title / REQ Name *</label>
          {isViewMode ? (
            <input className="form-control" value={local.reqTitle} readOnly />
          ) : (
            <select
              className={"form-select " + (errors.req ? "is-invalid" : "")}
              value={local.reqId}
              onChange={handleReqChange}
            >
              <option value="">Select Job</option>
              {reqOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          )}
          {errors?.req && <div className="text-danger small">{errors.req}</div>}
        </div>

        {/* REQ ID */}
        <div className="col-md-6">
          <label className="form-label">REQ ID</label>
          <input className="form-control" value={local.reqId} readOnly />
        </div>
      </div>

      <div className="mt-3">
        <h6>Talents</h6>

        {local.talents.length === 0 && (
          <div className="text-muted small">No talents for this REQ.</div>
        )}

        {local.talents.map((t) => (
          <TalentRow
            key={t.id}
            talent={t}
            selected={t.selected}
            isViewMode={isViewMode}
            onToggle={(s) => toggleTalent(t.id, s)}
            onChange={(u) => updateTalent(t.id, u)}
            errors={errors || {}}
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
