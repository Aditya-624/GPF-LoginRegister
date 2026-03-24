import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ReportDetail.css';
import ThemeSelector from './ThemeSelector';

const purposeLabel = (code) => {
  const map = { 1: 'House Building', 2: 'Education', 3: 'Marriage', 4: 'Medical', 5: 'Vehicle', 6: 'Final Withdrawal' };
  return code != null ? (map[Number(code)] || `Purpose ${code}`) : '--';
};

const fmt = (val) => {
  if (!val) return '--';
  return new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const cur = (val) => {
  if (val == null) return '--';
  return '\u20B9' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

const fmtMonthYear = (val) => {
  if (!val) return '--';
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const REPORT_META = {
  'contingent-bill':   { label: 'Contingent Bill',   icon: 'CB' },
  'cfa':               { label: 'CFA',               icon: 'CFA' },
  'calculation-sheet': { label: 'Calculation Sheet', icon: 'CS' },
  'application':       { label: 'Application',       icon: 'APP' },
  'schedule':          { label: 'Schedule',          icon: 'SCH' },
};

function useSanctionDetails(persNumber, user) {
  const sd = user ? {
    billNo:             user.billNo,
    billDate:           user.billDate,
    sanctionDate:       user.sanctionDate,
    sanctionAmount:     user.sanctionAmount,
    dvNo:               user.dvNo,
    dvDate:             user.dvDate,
    houseAddr:          user.houseAddr,
    noOfInstallments:   user.noOfInstallments,
    instlAmount:        user.instlAmount,
    outstandingAdvance: user.outstandingAdvance,
    prevSanctionDate:   user.prevSanctionDate,
    prevPaymentDate:    user.prevPaymentDate,
    commencementDate:   user.commencementDate,
    lastBillNo:         user.lastBillNo,
    lastBillDate:       user.lastBillDate,
    lastCcbYear:        user.lastCcbYear,
    appliedAmount:      user.appliedAmount,
  } : {};
  return { sd, loading: false };
}

const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numToWords(n) {
  if (!n && n !== 0) return '--';
  const num = Math.floor(Number(n));
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numToWords(-num);
  let words = '';
  if (num >= 10000000) { words += numToWords(Math.floor(num / 10000000)) + ' Crore '; n = num % 10000000; } else { n = num; }
  const rem = typeof n === 'number' ? n : num;
  let r = rem;
  if (r >= 100000)  { words += numToWords(Math.floor(r / 100000)) + ' Lakh ';  r = r % 100000; }
  if (r >= 1000)    { words += numToWords(Math.floor(r / 1000))   + ' Thousand '; r = r % 1000; }
  if (r >= 100)     { words += ONES[Math.floor(r / 100)] + ' Hundred '; r = r % 100; }
  if (r >= 20)      { words += TENS[Math.floor(r / 10)] + ' '; r = r % 10; }
  if (r > 0)        { words += ONES[r] + ' '; }
  return words.trim();
}

export default function ReportDetail() {
  const navigate = useNavigate();
  const { persNumber, reportType } = useParams();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = location.state?.user || null;
  const meta = REPORT_META[reportType] || { label: reportType, icon: 'DOC' };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleBack = () => {
    navigate(`/gpf/reports/user/${persNumber}`, { state: { user } });
  };

  return (
    <div className="rd-page">
      <nav className="top-nav no-print">
        <div className="nav-left">
          <button className="btn btn-nav btn-back" onClick={handleBack}>
            &larr; Back
          </button>
          <span className="nav-brand">{meta.icon} {meta.label}</span>
          <span className="nav-time">{formatTime(currentTime)}</span>
        </div>
        <div className="nav-right">
          <div className="theme-selector-compact">
            <ThemeSelector compact={true} />
          </div>
          <button className="btn btn-nav btn-print" onClick={() => window.print()}>
            Print
          </button>
          <button className="btn btn-nav btn-profile" onClick={() => navigate('/profile')}>
            Profile
          </button>
        </div>
      </nav>

      <main className="rd-main">
        {reportType === 'application' ? (
          user?.gpfType === 'E'
            ? <ApplicationTemporaryAdvance user={user} />
            : <Application user={user} />
        ) : reportType === 'schedule' ? (
          <Schedule user={user} />
        ) : reportType === 'calculation-sheet' ? (
          <>
            {!user && <div className="rd-warn">User data not available. Please go back and reopen this report.</div>}
            {user && (user.gpfType === 'E'
              ? <CalculationSheetTA user={user} apiData={user} />
              : <CalculationSheet user={user} />)}
          </>
        ) : reportType === 'contingent-bill' ? (
          <>
            {!user && <div className="rd-warn">User data not available. Please go back and reopen this report.</div>}
            {user && <ContingentBill user={user} />}
          </>
        ) : reportType === 'cfa' ? (
          user?.gpfType === 'E'
            ? <CFATemporaryAdvance user={user} />
            : <CFA user={user} />
        ) : (
          <div className="rd-warn">Unknown report type.</div>
        )}
      </main>
    </div>
  );
}

/* =====================================================
   CONTINGENT BILL
   ===================================================== */
function ContingentBill({ user }) {
  const prefix = user?.gpfType === 'E' ? 'TY' : 'FW';
  const { sd } = useSanctionDetails(user?.persNumber, user);

  const billNo     = sd?.billNo      || '________';
  const dated      = sd?.sanctionDate ? fmt(sd.sanctionDate) : new Date().toLocaleDateString('en-IN');
  const acNo       = user?.gpfAccountNumber || '--';
  const name       = user?.name        || '--';
  const idNo       = user?.persNumber  || '--';
  const lastCharge = sd?.lastBillDate  ? fmt(sd.lastBillDate) : '--';
  const sanctionDt = sd?.sanctionDate  ? fmt(sd.sanctionDate) : '--';
  const address    = sd?.houseAddr     || user?.address || '--';
  const annualStmt1 = sd?.lastCcbYear  || '--';
  const annualStmt2 = sd?.lastCcbYear  ? String(Number(sd.lastCcbYear) + 1) : '--';

  const v = (val) => <span className="cb-db-val">{val}</span>;

  return (
    <>
    <div className="cb-a4">
      <div className="cb-unit-row">
        <span>UNIT CODE</span>
        <span>DRDL 360000032</span>
      </div>
      <div className="cb-title-row">CONTINGENT BILL</div>
      <div className="cb-billno-row">
        BILL NO.DRDL/FIN/CGOS/GPF-{prefix}/{v(billNo)}
      </div>
      <div className="cb-row3">
        <div className="cb-to-block">
          <div>TO</div>
          <div>THE PCDA(R&amp;D)</div>
          <div>KANCHANBAGH</div>
          <div>HYDERABAD-500058</div>
        </div>
        <div className="cb-fw-block">
          <div>{prefix}/{v(billNo)}</div>
          <div><strong>DRDL HYD</strong></div>
          <div>Dated:&nbsp;{v(dated)}</div>
        </div>
      </div>
      <div className="cb-spacer" />
      <div className="cb-exp-para">
        <div>
          Expenditure on account of Final Withdrawal from GPF assets &nbsp;
          A/C No.&nbsp;{v(acNo)}&nbsp; in R/o SHRI&nbsp;{v(name)}
        </div>
        <div className="cb-para-indent">
          ID NO.&nbsp;{v(idNo)}&nbsp;&nbsp;&nbsp;PERS No.&nbsp;{v(idNo)}
        </div>
        <div className="cb-para-indent">i)&nbsp; Authority : 15(1)(B)(e) of GPF(CS) Rules 1960</div>
        <div className="cb-para-indent">
          ii)&nbsp; Months account in which last charge on this account was preferred&nbsp;{v(lastCharge)}
        </div>
      </div>
      <div className="cb-spacer" />
      <div className="cb-exp-section">
        <div className="cb-exp-hdr">
          <div className="cb-exp-hdr-left">DETAILS OF EXPENDITURE</div>
          <div className="cb-exp-hdr-right">AMOUNT</div>
        </div>
        <div className="cb-exp-body">
          <div className="cb-exp-body-left">
            <div>
              Final Withdrawal from GPF assets against A/C No.&nbsp;<strong>{acNo}</strong>
              &nbsp;in R/o SHRI&nbsp;{v(name)}
            </div>
            <div className="cb-para-indent">vide sanction dated&nbsp;{v(sanctionDt)}&nbsp;in connection with</div>
            <div className="cb-para-indent">Upkeeping of ancestral house at native place</div>
            <div className="cb-para-indent">Address&nbsp;{v(address)}</div>
          </div>
          <div className="cb-exp-body-right">
            <span>{cur(user?.applAmt)}</span>
          </div>
        </div>
      </div>
      <div className="cb-cert">
        CERTIFIED THAT THE INDIVIDUAL IS NOT DUE FOR RETIREMENT WITHIN NEXT 24 MONTHS
      </div>
      <div className="cb-encl-block">
        <div>Encls:&nbsp; a)&nbsp; Sanction of the competent authority in original</div>
        <div className="cb-encl-item">b)&nbsp; GPF application form</div>
        <div className="cb-encl-item">c)&nbsp; GPF annual statement of account for the year</div>
        <div className="cb-encl-item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{v(annualStmt1)}&nbsp;&amp;&nbsp;{v(annualStmt2)}</div>
        <div className="cb-encl-item">d)&nbsp; Debit schedule in triplicate</div>
      </div>
      <div className="cb-total-strip">
        <span className="cb-total-lbl">TOTAL Rs.</span>
        <span className="cb-total-amt">{cur(user?.applAmt)}</span>
      </div>
      <div className="cb-countersign-row">
        <div className="cb-countersign-left"><span className="cb-db-val">&nbsp;</span></div>
        <div className="cb-received-right">RECEIVED PAYMENT</div>
      </div>
      <div className="cb-countersign-label">COUNTERSIGNED</div>
      <div className="cb-spacer" />
      <div className="cb-footer">
        <div className="cb-footer-left">
          <div className="cb-sig-gap" />
          <div>Sr.Accounts officer</div>
          <div>for DIRECTOR</div>
        </div>
        <div className="cb-footer-right">
          <div className="cb-sig-title">SIGNATURE OF THE INDIVIDUAL</div>
          <div className="cb-sig-field-row"><span>ID NO:&nbsp;{v(idNo)}</span><span>&nbsp;&nbsp;Pers No:&nbsp;{v(idNo)}</span></div>
          <div className="cb-sig-field-row"><span>NAME:&nbsp;{v(name)}</span></div>
          <div className="cb-sig-field-row"><span>BANK ACCOUNT NO:&nbsp;<span className="cb-db-val">--</span></span></div>
          <div className="cb-sig-field-row"><span>IFSC CODE:&nbsp;<span className="cb-db-val">--</span></span></div>
        </div>
      </div>
    </div>
    <ContingentBillPage2 user={user} sd={sd} />
    </>
  );
}

function ContingentBillPage2({ user, sd }) {
  const dvNo   = sd?.dvNo   || '--';
  const billNo = sd?.billNo || '--';
  return (
    <div className="cb-a4 cb-page2">
      <div className="cb2-header">FOR USE IN THE DA DEPARTMENT</div>
      <div className="cb2-spacer" />
      <div className="cb2-cols">
        <div className="cb2-col-left">
          <div className="cb2-line">(When payment is made by</div>
          <div className="cb2-line">Inclusion in pay bill&nbsp;<span className="cb-db-val">{billNo}</span></div>
          <div className="cb2-line">passed for payment for</div>
          <div className="cb2-line">Rs.&nbsp;<span className="cb-db-val">{cur(sd?.sanctionAmount)}</span></div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line">Inclusion in the pay bill</div>
          <div className="cb2-line">of&nbsp;<span className="cb-db-val">--</span>&nbsp;for payment as under&nbsp;<span className="cb-db-val">--</span>&nbsp;)</div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line">in favour of DIRECTOR</div>
          <div className="cb2-line">DRDL, HYDERABAD FOR crediting</div>
          <div className="cb2-line">the amount into PUBLIC FUND ACCOUNT</div>
        </div>
        <div className="cb2-col-right">
          <div className="cb2-line">Last charge DV No.</div>
          <div className="cb2-line">for&nbsp;<span className="cb-db-val">{dvNo}</span></div>
          <div className="cb2-line">Details of next charge</div>
          <div className="cb2-line">for&nbsp;<span className="cb-db-val">--</span></div>
          <div className="cb2-line">(When cheque is to be issued passed for</div>
          <div className="cb2-line">Rs.&nbsp;<span className="cb-db-val">{cur(sd?.sanctionAmount)}</span>&nbsp;)</div>
          <div className="cb2-spacer-sm" />
          <div className="cb2-line cb2-code-row"><span>CODE</span><span>TREASURY AMOUNT</span></div>
          <div className="cb2-line cb2-code-row"><span></span><span>SBI</span></div>
          <div className="cb2-line cb2-code-row"><span></span><span>Hyderabad</span></div>
        </div>
      </div>
      <div className="cb2-spacer" />
      <div className="cb2-sig-row">
        {['AUDITOR', 'SO(A)', 'AO', 'AUDITOR', 'AAO', 'SAO'].map((role, i) => (
          <div key={i} className="cb2-sig-cell">
            <div className="cb2-sig-space" />
            <div className="cb2-sig-role">{role}</div>
          </div>
        ))}
      </div>
      <div className="cb2-spacer" />
      <div className="cb2-class-title">CLASSIFICATION OF RECEIPTS AND CHARGES</div>
      <div className="cb2-class-row cb2-class-hdr">
        <div className="cb2-cl">Month</div>
        <div className="cb2-cl">CDA(R&amp;D)</div>
        <div className="cb2-cl">SECTION</div>
        <div className="cb2-cl">CLASS</div>
      </div>
      <div className="cb2-class-row">
        <div className="cb2-cl">Of VR.&nbsp;<span className="cb-db-val">--</span></div>
        <div className="cb2-cl">VR No.&nbsp;<span className="cb-db-val">--</span></div>
        <div className="cb2-cl"></div>
        <div className="cb2-cl"></div>
      </div>
      <div className="cb2-class-row">
        <div className="cb2-cl"><div>Classification Code</div><div>R(1) Rs.&nbsp;<span className="cb-db-val">--</span></div></div>
        <div className="cb2-cl"><div>Receipts MR(2)</div><div>Rs.&nbsp;<span className="cb-db-val">--</span></div></div>
        <div className="cb2-cl"><div>Classification Code</div><div>C(3) Rs.&nbsp;<span className="cb-db-val">--</span></div></div>
        <div className="cb2-cl"><div>Charges NC(4)</div><div>Rs.&nbsp;<span className="cb-db-val">--</span></div></div>
      </div>
      <div className="cb2-spacer" />
      <div className="cb2-instr-title">INSTRUCTION</div>
      <div className="cb2-instr-text">
        All alterations must be attested. Original receipts should be invariably quoted and all prescribed
        certificates or documents in support of the claim.
      </div>
    </div>
  );
}

/* =====================================================
   CFA (Final Withdrawal)
   ===================================================== */
function CFA({ user }) {
  const { sd } = useSanctionDetails(user?.persNumber, user);
  const name    = user?.name || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const desig   = user?.designation || '--';
  const persNo  = user?.persNumber || '--';
  const purpose = purposeLabel(user?.purpose);
  const applAmt = user?.applAmt;
  const amtNum  = applAmt ? Number(applAmt) : 0;
  const amtWords = numToWords(amtNum) + ' Rupees Only';

  return (
    <CFAPage2
      user={user}
      sd={sd}
      name={name}
      acNo={acNo}
      desig={desig}
      persNo={persNo}
      purpose={purpose}
      amtNum={amtNum}
      amtWords={amtWords}
    />
  );
}

function CFAPage2({ user, sd, name, acNo, desig, persNo, purpose, amtNum, amtWords }) {
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';
  const billNo       = sd?.billNo || '--';
  const dvNo         = sd?.dvNo   || '--';
  const dvDate       = sd?.dvDate ? fmt(sd.dvDate) : '--';
  const noInstl      = sd?.noOfInstallments || '--';
  const instlAmt     = sd?.instlAmount ? cur(sd.instlAmount) : '--';
  const commDate     = sd?.commencementDate ? fmt(sd.commencementDate) : '--';
  const prevSanct    = sd?.prevSanctionDate ? fmt(sd.prevSanctionDate) : '--';
  const prevPay      = sd?.prevPaymentDate  ? fmt(sd.prevPaymentDate)  : '--';
  const outstanding  = sd?.outstandingAdvance ? cur(sd.outstandingAdvance) : '--';

  const row = (label, value) => (
    <tr className="cfa-row">
      <td className="cfa-lbl">{label}</td>
      <td className="cfa-sep">:</td>
      <td className="cfa-val">{value}</td>
    </tr>
  );

  return (
    <div className="cfa-a4">
      <div className="cfa-unit-row">
        <span>UNIT CODE</span>
        <span>DRDL 360000032</span>
      </div>
      <div className="cfa-center-header">
        <div className="cfa-ch-bold">MINISTRY OF DEFENCE</div>
        <div className="cfa-ch-bold">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="cfa-ch-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
        <div className="cfa-ch-title">COMPETENT FINANCIAL AUTHORITY (CFA)</div>
        <div className="cfa-ch-sub">SANCTION FOR FINAL WITHDRAWAL FROM GPF</div>
      </div>
      <hr className="cfa-hr" />
      <table className="cfa-table">
        <tbody>
          {row('Name of the Subscriber', name)}
          {row('GPF Account No', acNo)}
          {row('Designation', desig)}
          {row('Pers No / ID No', persNo)}
          {row('Purpose of Withdrawal', purpose)}
          {row('Amount Sanctioned', cur(amtNum))}
          {row('Amount in Words', amtWords)}
          {row('Sanction Date', sanctionDate)}
          {row('Bill No', billNo)}
          {row('DV No', dvNo)}
          {row('DV Date', dvDate)}
          {row('No. of Installments', noInstl)}
          {row('Installment Amount', instlAmt)}
          {row('Commencement Date', commDate)}
          {row('Previous Sanction Date', prevSanct)}
          {row('Previous Payment Date', prevPay)}
          {row('Outstanding Advance', outstanding)}
        </tbody>
      </table>
      <div className="cfa-sig-section">
        <div className="cfa-sig-block">
          <div className="cfa-sig-space" />
          <div className="cfa-sig-line" />
          <div className="cfa-sig-label">ACCOUNTANT</div>
          <div className="cfa-sig-label">FOR DIRECTOR: DRDL</div>
        </div>
      </div>
      <div className="cfa-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   CFA TEMPORARY ADVANCE
   ===================================================== */
function CFATemporaryAdvance({ user }) {
  const { sd } = useSanctionDetails(user?.persNumber, user);
  const name    = user?.name || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const desig   = user?.designation || '--';
  const persNo  = user?.persNumber || '--';
  const purpose = purposeLabel(user?.purpose);
  const applAmt = user?.applAmt;
  const amtNum  = applAmt ? Number(applAmt) : 0;
  const amtWords = numToWords(amtNum) + ' Rupees Only';
  const noInstl  = sd?.noOfInstallments || '--';
  const instlAmt = sd?.instlAmount ? cur(sd.instlAmount) : '--';
  const commDate = sd?.commencementDate ? fmt(sd.commencementDate) : '--';
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';
  const billNo   = sd?.billNo || '--';

  const row = (label, value) => (
    <tr className="cfa-row">
      <td className="cfa-lbl">{label}</td>
      <td className="cfa-sep">:</td>
      <td className="cfa-val">{value}</td>
    </tr>
  );

  return (
    <div className="cfa-a4">
      <div className="cfa-unit-row">
        <span>UNIT CODE</span>
        <span>DRDL 360000032</span>
      </div>
      <div className="cfa-center-header">
        <div className="cfa-ch-bold">MINISTRY OF DEFENCE</div>
        <div className="cfa-ch-bold">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="cfa-ch-sub">PO: KANCHANBAGH, HYDERABAD-500058</div>
        <div className="cfa-ch-title">COMPETENT FINANCIAL AUTHORITY (CFA)</div>
        <div className="cfa-ch-sub">SANCTION FOR TEMPORARY ADVANCE FROM GPF</div>
      </div>
      <hr className="cfa-hr" />
      <table className="cfa-table">
        <tbody>
          {row('Name of the Subscriber', name)}
          {row('GPF Account No', acNo)}
          {row('Designation', desig)}
          {row('Pers No / ID No', persNo)}
          {row('Purpose of Advance', purpose)}
          {row('Amount Sanctioned', cur(amtNum))}
          {row('Amount in Words', amtWords)}
          {row('Sanction Date', sanctionDate)}
          {row('Bill No', billNo)}
          {row('No. of Installments for Refund', noInstl)}
          {row('Installment Amount', instlAmt)}
          {row('Commencement of Recovery', commDate)}
        </tbody>
      </table>
      <div className="cfa-sig-section">
        <div className="cfa-sig-block">
          <div className="cfa-sig-space" />
          <div className="cfa-sig-line" />
          <div className="cfa-sig-label">ACCOUNTANT</div>
          <div className="cfa-sig-label">FOR DIRECTOR: DRDL</div>
        </div>
      </div>
      <div className="cfa-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   CALCULATION SHEET (Final Withdrawal)
   ===================================================== */
function CalculationSheet({ user }) {
  const name    = user?.name || '--';
  const idNo    = user?.persNumber || '--';
  const desig   = user?.designation || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const opening = user?.openingBalance ?? user?.closingBalance ?? 0;
  const subs    = user?.subscriptions || [];
  const totalSub = user?.totalSubscription ?? 0;
  const totalRet = user?.totalRefund ?? 0;
  const applAmt  = user?.applAmt ?? 0;
  const closing  = user?.closingBalance ?? 0;
  const interest = user?.interestAmount ?? 0;
  const totalAvail = Number(closing) + Number(totalSub) + Number(totalRet);
  const balAfter   = totalAvail - Number(applAmt);

  const { sd } = useSanctionDetails(user?.persNumber, user);
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';
  const billNo       = sd?.billNo || '--';
  const dvNo         = sd?.dvNo   || '--';

  return (
    <div className="cs-a4">
      <div className="cs-top-row">
        <span><span className="cs-lbl">ID NO:</span> {idNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span className="cs-top-right">
          <div><span className="cs-lbl">DESIG:</span> {desig}</div>
          <div><span className="cs-lbl">GPF A/C NO:</span> {acNo}</div>
        </span>
      </div>
      <hr className="cs-divider" />

      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - - -</span>
        <span className="cs-ob-amt">{cur(opening)}</span>
      </div>

      <div className="cs-section-label">SUBSCRIPTIONS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month / Year</span>
        <span className="cs-col-sub">Subscription</span>
        <span className="cs-col-total">Total</span>
      </div>
      {subs.length === 0 && (
        <div className="cs-cols-row">
          <span className="cs-col-monthyr">--</span>
          <span className="cs-col-sub">--</span>
          <span className="cs-col-total">--</span>
        </div>
      )}
      {subs.map((s, i) => (
        <div key={i} className="cs-cols-row">
          <span className="cs-col-monthyr">{fmtMonthYear(s.date)}</span>
          <span className="cs-col-sub">{cur(s.gpfSub)}</span>
          <span className="cs-col-total">{cur(s.gpfSub)}</span>
        </div>
      ))}
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{cur(totalSub)}</span>
      </div>

      {Number(totalRet) > 0 && (
        <>
          <div className="cs-section-label">REFUNDS / RECOVERY</div>
          {subs.filter(s => s.gpfRet && Number(s.gpfRet) > 0).map((s, i) => (
            <div key={i} className="cs-cols-row">
              <span className="cs-col-monthyr">{fmtMonthYear(s.date)}</span>
              <span className="cs-col-sub">{cur(s.gpfRet)}</span>
              <span className="cs-col-total">{cur(s.gpfRet)}</span>
            </div>
          ))}
          <div className="cs-total-row">
            <span className="cs-total-spacer" />
            <span className="cs-total-lbl">TOTAL</span>
            <span className="cs-total-amt">{cur(totalRet)}</span>
          </div>
        </>
      )}

      <div className="cs-withdrawal-row">
        <span className="cs-withdrawal-name">WITHDRAWALS</span>
        <span className="cs-withdrawal-mid">
          <span className="cs-cols-hdr-inline">Purpose</span>
          {purposeLabel(user?.purpose)}
        </span>
        <span className="cs-withdrawal-right">
          <span className="cs-total-balance-lbl">TOTAL BALANCE</span>
          <span className="cs-balance-amt">{cur(totalAvail)}</span>
        </span>
      </div>

      <div className="cs-bottom-info">
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">AMOUNT APPLIED FOR</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{cur(applAmt)}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">BALANCE AFTER WITHDRAWAL</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{cur(balAfter)}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">INTEREST ({user?.interestRate ?? 7.1}%)</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{cur(interest)}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">SANCTION DATE</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{sanctionDate}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">BILL NO</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{billNo}</span>
        </div>
        <div className="cs-bottom-row">
          <span className="cs-bottom-lbl">DV NO</span>
          <span className="cs-bottom-sep">:</span>
          <span className="cs-bottom-val">{dvNo}</span>
        </div>
      </div>

      <div className="cs-sig-area">
        <div className="cs-sig-right">
          <div className="cs-sig-bracket">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
          <div className="cs-sig-role">Sr. Accounts Officer</div>
          <div className="cs-sig-role">for DIRECTOR: DRDL</div>
        </div>
      </div>
      <div className="cs-countersign">
        COUNTERSIGNED<br />
        <span style={{fontWeight:400, fontSize:'10pt'}}>Director / Competent Authority</span>
      </div>
      <div className="cs-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   CALCULATION SHEET - TEMPORARY ADVANCE
   ===================================================== */
function CalculationSheetTA({ user, apiData }) {
  const name    = user?.name || '--';
  const idNo    = user?.persNumber || '--';
  const desig   = user?.designation || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const subs    = user?.subscriptions || [];
  const totalSub = user?.totalSubscription ?? 0;
  const totalRet = user?.totalRefund ?? 0;
  const closing  = user?.closingBalance ?? 0;
  const applAmt  = user?.applAmt ?? 0;
  const totalAvail = Number(closing) + Number(totalSub) + Number(totalRet);
  const balAfter   = totalAvail - Number(applAmt);

  const { sd } = useSanctionDetails(user?.persNumber, user);
  const noInstl  = sd?.noOfInstallments || '--';
  const instlAmt = sd?.instlAmount ? cur(sd.instlAmount) : '--';
  const commDate = sd?.commencementDate ? fmt(sd.commencementDate) : '--';
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';
  const outstanding  = sd?.outstandingAdvance ? cur(sd.outstandingAdvance) : '--';
  const prevSanct    = sd?.prevSanctionDate ? fmt(sd.prevSanctionDate) : '--';

  return (
    <div className="cs-a4">
      <div className="csta-top-bar">
        <span><span className="cs-lbl">ID NO:</span> {idNo}</span>
        <span><span className="cs-lbl">NAME:</span> {name}</span>
        <span><span className="cs-lbl">DESIG:</span> {desig}</span>
        <span><span className="cs-lbl">GPF A/C NO:</span> {acNo}</span>
      </div>
      <hr className="cs-divider" />

      <div className="cs-ob-row">
        <span className="cs-ob-label">CLOSING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - - -</span>
        <span className="cs-ob-amt">{cur(closing)}</span>
      </div>

      <div className="cs-section-label">SUBSCRIPTIONS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month / Year</span>
        <span className="cs-col-sub">Subscription</span>
        <span className="cs-col-total">Total</span>
      </div>
      {subs.map((s, i) => (
        <div key={i} className="cs-cols-row">
          <span className="cs-col-monthyr">{fmtMonthYear(s.date)}</span>
          <span className="cs-col-sub">{cur(s.gpfSub)}</span>
          <span className="cs-col-total">{cur(s.gpfSub)}</span>
        </div>
      ))}
      <div className="cs-total-row">
        <span className="cs-total-spacer" />
        <span className="cs-total-lbl">TOTAL</span>
        <span className="cs-total-amt">{cur(totalSub)}</span>
      </div>

      <div className="cs-withdrawal-row">
        <span className="cs-withdrawal-name">TOTAL AVAILABLE</span>
        <span className="cs-withdrawal-mid"></span>
        <span className="cs-withdrawal-right">
          <span className="cs-total-balance-lbl">TOTAL BALANCE</span>
          <span className="cs-balance-amt">{cur(totalAvail)}</span>
        </span>
      </div>

      <hr className="csta-adv-divider" />
      <div className="csta-adv-section">
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">AMOUNT OF ADVANCE APPLIED</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{cur(applAmt)}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">PREVIOUS OUTSTANDING ADVANCE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{outstanding}</span>
        </div>
        <div className="csta-adv-row csta-adv-row-total">
          <span className="csta-adv-lbl">BALANCE AFTER ADVANCE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val csta-adv-val-bold">{cur(balAfter)}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">NO. OF INSTALLMENTS</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{noInstl}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">INSTALLMENT AMOUNT</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{instlAmt}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">COMMENCEMENT OF RECOVERY</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{commDate}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">SANCTION DATE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{sanctionDate}</span>
        </div>
        <div className="csta-adv-row">
          <span className="csta-adv-lbl">PREVIOUS SANCTION DATE</span>
          <span className="csta-adv-sep">:</span>
          <span className="csta-adv-val">{prevSanct}</span>
        </div>
      </div>

      <div className="cs-sig-area">
        <div className="cs-sig-right">
          <div className="cs-sig-bracket">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
          <div className="cs-sig-role">Sr. Accounts Officer</div>
          <div className="cs-sig-role">for DIRECTOR: DRDL</div>
        </div>
      </div>
      <div className="cs-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   APPLICATION (Final Withdrawal)
   ===================================================== */
function Application({ user }) {
  const name    = user?.name || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const desig   = user?.designation || '--';
  const persNo  = user?.persNumber || '--';
  const dob     = user?.dob ? fmt(user.dob) : '--';
  const retDate = user?.dateOfRetirement ? fmt(user.dateOfRetirement) : '--';
  const purpose = purposeLabel(user?.purpose);
  const applAmt = user?.applAmt;
  const amtNum  = applAmt ? Number(applAmt) : 0;
  const amtWords = numToWords(amtNum) + ' Rupees Only';
  const address = user?.houseAddr || user?.address || '--';
  const closing = user?.closingBalance ?? 0;

  const field = (no, label, value) => (
    <tr className="appl-row">
      <td className="appl-no">{no}.</td>
      <td className="appl-label">{label}</td>
      <td className="appl-colon">:</td>
      <td className="appl-value"><span className="appl-print-val">{value}</span></td>
    </tr>
  );

  return (
    <div className="appl-a4">
      <div className="appl-title-block">
        <div className="appl-title-main">APPLICATION FOR FINAL WITHDRAWAL FROM GPF</div>
        <div className="appl-title-office">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY, HYDERABAD</div>
      </div>
      <table className="appl-table">
        <tbody>
          {field(1, 'Name of the Subscriber', name)}
          {field(2, 'GPF Account Number', acNo)}
          {field(3, 'Designation', desig)}
          {field(4, 'Pers No / ID No', persNo)}
          {field(5, 'Date of Birth', dob)}
          {field(6, 'Date of Retirement', retDate)}
          {field(7, 'Purpose of Withdrawal', purpose)}
          {field(8, 'Amount Applied For (Rs.)', cur(amtNum))}
          {field(9, 'Amount in Words', amtWords)}
          {field(10, 'Closing Balance as per Last Statement', cur(closing))}
          {field(11, 'Address / Property Details', address)}
        </tbody>
      </table>
      <div className="appl-sig-section">
        <div className="appl-sig-block">
          <div className="appl-sig-line" />
          <div className="appl-sig-label">Signature of Subscriber</div>
        </div>
      </div>
      <div className="appl-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   APPLICATION - TEMPORARY ADVANCE
   ===================================================== */
function ApplicationTemporaryAdvance({ user }) {
  const name    = user?.name || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const desig   = user?.designation || '--';
  const persNo  = user?.persNumber || '--';
  const dob     = user?.dob ? fmt(user.dob) : '--';
  const retDate = user?.dateOfRetirement ? fmt(user.dateOfRetirement) : '--';
  const purpose = purposeLabel(user?.purpose);
  const applAmt = user?.applAmt;
  const amtNum  = applAmt ? Number(applAmt) : 0;
  const amtWords = numToWords(amtNum) + ' Rupees Only';
  const closing  = user?.closingBalance ?? 0;
  const { sd }   = useSanctionDetails(user?.persNumber, user);
  const noInstl  = sd?.noOfInstallments || '--';
  const instlAmt = sd?.instlAmount ? cur(sd.instlAmount) : '--';
  const commDate = sd?.commencementDate ? fmt(sd.commencementDate) : '--';

  const field = (no, label, value) => (
    <tr className="ta-row">
      <td className="ta-no">{no}.</td>
      <td className="ta-label">{label}</td>
      <td className="ta-colon">:</td>
      <td className="ta-val"><span className="appl-print-val">{value}</span></td>
    </tr>
  );

  return (
    <div className="ta-a4">
      <div className="ta-title-block">
        <div className="ta-title-line">APPLICATION FOR TEMPORARY ADVANCE FROM GPF</div>
        <div className="ta-title-sub">Under Rule 12 of GPF (CS) Rules, 1960</div>
      </div>
      <table className="ta-table">
        <tbody>
          {field(1, 'Name of the Subscriber', name)}
          {field(2, 'GPF Account Number', acNo)}
          {field(3, 'Designation', desig)}
          {field(4, 'Pers No / ID No', persNo)}
          {field(5, 'Date of Birth', dob)}
          {field(6, 'Date of Retirement', retDate)}
          {field(7, 'Purpose of Advance', purpose)}
          {field(8, 'Amount of Advance Required (Rs.)', cur(amtNum))}
          {field(9, 'Amount in Words', amtWords)}
          {field(10, 'Closing Balance as per Last Statement', cur(closing))}
          {field(11, 'No. of Installments for Repayment', noInstl)}
          {field(12, 'Installment Amount', instlAmt)}
          {field(13, 'Commencement of Recovery', commDate)}
        </tbody>
      </table>
      <div className="ta-declaration">
        I hereby declare that the information furnished above is true and correct to the best of my knowledge
        and belief. I undertake to repay the advance in the stipulated installments.
      </div>
      <div className="ta-footer">
        <div className="ta-footer-left">
          <span className="ta-footer-label">Date:</span>
          <span className="appl-print-val" style={{minWidth:'120px'}}>&nbsp;</span>
        </div>
        <div className="ta-footer-right">
          <div className="ta-sig-line" />
          <div className="ta-sig-label">Signature of Subscriber</div>
        </div>
      </div>
      <div className="appl-system-note">Generated by GPF Management System</div>
    </div>
  );
}

/* =====================================================
   SCHEDULE (GPF DEBIT SCHEDULE)
   ===================================================== */
function Schedule({ user }) {
  const { sd } = useSanctionDetails(user?.persNumber, user);
  const name    = user?.name || '--';
  const acNo    = user?.gpfAccountNumber || '--';
  const desig   = user?.designation || '--';
  const unit    = 'DRDL';
  const applAmt = user?.applAmt ?? 0;
  const amtNum  = Number(applAmt);
  const amtWords = numToWords(amtNum) + ' Rupees Only';
  const outstanding = sd?.outstandingAdvance ?? 0;
  const consolidated = amtNum + Number(outstanding);
  const noInstl  = sd?.noOfInstallments || '--';
  const instlAmt = sd?.instlAmount ? cur(sd.instlAmount) : '--';
  const billNo   = sd?.billNo || '--';
  const billDate = sd?.billDate ? fmt(sd.billDate) : new Date().toLocaleDateString('en-IN');

  return (
    <div className="sch-a4">
      <div className="sch-unit-row">
        <span>UNIT CODE</span>
        <span>DRDL 360000032</span>
      </div>

      <div className="sch-center-header">
        <div className="sch-ch-line sch-ch-bold">MINISTRY OF DEFENCE</div>
        <div className="sch-ch-line sch-ch-bold">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="sch-ch-line">PO: KANCHANBAGH, HYDERABAD-500058</div>
        <div className="sch-ch-title">GPF DEBIT SCHEDULE</div>
      </div>

      <hr className="sch-hr" />

      <div className="sch-appendix">APPENDIX &apos;B&apos; TO A O 060255 FROM &apos;B&apos; OF GPF</div>

      <div className="sch-info-block">
        <div className="sch-info-row">
          <span className="sch-info-lbl">GPF Account No</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val">{acNo}</span>
        </div>
        <div className="sch-info-row">
          <span className="sch-info-lbl">Name of the Subscriber</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val">{name}</span>
        </div>
        <div className="sch-info-row">
          <span className="sch-info-lbl">Designation</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val">{desig}</span>
        </div>
        <div className="sch-info-row">
          <span className="sch-info-lbl">UNIT</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val">{unit}</span>
        </div>
        <div className="sch-info-row">
          <span className="sch-info-lbl">Amount of Advance to be Debited</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val">{cur(amtNum)}</span>
        </div>
        <div className="sch-info-row">
          <span className="sch-info-lbl sch-words">Rupees in Words</span>
          <span className="sch-info-sep">:</span>
          <span className="sch-info-val sch-words">{amtWords}</span>
        </div>
      </div>

      <table className="sch-table">
        <thead>
          <tr>
            <th className="sch-th">Amount of advance<br />Rs.</th>
            <th className="sch-th">Previous advance<br />O/S</th>
            <th className="sch-th">Consolidated<br />advance Rs.</th>
            <th className="sch-th">No. of<br />installments</th>
            <th className="sch-th">Rate of refund<br />Rs.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sch-td">{cur(amtNum)}</td>
            <td className="sch-td">{cur(outstanding)}</td>
            <td className="sch-td">{cur(consolidated)}</td>
            <td className="sch-td">{noInstl}</td>
            <td className="sch-td">{instlAmt}</td>
          </tr>
          <tr>
            <td className="sch-td sch-td-empty"></td>
            <td className="sch-td sch-td-empty"></td>
            <td className="sch-td sch-td-empty"></td>
            <td className="sch-td sch-td-empty"></td>
            <td className="sch-td sch-td-empty"></td>
          </tr>
        </tbody>
      </table>

      <div className="sch-dated-sig-row">
        <div className="sch-dated">Dated: {billDate}</div>
        <div className="sch-sig-block">
          <div className="sch-sig-space" />
          <div className="sch-sig-role">ACCOUNTANT</div>
          <div className="sch-sig-role">FOR DIRECTOR: DRDL</div>
        </div>
      </div>

      <div className="sch-ext-note">External use</div>

      <div className="sch-footer">
        <span>Bill No. DRDL/FIN/CGOS/GPF-TY/{billNo}</span>
        <span>Dated: {billDate}</span>
      </div>

      <div className="sch-system-note">Generated by GPF Management System</div>
    </div>
  );
}
