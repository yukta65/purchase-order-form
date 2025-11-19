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

  // Reset REQ sections when client changes
  useEffect(() => {
    if (prevClientId !== form.clientId) {
      setForm((prev) => ({
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
      }));
      setPrevClientId(form.clientId);
      setErrors({});
    }
  }, [form.clientId]);

  const clientOptions = clientsData.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
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
      reqSections: prev.reqSections.map((sec) =>
        sec.id === id ? { ...sec, ...updated } : sec
      ),
    }));
  }

  function removeReqSection(id) {
    setForm((prev) => ({
      ...prev,
      reqSections: prev.reqSections.filter((s) => s.id !== id),
    }));
  }

  // Validation
  function validate() {
    const e = {};

    if (!form.clientId) e.clientId = "Client is required";
    if (!form.poType) e.poType = "PO Type is required";
    if (!form.poNumber) e.poNumber = "PO Number is required";
    if (!form.receivedOn) e.receivedOn = "Received On date is required";
    if (!form.receivedFromName)
      e.receivedFromName = "Received From Name required";
    if (!form.receivedFromEmail) e.receivedFromEmail = "Valid email required";
    if (!form.poStartDate) e.poStartDate = "PO Start Date required";
    if (!form.poEndDate) e.poEndDate = "PO End Date required";

    if (form.poStartDate && form.poEndDate && form.poEndDate < form.poStartDate)
      e.poEndDate = "End date cannot be before start date";

    if (!form.budget) e.budget = "Budget is required";

    if (!form.reqSections.length)
      e.reqSections = "At least one REQ section required";

    const reqErrs = [];
    form.reqSections.forEach((s) => {
      const se = {};

      if (!s.reqId) se.req = "REQ Name is required";

      const selectedTalents = (s.talents || []).filter((t) => t.selected);

      if (form.poType === "Individual") {
        if (selectedTalents.length !== 1)
          se.talents = "Exactly one talent required for Individual PO";
      } else if (form.poType === "Group") {
        if (selectedTalents.length < 2)
          se.talents = "Minimum two talents required for Group PO";
      }

      selectedTalents.forEach((t) => {
        if (!t.assignedRate || !String(t.assignedRate).trim())
          se[`rate_${t.id}`] = "Assigned Rate required";
      });

      reqErrs.push(Object.keys(se).length ? se : null);
    });

    if (reqErrs.some((x) => x)) e.reqSections = reqErrs;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsViewMode(true); // enable READ ONLY MODE
  }

  const selectedClient = clientsData.find(
    (c) => String(c.id) === String(form.clientId)
  );

  return (
    <div>
      <h3 className="mb-3">Purchase Order Form</h3>

      {/* ------------ VIEW ONLY MODE ------------- */}
      {isViewMode && (
        <div className="alert alert-info">
          The form is saved. All fields are now in read-only mode.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* CLIENT */}
          <div className="col-md-6">
            <label className="form-label">Client Name *</label>
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
                <option value="">Select</option>
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

          {/* PO TYPE */}
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

          {/* SIMILAR UI for all other input fields BUT with readOnly mode */}
          {[
            ["poNumber", "Purchase Order Number"],
            ["receivedOn", "Received On", "date"],
            ["receivedFromName", "Received From - Name"],
            ["receivedFromEmail", "Received From - Email", "email"],
            ["poStartDate", "PO Start Date", "date"],
            ["poEndDate", "PO End Date", "date"],
          ].map(([name, label, type]) => (
            <div className="col-md-6" key={name}>
              <label className="form-label">{label} *</label>
              {isViewMode ? (
                <input
                  className="form-control"
                  value={form[name]}
                  readOnly
                  type={type || "text"}
                />
              ) : (
                <input
                  className={
                    "form-control " + (errors[name] ? "is-invalid" : "")
                  }
                  name={name}
                  type={type || "text"}
                  value={form[name]}
                  onChange={handleChange}
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
            {isViewMode ? (
              <input className="form-control" value={form.budget} readOnly />
            ) : (
              <input
                className={
                  "form-control " + (errors.budget ? "is-invalid" : "")
                }
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
              />
            )}
            {errors.budget && (
              <div className="invalid-feedback">{errors.budget}</div>
            )}
          </div>

          {/* CURRENCY */}
          <div className="col-md-4">
            <label className="form-label">Currency *</label>
            {isViewMode ? (
              <input className="form-control" value={form.currency} readOnly />
            ) : (
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
            )}
          </div>
        </div>

        <hr />

        {/* ------------ REQ SECTIONS ------------- */}
        <h5>REQ Sections</h5>

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
          <>
            <button
              type="button"
              className="btn btn-outline-primary mt-2"
              onClick={addReqSection}
            >
              Add REQ Section
            </button>

            {form.poType === "Group" && (
              <button
                type="button"
                className="btn btn-outline-success mt-2 ms-2"
                onClick={addReqSection}
              >
                Add Another (Group)
              </button>
            )}
          </>
        )}

        <hr />

        {/* BUTTONS */}
        <div className="d-flex gap-3 mt-3">
          {!isViewMode ? (
            <>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setForm(initialForm)}
              >
                Reset
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => setIsViewMode(false)}
            >
              Edit Again
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PurchaseOrderForm;
