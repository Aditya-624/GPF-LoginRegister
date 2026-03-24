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
            {!user && <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>}
            {user && <CalculationSheet user={user} />}
          </>
        ) : reportType === 'contingent-bill' ? (
          <>
            {!user && <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>}
            {user && <ContingentBill user={user} />}
          </>
        ) : reportType === 'cfa' ? (
          <CFA user={user} />
        ) : (
          <div className="rd-warn">⚠ Unknown report type.</div>
        )}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   1. CONTINGENT BILL — Page 1  (matches physical document)
   ══════════════════════════════════════════════════════════ */
function ContingentBill({ user }) {
  const prefix = user?.gpfType === 'E' ? 'TY' : 'FW';

  const [f, setF] = useState({
    billNo:       '',
    fwNo:         '',
    dated:        new Date().toLocaleDateString('en-IN'),
    acNo:         user?.gpfAccountNumber || '',
    name:         user?.name || '',
    idNo:         user?.persNumber || '',
    persNo:       user?.persNumber || '',
    lastCharge:   '',
    sanctionDated:'',
    address:      '',
    annualStmt1:  '',
    annualStmt2:  '',
    countersign:  '',
    bankAccNo:    '',
    ifscCode:     '',
  });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const inp = (k, w = 80) => (
    <input className="cb-input" style={{ width: w }} value={f[k]} onChange={e => s(k, e.target.value)} />
  );

  return (
    <>
    <div className="cb-a4">

      {/* ── UNIT CODE — top right ── */}
      <div className="cb-unit-row">
        <span>UNIT CODE</span>
        <span>DRDL 360000032</span>
      </div>

      {/* ── CONTINGENT BILL centred ── */}
      <div className="cb-title-row">CONTINGENT BILL</div>

      {/* ── BILL NO right ── */}
      <div className="cb-billno-row">
        BILL NO.DRDL/FIN/CGOS/GPF-{prefix}/{inp('billNo', 100)}
      </div>

      {/* ── TO (left) + FW/TY / DRDL HYD / Dated (right) ── */}
      <div className="cb-row3">
        <div className="cb-to-block">
          <div>TO</div>
          <div>THE PCDA(R&amp;D)</div>
          <div>KANCHANBAGH</div>
          <div>HYDERABAD-500058</div>
        </div>
        <div className="cb-fw-block">
          <div>{prefix}/{inp('fwNo', 60)}</div>
          <div><strong>DRDL HYD</strong></div>
          <div>Dated:&nbsp;{inp('dated', 90)}</div>
        </div>
      </div>

      <div className="cb-spacer" />

      {/* ── EXPENDITURE PARAGRAPH ── */}
      <div className="cb-exp-para">
        <div>
          Expenditure on account of Final Withdrawal from GPF assets &nbsp;
          A/C No.&nbsp;{inp('acNo', 90)}&nbsp; in R/o SHRI&nbsp;{inp('name', 160)}
        </div>
        <div className="cb-para-indent">
          ID NO.&nbsp;{inp('idNo', 90)}&nbsp;&nbsp;&nbsp;
          PERS No.&nbsp;{inp('persNo', 90)}
        </div>
        <div className="cb-para-indent">i)&nbsp; Authority : 15(1)(B)(e) of GPF(CS) Rules 1960</div>
        <div className="cb-para-indent">
          ii)&nbsp; Months account in which last charge on this account was preferred&nbsp;
          {inp('lastCharge', 120)}
        </div>
      </div>

      <div className="cb-spacer" />

      {/* ── DETAILS OF EXPENDITURE ── */}
      <div className="cb-exp-section">
        <div className="cb-exp-hdr">
          <div className="cb-exp-hdr-left">DETAILS OF EXPENDITURE</div>
          <div className="cb-exp-hdr-right">AMOUNT</div>
        </div>
        <div className="cb-exp-body">
          <div className="cb-exp-body-left">
            <div>
              Final Withdrawal from GPF assets against A/C No.&nbsp;
              <strong>{f.acNo || '________'}</strong>
              &nbsp;in R/o SHRI&nbsp;{inp('name', 160)}
            </div>
            <div className="cb-para-indent">
              vide sanction dated&nbsp;{inp('sanctionDated', 90)}&nbsp;in connection with
            </div>
            <div className="cb-para-indent">Upkeeping of ancestral house at native place</div>
            <div className="cb-para-indent">
              Address&nbsp;{inp('address', 200)}
            </div>
          </div>
          <div className="cb-exp-body-right">
            <span>{cur(user?.applAmt)}</span>
          </div>
        </div>
      </div>

      {/* ── CERTIFICATION ── */}
      <div className="cb-cert">
        CERTIFIED THAT THE INDIVIDUAL IS NOT DUE FOR
        RETIREMENT WITHIN NEXT 24 MONTHS
      </div>

      {/* ── ENCLOSURES ── */}
      <div className="cb-encl-block">
        <div>Encls:&nbsp; a)&nbsp; Sanction of the competent authority in original</div>
        <div className="cb-encl-item">b)&nbsp; GPF application form</div>
        <div className="cb-encl-item">c)&nbsp; GPF annual statement of account for the year</div>
        <div className="cb-encl-item">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {inp('annualStmt1', 70)}&nbsp;&amp;&nbsp;{inp('annualStmt2', 70)}
        </div>
        <div className="cb-encl-item">d)&nbsp; Debit schedule in triplicate</div>
      </div>

      {/* ── TOTAL STRIP ── */}
      <div className="cb-total-strip">
        <span className="cb-total-lbl">TOTAL Rs.</span>
        <span className="cb-total-amt">{cur(user?.applAmt)}</span>
      </div>

      {/* ── COUNTERSIGNED ROW ── */}
      <div className="cb-countersign-row">
        <div className="cb-countersign-left">
          {inp('countersign', 200)}
        </div>
        <div className="cb-received-right">RECEIVED PAYMENT</div>
      </div>
      <div className="cb-countersign-label">COUNTERSIGNED</div>

      <div className="cb-spacer" />

      {/* ── FOOTER SIGNATURES ── */}
      <div className="cb-footer">
        <div className="cb-footer-left">
          <div className="cb-sig-gap" />
          <div>Sr.Accounts officer</div>
          <div>for DIRECTOR</div>
        </div>
        <div className="cb-footer-right">
          <div className="cb-sig-title">SIGNATURE OF THE INDIVIDUAL</div>
          <div className="cb-sig-field-row">
            <span>ID NO:&nbsp;{inp('idNo', 80)}</span>
            <span>&nbsp;&nbsp;Pers No:&nbsp;{inp('persNo', 80)}</span>
          </div>
          <div className="cb-sig-field-row">
            <span>NAME:&nbsp;{inp('name', 200)}</span>
          </div>
          <div className="cb-sig-field-row">
            <span>BANK ACCOUNT NO:&nbsp;{inp('bankAccNo', 180)}</span>
          </div>
          <div className="cb-sig-field-row">
            <span>IFSC CODE:&nbsp;{inp('ifscCode', 120)}</span>
          </div>
        </div>
      </div>

    </div>

    {/* ══════════════════════════════════════════
        PAGE 2 — FOR USE IN THE DA DEPARTMENT
        ══════════════════════════════════════════ */}
    <ContingentBillPage2 user={user} />
  </>
  );
}

function ContingentBillPage2({ user }) {
  const [p2, setP2] = useState({
    payBillNo:    '',
    passedRs:     '',
    payBillOf:    '',
    paymentAs:    '',
    lastDvFor:    '',
    nextChargeFor:'',
    chequeRs:     '',
    vrOf:         '',
    vrNo:         '',
    r1: '', mr2: '', c3: '', nc4: '',
  });
  const sp = (k, v) => setP2(pr => ({ ...pr, [k]: v }));
  const ip = (k, w = 80) => (
    <input className="cb-input" style={{ width: w }} value={p2[k]} onChange={e => sp(k, e.target.value)} />
  );

  return (
    <div className="cb-a4 cb-page2">

      {/* ── HEADER ── */}
      <div className="cb2-header">FOR USE IN THE DA DEPARTMENT</div>

      <div className="cb2-spacer" />

      {/* ── TWO-COLUMN AREA ── */}
      <div className="cb2-cols">

        {/* LEFT */}
        <div className="cb2-col-left">
          <div className="cb2-line">(When payment is made by</div>
          <div className="cb2-line">Inclusion in pay bill&nbsp;{ip('payBillNo', 100)}</div>
          <div className="cb2-line">passed for payment for</div>
          <div className="cb2-line">Rs.&nbsp;{ip('passedRs', 100)}</div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line">Inclusion in the pay bill</div>
          <div className="cb2-line">of&nbsp;{ip('payBillOf', 70)}&nbsp; for payment as under&nbsp;{ip('paymentAs', 60)}&nbsp;)</div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line">in favour of DIRECTOR</div>
          <div className="cb2-line">DRDL ,HYDERABAD FOR</div>
          <div className="cb2-line">crediting</div>
          <div className="cb2-line">the amount into PUBLIC</div>
          <div className="cb2-line">FUND</div>
          <div className="cb2-line">ACCOUNT</div>
        </div>

        {/* RIGHT */}
        <div className="cb2-col-right">
          <div className="cb2-line">Last charge DV No.</div>
          <div className="cb2-line">for&nbsp;{ip('lastDvFor', 100)}</div>
          <div className="cb2-line">Details of next charge</div>
          <div className="cb2-line">for&nbsp;{ip('nextChargeFor', 100)}</div>
          <div className="cb2-line">(When cheque is to be issued passed for</div>
          <div className="cb2-line">Rs.&nbsp;{ip('chequeRs', 100)}&nbsp;)</div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line cb2-code-row">
            <span>CODE</span><span>TREASURY AMOUNT</span>
          </div>
          <div className="cb2-line cb2-code-row">
            <span></span><span>SBI</span>
          </div>
          <div className="cb2-line cb2-code-row">
            <span></span><span>hyderabad</span>
          </div>
        </div>
      </div>

      <div className="cb2-spacer" />

      {/* ── ALL 6 SIGNATURES — full width ── */}
      <div className="cb2-sig-row">
        {['AUDITOR', 'SO(A)', 'AO', 'AUDITOR', 'AAO', 'SAO'].map((role, i) => (
          <div key={i} className="cb2-sig-cell">
            <div className="cb2-sig-space" />
            <div className="cb2-sig-role">{role}</div>
          </div>
        ))}
      </div>

      <div className="cb2-spacer" />

      {/* ── CLASSIFICATION — full width below sigs ── */}
      <div className="cb2-class-title">CLASSIFICATION OF RECEIPTS AND CHARGES</div>

      <div className="cb2-class-row cb2-class-hdr">
        <div className="cb2-cl">Month</div>
        <div className="cb2-cl">CDA(R&amp;D)</div>
        <div className="cb2-cl">SECTION</div>
        <div className="cb2-cl">CLASS</div>
      </div>

      <div className="cb2-class-row">
        <div className="cb2-cl">Of VR.&nbsp;{ip('vrOf', 40)}</div>
        <div className="cb2-cl">VR No.&nbsp;{ip('vrNo', 50)}</div>
        <div className="cb2-cl"></div>
        <div className="cb2-cl"></div>
      </div>

      <div className="cb2-class-row">
        <div className="cb2-cl">
          <div>Classification</div>
          <div>Code</div>
          <div>R(1) Rs.&nbsp;{ip('r1', 50)}</div>
        </div>
        <div className="cb2-cl">
          <div>Receipts MR(2)</div>
          <div>Rs.&nbsp;{ip('mr2', 50)}</div>
        </div>
        <div className="cb2-cl">
          <div>Classification</div>
          <div>Code</div>
          <div>C(3) Rs.&nbsp;{ip('c3', 50)}</div>
        </div>
        <div className="cb2-cl">
          <div>Charges NC(4)</div>
          <div>Rs.&nbsp;{ip('nc4', 50)}</div>
        </div>
      </div>

      <div className="cb2-spacer" />

      {/* ── INSTRUCTION ── */}
      <div className="cb2-instr-title">INSTRUCTION</div>
      <div className="cb2-instr-text">
        All alterations must be attested. Original receipts should be invariably quoted and all prescribed
        certificates or documents in support of the claim.
      </div>

    </div>
  );
}

/* ── number → words (Indian system) ── */
function numToWords(n) {
  if (!n && n !== 0) return '';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const toWords = (num) => {
    if (num === 0) return '';
    if (num < 20) return ones[num] + ' ';
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? ' ' + ones[num%10] : '') + ' ';
    if (num < 1000) return ones[Math.floor(num/100)] + ' Hundred ' + toWords(num%100);
    return '';
  };
  const num = Math.floor(Number(n));
  if (num === 0) return 'Zero';
  let result = '';
  const cr = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thou = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  if (cr)   result += toWords(cr) + 'Crore ';
  if (lakh) result += toWords(lakh) + 'Lakh ';
  if (thou) result += toWords(thou) + 'Thousand ';
  if (rest) result += toWords(rest);
  return result.trim();
}

/* ── 2. CFA ─────────────────────────────────────────────── */
function CFA({ user }) {
  if (user?.gpfType === 'E') return <CFATemporaryAdvance user={user} />;

  const name   = user?.name || '—';
  const acNo   = user?.gpfAccountNumber || '—';
  const dob    = user?.dob ? new Date(user.dob).toLocaleDateString('en-IN') : '—';
  const amount = user?.applAmt ? Math.floor(Number(user.applAmt)) : null;
  const amtWords = amount ? numToWords(amount) : '—';
  const amtNum   = amount ? `Rs. ${Number(amount).toLocaleString('en-IN')}` : '—';
  const purpose  = purposeLabel(user?.purpose) || '—';
  const today    = new Date().toLocaleDateString('en-IN');

  return (
    <>
    {/* ══════════ PAGE 1 ══════════ */}
    <div className="cfa-a4">

      {/* Top-right unit block */}
      <div className="cfa-unit-block">
        <div><span className="cfa-lbl-sm">UNIT CODE:</span> 360000032</div>
        <div><span className="cfa-lbl-sm">UNIT:</span> DRDL</div>
      </div>

      {/* Top banner — 3 date fields, plain text */}
      <div className="cfa-top-banner">
        <div className="cfa-banner-field">
          <span className="cfa-banner-lbl">DATE OF APPOINTMENT</span>
          <span className="cfa-banner-val">{user?.dateOfAppointment ? new Date(user.dateOfAppointment).toLocaleDateString('en-IN') : '—'}</span>
        </div>
        <div className="cfa-banner-field">
          <span className="cfa-banner-lbl">DATE OF BIRTH</span>
          <span className="cfa-banner-val">{dob}</span>
        </div>
        <div className="cfa-banner-field">
          <span className="cfa-banner-lbl">DATE OF SUPERANNUATION</span>
          <span className="cfa-banner-val">{user?.dateOfRetirement ? new Date(user.dateOfRetirement).toLocaleDateString('en-IN') : '—'}</span>
        </div>
      </div>

      {/* Centred title */}
      <div className="cfa-title">
        FORM FOR SANCTION OF WITHDRAWAL FROM PROVIDENT FUND
      </div>

      {/* Office header — right half */}
      <div className="cfa-office-block">
        <div className="cfa-office-right">
          <div className="cfa-office-refno">DRDL/FIN/CGOS/GPF-FW/100</div>
          <div>Government of India,</div>
          <div>Ministry of Defence,</div>
          <div>R&amp;D Organisation,</div>
          <div>DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY,</div>
          <div>PO: KANCHANBAGH</div>
          <div>HYDERABAD: 500058</div>
          <div className="cfa-dated-row">DATED: {today}</div>
        </div>
      </div>

      <div className="cfa-spacer-md" />

      {/* Addressee */}
      <div className="cfa-to-block">
        <div className="cfa-to-label">To</div>
        <div className="cfa-to-line">1.&nbsp;&nbsp;<span className="cfa-to-underline">THE PCDA(R&amp;D),</span></div>
        <div className="cfa-to-line cfa-to-indent"><span className="cfa-to-underline">HYDERABAD-500058.</span></div>
        <div className="cfa-to-line">2.&nbsp;&nbsp;The Controller of Defence Accounts (R&amp;D).</div>
        <div className="cfa-to-line cfa-to-indent"><span className="cfa-to-underline">NEW DELHI-110001</span></div>
      </div>

      <div className="cfa-spacer-md" />

      {/* Subject */}
      <div className="cfa-sub-line">
        <span className="cfa-sub-prefix">SUB:</span>
        &nbsp;&nbsp;WITHDRAWAL FROM THE GPF(CS) IN RESPECT OF SHRI {name} A/C NO. {acNo}.
      </div>

      <div className="cfa-spacer-md" />

      <div className="cfa-sir">Sir,</div>
      <div className="cfa-spacer-sm" />

      {/* Para 1 */}
      <div className="cfa-para">
        <span className="cfa-para-num">1.</span>
        <span className="cfa-para-body">
          I am directed to convey sanction of the Director DRDL, HYD, under Rule No. 15(1)(B)(e)
          of GPF (cs) Rules, 1960 to the withdrawal by SHRI {name} a sum of {amtNum} (Rupees <span className="cfa-words">{amtWords}</span> Only) from
          his/her GPF fund A/C No. {acNo} to enable him/her to meet the expenditure in connection
          with Upkeeping of ancestral house at native place Address: {user?.address || '—'}.
        </span>
      </div>

      <div className="cfa-spacer-sm" />

      {/* Para 2 */}
      <div className="cfa-para">
        <span className="cfa-para-num">2.</span>
        <span className="cfa-para-body">
          It is certified that SHRI {name} is within 10 years of his/her retirement or superannuation
          or has completed ten/fifteen/twenty-five years of government service on {user?.serviceDate ? new Date(user.serviceDate).toLocaleDateString('en-IN') : '—'}.
        </span>
      </div>

      <div className="cfa-spacer-sm" />

      {/* Para 3 */}
      <div className="cfa-para">
        <span className="cfa-para-num">3.</span>
        <span className="cfa-para-body">
          It is also certified that the total amount drawn from all government sources by
          SHRI {name} for {purpose} purposes does not exceed {amtNum} or his/her Fifty months pay which ever is less.
        </span>
      </div>

      <div className="cfa-spacer-lg" />

      {/* Signature */}
      <div className="cfa-sig-block">
        <div className="cfa-sig-right">
          <div className="cfa-sig-space" />
          <div className="cfa-sig-role">Sr. Accounts Officer</div>
          <div className="cfa-sig-role">for DIRECTOR, DRDL</div>
        </div>
      </div>

    </div>

    {/* ══════════ PAGE 2 ══════════ */}
    <CFAPage2 user={user} name={name} amtNum={amtNum} amtWords={amtWords} />
    </>
  );
}

function CFAPage2({ user, name, amtNum, amtWords }) {
  const n = (v) => Number(v || 0);
  const c = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

  const opening    = n(user?.closingBalance);
  const totalSub   = n(user?.gpfSub);
  const totalRet   = n(user?.gpfRet);
  const interest   = n(user?.interestAmount);
  const applAmt    = n(user?.applAmt);
  const grandTotal = opening + totalSub + totalRet + interest;
  const balance    = grandTotal - applAmt;

  return (
    <div className="cfa-a4 cfa-page2">

      <div className="cfa-fs-wrap">

        {/* Opening Balance */}
        <div className="cfa-fs-row cfa-fs-ob">
          <span className="cfa-fs-label">OPENING BALANCE</span>
          <span className="cfa-fs-dots">· · · · · · · · · · · · · · · · · · · · · · · · ·</span>
          <span className="cfa-fs-amt">{c(opening)}</span>
        </div>

        <div className="cfa-fs-divider" />

        {/* Section A */}
        <div className="cfa-fs-section-title">SUBSCRIPTION CREDITS</div>
        <div className="cfa-fs-col-hdr">
          <span className="cfa-fs-col-monthyr">Month / Year</span>
          <span className="cfa-fs-col-range">Period</span>
          <span className="cfa-fs-col-sub">Subscription</span>
          <span className="cfa-fs-col-total">Total</span>
        </div>
        <div className="cfa-fs-col-row">
          <span className="cfa-fs-col-monthyr">—</span>
          <span className="cfa-fs-col-range">—</span>
          <span className="cfa-fs-col-sub">{c(totalSub)}</span>
          <span className="cfa-fs-col-total">{c(totalSub)}</span>
        </div>

        <div className="cfa-fs-divider" />

        {/* Section B */}
        <div className="cfa-fs-section-title">ADVANCE REFUND CREDITS</div>
        <div className="cfa-fs-col-hdr">
          <span className="cfa-fs-col-monthyr">Month / Year</span>
          <span className="cfa-fs-col-range">Period</span>
          <span className="cfa-fs-col-sub">Refund</span>
          <span className="cfa-fs-col-total">Total</span>
        </div>
        <div className="cfa-fs-col-row">
          <span className="cfa-fs-col-monthyr">—</span>
          <span className="cfa-fs-col-range">—</span>
          <span className="cfa-fs-col-sub">{c(totalRet)}</span>
          <span className="cfa-fs-col-total">{c(totalRet)}</span>
        </div>

        <div className="cfa-fs-divider" />

        {/* Section C */}
        <div className="cfa-fs-section-title">RECOVERY FROM 7CPC ARREARS</div>
        <div className="cfa-fs-col-hdr">
          <span className="cfa-fs-col-monthyr">Month / Year</span>
          <span className="cfa-fs-col-range" />
          <span className="cfa-fs-col-sub">GPF Recovery</span>
          <span className="cfa-fs-col-total">Total</span>
        </div>
        <div className="cfa-fs-col-row">
          <span className="cfa-fs-col-monthyr">—</span>
          <span className="cfa-fs-col-range" />
          <span className="cfa-fs-col-sub">{c(interest)}</span>
          <span className="cfa-fs-col-total">{c(interest)}</span>
        </div>

        <div className="cfa-fs-divider" />

        {/* Grand Total */}
        <div className="cfa-fs-row cfa-fs-total-row">
          <span className="cfa-fs-total-lbl">TOTAL</span>
          <span className="cfa-fs-total-amt">{c(grandTotal)}</span>
        </div>

        <div className="cfa-fs-divider" />

        {/* Withdrawals + Balance */}
        <div className="cfa-fs-row cfa-fs-wd-row">
          <span className="cfa-fs-wd-lbl">WITHDRAWALS</span>
          <span className="cfa-fs-wd-mid">
            <span className="cfa-fs-wd-mid-lbl">Total</span>
            <span className="cfa-fs-wd-mid-amt">{c(applAmt)}</span>
          </span>
          <span className="cfa-fs-balance-block">
            <span className="cfa-fs-balance-lbl">BALANCE</span>
            <span className="cfa-fs-balance-amt">{c(balance)}</span>
          </span>
        </div>

      </div>

      <div className="cfa-spacer-md" />

      {/* Historical withdrawal reference */}
      <div className="cfa-para">
        <span className="cfa-para-body">
          SHRI <strong>{name}</strong> was last sanctioned a part of final withdrawal by this
          office for an amount of {amtNum} vide Bill No: {user?.lastBillNo || '—'} Bill
          Dt: {user?.lastBillDate ? new Date(user.lastBillDate).toLocaleDateString('en-IN') : '—'} after
          the C.C.B for the year {user?.lastCcbYear || '—'}.
        </span>
      </div>

      <div className="cfa-spacer-lg" />

      {/* Sign-off */}
      <div className="cfa-p2-signoff">
        <div className="cfa-p2-yours">Yours Faithfully,</div>
        <div className="cfa-spacer-md" />
        <div className="cfa-p2-desig">CFA</div>
        <div className="cfa-p2-desig">Senior Accounts Officer</div>
        <div className="cfa-p2-desig">For Director, DRDL</div>
      </div>

      <p className="cfa-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}

/* ── 2b. CFA — Temporary Advance (gpfType === 'E') ─────── */
function CFATemporaryAdvance({ user }) {
  const name       = user?.name || '—';
  const acNo       = user?.gpfAccountNumber || '—';
  const amount     = user?.applAmt ? Math.floor(Number(user.applAmt)) : null;
  const amtNum     = amount ? `Rs. ${Number(amount).toLocaleString('en-IN')}` : '—';
  const amtWords   = amount ? numToWords(amount) : '—';
  const today      = new Date().toLocaleDateString('en-IN');
  const purpose    = purposeLabel(user?.purpose) || '—';

  const n = (v) => Number(v || 0);
  const c = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

  const opening      = n(user?.closingBalance);
  const totalSub     = n(user?.gpfSub);
  const totalRet     = n(user?.gpfRet);
  const interest     = n(user?.interestAmount);
  const applAmt      = n(user?.applAmt);
  const grandTotal   = opening + totalSub + totalRet + interest;
  const balance      = grandTotal - applAmt;

  const outstanding  = n(user?.outstandingAdvance);
  const instalment   = n(user?.instalment);
  const noOfInst     = user?.noOfInstalments || '—';
  const consolidated = outstanding + applAmt;

  const prevSanctionDate  = user?.prevSanctionDate  ? new Date(user.prevSanctionDate).toLocaleDateString('en-IN')  : '—';
  const prevPaymentDate   = user?.prevPaymentDate   ? new Date(user.prevPaymentDate).toLocaleDateString('en-IN')   : '—';
  const commenceMonth     = user?.commencementDate  ? new Date(user.commencementDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="cfata-a4">

      {/* ── CENTERED LETTERHEAD ── */}
      <div className="cfata-letterhead">
        <div className="cfata-lh-line cfata-lh-bold">MINISTRY OF DEFENCE</div>
        <div className="cfata-lh-line cfata-lh-bold">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="cfata-lh-line">PO: KANCHANBAGH, HYDERABAD-500058</div>
      </div>

      {/* ── RIGHT-ALIGNED REF + DATE ── */}
      <div className="cfata-ref-block">
        <div>NO. DRDL/FIN/CGOS/GPF-TY/</div>
        <div>Dated: {today}</div>
      </div>

      <div className="cfata-spacer-md" />

      {/* ── PARA 1 ── */}
      <div className="cfata-para">
        <span className="cfata-para-num">1.</span>
        <span className="cfata-para-body">
          Sanction of the DIRECTOR, DRDL, Hyderabad is hereby conveyed under rules 12(1)(c) of
          GPF(CS) Rules 1960 for the grants of Advance of {amtNum} (Rupees <em>{amtWords}</em> Only)
          to SHRI {name} from his GPF A/C No. {acNo} to enable him to defray expenses on account
          of {purpose}.
        </span>
      </div>

      <div className="cfata-spacer-sm" />

      {/* ── PARA 2 — Recovery clause ── */}
      <div className="cfata-para">
        <span className="cfata-para-num">2.</span>
        <span className="cfata-para-body">
          A sum of {c(outstanding)} out of advance of {amtNum} sanctioned in {prevSanctionDate} and
          paid to him in {prevPaymentDate} will be outstanding till commencement of the recovery
          together with the advance now sanctioned aggregating to {c(consolidated)}. The total amount
          of {c(consolidated)} will be recovered in {noOfInst} monthly installments of {c(instalment)} each
          commencing from the salary for the month of {commenceMonth}.
        </span>
      </div>

      <div className="cfata-spacer-sm" />

      {/* ── PARA 3 ── */}
      <div className="cfata-para">
        <span className="cfata-para-num">3.</span>
        <span className="cfata-para-body">
          The balance at the credit of SHRI {name} on date is as detailed below:-
        </span>
      </div>

      <div className="cfata-spacer-sm" />

      {/* ── FINANCIAL TABLE ── */}
      <div className="cfata-fs">

        {/* Opening Balance */}
        <div className="cfata-fs-row cfata-fs-ob">
          <span className="cfata-fs-lbl">OPENING BALANCE</span>
          <span className="cfata-fs-dots">· · · · · · · · · · · · · · · · · · · · · · · ·</span>
          <span className="cfata-fs-amt">{c(opening)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* Subscription Credits */}
        <div className="cfata-fs-sec-title">SUBSCRIPTION CREDITS</div>
        <div className="cfata-fs-col-hdr">
          <span className="cfata-col-my">Month / Year</span>
          <span className="cfata-col-sub">Subscription</span>
          <span className="cfata-col-tot">Total</span>
        </div>
        <div className="cfata-fs-col-row">
          <span className="cfata-col-my">—</span>
          <span className="cfata-col-sub">{c(totalSub)}</span>
          <span className="cfata-col-tot">{c(totalSub)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* Advance Refund Credits */}
        <div className="cfata-fs-sec-title">ADVANCE REFUND CREDITS</div>
        <div className="cfata-fs-col-hdr">
          <span className="cfata-col-my">Month / Year</span>
          <span className="cfata-col-sub">Refund</span>
          <span className="cfata-col-tot">Total</span>
        </div>
        <div className="cfata-fs-col-row">
          <span className="cfata-col-my">—</span>
          <span className="cfata-col-sub">{c(totalRet)}</span>
          <span className="cfata-col-tot">{c(totalRet)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* 7CPC Arrears */}
        <div className="cfata-fs-sec-title">RECOVERY FROM 7CPC ARREARS</div>
        <div className="cfata-fs-col-hdr">
          <span className="cfata-col-my">Month / Year</span>
          <span className="cfata-col-sub">GPF Recovery</span>
          <span className="cfata-col-tot">Total</span>
        </div>
        <div className="cfata-fs-col-row">
          <span className="cfata-col-my">—</span>
          <span className="cfata-col-sub">{c(interest)}</span>
          <span className="cfata-col-tot">{c(interest)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* TOTAL */}
        <div className="cfata-fs-row cfata-fs-total">
          <span className="cfata-fs-total-lbl">TOTAL</span>
          <span className="cfata-fs-total-amt">{c(grandTotal)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* Withdrawals */}
        <div className="cfata-fs-col-hdr">
          <span className="cfata-col-my">WITHDRAWALS</span>
          <span className="cfata-col-sub">Total</span>
          <span className="cfata-col-tot">{c(applAmt)}</span>
        </div>
        <div className="cfata-fs-divider" />

        {/* Total Balance */}
        <div className="cfata-fs-row cfata-fs-balance">
          <span className="cfata-fs-bal-lbl">TOTAL BALANCE</span>
          <span className="cfata-fs-bal-amt">{c(balance)}</span>
        </div>

      </div>

      <div className="cfata-spacer-lg" />

      {/* ── FOOTER — CFA signature right ── */}
      <div className="cfata-footer">
        <div className="cfata-sig-space" />
        <div className="cfata-sig-role">C.F.A.</div>
      </div>

      <p className="cfa-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
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

  const gpfType = apiData?.gpfType || user?.gpfType;
  if (gpfType === 'E') return <CalculationSheetTA user={user} apiData={apiData} />;

  const d = apiData || {};
  const n = (v) => Number(v || 0);
  const c = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

  const name        = d.name             || user?.name             || '—';
  const gpfAccNo    = d.gpfAccountNumber || user?.gpfAccountNumber || '—';
  const persNo      = d.persNumber       || user?.persNumber       || '—';
  const designation = d.designation      || user?.designation      || '—';
  const applDate    = d.applDate         || user?.applDate;
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

  const dateRange = (rows) => {
    if (!rows.length) return '—';
    const first = fmtMonthYear(rows[0].date);
    const last  = fmtMonthYear(rows[rows.length - 1].date);
    return first === last ? first : `FROM ${first} TO ${last}`;
  };

  const yearsLeft = retDate
    ? Math.max(0, Math.floor((new Date(retDate) - new Date()) / (1000 * 60 * 60 * 24 * 365)))
    : '—';

  return (
    <div className="cs-a4">
      <div className="cs-top-row">
        <span><span className="cs-lbl">ID NO:</span> {persNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span className="cs-top-right">
          <span><span className="cs-lbl">DESIG:</span> {designation}</span><br />
          <span><span className="cs-lbl">GPF A/C NO:</span> {gpfAccNo}</span>
        </span>
      </div>
      <div className="cs-divider" />
      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - &gt;</span>
        <span className="cs-ob-amt">{c(opening)}</span>
      </div>
      <div className="cs-divider" />
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
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{c(grandTotal)}</span>
      </div>
      <div className="cs-divider" />
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

/* ── 3b. Calculation Sheet — Temporary Advance ── */
function CalculationSheetTA({ user, apiData }) {
  const d = apiData || {};
  const n = (v) => Number(v || 0);
  const c = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—';

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

  const outstandingAdv   = n(d.outstandingAdvance ?? user?.outstandingAdvance);
  const instalment       = n(d.instalment         ?? user?.instalment);
  const noOfInstalments  = d.noOfInstalments      ?? user?.noOfInstalments ?? '—';
  const commencementDate = d.commencementDate      ?? user?.commencementDate;
  const consolidatedAdv  = outstandingAdv + applAmt;

  return (
    <div className="cs-a4">
      <div className="csta-top-bar">
        <span><span className="cs-lbl">ID NO:</span> {persNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span><span className="cs-lbl">DESIG:</span> {designation}</span>
        <span><span className="cs-lbl">GPF A/C NO:</span> {gpfAccNo}</span>
      </div>
      <div className="cs-divider" />
      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - &gt;</span>
        <span className="cs-ob-amt">{c(opening)}</span>
      </div>
      <div className="cs-divider" />
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
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{c(grandTotal)}</span>
      </div>
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
  if (user?.gpfType === 'E') return <ApplicationTemporaryAdvance user={user} />;

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
    { no: 1,    label: 'Name of the subscriber',                                        key: 'name' },
    { no: 2,    label: 'Account Number',                                                key: 'accountNumber' },
    { no: 3,    label: 'Designation / I.D. No.',                                        key: 'designation' },
    { no: 4,    label: 'Basic Pay',                                                     key: 'basicPay' },
    { no: 5,    label: 'Date of joining service & Superannuation',                      key: 'joiningSuper' },
    { no: 6,    label: 'Date of Birth',                                                 key: 'dob' },
    { no: 7,    label: 'Balance at credit of the subscriber on the date of application',key: 'balance' },
    { no: 8,    label: 'Amount of Withdrawal required',                                 key: 'amountRequired' },
    { no: '9a', label: 'Purpose for which the advance is required',                     key: 'purpose' },
    { no: '9b', label: 'Rules under which the request is covered',                      key: 'rules' },
    { no: 10,   label: 'Whether any withdrawal was taken for the same purpose earlier',  key: 'prevWithdrawal' },
    { no: 11,   label: 'Name of the Accounts officer maintaining the provident account', key: 'accountsOfficer' },
  ];

  return (
    <div className="appl-a4">
      <div className="appl-title-block">
        <div className="appl-title-main">FORM FOR APPLICATION OF FINAL WITHDRAWAL FROM G.P. FUND</div>
        <div className="appl-title-office">OFFICE: DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY, HYDERABAD</div>
      </div>
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
                  <input className="appl-input" value={fields[r.key]} onChange={e => set(r.key, e.target.value)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

/* ── 5. Application — Temporary Advance ── */
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
      <div className="ta-title-block">
        <div className="ta-title-line">MINISTRY OF DEFENCE</div>
        <div className="ta-title-line">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="ta-title-line ta-title-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
      </div>
      <table className="ta-table">
        <tbody>
          <tr className="ta-row"><td className="ta-no">1.</td><td className="ta-label">NAME OF THE SUBSCRIBER</td><td className="ta-colon">:</td><td className="ta-val">{inp('name')}</td></tr>
          <tr className="ta-row"><td className="ta-no">2.</td><td className="ta-label">ACCOUNT NUMBER</td><td className="ta-colon">:</td><td className="ta-val">{inp('accountNumber')}</td></tr>
          <tr className="ta-row"><td className="ta-no">3.</td><td className="ta-label">DESIGNATION / T.NO</td><td className="ta-colon">:</td><td className="ta-val">{inp('designation')}</td></tr>
          <tr className="ta-row"><td className="ta-no">4.</td><td className="ta-label">BASIC PAY</td><td className="ta-colon">:</td><td className="ta-val">{inp('basicPay')}</td></tr>
          <tr className="ta-row"><td className="ta-no">5.</td><td className="ta-label">BALANCE AT CREDIT OF THE SUBSCRIBER ON THE DATE OF APPLICATION AS PER WORKING ENCLOSED IS</td><td className="ta-colon">:</td><td className="ta-val">{inp('balance')}</td></tr>
          <tr className="ta-row"><td className="ta-no">6.</td><td className="ta-label">AMOUNT OF PREVIOUS ADVANCE / ADVANCE-OUTSTANDING</td><td className="ta-colon">:</td><td className="ta-val"></td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">AMOUNT OF ADVANCE TAKEN</td><td className="ta-colon">:</td><td className="ta-val">{inp('advanceTaken')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">BALANCE OUTSTANDING</td><td className="ta-colon">:</td><td className="ta-val">{inp('balanceOutstanding')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">i) Rs.</td><td className="ta-colon"></td><td className="ta-val">{inp('subI')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">ii) Rs.</td><td className="ta-colon"></td><td className="ta-val">{inp('subII')}</td></tr>
          <tr className="ta-row"><td className="ta-no">7.</td><td className="ta-label">AMOUNT OF ADVANCE REQUIRED</td><td className="ta-colon">:</td><td className="ta-val">{inp('amountRequired')}</td></tr>
          <tr className="ta-row"><td className="ta-no">8.</td><td className="ta-label">a) PURPOSE FOR WHICH THE ADVANCE IS REQUIRED</td><td className="ta-colon">:</td><td className="ta-val">{inp('purpose')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">b) RULES UNDER WHICH THE REQUEST IS COVERED</td><td className="ta-colon">:</td><td className="ta-val">{inp('rules')}</td></tr>
          <tr className="ta-row"><td className="ta-no">9.</td><td className="ta-label">a) AMOUNT OF CONSOLIDATED ADVANCE</td><td className="ta-colon">:</td><td className="ta-val">{inp('consolidatedAdv')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label ta-indent">b) NUMBER OF MONTHLY INSTALMENTS IN WHICH CONSOLIDATED ADVANCE IS PROPOSED TO BE RECOVERED</td><td className="ta-colon">:</td><td className="ta-val">{inp('instalments')}</td></tr>
          <tr className="ta-row"><td className="ta-no">10.</td><td className="ta-label">DATE OF APPOINTMENT</td><td className="ta-colon">:</td><td className="ta-val">{inp('dateAppointment', 'date')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label">DATE OF BIRTH</td><td className="ta-colon">:</td><td className="ta-val">{inp('dateBirth', 'date')}</td></tr>
          <tr className="ta-row"><td className="ta-no"></td><td className="ta-label">DATE OF SUPERANNUATION</td><td className="ta-colon">:</td><td className="ta-val">{inp('dateSuperannuation', 'date')}</td></tr>
          <tr className="ta-row">
            <td className="ta-no"></td>
            <td className="ta-label" colSpan={3}>
              FULL PARTICULARS OF THE PECUNIARY CIRCUMSTANCES OF THE SUBSCRIBER JUSTIFYING FOR APPLYING FOR TEMPORARY ADVANCE:
              <textarea className="ta-textarea" value={f.pecuniary} onChange={e => s('pecuniary', e.target.value)} rows={3} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="ta-declaration">
        I certify that particulars given above are correct and complete to the best of knowledge and belief and nothing has been concealed by me.
      </div>
      <div className="ta-footer">
        <div className="ta-footer-left">
          <span className="ta-footer-label">DATED:</span>
          <input className="ta-input ta-date-input" type="date" value={f.dated} onChange={e => s('dated', e.target.value)} onKeyDown={(e) => e.preventDefault()} />
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

/* ── 6. Schedule ────────────────────────────────────────── */
function Schedule({ user }) {
  if (!user) return <div className="rd-warn">⚠ User data not available. Please go back and reopen this report.</div>;
  return (
    <div className="sch-a4">
      <div className="sch-unit-code">UNIT CODE : DRDL 360000032</div>
      <div className="sch-title-block">
        <div className="sch-title-line">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="sch-title-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
        <div className="sch-title-main">GPF DEBIT SCHEDULE</div>
      </div>
      <hr className="sch-hr" />
      <div className="sch-info-grid">
        <div className="sch-field-row"><span className="sch-label">Name</span><span className="sch-print-val">{user.name || '—'}</span></div>
        <div className="sch-field-row"><span className="sch-label">GPF A/C No.</span><span className="sch-print-val">{user.gpfAccountNumber || '—'}</span></div>
        <div className="sch-field-row"><span className="sch-label">Pers No.</span><span className="sch-print-val">{user.persNumber || '—'}</span></div>
        <div className="sch-field-row"><span className="sch-label">Amount Sanctioned</span><span className="sch-print-val">{cur(user.applAmt)}</span></div>
      </div>
      <p className="sch-system-note no-print">System-generated document — DRDO GPF Management System</p>
    </div>
  );
}
