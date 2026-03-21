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
                {reportType === 'calculation-sheet' && <CalculationSheet user={user} />}

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


