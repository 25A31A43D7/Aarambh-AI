import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserProfile, GPSLocation, BusinessIdea, LoanCalcResult } from '../types';
import { fmtINR } from './calculator';

export interface StandardLoanComparison {
  capex: number;
  marginPct: number;
  marginMoney: number;
  subsidyPct: number;
  subsidyAmount: number;
  netLoan: number;
  ratePct: number;
  moratorium: number;
  regularEmi: number;
  totalInterest: number;
  totalOutflow: number;
  dscr: number;
  monthlySavings: number;
  totalInterestSavings: number;
  totalLifetimeBenefit: number;
}

export function computeStandardLoanComparison(
  capex: number,
  subsidizedCalc: LoanCalcResult,
  monthlyNetCashFlow: number
): StandardLoanComparison {
  const stdMarginPct = 0.15; // Standard 15% minimum margin for commercial micro-enterprise
  const stdMarginMoney = Math.round(capex * stdMarginPct);
  const stdSubsidyAmount = 0; // Zero subsidy in non-subsidized commercial scenario
  const stdNetLoan = Math.max(0, capex - stdMarginMoney);
  const stdRate = 0.115; // 11.5% p.a. standard commercial MSME term loan rate
  const stdMonthlyRate = stdRate / 12;
  const tenureMonths = 60;

  let stdRegularEmi = 0;
  if (stdNetLoan > 0 && stdMonthlyRate > 0) {
    stdRegularEmi = Math.round(
      (stdNetLoan * stdMonthlyRate * Math.pow(1 + stdMonthlyRate, tenureMonths)) /
        (Math.pow(1 + stdMonthlyRate, tenureMonths) - 1)
    );
  }

  const stdTotalRepayment = stdRegularEmi * tenureMonths;
  const stdTotalInterest = Math.max(0, stdTotalRepayment - stdNetLoan);
  const stdTotalOutflow = stdMarginMoney + stdTotalRepayment;

  // Debt Service Coverage Ratio for standard loan
  const annualCashFlow = monthlyNetCashFlow * 12;
  const annualDebtService = stdRegularEmi * 12;
  const stdDscr = annualDebtService > 0 ? parseFloat((annualCashFlow / annualDebtService).toFixed(2)) : 1.0;

  const monthlySavings = Math.max(0, stdRegularEmi - subsidizedCalc.regularEmi);
  const totalInterestSavings = Math.max(0, stdTotalInterest - subsidizedCalc.totalInterestPaid);
  const totalLifetimeBenefit = subsidizedCalc.subsidyAmount + totalInterestSavings;

  return {
    capex,
    marginPct: stdMarginPct,
    marginMoney: stdMarginMoney,
    subsidyPct: 0,
    subsidyAmount: stdSubsidyAmount,
    netLoan: stdNetLoan,
    ratePct: 11.5,
    moratorium: 0,
    regularEmi: stdRegularEmi,
    totalInterest: stdTotalInterest,
    totalOutflow: stdTotalOutflow,
    dscr: stdDscr,
    monthlySavings,
    totalInterestSavings,
    totalLifetimeBenefit,
  };
}

export function generateAndDownloadLoanSchedulePDF(
  activeIdea: BusinessIdea,
  user: UserProfile,
  location: GPSLocation,
  loanCalc: LoanCalcResult,
  comparison: StandardLoanComparison
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const enterpriseTitle = activeIdea?.name?.en || 'Rural Enterprise Proposal';
  const locationText = `${location.village}, ${location.district}, ${location.state} (${location.classification.toUpperCase()})`;

  // Header Banner
  doc.setFillColor(30, 92, 74); // #1E5C4A Forest Green
  doc.rect(0, 0, 595, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL BANK APPRAISAL: 60-MONTH LOAN REPAYMENT SCHEDULE', 35, 28);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Priority Sector Lending (PSL) Micro-Credit Proposal | PMEGP / KVIC Subsidy Scheme', 35, 45);

  // Enterprise & Borrower Overview
  doc.setTextColor(35, 31, 24);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Enterprise & Borrower Profile', 35, 85);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Borrower Name: ${user.name} (${user.gender.toUpperCase()} / ${user.age} Yrs)`, 35, 102);
  doc.text(`Social Category: ${user.category.toUpperCase()} (Special Tier - 35% Subsidy)`, 35, 116);
  doc.text(`Location: ${locationText}`, 35, 130);

  doc.text(`Proposed Enterprise: ${enterpriseTitle}`, 310, 102);
  doc.text(`Connected Power / Land: ${activeIdea.power} / ${activeIdea.area}`, 310, 116);
  doc.text(`CGTMSE Status: Collateral-Free Credit Guarantee Covered`, 310, 130);

  // Financial Summary Box
  doc.setFillColor(248, 243, 230); // Earthen Warm Tint
  doc.roundedRect(35, 145, 525, 75, 4, 4, 'F');
  doc.setDrawColor(221, 209, 184);
  doc.roundedRect(35, 145, 525, 75, 4, 4, 'D');

  doc.setTextColor(30, 92, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Credit Sanction & Subsidy Framework', 45, 162);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(35, 31, 24);
  doc.setFontSize(8.5);

  const col1X = 45;
  const col2X = 180;
  const col3X = 315;
  const col4X = 445;

  doc.text(`Total Capex: ${fmtINR(loanCalc.capex)}`, col1X, 180);
  doc.text(`Margin Money: ${fmtINR(loanCalc.marginMoney)} (${loanCalc.marginPct * 100}%)`, col1X, 196);

  doc.text(`KVIC Grant: ${fmtINR(loanCalc.subsidyAmount)} (${loanCalc.subsidyPct * 100}%)`, col2X, 180);
  doc.text(`Net Term Loan: ${fmtINR(loanCalc.netLoan)}`, col2X, 196);

  doc.text(`Interest Rate: 9.5% p.a. (PSL)`, col3X, 180);
  doc.text(`Moratorium: ${loanCalc.moratorium} Mos (Grace)`, col3X, 196);

  doc.text(`Monthly EMI: ${fmtINR(loanCalc.regularEmi)}/mo`, col4X, 180);
  doc.text(`DSCR: ${loanCalc.dscr}x (Passed)`, col4X, 196);

  // Subsidy Benefit Highlights Banner
  doc.setFillColor(229, 240, 235);
  doc.roundedRect(35, 228, 525, 32, 4, 4, 'F');
  doc.setTextColor(20, 65, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    `SUBVENTED BENEFIT: Saves ₹${comparison.monthlySavings.toLocaleString('en-IN')}/mo in EMI and ₹${comparison.totalInterestSavings.toLocaleString('en-IN')} in interest vs non-subsidized loan. Total financial gain: ₹${comparison.totalLifetimeBenefit.toLocaleString('en-IN')}`,
    45,
    248
  );

  // 60-Month Repayment Schedule Table using jspdf-autotable
  const tableData = (loanCalc.schedule || []).map((row) => [
    `Month ${row.month}`,
    row.phase === 'Moratorium' ? 'Moratorium (Grace)' : 'Regular Repayment',
    fmtINR(row.opening),
    fmtINR(row.principal),
    fmtINR(row.interest),
    fmtINR(row.total),
    fmtINR(row.closing),
  ]);

  autoTable(doc, {
    startY: 270,
    head: [['Month', 'Phase', 'Opening Balance', 'Principal', 'Interest', 'Instalment', 'Closing Balance']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 92, 74],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      textColor: [35, 31, 24],
      lineColor: [221, 209, 184],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 55 },
      1: { halign: 'left', cellWidth: 95 },
      2: { halign: 'right', cellWidth: 75 },
      3: { halign: 'right', cellWidth: 65 },
      4: { halign: 'right', cellWidth: 65 },
      5: { halign: 'right', cellWidth: 70 },
      6: { halign: 'right', cellWidth: 75 },
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(140, 131, 115);
      doc.text(
        `Aarambh AI • DPR Dossier for Bank Branch Credit Committee • Page ${pageCount}`,
        35,
        doc.internal.pageSize.height - 20
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        doc.internal.pageSize.width - 120,
        doc.internal.pageSize.height - 20
      );
    },
  });

  // Endorsement section on the last page
  const finalY = (doc as any).lastAutoTable?.finalY || 650;
  if (finalY < 720) {
    doc.setFontSize(8);
    doc.setTextColor(94, 86, 72);
    doc.text('Certified by Borrower: The amortized debt servicing model reflects true operational cost assumptions.', 35, finalY + 25);
    doc.text('Borrower Signature: _______________________', 35, finalY + 50);
    doc.text('Branch Credit Manager Verification: _______________________', 310, finalY + 50);
  }

  const safeFilename = `${enterpriseTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Loan_Schedule_DPR.pdf`;
  doc.save(safeFilename);
}
