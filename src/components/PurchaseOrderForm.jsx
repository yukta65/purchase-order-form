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
  const [formKey, setFormKey] = useState(0);

  // Load 1 default REQ section when client is selected
  useEffect(() => {
    if (form.clientId) {
      setForm((prev) => ({
        ...prev,
        reqSections:
          prev.reqSections.length === 0
            ? [
                {
                  id: Date.now(),
                  reqId: "",
                  reqTitle: "",
                  talents: [],
                },
              ]
            : prev.reqSections,
      }));
    }
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear errors for field
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function addReqSection() {
    const newSection = {
      id: Date.now(),
      reqId: "",
      reqTitle: "",
      talents: [],
    };

    setForm((prev) => ({
      ...prev,
      reqSections: [...prev.reqSections, newSection],
    }));
  }

  function updateReqSection(id, updated) {
    setForm((prev) => ({
      ...prev,
      reqSections: prev.reqSections.map((s) =>
        s.id === id ? { ...s, ...updated } : s
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
    if (!form.receivedOn) e.receivedOn = "Required";
    if (!form.receivedFromName) e.receivedFromName = "Required";
    if (!form.receivedFromEmail) e.receivedFromEmail = "Required";
    if (!form.poStartDate) e.poStartDate = "Required";
    if (!form.poEndDate) e.poEndDate = "Required";

    if (form.poEndDate < form.poStartDate)
      e.poEndDate = "End date cannot be before start date";

    if (!form.budget) e.budget = "Budget required";

    // Validate REQ sections
    const reqErrs = [];
    form.reqSections.forEach((s) => {
      const se = {};

      if (!s.reqId) se.reqId = "REQ Name required";

      const selected = s.talents.filter((t) => t.selected);

      if (form.poType === "Individual") {
        if (selected.length !== 1) se.talents = "Select exactly 1 talent";
      }

      if (form.poType === "Group") {
        if (selected.length < 2)
          se.talents = "Select at least 2 talents for Group PO";
      }

      selected.forEach((t) => {
        if (!t.assignedRate) {
          se[`rate_${t.id}`] = "Assigned rate required";
        }
      });

      reqErrs.push(Object.keys(se).length ? se : null);
    });

    if (reqErrs.some(Boolean)) e.reqSections = reqErrs;

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
    setFormKey((k) => k + 1);
  }

  const selectedClient = clientsData.find(
    (c) => String(c.id) === String(form.clientId)
  );

  return (
    <div>
      <h3 className="mb-3">Purchase Order Form</h3>

      {isViewMode && (
        <div className="alert alert-info">Form saved — Read-Only Mode</div>
      )}

      <form key={formKey} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* STANDARD INPUTS */}
          {[
            ["clientId", "Client", "select"],
            ["poType", "PO Type", "select"],
            ["poNumber", "PO Number"],
            ["receivedOn", "Received On", "date"],
            ["receivedFromName", "Received From - Name"],
            ["receivedFromEmail", "Received From - Email"],
            ["poStartDate", "PO Start Date", "date"],
            ["poEndDate", "PO End Date", "date"],
          ].map(([name, label, type]) => (
            <div className="col-md-6" key={name}>
              <label className="form-label">{label} *</label>

              {type === "select" ? (
                name === "clientId" ? (
                  isViewMode ? (
                    <input
                      className="form-control"
                      readOnly
                      value={selectedClient?.name || ""}
                    />
                  ) : (
                    <select
                      className={
                        "form-select " + (errors[name] ? "is-invalid" : "")
                      }
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {clientOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )
                ) : isViewMode ? (
                  <input
                    className="form-control"
                    readOnly
                    value={form.poType}
                  />
                ) : (
                  <select
                    className={
                      "form-select " + (errors[name] ? "is-invalid" : "")
                    }
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Individual">Individual</option>
                    <option value="Group">Group</option>
                  </select>
                )
              ) : (
                <input
                  type={type || "text"}
                  name={name}
                  value={form[name]}
                  readOnly={isViewMode}
                  onChange={handleChange}
                  className={
                    "form-control " + (errors[name] ? "is-invalid" : "")
                  }
                />
              )}

              {errors[name] && (
                <div className="invalid-feedback">{errors[name]}</div>
              )}
            </div>
          ))}

          {/* BUDGET */}
          <div className="col-md-4">
            <label className="form-label">Budget *</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              readOnly={isViewMode}
              className={"form-control " + (errors.budget ? "is-invalid" : "")}
            />
            {errors.budget && (
              <div className="invalid-feedback">{errors.budget}</div>
            )}
          </div>

          {/* CURRENCY */}
          <div className="col-md-4">
            <label className="form-label">Currency *</label>
            <select
              className="form-select"
              disabled={isViewMode}
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <hr />

        <h5>REQ Sections</h5>

        {form.reqSections.map((s, idx) => (
          <ReqSection
            key={s.id}
            section={s}
            index={idx}
            client={selectedClient}
            poType={form.poType}
            isViewMode={isViewMode}
            errors={errors.reqSections?.[idx] || {}}
            onUpdate={(u) => updateReqSection(s.id, u)}
            onRemove={() => removeReqSection(s.id)}
          />
        ))}

        {/* ADD ANOTHER — ONLY FOR GROUP, NOT VIEW MODE */}
        {!isViewMode && form.poType === "Group" && (
          <button
            type="button"
            className="btn btn-outline-primary mt-2"
            onClick={addReqSection}
          >
            Add Another REQ
          </button>
        )}

        <hr />

        {!isViewMode ? (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>

            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
                setFormKey((k) => k + 1);
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                setIsViewMode(false);
                setFormKey((k) => k + 1);
              }}
            >
              Edit Again
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                setForm(initialForm);
                setIsViewMode(false);
                setFormKey((k) => k + 1);
              }}
            >
              New Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default PurchaseOrderForm;
