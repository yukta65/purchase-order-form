import React, { useEffect, useState } from "react";
import clientsData from "../data/clients.json";
import ReqSection from "./ReqSection";

const initialForm = {
  clientId: "",
  poType: "",
  poNumber: "",
  receivedOn: "",
  receivedFromName: "",
  receivedFromEmail: "",
  poStartDate: "",
  poEndDate: "",
  budget: "",
  currency: "INR",
  reqSections: [],
};

function PurchaseOrderForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [prevClientId, setPrevClientId] = useState("");
  const [formKey, setFormKey] = useState(0); // force remount when toggled

  // When client changes: reset reqSections and bump key
  useEffect(() => {
    if (prevClientId !== form.clientId) {
      setForm((prev) => ({
        ...initialForm,
        clientId: form.clientId,
        currency: prev.currency || "INR",
        reqSections: form.clientId
          ? [
              {
                id: Date.now(),
                reqId: "",
                reqTitle: "",
                talents: [],
              },
            ]
          : [],
      }));
      setPrevClientId(form.clientId);
      setErrors({});
      setFormKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({ id: c.id, name: c.name }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  }

  function addReqSection() {
    const s = { id: Date.now(), reqId: "", reqTitle: "", talents: [] };
    setForm((prev) => ({ ...prev, reqSections: [...prev.reqSections, s] }));
  }

  function updateReqSection(id, updated) {
    setForm((prev) => ({
      ...prev,
      reqSections: prev.reqSections.map((sec) =>
        sec.id === id ? { ...sec, ...updated } : sec
      ),
    }));
  }

  function removeReqSection(id) {
    if (isViewMode) return;
    setForm((prev) => ({
      ...prev,
      reqSections: prev.reqSections.filter((s) => s.id !== id),
    }));
  }

  function validate() {
    const e = {};

    if (!form.clientId) e.clientId = "Client is required";
    if (!form.poType) e.poType = "PO Type is required";
    if (!form.poNumber) e.poNumber = "PO Number required";
    if (!form.receivedOn) e.receivedOn = "Date required";
    if (!form.receivedFromName) e.receivedFromName = "Required";
    if (!form.receivedFromEmail) e.receivedFromEmail = "Valid email required";
    if (!form.poStartDate) e.poStartDate = "Required";
    if (!form.poEndDate) e.poEndDate = "Required";
    if (form.poStartDate && form.poEndDate && form.poEndDate < form.poStartDate)
      e.poEndDate = "End date cannot be before start date";
    if (!form.budget) e.budget = "Budget required";
    if (form.budget && !/^[0-9]{1,5}$/.test(String(form.budget)))
      e.budget = "Budget must be numeric and up to 5 digits";

    // REQ validation
    const reqErrs = [];
    if (!form.reqSections || form.reqSections.length === 0) {
      e.reqSections = "At least one REQ section required";
    } else {
      form.reqSections.forEach((s) => {
        const se = {};
        if (!s.reqId) se.req = "REQ Name required";

        const selected = (s.talents || []).filter((t) => t.selected);

        if (form.poType === "Individual") {
          if (selected.length !== 1) se.talents = "Select exactly 1 talent";
        } else if (form.poType === "Group") {
          if (selected.length < 2) se.talents = "Select 2 or more talents";
        }

        selected.forEach((t) => {
          if (!t.assignedRate || !String(t.assignedRate).trim()) {
            se[`rate_${t.id}`] = "Assigned Rate required";
          }
        });

        reqErrs.push(Object.keys(se).length ? se : null);
      });
      if (reqErrs.some(Boolean)) e.reqSections = reqErrs;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsViewMode(true);
    setFormKey((k) => k + 1); // ensure children remount and show read-only
    console.log("Saved form data:", form);
  }

  const selectedClient = clientsData.find(
    (c) => String(c.id) === String(form.clientId)
  );

  return (
    <div>
      <h3 className="mb-3">Purchase Order Form</h3>

      {isViewMode && (
        <div className="alert alert-info">Form saved — read-only mode</div>
      )}

      <form key={formKey} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Client */}
          <div className="col-md-6">
            <label className="form-label">Client *</label>
            {isViewMode ? (
              <input
                className="form-control"
                value={selectedClient?.name || ""}
                readOnly
              />
            ) : (
              <select
                className={
                  "form-select " + (errors.clientId ? "is-invalid" : "")
                }
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
              >
                <option value="">Select client</option>
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && (
              <div className="invalid-feedback">{errors.clientId}</div>
            )}
          </div>

          {/* PO Type */}
          <div className="col-md-6">
            <label className="form-label">PO Type *</label>
            {isViewMode ? (
              <input className="form-control" value={form.poType} readOnly />
            ) : (
              <select
                className={"form-select " + (errors.poType ? "is-invalid" : "")}
                name="poType"
                value={form.poType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            )}
            {errors.poType && (
              <div className="invalid-feedback">{errors.poType}</div>
            )}
          </div>

          {/* Other fields */}
          {[
            ["poNumber", "PO Number"],
            ["receivedOn", "Received On", "date"],
            ["receivedFromName", "Received From - Name"],
            ["receivedFromEmail", "Received From - Email", "email"],
            ["poStartDate", "PO Start Date", "date"],
            ["poEndDate", "PO End Date", "date"],
          ].map(([name, label, type]) => (
            <div className="col-md-6" key={name}>
              <label className="form-label">{label} *</label>
              <input
                className={"form-control " + (errors[name] ? "is-invalid" : "")}
                name={name}
                type={type || "text"}
                value={form[name]}
                onChange={handleChange}
                readOnly={isViewMode}
              />
              {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
              )}
            </div>
          ))}

          {/* Budget */}
          <div className="col-md-4">
            <label className="form-label">Budget *</label>
            <input
              className={"form-control " + (errors.budget ? "is-invalid" : "")}
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.budget && (
              <div className="invalid-feedback">{errors.budget}</div>
            )}
          </div>

          {/* Currency */}
          <div className="col-md-4">
            <label className="form-label">Currency *</label>
            <select
              className={"form-select " + (errors.currency ? "is-invalid" : "")}
              name="currency"
              value={form.currency}
              onChange={handleChange}
              disabled={isViewMode}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <hr />

        <h5>Talent Details (REQ Sections)</h5>

        {form.reqSections.map((s, idx) => (
          <ReqSection
            key={s.id}
            section={s}
            index={idx}
            client={selectedClient}
            poType={form.poType}
            onUpdate={(u) => updateReqSection(s.id, u)}
            onRemove={() => removeReqSection(s.id)}
            isViewMode={isViewMode}
            errors={errors.reqSections?.[idx] || {}}
          />
        ))}

        {!isViewMode && (
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-primary me-2"
              onClick={addReqSection}
            >
              Add REQ Section
            </button>
            {form.poType === "Group" && (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={addReqSection}
              >
                Add Another (Group)
              </button>
            )}
          </div>
        )}

        <hr />

        {!isViewMode ? (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
                setPrevClientId("");
                setFormKey((k) => k + 1);
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                setIsViewMode(false);
                setErrors({});
                setFormKey((k) => k + 1); // remount children to pick up edit mode
              }}
            >
              Edit Again
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default PurchaseOrderForm;
