import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ReportDetail.css';
import ThemeSelector from './ThemeSelector';

const purposeLabel = (code) => {
  const map = { 1: 'House Building', 2: 'Education', 3: 'Marriage', 4: 'Medical', 5: 'Vehicle', 6: 'Final Withdrawal' };
  return code != null ? (map[Number(code)] || `Purpose ${code}`) : '—';
};

const fmt = (val) => {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const cur = (val) => {
  if (val == null) return '—';
  return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

const REPORT_META = {
  'contingent-bill':  { label: 'Contingent Bill',   icon: '🧾' },
  'cfa':              { label: 'CFA',                icon: '📋' },
  'calculation-sheet':{ label: 'Calculation Sheet',  icon: '🧮' },
  'application':      { label: 'Application',        icon: '📝' },
  'schedule':         { label: 'Schedule',           icon: '📅' },
};

export default function ReportDetail() {
  const navigate = useNavigate();
  const { persNumber, reportType } = useParams();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = location.state?.user || null;
  const meta = REPORT_META[reportType] || { label: reportType, icon: '📄' };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleBack = () => {
    try { window.__ANIMATE_NAV = true; } catch (e) {}
    navigate(`/gpf/reports/user/${persNumber}`, { state: { user } });
  };

  return (
    <div className="rd-page">
      <nav className="top-nav no-print">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBack}>
            <span>←</span> Back
          </button>
          <span className="nav-brand">{meta.icon} {meta.label}</span>
          <span className="nav-time">{formatTime(currentTime)}</span>
        </div>
        <div className="nav-right">
          <div className="theme-selector-compact">
            <ThemeSelector compact={true} />
          </div>
          <button className="btn btn-nav btn-print" onClick={() => window.print()}>
            🖨 Print
          </button>
          <button className="btn btn-nav btn-profile" onClick={() => { try { window.__ANIMATE_NAV = true } catch (e) {}; navigate('/profile'); }}>
            <span className="profile-icon">👤</span>
            <span className="profile-name">User Profile</span>
          </button>
        </div>
      </nav>

      <main className="rd-main">
        {!user && (
          <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>
        )}

        {user && (
          <div className="rd-doc">
            {/* Doc header */}
            <div className="rd-doc-top">
              <div>
                <div className="rd-org">DEFENCE RESEARCH & DEVELOPMENT ORGANISATION</div>
                <div className="rd-org-sub">General Provident Fund — {meta.label}</div>
              </div>
              <div className="rd-doc-meta">
                <div>Date: {fmt(new Date())}</div>
                <div>Ref: GPF/{user.gpfAccountNumber || '—'}</div>
              </div>
            </div>

            <hr className="rd-hr" />

            {/* Employee info strip */}
            <div className="rd-emp-strip">
              <div className="rd-emp-field"><span>Name</span><strong>{user.name || '—'}</strong></div>
              <div className="rd-emp-field"><span>Pers No.</span><strong>{user.persNumber || '—'}</strong></div>
              <div className="rd-emp-field"><span>GPF A/C</span><strong>{user.gpfAccountNumber || '—'}</strong></div>
              <div className="rd-emp-field"><span>Designation</span><strong>{user.designation || '—'}</strong></div>
              <div className="rd-emp-field"><span>DOB</span><strong>{fmt(user.dob)}</strong></div>
            </div>

            <hr className="rd-hr" />

            {/* Report-specific body */}
            {reportType === 'contingent-bill' && <ContingentBill user={user} />}
            {reportType === 'cfa'             && <CFA user={user} />}
            {reportType === 'calculation-sheet' && <CalculationSheet user={user} />}
            {reportType === 'application'     && <Application user={user} />}
            {reportType === 'schedule'        && <Schedule user={user} />}

            <hr className="rd-hr" />
            <div className="rd-footer">
              <div className="rd-sig-block">
                <div className="rd-sig-line" />
                <div>Applicant Signature</div>
              </div>
              <div className="rd-sig-block">
                <div className="rd-sig-line" />
                <div>Accounts Officer</div>
              </div>
              <div className="rd-sig-block">
                <div className="rd-sig-line" />
                <div>Sanctioning Authority</div>
              </div>
            </div>
            <p className="rd-system-note">System-generated document — DRDO GPF Management System</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── 1. Contingent Bill ─────────────────────────────────── */
function ContingentBill({ user }) {
  return (
    <section className="rd-section">
      <h3 className="rd-section-title">Contingent Bill</h3>
      <table className="rd-table">
        <tbody>
          <tr><td className="rd-lbl">Head of Account</td><td>GPF Advance / Withdrawal</td></tr>
          <tr><td className="rd-lbl">Purpose</td><td>{purposeLabel(user.purpose)}</td></tr>
          <tr><td className="rd-lbl">Amount Sanctioned</td><td className="rd-amt">{cur(user.applAmt)}</td></tr>
          <tr><td className="rd-lbl">GPF Year</td><td>{user.gpfYear || '—'}</td></tr>
          <tr><td className="rd-lbl">Closing Balance</td><td className="rd-amt">{cur(user.closingBalance)}</td></tr>
          <tr><td className="rd-lbl">Application Date</td><td>{fmt(user.applDate)}</td></tr>
          <tr><td className="rd-lbl">GPF Type</td><td>{user.gpfType === 'F' ? 'Final Withdrawal' : user.gpfType === 'E' ? 'Partial Withdrawal' : '—'}</td></tr>
        </tbody>
      </table>
    </section>
  );
}

/* ── 2. CFA ─────────────────────────────────────────────── */
function CFA({ user }) {
  return (
    <section className="rd-section">
      <h3 className="rd-section-title">Competent Financial Authority (CFA)</h3>
      <p className="rd-para">
        Certified that the advance / withdrawal of <strong>{cur(user.applAmt)}</strong> from the
        General Provident Fund Account No. <strong>{user.gpfAccountNumber || '—'}</strong> of
        Shri/Smt. <strong>{user.name || '—'}</strong>, {user.designation || '—'}, is sanctioned
        for the purpose of <strong>{purposeLabel(user.purpose)}</strong> as per the rules in force.
      </p>
      <table className="rd-table">
        <tbody>
          <tr><td className="rd-lbl">Fund Balance (as on {user.gpfYear || '—'})</td><td className="rd-amt">{cur(user.closingBalance)}</td></tr>
          <tr><td className="rd-lbl">Amount Sanctioned</td><td className="rd-amt">{cur(user.applAmt)}</td></tr>
          <tr><td className="rd-lbl">Balance After Sanction</td>
            <td className="rd-amt">
              {user.closingBalance != null && user.applAmt != null
                ? cur(Number(user.closingBalance) - Number(user.applAmt))
                : '—'}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* ── 3. Calculation Sheet ───────────────────────────────── */
function CalculationSheet({ user }) {
  const sub = Number(user.gpfSub || 0);
  const ret = Number(user.gpfRet || 0);
  const closing = Number(user.closingBalance || 0);
  const appl = Number(user.applAmt || 0);

  return (
    <section className="rd-section">
      <h3 className="rd-section-title">Calculation Sheet</h3>
      <table className="rd-table rd-calc">
        <thead>
          <tr><th>Particulars</th><th className="rd-amt">Amount (₹)</th></tr>
        </thead>
        <tbody>
          <tr><td>Opening Balance (Closing of {user.gpfYear || '—'})</td><td className="rd-amt">{cur(closing)}</td></tr>
          <tr><td>GPF Subscription</td><td className="rd-amt">{cur(sub)}</td></tr>
          <tr><td>GPF Refund / Recovery</td><td className="rd-amt">{cur(ret)}</td></tr>
          <tr className="rd-total-row">
            <td>Total Available Balance</td>
            <td className="rd-amt">{cur(closing + sub + ret)}</td>
          </tr>
          <tr><td>Amount Applied For</td><td className="rd-amt">{cur(appl)}</td></tr>
          <tr className="rd-total-row">
            <td>Balance After Withdrawal</td>
            <td className="rd-amt">{cur(closing + sub + ret - appl)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

/* ── 4. Application ─────────────────────────────────────── */
function Application({ user }) {
  return (
    <section className="rd-section">
      <h3 className="rd-section-title">GPF Withdrawal / Advance Application</h3>
      <p className="rd-para">
        I, <strong>{user.name || '___________'}</strong>, Personnel No. <strong>{user.persNumber || '___'}</strong>,
        hereby apply for a {user.gpfType === 'F' ? 'final withdrawal' : 'temporary advance'} of
        <strong> {cur(user.applAmt)}</strong> from my GPF Account No. <strong>{user.gpfAccountNumber || '—'}</strong>
        for the purpose of <strong>{purposeLabel(user.purpose)}</strong>.
      </p>
      <table className="rd-table">
        <tbody>
          <tr><td className="rd-lbl">Application Date</td><td>{fmt(user.applDate)}</td></tr>
          <tr><td className="rd-lbl">Amount Requested</td><td className="rd-amt">{cur(user.applAmt)}</td></tr>
          <tr><td className="rd-lbl">Purpose</td><td>{purposeLabel(user.purpose)}</td></tr>
          <tr><td className="rd-lbl">House Address</td><td>{user.houseAddr || '—'}</td></tr>
          <tr><td className="rd-lbl">Enclosures Attached</td><td>{user.enclosers === 'Y' ? 'Yes' : user.enclosers === 'N' ? 'No' : '—'}</td></tr>
          <tr><td className="rd-lbl">GPF Closing Balance</td><td className="rd-amt">{cur(user.closingBalance)}</td></tr>
        </tbody>
      </table>
    </section>
  );
}

/* ── 5. Schedule ────────────────────────────────────────── */
function Schedule({ user }) {
  const principal = Number(user.applAmt || 0);
  const months = 24;
  const monthly = principal > 0 ? Math.ceil(principal / months) : 0;

  const rows = [];
  let balance = principal;
  const startDate = user.applDate ? new Date(user.applDate) : new Date();
  for (let i = 1; i <= months; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    const payment = i === months ? balance : monthly;
    balance -= payment;
    rows.push({ no: i, date: fmt(d), payment, balance: Math.max(0, balance) });
  }

  return (
    <section className="rd-section">
      <h3 className="rd-section-title">Repayment Schedule</h3>
      <p className="rd-para">
        Principal: <strong>{cur(principal)}</strong> &nbsp;|&nbsp;
        Instalments: <strong>{months} months</strong> &nbsp;|&nbsp;
        Monthly: <strong>{cur(monthly)}</strong>
      </p>
      <div className="rd-schedule-wrap">
        <table className="rd-table rd-calc">
          <thead>
            <tr><th>#</th><th>Due Date</th><th className="rd-amt">Instalment</th><th className="rd-amt">Balance</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.no}>
                <td>{r.no}</td>
                <td>{r.date}</td>
                <td className="rd-amt">{cur(r.payment)}</td>
                <td className="rd-amt">{cur(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
