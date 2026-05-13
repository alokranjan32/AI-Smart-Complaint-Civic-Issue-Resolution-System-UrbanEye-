from __future__ import annotations

import html
from pathlib import Path


ROOT = Path("/Users/alokranjan/Desktop/major")
REPORT_DIR = ROOT / "project_report"
BASE_HTML = REPORT_DIR / "urbaneye_major_project_report.html"
EXPANDED_HTML = REPORT_DIR / "urbaneye_major_project_report_expanded.html"


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


def code_block(title: str, relative_path: str) -> str:
    path = ROOT / relative_path
    content = path.read_text()
    escaped = html.escape(content)
    return f"""
    <h3>{html.escape(title)}</h3>
    <p class="small"><strong>File:</strong> {html.escape(relative_path)}</p>
    <div class="code">{escaped}</div>
    """


def appendix_table(rows: list[tuple[str, str, str]]) -> str:
    body = "\n".join(
        f"<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td><td>{html.escape(c)}</td></tr>"
        for a, b, c in rows
    )
    return f"""
    <table>
      <tr><th>Item</th><th>Description</th><th>Relevance to UrbanEye</th></tr>
      {body}
    </table>
    """


def build_extra_appendix() -> str:
    stakeholders = appendix_table(
        [
            ("Citizen / Resident", "Primary end user who reports civic issues and tracks progress.", "Shapes complaint intake, dashboard clarity, and trust."),
            ("Authority / Admin", "Department-side reviewer who monitors patterns and complaint distribution.", "Requires analytics, priority visibility, and hotspot summaries."),
            ("Field Staff", "Potential future user responsible for actual on-ground issue resolution.", "Informs future workflow expansion and assignment logic."),
            ("System Maintainer", "Developer or operator maintaining APIs, AI service, and deployments.", "Needs modular code, fallback support, and clear architecture."),
            ("Public Communication Team", "Would use generated X-ready updates for official outreach.", "Motivates social post generation and communication consistency."),
        ]
    )

    rtm_rows = []
    requirements = [
        ("FR-1 Authentication", "Register and login interfaces", "backend/src/routes/authRoutes.js, backend/src/controllers/authcontroller.js, mobile_app/src/services/authService.js"),
        ("FR-2 Complaint Submission", "Web/mobile complaint capture", "web_app/src/components/ReportPanel.tsx, mobile_app/src/screens/ReportScreen.js"),
        ("FR-3 AI Complaint Analysis", "Structured complaint enrichment", "ai_service/app/main.py, ai_service/agents/social_agent.py, backend/src/services/aiService.js"),
        ("FR-4 Complaint Tracking", "Status-based follow-up", "mobile_app/src/screens/DashbboardScreen.js, mobile_app/src/screens/ComplaintDetailScreen.js"),
        ("FR-5 Admin Overview", "Complaint statistics and summaries", "backend/src/controllers/adminController.js, web_app/src/components/DashboardShell.tsx"),
        ("FR-6 Hotspot Visibility", "Location-oriented issue visibility", "backend/src/routes/mapRoutes.js, web_app/src/components/MapComplaint.tsx"),
        ("FR-7 Persistence", "Store complaint metadata", "backend/prisma/schema.prisma, backend/src/controllers/complaintController.js"),
        ("FR-8 Fallback Resilience", "Offline/demo continuity", "backend/src/services/aiService.js, mobile_app/src/services/complaintService.js, web_app/src/services/complaintService.ts"),
    ]
    for req, desc, impl in requirements:
        rtm_rows.append((req, desc, impl))

    rtm_table = "\n".join(
        f"<tr><td>{html.escape(req)}</td><td>{html.escape(desc)}</td><td>{html.escape(impl)}</td></tr>"
        for req, desc, impl in requirements
    )

    test_rows = [
        ("Authentication", "Valid registration, duplicate email, wrong password, fallback login", "Ensures user access flow remains dependable."),
        ("Complaint API", "Valid complaint, missing fields, fetch all, fetch by id", "Verifies primary business flow."),
        ("AI Analysis", "Sanitation, road, water, electrical, urgent keywords", "Checks routing and priority inference."),
        ("Web Dashboard", "Complaint rendering, report submission, overview load", "Checks operator-side monitoring experience."),
        ("Mobile Dashboard", "Status filter, solved rate, local complaint merge", "Checks resident-side status visibility."),
        ("Persistence", "Prisma schema generation, mock fallback, AsyncStorage recovery", "Confirms resilience under mixed environments."),
        ("UI Validation", "Required-field alerts, empty-state cards, navigation flows", "Improves usability and prevents broken interactions."),
    ]
    testing_table = "\n".join(
        f"<tr><td>{html.escape(a)}</td><td>{html.escape(b)}</td><td>{html.escape(c)}</td></tr>"
        for a, b, c in test_rows
    )

    api_rows = [
        ("POST", "/api/auth/register", "Register a resident account", "Name, email, password"),
        ("POST", "/api/auth/login", "Authenticate existing user", "Email, password"),
        ("POST", "/api/complaints", "Create a complaint and enrich it through AI", "Title, description, location, optional image"),
        ("GET", "/api/complaints", "List complaints", "No body required"),
        ("GET", "/api/complaints/:id", "Fetch complaint detail", "Complaint ID"),
        ("GET", "/api/admin/overview", "Fetch analytics summary", "No body required"),
        ("GET", "/api/admin/complaints", "Fetch admin complaint list", "No body required"),
        ("GET", "/api/admin/users", "Fetch admin user list", "No body required"),
        ("GET", "/api/map/hotspots", "Fetch hotspot map records", "No body required"),
        ("POST", "/analyze", "Analyze complaint text using AI service", "Title, description, location"),
    ]
    api_table = "\n".join(
        f"<tr><td>{m}</td><td>{p}</td><td>{d}</td><td>{i}</td></tr>"
        for m, p, d, i in api_rows
    )

    code_sections = "\n".join(code_block(title, path) for title, path in CODE_FILES)

    return f"""
    <section class="chapter page-break">
      <h1 class="chapter-title">Appendix: Extended Supporting Documentation</h1>
      <h2>A. Detailed Stakeholder Analysis</h2>
      <p>
        A complete final-year dissertation benefits from showing not only what the software does, but also who it serves
        and why each module exists. UrbanEye touches multiple stakeholders even in its prototype form. The resident cares
        about easy reporting and trustworthy tracking. The administrator cares about volume, trends, and issue clustering.
        The maintainer cares about service boundaries and resilience. The future field worker cares about actionability.
        This layered stakeholder view explains why the project evolved into a multi-surface platform rather than remaining
        a single complaint form.
      </p>
      {stakeholders}

      <h2>B. Expanded User Manual</h2>
      <h3>B.1 Web Application Usage Flow</h3>
      <ol>
        <li>Open the landing page and review the summary cards that describe overall complaint activity.</li>
        <li>Navigate to the dashboard to access complaint cards, the report panel, and the admin-style overview metrics.</li>
        <li>Use the report panel to submit an issue by entering title, description, and location.</li>
        <li>Review complaint cards to observe department mapping, priority labels, and suggested actions.</li>
        <li>Open map and profile-related screens for broader oversight and account-level browsing.</li>
      </ol>
      <h3>B.2 Mobile Application Usage Flow</h3>
      <ol>
        <li>Register or log in to access the resident workspace.</li>
        <li>Use the home screen quick actions to jump to complaint reporting, dashboard, hotspot map, or profile.</li>
        <li>File a complaint through the report screen and optionally attach an image.</li>
        <li>Open the dashboard to see whether complaints are pending, in progress, or solved.</li>
        <li>Save an X handle in the profile screen so the system can prepare communication aligned with the user preference.</li>
        <li>Open complaint detail cards to see department, priority, location, and AI-generated social update text.</li>
      </ol>

      <h2>C. Requirements Traceability Matrix</h2>
      <table>
        <tr><th>Requirement</th><th>Description</th><th>Mapped Implementation</th></tr>
        {rtm_table}
      </table>

      <h2>D. Expanded Testing Matrix</h2>
      <table>
        <tr><th>Module</th><th>Test Focus</th><th>Rationale</th></tr>
        {testing_table}
      </table>

      <h2>E. Deployment and Execution Notes</h2>
      <p>
        The project can be executed as loosely coupled services. The backend API runs separately from the FastAPI AI
        service, while the web and mobile clients consume the backend over HTTP. This separation simplifies both testing
        and deployment. The backend is designed to run with mock data or a PostgreSQL-ready schema. The mobile app uses
        Expo for development efficiency, and the web app uses Next.js for rapid interface iteration.
      </p>
      <p>
        A practical deployment path for UrbanEye would involve hosting the web frontend on a service optimized for React
        applications, running the Node backend behind a secure API gateway, exposing the FastAPI service as an internal or
        protected microservice, and using PostgreSQL for durable storage. The current system already separates concerns in a
        way that makes this migration straightforward.
      </p>

      <h2>F. API Documentation Reference</h2>
      <table>
        <tr><th>Method</th><th>Path</th><th>Purpose</th><th>Typical Input</th></tr>
        {api_table}
      </table>

      <h2>G. Expanded Design Discussion</h2>
      <p>
        One of the strengths of UrbanEye is that its AI layer does not replace application logic; instead, it complements
        it. The backend retains ownership of validation, persistence, and shaping of complaint records, while the AI layer
        enriches those records. This division improves trustworthiness because the deterministic parts of the system remain
        explicit and testable. It also improves maintainability because AI logic can evolve without forcing a full rewrite
        of the complaint API.
      </p>
      <p>
        The frontend architecture similarly reflects task-specific design. The web application is oriented toward overview
        and operational visibility, whereas the mobile application is oriented toward immediacy and follow-up. The mobile
        dashboard’s solved-versus-open framing is especially important in civic use cases because users care less about
        abstract analytics and more about whether the issue has been addressed. This is why state wording, filter chips, and
        detail cards become significant design decisions rather than mere styling choices.
      </p>
      <p>
        From a software engineering perspective, fallback support is another important design decision. In many student
        projects, systems fail entirely when an external API or database is missing. UrbanEye deliberately avoids this by
        supporting mock stores, local persistence, and local analysis. This not only helps during demonstration, but also
        reflects good fault-tolerant design practice.
      </p>

      <h2>H. Source Code Listings</h2>
      <p>
        The following code listings are included as supporting evidence of implementation. They document the actual modules
        used in the project and are helpful for viva discussion, technical review, and future maintenance. Including these
        listings also makes the report more complete as a final-year dissertation artifact because the reader can directly
        connect design claims with implementation details.
      </p>
      {code_sections}
    </section>
    """


def main() -> None:
    base = BASE_HTML.read_text()
    injection = build_extra_appendix()
    if "</body>" not in base:
      raise SystemExit("Base HTML report is malformed: missing </body> tag")
    expanded = base.replace("</body>", injection + "\n</body>")
    EXPANDED_HTML.write_text(expanded)
    print(f"Wrote {EXPANDED_HTML}")


if __name__ == "__main__":
    main()
