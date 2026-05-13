'use client';

import { useState } from "react";

const initialContacts = [
  { id: 1, name: "Alvarez", phone: "2244868135", specialty: "Plumbing", emoji: "🔧", color: "#c41e3a" },
  { id: 10, name: "Georges", phone: "2242686189", specialty: "Plumbing", emoji: "🔧", color: "#c41e3a" },
  { id: 2, name: "Andy", phone: "6302476709", specialty: "Electrical", emoji: "⚡", color: "#c41e3a" },
  { id: 3, name: "Richard", phone: "3146090219", specialty: "Furnace/AC", emoji: "❄️", color: "#c41e3a" },
  { id: 12, name: "Yogi AC", phone: "6304074058", specialty: "Furnace/AC", emoji: "❄️", color: "#c41e3a" },
  { id: 4, name: "Joel", phone: "2245440134", specialty: "General", emoji: "🔨", color: "#c41e3a" },
  { id: 5, name: "Jesus", phone: "2245420618", specialty: "Landscaping", emoji: "🌱", color: "#c41e3a" },
  { id: 6, name: "Jesus", phone: "2245420618", specialty: "Snow Removal", emoji: "❄️", color: "#c41e3a" },
  { id: 7, name: "Bhavik", phone: "6309231897", specialty: "Roofing", emoji: "🏠", color: "#c41e3a" },
  { id: 8, name: "Jesus (Roof Repair)", phone: "8477547151", specialty: "Roofing", emoji: "🏠", color: "#c41e3a" },
  { id: 13, name: "2nd Roof Opinion", phone: "6304331409", specialty: "Roofing", emoji: "🏠", color: "#c41e3a" },
  { id: 9, name: "Garage man", phone: "8476209249", specialty: "Garage", emoji: "🚪", color: "#c41e3a" },
  { id: 11, name: "Northwest Duct", phone: "6308085901", specialty: "Duct Cleaning", emoji: "💨", color: "#c41e3a" },
];

const PROPERTIES = ["1462 Bear Flag", "3506 Barkley", "1150 Hilldale", "333 Four Winds Way", "1342 Deerfield", "6267 Kit Carson", "6364 Fremont"];

const QUICK_MESSAGES = [
  "Hi (Name)\n\nReaching out in regards to (Property selected)\n\nI have a repair issue. Are you available?",
  "Hi (Name)\n\nReaching out in regards to (Property selected)\n\nCan you give me a call when you have a moment? Need a quote.",
  "Hi (Name)\n\nReaching out in regards to (Property selected)\n\nEmergency repair needed ASAP. Please call me.",
];

const SPECIALTIES = ["Plumbing", "Electrical", "Furnace/AC", "Roofing", "General", "Landscaping", "Snow Removal", "Garage", "Duct Cleaning"];
const EXPENSE_CATEGORIES = ["Repairs", "Legal fees", "Cleaning", "Professional services"];

function formatPhone(raw) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
}

function rawPhone(p) { return p.replace(/\D/g, ""); }

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  const endDate = new Date(dateStr);
  const diff = endDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [tab, setTab] = useState("contacts");
  const [contacts, setContacts] = useState(initialContacts);
  const [leases, setLeases] = useState([
    { property: "1462 Bear Flag", startDate: "2024-01-01", endDate: "2026-12-31" },
    { property: "3506 Barkley", startDate: "2024-06-01", endDate: "2026-05-31" },
    { property: "1150 Hilldale", startDate: "", endDate: "" },
    { property: "333 Four Winds Way", startDate: "2024-09-01", endDate: "2025-08-31" },
    { property: "1342 Deerfield", startDate: "", endDate: "" },
    { property: "6267 Kit Carson", startDate: "2024-11-01", endDate: "2025-10-31" },
    { property: "6364 Fremont", startDate: "2023-07-01", endDate: "2025-06-30" },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, property: "1462 Bear Flag", category: "Repairs", amount: 250, date: "2026-05-01", description: "Roof repair" },
    { id: 2, property: "3506 Barkley", category: "Cleaning", amount: 150, date: "2026-05-10", description: "Professional cleaning" },
    { id: 3, property: "333 Four Winds Way", category: "Legal fees", amount: 500, date: "2026-04-15", description: "Tenant dispute" },
    { id: 4, property: "6267 Kit Carson", category: "Professional services", amount: 300, date: "2026-05-05", description: "Property inspection" },
    { id: 5, property: "1462 Bear Flag", category: "Repairs", amount: 125, date: "2026-05-08", description: "Plumbing fix" },
    { id: 6, property: "6364 Fremont", category: "Cleaning", amount: 200, date: "2026-04-20", description: "Deep clean" },
  ]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState("All Properties");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [modal, setModal] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [editingLease, setEditingLease] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", specialty: "General" });
  const [expenseForm, setExpenseForm] = useState({ property: "", category: "Repairs", amount: "", date: "", description: "" });
  const [customMsg, setCustomMsg] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [toast, setToast] = useState(null);

  const specialties = ["All", ...SPECIALTIES];
  const propertiesWithLeases = leases.filter(l => l.startDate && l.endDate).map(l => l.property);
  const years = [...new Set(expenses.map(e => e.date.substring(0, 4)))].sort().reverse();

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.specialty === filter;
    return matchSearch && matchFilter;
  });

  const filteredExpenses = expenses.filter(e => selectedProperty === "All Properties" ? propertiesWithLeases.includes(e.property) : e.property === selectedProperty);

  const summaryData = expenses.filter(e => e.date.substring(0, 4) === selectedYear).reduce((acc, e) => {
    if (!acc[e.property]) acc[e.property] = {};
    if (!acc[e.property][e.category]) acc[e.property][e.category] = 0;
    acc[e.property][e.category] += e.amount;
    return acc;
  }, {});

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function openText(contact) {
    setActiveContact(contact);
    setCustomMsg("");
    setSelectedQuick(null);
    setModal("text");
  }

  function openEdit(contact) {
    setActiveContact(contact);
    setForm({ name: contact.name, phone: formatPhone(contact.phone), specialty: contact.specialty });
    setModal("edit");
  }

  function openAdd() {
    setForm({ name: "", phone: "", specialty: "General" });
    setModal("add");
  }

  function saveContact() {
    const phone = rawPhone(form.phone);
    if (!form.name.trim() || phone.length < 10) return;
    if (modal === "add") {
      setContacts(prev => [...prev, { id: Date.now(), name: form.name.trim(), phone, specialty: form.specialty, emoji: "🔨", color: "#c41e3a" }]);
      showToast("Contact added!");
    } else {
      setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, name: form.name.trim(), phone, specialty: form.specialty, color: "#c41e3a" } : c));
      showToast("Contact updated!");
    }
    setModal(null);
  }

  function deleteContact(id) {
    setContacts(prev => prev.filter(c => c.id !== id));
    setModal(null);
    showToast("Contact removed.");
  }

  function saveLease() {
    if (editingLease && editingLease.startDate && editingLease.endDate) {
      setLeases(prev => prev.map(l => l.property === editingLease.property ? editingLease : l));
      setEditingLease(null);
      showToast("Lease updated!");
    }
  }

  function saveExpense() {
    if (expenseForm.property && expenseForm.category && expenseForm.amount && expenseForm.date) {
      if (editingExpense) {
        setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...editingExpense, ...expenseForm } : e));
        showToast("Expense updated!");
      } else {
        setExpenses(prev => [...prev, { id: Date.now(), ...expenseForm, amount: parseFloat(expenseForm.amount) }]);
        showToast("Expense added!");
      }
      setEditingExpense(null);
      setExpenseForm({ property: "", category: "Repairs", amount: "", date: "", description: "" });
      setModal(null);
    }
  }

  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast("Expense deleted.");
  }

  function openAddExpense() {
    setExpenseForm({ property: selectedProperty === "All Properties" ? propertiesWithLeases[0] : selectedProperty, category: "Repairs", amount: "", date: `${selectedYear}-01-01`, description: "" });
    setEditingExpense(null);
    setModal("expense");
  }

  function openEditExpense(expense) {
    setExpenseForm(expense);
    setEditingExpense(expense);
    setModal("expense");
  }

  function sendText() {
    let msg = selectedQuick !== null ? QUICK_MESSAGES[selectedQuick] : customMsg;
    if (!msg.trim() || !activeContact) return;
    msg = msg.replace("(Name)", activeContact.name);
    msg = msg.replace("(Property selected)", selectedProperty === "All Properties" ? "a property" : selectedProperty);
    const encoded = encodeURIComponent(msg);
    window.location.href = `sms:${activeContact.phone}?body=${encoded}`;
    setModal(null);
    showToast("Opening Messages…");
  }

  function callContact(contact) {
    window.open(`tel:${contact.phone}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", fontFamily: "'DM Mono', 'Courier New', monospace", color: "#e8e4dc" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      
      <div style={{ padding: "28px 24px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 24 }}>
          THAKKAR<span style={{ color: "#c41e3a" }}> PROPERTIES</span>
        </div>
        
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #2a2a35", overflowX: "auto" }}>
          <button onClick={() => setTab("contacts")} style={{ padding: "10px 16px", borderBottom: tab === "contacts" ? "2px solid #c41e3a" : "2px solid transparent", color: tab === "contacts" ? "#fff" : "#888", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", whiteSpace: "nowrap" }}>CONTACTS</button>
          <button onClick={() => setTab("leases")} style={{ padding: "10px 16px", borderBottom: tab === "leases" ? "2px solid #c41e3a" : "2px solid transparent", color: tab === "leases" ? "#fff" : "#888", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", whiteSpace: "nowrap" }}>LEASES</button>
          <button onClick={() => setTab("expenses")} style={{ padding: "10px 16px", borderBottom: tab === "expenses" ? "2px solid #c41e3a" : "2px solid transparent", color: tab === "expenses" ? "#fff" : "#888", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", whiteSpace: "nowrap" }}>EXPENSES</button>
          <button onClick={() => setTab("summary")} style={{ padding: "10px 16px", borderBottom: tab === "summary" ? "2px solid #c41e3a" : "2px solid transparent", color: tab === "summary" ? "#fff" : "#888", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", whiteSpace: "nowrap" }}>SUMMARY</button>
        </div>
      </div>

      {tab === "contacts" && (
        <div style={{ padding: "0 24px", maxWidth: 680, margin: "0 auto", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#666" }}>PROPERTY</div>
            <button onClick={openAdd} style={{ background: "#c41e3a", color: "#fff", padding: "8px 14px", fontSize: 11, border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>+ ADD</button>
          </div>
          <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} style={{ marginBottom: 16, background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
            <option>All Properties</option>
            {PROPERTIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14, background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {specialties.map(s => <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "11px", cursor: "pointer", border: filter === s ? "1px solid #c41e3a" : "1px solid #2a2a35", background: filter === s ? "#c41e3a" : "transparent", color: filter === s ? "#fff" : "#888", fontFamily: "inherit" }}>{s}</button>)}
          </div>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 40px", display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(c => (
              <div key={c.id} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: "12px", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#c41e3a30", border: "1px solid #c41e3a60", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>{c.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ padding: "4px 11px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: "#c41e3a25", color: "#c41e3a" }}>{c.specialty}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{formatPhone(c.phone)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <button onClick={() => callContact(c)} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", color: "#aaa", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}>📞</button>
                  <button onClick={() => openText(c)} style={{ background: "#c41e3a", color: "#fff", padding: "8px 14px", fontSize: 12, border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>TEXT</button>
                  <button onClick={() => openEdit(c)} style={{ background: "transparent", border: "1px solid #2f2f3f", color: "#666", padding: "8px 11px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>✎</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "leases" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 16, marginTop: 16 }}>LEASE DATES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {leases.map(lease => {
              const daysLeft = getDaysUntil(lease.endDate);
              const isEnding = daysLeft !== null && daysLeft <= 90 && daysLeft > 0;
              const isExpired = daysLeft !== null && daysLeft <= 0;
              
              return (
                <div key={lease.property} style={{ background: "#16161d", border: isExpired ? "1px solid #c05050" : isEnding ? "1px solid #ff9800" : "1px solid #2a2a35", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{lease.property}</div>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Start: {lease.startDate || "Not set"}</div>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>End: {lease.endDate || "Not set"}</div>
                      {daysLeft !== null && (
                        <div style={{ fontSize: 12, color: isExpired ? "#c05050" : isEnding ? "#ff9800" : "#6a8" }}>
                          {isExpired ? "⚠️ EXPIRED" : isEnding ? `⚠️ ${daysLeft} days left` : `✓ ${daysLeft} days left`}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setEditingLease(lease)} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", color: "#c41e3a", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>EDIT</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "expenses" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "#666" }}>EXPENSES (Properties with leases)</div>
            <button onClick={openAddExpense} style={{ background: "#c41e3a", color: "#fff", padding: "8px 14px", fontSize: 11, border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>+ ADD</button>
          </div>
          <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} style={{ marginBottom: 16, background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
            <option>All Properties</option>
            {propertiesWithLeases.map(p => <option key={p}>{p}</option>)}
          </select>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredExpenses.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", fontSize: 12, padding: "20px" }}>No expenses yet</div>
            ) : (
              filteredExpenses.map(expense => (
                <div key={expense.id} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: "12px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ padding: "3px 9px", borderRadius: "16px", fontSize: "10px", fontWeight: "500", background: "#c41e3a25", color: "#c41e3a" }}>{expense.category}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>${expense.amount}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{expense.property}</div>
                      {expense.description && <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{expense.description}</div>}
                      <div style={{ fontSize: 10, color: "#666" }}>{expense.date}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEditExpense(expense)} style={{ background: "transparent", border: "1px solid #2f2f3f", color: "#c41e3a", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>✎</button>
                      <button onClick={() => deleteExpense(expense.id)} style={{ background: "transparent", border: "1px solid #2f2f3f", color: "#c05050", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "summary" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>SELECT YEAR</div>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
              {years.length === 0 ? <option>2026</option> : years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          <div style={{ fontSize: 11, color: "#666", marginBottom: 16 }}>EXPENSES BY PROPERTY &amp; CATEGORY - {selectedYear}</div>
          
          {Object.keys(summaryData).length === 0 ? (
            <div style={{ textAlign: "center", color: "#555", fontSize: 12, padding: "40px 0" }}>No expenses for {selectedYear}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.entries(summaryData).map(([property, categories]) => {
                const propertyTotal = Object.values(categories).reduce((a, b) => a + b, 0);
                return (
                  <div key={property} style={{ background: "#16161d", border: "1px solid #2a2a35", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 12 }}>{property}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {Object.entries(categories).map(([category, amount]) => (
                        <div key={category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#888", paddingLeft: 12, borderLeft: "2px solid #c41e3a" }}>
                          <span>{category}</span>
                          <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>${amount}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid #2f2f3f", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#666" }}>PROPERTY TOTAL</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#c41e3a" }}>${propertyTotal}</span>
                    </div>
                  </div>
                );
              })}
              <div style={{ background: "#1a1a20", border: "1px solid #3a3a50", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>TOTAL {selectedYear}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#c41e3a" }}>${Object.values(summaryData).reduce((sum, cats) => sum + Object.values(cats).reduce((a, b) => a + b, 0), 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {modal === "text" && activeContact && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: "#16161d", border: "1px solid #2f2f3f", borderRadius: "16px", padding: "28px", maxWidth: "420px", width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4, color: "#fff" }}>Text {activeContact.name}</div>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 20 }}>{formatPhone(activeContact.phone)} · {activeContact.specialty}</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>QUICK MESSAGES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {(activeContact.specialty === "Landscaping" || activeContact.specialty === "Snow Removal" || activeContact.specialty === "Duct Cleaning" ? ["Hi (Name)\n\nReaching out in regards to (Property selected)"] : QUICK_MESSAGES).map((m, i) => {
                const preview = m.replace("(Name)", activeContact.name).replace("(Property selected)", selectedProperty === "All Properties" ? "a property" : selectedProperty);
                return <div key={i} onClick={() => { setSelectedQuick(i); setCustomMsg(""); }} style={{ padding: "10px 14px", borderRadius: "8px", border: selectedQuick === i ? "1px solid #c41e3a" : "1px solid #2f2f3f", cursor: "pointer", background: selectedQuick === i ? "#1e1e3a" : "transparent", fontSize: "12px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{preview}</div>;
              })}
            </div>
            <textarea placeholder="Custom message…" value={customMsg} onChange={e => { setCustomMsg(e.target.value); setSelectedQuick(null); }} rows={3} style={{ marginBottom: 18, background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px", resize: "none" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, background: "#1e1e28", border: "1px solid #2f2f3f", color: "#888", padding: "11px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={sendText} style={{ flex: 2, background: "#c41e3a", color: "#fff", padding: "11px", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }} disabled={selectedQuick === null && !customMsg.trim()}>SEND →</button>
            </div>
          </div>
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: "#16161d", border: "1px solid #2f2f3f", borderRadius: "16px", padding: "28px", maxWidth: "420px", width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 22, color: "#fff" }}>{modal === "add" ? "Add Contact" : "Edit Contact"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>NAME</div>
                <input placeholder="Contact name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>PHONE</div>
                <input placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>SPECIALTY</div>
                <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {modal === "edit" && <button onClick={() => deleteContact(activeContact.id)} style={{ background: "#2a1a1a", border: "1px solid #5a2a2a", color: "#c05050", padding: "11px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
              <button onClick={() => setModal(null)} style={{ flex: 1, background: "#1e1e28", border: "1px solid #2f2f3f", color: "#888", padding: "11px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={saveContact} style={{ flex: 2, background: "#c41e3a", color: "#fff", padding: "11px", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>{modal === "add" ? "ADD" : "SAVE"}</button>
            </div>
          </div>
        </div>
      )}

      {modal === "expense" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }} onClick={() => setModal(null)}>
          <div style={{ background: "#16161d", border: "1px solid #2f2f3f", borderRadius: "16px", padding: "28px", maxWidth: "420px", width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 22, color: "#fff" }}>{editingExpense ? "Edit Expense" : "Add Expense"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>PROPERTY</div>
                <select value={expenseForm.property} onChange={e => setExpenseForm(f => ({ ...f, property: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
                  {propertiesWithLeases.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>CATEGORY</div>
                <select value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>AMOUNT</div>
                <input type="number" placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>DATE</div>
                <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>DESCRIPTION (optional)</div>
                <input placeholder="e.g. Roof repair" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, background: "#1e1e28", border: "1px solid #2f2f3f", color: "#888", padding: "11px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={saveExpense} style={{ flex: 2, background: "#c41e3a", color: "#fff", padding: "11px", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>{editingExpense ? "SAVE" : "ADD"}</button>
            </div>
          </div>
        </div>
      )}

      {editingLease && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }} onClick={() => setEditingLease(null)}>
          <div style={{ background: "#16161d", border: "1px solid #2f2f3f", borderRadius: "16px", padding: "28px", maxWidth: "420px", width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 22, color: "#fff" }}>Edit Lease - {editingLease.property}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>START DATE</div>
                <input type="date" value={editingLease.startDate} onChange={e => setEditingLease({ ...editingLease, startDate: e.target.value })} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>END DATE</div>
                <input type="date" value={editingLease.endDate} onChange={e => setEditingLease({ ...editingLease, endDate: e.target.value })} style={{ background: "#1e1e28", border: "1px solid #2f2f3f", borderRadius: "8px", color: "#e8e4dc", padding: "10px 14px", width: "100%", fontFamily: "inherit", fontSize: "13px" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditingLease(null)} style={{ flex: 1, background: "#1e1e28", border: "1px solid #2f2f3f", color: "#888", padding: "11px", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={saveLease} style={{ flex: 2, background: "#c41e3a", color: "#fff", padding: "11px", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>SAVE</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#2a2a3a", border: "1px solid #3a3a50", borderRadius: "10px", padding: "11px 22px", fontSize: "13px", zIndex: 999 }}>{toast}</div>}
    </div>
  );
}
