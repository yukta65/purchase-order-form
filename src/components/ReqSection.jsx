import React, { useEffect, useState } from "react";
import TalentRow from "./TalentRow";

function ReqSection({ section, index, client, poType, onUpdate, onRemove }) {
  const [local, setLocal] = useState(section);

  // Sync when section changes
  useEffect(() => {
    setLocal(section);
  }, [section]);

  // FIX: update parent ONLY when certain keys change
  useEffect(() => {
    onUpdate({
      reqId: local.reqId,
      reqTitle: local.reqTitle,
      talents: local.talents,
    });
  }, [local.reqId, local.reqTitle, local.talents]);

  const reqOptions = client?.reqs || [];

  function handleReqChange(e) {
    const { value } = e.target;
    const found = reqOptions.find((r) => r.id === value);

    if (found) {
      setLocal((prev) => ({
        ...prev,
        reqId: found.id,
        reqTitle: found.title,
        talents: found.talents.map((t) => ({
          ...t,
          selected: false,
          assignedRate: "",
        })),
      }));
    } else {
      setLocal((prev) => ({ ...prev, reqId: "", reqTitle: "", talents: [] }));
    }
  }

  function toggleTalent(talentId, selected) {
    setLocal((prev) => ({
      ...prev,
      talents: prev.talents.map((t) =>
        t.id === talentId ? { ...t, selected } : t
      ),
    }));
  }

  function updateTalent(talentId, updates) {
    setLocal((prev) => ({
      ...prev,
      talents: prev.talents.map((t) =>
        t.id === talentId ? { ...t, ...updates } : t
      ),
    }));
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h6>
          REQ #{index + 1} {local.reqTitle ? `- ${local.reqTitle}` : ""}
        </h6>
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="row g-2 align-items-center">
        <div className="col-md-6">
          <label className="form-label">Job Title / REQ Name *</label>
          <select
            className="form-select"
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
        </div>

        <div className="col-md-6">
          <label className="form-label">REQ ID</label>
          <input className="form-control" value={local.reqId || ""} readOnly />
        </div>
      </div>

      <div className="mt-3">
        <h6>Talents</h6>
        {local.talents?.length === 0 && (
          <div className="text-muted small">
            No talents available for this REQ.
          </div>
        )}

        {local.talents?.map((t) => (
          <TalentRow
            key={t.id}
            talent={t}
            selected={t.selected}
            onToggle={(sel) => toggleTalent(t.id, sel)}
            onChange={(upd) => updateTalent(t.id, upd)}
            poType={poType}
          />
        ))}
      </div>
    </div>
  );
}

export default ReqSection;
