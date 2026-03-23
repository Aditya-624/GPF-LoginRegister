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
        {reportType === 'application' ? (
          <Application user={user} />
        ) : reportType === 'schedule' ? (
          <Schedule user={user} />
        ) : reportType === 'calculation-sheet' ? (
          <>
            {!user && (
              <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>
            )}
            {user && <CalculationSheet user={user} />}
          </>
        ) : (
          <>
            {!user && (
              <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>
            )}

            {user && (
              <div className="rd-doc">
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

                <div className="rd-emp-strip">
                  <div className="rd-emp-field"><span>Name</span><strong>{user.name || '—'}</strong></div>
                  <div className="rd-emp-field"><span>Pers No.</span><strong>{user.persNumber || '—'}</strong></div>
                  <div className="rd-emp-field"><span>GPF A/C</span><strong>{user.gpfAccountNumber || '—'}</strong></div>
                  <div className="rd-emp-field"><span>Designation</span><strong>{user.designation || '—'}</strong></div>
                  <div className="rd-emp-field"><span>DOB</span><strong>{fmt(user.dob)}</strong></div>
                </div>

                <hr className="rd-hr" />

                {reportType === 'contingent-bill' && <ContingentBill user={user} />}
                {reportType === 'cfa'             && <CFA user={user} />}

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
          </>
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
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.persNumber) { setLoading(false); return; }
    const token = localStorage.getItem('authToken');
    fetch(`http://localhost:8081/api/reports/calculation-sheet/${encodeURIComponent(user.persNumber)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setApiData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.persNumber]);

  if (loading) return <div className="cs-loading">Loading…</div>;

  // Route to TA variant for Temporary Advance
  const gpfType = apiData?.gpfType || user?.gpfType;
  if (gpfType === 'E') return <CalculationSheetTA user={user} apiData={apiData} />;

  const d   = apiData || {};
  const n   = (v) => Number(v || 0);
  const c   = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

  const name        = d.name          || user?.name          || '—';
  const gpfAccNo    = d.gpfAccountNumber || user?.gpfAccountNumber || '—';
  const persNo      = d.persNumber    || user?.persNumber    || '—';
  const designation = d.designation  || user?.designation   || '—';
  const gpfYear     = d.gpfYear      || user?.gpfYear        || '—';
  const applDate    = d.applDate     || user?.applDate;
  const retDate     = d.dateOfRetirement || user?.dateOfRetirement;

  const opening    = n(d.closingBalance    ?? user?.closingBalance);
  const totalSub   = n(d.totalSubscription ?? user?.gpfSub);
  const totalRet   = n(d.totalRefund       ?? user?.gpfRet);
  const interest   = n(d.interestAmount);
  const applAmt    = n(d.applAmt           ?? user?.applAmt);
  const grandTotal = opening + totalSub + totalRet + interest;
  const balAfter   = grandTotal - applAmt;

  const subs    = d.subscriptions || [];
  const subRows = subs.filter(s => n(s.gpfSub) > 0);
  const retRows = subs.filter(s => n(s.gpfRet) > 0);

  // date range label e.g. "FROM Mar-2023 TO Feb-2024"
  const dateRange = (rows) => {
    if (!rows.length) return '—';
    const first = fmtMonthYear(rows[0].date);
    const last  = fmtMonthYear(rows[rows.length - 1].date);
    return first === last ? first : `FROM ${first} TO ${last}`;
  };

  // service remaining
  const yearsLeft = retDate
    ? Math.max(0, Math.floor((new Date(retDate) - new Date()) / (1000 * 60 * 60 * 24 * 365)))
    : '—';

  return (
    <div className="cs-a4">

      {/* ── TOP INFO ROW ── */}
      <div className="cs-top-row">
        <span><span className="cs-lbl">ID NO:</span> {persNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span className="cs-top-right">
          <span><span className="cs-lbl">DESIG:</span> {designation}</span><br />
          <span><span className="cs-lbl">GPF A/C NO:</span> {gpfAccNo}</span>
        </span>
      </div>

      <div className="cs-divider" />

      {/* ── OPENING BALANCE ── */}
      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - &gt;</span>
        <span className="cs-ob-amt">{c(opening)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── SUBSCRIPTION CREDITS ── */}
      <div className="cs-section-label">SUBSCRIPTION CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Subscription</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">{subRows.length ? dateRange(subRows) : '—'}</span>
        <span className="cs-col-sub">{c(totalSub)}</span>
        <span className="cs-col-total">{c(totalSub)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── ADVANCE REFUND CREDITS ── */}
      <div className="cs-section-label">ADVANCE REFUND CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Refund</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">{retRows.length ? dateRange(retRows) : '—'}</span>
        <span className="cs-col-sub">{c(totalRet)}</span>
        <span className="cs-col-total">{c(totalRet)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── RECOVERY FROM 7CPC ARREARS ── */}
      <div className="cs-section-label">RECOVERY FROM 7CPC ARREARS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">GPF Recovery</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">—</span>
        <span className="cs-col-sub">{c(interest)}</span>
        <span className="cs-col-total">{c(interest)}</span>
      </div>

      {/* ── TOTAL ── */}
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{c(grandTotal)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── WITHDRAWALS ── */}
      <div className="cs-withdrawal-row">
        <span className="cs-withdrawal-name">WITHDRAWALS</span>
        <span className="cs-withdrawal-mid">
          <span className="cs-cols-hdr-inline">Total</span>
          <span>{c(applAmt)}</span>
        </span>
        <span className="cs-withdrawal-right">
          <span className="cs-total-balance-lbl">TOTAL BALANCE</span>
          <span className="cs-balance-amt">{c(balAfter)}</span>
        </span>
      </div>

      <div className="cs-divider" />

      {/* ── BOTTOM INFO ── */}
      <div className="cs-bottom-info">
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">AMOUNT PROPOSED TO WITHDRAWN</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{c(applAmt)}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">SERVICE AS ON SANCTION DATE</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{applDate ? fmt(applDate) : '—'}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">LEFT OVER SERVICE</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{yearsLeft !== '—' ? `${yearsLeft} Years` : '—'}</span>
        </div>
      </div>

      {/* ── SIGNATURES ── */}
      <div className="cs-sig-area">
        <div className="cs-sig-right">
          <div className="cs-sig-bracket">( _________________________ )</div>
          <div className="cs-sig-role">for Director DRDL</div>
        </div>
      </div>

      <div className="cs-countersign">
        <div>(ACCOUNTS OFFICER FOR Director DRDL)</div>
      </div>

      <p className="cs-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}

/* ── 3b. Calculation Sheet — Temporary Advance (gpfType E) ── */
function CalculationSheetTA({ user, apiData }) {
  const d   = apiData || {};
  const n   = (v) => Number(v || 0);
  const c   = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

  const name        = d.name             || user?.name             || '—';
  const gpfAccNo    = d.gpfAccountNumber || user?.gpfAccountNumber || '—';
  const persNo      = d.persNumber       || user?.persNumber       || '—';
  const designation = d.designation      || user?.designation      || '—';

  const opening    = n(d.closingBalance    ?? user?.closingBalance);
  const totalSub   = n(d.totalSubscription ?? user?.gpfSub);
  const totalRet   = n(d.totalRefund       ?? user?.gpfRet);
  const interest   = n(d.interestAmount);
  const applAmt    = n(d.applAmt           ?? user?.applAmt);
  const grandTotal = opening + totalSub + totalRet + interest;
  const balance    = grandTotal - applAmt;

  const subs    = d.subscriptions || [];
  const subRows = subs.filter(s => n(s.gpfSub) > 0);
  const retRows = subs.filter(s => n(s.gpfRet) > 0);

  const dateRange = (rows) => {
    if (!rows.length) return '—';
    const first = fmtMonthYear(rows[0].date);
    const last  = fmtMonthYear(rows[rows.length - 1].date);
    return first === last ? first : `FROM ${first} TO ${last}`;
  };

  // Advance details — derived or from API
  const outstandingAdv  = n(d.outstandingAdvance  ?? user?.outstandingAdvance);
  const instalment      = n(d.instalment          ?? user?.instalment);
  const noOfInstalments = d.noOfInstalments       ?? user?.noOfInstalments ?? '—';
  const commencementDate = d.commencementDate     ?? user?.commencementDate;
  const consolidatedAdv = outstandingAdv + applAmt;

  return (
    <div className="cs-a4">

      {/* ── TOP INFO BAR ── */}
      <div className="csta-top-bar">
        <span><span className="cs-lbl">ID NO:</span> {persNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span><span className="cs-lbl">DESIG:</span> {designation}</span>
        <span><span className="cs-lbl">GPF A/C NO:</span> {gpfAccNo}</span>
      </div>

      <div className="cs-divider" />

      {/* ── OPENING BALANCE ── */}
      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - &gt;</span>
        <span className="cs-ob-amt">{c(opening)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── SUBSCRIPTION CREDITS ── */}
      <div className="cs-section-label">SUBSCRIPTION CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Subscription</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">{subRows.length ? dateRange(subRows) : '—'}</span>
        <span className="cs-col-sub">{c(totalSub)}</span>
        <span className="cs-col-total">{c(totalSub)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── ADVANCE REFUND CREDITS ── */}
      <div className="cs-section-label">ADVANCE REFUND CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Refund</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">{retRows.length ? dateRange(retRows) : '—'}</span>
        <span className="cs-col-sub">{c(totalRet)}</span>
        <span className="cs-col-total">{c(totalRet)}</span>
      </div>

      <div className="cs-divider" />

      {/* ── RECOVERY FROM 7CPC ARREARS ── */}
      <div className="cs-section-label">RECOVERY FROM 7CPC ARREARS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">GPF Recovery</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">—</span>
        <span className="cs-col-sub">{c(interest)}</span>
        <span className="cs-col-total">{c(interest)}</span>
      </div>

      {/* ── TOTAL ── */}
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{c(grandTotal)}</span>
      </div>

      {/* ── WITHDRAWALS + BALANCE ── */}
      <div className="cs-withdrawal-row">
        <span className="cs-withdrawal-name">WITHDRAWALS</span>
        <span className="cs-withdrawal-mid">
          <span className="cs-cols-hdr-inline">IN @ Rs. 0</span>
          <span>{c(applAmt)}</span>
        </span>
        <span className="cs-withdrawal-right">
          <span className="cs-total-balance-lbl">BALANCE</span>
          <span className="cs-balance-amt">{c(balance)}</span>
        </span>
      </div>

      {/* ── ADVANCE DETAILS SECTION ── */}
      <div className="csta-adv-divider" />

      <div className="csta-adv-section">
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">OUTSTANDING BALANCE IN ADVANCE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{c(outstandingAdv)}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">ADD AMOUNT NOW PAYABLE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{c(applAmt)}</span>
        </div>
        <div className="csta-adv-row csta-adv-row-total">
          <span className="csta-adv-lbl">CURRENT CONSOLIDATED ADVANCE AMOUNT</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val csta-adv-val-bold">{c(consolidatedAdv)}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">INSTALMENT AMOUNT</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{instalment ? c(instalment) : '—'}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">NO. OF INSTALMENT</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{noOfInstalments}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">COMMENCEMENT OF RECOVERY FROM</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{commencementDate ? fmtMonthYear(commencementDate) : '—'}</span>
        </div>
      </div>

      {/* ── SIGNATURES ── */}
      <div className="cs-sig-area">
        <div className="cs-sig-right">
          <div className="cs-sig-bracket">( _________________________ )</div>
          <div className="cs-sig-role">for Director DRDL</div>
        </div>
      </div>

      <div className="cs-countersign">
        <div>(Counter Signed)</div>
        <div>ACCOUNTS OFFICER</div>
        <div>for Director DRDL</div>
      </div>

      <p className="cs-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}

/* helpers */
function fmtMonthYear(val) {
  if (!val) return '—';
  const d = new Date(val);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function amtWords(num) {
  if (!num || num === 0) return 'Zero';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function below100(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
  }
  function below1000(n) {
    if (n < 100) return below100(n);
    return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + below100(n%100) : '');
  }
  const n = Math.floor(num);
  if (n === 0) return 'Zero';
  let result = '';
  if (n >= 10000000) result += below1000(Math.floor(n/10000000)) + ' Crore ';
  if (n >= 100000)   result += below1000(Math.floor((n%10000000)/100000)) + ' Lakh ';
  if (n >= 1000)     result += below1000(Math.floor((n%100000)/1000)) + ' Thousand ';
  result += below1000(n % 1000);
  return result.trim() + ' Only';
}

/* ── 4. Application ─────────────────────────────────────── */
function Application({ user }) {
  // Temporary Advance ('E')
  if (user?.gpfType === 'E') {
    return <ApplicationTemporaryAdvance user={user} />;
  }
  const [fields, setFields] = useState({
    name:           user?.name || '',
    accountNumber:  user?.gpfAccountNumber || '',
    designation:    user?.designation || '',
    basicPay:       user?.basicPay != null ? String(user.basicPay) : '',
    joiningSuper:   '',
    dob:            user?.dob ? new Date(user.dob).toLocaleDateString('en-IN') : '',
    balance:        user?.closingBalance != null ? String(user.closingBalance) : '',
    amountRequired: user?.applAmt != null ? String(user.applAmt) : '',
    purpose:        '',
    rules:          '15(1)(B)(e) of GPF(CS) Rules 1960',
    prevWithdrawal: '',
    accountsOfficer:'The Controller of Defence Accounts (R&D), New Delhi',
  });

  const set = (k, v) => setFields(p => ({ ...p, [k]: v }));

  const rows = [
    { no: 1,  label: 'Name of the subscriber',                                    key: 'name' },
    { no: 2,  label: 'Account Number',                                             key: 'accountNumber' },
    { no: 3,  label: 'Designation / I.D. No.',                                    key: 'designation' },
    { no: 4,  label: 'Basic Pay',                                                  key: 'basicPay' },
    { no: 5,  label: 'Date of joining service & Superannuation',                   key: 'joiningSuper' },
    { no: 6,  label: 'Date of Birth',                                              key: 'dob' },
    { no: 7,  label: 'Balance at credit of the subscriber on the date of application', key: 'balance' },
    { no: 8,  label: 'Amount of Withdrawal required',                              key: 'amountRequired' },
    { no: '9a', label: 'Purpose for which the advance is required',                key: 'purpose' },
    { no: '9b', label: 'Rules under which the request is covered',                 key: 'rules' },
    { no: 10, label: 'Whether any withdrawal was taken for the same purpose earlier', key: 'prevWithdrawal' },
    { no: 11, label: 'Name of the Accounts officer maintaining the provident account', key: 'accountsOfficer' },
  ];

  return (
    <div className="appl-a4">
      {/* Title */}
      <div className="appl-title-block">
        <div className="appl-title-main">FORM FOR APPLICATION OF FINAL WITHDRAWAL FROM G.P. FUND</div>
        <div className="appl-title-office">OFFICE: DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY, HYDERABAD</div>
      </div>

      {/* Fields */}
      <table className="appl-table">
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="appl-row">
              <td className="appl-no">{r.no}.</td>
              <td className="appl-label">{r.label}</td>
              <td className="appl-colon">:</td>
              <td className="appl-value">
                {r.key === 'accountsOfficer' ? (
                  <span className="appl-input" style={{ display: 'block' }}>{fields[r.key]}</span>
                ) : (
                  <input
                    className="appl-input"
                    value={fields[r.key]}
                    onChange={e => set(r.key, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signature */}
      <div className="appl-sig-section">
        <div className="appl-sig-block">
          <div className="appl-sig-line" />
          <div className="appl-sig-label">SIGNATURE OF THE APPLICANT</div>
        </div>
      </div>

      <p className="appl-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}

/* ── 5. Application — Temporary Advance ────────────────── */
function ApplicationTemporaryAdvance({ user }) {
  const [f, setF] = useState({
    name:           user?.name || '',
    accountNumber:  user?.gpfAccountNumber || '',
    designation:    user?.designation || '',
    basicPay:       user?.basicPay != null ? String(user.basicPay) : '',
    balance:        user?.closingBalance != null ? String(user.closingBalance) : '',
    advanceTaken:   '',
    balanceOutstanding: '',
    subI:           '',
    subII:          '',
    amountRequired: user?.applAmt != null ? String(user.applAmt) : '',
    purpose:        '',
    rules:          '12(1)(c) GPF(CS) Rules 1960',
    consolidatedAdv:'',
    instalments:    '',
    dateAppointment:'',
    dateBirth:      user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    dateSuperannuation: '',
    pecuniary:      '',
    dated:          new Date().toISOString().split('T')[0],
  });

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const inp = (k, type = 'text') => (
    <input className="ta-input" type={type} value={f[k]} onChange={e => s(k, e.target.value)} />
  );

  return (
    <div className="ta-a4">
      {/* Title */}
      <div className="ta-title-block">
        <div className="ta-title-line">MINISTRY OF DEFENCE</div>
        <div className="ta-title-line">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="ta-title-line ta-title-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
      </div>

      {/* Fields */}
      <table className="ta-table">
        <tbody>
          <tr className="ta-row">
            <td className="ta-no">1.</td>
            <td className="ta-label">NAME OF THE SUBSCRIBER</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('name')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">2.</td>
            <td className="ta-label">ACCOUNT NUMBER</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('accountNumber')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">3.</td>
            <td className="ta-label">DESIGNATION / T.NO</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('designation')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">4.</td>
            <td className="ta-label">BASIC PAY</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('basicPay')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">5.</td>
            <td className="ta-label">BALANCE AT CREDIT OF THE SUBSCRIBER ON THE DATE OF APPLICATION AS PER WORKING ENCLOSED IS</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('balance')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">6.</td>
            <td className="ta-label">AMOUNT OF PREVIOUS ADVANCE / ADVANCE-OUTSTANDING</td>
            <td className="ta-colon">:</td>
            <td className="ta-val"></td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">AMOUNT OF ADVANCE TAKEN</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('advanceTaken')}</td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">BALANCE OUTSTANDING</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('balanceOutstanding')}</td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">i) Rs.</td>
            <td className="ta-colon"></td>
            <td className="ta-val">{inp('subI')}</td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">ii) Rs.</td>
            <td className="ta-colon"></td>
            <td className="ta-val">{inp('subII')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">7.</td>
            <td className="ta-label">AMOUNT OF ADVANCE REQUIRED</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('amountRequired')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">8.</td>
            <td className="ta-label">a) PURPOSE FOR WHICH THE ADVANCE IS REQUIRED</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('purpose')}</td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">b) RULES UNDER WHICH THE REQUEST IS COVERED</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('rules')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">9.</td>
            <td className="ta-label">a) AMOUNT OF CONSOLIDATED ADVANCE</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('consolidatedAdv')}</td>
          </tr>
          <tr className="ta-row ta-sub">
            <td className="ta-no"></td>
            <td className="ta-label ta-indent">b) NUMBER OF MONTHLY INSTALMENTS IN WHICH CONSOLIDATED ADVANCE IS PROPOSED TO BE RECOVERED</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('instalments')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no">10.</td>
            <td className="ta-label">DATE OF APPOINTMENT</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('dateAppointment', 'date')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no"></td>
            <td className="ta-label">DATE OF BIRTH</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('dateBirth', 'date')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no"></td>
            <td className="ta-label">DATE OF SUPERANNUATION</td>
            <td className="ta-colon">:</td>
            <td className="ta-val">{inp('dateSuperannuation', 'date')}</td>
          </tr>
          <tr className="ta-row">
            <td className="ta-no"></td>
            <td className="ta-label" colSpan={3}>
              FULL PARTICULARS OF THE PECUNIARY CIRCUMSTANCES OF THE SUBSCRIBER JUSTIFYING FOR APPLYING FOR TEMPORARY ADVANCE:
              <textarea
                className="ta-textarea"
                value={f.pecuniary}
                onChange={e => s('pecuniary', e.target.value)}
                rows={3}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Declaration */}
      <div className="ta-declaration">
        I certify that particulars given above are correct and complete to the best of knowledge and belief and nothing has been concealed by me.
      </div>

      {/* Footer */}
      <div className="ta-footer">
        <div className="ta-footer-left">
          <span className="ta-footer-label">DATED:</span>
          <input className="ta-input ta-date-input" type="date" value={f.dated} onChange={e => s('dated', e.target.value)} />
        </div>
        <div className="ta-footer-right">
          <div className="ta-sig-line" />
          <div className="ta-sig-label">SIGNATURE OF THE APPLICANT</div>
        </div>
      </div>

      <p className="appl-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}

/* ── 6. Schedule (GPF Debit Schedule) ───────────────────── */
function Schedule({ user }) {
  // Table row state (only fields not from DB)
  const [advAmt, setAdvAmt]         = useState('');
  const [prevAdv, setPrevAdv]       = useState('');
  const [consAdv, setConsAdv]       = useState('');
  const [noInst, setNoInst]         = useState('');
  const [rateRefund, setRateRefund] = useState('');
  const [billSuffix, setBillSuffix] = useState('');

  // Dates come from DB via user object
  const applDate = user?.applDate ? fmt(user.applDate) : '—';

  return (
    <div className="sch-a4">

      {/* Header row: unit code right-aligned */}
      <div className="sch-unit-code">UNIT CODE: DRDL 360000032</div>

      {/* Main title block — underlined as a whole block */}
      <div className="sch-title-block">
        <div className="sch-title-line">MINISTRY OF DEFENCE</div>
        <div className="sch-title-line">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="sch-title-line sch-title-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
        <div className="sch-title-main">GPF DEBIT SCHEDULE</div>
      </div>

      {/* Section 1 — Reference: no gap between the two parts */}
      <div className="sch-ref-block">
        <span>APPENDIX 'B' TO A O 060255 FROM 'B' OF GPF</span>
      </div>

      {/* Section 2 — Subscriber Info (read-only from DB) */}
      <div className="sch-info-grid">
        <div className="sch-field-row">
          <span className="sch-label">GPF Account No:</span>
          <span className="sch-value">{user?.gpfAccountNumber || '—'}</span>
        </div>
        <div className="sch-field-row">
          <span className="sch-label">Name of the Subscriber:</span>
          <span className="sch-value">{user?.name || '—'}</span>
        </div>
        <div className="sch-field-row">
          <span className="sch-label">Designation:</span>
          <span className="sch-value">{user?.designation || '—'}</span>
        </div>
        <div className="sch-field-row">
          <span className="sch-label">UNIT:</span>
          <span className="sch-value">DRDL</span>
        </div>
        <div className="sch-field-row">
          <span className="sch-label">Amount of Advance to be Debited:</span>
          <span className="sch-value">{user?.applAmt ? `Rs. ${Number(user.applAmt).toLocaleString('en-IN')}` : '—'}</span>
        </div>
      </div>

      {/* Section 3 — Data Table */}
      <div className="sch-table-wrap">
        <table className="sch-table">
          <thead>
            <tr>
              <th>Amount of advance Rs.</th>
              <th>Previous advance O/S</th>
              <th>Consolidated advance Rs.</th>
              <th>No. of installments</th>
              <th>Rate of refund Rs.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input className="sch-cell-input no-print" value={advAmt} onChange={e => setAdvAmt(e.target.value)} placeholder="—" />
                <span className="print-only">{advAmt}</span>
              </td>
              <td>
                <input className="sch-cell-input no-print" value={prevAdv} onChange={e => setPrevAdv(e.target.value)} placeholder="—" />
                <span className="print-only">{prevAdv}</span>
              </td>
              <td>
                <input className="sch-cell-input no-print" value={consAdv} onChange={e => setConsAdv(e.target.value)} placeholder="—" />
                <span className="print-only">{consAdv}</span>
              </td>
              <td>
                <input className="sch-cell-input no-print" value={noInst} onChange={e => setNoInst(e.target.value)} placeholder="—" />
                <span className="print-only">{noInst}</span>
              </td>
              <td>
                <input className="sch-cell-input no-print" value={rateRefund} onChange={e => setRateRefund(e.target.value)} placeholder="—" />
                <span className="print-only">{rateRefund}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 4 — Dated left, Signature right */}
      <div className="sch-sign-section">
        <div className="sch-dated-row">
          <span className="sch-label">Dated:</span>
          <span className="sch-value">{applDate}</span>
        </div>
        <div className="sch-sig-block">
          <div className="sch-sig-role">ACCOUNTANT FOR DIRECTOR: DRDL</div>
        </div>
      </div>

      {/* Footer — Note: External use ~4-5cm above bottom, Bill No left, Date right */}
      <div className="sch-footer-area">
        <div className="sch-footer-note">
          <span className="sch-label">Note: External use</span>
        </div>
        <div className="sch-footer-row">
          <div className="sch-footer-field">
            <span className="sch-label">Bill No:</span>
            <span className="sch-footer-prefix">DRDL/FIN/CGOS/GPF-TY/</span>
            <input className="sch-cell-input no-print" value={billSuffix} onChange={e => setBillSuffix(e.target.value)} placeholder="—" />
            <span className="print-only">{billSuffix}</span>
          </div>
          <div className="sch-footer-field">
            <span className="sch-label">Dated:</span>
            <span className="sch-value">{applDate}</span>
          </div>
        </div>
      </div>

      <p className="sch-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}


