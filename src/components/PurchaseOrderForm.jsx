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
  const [prevClientId, setPrevClientId] = useState("");

  // RESET req sections when client changes
  useEffect(() => {
    if (prevClientId !== form.clientId) {
      setForm({
        ...initialForm,
        clientId: form.clientId,
        currency: "INR",
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
      });
      setPrevClientId(form.clientId);
      setErrors({});
      setFormKey((k) => k + 1);
    }
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({ id: c.id, name: c.name }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function addReqSection() {
    const s = {
      id: Date.now(),
      reqId: "",
      reqTitle: "",
      talents: [],
    };
    setForm((prev) => ({ ...prev, reqSections: [...prev.reqSections, s] }));
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
    if (form.poStartDate && form.poEndDate && form.poEndDate < form.poStartDate)
      e.poEndDate = "End date cannot be before start date";
    if (!form.budget) e.budget = "Budget required";

    const reqErrs = [];

    form.reqSections.forEach((s) => {
      const se = {};

      if (!s.reqId) se.req = "REQ Name required";

      const selected = s.talents.filter((t) => t.selected);

      if (form.poType === "Individual") {
        if (selected.length !== 1) se.talents = "Select exactly 1 talent";
      } else {
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
      <div className="container py-4">
        <div className="po-card">
          <h3 className="mb-3">Purchase Order Form</h3>
        </div>
      </div>
      {isViewMode && (
        <div className="alert alert-info">Form saved — Read Only Mode</div>
      )}

      <form key={formKey} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* --- Standard Inputs --- */}
          {[
            ["clientId", "Client", "select"],
            ["poType", "PO Type", "select"],
            ["poNumber", "PO Number"],
            ["receivedOn", "Received On", "date"],
            ["receivedFromName", "Received From - Name"],
            ["receivedFromEmail", "Received From - Email", "email"],
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
                      <option value="">Select client</option>
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
                  onChange={handleChange}
                  readOnly={isViewMode}
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

          {/* Budget */}
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

          {/* Currency */}
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

        {!isViewMode && (
          <div className="mt-3">
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
