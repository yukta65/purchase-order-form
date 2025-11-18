import React, { useEffect, useState } from "react";
import TalentRow from "./TalentRow";

function ReqSection({ section, index, client, poType, onUpdate, onRemove }) {
  // local state mirrors the section object
  const [local, setLocal] = useState(section);

  // keep local synced if parent provides a new section object
  useEffect(() => {
    setLocal(section);
  }, [section]);

  // When important local fields change, notify parent.
  // Use shallow dependencies to avoid infinite loops.
  useEffect(() => {
    // send a minimal section payload (so parent can update)
    onUpdate({
      reqId: local.reqId,
      reqTitle: local.reqTitle,
      talents: local.talents,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.reqId, local.reqTitle, local.talents]);

  const reqOptions = client?.reqs || [];

  function handleReqChange(e) {
    const { value } = e.target;
    const found = reqOptions.find((r) => r.id === value);

    if (found) {
      // Filter talents by req.stage if talent has stage property
      const talentsForReq = (found.talents || []).map((t) => ({
        // keep existing fields if present
        id: t.id,
        name: t.name,
        email: t.email,
        stage: t.stage, // optional
        selected: false,
        assignedRate: t.assignedRate || "",
        notes: t.notes || "",
      }));

      setLocal((prev) => ({
        ...prev,
        reqId: found.id,
        reqTitle: found.title,
        talents: talentsForReq,
      }));
    } else {
      setLocal((prev) => ({ ...prev, reqId: "", reqTitle: "", talents: [] }));
    }
  }

  // Toggle talent selection respecting Individual vs Group rules
  function toggleTalent(talentId, selected) {
    setLocal((prev) => {
      const updated = prev.talents.map((t) => {
        if (t.id === talentId) {
          return { ...t, selected };
        }
        // If Individual PO and another talent is selected, unselect others
        if (poType === "Individual" && selected) {
          return { ...t, selected: false };
        }
        return t;
      });

      return { ...prev, talents: updated };
    });
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
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="mb-0">
          REQ #{index + 1} {local.reqTitle ? `- ${local.reqTitle}` : ""}
        </h6>
        <div>
          <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>
            Remove
          </button>
        </div>
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

        {(!local.talents || local.talents.length === 0) && (
          <div className="text-muted small">
            No talents available for this REQ.
          </div>
        )}

        {local.talents?.map((t) => (
          <div key={t.id} className="mb-2">
            <TalentRow
              talent={t}
              selected={!!t.selected}
              onToggle={(sel) => toggleTalent(t.id, sel)}
              onChange={(upd) => updateTalent(t.id, upd)}
              poType={poType}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReqSection;
