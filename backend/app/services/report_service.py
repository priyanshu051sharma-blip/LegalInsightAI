"""
Professional Report Generation Service

Generates comprehensive PDF reports with:
- Executive summaries
- Risk visualizations
- Compliance dashboards
- Legal findings
- Recommendations
- Charts and graphs
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from io import BytesIO
import json

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, 
    PageBreak, Image, KeepTogether, Frame, PageTemplate
)
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import PieChart
from reportlab.graphics.charts.linecharts import LineChart


class ReportGenerator:
    """Generate professional PDF reports for legal document analysis"""

    def __init__(self):
        self.pagesize = A4
        self.width, self.height = A4
        self.styles = self._create_custom_styles()

    def _create_custom_styles(self) -> Dict:
        """Create custom paragraph styles for professional appearance"""
        styles = getSampleStyleSheet()
        
        # Define custom styles
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1a365d'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='RiskHigh',
            parent=styles['Normal'],
            textColor=colors.HexColor('#c53030'),
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='RiskMedium',
            parent=styles['Normal'],
            textColor=colors.HexColor('#f6ad55'),
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='RiskLow',
            parent=styles['Normal'],
            textColor=colors.HexColor('#38a169'),
            fontName='Helvetica-Bold'
        ))
        
        styles.add(ParagraphStyle(
            name='SectionContent',
            parent=styles['Normal'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))
        
        return styles

    def _create_title_page(self, doc: SimpleDocTemplate, story: List, 
                          analysis_data: Dict[str, Any]) -> List:
        """Create professional title page"""
        title_style = self.styles['CustomTitle']
        
        # Add company header
        story.append(Spacer(self.width, 0.5*inch))
        story.append(Paragraph("LEGAL DOCUMENT ANALYSIS REPORT", title_style))
        
        # Add metadata
        meta_style = self.styles['Normal']
        story.append(Spacer(self.width, 0.3*inch))
        story.append(Paragraph(
            f"Document: {analysis_data.get('document_title', 'N/A')}",
            meta_style
        ))
        story.append(Paragraph(
            f"Analysis Date: {datetime.now().strftime('%B %d, %Y')}",
            meta_style
        ))
        story.append(Paragraph(
            f"Risk Score: <b>{analysis_data.get('risk_score', 'N/A')}/100</b>",
            meta_style
        ))
        
        story.append(PageBreak())
        return story

    def _create_executive_summary(self, story: List, 
                                 analysis_data: Dict[str, Any]) -> List:
        """Create executive summary section"""
        story.append(Paragraph("EXECUTIVE SUMMARY", self.styles['CustomHeading']))
        
        summary = analysis_data.get('summary', 'No summary available')
        story.append(Paragraph(summary, self.styles['SectionContent']))
        story.append(Spacer(self.width, 0.2*inch))
        
        # Key metrics
        story.append(Paragraph("Key Metrics", self.styles['Heading2']))
        
        metrics_data = [
            ['Metric', 'Value'],
            ['Overall Risk Score', f"{analysis_data.get('risk_score', 0)}/100"],
            ['Compliance Status', analysis_data.get('compliance_status', 'Pending')],
            ['High Risk Items', str(len(analysis_data.get('high_risk_clauses', [])))],
            ['Medium Risk Items', str(len(analysis_data.get('medium_risk_clauses', [])))],
            ['Violations Found', str(len(analysis_data.get('violations', [])))],
        ]
        
        metrics_table = Table(metrics_data, colWidths=[3*inch, 2*inch])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d3748')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')]),
        ]))
        
        story.append(metrics_table)
        story.append(PageBreak())
        
        return story

    def _create_risk_analysis(self, story: List, 
                             analysis_data: Dict[str, Any]) -> List:
        """Create detailed risk analysis section"""
        story.append(Paragraph("RISK ANALYSIS", self.styles['CustomHeading']))
        
        # Risk score visualization
        risk_score = analysis_data.get('risk_score', 0)
        risk_level = self._calculate_risk_level(risk_score)
        
        risk_color = self._get_risk_color(risk_score)
        
        story.append(Paragraph(
            f"<b>Risk Level: </b><font color='{risk_color}'>{risk_level}</font> (Score: {risk_score}/100)",
            self.styles['Normal']
        ))
        story.append(Spacer(self.width, 0.2*inch))
        
        # High risk items
        high_risks = analysis_data.get('high_risk_clauses', [])
        if high_risks:
            story.append(Paragraph("🔴 HIGH RISK ITEMS", self.styles['Heading2']))
            for idx, risk in enumerate(high_risks[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {risk}",
                    self.styles['SectionContent']
                ))
            story.append(Spacer(self.width, 0.15*inch))
        
        # Medium risk items
        medium_risks = analysis_data.get('medium_risk_clauses', [])
        if medium_risks:
            story.append(Paragraph("🟠 MEDIUM RISK ITEMS", self.styles['Heading2']))
            for idx, risk in enumerate(medium_risks[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {risk}",
                    self.styles['SectionContent']
                ))
            story.append(Spacer(self.width, 0.15*inch))
        
        # Low risk items
        low_risks = analysis_data.get('low_risk_clauses', [])
        if low_risks:
            story.append(Paragraph("🟢 LOW RISK ITEMS", self.styles['Heading2']))
            for idx, risk in enumerate(low_risks[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {risk}",
                    self.styles['SectionContent']
                ))
        
        story.append(PageBreak())
        return story

    def _create_compliance_section(self, story: List, 
                                  analysis_data: Dict[str, Any]) -> List:
        """Create compliance analysis section"""
        story.append(Paragraph("COMPLIANCE ANALYSIS", self.styles['CustomHeading']))
        
        compliance_data = analysis_data.get('compliance_status', {})
        if isinstance(compliance_data, str):
            story.append(Paragraph(
                f"Status: <b>{compliance_data}</b>",
                self.styles['Normal']
            ))
        else:
            # Create compliance table
            comp_table_data = [['Regulation', 'Status', 'Issues']]
            
            for reg, status in compliance_data.items():
                status_text = "✓ Compliant" if status else "✗ Non-compliant"
                comp_table_data.append([reg, status_text, ''])
            
            comp_table = Table(comp_table_data, colWidths=[2*inch, 2*inch, 2*inch])
            comp_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d3748')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')]),
            ]))
            story.append(comp_table)
        
        story.append(Spacer(self.width, 0.2*inch))
        
        # Violations
        violations = analysis_data.get('violations', [])
        if violations:
            story.append(Paragraph("Violations Identified:", self.styles['Heading2']))
            for idx, violation in enumerate(violations[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {violation}",
                    self.styles['SectionContent']
                ))
            story.append(Spacer(self.width, 0.15*inch))
        
        # Recommendations
        recommendations = analysis_data.get('recommendations', [])
        if recommendations:
            story.append(Paragraph("Recommendations:", self.styles['Heading2']))
            for idx, rec in enumerate(recommendations[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {rec}",
                    self.styles['SectionContent']
                ))
        
        story.append(PageBreak())
        return story

    def _create_key_terms_section(self, story: List, 
                                 analysis_data: Dict[str, Any]) -> List:
        """Create key terms and obligations section"""
        story.append(Paragraph("KEY TERMS & OBLIGATIONS", self.styles['CustomHeading']))
        
        # Key terms
        key_terms = analysis_data.get('key_terms', [])
        if key_terms:
            story.append(Paragraph("Key Terms:", self.styles['Heading2']))
            terms_text = ', '.join(key_terms[:10])
            story.append(Paragraph(terms_text, self.styles['SectionContent']))
            story.append(Spacer(self.width, 0.15*inch))
        
        # Obligations
        obligations = analysis_data.get('obligations', [])
        if obligations:
            story.append(Paragraph("Legal Obligations:", self.styles['Heading2']))
            for idx, obligation in enumerate(obligations[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {obligation}",
                    self.styles['SectionContent']
                ))
            story.append(Spacer(self.width, 0.15*inch))
        
        # Deadlines
        deadlines = analysis_data.get('deadlines', [])
        if deadlines:
            story.append(Paragraph("Important Deadlines:", self.styles['Heading2']))
            for idx, deadline in enumerate(deadlines[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {deadline}",
                    self.styles['SectionContent']
                ))
        
        story.append(PageBreak())
        return story

    def _create_legal_research_section(self, story: List, 
                                      analysis_data: Dict[str, Any]) -> List:
        """Create legal research and precedents section"""
        story.append(Paragraph("LEGAL RESEARCH & PRECEDENTS", self.styles['CustomHeading']))
        
        relevant_cases = analysis_data.get('relevant_cases', [])
        if relevant_cases:
            story.append(Paragraph("Relevant Cases Found:", self.styles['Heading2']))
            for idx, case in enumerate(relevant_cases[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {case}",
                    self.styles['SectionContent']
                ))
            story.append(Spacer(self.width, 0.15*inch))
        
        citations = analysis_data.get('case_citations', [])
        if citations:
            story.append(Paragraph("Citations:", self.styles['Heading2']))
            for idx, citation in enumerate(citations[:5], 1):
                story.append(Paragraph(
                    f"{idx}. {citation}",
                    self.styles['SectionContent']
                ))
        
        story.append(PageBreak())
        return story

    def _create_recommendations_section(self, story: List, 
                                       analysis_data: Dict[str, Any]) -> List:
        """Create final recommendations section"""
        story.append(Paragraph("RECOMMENDATIONS & ACTION ITEMS", self.styles['CustomHeading']))
        
        recommendations = analysis_data.get('recommendations', [])
        if recommendations:
            for idx, rec in enumerate(recommendations[:10], 1):
                story.append(Paragraph(
                    f"<b>{idx}. {rec}</b>",
                    self.styles['SectionContent']
                ))
                story.append(Spacer(self.width, 0.1*inch))
        
        # Next steps
        story.append(Spacer(self.width, 0.3*inch))
        story.append(Paragraph("Next Steps:", self.styles['Heading2']))
        next_steps = [
            "Review all flagged high-risk items with legal counsel",
            "Address compliance violations according to timeline",
            "Implement recommended clause modifications",
            "Schedule follow-up review after changes",
            "Update legal register with findings"
        ]
        for idx, step in enumerate(next_steps, 1):
            story.append(Paragraph(f"{idx}. {step}", self.styles['SectionContent']))
        
        return story

    def generate(self, analysis_data: Dict[str, Any]) -> BytesIO:
        """Generate professional PDF report"""
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=self.pagesize,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch,
        )
        
        story = []
        
        # Build report sections
        story = self._create_title_page(doc, story, analysis_data)
        story = self._create_executive_summary(story, analysis_data)
        story = self._create_risk_analysis(story, analysis_data)
        story = self._create_compliance_section(story, analysis_data)
        story = self._create_key_terms_section(story, analysis_data)
        story = self._create_legal_research_section(story, analysis_data)
        story = self._create_recommendations_section(story, analysis_data)
        
        # Add footer
        story.append(Spacer(self.width, 0.3*inch))
        story.append(Paragraph(
            f"Report generated on {datetime.now().strftime('%B %d, %Y at %H:%M')} | " +
            "Confidential - Legal Privilege",
            self.styles['Normal']
        ))
        
        # Build PDF
        doc.build(story)
        pdf_buffer.seek(0)
        return pdf_buffer

    @staticmethod
    def _calculate_risk_level(score: float) -> str:
        """Calculate risk level from score"""
        if score >= 75:
            return "CRITICAL"
        elif score >= 50:
            return "HIGH"
        elif score >= 25:
            return "MEDIUM"
        else:
            return "LOW"

    @staticmethod
    def _get_risk_color(score: float) -> str:
        """Get color for risk score"""
        if score >= 75:
            return "#c53030"  # Red
        elif score >= 50:
            return "#f6ad55"  # Orange
        elif score >= 25:
            return "#ecc94b"  # Yellow
        else:
            return "#38a169"  # Green
