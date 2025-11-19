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
  // formKey forces a remount of the form subtree when changed
  const [formKey, setFormKey] = useState(0);

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
      // bump formKey so children remount with fresh data
      setFormKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Validation (same as before)
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

    const reqErrs = [];

    form.reqSections.forEach((s) => {
      const se = {};

      if (!s.reqId) se.req = "REQ Name required";

      const selected = s.talents.filter((t) => t.selected);

      if (form.poType === "Individual") {
        if (selected.length !== 1) se.talents = "Select exactly 1 talent";
      } else if (form.poType === "Group") {
        if (selected.length < 2) se.talents = "Select 2 or more talents";
      }

      selected.forEach((t) => {
        if (!t.assignedRate || !String(t.assignedRate).trim())
          se[`rate_${t.id}`] = "Rate required";
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
    // enable view mode and remount children to ensure they pick up readOnly state
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
        <div className="alert alert-info">
          The form has been saved and is now in read-only mode.
        </div>
      )}

      {/* key={formKey} forces remount when formKey changes */}
      <form key={formKey} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* CLIENT */}
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
                <option value="">Select</option>
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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
          </div>

          {/* OTHER FIELDS */}
          {[
            ["poNumber", "PO Number"],
            ["receivedOn", "Received On", "date"],
            ["receivedFromName", "Sender Name"],
            ["receivedFromEmail", "Sender Email", "email"],
            ["poStartDate", "Start Date", "date"],
            ["poEndDate", "End Date", "date"],
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

          {/* BUDGET */}
          <div className="col-md-4">
            <label className="form-label">Budget *</label>
            <input
              className={"form-control " + (errors.budget ? "is-invalid" : "")}
              value={form.budget}
              name="budget"
              type="number"
              readOnly={isViewMode}
              onChange={handleChange}
            />
          </div>

          {/* CURRENCY */}
          <div className="col-md-4">
            <label className="form-label">Currency *</label>
            <select
              disabled={isViewMode}
              className={"form-select " + (errors.currency ? "is-invalid" : "")}
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

        {/* REQ SECTIONS */}
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
        {!isViewMode ? (
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              // turn off view mode and bump the key to remount children
              setIsViewMode(false);
              setErrors({});
              setFormKey((k) => k + 1);
            }}
          >
            Edit Again
          </button>
        )}
      </form>
    </div>
  );
}

export default PurchaseOrderForm;
