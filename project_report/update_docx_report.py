import sys
from pathlib import Path

sys.path.insert(0, "/private/tmp/urbaneye_docx_deps")

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.shared import Inches, Pt


DOC_PATH = Path("/Users/alokranjan/Desktop/major/project_report/UrbanEye_Report_Working.docx")


def delete_paragraph(paragraph):
    element = paragraph._element
    element.getparent().remove(element)
    paragraph._p = paragraph._element = None


def set_run_font(run, size=12, bold=None, italic=None, name="Times New Roman"):
    run.font.name = name
    run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def style_all_runs(paragraph, size=12, bold=None, italic=None, name="Times New Roman"):
    for run in paragraph.runs:
        set_run_font(run, size=size, bold=bold, italic=italic, name=name)


def add_para(doc, text="", style="normal", bold=False, italic=False, align=None, space_after=0):
    paragraph = doc.add_paragraph(style=style)
    if text:
        run = paragraph.add_run(text)
        set_run_font(run, size=12, bold=bold, italic=italic)
    if align is not None:
        paragraph.alignment = align
    paragraph.paragraph_format.space_after = Pt(space_after)
    return paragraph


def add_bullets(doc, items):
    for item in items:
        add_para(doc, f"• {item}", style="normal")


def add_heading(doc, text, level=2):
    style = "Heading 1" if level == 1 else "Heading 2" if level == 2 else "Heading 3"
    paragraph = doc.add_paragraph(style=style)
    run = paragraph.add_run(text)
    set_run_font(run, size=12, bold=True)
    if level == 1:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    return paragraph


def add_caption(doc, text):
    paragraph = add_para(doc, text, style="Heading 3", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
    style_all_runs(paragraph, size=12, bold=False, italic=True)
    return paragraph


def add_code_block(doc, title, code):
    add_para(doc, title, style="Heading 3", bold=True)
    for line in code.strip("\n").splitlines():
        paragraph = doc.add_paragraph(style="normal")
        paragraph.paragraph_format.left_indent = Inches(0.35)
        run = paragraph.add_run(line.rstrip())
        set_run_font(run, size=10, name="Courier New")


def add_table(doc, rows):
    table = doc.add_table(rows=len(rows), cols=len(rows[0]))
    try:
        table.style = "Table Grid"
    except KeyError:
        pass
    for row_index, row in enumerate(rows):
        for col_index, value in enumerate(row):
            cell = table.cell(row_index, col_index)
            cell.text = ""
            paragraph = cell.paragraphs[0]
            run = paragraph.add_run(str(value))
            set_run_font(run, size=12, bold=row_index == 0)
    return table


def insert_list_entries_before(paragraph, entries):
    for entry in reversed(entries):
        inserted = paragraph.insert_paragraph_before(entry, style="normal")
        style_all_runs(inserted, size=12)


def build_front_lists(doc):
    figure_anchor = next(p for p in doc.paragraphs if p.text.strip() == "LIST OF TABLES")
    table_anchor = next(p for p in doc.paragraphs if p.text.strip() == "TABLE OF CONTENTS")
    insert_list_entries_before(
        table_anchor,
        [
            "Table 1.1: Strategic Objectives of UrbanEye",
            "Table 3.1.1: Core Functional Requirements",
            "Table 3.1.2: Non-Functional Requirement Summary",
            "Table 3.3.1: Development Stack Used in UrbanEye",
            "Table 4.4.1: Core Data Entities and Attributes",
            "Table 6.1: Representative Functional Test Cases",
            "Table 6.2: Selected API Validation Results",
            "Table 8.1: Project Limitations and Future Resolution Path",
        ],
    )
    insert_list_entries_before(
        figure_anchor,
        [
            "Figure 1.1: Domains Integration in UrbanEye",
            "Figure 3.4.1: Use Case Diagram of UrbanEye",
            "Figure 3.4.2: Level 0 Data Flow Diagram",
            "Figure 4.1.1: Work Breakdown Structure of UrbanEye",
            "Figure 4.3.1: Activity Flow of Complaint Submission and Tracking",
            "Figure 4.4.1: Entity Relationship View of Complaint Data",
            "Figure 5.1.1: Citizen Complaint Dashboard",
            "Figure 5.1.2: Mobile Complaint Status Screen",
            "Figure 5.1.3: Administrative Complaint Overview",
        ],
    )


def update_toc(doc):
    replacements = {
        91: "2.1 Problem Definition",
        92: "2.2 Objectives",
        94: "3.1 Software Requirement Specifications",
        95: "3.1.1 Functional Requirements of the Project",
        96: "3.1.2 Non-functional Requirements of the Project",
        97: "3.2 Feasibility Study of the Project",
        98: "3.3 Tools / Technologies / Platform Used",
        99: "3.4 Use Case Diagrams / Data Flow Diagrams",
        100: "Chapter 4: Design and Architecture\t48-68",
        101: "4.1 Structure Chart / Work Breakdown Structure",
        102: "4.2 Explanation of Modules",
        103: "4.3 Flow Chart / Activity Diagram",
        104: "4.4 ER Diagram / Class Diagram",
        105: "Chapter 5: Implementation\t69-86",
        106: "5.1 Screenshots and Interface Walkthrough",
        107: "5.2 Source Code of Important Modules",
        108: "Chapter 6: Testing\t87-96",
        109: "Chapter 7: Summary and Conclusion\t97-100",
        110: "Chapter 8: Limitation of the Project and Future Work\t101-106",
        111: "Bibliography\t107-109",
    }
    for index, text in replacements.items():
        doc.paragraphs[index].text = text
        style_all_runs(doc.paragraphs[index], size=12)


def normalize_styles(doc):
    for style_name in ["normal", "Heading 1", "Heading 2", "Heading 3", "Title", "Subtitle"]:
        style = doc.styles[style_name]
        style.font.name = "Times New Roman"
        style.font.size = Pt(12)
    for paragraph in doc.paragraphs:
        style_all_runs(paragraph, size=12)


def cleanup_existing_front_content(doc):
    replacements = {
        "What Problem Does UrbanEye  Solve?": "What Problem Does UrbanEye Solve?",
        ": Problem Definition": "2.1 Problem Definition",
        "Typical complaint examples include:overflowing garbage ,broken streetlights,water leakage,potholes and road damage,drainage blockage.": "Typical complaint examples include overflowing garbage, broken streetlights, water leakage, potholes and road damage, and drainage blockage.",
        "For citizens : complaint submission becomes easier,tracking becomes clearer,the system feels more transparent.": "For citizens, complaint submission becomes easier, tracking becomes clearer, and the system feels more transparent.",
        "For authorities: complaints become structured,triage effort is reduced ,dashboard,visibility improves,complaint communication becomes more consistent": "For authorities, complaints become structured, triage effort is reduced, dashboard visibility improves, and complaint communication becomes more consistent.",
        "Because the process is spread across multiple disconnected channels": "Because the process is spread across multiple disconnected channels, several problems appear at the same time.",
        "Problem 2:": "Problem 2: Disconnected Complaint Reporting from Resolution Visibility",
        "Because of this, users do not understand where their complaint stands. No Integrated Interpretation Layer.": "Because of this, users do not understand where their complaint stands. Another issue is the lack of an integrated interpretation layer.",
    }
    for paragraph in doc.paragraphs:
        cleaned = paragraph.text.strip()
        if cleaned in replacements:
            paragraph.text = replacements[cleaned]
            style_all_runs(paragraph, size=12)


def remove_old_tail(doc, start_index):
    for idx in range(len(doc.paragraphs) - 1, start_index - 1, -1):
        delete_paragraph(doc.paragraphs[idx])


def add_figure_block(doc, caption, description, steps):
    add_caption(doc, caption)
    add_para(doc, description, style="normal")
    add_bullets(doc, steps)
    add_para(
        doc,
        "This figure can be converted into a clean flow diagram, UML drawing, or departmental chart without changing the written explanation.",
        style="normal",
    )


def add_analysis_chapter(doc):
    add_heading(doc, "CHAPTER 3: ANALYSIS", level=1)
    add_heading(doc, "3.1 Software Requirement Specifications (SRS)", level=2)
    add_para(
        doc,
        "The Software Requirement Specification defines what UrbanEye must do, how the system should behave under different conditions, and which quality expectations must be maintained during development and deployment. In this project, the SRS was especially important because UrbanEye is not a single-screen prototype. It is a multi-surface platform that connects a web application, a mobile application, a backend API, and a FastAPI-based AI service into one complaint-handling workflow.",
    )
    add_para(
        doc,
        "From an academic point of view, the SRS also helped convert broad ideas such as complaint transparency and AI-assisted triage into measurable system behavior. Instead of describing the platform only at a conceptual level, the SRS organizes the project into specific user actions, service responsibilities, reliability expectations, performance targets, and operational constraints. This allows the system to be evaluated in a disciplined way.",
    )

    add_heading(doc, "3.1.1 Functional Requirements of the Project", level=2)
    add_para(
        doc,
        "Functional requirements specify what the system must do. In UrbanEye, the most important functional requirements cover complaint intake, structured AI enrichment, dashboard-based status tracking, administrative visibility, public-update drafting, and reliable fallback behavior.",
    )
    add_table(
        doc,
        [
            ["Requirement ID", "Requirement", "Description"],
            ["FR-1", "Complaint Submission", "The system shall allow a citizen to submit a complaint with title, description, location, and optional image data."],
            ["FR-2", "Complaint Analysis", "The AI service shall generate complaint category, priority, department, sentiment, suggested action, and X-ready public update text."],
            ["FR-3", "Complaint Storage", "The backend shall persist the complaint and return a normalized complaint object for later retrieval and tracking."],
            ["FR-4", "Status Tracking", "The user shall be able to see complaint status as pending, in progress, or resolved through dashboard and detail views."],
            ["FR-5", "Administrative Overview", "The system shall provide complaint summaries, counts, and monitoring views for administrators."],
            ["FR-6", "Location Visibility", "The system shall support locality-oriented complaint visualization for hotspot-style monitoring."],
            ["FR-7", "X Account Preference", "The mobile application shall allow the user to save an X handle for public communication readiness."],
            ["FR-8", "Fallback Support", "The platform shall continue in degraded mode when selected services are unavailable."],
        ],
    )
    add_para(
        doc,
        "Each requirement contributes to the main project goal: a complaint should not disappear after submission. UrbanEye therefore treats complaint creation as the start of a visible workflow rather than the end of user interaction.",
    )

    add_heading(doc, "FR-1: Complaint Submission and Retrieval", level=3)
    add_para(
        doc,
        "UrbanEye must allow users to report public issues from both the web and mobile interfaces. The user provides the title, description, and location of the issue. Optional image support is included for richer reporting. Once a complaint is submitted, it should become visible in the dashboard, complaint list, and detail views without requiring manual refresh from multiple disconnected systems.",
    )
    add_bullets(
        doc,
        [
            "Validate mandatory complaint fields before submission.",
            "Accept optional location coordinates and image data wherever available.",
            "Store the complaint in a normalized structure.",
            "Return the complaint in a dashboard-friendly response shape.",
            "Preserve locally created complaints when fallback mode is active.",
        ],
    )

    add_heading(doc, "FR-2: AI-Assisted Complaint Enrichment", level=3)
    add_para(
        doc,
        "The central functional differentiator of UrbanEye is that the system enriches plain complaint text with useful structure. The AI layer does not attempt to replace municipal decision-making. Instead, it reduces ambiguity by assigning likely category, estimated priority, expected department, sentiment, suggested action, and a concise public-update draft.",
    )
    add_para(
        doc,
        "This requirement is valuable in practical civic workflows because most users describe issues in informal language. A sentence such as 'water is leaking near the bus stop and people are slipping' becomes more actionable when the system interprets it as a high-priority water-related issue for the relevant department. The present implementation uses a deterministic FastAPI analysis flow with keyword-guided logic and social-post generation, which makes the behavior explainable and demonstration-ready.",
    )

    add_heading(doc, "FR-3: Dashboard and Monitoring Requirements", level=3)
    add_para(
        doc,
        "The dashboard is responsible for restoring visibility after submission. Citizens should be able to understand whether a complaint is pending, in progress, or resolved. Administrators should be able to review complaint volumes, issue types, departments, and patterns. The mobile and web experiences are intentionally different in emphasis: the mobile side is more personal and status-oriented, while the web side provides broader complaint visibility and operational summaries.",
    )

    add_heading(doc, "FR-4: Public Communication Readiness", level=3)
    add_para(
        doc,
        "UrbanEye currently generates an X-ready public update from complaint data. This is an important requirement even though live posting is not yet automated in the final workflow. It ensures that the system can summarize a complaint in short, clear public language and prepares the project for future supervised escalation features.",
    )

    add_heading(doc, "FR-5: Reliability and Fallback Operation", level=3)
    add_para(
        doc,
        "Because the project is intended for academic demonstration as well as future extension, the system must remain usable even when a dependency is temporarily unavailable. UrbanEye therefore uses mock-backed continuity on the backend and local persistence on the mobile side. This keeps the complaint-tracking experience intact during development, testing, and live demonstrations.",
    )

    add_heading(doc, "3.1.2 Non-functional Requirements of the Project", level=2)
    add_para(
        doc,
        "Non-functional requirements describe how the system should behave rather than what it should do. In UrbanEye, these requirements are especially important because complaint systems depend on trust. If the platform is slow, unclear, inaccessible, or brittle, users lose confidence even when the core features technically exist.",
    )
    add_table(
        doc,
        [
            ["Category", "Requirement Focus", "Expected Outcome"],
            ["Performance", "Fast complaint submission, dashboard refresh, and AI analysis", "The platform feels responsive during reporting and tracking."],
            ["Scalability", "Graceful behavior under higher complaint volume and simultaneous access", "The system remains usable as adoption grows."],
            ["Usability", "Simple layouts, readable screens, and predictable status labels", "Citizens understand the complaint flow without training."],
            ["Accessibility", "Readable contrast, keyboard support, and clear labels", "The platform supports inclusive access."],
            ["Reliability", "Fallback logic and low failure impact", "The system does not collapse when one service is unavailable."],
            ["Maintainability", "Modular architecture and separated services", "Future development remains manageable."],
        ],
    )
    add_heading(doc, "Performance Requirements", level=3)
    add_para(
        doc,
        "UrbanEye must keep response time low during major user actions such as opening the dashboard, loading complaint history, creating complaints, and requesting AI analysis. Complaint submission should complete within a few seconds under normal conditions, while list refresh and detail retrieval should remain close to real time for a civic information system. The current target is to keep dashboard refresh within roughly two to three seconds and AI-assisted enrichment within one to three seconds under ordinary demonstration load.",
    )
    add_heading(doc, "Throughput and Scalability", level=3)
    add_para(
        doc,
        "The platform should be able to handle rising complaint volume without losing usability. For an academic prototype, the realistic goal is not city-wide scale on day one, but a design that can grow. UrbanEye supports this by separating the web application, mobile application, backend API, and AI service into independent layers. The architecture makes it easier to scale read-heavy dashboard traffic separately from AI analysis traffic or mobile complaint creation workloads.",
    )
    add_heading(doc, "Usability and Accessibility", level=3)
    add_para(
        doc,
        "The project must remain understandable for a broad audience. Complaint systems are used by people with different levels of technical comfort, language confidence, and device quality. Therefore, the interface should favor direct wording, large enough touch targets, visible complaint states, and layouts that avoid crowding. Accessibility expectations are aligned with inclusive design principles such as readable contrast, descriptive labels, and predictable interaction patterns.",
    )
    add_heading(doc, "Reliability and Maintainability", level=3)
    add_para(
        doc,
        "Reliability is addressed through fallback behavior, local complaint persistence, and normalized complaint shapes. Maintainability is achieved through modular separation between frontend components, backend controllers, database schema, and AI-service logic. This separation is important because the project is likely to evolve through later additions such as multilingual support, image analysis, and direct social API publishing.",
    )

    add_heading(doc, "3.2 Feasibility Study of the Project", level=2)
    add_para(
        doc,
        "A feasibility study examines whether a proposed system can be built and operated within the available technical, economic, operational, legal, and academic constraints. UrbanEye was planned as a major project, so feasibility had to be judged not only from an ideal production perspective but also from what could realistically be implemented, demonstrated, and evaluated within student project limits.",
    )
    add_heading(doc, "Technical Feasibility", level=3)
    add_para(
        doc,
        "UrbanEye is technically feasible because the selected stack is practical, well documented, and modular. The web application uses Next.js and React, the mobile application uses React Native with Expo, the backend uses Node.js with Express, and the AI module uses FastAPI. These technologies are mature enough for project work, flexible enough for integration, and lightweight enough for student-managed deployment and testing.",
    )
    add_para(
        doc,
        "The codebase also demonstrates that the system can be operated with fallback behavior when every service is not fully available. This is a strong sign of technical feasibility because the project does not depend on a fragile all-or-nothing execution path.",
    )
    add_heading(doc, "Economic Feasibility", level=3)
    add_para(
        doc,
        "The project is economically feasible because its prototype version can be developed using open-source tools, student-accessible hosting options, and moderate hardware requirements. Most frameworks used in the project are free, and early deployment can be managed on low-cost cloud or managed platforms. This keeps the barrier to experimentation low while still leaving room for future scaling.",
    )
    add_heading(doc, "Operational Feasibility", level=3)
    add_para(
        doc,
        "Operationally, UrbanEye is feasible because its workflow matches how users already think about complaints. Residents do not want to learn a complex enterprise system; they want to report an issue quickly and understand whether progress is happening. UrbanEye fits this expectation by emphasizing a short complaint form, AI-assisted structure, and visible tracking. The administrative side also benefits because structured complaint records are easier to summarize and review than raw text alone.",
    )
    add_heading(doc, "Schedule Feasibility", level=3)
    add_para(
        doc,
        "From a schedule standpoint, the project is feasible because it can be built incrementally. The complaint workflow can be demonstrated even before advanced features are complete. For example, complaint submission, AI enrichment, status tracking, and mobile persistence can be implemented first, while advanced mapping, posting automation, and richer analytics can be layered on later. This incremental nature makes the project well suited to a semester-based development cycle.",
    )
    add_heading(doc, "Legal and Ethical Feasibility", level=3)
    add_para(
        doc,
        "The project is also feasible from a governance standpoint if privacy and responsible communication are handled carefully. Complaint data may include location details, user descriptions, and sometimes images. For that reason, public-post drafting must avoid exposing more information than necessary, and later production deployment would need stronger privacy controls, moderation rules, and auditability. The present academic implementation is suitable for controlled evaluation and responsible demonstration.",
    )

    add_heading(doc, "3.3 Tools / Technologies / Platform Used", level=2)
    add_para(
        doc,
        "UrbanEye has been built using a practical full-stack toolchain selected for modularity, readability, and ease of integration. The technology choices reflect both academic feasibility and future extensibility.",
    )
    add_table(
        doc,
        [
            ["Layer", "Technology", "Purpose in the Project"],
            ["Web Frontend", "Next.js, React, TypeScript, Tailwind CSS", "Used for the citizen-facing and admin-facing web interfaces, dashboards, and reporting views."],
            ["Mobile Frontend", "React Native, Expo, AsyncStorage", "Used for mobile complaint reporting, complaint tracking, and local persistence support."],
            ["Backend API", "Node.js, Express.js", "Handles complaint routes, admin routes, authentication, and service orchestration."],
            ["Database Layer", "Prisma with PostgreSQL-ready schema", "Provides structured persistence for complaint and user data when database mode is enabled."],
            ["AI Service", "FastAPI, Pydantic", "Analyzes complaint text and generates structured metadata and X-ready public updates."],
            ["Utility Services", "Redis/cache helpers, mock store, local fallback logic", "Improves performance, continuity, and resilience during development or degraded operation."],
        ],
    )
    add_para(
        doc,
        "The choice of JavaScript/TypeScript for web and backend, together with Python for the AI microservice, reflects a common engineering pattern. Frontend-heavy systems often benefit from a JavaScript ecosystem, while AI-related experimentation and API design are especially convenient in Python. UrbanEye uses this split effectively without making the integration too difficult to manage.",
    )

    add_heading(doc, "3.4 Use Case Diagrams / Data Flow Diagrams", level=2)
    add_para(
        doc,
        "The system analysis becomes clearer when the main interactions and movement of information are described visually. In the written dissertation, these diagrams help show how citizens, administrators, the backend, and the AI service cooperate in the complaint lifecycle.",
    )
    add_figure_block(
        doc,
        "Figure 3.4.1: Use Case Diagram of UrbanEye",
        "The use case view of UrbanEye is centered on two primary actors: the citizen user and the administrative user. The citizen reports complaints, views complaint status, opens complaint details, and optionally manages profile information such as the X handle. The administrative user reviews complaint distributions, monitors statuses, and studies complaint patterns for coordination and escalation.",
        [
            "Citizen registers or logs in to the system.",
            "Citizen submits a complaint with title, description, location, and optional image.",
            "AI service enriches the complaint before storage.",
            "Citizen tracks complaint status through dashboard and detail views.",
            "Administrator accesses complaint overview, category distribution, and status summaries.",
        ],
    )
    add_figure_block(
        doc,
        "Figure 3.4.2: Level 0 Data Flow Diagram",
        "The Level 0 data flow begins when the user submits complaint data from the web or mobile interface. The backend validates the request, forwards the complaint text to the AI service for analysis, receives structured metadata, persists the complaint, and returns a normalized record. Later, dashboard and administrative requests retrieve the stored complaint data for display and monitoring.",
        [
            "Input flows from user interfaces to the backend complaint controller.",
            "Structured complaint analysis flows between backend and AI service.",
            "Persistent data flows toward database or mock/local storage, depending on mode.",
            "Complaint lists, details, summaries, and map data flow back to users and administrators.",
        ],
    )


def add_design_chapter(doc):
    doc.add_page_break()
    add_heading(doc, "CHAPTER 4: DESIGN AND ARCHITECTURE", level=1)
    add_heading(doc, "4.1 Structure Chart / Work Breakdown Structure", level=2)
    add_para(
        doc,
        "The structure chart of UrbanEye reflects a layered civic-tech system in which presentation, application logic, storage, and AI enrichment remain connected but clearly separated. This separation was chosen to keep the project understandable, maintainable, and extensible. A user-facing complaint platform becomes difficult to improve when all responsibilities are tightly mixed, so the design intentionally divides the platform into major modules.",
    )
    add_figure_block(
        doc,
        "Figure 4.1.1: Work Breakdown Structure of UrbanEye",
        "The work breakdown structure divides the project into five major streams: interface design, mobile experience, backend services, AI enrichment, and documentation/testing. Each stream contains sub-tasks that could be developed, reviewed, and demonstrated independently while still contributing to one integrated platform.",
        [
            "Frontend layer: landing pages, reporting panels, complaint cards, and dashboards.",
            "Mobile layer: complaint tracker, complaint detail, X-handle profile, and local persistence.",
            "Backend layer: complaint routes, admin routes, validation, cache handling, and service orchestration.",
            "AI layer: complaint analysis, category detection, priority estimation, routing recommendation, and social-post drafting.",
            "Quality layer: testing, documentation, screenshots, performance checks, and future-readiness planning.",
        ],
    )

    add_heading(doc, "4.2 Explanation of Modules", level=2)
    add_heading(doc, "4.2.1 Web Application Module", level=3)
    add_para(
        doc,
        "The web application acts as the dashboard-oriented face of UrbanEye. It is designed for users who want quick visibility into complaint flow and for administrative review use cases. The landing section introduces the system, the dashboard page summarizes complaint activity, and auxiliary pages expose complaint lists, map visibility, authentication, and admin analytics. The web interface is especially useful when the goal is to review many complaint records together instead of only tracking one resident-facing issue at a time.",
    )
    add_heading(doc, "4.2.2 Mobile Application Module", level=3)
    add_para(
        doc,
        "The mobile module was designed around ease of reporting and personal complaint tracking. A resident typically uses the mobile screen to create a complaint quickly, review complaint status later, and manage lightweight settings such as the preferred X handle. This module emphasizes clarity and continuity. It also supports local persistence, which is important when the project is demonstrated in unstable network conditions.",
    )
    add_heading(doc, "4.2.3 Backend API Module", level=3)
    add_para(
        doc,
        "The backend API provides the application logic that holds the system together. It validates complaint input, calls the AI service, persists complaint data, serves complaint lists, exposes administrative summaries, and returns normalized complaint responses to clients. Because the backend concentrates the complaint lifecycle, it also becomes the right place for cache handling, fallback logic, and controlled data shaping.",
    )
    add_heading(doc, "4.2.4 AI Service Module", level=3)
    add_para(
        doc,
        "The AI service is intentionally separated from the main backend so that complaint analysis can evolve independently. In the current project state, the FastAPI service receives title, description, and location, applies deterministic category and priority logic, and returns structured metadata plus a concise X-ready public draft. This design keeps the AI layer understandable and replaceable while still giving the platform an intelligent triage component.",
    )
    add_heading(doc, "4.2.5 Data and Persistence Module", level=3)
    add_para(
        doc,
        "UrbanEye uses a layered persistence approach. When database support is configured, complaint data can be stored through the Prisma-backed schema. During local or fallback operation, mock and local storage paths keep the user journey intact. The mobile side also keeps complaint records in AsyncStorage so that newly created complaints remain visible even when the network path fails. This module is therefore not only about saving data, but also about preserving trust in the complaint lifecycle.",
    )

    add_heading(doc, "4.3 Flow Chart / Activity Diagram", level=2)
    add_figure_block(
        doc,
        "Figure 4.3.1: Activity Flow of Complaint Submission and Tracking",
        "The activity flow begins with complaint creation and ends with user-visible tracking. The process starts when the citizen submits the issue. The backend validates the input, forwards complaint text for AI enrichment, stores the result, and returns the final complaint record. Later, dashboard and complaint detail views fetch that stored record again, making complaint progress visible in a consistent format.",
        [
            "User opens reporting screen.",
            "User enters title, description, and location.",
            "System validates required fields.",
            "Backend requests AI enrichment.",
            "Complaint is stored in persistent or fallback storage.",
            "Complaint becomes visible in dashboard, cards, and detail views.",
        ],
    )
    add_para(
        doc,
        "This flow is important because it demonstrates that UrbanEye is not just a reporting form. The system keeps the complaint alive after submission by feeding it into tracking and monitoring views. That design decision is central to the overall project philosophy.",
    )

    add_heading(doc, "4.4 ER Diagram / Class Diagram", level=2)
    add_figure_block(
        doc,
        "Figure 4.4.1: Entity Relationship View of Complaint Data",
        "The core entity in UrbanEye is the complaint record. It is associated with user identity, complaint metadata, location data, status information, and AI-generated fields. This combination makes the complaint useful for both end-user visibility and backend-driven analysis. Even in the prototype stage, the complaint entity is richer than a plain text ticket because it stores both original content and interpreted fields.",
        [
            "User entity owns one or more complaint records.",
            "Complaint contains raw fields such as title, description, and location.",
            "Complaint also stores derived fields such as category, priority, department, and social post.",
            "Administrative views aggregate complaint entities by status, category, and locality.",
        ],
    )
    add_table(
        doc,
        [
            ["Entity", "Important Attributes", "Purpose"],
            ["User", "id, name, email, role, xHandle", "Represents the reporting or administrative identity interacting with the system."],
            ["Complaint", "id, title, description, location, status, category, priority, department, suggestedAction, socialPost, createdAt", "Stores the main complaint and all fields needed for tracking and triage."],
            ["Location Data", "latitude, longitude, address text", "Supports map-based and area-based complaint visibility."],
            ["Analysis Result", "sentiment, confidence, routing suggestion", "Captures structured interpretation returned by the AI service."],
        ],
    )


def add_implementation_chapter(doc):
    doc.add_page_break()
    add_heading(doc, "CHAPTER 5: IMPLEMENTATION", level=1)
    add_heading(doc, "5.1 Screenshots and Interface Walkthrough", level=2)
    add_para(
        doc,
        "This chapter explains how the UrbanEye interface appears in practical use. Where screenshots are inserted later, the following descriptions should remain because they explain what the reader should notice in each screen. This helps the report stay meaningful even when the visual layout changes slightly during final formatting.",
    )
    screenshot_sections = [
        (
            "Figure 5.1.1: Citizen Complaint Dashboard",
            "The main citizen dashboard introduces the complaint-monitoring experience. The page highlights total complaint activity, user-facing summaries, and accessible reporting entry points. Its purpose is not only to show data, but to reassure the user that complaint handling is visible and trackable.",
        ),
        (
            "Figure 5.1.2: Mobile Complaint Status Screen",
            "The mobile dashboard emphasizes personally relevant complaint states such as pending, in progress, and resolved. This screen is intentionally simpler than the web dashboard because a mobile user usually wants quick status visibility rather than a large operational overview.",
        ),
        (
            "Figure 5.1.3: Administrative Complaint Overview",
            "The admin-facing view presents a broader picture of complaint categories, complaint flow, and action-oriented summaries. This screen is designed to help reviewers understand where issues are accumulating and which kinds of complaints require attention.",
        ),
        (
            "Figure 5.1.4: Complaint Detail and Suggested Action View",
            "The complaint detail screen shows the value of AI enrichment clearly. Along with the original complaint text, the user can see category, priority, likely department, suggested action, and social-post draft. This is where the difference between a plain complaint form and a structured complaint workflow becomes easiest to understand.",
        ),
        (
            "Figure 5.1.5: Profile Screen with X Handle Preference",
            "The profile screen allows the user to save an X account handle. Even though the current project does not fully automate public posting, this screen demonstrates how the platform is being prepared for responsible communication support in later versions.",
        ),
        (
            "Figure 5.1.6: Map and Hotspot-Oriented Complaint View",
            "The map-oriented screen connects individual complaint records with locality-based visibility. This supports a richer understanding of repeated issues and helps explain how the platform could grow into a stronger decision-support system for urban administrators.",
        ),
    ]
    for caption, description in screenshot_sections:
        add_caption(doc, caption)
        add_para(doc, description)
        add_para(
            doc,
            "Suggested placement: insert the corresponding project screenshot here so that the visual and textual explanation stay together on the same page.",
            italic=True,
        )

    add_heading(doc, "5.2 Source Code of Important Modules", level=2)
    add_para(
        doc,
        "To demonstrate that UrbanEye is a real working project rather than a purely conceptual design, selected source code excerpts are included below. These excerpts highlight the complaint lifecycle, the AI analysis flow, and the fallback strategy used across the system.",
    )
    add_code_block(
        doc,
        "Listing 5.2.1: Complaint Creation Controller (Backend)",
        """export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, location, image, latitude, longitude } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required." });
    }

    const analysis = await analyzeComplaint({ title, description, location });
    // complaint persistence and normalized response follow here
  } catch (error) {
    return next(error);
  }
};""",
    )
    add_para(
        doc,
        "This controller excerpt shows the central backend role of validation and orchestration. The complaint is first validated, then enriched through the AI service, and finally stored in either persistent or fallback storage. This is the heart of the complaint workflow because it joins together raw input and structured output.",
    )
    add_code_block(
        doc,
        "Listing 5.2.2: AI Complaint Analysis Service (FastAPI)",
        """def analyze_locally(payload: ComplaintPayload) -> AnalysisResult:
    text = f"{payload.title} {payload.description} {payload.location}".lower()

    category = "General"
    department = "Civic Response Cell"
    priority = "MEDIUM"

    if keyword_match(text, ["garbage", "waste", "trash"]):
        category = "Sanitation"
        department = "Sanitation Department"
        priority = "HIGH"

    action = f"Route this complaint to {department} and request field validation."
    social = generate_social_post(...)
    return AnalysisResult(...)""",
    )
    add_para(
        doc,
        "This AI-service excerpt shows the current deterministic triage approach. It is intentionally transparent: the routing logic can be explained, tested, and improved without hidden behavior. For a major project, this is valuable because the system can demonstrate both practical AI use and traceable logic.",
    )
    add_code_block(
        doc,
        "Listing 5.2.3: Mobile Complaint Persistence Service",
        """export const createComplaint = async (payload) => {
  try {
    const res = await API.post("/complaints", payload);
    await persistComplaint(res.data);
    return res.data;
  } catch (error) {
    const complaint = {
      id: `demo-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      status: "PENDING",
    };
    await persistComplaint(complaint);
    return complaint;
  }
};""",
    )
    add_para(
        doc,
        "This excerpt is important because it demonstrates resilience. Even if the backend path fails temporarily, the mobile application still keeps the citizen’s complaint visible. That design choice improves the credibility of the app during unstable testing conditions and mirrors good user-centered engineering practice.",
    )
    add_code_block(
        doc,
        "Listing 5.2.4: Web Dashboard Entry Screen",
        """export default function DashboardPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:px-10">
        <section className="section-grid">
          <div className="glass-card rounded-[36px] p-8">
            <h1 className="mt-3 text-4xl font-semibold">Today's complaint flow at a glance</h1>
          </div>
          <Sidebar />
        </section>
        <DashboardShell />
      </main>
    </div>
  );
}""",
    )
    add_para(
        doc,
        "The dashboard implementation illustrates the web-side design philosophy. It combines operational summaries with complaint review components in a layout that feels more like an active civic workspace than a static form screen.",
    )
    add_heading(doc, "5.3 Implementation Discussion", level=2)
    add_para(
        doc,
        "A notable implementation strength of UrbanEye is that the AI layer complements application logic instead of replacing it. The backend remains responsible for validation, response shaping, caching, and persistence, while the AI service focuses on complaint interpretation. This keeps the architecture balanced. It also means later improvements, such as multilingual analysis or image-based classification, can be added without rewriting the full complaint lifecycle.",
    )
    add_para(
        doc,
        "Another important implementation choice is the use of graceful degradation. In many academic systems, the demonstration breaks if a single dependency is missing. UrbanEye avoids that by storing local complaints, returning mock-backed data when required, and using deterministic fallback analysis. This makes the project more believable as a platform intended for real use rather than only for ideal conditions.",
    )


def add_testing_chapter(doc):
    doc.add_page_break()
    add_heading(doc, "CHAPTER 6: TESTING", level=1)
    add_para(
        doc,
        "Testing in UrbanEye focused on the full complaint journey rather than isolated functions alone. The most important question was whether a complaint could move from user input to structured output and then reappear reliably in tracking views. Additional attention was given to fallback behavior, dashboard consistency, and the mobile complaint experience.",
    )
    add_heading(doc, "6.1 Testing Strategy", level=2)
    add_para(
        doc,
        "The project used a combination of manual testing, API-level verification, interface checks, and scenario-driven validation. Because UrbanEye spans web, mobile, backend, and AI-service layers, testing had to confirm not only local correctness but also coordination between modules.",
    )
    add_table(
        doc,
        [
            ["Test Case ID", "Objective", "Expected Result"],
            ["TC-1", "Submit complaint with valid fields", "Complaint is created successfully and visible in dashboard."],
            ["TC-2", "Submit complaint with missing required field", "Validation message is returned and complaint is not created."],
            ["TC-3", "AI analysis for sanitation-related complaint", "Category and department match the complaint context."],
            ["TC-4", "Open complaint detail screen", "Complaint metadata and status are shown consistently."],
            ["TC-5", "Switch to fallback complaint creation", "Complaint remains visible through local persistence."],
            ["TC-6", "View admin overview", "Aggregated counts and summaries load without structural error."],
        ],
    )
    add_heading(doc, "6.2 Functional Testing Discussion", level=2)
    add_para(
        doc,
        "Functional testing showed that the main complaint path behaves coherently. A complaint entered by the user receives structured interpretation from the AI service and is then returned to the interface with category, priority, department, and suggested action fields. This confirms that the project does more than store plain complaint text. It builds a richer complaint record that supports visibility and later action.",
    )
    add_heading(doc, "6.3 API and Service Validation", level=2)
    add_table(
        doc,
        [
            ["Endpoint / Service", "Purpose", "Observed Outcome"],
            ["/complaints POST", "Create and enrich complaint", "Returned structured complaint object with AI-generated fields."],
            ["/complaints GET", "Retrieve complaint list", "Returned complaint records in normalized order."],
            ["/complaints/:id GET", "Retrieve single complaint", "Returned requested complaint or meaningful not-found response."],
            ["/analyze POST", "AI triage service", "Returned category, priority, department, sentiment, suggested action, and social post."],
            ["Mobile local persistence", "Retain complaint when API fails", "Stored complaint locally and restored it correctly."],
        ],
    )
    add_heading(doc, "6.4 User Interface Testing", level=2)
    add_para(
        doc,
        "Interface testing focused on readability, status visibility, navigation flow, and consistency between screens. On the web side, the dashboard needed to make complaint flow understandable at a glance. On the mobile side, the complaint tracker, detail screen, and profile screen needed to remain simple enough for quick use. Status chips, complaint cards, and overview panels were checked for clarity and consistency.",
    )
    add_heading(doc, "6.5 Performance and Resilience Observations", level=2)
    add_para(
        doc,
        "UrbanEye was not benchmarked as a city-wide production system, but its complaint workflow was observed under repeated use and degraded conditions. The important result was that the application continued to function meaningfully even when ideal infrastructure assumptions were removed. This is especially evident in the mobile fallback path and the backend’s ability to normalize complaint responses even when database-backed persistence is not active.",
    )
    add_heading(doc, "6.6 Testing Outcome", level=2)
    add_para(
        doc,
        "Overall, the testing outcome supports the project objective. UrbanEye demonstrates a complete complaint workflow: complaint creation, AI enrichment, storage, dashboard visibility, and status tracking all function as connected stages. The testing phase also revealed a clear roadmap for improvement, particularly in richer map analytics, stronger production-grade persistence, and deeper multi-user validation.",
    )


def add_conclusion_chapter(doc):
    doc.add_page_break()
    add_heading(doc, "CHAPTER 7: SUMMARY AND CONCLUSION", level=1)
    add_heading(doc, "7.1 Project Summary", level=2)
    add_para(
        doc,
        "UrbanEye was developed as an integrated civic complaint resolution platform that combines web reporting, mobile tracking, backend orchestration, and AI-assisted complaint enrichment. The project addresses a visible public problem: complaints are easy to submit in many systems, but much harder to interpret, route, and track transparently afterward. UrbanEye responds to this gap by turning complaint submission into a structured workflow that continues after the initial form entry.",
    )
    add_para(
        doc,
        "The project demonstrates that even a moderately scoped academic system can meaningfully improve complaint clarity. When the system receives a complaint, it does not stop at storage. It enriches the record with category, priority, department, sentiment, suggested action, and X-ready public language. This makes the complaint more understandable to both the citizen and the reviewing authority.",
    )
    add_heading(doc, "7.2 Conclusion", level=2)
    add_para(
        doc,
        "The final outcome of this project is encouraging. UrbanEye shows that AI can be applied responsibly in civic-tech systems when it is embedded inside a complete complaint-handling flow rather than used as an isolated novelty feature. The strongest contribution of the project is not one screen or one model. It is the way complaint intake, AI analysis, persistence, status tracking, and public-message drafting are connected into one coherent lifecycle.",
    )
    add_para(
        doc,
        "From an engineering perspective, the project also succeeds because it remains modular and extensible. Each major layer can evolve independently without forcing a complete redesign. From a civic perspective, the project improves transparency by helping users see whether their complaint is pending, in progress, or resolved. This visible lifecycle is what gives the platform practical value beyond ordinary form-based reporting systems.",
    )
    add_para(
        doc,
        "In summary, UrbanEye fulfills its major objective of creating a smarter and more transparent complaint-resolution workflow. It stands as a strong B.Tech major project because it combines real software engineering, practical AI integration, user-interface design, and meaningful public-service relevance in one system.",
    )


def add_future_work_chapter(doc):
    doc.add_page_break()
    add_heading(doc, "CHAPTER 8: LIMITATION OF THE PROJECT AND FUTURE WORK", level=1)
    add_heading(doc, "8.1 Limitations of the Project", level=2)
    add_table(
        doc,
        [
            ["Limitation", "Current Impact", "Planned Improvement Direction"],
            ["Text-first AI analysis", "Complaint interpretation relies mainly on textual input.", "Add image-assisted issue understanding and richer complaint context."],
            ["No direct live X posting in final workflow", "The platform drafts public updates but does not fully automate live posting.", "Add supervised publishing with approval, retries, and audit tracking."],
            ["Prototype-scale persistence modes", "Fallback and demo modes are useful but not a replacement for large-scale deployment.", "Expand production-grade database usage and stronger operational controls."],
            ["Limited multilingual intelligence", "Complaint interpretation may miss local language nuance.", "Introduce multilingual parsing and broader training/evaluation."],
            ["Early-stage hotspot analytics", "Location visibility is present but not yet deeply predictive.", "Add density-aware prioritization and repeated-issue clustering."],
        ],
    )
    add_para(
        doc,
        "These limitations do not reduce the core value of the project, but they define the boundary between the current academic implementation and a larger public deployment. In other words, UrbanEye already demonstrates a meaningful workflow, yet it also leaves clear room for future technical and civic-tech expansion.",
    )
    add_heading(doc, "8.2 Future Work", level=2)
    add_para(
        doc,
        "Future work on UrbanEye can move in several directions. One strong path is the introduction of image-based civic issue understanding so that uploaded photos become part of the live triage pipeline rather than remaining optional evidence only. Another important direction is multilingual support, especially for complaint reporting in mixed English-Hindi or region-specific phrasing. A third path is the addition of direct but supervised X posting with approval and accountability safeguards.",
    )
    add_para(
        doc,
        "The project can also be strengthened through improved decision-support logic. Future versions may consider complaint density, repeated reports, department workload, and historical resolution time when assigning priority. This would move UrbanEye closer to a practical urban-analytics system rather than only a reporting interface.",
    )
    add_para(
        doc,
        "On the product side, future work may include stronger citizen notifications, escalation history, richer map visualizations, department dashboards, and analytics for repeated local breakdowns. With these additions, UrbanEye could grow from a strong academic prototype into a more comprehensive smart-city grievance-management platform.",
    )


def add_bibliography(doc):
    doc.add_page_break()
    add_heading(doc, "BIBLIOGRAPHY", level=1)
    references = [
        "Department of Administrative Reforms and Public Grievances, Government of India, CPGRAMS reports and grievance redressal material.",
        "FastAPI Documentation, official reference for Python API service development.",
        "Prisma Documentation, official reference for schema and ORM design.",
        "Next.js Documentation, official reference for React-based web application development.",
        "React Native and Expo Documentation, official references for mobile application development.",
        "Node.js and Express.js Documentation, official references for backend API development.",
        "World Wide Web Consortium (W3C), Web Content Accessibility Guidelines (WCAG) 2.1.",
        "Research articles and civic-tech studies on urban complaint systems, public accountability, and AI-assisted service routing.",
    ]
    for ref in references:
        add_para(doc, ref)


def main():
    doc = Document(str(DOC_PATH))
    normalize_styles(doc)
    cleanup_existing_front_content(doc)
    update_toc(doc)
    build_front_lists(doc)
    remove_old_tail(doc, 455)
    add_analysis_chapter(doc)
    add_design_chapter(doc)
    add_implementation_chapter(doc)
    add_testing_chapter(doc)
    add_conclusion_chapter(doc)
    add_future_work_chapter(doc)
    add_bibliography(doc)
    normalize_styles(doc)
    doc.save(str(DOC_PATH))


if __name__ == "__main__":
    main()
