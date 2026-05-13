from __future__ import annotations

import textwrap
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.graphics.shapes import Drawing, Rect, String, Ellipse, Line, Polygon
from reportlab.platypus.flowables import KeepTogether


ROOT = Path("/Users/alokranjan/Desktop/major")
REPORT_DIR = ROOT / "project_report"
OUTPUT = REPORT_DIR / "UrbanEye_Major_Project_Report_StrictFormat.pdf"
LOGO_COLOR = REPORT_DIR / "template_assets" / "Image14.jpg"
LOGO_WATERMARK = REPORT_DIR / "template_assets" / "Image5.jpg"

CODE_FILES = [
    ("Backend Application Bootstrap", "backend/src/app.js"),
    ("Backend Server Entry", "backend/src/server.js"),
    ("Authentication Routes", "backend/src/routes/authRoutes.js"),
    ("Complaint Routes", "backend/src/routes/complaintRoutes.js"),
    ("Admin Routes", "backend/src/routes/adminRoutes.js"),
    ("Map Routes", "backend/src/routes/mapRoutes.js"),
    ("Authentication Controller", "backend/src/controllers/authcontroller.js"),
    ("Complaint Controller", "backend/src/controllers/complaintController.js"),
    ("Admin Controller", "backend/src/controllers/adminController.js"),
    ("Map Controller", "backend/src/controllers/mapController.js"),
    ("Backend AI Service Adapter", "backend/src/services/aiService.js"),
    ("Mock Store Data Layer", "backend/src/data/mockStore.js"),
    ("Prisma Utility", "backend/src/utils/prisma.js"),
    ("Prisma Schema", "backend/prisma/schema.prisma"),
    ("AI Service Main Application", "ai_service/app/main.py"),
    ("AI Social Agent", "ai_service/agents/social_agent.py"),
    ("AI LLM Configuration", "ai_service/config/llm.py"),
    ("Web Home Page", "web_app/src/app/page.tsx"),
    ("Web Dashboard Page", "web_app/src/app/dashboard/page.tsx"),
    ("Web Profile Page", "web_app/src/app/profile/page.tsx"),
    ("Web Dashboard Shell", "web_app/src/components/DashboardShell.tsx"),
    ("Web Complaint Card", "web_app/src/components/Complaintcard.tsx"),
    ("Web Report Panel", "web_app/src/components/ReportPanel.tsx"),
    ("Web Map Snapshot", "web_app/src/components/MapComplaint.tsx"),
    ("Web Navbar", "web_app/src/components/Navbar.tsx"),
    ("Web Sidebar", "web_app/src/components/Sidebar.tsx"),
    ("Web Complaint Service", "web_app/src/services/complaintService.ts"),
    ("Web Admin Service", "web_app/src/services/adminService.ts"),
    ("Web Demo Data", "web_app/src/lib/demoData.ts"),
    ("Mobile Application Entry", "mobile_app/App.js"),
    ("Mobile Navigator", "mobile_app/src/navigation/AppNavigator.js"),
    ("Mobile Auth Context", "mobile_app/src/context/AuthContext.js"),
    ("Mobile Complaint Service", "mobile_app/src/services/complaintService.js"),
    ("Mobile API Service", "mobile_app/src/services/api.js"),
    ("Mobile Auth Service", "mobile_app/src/services/authService.js"),
    ("Mobile Home Screen", "mobile_app/src/screens/HomeScreen.js"),
    ("Mobile Dashboard Screen", "mobile_app/src/screens/DashbboardScreen.js"),
    ("Mobile Profile Screen", "mobile_app/src/screens/ProfileScreen.js"),
    ("Mobile Report Screen", "mobile_app/src/screens/ReportScreen.js"),
    ("Mobile Complaint Card", "mobile_app/src/screens/ComplaintCard.js"),
    ("Mobile Complaint Detail Screen", "mobile_app/src/screens/ComplaintDetailScreen.js"),
    ("Mobile Login Screen", "mobile_app/src/screens/LoginScreen.js"),
    ("Mobile Register Screen", "mobile_app/src/screens/RegisterScreen.js"),
    ("Mobile Complaint Utilities", "mobile_app/src/utils/complaintUtils.js"),
]


ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"]


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="BodyTNR",
        fontName="Times-Roman",
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="CenterTNR",
        fontName="Times-Bold",
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="ChapterTNR",
        fontName="Times-Bold",
        fontSize=17,
        leading=21,
        alignment=TA_CENTER,
        spaceAfter=16,
    )
)
styles.add(
    ParagraphStyle(
        name="Heading2TNR",
        fontName="Times-Bold",
        fontSize=13,
        leading=17,
        spaceAfter=8,
        spaceBefore=10,
    )
)
styles.add(
    ParagraphStyle(
        name="Heading3TNR",
        fontName="Times-Bold",
        fontSize=11.5,
        leading=15,
        spaceAfter=6,
        spaceBefore=8,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallTNR",
        fontName="Times-Roman",
        fontSize=9.5,
        leading=12,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        fontName="Times-Bold",
        fontSize=20,
        leading=25,
        alignment=TA_CENTER,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSub",
        fontName="Times-Bold",
        fontSize=14,
        leading=18,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)

code_style = ParagraphStyle(
    "CodeStyle",
    fontName="Courier",
    fontSize=7.8,
    leading=9.2,
    spaceAfter=6,
)


def P(text: str, style: str = "BodyTNR") -> Paragraph:
    return Paragraph(text, styles[style])


def section_table(rows, col_widths=None):
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
                ("GRID", (0, 0), (-1, -1), 0.7, colors.black),
                ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 4),
                ("ALIGN", (0, 0), (-1, 0), "CENTER"),
            ]
        )
    )
    return table


def line_wrap_code(content: str, width: int = 86) -> str:
    wrapped_lines = []
    for line in content.splitlines():
        if not line:
            wrapped_lines.append("")
            continue
        chunks = textwrap.wrap(
            line,
            width=width,
            replace_whitespace=False,
            drop_whitespace=False,
            subsequent_indent="    ",
        )
        wrapped_lines.extend(chunks or [""])
    return "\n".join(wrapped_lines)


def add_caption(story, text: str):
    story.append(Paragraph(text, ParagraphStyle("Caption", fontName="Times-Italic", fontSize=10, alignment=TA_CENTER, spaceAfter=10)))


def use_case_drawing():
    d = Drawing(500, 260)
    d.add(Rect(130, 20, 250, 200, rx=12, ry=12, strokeColor=colors.grey, fillColor=colors.HexColor("#f8fafc")))
    d.add(String(255, 205, "UrbanEye System", fontName="Times-Bold", fontSize=16, textAnchor="middle"))
    for x, y, text in [
        (230, 165, "Register / Login"),
        (230, 120, "Submit Complaint"),
        (230, 75, "Track Complaint Status"),
        (315, 145, "View Admin Overview"),
        (315, 100, "Review Hotspots"),
        (315, 55, "Generate Social Update"),
    ]:
        d.add(Ellipse(x - 60, y - 15, 120, 30, strokeColor=colors.black, fillColor=colors.white))
        d.add(String(x, y - 4, text, fontName="Times-Roman", fontSize=10, textAnchor="middle"))
    d.add(Ellipse(20, 115, 80, 40, strokeColor=colors.HexColor("#0369a1"), fillColor=colors.HexColor("#e0f2fe")))
    d.add(String(60, 136, "Citizen", fontName="Times-Bold", fontSize=12, textAnchor="middle"))
    d.add(Ellipse(410, 115, 80, 40, strokeColor=colors.HexColor("#6d28d9"), fillColor=colors.HexColor("#ede9fe")))
    d.add(String(450, 136, "Admin", fontName="Times-Bold", fontSize=12, textAnchor="middle"))
    for coords in [
        (100, 130, 170, 165), (100, 125, 170, 120), (100, 115, 170, 75),
        (380, 145, 410, 135), (380, 100, 410, 125), (380, 55, 410, 115),
    ]:
        d.add(Line(*coords, strokeColor=colors.black))
    return d


def level0_dfd():
    d = Drawing(510, 240)
    blocks = [
        (15, 90, 90, 40, "#e0f2fe", "Citizen"),
        (145, 80, 115, 60, "#fef3c7", "UrbanEye\nFrontend"),
        (300, 80, 95, 60, "#dbeafe", "Backend API"),
        (425, 150, 75, 50, "#ede9fe", "AI Service"),
        (425, 30, 75, 50, "#dcfce7", "Database /\nMock Store"),
    ]
    for x, y, w, h, color, txt in blocks:
        d.add(Rect(x, y, w, h, rx=8, ry=8, fillColor=colors.HexColor(color), strokeColor=colors.black))
        for i, line in enumerate(txt.split("\n")):
            d.add(String(x + w / 2, y + h / 2 + 5 - (i * 12), line, fontName="Times-Bold", fontSize=10, textAnchor="middle"))
    for coords in [(105, 110, 145, 110), (260, 110, 300, 110), (395, 120, 425, 175), (395, 95, 425, 55)]:
        d.add(Line(*coords, strokeColor=colors.black))
    return d


def wbs_drawing():
    d = Drawing(520, 250)
    d.add(Rect(200, 15, 120, 35, fillColor=colors.HexColor("#dbeafe"), strokeColor=colors.black))
    d.add(String(260, 36, "UrbanEye Project", fontName="Times-Bold", fontSize=12, textAnchor="middle"))
    names = ["Web Application", "Mobile Application", "Backend API", "AI Service"]
    xs = [25, 155, 285, 415]
    for x, name in zip(xs, names):
        d.add(Rect(x, 95, 100, 35, fillColor=colors.HexColor("#fef3c7"), strokeColor=colors.black))
        d.add(String(x + 50, 117, name, fontName="Times-Roman", fontSize=10, textAnchor="middle"))
        d.add(Line(260, 50, x + 50, 95, strokeColor=colors.black))
    return d


def er_drawing():
    d = Drawing(520, 250)
    d.add(Rect(35, 40, 150, 130, strokeColor=colors.black, fillColor=colors.white))
    d.add(Rect(35, 145, 150, 25, strokeColor=colors.black, fillColor=colors.HexColor("#dbeafe")))
    d.add(String(110, 153, "User", fontName="Times-Bold", fontSize=12, textAnchor="middle"))
    for i, field in enumerate(["id (PK)", "name", "email", "password", "role", "createdAt"]):
        d.add(String(45, 125 - i * 16, field, fontName="Times-Roman", fontSize=9))
    d.add(Rect(285, 20, 190, 180, strokeColor=colors.black, fillColor=colors.white))
    d.add(Rect(285, 175, 190, 25, strokeColor=colors.black, fillColor=colors.HexColor("#dcfce7")))
    d.add(String(380, 183, "Complaint", fontName="Times-Bold", fontSize=12, textAnchor="middle"))
    fields = ["id (PK)", "title", "description", "location", "category", "priority", "status", "department", "socialPost", "userId (FK)"]
    for i, field in enumerate(fields):
        d.add(String(295, 158 - i * 14, field, fontName="Times-Roman", fontSize=8.8))
    d.add(Line(185, 100, 285, 100, strokeColor=colors.black))
    d.add(String(235, 108, "1 to many", fontName="Times-Italic", fontSize=9, textAnchor="middle"))
    return d


def on_page(canvas, doc):
    page = canvas.getPageNumber()
    width, height = A4
    if page == 1:
        return
    canvas.saveState()
    if LOGO_WATERMARK.exists():
        canvas.drawImage(
            ImageReader(str(LOGO_WATERMARK)),
            (width - 58 * mm) / 2,
            (height - 58 * mm) / 2,
            width=58 * mm,
            height=58 * mm,
            preserveAspectRatio=True,
            mask="auto",
        )
    canvas.setFont("Times-Bold", 11)
    if 2 <= page <= 8:
        label = ROMAN[page - 2] if page - 2 < len(ROMAN) else str(page - 1)
        header = f"INFORMATION TECHNOLOGY {label}"
    else:
        header = f"INFORMATION TECHNOLOGY {page - 8}"
    canvas.drawCentredString(width / 2, height - 18 * mm, header)
    canvas.restoreState()


def cover_page(story):
    logo_block = []
    if LOGO_COLOR.exists():
        logo = Image(str(LOGO_COLOR), width=28 * mm, height=28 * mm)
        logo.hAlign = "CENTER"
        logo_block = [logo, Spacer(1, 8 * mm)]
    story.extend(
        [
            Spacer(1, 18 * mm),
            Paragraph("Urban Eye AI-Driven Smart Complaint & Civic Issue Resolution System", styles["CoverTitle"]),
            Spacer(1, 5 * mm),
            Spacer(1, 8 * mm),
            Paragraph("(ES-452: Major Project - Dissertation)", styles["CoverSub"]),
            Spacer(1, 6 * mm),
            *logo_block,
            Spacer(1, 18 * mm),
            P("submitted in partial fulfillment of the requirement for the award of the degree of", "CenterTNR"),
            Spacer(1, 3 * mm),
            P("<b>Bachelor of Technology</b><br/>in<br/><b>Information Technology</b>", "CenterTNR"),
            Spacer(1, 12 * mm),
            P("Submitted by", "CenterTNR"),
            P("<b>Alok Ranjan</b><br/>Enrollment No.: ____________________", "CenterTNR"),
            Spacer(1, 12 * mm),
            P("Under the supervision of", "CenterTNR"),
            P("<b>____________________</b><br/>Assistant Professor", "CenterTNR"),
            Spacer(1, 16 * mm),
            P("<b>Information Technology</b><br/><b>Guru Tegh Bahadur Institute of Technology</b><br/>G-8 Area, Rajouri Garden, New Delhi - 110064<br/>May/June 2026", "CenterTNR"),
            PageBreak(),
        ]
    )


def prelim_page(title: str, paragraphs: list[str], story):
    story.append(Paragraph(title, styles["CenterTNR"]))
    story.append(Spacer(1, 6 * mm))
    for paragraph in paragraphs:
        story.append(P(paragraph))
    story.append(PageBreak())


def code_listing(title: str, rel_path: str):
    path = ROOT / rel_path
    content = line_wrap_code(path.read_text(), width=82)
    return [
        Paragraph(title, styles["Heading3TNR"]),
        Paragraph(f"<b>File:</b> {rel_path}", styles["SmallTNR"]),
        Preformatted(content, code_style),
        PageBreak(),
    ]


def story_content():
    story = []
    cover_page(story)

    prelim_page(
        "DECLARATION",
        [
            "This is to certify that the material embodied in this Major Project - Dissertation titled "
            "<b>“UrbanEye: AI-Smart Complaint and Civic Issue Resolution System”</b> is based on my original work. "
            "It is further certified that this dissertation has not been submitted in full or in part to this or any other "
            "institution for the award of any other degree or diploma. Wherever the ideas or work of others have been used, "
            "due acknowledgement has been made at the relevant places in the report.",
            "______________________<br/><b>Alok Ranjan</b><br/>Student",
        ],
        story,
    )

    prelim_page(
        "CERTIFICATE",
        [
            "This is to certify that the work embodied in this Major Project - Dissertation titled "
            "<b>“UrbanEye: AI-Smart Complaint and Civic Issue Resolution System”</b> has been carried out by "
            "<b>Alok Ranjan</b> under my supervision and guidance in partial fulfillment of the requirements for the award "
            "of the Bachelor of Technology degree.",
            "It is further certified that, to the best of my knowledge and belief, the work presented in this report is "
            "original and has not been submitted elsewhere for any other degree or diploma.",
            "______________________<br/><b>Project Supervisor</b><br/><br/>______________________<br/><b>Head of Department</b>",
        ],
        story,
    )

    prelim_page(
        "ACKNOWLEDGEMENT",
        [
            "I would like to express my sincere gratitude to my project supervisor for guidance, encouragement, and valuable "
            "feedback throughout the development of this project. Their suggestions helped shape the system into a more practical "
            "and academically meaningful solution.",
            "I am thankful to the faculty members of the department for providing a strong academic foundation in software "
            "engineering, database systems, web technologies, and intelligent systems. Their teaching greatly contributed to "
            "the successful completion of this work.",
            "I also extend my thanks to my friends and peers for their support in testing, design review, and discussion. "
            "Finally, I would like to thank my family for their constant encouragement and patience during the project period.",
        ],
        story,
    )

    prelim_page(
        "ABSTRACT",
        [
            "UrbanEye is a full-stack civic complaint and issue-resolution platform created to make public problem reporting "
            "simpler, faster, and easier to track. In many existing systems, a citizen can submit a complaint but still remain "
            "uncertain about what happens next. The present project addresses that gap by turning complaint submission into a "
            "structured workflow instead of a one-time form entry exercise.",
            "The system combines a web application, a mobile application, a backend API, and a FastAPI-based AI service. "
            "A user reports an issue by entering a title, description, and location, with optional image support. The AI layer "
            "then helps enrich the complaint by suggesting a category, estimating priority, identifying the likely department, "
            "generating a suggested action, and drafting a concise X-ready public update. These additions make the complaint "
            "more useful for both citizens and authorities.",
            "UrbanEye also includes dashboards for complaint tracking, complaint status visibility, and location-oriented "
            "monitoring. The mobile side focuses on helping a resident see whether a complaint is pending, in progress, or "
            "resolved, while the web side focuses on overview and operational visibility. The project shows how AI can be used "
            "practically in a civic-tech setting to improve transparency, structure, and accountability while remaining simple "
            "enough to demonstrate and extend in an academic environment.",
        ],
        story,
    )

    story.append(Paragraph("LIST OF FIGURES", styles["CenterTNR"]))
    story.append(
        section_table(
            [
                ["Figure No.", "Figure Title", "Page No."],
                ["3.4.1", "Use Case Diagram of UrbanEye", "17"],
                ["3.4.2", "Level 0 Data Flow Diagram", "18"],
                ["4.1.1", "Work Breakdown Structure", "22"],
                ["4.2.1", "System Architecture Diagram", "24"],
                ["4.4.1", "ER Diagram", "28"],
                ["5.1.1", "Web Home and Dashboard Flow", "33"],
                ["5.1.2", "Mobile Home and Dashboard Flow", "34"],
            ],
            [30 * mm, 120 * mm, 25 * mm],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("LIST OF TABLES", styles["CenterTNR"]))
    story.append(
        section_table(
            [
                ["Table No.", "Table Title", "Page No."],
                ["1.1", "Major Objectives of UrbanEye", "4"],
                ["2.1", "Problems in Conventional Civic Complaint Workflows", "8"],
                ["3.1", "Functional Requirements", "12"],
                ["3.2", "Non-Functional Requirements", "14"],
                ["3.3", "Tools / Technologies / Platform Used", "16"],
                ["6.1", "Testing Summary", "39"],
            ],
            [30 * mm, 120 * mm, 25 * mm],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("TABLE OF CONTENTS", styles["CenterTNR"]))
    story.append(
        section_table(
            [
                ["Section", "Page No."],
                ["Declaration", "I"],
                ["Certificate", "II"],
                ["Acknowledgement", "III"],
                ["Abstract", "IV"],
                ["List of Figures", "V"],
                ["List of Tables", "VI"],
                ["Chapter 1: Introduction", "1"],
                ["Chapter 2: Problem Statement", "5"],
                ["Chapter 3: Analysis", "10"],
                ["Chapter 4: Design and Architecture", "20"],
                ["Chapter 5: Implementation", "31"],
                ["Chapter 6: Testing", "39"],
                ["Chapter 7: Summary and Conclusion", "44"],
                ["Chapter 8: Limitations and Future Work", "48"],
                ["Bibliography", "51"],
                ["Appendix", "52 onwards"],
            ],
            [140 * mm, 35 * mm],
        )
    )
    story.append(PageBreak())

    # Chapter 1
    story.append(Paragraph("CHAPTER 1: INTRODUCTION", styles["ChapterTNR"]))
    story.append(Paragraph("1.1 Project Overview", styles["Heading2TNR"]))
    intro_paras = [
        "UrbanEye is a full-stack civic complaint management platform created to improve complaint reporting, analysis, routing, and status tracking in a unified workflow. The project was conceived around a practical public problem: residents can notice civic issues quickly, but the institutional path from complaint submission to resolution is often opaque, fragmented, and difficult to monitor.",
        "The system responds to this gap by bringing together a web application, a mobile application, a backend service, and an AI microservice. The web application provides dashboard-centric visibility, the mobile application supports on-the-go reporting and follow-up, the backend manages APIs and persistence, and the AI service enriches complaint content with category, priority, department mapping, suggested action, and public update text.",
        "The solution is intentionally designed as a modular system rather than a monolithic academic prototype. This allows the project to remain understandable in its current form while also being extensible enough for future integration with administrative workflows, GIS systems, notification engines, and real social publishing channels.",
        "UrbanEye is therefore not only a complaint submission interface but also a structured decision-support system for civic issue handling. Its purpose is to reduce ambiguity, shorten triage effort, improve user trust, and provide a more transparent progression from issue reporting to issue resolution.",
    ]
    for p in intro_paras:
        story.append(P(p))

    story.append(Paragraph("1.2 Need for the Project", styles["Heading2TNR"]))
    for p in [
        "In many civic environments, the user experience of complaint handling is weak. A resident may report an issue, but may not know whether the responsible department has received it, whether it has been prioritized, or whether the issue is under active resolution. This causes dissatisfaction and often leads to repeated reporting of the same problem.",
        "At the administrative level, unstructured complaint records create a different problem. If complaints exist only as plain text or in disconnected channels, authorities cannot easily derive category distributions, hotspot patterns, or urgency trends. Decision-making becomes reactive and dependent on manual interpretation.",
        "UrbanEye was developed to demonstrate that these two problems can be addressed together. The same structured complaint object that improves resident transparency also improves administrative analytics. The same AI-assisted classification that reduces routing effort also improves consistency in dashboard reporting.",
    ]:
        story.append(P(p))

    story.append(Paragraph("1.3 Major Objectives", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Objective", "Description"],
                ["Unified Complaint Lifecycle", "Integrate reporting, enrichment, storage, dashboarding, and update preparation in one workflow."],
                ["AI-Assisted Triage", "Infer category, priority, department, and public update text from complaint input."],
                ["Multi-Platform Accessibility", "Support complaint access from both browser and mobile environments."],
                ["Administrative Visibility", "Provide overview metrics, breakdowns, and complaint hotspots."],
                ["Status Transparency", "Help residents clearly determine whether complaints are pending, in progress, or solved."],
                ["Extensibility", "Retain a modular design for future integrations and real deployments."],
            ],
            [55 * mm, 115 * mm],
        )
    )
    story.append(Paragraph("1.4 Scope of the Project", styles["Heading2TNR"]))
    for p in [
        "The scope of the project includes user registration and login, complaint creation, AI-assisted complaint analysis, administrative dashboards, hotspot summaries, and mobile status tracking. It also includes local fallback mechanisms for resilience during demonstrations and development.",
        "The current scope excludes a complete workforce dispatch system, authenticated social media publishing, real municipal ERP integration, and advanced geospatial analysis. However, the system has been architected to make those additions feasible in future iterations.",
    ]:
        story.append(P(p))
    story.append(PageBreak())

    # Chapter 2
    story.append(Paragraph("CHAPTER 2: PROBLEM STATEMENT", styles["ChapterTNR"]))
    story.append(Paragraph("2.1 Problem Definition", styles["Heading2TNR"]))
    for p in [
        "The main problem addressed by UrbanEye is the absence of a transparent, structured, and intelligent complaint handling pipeline for civic issue management. Conventional complaint systems often treat submission as the endpoint of the user experience, whereas in reality the user cares most about classification, routing, action, and closure.",
        "This problem has two visible dimensions. First, residents do not get a reliable sense of complaint progress. Second, administrators do not receive complaint data in a form that is easy to summarize or act upon. Without structured categories and priority metadata, every complaint becomes a manual interpretation task.",
        "The problem becomes even more serious when the complaint domain is broad. Road issues, sanitation problems, water leakage, electricity faults, and general public complaints may all enter the same pipeline, but each belongs to a different department and may require a different urgency response. A good system therefore has to do more than simply collect text.",
    ]:
        story.append(P(p))
    story.append(Paragraph("2.2 Existing System Drawbacks", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Issue", "Description", "Impact"],
                ["Fragmented Reporting", "Complaints are often scattered across forms, calls, messages, or local registers.", "Weak continuity and duplication of records."],
                ["Weak Classification", "Complaint text lacks structured category and priority information.", "Incorrect or delayed routing."],
                ["Poor Status Visibility", "Users do not know whether action has started or finished.", "Low trust and repeated follow-up."],
                ["No Communication Support", "Authorities must draft public updates manually.", "Slow and inconsistent outreach."],
                ["Limited Analytics", "No quick overview of hotspots or department load.", "Difficult planning and monitoring."],
            ],
            [40 * mm, 85 * mm, 50 * mm],
        )
    )
    story.append(Paragraph("2.3 Proposed Solution", styles["Heading2TNR"]))
    for p in [
        "UrbanEye introduces a structured pipeline in which complaints are accepted through user interfaces, validated at the backend, enriched through AI analysis, and then presented back to both residents and administrators as status-aware records.",
        "The AI component supports practical triage by mapping complaints to categories such as sanitation, water, roads, and electricity. It also determines urgency, suggests a department, and generates a concise social update text that can support public communication or internal coordination.",
        "By combining these steps into one workflow, UrbanEye reduces manual interpretation, improves consistency, and makes the complaint lifecycle far more visible to all stakeholders involved.",
    ]:
        story.append(P(p))
    story.append(Paragraph("2.4 Specific Objectives", styles["Heading2TNR"]))
    for item in [
        "To develop a web and mobile complaint reporting interface for civic issues.",
        "To enrich complaints with AI-generated category, priority, and department assignments.",
        "To provide complaint status transparency for residents.",
        "To offer aggregate administrative dashboards and hotspot awareness.",
        "To support future extensibility toward real-world civic deployment scenarios.",
    ]:
        story.append(P(f"• {item}", "BodyTNR"))
    story.append(PageBreak())

    # Chapter 3
    story.append(Paragraph("CHAPTER 3: ANALYSIS", styles["ChapterTNR"]))
    story.append(Paragraph("3.1 Software Requirement Specifications", styles["Heading2TNR"]))
    story.append(Paragraph("3.1.1 Functional Requirements of the Project", styles["Heading3TNR"]))
    story.append(
        section_table(
            [
                ["ID", "Requirement", "Description"],
                ["FR-1", "User Authentication", "Allow users to register and log in through the backend authentication API."],
                ["FR-2", "Complaint Submission", "Allow users to submit complaint title, description, location, and optional image."],
                ["FR-3", "Complaint Analysis", "Generate structured complaint metadata through the AI service."],
                ["FR-4", "Complaint Tracking", "Allow residents to review complaint status and details."],
                ["FR-5", "Admin Analytics", "Provide aggregate administrative metrics and complaint distribution."],
                ["FR-6", "Hotspot Support", "Expose location-based complaint data for map-oriented visibility."],
                ["FR-7", "Profile Preferences", "Allow saving of X-handle preference in mobile profile flow."],
                ["FR-8", "Fallback Operation", "Continue functioning in degraded mode through local fallback data and storage."],
            ],
            [20 * mm, 45 * mm, 110 * mm],
        )
    )
    story.append(Paragraph("3.1.2 Non-Functional Requirements of the Project", styles["Heading3TNR"]))
    story.append(
        section_table(
            [
                ["Category", "Requirement"],
                ["Usability", "Resident-facing screens must remain simple, readable, and status-oriented."],
                ["Reliability", "The system should continue functioning even when some external services are unavailable."],
                ["Maintainability", "The project should remain modular across frontend, backend, and AI service boundaries."],
                ["Scalability", "The persistence layer should support migration from demo/mock mode to database-backed operation."],
                ["Performance", "Dashboard loading and complaint analysis should remain reasonably responsive."],
                ["Portability", "The platform should work across browser and mobile contexts."],
            ],
            [45 * mm, 130 * mm],
        )
    )
    story.append(Paragraph("3.2 Feasibility Study of the Project", styles["Heading2TNR"]))
    for p in [
        "<b>Technical Feasibility:</b> The project uses mature technologies such as Express.js, Next.js, Prisma, FastAPI, and React Native with Expo. These tools are widely adopted, well documented, and appropriate for modular academic systems.",
        "<b>Operational Feasibility:</b> The workflow is practical because users only need to describe issues, while the system handles a large part of the triage burden. Administrative views are similarly direct and interpretable.",
        "<b>Economic Feasibility:</b> The stack is affordable for student use and can run in local or fallback mode without requiring paid enterprise infrastructure at every stage.",
    ]:
        story.append(P(p))
    story.append(Paragraph("3.3 Tools / Technologies / Platform used", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Layer", "Technology", "Purpose"],
                ["Web Frontend", "Next.js 16, React 19, TypeScript, Tailwind CSS", "Dashboards, report form, complaint listing, admin overview"],
                ["Mobile Frontend", "React Native, Expo, AsyncStorage", "Resident complaint reporting and local status tracking"],
                ["Backend", "Node.js, Express.js, Prisma, bcrypt", "Authentication, complaint APIs, admin APIs, map APIs"],
                ["AI Service", "FastAPI, Pydantic, optional LangChain integration", "Complaint enrichment and social-post generation"],
                ["Persistence", "Prisma schema, PostgreSQL-ready models, mock store", "User and complaint storage"],
                ["Support Libraries", "Expo Image Picker, fetch, REST", "Media input and client-server communication"],
            ],
            [35 * mm, 60 * mm, 80 * mm],
        )
    )
    story.append(Paragraph("3.4 Use Case Diagrams / Data Flow Diagrams", styles["Heading2TNR"]))
    story.append(use_case_drawing())
    add_caption(story, "Figure 3.4.1: Use Case Diagram of UrbanEye")
    story.append(level0_dfd())
    add_caption(story, "Figure 3.4.2: Level 0 Data Flow Diagram")
    story.append(PageBreak())

    # Chapter 4
    story.append(Paragraph("CHAPTER 4: DESIGN AND ARCHITECTURE", styles["ChapterTNR"]))
    story.append(Paragraph("4.1 Structure Chart / Work Breakdown Structure", styles["Heading2TNR"]))
    story.append(wbs_drawing())
    add_caption(story, "Figure 4.1.1: Work Breakdown Structure")
    story.append(Paragraph("4.2 Explanation of Modules", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Module", "Description"],
                ["Authentication Module", "Handles user registration and login with hashed password verification and fallback compatibility."],
                ["Complaint Module", "Creates and retrieves complaint records with normalized response shapes for all clients."],
                ["AI Analysis Module", "Assigns category, priority, department, sentiment, suggested action, and public update text."],
                ["Administrative Analytics Module", "Aggregates totals, priority breakdowns, and department-wise complaint counts."],
                ["Map Hotspot Module", "Extracts location-oriented complaint summaries for map and locality views."],
                ["Mobile Tracking Module", "Improves resident complaint follow-up through filters, status cards, and saved preferences."],
            ],
            [55 * mm, 120 * mm],
        )
    )
    story.append(Paragraph("4.3 Flow Chart / Activity Diagram", styles["Heading2TNR"]))
    for p in [
        "The complaint activity flow begins when the resident opens the report interface and provides title, description, and location. After validation, the complaint is forwarded to the backend API. The backend invokes the AI service, enriches the complaint, and stores or returns a normalized complaint object. The resident then sees this complaint reflected in dashboard and detail views.",
        "A second internal activity concerns AI-assisted triage. In this path, the complaint text is analyzed through local keyword logic and optional language-model-based enhancement. The resulting metadata is then attached to the complaint record, which makes downstream status tracking and overview analytics much more meaningful.",
    ]:
        story.append(P(p))
    story.append(Paragraph("4.4 ER Diagram / Class Diagram", styles["Heading2TNR"]))
    story.append(er_drawing())
    add_caption(story, "Figure 4.4.1: ER Diagram")
    story.append(PageBreak())

    # Chapter 5
    story.append(Paragraph("CHAPTER 5: IMPLEMENTATION", styles["ChapterTNR"]))
    story.append(Paragraph("5.1 Screenshots and Interface Discussion", styles["Heading2TNR"]))
    for p in [
        "The web interface serves as the dashboard-oriented surface of UrbanEye. It contains the landing page, report panel, dashboard shell, complaint card views, map snapshot, and administrative summary. The design emphasizes quick visibility into complaint flow, totals, and recent issue distribution.",
        "The mobile interface focuses on direct resident experience. The home screen highlights quick actions and complaint counts, the dashboard presents solved versus open progress, the detail screen exposes complaint reasoning and suggestions, and the profile screen supports X-handle preference persistence.",
        "This split is intentional. The same complaint data is shaped differently depending on whether the user wants broad oversight or personal status tracking. The implementation therefore reflects both shared business logic and task-specific presentation logic.",
    ]:
        story.append(P(p))
    story.append(Paragraph("5.2 Source Code of Some Modules", styles["Heading2TNR"]))
    story.append(P("Selected excerpts are described in the main body, while the extended appendices contain much larger source listings from the real project files."))
    story.append(PageBreak())

    # Chapter 6
    story.append(Paragraph("CHAPTER 6: TESTING", styles["ChapterTNR"]))
    story.append(Paragraph("6.1 Testing Strategy", styles["Heading2TNR"]))
    for p in [
        "Testing was performed incrementally across service boundaries. The backend and AI layers were validated using syntax checks, route inspection, schema generation, and direct service invocation. The mobile application was validated through Expo bundling and status-flow verification. The web application was validated through Next.js development startup and view-level inspection.",
        "A major feature of the testing strategy was resilience verification. Because the project deliberately includes fallback flows for AI and persistence, tests also considered degraded operation scenarios. This approach was particularly useful in a development environment where not every external dependency is always active.",
    ]:
        story.append(P(p))
    story.append(
        section_table(
            [
                ["Test Case", "Action", "Expected Result", "Status"],
                ["User Registration", "Register with valid credentials", "User is created or safe fallback response is returned", "Passed"],
                ["Complaint Submission", "Send title, description, location", "Complaint is created with AI-enriched fields", "Passed"],
                ["Complaint Retrieval", "Fetch all complaints", "Normalized list returned", "Passed"],
                ["AI Classification", "Submit sanitation/road/water text", "Category and department mapped correctly", "Passed"],
                ["Mobile Status Filter", "Select Pending / In Progress / Solved", "Filtered complaint subsets displayed", "Passed"],
                ["Prisma Validation", "Run schema client generation", "Schema compiles successfully", "Passed"],
            ],
            [35 * mm, 50 * mm, 70 * mm, 20 * mm],
        )
    )
    story.append(PageBreak())

    # Chapter 7
    story.append(Paragraph("CHAPTER 7: SUMMARY AND CONCLUSION", styles["ChapterTNR"]))
    for title, paras in [
        ("7.1 Summary of Work Done", [
            "UrbanEye was developed as a multi-surface civic complaint platform integrating a web dashboard, mobile app, backend API, and AI microservice. The backend organizes complaint, auth, map, and admin routes. The AI service enriches complaints with routing intelligence and public update readiness. The mobile interface supports user-friendly status tracking, while the web interface supports broader monitoring and reporting workflows.",
            "The final system reflects a complete software engineering cycle: requirement analysis, architecture design, data modeling, implementation, fallback handling, testing, and document generation. It demonstrates applied use of both deterministic backend logic and AI-assisted processing within a real-world problem domain.",
        ]),
        ("7.2 Conclusion", [
            "The project successfully fulfills its central aim of building a more transparent and structured complaint resolution system. Rather than stopping at complaint submission, UrbanEye pushes the workflow forward into classification, routing, tracking, and communication support.",
            "Its most important contribution is the integration of these steps into one cohesive pipeline. This makes the project a meaningful example of full-stack civic-tech engineering and a strong foundation for further work in intelligent public service systems.",
        ]),
    ]:
        story.append(Paragraph(title, styles["Heading2TNR"]))
        for p in paras:
            story.append(P(p))
    story.append(PageBreak())

    # Chapter 8
    story.append(Paragraph("CHAPTER 8: LIMITATIONS OF THE PROJECT AND FUTURE WORK", styles["ChapterTNR"]))
    story.append(Paragraph("8.1 Limitations of the Project", styles["Heading2TNR"]))
    for item in [
        "The AI triage currently relies primarily on rule-based local analysis with optional LLM enhancement, rather than a domain-trained complaint model.",
        "The complaint state machine is simplified and does not yet represent the full chain of administrative field assignment and closure verification.",
        "Direct social publishing to X is not yet implemented even though X-ready text generation is available.",
        "The current hotspot view is simplified and not yet backed by full GIS rendering.",
        "Some workflows still include demo and fallback data for resilience during local development and demonstration.",
    ]:
        story.append(P(f"• {item}", "BodyTNR"))
    story.append(Paragraph("8.2 Future Work", styles["Heading2TNR"]))
    for item in [
        "Department-specific authority panels with approval and assignment workflows.",
        "Direct X publishing with human approval and audit trail.",
        "SMS, email, and push notification integration.",
        "Advanced map visualization with clustering and zone-based analytics.",
        "Historical complaint mining to train better priority and recurrence prediction models.",
        "Multilingual complaint submission and response workflows.",
        "Integration with municipal dashboards and official maintenance pipelines.",
    ]:
        story.append(P(f"• {item}", "BodyTNR"))
    story.append(PageBreak())

    story.append(Paragraph("BIBLIOGRAPHY", styles["ChapterTNR"]))
    for ref in [
        "Next.js Documentation, Vercel.",
        "React Documentation, Meta.",
        "Express.js Documentation.",
        "FastAPI Documentation.",
        "Prisma ORM Documentation.",
        "Expo Documentation.",
        "LangChain Documentation.",
        "PostgreSQL Documentation.",
        "General software engineering and systems analysis references used during project planning.",
    ]:
        story.append(P(ref))
    story.append(PageBreak())

    story.append(Paragraph("APPENDIX", styles["ChapterTNR"]))
    story.append(Paragraph("A. Important API Endpoints", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Method", "Endpoint", "Purpose"],
                ["POST", "/api/auth/register", "Register a new user"],
                ["POST", "/api/auth/login", "Login an existing user"],
                ["POST", "/api/complaints", "Create a complaint and attach AI analysis"],
                ["GET", "/api/complaints", "List complaints"],
                ["GET", "/api/complaints/:id", "Get complaint details"],
                ["GET", "/api/admin/overview", "Administrative statistics summary"],
                ["GET", "/api/admin/complaints", "Administrative complaint list"],
                ["GET", "/api/admin/users", "Administrative user list"],
                ["GET", "/api/map/hotspots", "Complaint hotspot information"],
                ["POST", "/analyze", "AI microservice complaint analysis"],
            ],
            [25 * mm, 55 * mm, 95 * mm],
        )
    )
    story.append(Paragraph("B. Stakeholder Analysis", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Stakeholder", "Description", "Relevance"],
                ["Citizen / Resident", "Primary user who files complaints and tracks progress", "Defines intake usability and transparency needs"],
                ["Authority / Admin", "Reviewer who monitors complaint flow and aggregates", "Defines dashboard and breakdown requirements"],
                ["Field Staff", "Potential future assignee for physical resolution", "Influences future workflow design"],
                ["System Maintainer", "Developer/operator maintaining services", "Needs modularity, fallbacks, and clear code structure"],
                ["Communication Team", "Would use generated public updates", "Motivates social post generation consistency"],
            ],
            [40 * mm, 70 * mm, 65 * mm],
        )
    )
    story.append(Paragraph("C. Requirements Traceability Matrix", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Requirement", "Description", "Mapped Implementation"],
                ["FR-1", "Authentication", "authRoutes, authcontroller, authService"],
                ["FR-2", "Complaint Submission", "ReportPanel, ReportScreen, complaintRoutes"],
                ["FR-3", "AI Analysis", "ai_service/app/main.py, social_agent.py, backend aiService"],
                ["FR-4", "Complaint Tracking", "DashboardScreen, ComplaintDetailScreen"],
                ["FR-5", "Admin Overview", "adminRoutes, adminController, DashboardShell"],
                ["FR-6", "Hotspot Support", "mapRoutes, mapController, MapComplaint"],
                ["FR-7", "Persistence", "Prisma schema, complaintController, AsyncStorage logic"],
                ["FR-8", "Fallback Operation", "mockStore, local analysis, local complaint cache"],
            ],
            [25 * mm, 55 * mm, 95 * mm],
        )
    )
    story.append(Paragraph("D. User Manual", styles["Heading2TNR"]))
    for p in [
        "<b>Web flow:</b> open landing page, navigate to dashboard, use report panel, observe complaint cards, and review administrative summaries.",
        "<b>Mobile flow:</b> log in, open report screen, submit complaint, monitor dashboard filters, inspect detail card, and save X-handle preference in profile.",
        "<b>Fallback behavior:</b> if the backend or AI service is unavailable, the system continues through local data and simplified complaint persistence so that the user journey remains demonstrable.",
    ]:
        story.append(P(p))
    story.append(Paragraph("E. Deployment Notes", styles["Heading2TNR"]))
    for p in [
        "The web application runs as a Next.js service, the backend API runs independently in Node/Express, and the AI service runs in FastAPI. This loose coupling simplifies deployment and testing.",
        "A production deployment would ideally use durable PostgreSQL persistence, environment-managed API endpoints, and protected access between backend and AI service boundaries. The present structure already supports this transition.",
    ]:
        story.append(P(p))

    story.append(Paragraph("F. Detailed Module Discussion", styles["Heading2TNR"]))
    for p in [
        "The authentication module is responsible for the first trust boundary of the system. It validates user credentials, hashes passwords, normalizes role information, and provides a clean identity object that other services can consume. Even in fallback mode, the design intention remains the same: every later stage of the application should understand whether the actor is a resident or an administrative user, because complaint visibility and action scope differ across these roles.",
        "The complaint module is the operational center of the application. It receives user-provided issue details, coordinates with the AI service, normalizes the resulting payload, and persists or returns a complaint object that is intelligible to all clients. This module was written to avoid thin-pass-through behavior. Instead, it explicitly shapes the complaint into a richer record containing category, priority, department, suggested action, and social summary information whenever available.",
        "The administrative analytics module translates raw complaint records into decision-friendly aggregates. The importance of this module lies not only in counting total complaints but also in exposing the texture of complaint activity: which categories dominate, which departments appear overloaded, and whether complaint closure is improving over time. In a real public-service setting, this level of interpretation is what allows administrators to shift from reactive handling toward planned intervention.",
        "The AI module plays a supporting but strategically important role. It does not replace the complaint system; rather, it reduces ambiguity around complaint content. A short user message such as 'street light not working near park road for three days' may be easy for a human to understand, but difficult to analyze consistently at scale. The AI stage converts such text into structured signals that make reporting, routing, and public communication more systematic.",
        "The mobile tracking module demonstrates a different type of design priority. Unlike the dashboard-oriented web app, the mobile app is shaped around reassurance and immediacy. A citizen checking the app wants to know whether the complaint has been received, whether it is moving, and whether it has been solved. The interface therefore emphasizes status cards, category chips, and solved-versus-open summaries more strongly than administrative density.",
        "The reporting and communication module is forward-looking in nature. The generated X-ready post is not just a cosmetic addition. It represents an attempt to bridge the gap between internal complaint handling and outward-facing accountability. In future civic deployments, such a feature could support communication teams, auto-drafted ward-level updates, or supervised public-resolution announcements while maintaining human approval at the final stage.",
    ]:
        story.append(P(p))

    story.append(Paragraph("G. Detailed Workflow Narratives", styles["Heading2TNR"]))
    workflow_sections = [
        (
            "G.1 Complaint Submission Workflow",
            [
                "The complaint submission workflow begins when the user opens the reporting surface, either on the mobile device or through the web application. The form requests the issue title, a concise but descriptive summary, and a location reference. In practical civic scenarios, clarity at this stage is essential because the quality of every downstream action depends on the specificity of the initial description.",
                "Once submitted, the frontend prepares a structured request for the backend. The backend then validates the payload and ensures that the essential information has been provided. If the complaint is acceptable, the system proceeds to enrichment. This stage is important because it converts an otherwise generic issue message into a complaint record that is analytically meaningful.",
                "The AI service interprets the text, infers the most likely complaint category, assigns a likely department, estimates urgency, and proposes an action note. The backend then merges these fields into the complaint object. At this point the complaint becomes more than a message: it becomes a managed item within the complaint lifecycle.",
                "Finally, the complaint is returned to the user-facing application in a normalized format. The user sees the issue reflected in the dashboard, detail screen, or complaint list, which immediately reinforces the sense that the complaint has entered a real process rather than disappearing into an opaque system.",
            ],
        ),
        (
            "G.2 Dashboard Monitoring Workflow",
            [
                "The monitoring workflow begins after complaints exist in the system. Here the goals differ for residents and administrators. Residents mainly need personal transparency: what complaints have they filed, which ones are pending, which ones are actively moving, and which ones are marked solved. Administrators need operational transparency across the larger complaint pool.",
                "On the web dashboard, complaints are presented through aggregates and distribution-oriented summaries. Totals, category patterns, and administrative views help transform isolated complaint records into actionable management information. This is especially important when complaint volume grows, because manual scanning becomes less effective than structured overview panels.",
                "On mobile, the dashboard is more intimate. The resident is not examining the citywide complaint graph; instead, the resident is checking whether progress is visible. This explains why solved progress, filters, and detail cards occupy a central role in the mobile interface design.",
            ],
        ),
        (
            "G.3 Fallback and Resilience Workflow",
            [
                "A distinctive design choice in UrbanEye is its ability to degrade gracefully. In academic and early-deployment settings, not every service remains available at all times. The backend may run before the database is ready, the AI service may be offline, or the mobile device may briefly operate without stable connectivity. Instead of allowing the application experience to collapse, the project uses fallback logic to preserve continuity.",
                "When the AI layer is unavailable, a simplified local analysis can still infer reasonable complaint metadata from keywords and structured heuristics. When durable persistence is unavailable, the application can continue in demo-compatible or locally cached modes. This resilience strategy is academically valuable because it demonstrates fault-tolerant thinking rather than assuming an ideal infrastructure environment.",
                "The fallback workflow therefore serves two purposes. It improves the demonstrability of the project during development and evaluation, and it also models an engineering mindset that prioritizes continuity of user experience even under imperfect operating conditions.",
            ],
        ),
    ]
    for title, paras in workflow_sections:
        story.append(Paragraph(title, styles["Heading3TNR"]))
        for p in paras:
            story.append(P(p))

    story.append(Paragraph("H. Security, Privacy, and Ethical Considerations", styles["Heading2TNR"]))
    for p in [
        "Although UrbanEye is developed as an academic project, security and privacy remain important considerations. Complaint systems can contain personally identifying information, sensitive location details, and emotionally charged user statements. Even when the project runs in local or demonstration mode, its architecture should model responsible handling of such information.",
        "Authentication is the first measure in this direction. Credentials are not intended to be stored in plain form, and user-specific complaint views are conceptually separated from administrative overviews. In a real deployment, this separation would need stronger access control, audit trails, rate limiting, and secure secret management, but the project already reflects the foundational idea that role boundaries matter.",
        "Privacy is equally relevant when integrating AI. A complaint may contain names, landmarks, or locally sensitive context. An ethical AI-assisted complaint platform should minimize unnecessary data sharing, avoid overconfident classification, and make it clear that automated suggestion is a support mechanism rather than a final administrative judgment.",
        "The social-post generation feature also carries ethical implications. Public communication about civic issues must be accurate, respectful, and accountable. For this reason, the project is intentionally positioned around X-ready drafting rather than unsupervised public posting. Human review remains the appropriate final checkpoint.",
        "Bias and uneven representation must also be acknowledged. A complaint classification system may perform differently across writing styles, languages, and neighborhoods. Future development should therefore include multilingual support, feedback loops, and dataset-aware validation so that automation improves fairness instead of reproducing imbalance.",
    ]:
        story.append(P(p))

    story.append(Paragraph("I. Risk Analysis and Mitigation", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Risk", "Possible Effect", "Mitigation Strategy"],
                ["Incorrect AI categorization", "Complaint may be routed to the wrong department", "Retain editable review path and fallback heuristics"],
                ["Database unavailability", "Complaint persistence may fail during submission", "Use mock store and local fallback during degraded operation"],
                ["Weak internet on mobile", "User may lose confidence in submission", "Persist local complaint cache and show local status views"],
                ["Role misuse", "Administrative data may be exposed incorrectly", "Enforce role checks and strengthen authentication flows"],
                ["Manual workload growth", "Admin dashboards may become cluttered with volume", "Introduce filters, breakdowns, and future assignment workflows"],
                ["Public communication mistakes", "Generated messages may be misused if posted directly", "Keep human approval before any future X publication"],
            ],
            [45 * mm, 70 * mm, 65 * mm],
        )
    )

    story.append(Paragraph("J. Sample Complaint Scenarios", styles["Heading2TNR"]))
    scenario_text = [
        "Scenario 1 concerns an overflowing garbage point near a residential lane. A resident reports the issue through the mobile application, describing foul smell, visual spillover, and repeated non-collection over two days. The AI service classifies the complaint under sanitation, marks the urgency as medium to high depending on the wording, and maps it toward the sanitation or municipal waste department. On the dashboard, the complaint contributes to sanitation counts and becomes visible as part of environmental maintenance workload.",
        "Scenario 2 concerns a road pothole near a school crossing. The complaint text emphasizes danger to two-wheelers and school traffic. In this case the AI layer identifies a roads-related problem, increases urgency due to safety language, and suggests a civil works or roads department routing. The generated public update summary can help authorities prepare a short official communication acknowledging the road hazard and intended inspection.",
        "Scenario 3 involves a faulty streetlight on a low-visibility road section. The system interprets this as an electricity or maintenance issue. Because the complaint touches nighttime safety, the priority may escalate beyond a routine maintenance category. For the resident, the most important effect is that the complaint does not remain a generic text item; it is visibly assigned to a category and progress state that can be checked later.",
        "Scenario 4 covers a water leakage complaint near a market area. Here the project demonstrates how complaint categorization helps analytics as well as routing. Individual water complaints can later aggregate into hotspot-level patterns, allowing municipal authorities to detect that a given locality experiences recurring utility failures rather than isolated incidents.",
        "These scenarios illustrate a central principle of UrbanEye: complaint systems become more valuable when they convert narrative reports into structured, traceable, and decision-supporting records. The resident receives clarity, and the authority receives order.",
    ]
    for p in scenario_text:
        story.append(P(p))

    story.append(Paragraph("K. Maintenance and Future Deployment Strategy", styles["Heading2TNR"]))
    for p in [
        "A sustainable project must be maintainable beyond the demonstration phase. UrbanEye was therefore structured as separate but cooperating services: web frontend, mobile frontend, backend API, and AI microservice. This modularity allows individual layers to be improved, replaced, or redeployed without requiring the entire system to be rewritten.",
        "From a deployment perspective, the first major transition would be movement from mixed local storage patterns into fully managed persistence. The Prisma schema already provides a path toward proper PostgreSQL-backed records. Once connected to a production database, complaint histories, administrative views, and user-specific reporting would become more durable and auditable.",
        "The second deployment maturity step would be introduction of operational observability. Logs, analytics, request tracing, and health checks would allow maintainers to detect failing routes, AI-response delays, or complaint bottlenecks more quickly. This is particularly important in a civic system where responsiveness shapes public trust.",
        "The third step would be integration with supervised external communication and notification systems. Rather than merely generating a post draft, the system could support approval-based publishing, resident notifications, and department-specific escalation rules. Such additions would convert the present academic prototype into a stronger civic operations platform.",
    ]:
        story.append(P(p))

    story.append(Paragraph("L. Glossary of Important Terms", styles["Heading2TNR"]))
    story.append(
        section_table(
            [
                ["Term", "Meaning in the Context of this Project"],
                ["Complaint Lifecycle", "The sequence from complaint submission to tracking, action, and closure."],
                ["AI Enrichment", "The process of adding structured fields such as category and priority to complaint text."],
                ["Fallback Mode", "A degraded but usable system mode when a dependency is unavailable."],
                ["Dashboard", "A summary-oriented interface used for monitoring complaint information."],
                ["Hotspot", "A location or locality with a concentration of complaint activity."],
                ["Social Post", "A concise X-ready summary generated from complaint details for communication support."],
            ],
            [45 * mm, 130 * mm],
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("M. Selected Source Code Listings", styles["Heading2TNR"]))
    for title, rel_path in CODE_FILES:
        for flowable in code_listing(title, rel_path):
            story.append(flowable)
    return story


def main():
    REPORT_DIR.mkdir(exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=24 * mm,
        rightMargin=22 * mm,
        topMargin=30 * mm,
        bottomMargin=22 * mm,
        title="UrbanEye Major Project Dissertation Report",
    )
    story = story_content()
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
