import React, { useEffect, useState } from "react";
import clientsData from "../data/clients.json";
import ReqSection from "./ReqSection";
import "../styles/po-form.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}
function poNumberIsValid(val) {
  return /^[A-Za-z0-9\-_.\/ ]+$/.test(String(val || ""));
}

export default function PurchaseOrderForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Once client chosen, ensure there's at least one REQ section
  useEffect(() => {
    if (form.clientId && (!form.reqSections || form.reqSections.length === 0)) {
      setForm((prev) => ({
        ...prev,
        reqSections: [
          {
            id: Date.now(),
            reqId: "",
            reqTitle: "",
            talents: [],
          },
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({ id: c.id, name: c.name }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function addReqSection() {
    const s = { id: Date.now(), reqId: "", reqTitle: "", talents: [] };
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
    else if (!poNumberIsValid(form.poNumber)) e.poNumber = "Invalid PO number";
    if (!form.receivedOn) e.receivedOn = "Received On is required";
    if (!form.receivedFromName) e.receivedFromName = "Sender name required";
    if (!form.receivedFromEmail) e.receivedFromEmail = "Sender email required";
    else if (!emailIsValid(form.receivedFromEmail))
      e.receivedFromEmail = "Invalid email";
    if (!form.poStartDate) e.poStartDate = "Start date required";
    if (!form.poEndDate) e.poEndDate = "End date required";
    if (
      form.poStartDate &&
      form.poEndDate &&
      new Date(form.poEndDate) < new Date(form.poStartDate)
    )
      e.poEndDate = "End date cannot be before start date";
    if (!form.budget) e.budget = "Budget required";
    else if (!/^\d{1,5}$/.test(String(form.budget)))
      e.budget = "Budget must be up to 5 digits";

    // validate REQ sections
    if (!form.reqSections || form.reqSections.length === 0) {
      e.reqSections = "At least one REQ section required";
    } else {
      const reqErrs = [];
      for (const s of form.reqSections) {
        const se = {};
        if (!s.reqId) se.req = "Job Title / REQ required";
        const selected = (s.talents || []).filter((t) => t.selected);
        if (form.poType === "Individual") {
          if (selected.length !== 1)
            se.talents = "Select exactly 1 talent for Individual PO";
        } else if (form.poType === "Group") {
          if (selected.length < 2)
            se.talents = "Select at least 2 talents for Group PO";
        }
        for (const t of selected) {
          if (!t.assignedRate || String(t.assignedRate).trim() === "")
            se[`rate_${t.id}`] = "Assigned rate required";
        }
        reqErrs.push(Object.keys(se).length ? se : null);
      }
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
    console.log("Saved form:", form);
    setIsViewMode(true);
    setFormKey((k) => k + 1);
  }

  function handleEditAgain() {
    setIsViewMode(false);
    setFormKey((k) => k + 1);
  }

  function handleNewForm() {
    setForm(initialForm);
    setIsViewMode(false);
    setErrors({});
    setFormKey((k) => k + 1);
  }

  const selectedClient = clientsData.find(
    (c) => String(c.id) === String(form.clientId)
  );

  return (
    <div className="po-container">
      <div className="d-flex align-items-center mb-3">
        <h3 className="me-auto">Purchase Order</h3>
      </div>

      <form key={formKey} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Client */}
          <div className="col-md-4">
            <label className="po-label">Client Name *</label>
            {isViewMode ? (
              <input
                className="form-control po-input"
                readOnly
                value={selectedClient?.name || ""}
              />
            ) : (
              <select
                name="clientId"
                className={
                  "form-select po-select " +
                  (errors.clientId ? "is-invalid" : "")
                }
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
              <div className="text-danger small mt-1">{errors.clientId}</div>
            )}
          </div>

          {/* PO Type */}
          <div className="col-md-4">
            <label className="po-label">Purchase Order Type *</label>
            {isViewMode ? (
              <input
                className="form-control po-input"
                readOnly
                value={form.poType}
              />
            ) : (
              <select
                name="poType"
                className={
                  "form-select po-select " + (errors.poType ? "is-invalid" : "")
                }
                value={form.poType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            )}
            {errors.poType && (
              <div className="text-danger small mt-1">{errors.poType}</div>
            )}
          </div>

          {/* PO Number */}
          <div className="col-md-4">
            <label className="po-label">Purchase Order No. *</label>
            <input
              name="poNumber"
              className={
                "form-control po-input " + (errors.poNumber ? "is-invalid" : "")
              }
              value={form.poNumber}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.poNumber && (
              <div className="text-danger small mt-1">{errors.poNumber}</div>
            )}
          </div>

          {/* Received On */}
          <div className="col-md-3">
            <label className="po-label">Received On *</label>
            <input
              name="receivedOn"
              type="date"
              className={
                "form-control po-input " +
                (errors.receivedOn ? "is-invalid" : "")
              }
              value={form.receivedOn}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.receivedOn && (
              <div className="text-danger small mt-1">{errors.receivedOn}</div>
            )}
          </div>

          {/* Received From Name */}
          <div className="col-md-3">
            <label className="po-label">Received From - Name *</label>
            <input
              name="receivedFromName"
              className={
                "form-control po-input " +
                (errors.receivedFromName ? "is-invalid" : "")
              }
              value={form.receivedFromName}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.receivedFromName && (
              <div className="text-danger small mt-1">
                {errors.receivedFromName}
              </div>
            )}
          </div>

          {/* Received From Email */}
          <div className="col-md-3">
            <label className="po-label">Received From - Email *</label>
            <input
              name="receivedFromEmail"
              type="email"
              className={
                "form-control po-input " +
                (errors.receivedFromEmail ? "is-invalid" : "")
              }
              value={form.receivedFromEmail}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.receivedFromEmail && (
              <div className="text-danger small mt-1">
                {errors.receivedFromEmail}
              </div>
            )}
          </div>

          {/* Start & End Dates */}
          <div className="col-md-3">
            <label className="po-label">PO Start Date *</label>
            <input
              name="poStartDate"
              type="date"
              className={
                "form-control po-input " +
                (errors.poStartDate ? "is-invalid" : "")
              }
              value={form.poStartDate}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.poStartDate && (
              <div className="text-danger small mt-1">{errors.poStartDate}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="po-label">PO End Date *</label>
            <input
              name="poEndDate"
              type="date"
              className={
                "form-control po-input " +
                (errors.poEndDate ? "is-invalid" : "")
              }
              value={form.poEndDate}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.poEndDate && (
              <div className="text-danger small mt-1">{errors.poEndDate}</div>
            )}
          </div>

          {/* Budget & Currency */}
          <div className="col-md-3">
            <label className="po-label">Budget *</label>
            <input
              name="budget"
              type="number"
              className={
                "form-control po-input " + (errors.budget ? "is-invalid" : "")
              }
              value={form.budget}
              onChange={handleChange}
              readOnly={isViewMode}
            />
            {errors.budget && (
              <div className="text-danger small mt-1">{errors.budget}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="po-label">Currency *</label>
            <select
              name="currency"
              disabled={isViewMode}
              className="form-select po-select"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <hr className="my-4" />

        <h5 className="po-section-title">Talent Detail</h5>

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

        {!isViewMode && form.poType === "Group" && (
          <div className="mb-3">
            <button type="button" className="add-btn" onClick={addReqSection}>
              + Add Another
            </button>
          </div>
        )}

        <hr className="my-3" />

        {!isViewMode ? (
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
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
              onClick={handleEditAgain}
            >
              Edit Again
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleNewForm}
            >
              New Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
