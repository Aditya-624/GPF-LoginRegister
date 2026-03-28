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
   CFA (Final Withdrawal) - Page 1
   ===================================================== */
function CFA({ user }) {
  const { sd } = useSanctionDetails(user?.persNumber, user);
  const name       = user?.name || '--';
  const acNo       = user?.gpfAccountNumber || '--';
  const applAmt    = user?.applAmt;
  const amtNum     = applAmt ? Number(applAmt) : 0;
  const amtWords   = numToWords(amtNum) + ' Rupees Only';
  const dob        = user?.dob ? fmt(user.dob) : '--';
  const joinDate   = user?.dateOfJoining ? fmt(user.dateOfJoining) : '--';
  const retDate    = user?.dateOfRetirement ? fmt(user.dateOfRetirement) : '--';
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';
  const address    = sd?.houseAddr || user?.address || '--';

  return (
    <>
      {/* PAGE 1 */}
      <div className="cfa-a4">

        {/* UNIT CODE - top right */}
        <div style={{textAlign:'right', fontSize:'10pt', lineHeight:'1.5', marginBottom:'16px'}}>
          <div><strong>UNITCODE:360000032</strong></div>
          <div><strong>UNIT:DRDL</strong></div>
        </div>

        {/* 3-column date row */}
        <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'20px', fontSize:'10pt'}}>
          <tbody><tr>
            <td style={{width:'33%', verticalAlign:'top'}}>
              <div style={{fontWeight:'bold'}}>DATE OF APPOINTMENT</div>
              <div>{joinDate}</div>
            </td>
            <td style={{width:'33%', verticalAlign:'top'}}>
              <div style={{fontWeight:'bold'}}>DATE OF BIRTH</div>
              <div>{dob}</div>
            </td>
            <td style={{width:'34%', verticalAlign:'top'}}>
              <div style={{fontWeight:'bold'}}>DATE OF SUPERANNUATION</div>
              <div>{retDate}</div>
            </td>
          </tr></tbody>
        </table>

        {/* Title - centered, underlined */}
        <div style={{textAlign:'center', fontWeight:'bold', textDecoration:'underline', fontSize:'11pt', marginBottom:'20px'}}>
          FORM FOR SANCTION OF WITHDRAWAL FROM PROVIDENT FUND
        </div>

        {/* Address block - right half only, left half blank */}
        <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'16px', fontSize:'10pt'}}>
          <tbody><tr>
            <td style={{width:'50%'}}></td>
            <td style={{width:'50%', verticalAlign:'top', lineHeight:'1.7'}}>
              <div><strong>DRDL/FIN/CGOS/GPF-FW/100</strong></div>
              <div>Government of India,</div>
              <div>Ministry of Defence,</div>
              <div>R&amp;D Organisation,</div>
              <div>DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY,</div>
              <div>PO: KANCHANBAGH</div>
              <div>HYDERABAD: 500058</div>
              <div>DATED: {sanctionDate}</div>
            </td>
          </tr></tbody>
        </table>

        {/* To block */}
        <div style={{fontSize:'11pt', lineHeight:'1.8', marginBottom:'16px'}}>
          <div>To</div>
          <div style={{display:'flex', gap:'8px', marginLeft:'10px'}}>
            <span>1.</span>
            <span>THE PCDA(R&amp;D),<br /><u>HYDERABAD-500058.</u></span>
          </div>
          <div style={{display:'flex', gap:'8px', marginLeft:'10px'}}>
            <span>2.</span>
            <span>The Controller of Defence Accounts (R&amp;D).<br /><u>NEW DELHI-110001</u></span>
          </div>
        </div>

        {/* Subject */}
        <div style={{fontSize:'11pt', margin:'16px 0', lineHeight:'1.7'}}>
          <strong>SUB:&nbsp;&nbsp; WITHDRAWL FROM THE GPF(CS) IN RESPECT OF</strong><br />
          <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SHRI {name}&nbsp;&nbsp; A/C NO. {acNo}</strong>
        </div>

        <div style={{fontSize:'11pt', marginBottom:'12px'}}>Sir,</div>

        {/* Para 1 */}
        <div className="cfa-para">
          <span className="cfa-para-no">1.</span>
          <span className="cfa-para-text">
            I am directed to convey sanction of the Director DRDL, HYD, under Rule No. 15(1)(B)(e) of GPF
            (cs) Rules, 1960 to the withdrawal by SHRI <strong>{name}</strong> a sum of Rs. <strong>{cur(amtNum)}</strong> (Rupees <strong>{amtWords}</strong>) from his/her GPF fund A/C No. <strong>{acNo}</strong> to enable him/her to meet the expenditure
            in connection with Upkeeping of ancestral house at native place<br />
            Address: {address}
          </span>
        </div>

        {/* Para 2 */}
        <div className="cfa-para">
          <span className="cfa-para-no">2.</span>
          <span className="cfa-para-text">
            It is certified that SHRI <strong>{name}</strong> is within 10 years of his/her retirement or superannuation or
            has completed ten/fifteen/twentyfive years of government service on <strong>{joinDate}</strong>
          </span>
        </div>

        {/* Para 3 */}
        <div className="cfa-para">
          <span className="cfa-para-no">3.</span>
          <span className="cfa-para-text">
            It is also certified that the total amount drawn from all government sources by SHRI <strong>{name}</strong> for
            <strong> {purposeLabel(user?.purpose)}</strong> purposes does not exceed Rs. <strong>{cur(amtNum)}</strong> or his/her Fifty months pay which ever is less.
          </span>
        </div>
      </div>

      {/* PAGE 2 */}
      <CFAPage2 user={user} sd={sd} name={name} acNo={acNo} amtNum={amtNum} amtWords={amtWords} sanctionDate={sanctionDate} />
    </>
  );
}

function CFAPage2({ user, sd, name, acNo, amtNum, amtWords, sanctionDate }) {
  const billNo    = sd?.billNo || '--';
  const dvDate    = sd?.dvDate ? fmt(sd.dvDate) : '--';
  const opening   = user?.openingBalance ?? user?.closingBalance ?? 0;
  const subs      = user?.subscriptions || [];
  const totalSub  = user?.totalSubscription ?? 0;
  const totalRet  = user?.totalRefund ?? 0;
  const closing   = user?.closingBalance ?? 0;
  const applAmt   = user?.applAmt ?? 0;
  const totalAvail = Number(closing) + Number(totalSub) + Number(totalRet);
  const balAfter   = totalAvail - Number(applAmt);

  const subDates = subs.map(s => s.date).filter(Boolean).sort();
  const subFrom  = subDates.length ? fmtMonthYear(subDates[0]) : '--';
  const subTo    = subDates.length ? fmtMonthYear(subDates[subDates.length - 1]) : '--';

  const colStyle = {display:'flex', fontSize:'10pt', padding:'3px 0'};
  const hdrStyle = {display:'flex', fontSize:'10pt', fontWeight:'bold', borderBottom:'1px solid #000', paddingBottom:'2px', marginBottom:'2px'};
  const col1 = {flex:2};
  const col2 = {flex:1, textAlign:'right', paddingRight:'10px'};
  const col3 = {flex:1, textAlign:'right'};

  return (
    <div className="cfa-a4">

      {/* Opening Balance */}
      <div style={{display:'flex', alignItems:'center', fontSize:'11pt', margin:'0 0 16px 0'}}>
        <span>OPENING BALANCE</span>
        <span style={{flex:1, letterSpacing:'2px', margin:'0 8px'}}>- - - - - - - - - - - - - - - - &gt;</span>
        <span style={{fontWeight:'bold', minWidth:'110px', textAlign:'right'}}>{cur(opening)}</span>
      </div>

      {/* Subscription Credits */}
      <div style={{fontWeight:'bold', fontSize:'11pt', margin:'10px 0 4px 0'}}>SUBSCRIPTION CREDITS</div>
      <div style={hdrStyle}><span style={col1}>Month/Year</span><span style={col2}>Subscription</span><span style={col3}>Total</span></div>
      <div style={colStyle}><span style={col1}>FROM {subFrom} TO {subTo}</span><span style={col2}>{cur(totalSub)}</span><span style={col3}>{cur(totalSub)}</span></div>
      <div style={{...colStyle, justifyContent:'flex-end', fontWeight:'bold', marginTop:'4px'}}>
        <span style={{minWidth:'110px', textAlign:'right'}}>{cur(totalSub)}</span>
      </div>

      {/* Advance Refund Credits */}
      <div style={{fontWeight:'bold', fontSize:'11pt', margin:'10px 0 4px 0'}}>ADVANCE REFUND CREDITS</div>
      <div style={hdrStyle}><span style={col1}>Month/Year</span><span style={col2}>Refund</span><span style={col3}>Total</span></div>
      <div style={colStyle}><span style={col1}>FROM {subFrom} TO {subTo}</span><span style={col2}>{Number(totalRet) > 0 ? cur(totalRet) : '0'}</span><span style={col3}>{Number(totalRet) > 0 ? cur(totalRet) : '0'}</span></div>
      <div style={{...colStyle, justifyContent:'flex-end', marginTop:'4px'}}>
        <span style={{minWidth:'110px', textAlign:'right'}}>{Number(totalRet) > 0 ? cur(totalRet) : '0'}</span>
      </div>

      {/* Recovery from 7CPC Arrears */}
      <div style={{fontWeight:'bold', fontSize:'11pt', margin:'10px 0 4px 0'}}>RECOVERY FROM 7CPC ARREARS</div>
      <div style={hdrStyle}><span style={col1}>Month/Year</span><span style={col2}>GPF Recovery</span><span style={col3}>Total</span></div>
      <div style={{...colStyle, minHeight:'22px'}}></div>
      <div style={{display:'flex', justifyContent:'flex-end', fontWeight:'bold', fontSize:'11pt', margin:'6px 0'}}>
        <span style={{marginRight:'20px'}}>TOTAL</span>
        <span style={{minWidth:'110px', textAlign:'right'}}>{cur(totalAvail)}</span>
      </div>

      {/* Withdrawals */}
      <div style={{fontWeight:'bold', fontSize:'11pt', margin:'10px 0 4px 0'}}>WITHDRAWALS</div>
      <div style={hdrStyle}><span style={col1}></span><span style={col2}></span><span style={col3}>Total</span></div>
      <div style={colStyle}><span style={col1}>{purposeLabel(user?.purpose)}</span><span style={col2}></span><span style={col3}>{cur(applAmt)}</span></div>
      <div style={{display:'flex', justifyContent:'flex-end', fontWeight:'bold', fontSize:'11pt', margin:'6px 0'}}>
        <span style={{marginRight:'20px'}}>BALANCE</span>
        <span style={{minWidth:'110px', textAlign:'right'}}>{cur(balAfter)}</span>
      </div>

      {/* Previous sanction paragraph */}
      <div style={{fontSize:'11pt', lineHeight:'1.7', margin:'20px 0', textAlign:'justify'}}>
        SHRI <strong>{name}</strong> was last sanctioned a part of final withdrawal by this office for an amount of Rs. <strong>{cur(amtNum)}</strong> vide Bill No. <strong>{billNo}</strong> Bill Dt. <strong>{dvDate}</strong> after the C.C.0-9 for the year <strong>{sanctionDate}</strong>
      </div>

      {/* Signature */}
      <div style={{marginTop:'auto', paddingTop:'30px', textAlign:'right'}}>
        <div style={{marginBottom:'30px'}}>Yours Faithfully</div>
        <div><strong>CFA</strong></div>
        <div><strong>Senior Accounts Officer</strong></div>
        <div><strong>For Director, DRDL</strong></div>
      </div>

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
  const totalAvail = Number(closing) + Number(totalSub) + Number(totalRet);
  const balAfter   = totalAvail - Number(applAmt);

  const { sd } = useSanctionDetails(user?.persNumber, user);
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';

  // Compute date range from subscriptions
  const subDates = subs.map(s => s.date).filter(Boolean).sort();
  const subFrom  = subDates.length ? fmtMonthYear(subDates[0]) : '--';
  const subTo    = subDates.length ? fmtMonthYear(subDates[subDates.length - 1]) : '--';

  return (
    <div className="cs-a4">
      {/* Header row: ID NO, NAME, DESIG / GPF A/C NO */}
      <div className="cs-top-row">
        <span><strong>ID NO:</strong> {idNo}</span>
        <span><strong>NAME:</strong> {name}</span>
        <span className="cs-top-right">
          <div><strong>DESIG:</strong> {desig}</div>
          <div><strong>GPF A/C NO:</strong> {acNo}</div>
        </span>
      </div>

      {/* Opening Balance */}
      <div className="cs-ob-row">
        <span className="cs-ob-label">OPENING BALANCE</span>
        <span className="cs-ob-dashes">- - - - - - - - - - - - - - - - - - &gt;</span>
        <span className="cs-ob-amt">{cur(opening)}</span>
      </div>

      {/* Subscription Credits */}
      <div className="cs-section-label">SUBSCRIPTION CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Subscription</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">FROM {subFrom} TO {subTo}</span>
        <span className="cs-col-sub">{cur(totalSub)}</span>
        <span className="cs-col-total">{cur(totalSub)}</span>
      </div>

      {/* Advance Refund Credits */}
      <div className="cs-section-label">ADVANCE REFUND CREDITS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">Refund</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">FROM {subFrom} TO {subTo}</span>
        <span className="cs-col-sub">{Number(totalRet) > 0 ? cur(totalRet) : '0'}</span>
        <span className="cs-col-total">{Number(totalRet) > 0 ? cur(totalRet) : '0'}</span>
      </div>

      {/* Recovery from 7CPC Arrears */}
      <div className="cs-section-label">RECOVERY FROM 7CPC ARREARS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr">Month/Year</span>
        <span className="cs-col-sub">GPF Recovery</span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row cs-empty-row">
        <span className="cs-col-monthyr"></span>
        <span className="cs-col-sub"></span>
        <span className="cs-col-total"></span>
      </div>
      <div className="cs-grand-total-row">
        <span className="cs-grand-total-lbl">TOTAL</span>
        <span className="cs-grand-total-amt">{cur(totalAvail)}</span>
      </div>

      {/* Withdrawals */}
      <div className="cs-section-label">WITHDRAWALS</div>
      <div className="cs-cols-hdr">
        <span className="cs-col-monthyr"></span>
        <span className="cs-col-sub"></span>
        <span className="cs-col-total">Total</span>
      </div>
      <div className="cs-cols-row">
        <span className="cs-col-monthyr">{purposeLabel(user?.purpose)}</span>
        <span className="cs-col-sub"></span>
        <span className="cs-col-total">{cur(applAmt)}</span>
      </div>
      <div className="cs-grand-total-row">
        <span className="cs-grand-total-lbl">TOTAL<br />BALANCE</span>
        <span className="cs-grand-total-amt">{cur(balAfter)}</span>
      </div>

      {/* Amount Proposed / Service info */}
      <div className="cs-proposed-block">
        <div className="cs-proposed-left">
          <div><strong>AMOUNT PROPOSED TO WITHDRAWN</strong></div>
          <div><strong>SERVICE AS ON SANCTION DATE</strong></div>
          <div><strong>LEFT OVER SERVICE</strong></div>
        </div>
        <div className="cs-proposed-right">
          <div>: {cur(applAmt)}</div>
          <div>: {sanctionDate}</div>
          <div>:</div>
        </div>
      </div>

      {/* Signature */}
      <div className="cs-sig-area">
        <div className="cs-sig-right">
          <div className="cs-sig-bracket">( _________________________ )</div>
          <div className="cs-sig-role">for Director DRDL</div>
        </div>
      </div>
      <div className="cs-countersign">
        (Counter Signed)<br />
        ACCOUNTS OFFICER<br />
        for DIRECTOR DRDL
      </div>
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
  const joinDate = user?.dateOfJoining ? fmt(user.dateOfJoining) : '--';
  const dob     = user?.dob ? fmt(user.dob) : '--';
  const closing = user?.closingBalance ?? 0;
  const applAmt = user?.applAmt;
  const amtNum  = applAmt ? Number(applAmt) : 0;
  const purpose = purposeLabel(user?.purpose);
  const basicPay = user?.basicPay ? cur(user.basicPay) : '--';

  const row = (no, label, value, subLabel) => (
    <tr className="appl-row">
      <td className="appl-no">{no}</td>
      <td className="appl-label">
        {subLabel ? <><span>{label}</span><br/><span className="appl-sublabel">{subLabel}</span></> : label}
      </td>
      <td className="appl-colon">:</td>
      <td className="appl-value">{value}</td>
    </tr>
  );

  return (
    <div className="appl-a4">
      {/* Title */}
      <div className="appl-title-block">
        <div className="appl-title-main">FORM FOR APPLICATION OF FINAL WITHDRAWAL FROM G.P.FUND</div>
        <div className="appl-title-office">OFFICE: DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY,</div>
        <div className="appl-title-office">HYDERABAD</div>
      </div>

      <table className="appl-table">
        <tbody>
          {row('1.', 'Name of the subscriber', name)}
          {row('2.', 'Account Number', acNo)}
          {row('3.', 'Designation/ID No', `${desig} / ${persNo}`)}
          {row('4.', 'Basic Pay', basicPay)}
          {row('5.', 'Date of joining service & Superannuation', joinDate)}
          {row('6.', 'Date of Birth', dob)}
          {row('7.', 'Balance at credit of the subscriber', cur(closing), 'on the date of application.')}
          {row('8.', 'Amount of Withdrawal required', cur(amtNum))}
          <tr className="appl-row">
            <td className="appl-no">9.</td>
            <td className="appl-label">
              <div>a) Purpose for which the advance is required</div>
            </td>
            <td className="appl-colon">:</td>
            <td className="appl-value">{purpose}</td>
          </tr>
          <tr className="appl-row">
            <td className="appl-no"></td>
            <td className="appl-label">
              <div className="appl-sublabel">b) Rules under which the request is covered</div>
            </td>
            <td className="appl-colon">:</td>
            <td className="appl-value">15(1)(B)(e) of GPF(CS) Rules 1960</td>
          </tr>
          {row('10.', 'Whether any withdrawal was taken for the same purpose earlier', 'No')}
          {row('11.', 'Name of the Accounts officer maintaining the provident accounts', 'The Controller of Defence Accounts (R&D), New Delhi')}
        </tbody>
      </table>

      <div className="appl-sig-section">
        <div className="appl-sig-block">
          <div className="appl-sig-space" />
          <div className="appl-sig-line" />
          <div className="appl-sig-label"><strong>Signature of the applicant</strong></div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   APPLICATION - TEMPORARY ADVANCE (Purpose E)
   ===================================================== */
function ApplicationTemporaryAdvance({ user }) {
  const name     = user?.name || '--';
  const acNo     = user?.gpfAccountNumber || '--';
  const desig    = user?.designation || '--';
  const persNo   = user?.persNumber || '--';
  const dob      = user?.dob ? fmt(user.dob) : '--';
  const joinDate = user?.dateOfJoining ? fmt(user.dateOfJoining) : '--';
  const retDate  = user?.dateOfRetirement ? fmt(user.dateOfRetirement) : '--';
  const purpose  = purposeLabel(user?.purpose);
  const applAmt  = user?.applAmt;
  const amtNum   = applAmt ? Number(applAmt) : 0;
  const closing  = user?.closingBalance ?? 0;
  const basicPay = user?.basicPay ? cur(user.basicPay) : '--';
  const { sd }   = useSanctionDetails(user?.persNumber, user);
  const noInstl  = sd?.noOfInstallments || '--';
  const outstanding = sd?.outstandingAdvance ? cur(sd.outstandingAdvance) : '0';
  const sanctionDate = sd?.sanctionDate ? fmt(sd.sanctionDate) : '--';

  const row = (no, labelNode, valueNode) => (
    <tr className="appl-row">
      <td className="appl-no">{no}</td>
      <td className="appl-label">{labelNode}</td>
      <td className="appl-colon">:</td>
      <td className="appl-value">{valueNode}</td>
    </tr>
  );

  return (
    <div className="appl-a4">
      {/* Title */}
      <div className="appl-title-block">
        <div className="appl-title-main">MINISTRY OF DEFENCE</div>
        <div className="appl-title-main">DEFENCE RESEARCH &amp; DEVELOPMENT LABORATORY</div>
        <div className="appl-title-main">PO: KANCHANBAGH, HYDERABAD-500058</div>
      </div>

      <table className="appl-table">
        <tbody>
          {row('1.', 'Name of the subscriber', name)}
          {row('2.', 'Account Number', acNo)}
          {row('3.', 'Designation/T.No', `${desig} / ${persNo}`)}
          {row('4.', 'Basic Pay', basicPay)}
          <tr className="appl-row">
            <td className="appl-no">5.</td>
            <td className="appl-label">Balance at credit of the subscriber on the date of<br />application as per working enclosed is</td>
            <td className="appl-colon">:</td>
            <td className="appl-value">{cur(closing)}</td>
          </tr>
          <tr className="appl-row">
            <td className="appl-no">6.</td>
            <td className="appl-label">
              Amount of previous advance/advance-outstanding:-<br />
              Amount of advance taken &nbsp;&nbsp;&nbsp; Balance outstanding<br />
              <span style={{paddingLeft:'8px'}}>i) Rs. {cur(amtNum)}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>ii) Rs. {outstanding}</span>
            </td>
            <td className="appl-colon"></td>
            <td className="appl-value"></td>
          </tr>
          {row('7.', 'Amount of advance required', cur(amtNum))}
          <tr className="appl-row">
            <td className="appl-no">8.</td>
            <td className="appl-label">
              <div>a)&nbsp; Purpose for which the advance is required</div>
              <div>b)&nbsp; Rules under which the request is covered</div>
            </td>
            <td className="appl-colon">:</td>
            <td className="appl-value">
              <div>{purpose}</div>
              <div>12(1)(c) GPF(CS) Rules 1960</div>
            </td>
          </tr>
          <tr className="appl-row">
            <td className="appl-no">9.</td>
            <td className="appl-label">
              <div>a)&nbsp; Amount of consolidated advance</div>
              <div>b)&nbsp; Number of monthly instalments in which consolidated<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;advance is proposed to be recovered</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date Of Appointment</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date Of Birth</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date Of Superannuation</div>
            </td>
            <td className="appl-colon">:</td>
            <td className="appl-value">
              <div>{cur(amtNum)}</div>
              <div>{noInstl}</div>
              <div>{joinDate}</div>
              <div>{dob}</div>
              <div>{retDate}</div>
            </td>
          </tr>
          <tr className="appl-row">
            <td className="appl-no">10.</td>
            <td className="appl-label">Full particulars of the pecuniary circumstances of the<br />subscriber justifying for applying for temporary advance</td>
            <td className="appl-colon">:</td>
            <td className="appl-value"></td>
          </tr>
        </tbody>
      </table>

      {/* Declaration */}
      <div style={{fontSize:'11pt', lineHeight:'1.7', margin:'20px 0', textAlign:'justify'}}>
        I certify that particulars given above are correct and complete to the best of knowledge and belief and
        nothing has been concealed by me.
      </div>

      {/* Footer: Dated left, Signature right */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:'30px'}}>
        <div style={{fontSize:'11pt'}}>
          Dated: <strong>{sanctionDate}</strong>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{height:'50px'}}></div>
          <div style={{borderTop:'1px solid #000', width:'200px', marginBottom:'4px'}}></div>
          <div style={{fontSize:'11pt'}}><strong>Signature of the applicant</strong></div>
          <div style={{fontSize:'10pt'}}>{name}</div>
          <div style={{fontSize:'10pt'}}>{desig}</div>
        </div>
      </div>
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
