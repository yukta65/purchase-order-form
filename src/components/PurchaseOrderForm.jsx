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
  const [submittedData, setSubmittedData] = useState(null);

  // 🔥 FIX: Track previous client to prevent resetting on every render
  const [prevClientId, setPrevClientId] = useState("");

  useEffect(() => {
    if (prevClientId !== form.clientId) {
      setForm((prev) => ({ ...prev, reqSections: [] })); // reset only when client changes
      setPrevClientId(form.clientId);
    }
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({ id: c.id, name: c.name }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    setErrors((prev) => ({ ...prev, reqSections: null }));
  }

  function removeReqSection(id) {
    setForm((prev) => ({
      ...prev,
      reqSections: prev.reqSections.filter((s) => s.id !== id),
    }));
  }

  function validate() {
    const e = {};

    if (!form.clientId) e.clientId = "Client is required";
    if (!form.poType) e.poType = "PO Type is required";
    if (!form.poNumber) e.poNumber = "PO Number is required";
    if (!form.receivedOn) e.receivedOn = "Received On date is required";
    if (!form.receivedFromName)
      e.receivedFromName = "Received From name is required";
    if (!form.receivedFromEmail) e.receivedFromEmail = "Valid email required";
    if (!form.poStartDate) e.poStartDate = "PO Start Date required";

    if (!form.poEndDate) e.poEndDate = "PO End Date required";
    if (form.poStartDate && form.poEndDate && form.poEndDate < form.poStartDate)
      e.poEndDate = "End date cannot be before start date";

    if (!form.budget) e.budget = "Budget is required";
    if (form.budget && !/^[0-9]{1,5}$/.test(form.budget))
      e.budget = "Budget must be numeric and up to 5 digits";

    if (!form.currency) e.currency = "Currency required";

    // Validate REQ sections
    if (form.reqSections.length === 0) {
      e.reqSections = "At least one REQ section required";
    } else {
      const reqErrors = [];

      form.reqSections.forEach((s) => {
        const se = {};

        if (!s.reqId || !s.reqTitle) se.req = "Select a Job Title for this REQ";

        const selectedTalents = (s.talents || []).filter((t) => t.selected);

        if (form.poType === "Individual") {
          if (selectedTalents.length === 0)
            se.talents = "Select one talent for Individual PO";
          if (selectedTalents.length > 1)
            se.talents = "Only one talent allowed for Individual PO";
        }

        if (form.poType === "Group") {
          if (selectedTalents.length < 2)
            se.talents = "Select at least two talents for Group PO";
        }

        selectedTalents.forEach((t) => {
          if (!t.assignedRate) {
            se[`talent_${t.id}_rate`] = "Assigned rate required";
          }
        });

        reqErrors.push(Object.keys(se).length ? se : null);
      });

      if (reqErrors.some((x) => x)) e.reqSections = reqErrors;
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
    setSubmittedData(form);
    console.log("Form submitted:", form);
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setSubmittedData(null);
    setPrevClientId("");
  }

  const selectedClient = clientsData.find(
    (c) => String(c.id) === String(form.clientId)
  );

  return (
    <div>
      {!submittedData ? (
        <form onSubmit={handleSubmit} noValidate>
          {/* ------------ Purchase Order Details ------------ */}
          <div className="row g-3">
            {/* Client */}
            <div className="col-md-6">
              <label className="form-label">Client Name *</label>
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
              {errors.clientId && (
                <div className="invalid-feedback">{errors.clientId}</div>
              )}
            </div>

            {/* PO Type */}
            <div className="col-md-6">
              <label className="form-label">Purchase Order Type *</label>
              <select
                className={"form-select " + (errors.poType ? "is-invalid" : "")}
                name="poType"
                value={form.poType}
                onChange={handleChange}
              >
                <option value="">Select PO Type</option>
                <option value="Individual">Individual PO</option>
                <option value="Group">Group PO</option>
              </select>
              {errors.poType && (
                <div className="invalid-feedback">{errors.poType}</div>
              )}
            </div>

            {/* PO Number */}
            <div className="col-md-6">
              <label className="form-label">Purchase Order No. *</label>
              <input
                className={
                  "form-control " + (errors.poNumber ? "is-invalid" : "")
                }
                name="poNumber"
                value={form.poNumber}
                onChange={handleChange}
              />
              {errors.poNumber && (
                <div className="invalid-feedback">{errors.poNumber}</div>
              )}
            </div>

            {/* Dates */}
            <div className="col-md-6">
              <label className="form-label">Received On *</label>
              <input
                type="date"
                className={
                  "form-control " + (errors.receivedOn ? "is-invalid" : "")
                }
                name="receivedOn"
                value={form.receivedOn}
                onChange={handleChange}
              />
              {errors.receivedOn && (
                <div className="invalid-feedback">{errors.receivedOn}</div>
              )}
            </div>

            {/* Received from name */}
            <div className="col-md-6">
              <label className="form-label">Received From - Name *</label>
              <input
                className={
                  "form-control " +
                  (errors.receivedFromName ? "is-invalid" : "")
                }
                name="receivedFromName"
                value={form.receivedFromName}
                onChange={handleChange}
              />
              {errors.receivedFromName && (
                <div className="invalid-feedback">
                  {errors.receivedFromName}
                </div>
              )}
            </div>

            {/* Received from email */}
            <div className="col-md-6">
              <label className="form-label">Received From - Email *</label>
              <input
                type="email"
                className={
                  "form-control " +
                  (errors.receivedFromEmail ? "is-invalid" : "")
                }
                name="receivedFromEmail"
                value={form.receivedFromEmail}
                onChange={handleChange}
              />
              {errors.receivedFromEmail && (
                <div className="invalid-feedback">
                  {errors.receivedFromEmail}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="col-md-6">
              <label className="form-label">PO Start Date *</label>
              <input
                type="date"
                className={
                  "form-control " + (errors.poStartDate ? "is-invalid" : "")
                }
                name="poStartDate"
                value={form.poStartDate}
                onChange={handleChange}
              />
              {errors.poStartDate && (
                <div className="invalid-feedback">{errors.poStartDate}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">PO End Date *</label>
              <input
                type="date"
                className={
                  "form-control " + (errors.poEndDate ? "is-invalid" : "")
                }
                name="poEndDate"
                value={form.poEndDate}
                onChange={handleChange}
              />
              {errors.poEndDate && (
                <div className="invalid-feedback">{errors.poEndDate}</div>
              )}
            </div>

            {/* Budget */}
            <div className="col-md-4">
              <label className="form-label">Budget *</label>
              <input
                type="number"
                className={
                  "form-control " + (errors.budget ? "is-invalid" : "")
                }
                name="budget"
                value={form.budget}
                onChange={handleChange}
              />
              {errors.budget && (
                <div className="invalid-feedback">{errors.budget}</div>
              )}
            </div>

            {/* Currency */}
            <div className="col-md-4">
              <label className="form-label">Currency *</label>
              <select
                className={
                  "form-select " + (errors.currency ? "is-invalid" : "")
                }
                name="currency"
                value={form.currency}
                onChange={handleChange}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              {errors.currency && (
                <div className="invalid-feedback">{errors.currency}</div>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* ------------ Talent Details ------------ */}
          <div>
            <h5>Talent Details</h5>
            <p className="text-muted small">
              Add REQ sections and select talents.
            </p>

            {form.reqSections.map((s, idx) => (
              <div key={s.id} className="req-section">
                <ReqSection
                  section={s}
                  index={idx}
                  client={selectedClient}
                  poType={form.poType}
                  onUpdate={(up) => updateReqSection(s.id, up)}
                  onRemove={() => removeReqSection(s.id)}
                />
              </div>
            ))}

            {errors.reqSections && typeof errors.reqSections === "string" && (
              <div className="text-danger mb-2">{errors.reqSections}</div>
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addReqSection}
                disabled={!form.clientId}
              >
                Add REQ Section
              </button>

              {form.poType === "Group" && (
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={addReqSection}
                  disabled={!form.clientId}
                >
                  Add Another (Group)
                </button>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* ------------ Buttons ------------ */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h4>Purchase Order Summary</h4>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f8f9fa",
              padding: 12,
            }}
          >
            {JSON.stringify(submittedData, null, 2)}
          </pre>
          <div className="mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setSubmittedData(null);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-success ms-2"
              onClick={() => alert("Submission final.")}
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrderForm;
