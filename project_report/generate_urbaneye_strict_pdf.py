from __future__ import annotations

import textwrap
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    Flowable,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib import colors


ROOT = Path("/Users/alokranjan/Desktop/major")
REPORT_DIR = ROOT / "project_report"
OUTPUT = REPORT_DIR / "UrbanEye_Strict_Sample_Format.pdf"

CODE_FILES = [
    ("Backend Application Bootstrap", "backend/src/app.js"),
    ("Backend Server Entry", "backend/src/server.js"),
    ("Complaint Controller", "backend/src/controllers/complaintController.js"),
    ("Admin Controller", "backend/src/controllers/adminController.js"),
    ("Map Controller", "backend/src/controllers/mapController.js"),
    ("Authentication Controller", "backend/src/controllers/authcontroller.js"),
    ("User Controller", "backend/src/controllers/userController.js"),
    ("Complaint Routes", "backend/src/routes/complaintRoutes.js"),
    ("Admin Routes", "backend/src/routes/adminRoutes.js"),
    ("Map Routes", "backend/src/routes/mapRoutes.js"),
    ("Auth Routes", "backend/src/routes/authRoutes.js"),
    ("User Routes", "backend/src/routes/userRoutes.js"),
    ("Backend AI Service Adapter", "backend/src/services/aiService.js"),
    ("Backend Notification Service", "backend/src/services/notificationService.js"),
    ("Backend Cache Service", "backend/src/services/cacheService.js"),
    ("Backend Map Service", "backend/src/services/mapService.js"),
    ("Backend Mock Store", "backend/src/data/mockStore.js"),
    ("Complaint Validator", "backend/src/validators/complaintValidators.js"),
    ("Authentication Validator", "backend/src/validators/authValidators.js"),
    ("Authentication Middleware", "backend/src/middlewares/authMiddleware.js"),
    ("Error Middleware", "backend/src/middlewares/errorMiddleware.js"),
    ("Role Middleware", "backend/src/middlewares/roleMiddleware.js"),
    ("Multer Middleware", "backend/src/middlewares/multerMiddleware.js"),
    ("Backend Prisma Utility", "backend/src/utils/prisma.js"),
    ("Prisma Schema", "backend/prisma/schema.prisma"),
    ("AI Service Main", "ai_service/app/main.py"),
    ("AI Social Agent", "ai_service/agents/social_agent.py"),
    ("AI Classification Agent", "ai_service/agents/classification_agent.py"),
    ("AI Priority Agent", "ai_service/agents/priority_agent.py"),
    ("AI Routing Agent", "ai_service/agents/routing_agent.py"),
    ("AI Complaint Processor", "ai_service/agents/complaint_processor.py"),
    ("AI X Service", "ai_service/services/x_service.py"),
    ("AI RAG Service", "ai_service/services/rag_service.py"),
    ("Web Home Page", "web_app/src/app/page.tsx"),
    ("Web Dashboard Page", "web_app/src/app/dashboard/page.tsx"),
    ("Web Profile Page", "web_app/src/app/profile/page.tsx"),
    ("Web Map Page", "web_app/src/app/map/page.tsx"),
    ("Web Complaint Page", "web_app/src/app/complaints/page.tsx"),
    ("Web Admin Dashboard", "web_app/src/app/admin/dashboard/page.tsx"),
    ("Web Admin Complaints", "web_app/src/app/admin/complaints/page.tsx"),
    ("Web Admin Analytics", "web_app/src/app/admin/analytics/page.tsx"),
    ("Web Login Page", "web_app/src/app/login/page.tsx"),
    ("Web Register Page", "web_app/src/app/register/page.tsx"),
    ("Web Dashboard Shell", "web_app/src/components/DashboardShell.tsx"),
    ("Web Report Panel", "web_app/src/components/ReportPanel.tsx"),
    ("Web Complaint Card", "web_app/src/components/Complaintcard.tsx"),
    ("Web Map Complaint", "web_app/src/components/MapComplaint.tsx"),
    ("Web Sidebar", "web_app/src/components/Sidebar.tsx"),
    ("Web Navbar", "web_app/src/components/Navbar.tsx"),
    ("Web Complaint Service", "web_app/src/services/complaintService.ts"),
    ("Web Admin Service", "web_app/src/services/adminService.ts"),
    ("Web Map Service", "web_app/src/services/mapService.ts"),
    ("Web Auth Service", "web_app/src/services/authService.ts"),
    ("Mobile Navigator", "mobile_app/src/navigation/AppNavigator.js"),
    ("Mobile Auth Context", "mobile_app/src/context/AuthContext.js"),
    ("Mobile Complaint Service", "mobile_app/src/services/complaintService.js"),
    ("Mobile API Service", "mobile_app/src/services/api.js"),
    ("Mobile Auth Service", "mobile_app/src/services/authService.js"),
]

ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"]

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="BodyStrict",
    fontName="Times-Roman",
    fontSize=12,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodyCenter",
    fontName="Times-Roman",
    fontSize=12,
    leading=16,
    alignment=TA_CENTER,
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodyItalic",
    fontName="Times-Italic",
    fontSize=12,
    leading=16,
    alignment=TA_LEFT,
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="Head1Strict",
    fontName="Times-Bold",
    fontSize=15.96,
    leading=18,
    alignment=TA_CENTER,
    spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="Head2Strict",
    fontName="Times-Bold",
    fontSize=14.04,
    leading=16,
    alignment=TA_LEFT,
    spaceBefore=8,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="CoverTitleStrict",
    fontName="Times-Bold",
    fontSize=24,
    leading=28,
    alignment=TA_CENTER,
    spaceAfter=16,
))
styles.add(ParagraphStyle(
    name="CoverSubStrict",
    fontName="Times-Bold",
    fontSize=18,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="SmallStrict",
    fontName="Times-Roman",
    fontSize=9,
    leading=11,
    alignment=TA_LEFT,
    spaceAfter=3,
))

code_style = ParagraphStyle(
    "CodeStrict",
    fontName="Courier",
    fontSize=8.4,
    leading=9.5,
    alignment=TA_LEFT,
    spaceAfter=5,
)


def P(text: str, style: str = "BodyStrict") -> Paragraph:
    return Paragraph(text, styles[style])


class PlaceholderFigure(Flowable):
    def __init__(self, width=150 * mm, height=55 * mm, label="Insert Project Figure Here"):
        super().__init__()
        self.width = width
        self.height = height
        self.label = label

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        self.canv.rect(0, 0, self.width, self.height)
        self.canv.setFont("Times-Italic", 11)
        self.canv.drawCentredString(self.width / 2, self.height / 2, self.label)


def section_table(rows, col_widths):
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.7, colors.black),
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
        ("FONTSIZE", (0, 0), (-1, -1), 10.5),
        ("LEADING", (0, 0), (-1, -1), 13),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 4),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
    ]))
    return table


def add_caption(story, text):
    story.append(Paragraph(text, ParagraphStyle(
        "CaptionStrict",
        fontName="Times-Bold",
        fontSize=12,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=3,
        spaceAfter=10,
    )))


def add_bullets(story, bullets):
    for bullet in bullets:
        story.append(P(f"• {bullet}"))


def draw_header(canvas, doc):
    page = canvas.getPageNumber()
    if page == 1:
        return
    width, height = A4
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    if 2 <= page <= 8:
        label = ROMAN[page - 2]
    else:
        label = str(page - 8)
    canvas.drawString(42 * mm, height - 16 * mm, "INFORMATION TECHNOLOGY")
    canvas.drawRightString(width - 42 * mm, height - 16 * mm, label)
    canvas.restoreState()


def cover_page(story):
    story.append(Spacer(1, 2 * mm))
    story.append(PageBreak())


def prelim_page(title, paragraphs, story):
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(title, styles["Head1Strict"]))
    for paragraph in paragraphs:
        story.append(P(paragraph))
    story.append(PageBreak())


def toc_lines():
    return [
        "Declaration                                                                                                            I",
        "Certificate                                                                                                             II",
        "Acknowledgement                                                                                               III",
        "Abstract                                                                                                                IV",
        "List of Figures                                                                                                       V",
        "List of Tables                                                                                                         VI",
        "Table of Contents                                                                                                  VII",
        "Chapter 1:  Introduction                                                                                      1-4",
        "Chapter 2:  Problem Statement                                                                           5-10",
        "                   2.1: Problem Definition",
        "                   2.2: Objectives",
        "Chapter 3:  Analysis                                                                                          11-22",
        "                   3.1: Software Requirement Specifications",
        "                          3.1.1: Functional Requirements of the Project",
        "                          3.1.2: Non-functional Requirements of the Project",
        "                   3.2: Feasibility Study of the Project",
        "                   3.3: Tools / Technologies / Platform used",
        "                   3.4: Use Case Diagrams / Data Flow Diagrams",
        "Chapter 4:  Design and Architecture                                                                23-31",
        "                   4.1: Structure Chart / Work Breakdown Structure",
        "                   4.2: Explanation of Modules",
        "                   4.3: Flow Chart / Activity Diagram",
        "                   4.4: ER Diagram / Class Diagram",
        "Chapter 5:  Implementation                                                                               32-41",
        "                   5.1: Screenshots",
        "                   5.2: Source Code of some modules",
        "Chapter 6:  Testing                                                                                           42-47",
        "Chapter 7:  Summary & Conclusions                                                                 48-51",
        "Chapter 8:  Limitation of the Project & Future Work                                      52-56",
        "Bibliography                                                                                                       57-58",
        "Appendix                                                                                                            59 onwards",
    ]


def wrap_code(content: str, width: int = 84) -> str:
    wrapped_lines = []
    for line in content.splitlines():
        if not line:
            wrapped_lines.append("")
            continue
        chunks = textwrap.wrap(line, width=width, replace_whitespace=False, drop_whitespace=False, subsequent_indent="    ")
        wrapped_lines.extend(chunks or [""])
    return "\n".join(wrapped_lines)


def code_listing(title: str, rel_path: str):
    path = ROOT / rel_path
    content = wrap_code(path.read_text(), width=86)
    return [
        Paragraph(title, styles["Head2Strict"]),
        Paragraph(f"<b>File:</b> {rel_path}", styles["SmallStrict"]),
        Preformatted(content, code_style),
        PageBreak(),
    ]


def story_content():
    story = []
    cover_page(story)

    prelim_page("DECLARATION", [
        "This is to certify that the material embodied in this Major Project - Dissertation titled “UrbanEye – AI-Driven Smart Complaint & Civic Issue Resolution System” being submitted in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Technology is based on my original work. It is further certified that this Major Project - Dissertation work has not been submitted in full or in part to this university or any other university for the award of any other degree or diploma. My indebtedness to other works has been duly acknowledged at the relevant places.",
        "(Alok Ranjan)<br/>15276803122",
    ], story)

    prelim_page("CERTIFICATE", [
        "This is to certify that the work embodied in this Major Project - Dissertation titled “UrbanEye – AI-Driven Smart Complaint & Civic Issue Resolution System” being submitted in the partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Technology, is original and has been carried out by ALOK RANJAN (Enrollment No. 15276803122) under my supervision and guidance.",
        "It is further certified that this Major Project - Dissertation work has not been submitted in full or in part to this university or any other university for the award of any other degree or diploma to the best of my knowledge and belief.",
        "(Mrs. Jasleen Kaur)<br/>Assistant Professor<br/><br/>(Dr. Savneet Kaur)<br/>HOD<br/>Guru Tegh Bahadur Institute of Technology",
    ], story)

    prelim_page("ACKNOWLEDGEMENT", [
        "I would like to express my sincere gratitude to all those who have supported and guided me throughout the successful completion of my major project titled “UrbanEye: AI-Driven Smart Complaint & Civic Issue Resolution System.”",
        "I am deeply indebted to my faculty supervisor and mentor, Mrs. Jasleen Kaur, for her continuous guidance, invaluable suggestions, and constant encouragement. Her expertise, patience, and insightful feedback played a vital role in shaping this project and strengthening both the technical and academic quality of the work.",
        "I would also like to express my sincere thanks to the Head of the Department, Dr. Savneet Kaur, Department of Information Technology, for her support, motivation, and for providing the academic environment required to complete this project successfully.",
        "Furthermore, I extend my gratitude to all the faculty members of the Information Technology Department at Guru Tegh Bahadur Institute of Technology for their cooperation and support during the course of this work.",
        "Lastly, I would like to thank my friends and peers for their encouragement, collaboration, and moral support, which helped me stay motivated and overcome challenges throughout the development of this project.",
    ], story)

    prelim_page("ABSTRACT", [
        "UrbanEye is a full-stack civic complaint and issue-resolution platform developed to improve the way public infrastructure problems are reported, analyzed, and tracked. In many existing complaint systems, citizens are able to submit issues, but they often receive little clarity about how the complaint is categorized, where it is routed, and whether any real action is being taken. This project addresses that limitation by transforming complaint submission from a one-time reporting activity into a structured and trackable workflow.",
        "The platform integrates a web application, a mobile application, a backend API, and a FastAPI-based AI service to support end-to-end complaint handling. A user can report an issue by entering a title, description, location, and optional image data. The AI layer then enriches the complaint by identifying the likely category, estimating priority, suggesting the responsible department, generating a recommended action, and drafting a concise X-ready public update. This makes complaint records more meaningful and useful for both citizens and administrative authorities.",
        "UrbanEye also provides dashboard-based tracking, complaint status visibility, and location-oriented monitoring features. The mobile application is designed to help residents easily check whether a complaint is pending, in progress, or resolved, while the web application focuses on broader operational visibility through summaries, complaint views, and administrative monitoring tools. The system also supports fallback behavior for local development and demonstration, making it resilient even when some external services are unavailable.",
        "Overall, UrbanEye demonstrates how AI can be applied in a practical civic-tech environment to improve transparency, accountability, and structured decision-making in public grievance systems. The project serves as a scalable and extensible foundation for future enhancements such as direct social media publishing, image-based issue detection, multilingual complaint handling, and deeper integration with smart city governance workflows.",
    ], story)

    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph("LIST OF FIGURES", styles["Head1Strict"]))
    story.append(section_table([
        ["Figure No.", "Figure Title", "Page No."],
        ["1.1", "Domains Integration in UrbanEye", "2"],
        ["3.4.1", "Use Case Diagram of UrbanEye", "19"],
        ["3.4.2", "Level 0 Data Flow Diagram (DFD)", "20"],
        ["3.4.3", "Level 1 Data Flow Diagram (DFD)", "21"],
        ["4.1.1", "Work Breakdown Structure (WBS)", "23"],
        ["4.2.1", "System Architecture Diagram", "26"],
        ["4.3.1", "Activity Diagram: Complaint Submission Flow", "29"],
        ["4.4.1", "ER Diagram", "31"],
        ["5.1.1", "Home Page", "32"],
        ["5.1.2", "Dashboard Page", "34"],
        ["5.1.3", "Profile Page", "35"],
        ["5.1.4", "Complaint Detail Page", "36"],
        ["5.1.5", "Administrative Overview Page", "37"],
    ], [28 * mm, 125 * mm, 25 * mm]))
    story.append(PageBreak())

    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph("LIST OF TABLES", styles["Head1Strict"]))
    story.append(section_table([
        ["Table No.", "Table Title", "Page No."],
        ["1.1", "Strategic Objectives", "3"],
        ["2.1", "Impact of Existing Complaint Workflow", "8"],
        ["3.1", "Functional Requirements", "12"],
        ["3.2", "Non-Functional Requirements", "15"],
        ["3.3.1", "Frontend Layer", "18"],
        ["3.3.2", "Backend Layer", "18"],
        ["3.3.3", "External Services & APIs", "18"],
        ["3.3.4", "Deployment & Hosting", "18"],
        ["3.3.5", "Development Tools", "19"],
        ["6.1", "Testing Summary", "44"],
    ], [28 * mm, 125 * mm, 25 * mm]))
    story.append(PageBreak())

    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("TABLE OF CONTENTS", styles["Head1Strict"]))
    for line in toc_lines():
        story.append(Paragraph(line.replace(" ", "&nbsp;"), ParagraphStyle(
            "TOCStrict", fontName="Times-Roman", fontSize=12, leading=15, alignment=TA_LEFT, spaceAfter=2
        )))
    story.append(PageBreak())

    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("CHAPTER 1: INTRODUCTION", styles["Head1Strict"]))
    story.append(Paragraph("Executive Summary", styles["Head2Strict"]))
    for p in [
        "UrbanEye is a full-stack civic complaint and issue-resolution platform designed to improve the way public issues are reported, analyzed, and tracked. The project was developed to address a common problem in existing grievance systems: citizens can submit complaints, but they often do not know what happens after submission, which department is responsible, or whether any action has started. UrbanEye solves this by turning complaint registration into a structured, transparent, and trackable workflow.",
        "The platform combines a web application, a mobile application, a backend API, and a FastAPI-based AI service into one integrated system. Instead of storing a complaint only as plain text, UrbanEye enriches it with structured information such as category, priority, likely department, suggested action, and an X-ready public update. This makes complaint records more useful for both citizens and administrators.",
        "UrbanEye also brings together complaint reporting, AI-assisted triage, dashboard-based monitoring, status visibility, and local fallback support in one ecosystem. Built using modern technologies such as Next.js, React, TypeScript, Node.js, Express.js, Prisma, FastAPI, React Native, and Expo, the project demonstrates modular design, practical AI integration, and deployment readiness suitable for civic-tech applications.",
    ]:
        story.append(P(p))
    story.append(Paragraph("Key Metrics:", styles["BodyItalic"]))
    add_bullets(story, [
        "Codebase: multi-module full-stack project across web, mobile, backend, and AI service",
        "Frontend stack: Next.js, React, TypeScript, Tailwind CSS",
        "Mobile stack: React Native, Expo, AsyncStorage",
        "Backend stack: Node.js, Express.js, Prisma",
        "AI stack: FastAPI, Pydantic, optional LLM integration",
        "Core focus: complaint reporting, AI-assisted classification, dashboard tracking, and public-update drafting",
    ])
    story.append(Paragraph("What is UrbanEye?", styles["Head2Strict"]))
    for p in [
        "UrbanEye is a comprehensive civic complaint and monitoring platform that transforms traditional complaint filing into an intelligent and trackable system. Unlike basic reporting portals that only capture complaint text and store it in a database, UrbanEye connects complaint submission, AI-assisted analysis, priority and department suggestion, dashboard-based tracking, status visibility for residents, location-aware complaint monitoring, and X-ready public communication support into one workflow.",
        "The goal of the platform is not only to collect complaints, but also to make them easier to understand, manage, and follow up on.",
    ]:
        story.append(P(p))
    story.append(PlaceholderFigure(label="Leave this figure space empty for project diagram"))
    add_caption(story, "Figure 1.1: Domains Integration in UrbanEye")
    story.append(Paragraph("Primary Vision", styles["Head2Strict"]))
    story.append(P("\"Create a unified, citizen-friendly complaint and civic issue resolution platform that improves public reporting through AI-assisted triage, structured tracking, dashboard visibility, and accountable digital workflows.\""))
    story.append(Paragraph("Table 1.1: Strategic Objectives", styles["BodyItalic"]))
    story.append(section_table([
        ["Objective", "Description", "Implementation"],
        ["Complaint Reporting", "Make civic issue reporting simple and accessible", "Web form, mobile complaint submission flow"],
        ["AI-Assisted Triage", "Add structure to complaints automatically", "Category, priority, department, and suggested action generation"],
        ["Status Transparency", "Help citizens track complaint progress clearly", "Pending, in-progress, and resolved complaint states"],
        ["Administrative Visibility", "Support monitoring and overview of complaints", "Dashboard summaries, complaint cards, hotspot-oriented views"],
        ["Public Communication", "Prepare complaint-related public updates", "X-ready social post drafting"],
        ["Resilience", "Keep the platform usable during service issues", "Fallback logic, local persistence, mock-backed continuity"],
    ], [45 * mm, 65 * mm, 70 * mm]))
    story.append(Paragraph("Workflow 1: New User Complaint Journey", styles["Head2Strict"]))
    for p in [
        "<b>Step 1: Landing on Homepage</b><br/>When the user opens the platform, they are presented with a civic complaint dashboard and entry points for reporting issues. The homepage introduces the purpose of the system and gives a quick view of complaint activity.",
        "<b>Step 2: Reporting a Civic Issue</b><br/>The user creates a complaint by entering the title, description, and location of the issue. Depending on the interface, optional image and coordinate support may also be available.",
        "<b>Step 3: AI-Based Complaint Enrichment</b><br/>Once the complaint is submitted, the backend sends the complaint text to the AI service. The AI layer analyzes the complaint and enriches it with structured fields such as complaint category, estimated priority, likely department, suggested action, sentiment, and X-ready public update text.",
        "<b>Step 4: Complaint Storage and Routing Support</b><br/>After analysis, the complaint is stored in the system with both original and AI-generated fields. This allows the complaint to be displayed consistently across web and mobile interfaces.",
        "<b>Step 5: Complaint Tracking</b><br/>Once stored, the user can track the complaint in the dashboard. UrbanEye makes the status visible using simple complaint states: Pending, In Progress, and Resolved.",
        "<b>Step 6: Dashboard Monitoring and Follow-Up</b><br/>On the web side, dashboards help provide an overview of complaint flow, summaries, and monitoring. On the mobile side, the focus is more personal and status-oriented, helping residents see what is solved and what still needs attention.",
    ]:
        story.append(P(p))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 2: PROBLEM STATEMENT", styles["Head1Strict"]))
    story.append(Paragraph("2.1: Problem Definition", styles["Head2Strict"]))
    for p in [
        "Existing civic complaint and grievance systems often fail to provide a clear, structured, and transparent process for reporting and tracking public issues. Citizens may submit complaints about problems such as garbage overflow, water leakage, broken streetlights, potholes, or drainage blockage, but they often do not know which department is responsible, how urgent the issue is, or whether any action has been taken.",
        "At the same time, authorities frequently receive complaints in unstructured form, making classification, prioritization, and monitoring more difficult. This creates inefficiency on both sides of the complaint process.",
        "In many cities, complaint reporting is fragmented across websites, apps, phone calls, and social media channels. This makes the process repetitive for citizens and analytically weak for administrators.",
    ]:
        story.append(P(p))
    story.append(Paragraph("Problem 1: Fragmentation of Complaint Reporting and Tracking Tools", styles["Head2Strict"]))
    story.append(P("In the current civic complaint environment, citizens often depend on multiple disconnected channels to report, follow up, and escalate public issues. This creates a fragmented and inefficient experience for both citizens and authorities."))
    add_bullets(story, [
        "Online complaint portals often require long forms and provide limited post-submission clarity.",
        "Mobile apps may allow issue reporting but only basic status visibility.",
        "Phone calls and helplines force users to repeat information repeatedly.",
        "Social media posts create visibility but are usually disconnected from formal complaint records.",
        "Manual notes and screenshots become the user’s only tracking mechanism in many cases.",
    ])
    story.append(Paragraph("Problem 2: Disconnected Complaint Reporting from Resolution Visibility", styles["Head2Strict"]))
    for p in [
        "In many systems, complaint submission and complaint tracking exist as separate experiences. A citizen may be able to file a complaint, but the later stages such as classification, routing, action, and resolution are often unclear or poorly connected.",
        "After filing the complaint, the user may repeatedly check status, contact departments manually, or escalate through social media. This weakens trust and makes the complaint process feel incomplete.",
    ]:
        story.append(P(p))
    story.append(Paragraph("Table 2.1: Impact of Existing Complaint Workflow", styles["BodyItalic"]))
    story.append(section_table([
        ["Issue", "Impact on Citizen", "Impact on Administration"],
        ["Fragmented channels", "Confusion and repetition", "Duplicate and inconsistent records"],
        ["Weak classification", "No clarity on urgency or responsibility", "Manual routing effort increases"],
        ["Poor status visibility", "Low trust in complaint system", "Higher follow-up overhead"],
        ["No structured dashboards", "No meaningful progress feedback", "Reduced complaint analytics quality"],
    ], [48 * mm, 65 * mm, 67 * mm]))
    story.append(Paragraph("2.2: Objectives", styles["Head2Strict"]))
    add_bullets(story, [
        "To create an integrated complaint management platform that joins reporting, AI-assisted triage, storage, and tracking.",
        "To provide civic-tech solutions focused on public issue reporting rather than generic task handling.",
        "To improve status transparency for citizens through visible complaint states.",
        "To strengthen administrative visibility with summaries, breakdowns, and hotspot-oriented views.",
        "To support public communication readiness through X-ready social post drafting.",
        "To maintain resilience through fallback logic, local persistence, and modular architecture.",
    ])
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 3: ANALYSIS", styles["Head1Strict"]))
    story.append(Paragraph("3.1: Software Requirement Specifications (SRS)", styles["Head2Strict"]))
    story.append(P("The Software Requirement Specifications document defines what the UrbanEye system must do, how it must perform, and what constraints it must satisfy."))
    story.append(Paragraph("3.1.1: Functional Requirements of the Project", styles["Head2Strict"]))
    for p in [
        "Functional requirements specify what the system must do. UrbanEye is centered on complaint submission, complaint analysis, complaint retrieval, dashboard tracking, administrative visibility, X account preference support, and resilient fallback operation.",
    ]:
        story.append(P(p))
    story.append(section_table([
        ["Requirement ID", "Title", "Priority", "Description"],
        ["FR-1.1", "Submit a Civic Complaint", "HIGH", "The system must allow users to submit civic complaints through web and mobile applications."],
        ["FR-1.2", "Retrieve Complaint List", "HIGH", "The system must fetch and display complaint records in structured form."],
        ["FR-2.1", "Analyze Complaint Content", "HIGH", "The AI service must enrich complaints with structured civic metadata."],
        ["FR-2.2", "Generate X-Ready Public Update", "MEDIUM", "The system must draft concise public communication text from complaint data."],
        ["FR-3.1", "Display Complaint Tracking Dashboard", "HIGH", "The system must show totals, status, and complaint progress information."],
        ["FR-3.2", "Display Administrative Overview", "HIGH", "The system must provide complaint summaries for monitoring and review."],
        ["FR-4.1", "Save X Account Preference", "MEDIUM", "The system must allow users to save a preferred X handle for later use."],
        ["FR-5.1", "Support Fallback Operation", "HIGH", "The system must remain usable even when some services are unavailable."],
    ], [25 * mm, 55 * mm, 20 * mm, 85 * mm]))
    story.append(Paragraph("3.1.2: Non-functional Requirements of the Project", styles["Head2Strict"]))
    story.append(P("Non-functional requirements specify how the system must perform, including quality attributes, constraints, and operational characteristics."))
    story.append(section_table([
        ["Category", "Requirement Focus"],
        ["Performance", "Fast complaint submission, dashboard refresh, and AI-assisted complaint analysis"],
        ["Throughput & Scalability", "Ability to support rising complaint volume and concurrent access"],
        ["Usability", "Simple, clear, and readable complaint workflow for citizens"],
        ["Accessibility", "Inclusive design aligned with WCAG-oriented principles"],
        ["Reliability", "Fallback behavior and reduced failure impact"],
        ["Maintainability", "Modular structure across web, backend, mobile, and AI service layers"],
    ], [55 * mm, 125 * mm]))
    story.append(Paragraph("3.2: Feasibility Study of the Project", styles["Head2Strict"]))
    for p in [
        "<b>Technical Feasibility:</b> UrbanEye is technically feasible because it uses a practical and well-supported stack including Next.js, React, Express, Prisma, FastAPI, React Native, and Expo. Each layer can be developed and tested independently while still contributing to one integrated platform.",
        "<b>Economic Feasibility:</b> The prototype is economically feasible because it can be developed using open-source frameworks, local development workflows, and student-friendly deployment options. Early-stage operation does not require enterprise-only infrastructure.",
        "<b>Operational Feasibility:</b> The workflow matches real user expectations. Residents can report issues in simple language, and administrators receive more structured complaint records. This makes the system usable on both ends of the complaint process.",
        "<b>Schedule Feasibility:</b> The project is feasible within a major-project timeline because complaint reporting, AI enrichment, dashboard visibility, and fallback behavior can be built incrementally and demonstrated progressively.",
    ]:
        story.append(P(p))
    story.append(Paragraph("3.3: Tools / Technologies / Platform used", styles["Head2Strict"]))
    story.append(section_table([
        ["Table 3.3.1: Frontend Layer", "Technology", "Purpose"],
        ["Web Frontend", "Next.js, React, TypeScript, Tailwind CSS", "Citizen and admin dashboards, forms, complaint cards, map and profile views"],
        ["Mobile Frontend", "React Native, Expo, AsyncStorage", "Complaint reporting, tracking, local persistence, and mobile profile continuity"],
        ["Shared UI Logic", "Component-based design", "Reusable interface building blocks"],
    ], [45 * mm, 60 * mm, 75 * mm]))
    story.append(Spacer(1, 3 * mm))
    story.append(section_table([
        ["Table 3.3.2: Backend Layer", "Technology", "Purpose"],
        ["API Layer", "Node.js, Express.js", "Complaint, admin, auth, and map route handling"],
        ["Persistence", "Prisma, PostgreSQL-ready schema, mock store", "Complaint and user data management"],
        ["Support Services", "Cache service, validators, middleware", "Resilience, validation, and response normalization"],
    ], [45 * mm, 60 * mm, 75 * mm]))
    story.append(Spacer(1, 3 * mm))
    story.append(section_table([
        ["Table 3.3.3: External Services & APIs", "Technology", "Purpose"],
        ["AI Service", "FastAPI, Pydantic", "Complaint analysis and X-ready social post generation"],
        ["Mobile Local Storage", "AsyncStorage", "Local complaint continuity"],
        ["Map Support", "Project map service", "Hotspot and location-oriented complaint visibility"],
    ], [45 * mm, 60 * mm, 75 * mm]))
    story.append(Spacer(1, 3 * mm))
    story.append(section_table([
        ["Table 3.3.4: Deployment & Hosting", "Technology", "Purpose"],
        ["Web Runtime", "Managed web host / local development", "Run web application"],
        ["Backend Runtime", "Node service host", "Run complaint API"],
        ["AI Runtime", "Python service host", "Run complaint analysis service"],
    ], [45 * mm, 60 * mm, 75 * mm]))
    story.append(Spacer(1, 3 * mm))
    story.append(section_table([
        ["Table 3.3.5: Development Tools", "Tool", "Purpose"],
        ["Version Control", "Git, GitHub", "Source control and collaboration"],
        ["Editor", "VS Code", "Development environment"],
        ["Testing Support", "Syntax checks, Expo export, API verification", "Stability validation"],
    ], [45 * mm, 60 * mm, 75 * mm]))
    story.append(Paragraph("3.4: Use Case Diagrams / Data Flow Diagrams", styles["Head2Strict"]))
    story.append(PlaceholderFigure(label="Leave this use case diagram space empty"))
    add_caption(story, "Figure 3.4.1: Use Case Diagram of UrbanEye")
    story.append(P("A use case diagram shows how the citizen user and the administrative user interact with UrbanEye. The citizen reports complaints, views complaint status, opens complaint details, and manages profile preferences. The administrative user reviews complaint totals, category distributions, and hotspot-oriented summaries."))
    story.append(PlaceholderFigure(label="Leave this Level 0 DFD space empty"))
    add_caption(story, "Figure 3.4.2: Level 0 Data Flow Diagram (DFD)")
    story.append(P("The Level 0 DFD shows complaint data moving from web or mobile interfaces to the backend API, then to the AI service and persistence layer, before being returned to dashboards, detail views, and administrative screens."))
    story.append(PlaceholderFigure(label="Leave this Level 1 DFD space empty"))
    add_caption(story, "Figure 3.4.3: Level 1 Data Flow Diagram (DFD)")
    story.append(P("The Level 1 DFD expands the complaint lifecycle into validation, analysis, storage, retrieval, and monitoring stages. It makes the complaint object the central information unit of the platform."))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 4: DESIGN AND ARCHITECTURE", styles["Head1Strict"]))
    story.append(Paragraph("4.1: Structure Chart / Work Breakdown Structure", styles["Head2Strict"]))
    story.append(PlaceholderFigure(label="Leave this WBS space empty"))
    add_caption(story, "Figure 4.1.1: Work Breakdown Structure (WBS)")
    story.append(P("A WBS decomposes UrbanEye into manageable implementation units showing hierarchy and dependencies across the web frontend, mobile app, backend API, AI service, and documentation/testing activities."))
    story.append(Paragraph("4.2: Explanation of Modules", styles["Head2Strict"]))
    for p in [
        "The web application acts as the dashboard-oriented face of UrbanEye. It supports landing content, report panels, complaint cards, complaint detail access, map visibility, profile settings, and administrative summaries.",
        "The mobile application is designed around ease of complaint reporting and personal complaint tracking. It emphasizes quick status interpretation, solved versus open progress, and local continuity.",
        "The backend API coordinates complaint intake, validation, analysis calls, persistence, retrieval, caching, and administrative summaries. It acts as the operational core of the project.",
        "The AI service is intentionally separated as a FastAPI microservice so that complaint analysis can evolve independently. It currently focuses on deterministic civic issue interpretation and X-ready public update generation.",
        "The persistence layer combines database-ready structure with fallback continuity. When full persistence is not available, mock and local storage keep the complaint journey demonstrable and visible.",
    ]:
        story.append(P(p))
    story.append(PlaceholderFigure(label="Leave this system architecture space empty"))
    add_caption(story, "Figure 4.2.1: System Architecture Diagram")
    story.append(Paragraph("4.3: Flow Chart / Activity Diagram", styles["Head2Strict"]))
    story.append(PlaceholderFigure(label="Leave this activity diagram space empty"))
    add_caption(story, "Figure 4.3.1: Activity Diagram: Complaint Submission Flow")
    story.append(P("The complaint submission flow begins when the resident enters complaint details, continues through validation and AI enrichment, and ends with structured storage and dashboard visibility."))
    story.append(Paragraph("4.4: ER Diagram / Class Diagram", styles["Head2Strict"]))
    story.append(PlaceholderFigure(label="Leave this ER / class diagram space empty"))
    add_caption(story, "Figure 4.4.1: ER Diagram / Class Diagram")
    story.append(P("The core data model of UrbanEye centers on the complaint entity, which stores original complaint fields as well as AI-generated fields such as category, priority, department, suggested action, and social post text. User association, location attributes, and status information complete the model."))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 5: IMPLEMENTATION", styles["Head1Strict"]))
    story.append(Paragraph("5.1: Screenshots", styles["Head2Strict"]))
    for caption, description in [
        ("Figure 5.1.1: Home Page", "The home page introduces UrbanEye as a citizen-friendly civic-tech system and provides complaint entry points, dashboard context, and system framing."),
        ("Figure 5.1.2: Dashboard Page", "The dashboard page summarizes complaint flow, totals, status information, and operational overview components for users and administrators."),
        ("Figure 5.1.3: Profile Page", "The profile page stores the preferred X account handle and keeps personal settings lightweight and accessible."),
        ("Figure 5.1.4: Complaint Detail Page", "The complaint detail page shows original complaint content together with category, priority, department, suggested action, and social post drafting support."),
        ("Figure 5.1.5: Administrative Overview Page", "The administrative overview page displays complaint distributions, status totals, and map-oriented or hotspot-oriented insights."),
    ]:
        story.append(PlaceholderFigure(label="Leave this screenshot space empty"))
        add_caption(story, caption)
        story.append(P(description))
    story.append(Paragraph("5.2: Source Code of some modules", styles["Head2Strict"]))
    story.append(P("Selected source code modules are included in the appendix so that the report remains readable while still demonstrating the real project implementation."))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 6: TESTING", styles["Head1Strict"]))
    for p in [
        "Testing in UrbanEye focused on the full complaint journey rather than isolated functions alone. The most important question was whether a complaint could move from user input to structured output and then reappear reliably in tracking views.",
        "Functional testing checked complaint submission, complaint retrieval, AI classification behavior, dashboard visibility, and mobile tracking features. Performance-oriented testing examined response behavior under repeated local use, while resilience testing examined fallback continuity when ideal service conditions were not available.",
    ]:
        story.append(P(p))
    story.append(section_table([
        ["Test Case", "Action", "Expected Result", "Status"],
        ["Complaint Submission", "Submit valid complaint payload", "Complaint is created with AI-enriched metadata", "Passed"],
        ["Complaint Retrieval", "Fetch all complaints", "Normalized complaint records returned", "Passed"],
        ["Complaint Detail", "Open one complaint", "Structured complaint view displayed", "Passed"],
        ["AI Analysis", "Submit roads / sanitation / water complaint text", "Reasonable category and department mapping", "Passed"],
        ["Mobile Local Persistence", "Create complaint while backend path fails", "Complaint remains visible locally", "Passed"],
        ["Administrative Overview", "Open overview dashboard", "Complaint summaries are displayed", "Passed"],
    ], [40 * mm, 50 * mm, 70 * mm, 20 * mm]))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 7: SUMMARY & CONCLUSIONS", styles["Head1Strict"]))
    story.append(Paragraph("Project Summary", styles["Head2Strict"]))
    for p in [
        "UrbanEye is a full-stack civic complaint and issue-resolution platform created to make public problem reporting easier, clearer, and more trackable. The project combines a web interface, a mobile interface, a backend API, and a FastAPI-based AI service in one unified workflow.",
        "Its strongest contribution is the transformation of complaint submission into a visible lifecycle. Instead of stopping at complaint intake, the platform enriches complaints, persists them, and makes their progress visible through dashboards and detail views.",
    ]:
        story.append(P(p))
    story.append(Paragraph("Conclusion", styles["Head2Strict"]))
    for p in [
        "UrbanEye demonstrates that AI can support public grievance systems when it is embedded inside a structured application flow. The project improves transparency, complaint clarity, and readiness for accountable communication.",
        "For a major project, UrbanEye is technically credible and socially relevant because it combines real software engineering, practical AI usage, multi-platform design, and a meaningful public-service problem domain in one system.",
    ]:
        story.append(P(p))
    story.append(PageBreak())

    story.append(Paragraph("CHAPTER 8: LIMITATION OF THE PROJECT & FUTURE WORK", styles["Head1Strict"]))
    story.append(Paragraph("Limitations", styles["Head2Strict"]))
    add_bullets(story, [
        "The present AI workflow is mainly text-driven and does not yet provide full image-based issue detection in the active complaint path.",
        "The platform generates X-ready public updates, but direct supervised live posting is not yet completed.",
        "The current project is optimized for academic demonstration rather than immediate city-wide production rollout.",
        "Map and hotspot functionality remain simpler than a full GIS-backed civic deployment.",
        "Multilingual complaint handling and large-scale policy governance remain future concerns.",
    ])
    story.append(Paragraph("Future Work & Roadmap", styles["Head2Strict"]))
    add_bullets(story, [
        "Add supervised live X posting with approval and retry handling.",
        "Add stronger image-assisted civic issue understanding.",
        "Expand multilingual complaint analysis and broader dataset support.",
        "Introduce density-aware hotspot clustering and smarter priority assignment.",
        "Add richer administrative workflow states, notifications, and escalation history.",
        "Strengthen observability, privacy controls, and audit-friendly deployment behavior.",
    ])
    story.append(PageBreak())

    story.append(Paragraph("BIBLIOGRAPHY", styles["Head1Strict"]))
    refs = [
        "Next.js Documentation, Vercel.",
        "React Documentation, Meta.",
        "Express.js Documentation.",
        "FastAPI Documentation.",
        "Prisma ORM Documentation.",
        "Expo Documentation.",
        "WCAG 2.1 Guidelines, W3C.",
        "Research and civic-tech references relevant to complaint systems, dashboards, and responsible AI-assisted workflows.",
    ]
    for ref in refs:
        story.append(P(ref))
    story.append(PageBreak())

    story.append(Paragraph("APPENDIX", styles["Head1Strict"]))
    story.append(Paragraph("A. Important API Endpoints", styles["Head2Strict"]))
    story.append(section_table([
        ["Method", "Endpoint", "Purpose"],
        ["POST", "/auth/register", "Register a user"],
        ["POST", "/auth/login", "Authenticate a user"],
        ["POST", "/complaints", "Create a complaint and attach AI analysis"],
        ["GET", "/complaints", "Retrieve complaint list"],
        ["GET", "/complaints/:id", "Retrieve single complaint"],
        ["GET", "/admin/dashboard", "Administrative summary overview"],
        ["GET", "/admin/complaints", "Administrative complaint list"],
        ["GET", "/map/hotspots", "Complaint hotspot information"],
        ["POST", "/analyze", "AI complaint analysis route"],
    ], [22 * mm, 55 * mm, 98 * mm]))
    story.append(Paragraph("B. Stakeholder Analysis", styles["Head2Strict"]))
    story.append(section_table([
        ["Stakeholder", "Role", "Relevance"],
        ["Citizen / Resident", "Primary issue reporter", "Defines usability and status transparency needs"],
        ["Administrative User", "Monitor and reviewer", "Defines dashboard, summary, and category breakdown needs"],
        ["System Maintainer", "Technical maintainer", "Needs modularity, logging, and service clarity"],
        ["Future Field Team", "Possible operational assignee", "Motivates richer future workflow states"],
    ], [50 * mm, 50 * mm, 75 * mm]))
    story.append(Paragraph("C. Extended Code Listings", styles["Head2Strict"]))
    story.append(PageBreak())
    for title, rel_path in CODE_FILES:
        story.extend(code_listing(title, rel_path))
    return story


def draw_cover_border(canvas):
    width, height = A4
    canvas.saveState()
    canvas.setLineWidth(1)
    canvas.rect(26 * mm, 26 * mm, width - 52 * mm, height - 52 * mm)
    canvas.restoreState()


def draw_cover(canvas):
    width, height = A4
    canvas.saveState()

    def centered(lines, y, font="Times-Bold", size=12, leading=16):
        canvas.setFont(font, size)
        current_y = y
        for line in lines:
            canvas.drawCentredString(width / 2, current_y, line)
            current_y -= leading
        return current_y

    centered(
        ["UrbanEye AI-Driven Smart Complaint &", "Civic Issue Resolution System"],
        220 * mm,
        font="Times-Bold",
        size=24,
        leading=29,
    )
    centered(
        ["(ES-452: Major Project - Dissertation)"],
        184 * mm,
        font="Times-Bold",
        size=18,
        leading=22,
    )
    centered(
        ["submitted in partial fulfillment of the requirement", "for the award of the degree of"],
        157 * mm,
        font="Times-Roman",
        size=16,
        leading=18,
    )
    centered(
        ["Bachelor of Technology", "in", "Information Technology"],
        138 * mm,
        font="Times-Bold",
        size=20,
        leading=24,
    )
    centered(["Submitted by"], 102 * mm, font="Times-Bold", size=16, leading=18)
    centered(["ALOK RANJAN", "15276803122"], 91 * mm, font="Times-Bold", size=16, leading=18)
    centered(["Under the supervision of"], 74 * mm, font="Times-Bold", size=16, leading=18)
    centered(["MRS. JASLEEN KAUR", "ASSISTANT PROFESSOR"], 63 * mm, font="Times-Bold", size=16, leading=18)
    centered(
        [
            "Information Technology",
            "Guru Tegh Bahadur Institute of Technology",
            "G-8 Area, Rajouri Garden, New Delhi - 110064",
        ],
        41 * mm,
        font="Times-Bold",
        size=14,
        leading=16,
    )
    centered(["May/June 2026"], 24 * mm, font="Times-Bold", size=16, leading=18)
    canvas.restoreState()


def on_first_page(canvas, doc):
    draw_cover_border(canvas)
    draw_cover(canvas)


def main():
    REPORT_DIR.mkdir(exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=32 * mm,
        rightMargin=26 * mm,
        topMargin=24 * mm,
        bottomMargin=24 * mm,
        title="UrbanEye Strict Sample Format Report",
    )
    story = story_content()
    doc.build(story, onFirstPage=on_first_page, onLaterPages=draw_header)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
