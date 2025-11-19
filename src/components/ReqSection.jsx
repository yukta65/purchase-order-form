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

  useEffect(() => {
    onUpdate(local);
  }, [local]);

  const reqOptions = client?.reqs || [];

  function handleReqChange(e) {
    if (isViewMode) return;

    const { value } = e.target;
    const found = reqOptions.find((r) => r.id === value);

    if (!found) {
      setLocal({ ...local, reqId: "", reqTitle: "", talents: [] });
      return;
    }

    setLocal({
      ...local,
      reqId: found.id,
      reqTitle: found.title,
      talents: found.talents.map((t) => ({
        ...t,
        selected: false,
        assignedRate: "",
      })),
    });
  }

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="d-flex justify-content-between">
        <h6>
          REQ #{index + 1} {local.reqTitle ? `– ${local.reqTitle}` : ""}
        </h6>

        {!isViewMode && (
          <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      {/* JOB TITLE */}
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
          )}
          {errors.req && <div className="text-danger small">{errors.req}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">REQ ID</label>
          <input className="form-control" readOnly value={local.reqId || ""} />
        </div>
      </div>

      {/* TALENTS */}
      <h6 className="mt-3">Talent Details</h6>

      {/* VIEW MODE TALENT TABLE */}
      {isViewMode ? (
        local.talents.length === 0 ? (
          <div className="text-muted">No talents available.</div>
        ) : (
          <table className="table table-bordered table-striped mt-2">
            <thead className="table-secondary">
              <tr>
                <th>Talent Name</th>
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
                    <td>{t.role}</td>
                    <td>{t.assignedRate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      ) : (
        <>
          {local.talents.length === 0 && (
            <div className="text-muted small">
              Select a Job Title to load talents.
            </div>
          )}
          {local.talents.map((t) => (
            <TalentRow
              key={t.id}
              talent={t}
              selected={t.selected}
              poType={poType}
              errors={errors}
              onToggle={(sel) =>
                setLocal({
                  ...local,
                  talents: local.talents.map((x) =>
                    x.id === t.id ? { ...x, selected: sel } : x
                  ),
                })
              }
              onChange={(u) =>
                setLocal({
                  ...local,
                  talents: local.talents.map((x) =>
                    x.id === t.id ? { ...x, ...u } : x
                  ),
                })
              }
            />
          ))}
        </>
      )}

      {errors.talents && (
        <div className="text-danger small mt-1">{errors.talents}</div>
      )}
    </div>
  );
}

export default ReqSection;
