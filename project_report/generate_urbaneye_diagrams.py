from pathlib import Path
import sys

sys.path.insert(0, "/private/tmp/pdf_build_deps")

from PIL import Image, ImageDraw, ImageFont


ROOT = Path("/Users/alokranjan/Desktop/major/project_report")
OUT_DIR = ROOT / "diagrams"
OUT_DIR.mkdir(parents=True, exist_ok=True)


WIDTH = 2200
HEIGHT = 1500
BG = "white"
TITLE = "#0f172a"
TEXT = "#1f2937"
LINE = "#475569"
BLUE = "#dbeafe"
BLUE_BORDER = "#2563eb"
GREEN = "#dcfce7"
GREEN_BORDER = "#16a34a"
AMBER = "#fef3c7"
AMBER_BORDER = "#d97706"
VIOLET = "#ede9fe"
VIOLET_BORDER = "#7c3aed"
GRAY = "#f8fafc"
GRAY_BORDER = "#94a3b8"


def load_font(name: str, size: int):
    font_paths = [
        f"/System/Library/Fonts/Supplemental/{name}",
        f"/Library/Fonts/{name}",
    ]
    for path in font_paths:
        p = Path(path)
        if p.exists():
            return ImageFont.truetype(str(p), size=size)
    return ImageFont.load_default()


FONT_TITLE = load_font("Arial Bold.ttf", 40)
FONT_SUBTITLE = load_font("Arial Bold.ttf", 28)
FONT_TEXT = load_font("Arial.ttf", 24)
FONT_SMALL = load_font("Arial.ttf", 22)
FONT_ACTOR = load_font("Arial Bold.ttf", 24)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), test, font=font)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_centered_text(draw, box, text, font, fill=TEXT, line_gap=8):
    x1, y1, x2, y2 = box
    max_width = x2 - x1 - 30
    lines = wrap_text(draw, text, font, max_width)
    heights = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        heights.append(bbox[3] - bbox[1])
    total_height = sum(heights) + line_gap * (len(lines) - 1)
    y = y1 + ((y2 - y1) - total_height) / 2
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        x = x1 + ((x2 - x1) - w) / 2
        draw.text((x, y), line, font=font, fill=fill)
        y += h + line_gap


def draw_box(draw, box, text, fill, border, font=FONT_TEXT, radius=24, width=4):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=border, width=width)
    draw_centered_text(draw, box, text, font)


def draw_ellipse_box(draw, box, text, fill, border, font=FONT_TEXT, width=4):
    draw.ellipse(box, fill=fill, outline=border, width=width)
    draw_centered_text(draw, box, text, font)


def draw_arrow(draw, start, end, fill=LINE, width=5, arrow_size=18):
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1, x2, y2), fill=fill, width=width)
    if x1 == x2:
        direction = 1 if y2 > y1 else -1
        draw.polygon(
            [
                (x2, y2),
                (x2 - arrow_size, y2 - direction * arrow_size),
                (x2 + arrow_size, y2 - direction * arrow_size),
            ],
            fill=fill,
        )
    elif y1 == y2:
        direction = 1 if x2 > x1 else -1
        draw.polygon(
            [
                (x2, y2),
                (x2 - direction * arrow_size, y2 - arrow_size),
                (x2 - direction * arrow_size, y2 + arrow_size),
            ],
            fill=fill,
        )


def draw_polyline_arrow(draw, points, fill=LINE, width=5, arrow_size=18):
    for i in range(len(points) - 1):
        draw.line((points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]), fill=fill, width=width)
    x1, y1 = points[-2]
    x2, y2 = points[-1]
    if x1 == x2:
        direction = 1 if y2 > y1 else -1
        draw.polygon(
            [
                (x2, y2),
                (x2 - arrow_size, y2 - direction * arrow_size),
                (x2 + arrow_size, y2 - direction * arrow_size),
            ],
            fill=fill,
        )
    elif y1 == y2:
        direction = 1 if x2 > x1 else -1
        draw.polygon(
            [
                (x2, y2),
                (x2 - direction * arrow_size, y2 - arrow_size),
                (x2 - direction * arrow_size, y2 + arrow_size),
            ],
            fill=fill,
        )


def draw_actor(draw, center_x, top_y, label, color_fill, color_border):
    head_r = 34
    head_box = (center_x - head_r, top_y, center_x + head_r, top_y + head_r * 2)
    draw.ellipse(head_box, outline=color_border, width=5, fill="white")
    body_top = top_y + head_r * 2 + 8
    body_bottom = body_top + 110
    draw.line((center_x, body_top, center_x, body_bottom), fill=color_border, width=6)
    draw.line((center_x - 55, body_top + 35, center_x + 55, body_top + 35), fill=color_border, width=6)
    draw.line((center_x, body_bottom, center_x - 45, body_bottom + 70), fill=color_border, width=6)
    draw.line((center_x, body_bottom, center_x + 45, body_bottom + 70), fill=color_border, width=6)
    label_box = (center_x - 135, body_bottom + 95, center_x + 135, body_bottom + 165)
    draw.rounded_rectangle(label_box, radius=22, fill=color_fill, outline=color_border, width=4)
    draw_centered_text(draw, label_box, label, FONT_ACTOR)


def draw_container(draw, box, title, fill, border, title_fill=TITLE):
    draw.rounded_rectangle(box, radius=24, fill=fill, outline=border, width=4)
    x1, y1, x2, _ = box
    draw.text((x1 + 20, y1 + 14), title, font=FONT_SUBTITLE, fill=title_fill)


def draw_label(draw, xy, text):
    x, y = xy
    bbox = draw.textbbox((0, 0), text, font=FONT_SMALL)
    pad_x = 16
    pad_y = 10
    box = (x, y, x + (bbox[2] - bbox[0]) + pad_x * 2, y + (bbox[3] - bbox[1]) + pad_y * 2)
    draw.rounded_rectangle(box, radius=18, fill="white", outline=GRAY_BORDER, width=2)
    draw.text((x + pad_x, y + pad_y - 2), text, font=FONT_SMALL, fill=TEXT)


def create_use_case():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    system_box = (470, 90, 2050, 1330)
    draw.rounded_rectangle(system_box, radius=28, outline=BLUE_BORDER, width=5, fill=GRAY)
    draw.text((1090, 135), "UrbanEye System", font=FONT_SUBTITLE, fill=TITLE)

    draw_actor(draw, 210, 260, "Citizen / User", GREEN, GREEN_BORDER)
    draw_actor(draw, 210, 790, "Administrator", AMBER, AMBER_BORDER)

    use_cases = {
        "Register / Login": (600, 260, 950, 370),
        "Submit Complaint": (1080, 260, 1430, 370),
        "Upload Image (Optional)": (1560, 260, 1930, 370),
        "View Dashboard": (600, 520, 950, 630),
        "Track Complaint Status": (1080, 520, 1430, 630),
        "Manage X Account": (1560, 520, 1930, 630),
        "View All Complaints": (760, 860, 1120, 970),
        "Update Complaint Status": (1220, 860, 1610, 970),
        "Review Trends / Hotspots": (960, 1080, 1420, 1190),
    }

    for label, box in use_cases.items():
        draw_ellipse_box(
            draw,
            box,
            label,
            BLUE if box[1] < 900 else VIOLET,
            BLUE_BORDER if box[1] < 900 else VIOLET_BORDER,
        )

    user_anchor = (265, 410)
    user_hub = (470, 430)
    draw.line((user_anchor[0], user_anchor[1], user_hub[0], user_hub[1]), fill=LINE, width=4)
    user_routes = [
        [(470, 430), (540, 430), (540, 315), (600, 315)],
        [(470, 430), (1020, 430), (1020, 315), (1080, 315)],
        [(470, 430), (1500, 430), (1500, 315), (1560, 315)],
        [(470, 430), (540, 430), (540, 575), (600, 575)],
        [(470, 430), (1020, 430), (1020, 575), (1080, 575)],
        [(470, 430), (1500, 430), (1500, 575), (1560, 575)],
    ]
    for route in user_routes:
        draw_polyline_arrow(draw, route, width=4, arrow_size=14)

    admin_anchor = (265, 980)
    admin_hub = (470, 980)
    draw.line((admin_anchor[0], admin_anchor[1], admin_hub[0], admin_hub[1]), fill=LINE, width=4)
    admin_routes = [
        [(470, 980), (700, 980), (700, 915), (760, 915)],
        [(470, 980), (1160, 980), (1160, 915), (1220, 915)],
        [(470, 980), (900, 980), (900, 1135), (960, 1135)],
    ]
    for route in admin_routes:
        draw_polyline_arrow(draw, route, width=4, arrow_size=14)

    img.save(OUT_DIR / "urbaneye_use_case_diagram.jpg", quality=95)
    img.save(OUT_DIR / "urbaneye_use_case_diagram_final.jpg", quality=95)


def create_dfd():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    draw_actor(draw, 210, 350, "Citizen / User", GREEN, GREEN_BORDER)
    draw_actor(draw, 210, 860, "Administrator", AMBER, AMBER_BORDER)

    p1 = (460, 220, 830, 360)
    p2 = (930, 220, 1300, 360)
    p3 = (1400, 220, 1930, 360)
    p4 = (910, 760, 1380, 910)

    draw_box(draw, p1, "1. Complaint Submission", BLUE, BLUE_BORDER, FONT_SUBTITLE)
    draw_box(draw, p2, "2. AI Complaint Analysis", BLUE, BLUE_BORDER, FONT_SUBTITLE)
    draw_box(draw, p3, "3. Complaint Storage and Management", BLUE, BLUE_BORDER, FONT_SUBTITLE)
    draw_box(draw, p4, "4. Dashboard and Status Tracking", VIOLET, VIOLET_BORDER, FONT_SUBTITLE)

    d1 = (1470, 540, 1940, 670)
    d2 = (1470, 930, 1940, 1060)
    draw_box(draw, d1, "Complaint Database", GRAY, GRAY_BORDER, FONT_SUBTITLE)
    draw_box(draw, d2, "AI Analysis Records", GRAY, GRAY_BORDER, FONT_SUBTITLE)

    draw_polyline_arrow(draw, [(265, 500), (360, 500), (460, 290)])
    draw_label(draw, (330, 385), "Title, description,\nlocation, image")

    draw_polyline_arrow(draw, [(830, 290), (930, 290)])
    draw_label(draw, (860, 165), "Complaint data")

    draw_polyline_arrow(draw, [(1300, 290), (1400, 290)])
    draw_label(draw, (1320, 115), "Category, priority,\ndepartment,\nsuggested action,\nX-ready post")

    draw_polyline_arrow(draw, [(1705, 360), (1705, 540)])
    draw_label(draw, (1760, 415), "Store complaint")

    draw_polyline_arrow(draw, [(1570, 360), (1570, 930)])
    draw_label(draw, (1310, 530), "Store analysis")

    draw_polyline_arrow(draw, [(1470, 605), (1380, 605), (1380, 805)])
    draw_polyline_arrow(draw, [(1470, 995), (1380, 995), (1380, 835)])

    draw_polyline_arrow(draw, [(910, 805), (760, 805), (520, 660), (265, 530)])
    draw_label(draw, (430, 720), "Status, tracking,\ncomplaint view")

    draw_polyline_arrow(draw, [(265, 1010), (420, 1010), (910, 835)])
    draw_label(draw, (440, 960), "Review and monitor")

    draw_polyline_arrow(draw, [(910, 875), (780, 875), (420, 1110), (265, 1110)])
    draw_label(draw, (470, 1140), "Summaries, counts,\nmonitoring data")

    img.save(OUT_DIR / "urbaneye_level0_dfd.jpg", quality=95)
    img.save(OUT_DIR / "urbaneye_level0_dfd_final.jpg", quality=95)


def create_level1_dfd():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    draw_container(draw, (360, 70, 1890, 1320), "UrbanEye Level 1 DFD", "#ffffff", BLUE_BORDER)

    ui = (470, 150, 1770, 340)
    api = (470, 390, 1770, 610)
    services = (470, 660, 1770, 920)
    data = (470, 980, 1770, 1240)

    draw_container(draw, ui, "USER INTERFACE LAYER", "#e0ecff", BLUE_BORDER)
    draw_container(draw, api, "BACKEND API LAYER", "#f2e8ff", VIOLET_BORDER)
    draw_container(draw, services, "AI / PROCESSING / INTEGRATION LAYER", "#e8f7e8", GREEN_BORDER)
    draw_container(draw, data, "DATA STORAGE LAYER", "#fff4df", AMBER_BORDER)

    draw_box(draw, (540, 220, 820, 300), "Web App\n(Dashboard / Admin View)", "#ffffff", BLUE_BORDER, FONT_SMALL)
    draw_box(draw, (910, 220, 1190, 300), "Mobile App\n(Complaint Tracking)", "#ffffff", BLUE_BORDER, FONT_SMALL)
    draw_box(draw, (1280, 220, 1700, 300), "Complaint Form\n(Title, Description, Location, Image)", "#ffffff", BLUE_BORDER, FONT_SMALL)

    draw_box(draw, (540, 460, 760, 545), "Auth / User Routes", "#ffffff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, (810, 460, 1030, 545), "Complaint Routes", "#ffffff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, (1080, 460, 1300, 545), "Admin Routes", "#ffffff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, (1350, 460, 1590, 545), "Map / Hotspot Routes", "#ffffff", VIOLET_BORDER, FONT_SMALL)

    draw_box(draw, (560, 730, 830, 815), "AI Analysis Service\n(Category / Priority / Department)", "#ffffff", GREEN_BORDER, FONT_SMALL)
    draw_box(draw, (900, 730, 1140, 815), "Suggested Action\nGenerator", "#ffffff", GREEN_BORDER, FONT_SMALL)
    draw_box(draw, (1210, 730, 1450, 815), "X-Ready Post\nGenerator", "#ffffff", GREEN_BORDER, FONT_SMALL)
    draw_box(draw, (1520, 730, 1700, 815), "Fallback Logic", "#ffffff", GREEN_BORDER, FONT_SMALL)

    draw_box(draw, (560, 1060, 820, 1145), "User Data", "#ffffff", AMBER_BORDER, FONT_SMALL)
    draw_box(draw, (890, 1060, 1160, 1145), "Complaint Records", "#ffffff", AMBER_BORDER, FONT_SMALL)
    draw_box(draw, (1230, 1060, 1490, 1145), "AI Fields / Analysis", "#ffffff", AMBER_BORDER, FONT_SMALL)
    draw_box(draw, (1560, 1060, 1700, 1145), "Local Storage", "#ffffff", AMBER_BORDER, FONT_SMALL)

    for x in [680, 1050, 1490]:
        draw_polyline_arrow(draw, [(x, 300), (x, 390)], width=4, arrow_size=14)

    draw_polyline_arrow(draw, [(920, 545), (920, 730)], width=4, arrow_size=14)
    draw_polyline_arrow(draw, [(1030, 500), (1280, 500), (1280, 730)], width=4, arrow_size=14)
    draw_polyline_arrow(draw, [(1590, 500), (1610, 500), (1610, 730)], width=4, arrow_size=14)

    draw_polyline_arrow(draw, [(700, 815), (700, 1060)], width=4, arrow_size=14)
    draw_polyline_arrow(draw, [(1020, 815), (1020, 1060)], width=4, arrow_size=14)
    draw_polyline_arrow(draw, [(1330, 815), (1330, 1060)], width=4, arrow_size=14)
    draw_polyline_arrow(draw, [(1610, 815), (1610, 1060)], width=4, arrow_size=14)

    draw_label(draw, (840, 625), "validated complaint request")
    draw_label(draw, (1110, 870), "structured complaint output")
    draw_label(draw, (1220, 340), "user input / dashboard actions")

    img.save(OUT_DIR / "urbaneye_level1_dfd_final.jpg", quality=95)


def create_wbs():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    root = (880, 80, 1320, 180)
    phase1 = (330, 270, 720, 380)
    phase2 = (905, 270, 1295, 380)
    phase3 = (1480, 270, 1870, 380)

    frontend = (240, 505, 560, 605)
    mobile = (640, 505, 960, 605)
    backend = (1040, 505, 1360, 605)
    ai = (1440, 505, 1760, 605)

    children = [
        (170, 765, 360, 845, "Home /\nDashboard"),
        (395, 765, 585, 845, "Complaint\nForm"),
        (620, 765, 810, 845, "Complaint\nTracker"),
        (845, 765, 1035, 845, "Profile /\nX Account"),
        (1070, 765, 1260, 845, "Controllers /\nAPIs"),
        (1295, 765, 1485, 845, "Database /\nPrisma"),
        (1520, 765, 1710, 845, "AI\nAnalysis"),
        (1745, 765, 1935, 845, "Social\nDrafting"),
    ]

    draw.rounded_rectangle(root, radius=26, fill="#1e3a6d", outline="#1e3a6d", width=4)
    draw_centered_text(draw, root, "URBANEYE", FONT_SUBTITLE, fill="white")
    for box, text in [
        (phase1, "PHASE 1\n(Core Platform)"),
        (phase2, "PHASE 2\n(AI Enrichment)"),
        (phase3, "PHASE 3\n(Scale / Deploy)"),
    ]:
        draw.rounded_rectangle(box, radius=24, fill="#4f83c2", outline="#4f83c2", width=4)
        draw_centered_text(draw, box, text, FONT_SUBTITLE, fill="white")

    for box, text in [
        (frontend, "Web Frontend"),
        (mobile, "Mobile Frontend"),
        (backend, "Backend Layer"),
        (ai, "AI Service Layer"),
    ]:
        draw.rounded_rectangle(box, radius=22, fill="#7c3aed", outline="#7c3aed", width=4)
        draw_centered_text(draw, box, text, FONT_SUBTITLE, fill="white")

    for box in children:
        draw_box(draw, box[:4], box[4], "#f3f4f6", "#cbd5e1", FONT_SMALL)

    line_color = "#64748b"
    line_width = 4
    draw.line((1100, 180, 1100, 225), fill=line_color, width=line_width)
    draw.line((525, 225, 1675, 225), fill=line_color, width=line_width)
    for x, y in [(525, 270), (1100, 270), (1675, 270)]:
        draw_polyline_arrow(draw, [(x, 225), (x, y)], fill=line_color, width=line_width, arrow_size=12)

    draw.line((525, 380, 525, 445), fill=line_color, width=line_width)
    draw.line((400, 445, 800, 445), fill=line_color, width=line_width)
    draw_polyline_arrow(draw, [(400, 445), (400, 505)], fill=line_color, width=line_width, arrow_size=12)
    draw_polyline_arrow(draw, [(800, 445), (800, 505)], fill=line_color, width=line_width, arrow_size=12)

    draw_polyline_arrow(draw, [(1100, 380), (1100, 505)], fill=line_color, width=line_width, arrow_size=12)
    draw_polyline_arrow(draw, [(1675, 380), (1675, 505)], fill=line_color, width=line_width, arrow_size=12)

    for parent_x, child_left, child_right in [
        (400, 265, 490),
        (800, 715, 940),
        (1200, 1165, 1390),
        (1600, 1615, 1840),
    ]:
        draw.line((parent_x, 605, parent_x, 680), fill=line_color, width=line_width)
        draw.line((child_left, 680, child_right, 680), fill=line_color, width=line_width)

    for x in [265, 490, 715, 940, 1165, 1390, 1615, 1840]:
        draw_polyline_arrow(draw, [(x, 680), (x, 765)], fill=line_color, width=line_width, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_wbs_final.jpg", quality=95)


def create_system_architecture():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 52)
    draw.text((580, 80), "System Architecture - UrbanEye Platform", font=title_font, fill=TITLE)

    user_box = (120, 640, 300, 820)
    draw_box(draw, user_box, "Citizen /\nAdmin User", "#f8fafc", "#94a3b8", FONT_SUBTITLE)

    frontend = (420, 590, 710, 870)
    backend = (860, 590, 1150, 870)
    ai_service = (1300, 560, 1600, 770)
    database = (1300, 870, 1600, 1080)
    external = (1750, 590, 2050, 960)

    draw_box(draw, frontend, "Frontend\n(Web + Mobile)\n\nDashboard\nComplaint Form\nTracking\nProfile / X Account", "#eef4ff", BLUE_BORDER, FONT_SMALL)
    draw_box(draw, backend, "Backend\nAPI Layer\n\nComplaint Routes\nAdmin Routes\nAuth / Profile\nMap / Hotspots", "#f3ebff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, ai_service, "AI Service\n(FastAPI)\n\nCategory Analysis\nPriority Detection\nDepartment Mapping\nSuggested Action\nX-Ready Post", "#ecfdf3", GREEN_BORDER, FONT_SMALL)
    draw_box(draw, database, "Data Storage\n\nPrisma\nPostgreSQL-ready Schema\nComplaint Records\nAI Fields\nLocal Fallback Support", "#fff7e8", AMBER_BORDER, FONT_SMALL)
    draw_box(draw, external, "External / Support Layer\n\nOptional LLM Provider\nImage Input Support\nLocation Data\nLocal Storage\nFuture X Publishing", "#f8fafc", "#94a3b8", FONT_SMALL)

    draw_polyline_arrow(draw, [(300, 730), (420, 730)], width=5, arrow_size=16)
    draw_label(draw, (305, 660), "user interaction")

    draw_polyline_arrow(draw, [(710, 700), (860, 700)], width=5, arrow_size=16)
    draw_label(draw, (735, 630), "HTTP request")

    draw_polyline_arrow(draw, [(860, 760), (710, 760)], width=5, arrow_size=16)
    draw_label(draw, (730, 785), "response / rendered data")

    draw_polyline_arrow(draw, [(1150, 650), (1300, 650)], width=5, arrow_size=16)
    draw_label(draw, (1165, 580), "AI enrichment request")

    draw_polyline_arrow(draw, [(1300, 720), (1150, 720)], width=5, arrow_size=16)
    draw_label(draw, (1165, 735), "structured AI output")

    draw_polyline_arrow(draw, [(1005, 870), (1005, 980), (1300, 980)], width=5, arrow_size=16)
    draw_label(draw, (1020, 900), "store complaint data")

    draw_polyline_arrow(draw, [(1300, 1035), (1150, 1035), (1150, 820)], width=5, arrow_size=16)
    draw_label(draw, (1165, 1045), "retrieve complaint records")

    draw_polyline_arrow(draw, [(1600, 650), (1750, 650)], width=5, arrow_size=16)
    draw_label(draw, (1615, 580), "optional provider calls")

    draw_polyline_arrow(draw, [(1750, 820), (1600, 820), (1600, 700)], width=5, arrow_size=16)
    draw_label(draw, (1625, 835), "supporting responses")

    draw_polyline_arrow(draw, [(1600, 930), (1750, 930)], width=5, arrow_size=16)
    draw_label(draw, (1610, 955), "fallback / external data")

    img.save(OUT_DIR / "urbaneye_system_architecture_final.jpg", quality=95)


def create_complaint_module_architecture():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 44)
    layer_font = load_font("Arial Bold.ttf", 30)

    draw.text((700, 70), "System Diagram - Complaint Management Module", font=title_font, fill=TITLE)

    draw.line((320, 290, 1880, 290), fill="#cbd5e1", width=3)
    draw.line((320, 620, 1880, 620), fill="#cbd5e1", width=3)

    draw.text((325, 300), "FRONTEND LAYER", font=layer_font, fill=TITLE)
    draw.text((325, 630), "BACKEND LAYER", font=layer_font, fill=TITLE)

    user = (1020, 130, 1180, 240)
    draw_box(draw, user, "USER", "#ffffff", "#94a3b8", FONT_SUBTITLE)

    ui = (900, 360, 1280, 570)
    api = (900, 670, 1280, 900)
    ai = (470, 960, 850, 1170)
    storage = (900, 960, 1280, 1170)
    status = (1330, 960, 1710, 1170)

    draw_box(
        draw,
        ui,
        "User Interface\n\nComplaint Form\nDashboard View\nComplaint Card\nComplaint Detail\nProfile / X Account",
        "#eef4ff",
        BLUE_BORDER,
        FONT_SMALL,
    )
    draw_box(
        draw,
        api,
        "Backend API Services\n\n/api/complaints\n/api/admin/overview\n/api/auth/profile\n/api/map/hotspots",
        "#f3ebff",
        VIOLET_BORDER,
        FONT_SMALL,
    )
    draw_box(
        draw,
        ai,
        "AI Analysis Service\n\nCreate Category\nEstimate Priority\nMap Department\nSuggested Action\nX-Ready Post",
        "#ecfdf3",
        GREEN_BORDER,
        FONT_SMALL,
    )
    draw_box(
        draw,
        storage,
        "Complaint Storage\n\nPrisma / Database\nComplaint Records\nAI Fields\nUser Preferences\nLocal Fallback",
        "#fff7e8",
        AMBER_BORDER,
        FONT_SMALL,
    )
    draw_box(
        draw,
        status,
        "Status / Notification Output\n\nPending / In Progress / Resolved\nDashboard Update\nComplaint Tracking View\nPublic Update Draft",
        "#f8fafc",
        "#94a3b8",
        FONT_SMALL,
    )

    draw_polyline_arrow(draw, [(1100, 240), (1100, 360)], width=5, arrow_size=14)
    draw_label(draw, (1130, 275), "submit / fetch data")

    draw_polyline_arrow(draw, [(1100, 570), (1100, 670)], width=5, arrow_size=14)
    draw_label(draw, (1130, 605), "send request")

    draw_polyline_arrow(draw, [(1280, 785), (1410, 785), (1410, 960)], width=5, arrow_size=14)
    draw_label(draw, (1300, 720), "trigger status view")

    draw_polyline_arrow(draw, [(900, 785), (660, 785), (660, 960)], width=5, arrow_size=14)
    draw_label(draw, (500, 720), "analyze complaint")

    draw_polyline_arrow(draw, [(850, 1065), (900, 1065)], width=5, arrow_size=14)
    draw_label(draw, (760, 980), "structured output")

    draw_polyline_arrow(draw, [(1090, 900), (1090, 960)], width=5, arrow_size=14)
    draw_label(draw, (1120, 920), "store records")

    draw_polyline_arrow(draw, [(1280, 1065), (1330, 1065)], width=5, arrow_size=14)
    draw_label(draw, (1180, 1185), "return complaint status")

    draw_polyline_arrow(draw, [(1520, 960), (1520, 840), (1280, 840)], width=5, arrow_size=14)
    draw_label(draw, (1540, 860), "dashboard response")

    draw_polyline_arrow(draw, [(900, 840), (740, 840), (740, 1170), (1520, 1170), (1520, 960)], width=4, arrow_size=12)
    draw_label(draw, (760, 1130), "tracking / escalation support")

    img.save(OUT_DIR / "urbaneye_complaint_module_architecture_final.jpg", quality=95)


def create_ai_workflow():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 42)
    draw.text((760, 80), "Workflow Diagram - AI Complaint Analysis", font=title_font, fill=TITLE)

    start = (420, 180, 540, 250)
    user = (390, 350, 570, 520)
    ui = (670, 370, 880, 500)
    api = (980, 370, 1190, 500)
    decision = (1280, 360, 1430, 510)
    ai_model = (1560, 280, 1840, 410)
    fallback = (1540, 500, 1860, 650)
    progress = (1560, 760, 1840, 910)
    end = (420, 650, 540, 720)

    draw.rounded_rectangle(start, radius=24, fill="#ffffff", outline="#4b5563", width=4)
    draw_centered_text(draw, start, "Start", FONT_SUBTITLE)
    draw_box(draw, user, "User", "#ffffff", "#4b5563", FONT_SUBTITLE)
    draw_box(draw, ui, "Complaint Chat /\nInput Interface", "#eef4ff", BLUE_BORDER, FONT_SUBTITLE)
    draw_box(draw, api, "Backend API\n/analyze", "#f3ebff", VIOLET_BORDER, FONT_SUBTITLE)
    draw.ellipse(decision, fill="#ffffff", outline="#4b5563", width=4)
    draw_centered_text(draw, decision, "AI\nAvailable?", FONT_SUBTITLE)
    draw_box(draw, ai_model, "AI Model /\nAnalysis Engine", "#ecfdf3", GREEN_BORDER, FONT_SUBTITLE)
    draw_box(draw, fallback, "Fallback Analysis\nRules / Templates", "#fff7e8", AMBER_BORDER, FONT_SUBTITLE)
    draw_box(draw, progress, "Complaint Tracking\nUpdate System", "#f8fafc", "#94a3b8", FONT_SUBTITLE)
    draw.rounded_rectangle(end, radius=24, fill="#ffffff", outline="#111827", width=5)
    draw_centered_text(draw, end, "End", FONT_SUBTITLE)

    draw_polyline_arrow(draw, [(480, 250), (480, 350)], width=5, arrow_size=14)
    draw_polyline_arrow(draw, [(570, 410), (670, 410)], width=5, arrow_size=14)
    draw_label(draw, (585, 370), "complaint query")

    draw_polyline_arrow(draw, [(880, 410), (980, 410)], width=5, arrow_size=14)
    draw_label(draw, (895, 370), "send request")

    draw_polyline_arrow(draw, [(1190, 410), (1280, 435)], width=5, arrow_size=14)
    draw_label(draw, (1180, 330), "process complaint")

    draw_polyline_arrow(draw, [(1430, 400), (1560, 345)], width=5, arrow_size=14)
    draw_label(draw, (1450, 315), "YES")

    draw_polyline_arrow(draw, [(1430, 470), (1540, 575)], width=5, arrow_size=14)
    draw_label(draw, (1450, 530), "NO")

    draw_polyline_arrow(draw, [(1560, 345), (1430, 345), (1430, 820), (1560, 820)], width=5, arrow_size=14)
    draw_label(draw, (1440, 690), "analysis result")

    draw_polyline_arrow(draw, [(1540, 575), (1480, 575), (1480, 850), (1560, 850)], width=5, arrow_size=14)
    draw_label(draw, (1330, 730), "fallback result")

    draw_polyline_arrow(draw, [(1560, 880), (1190, 880), (1190, 470)], width=5, arrow_size=14)
    draw_label(draw, (1280, 895), "update complaint status")

    draw_polyline_arrow(draw, [(980, 470), (880, 470)], width=5, arrow_size=14)
    draw_label(draw, (890, 510), "enriched response")

    draw_polyline_arrow(draw, [(670, 470), (570, 470)], width=5, arrow_size=14)
    draw_label(draw, (585, 510), "display result")

    draw_polyline_arrow(draw, [(480, 520), (480, 650)], width=5, arrow_size=14)

    img.save(OUT_DIR / "urbaneye_ai_workflow_final.jpg", quality=95)


def create_data_access_layered_architecture():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 44)
    draw.text((600, 90), "Layered Architecture - Data Access Module", font=title_font, fill=TITLE)

    layers = [
        ((420, 250, 1780, 380), "Application Layer (Top)", "Frontend Modules", ["Dashboard", "Complaint Form", "Complaint Tracking", "Admin View"]),
        ((420, 470, 1780, 600), "Data Access Layer", "Data Access Services", ["Complaint Service", "AI Integration Service", "Admin Aggregation", "Profile / Preference Service"]),
        ((420, 690, 1780, 820), "External / Support Layer", "Connected Services", ["AI Service API", "Location / Mapping Support", "Optional Provider Calls"]),
        ((420, 910, 1780, 1040), "Storage Layer (Bottom)", "Storage Systems", ["Complaint Database", "User Data", "AI Fields", "Local Storage"]),
    ]

    for box, title, subtitle, items in layers:
        x1, y1, x2, y2 = box
        draw.rectangle(box, outline="#1f2937", width=3, fill="#ffffff")
        split = x1 + 360
        draw.line((split, y1, split, y2), fill="#1f2937", width=3)
        draw.text((x1 + 20, y1 + 24), title, font=FONT_SUBTITLE, fill=TITLE)
        draw.text((x1 + 40, y1 + 62), subtitle, font=FONT_TEXT, fill="#6b7280")
        start_x = split + 25
        gap = 230
        for i, item in enumerate(items):
            draw.text((start_x + i * gap, y1 + 48), f"• {item}", font=FONT_SMALL, fill=TEXT)

    draw_polyline_arrow(draw, [(1100, 380), (1100, 470)], width=4, arrow_size=12)
    draw_label(draw, (1120, 405), "request data")

    draw_polyline_arrow(draw, [(1100, 600), (1100, 690)], width=4, arrow_size=12)
    draw_label(draw, (1120, 625), "fetch external data")

    draw_polyline_arrow(draw, [(1100, 820), (1100, 910)], width=4, arrow_size=12)
    draw_label(draw, (1120, 845), "read / write storage")

    img.save(OUT_DIR / "urbaneye_data_access_layer_final.jpg", quality=95)


def create_infrastructure_architecture():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 44)
    draw.text((640, 80), "Infrastructure Architecture - UrbanEye Platform", font=title_font, fill=TITLE)

    top = (850, 170, 1250, 270)
    mid1 = (330, 410, 690, 530)
    mid2 = (780, 410, 1140, 530)
    mid3 = (1230, 410, 1590, 530)
    mid4 = (1680, 410, 2040, 530)

    low1 = (330, 720, 690, 840)
    low2 = (780, 720, 1140, 840)
    low3 = (1230, 720, 1590, 840)
    low4 = (1680, 720, 2040, 840)

    draw_box(draw, top, "Deployment Platform\n\nWeb Hosting\nBackend Hosting\nAI Service Hosting", "#eaf2ff", BLUE_BORDER, FONT_SMALL)
    draw_box(draw, mid1, "API Hosting Layer\n\nNode / Express API\nRoute Handling\nRequest Management", "#f3ebff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, mid2, "Database Layer\n\nPrisma\nComplaint Records\nUser Data\nAI Fields", "#fff7e8", AMBER_BORDER, FONT_SMALL)
    draw_box(draw, mid3, "Monitoring & Logging\n\nRuntime Logs\nHealth Checks\nDebug Traces\nError Observation", "#ecfdf3", GREEN_BORDER, FONT_SMALL)
    draw_box(draw, mid4, "Background / Support Jobs\n\nScheduled Tasks\nFallback Handling\nSync / Recovery Support", "#f8fafc", "#94a3b8", FONT_SMALL)

    draw_box(draw, low1, "Scalability\n\ntraffic handling\nmodular services\nseparate deployment units", "#ffffff", "#cbd5e1", FONT_SMALL)
    draw_box(draw, low2, "Reliability\n\nbackup logic\ndata persistence\nservice continuity", "#ffffff", "#cbd5e1", FONT_SMALL)
    draw_box(draw, low3, "System Health\n\nperformance tracking\nissue detection\navailability checks", "#ffffff", "#cbd5e1", FONT_SMALL)
    draw_box(draw, low4, "Failure Recovery\n\nfallback mode\nrestart / redeploy\nrestore operations", "#ffffff", "#cbd5e1", FONT_SMALL)

    for x in [510, 960, 1410, 1860]:
        draw_polyline_arrow(draw, [(1050, 270), (1050, 330), (x, 330), (x, 410)], width=4, arrow_size=12)

    for top_x, bottom_x in [(510, 510), (960, 960), (1410, 1410), (1860, 1860)]:
        draw_polyline_arrow(draw, [(top_x, 530), (top_x, 720)], width=4, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_infrastructure_architecture_final.jpg", quality=95)


def draw_activity_box(draw, box, text, fill="#ffffff", border="#4b5563", font=FONT_SMALL):
    draw.rounded_rectangle(box, radius=18, fill=fill, outline=border, width=3)
    draw_centered_text(draw, box, text, font)


def draw_swimlane_frame(draw, box, title, left_label, right_label):
    x1, y1, x2, y2 = box
    draw.rectangle(box, outline="#111827", width=3, fill="#ffffff")
    draw.line((x1, y1 + 42, x2, y1 + 42), fill="#111827", width=3)
    mid = (x1 + x2) // 2
    draw.line((mid, y1, mid, y2), fill="#111827", width=2)
    title_bbox = draw.textbbox((0, 0), title, font=FONT_SUBTITLE)
    title_x = x1 + ((x2 - x1) - (title_bbox[2] - title_bbox[0])) / 2
    draw.text((title_x, y1 - 54), title, font=FONT_SUBTITLE, fill=TITLE)
    left_bbox = draw.textbbox((0, 0), left_label, font=FONT_SMALL)
    right_bbox = draw.textbbox((0, 0), right_label, font=FONT_SMALL)
    left_x = x1 + ((mid - x1) - (left_bbox[2] - left_bbox[0])) / 2
    right_x = mid + ((x2 - mid) - (right_bbox[2] - right_bbox[0])) / 2
    draw.text((left_x, y1 + 9), left_label, font=FONT_SMALL, fill=TITLE)
    draw.text((right_x, y1 + 9), right_label, font=FONT_SMALL, fill=TITLE)
    return mid


def create_activity_submit_complaint():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    frame = (330, 120, 1880, 1300)
    mid = draw_swimlane_frame(
        draw,
        frame,
        "Activity Diagram - Submit Complaint Workflow",
        "User / Frontend",
        "Backend / AI System",
    )

    # left lane
    sx = 520
    rx = 1220
    draw.ellipse((sx - 18, 185, sx + 18, 221), fill="#111827")
    draw_activity_box(draw, (430, 250, 620, 320), "Open complaint form")
    draw_activity_box(draw, (400, 375, 650, 455), "Enter title, description,\nlocation, and optional image")
    draw_activity_box(draw, (440, 520, 610, 590), "Click Submit")
    draw_activity_box(draw, (390, 1080, 660, 1165), "View complaint status,\ncategory, priority,\nand suggested action")
    draw.ellipse((sx - 18, 1225, sx + 18, 1261), fill="#111827")

    # right lane
    draw_activity_box(draw, (1080, 250, 1360, 330), "Validate complaint input")
    draw.ellipse((1180, 395, 1340, 555), fill="#ffffff", outline="#111827", width=3)
    draw_centered_text(draw, (1180, 395, 1340, 555), "Valid\ninput?", FONT_SUBTITLE)
    draw_activity_box(draw, (1450, 420, 1740, 500), "Return validation error")
    draw_activity_box(draw, (1040, 625, 1400, 715), "Send request to AI analysis service")
    draw_activity_box(draw, (1040, 790, 1400, 880), "Generate category, priority,\ndepartment, suggested action,\nX-ready post")
    draw_activity_box(draw, (1040, 955, 1400, 1035), "Store complaint record")
    draw_activity_box(draw, (1040, 1120, 1400, 1200), "Return structured response")

    # arrows
    draw_polyline_arrow(draw, [(sx, 221), (sx, 250)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(sx, 320), (sx, 375)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(sx, 455), (sx, 520)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(610, 555), (1080, 555), (1080, 290)], width=4, arrow_size=12)
    draw_label(draw, (740, 515), "submit request")

    draw_polyline_arrow(draw, [(1220, 330), (1220, 395)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1340, 475), (1450, 460)], width=4, arrow_size=12)
    draw_label(draw, (1365, 410), "NO")
    draw_polyline_arrow(draw, [(1595, 500), (1595, 600), (520, 600), (520, 455)], width=4, arrow_size=12)
    draw_label(draw, (1240, 565), "show error")

    draw_polyline_arrow(draw, [(1260, 555), (1260, 625)], width=4, arrow_size=12)
    draw_label(draw, (1280, 570), "YES")
    draw_polyline_arrow(draw, [(1220, 715), (1220, 790)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1220, 880), (1220, 955)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1220, 1035), (1220, 1120)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1040, 1160), (660, 1160)], width=4, arrow_size=12)
    draw_label(draw, (790, 1180), "return complaint details")
    draw_polyline_arrow(draw, [(520, 1165), (520, 1225)], width=4, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_activity_submit_complaint_final.jpg", quality=95)


def create_activity_ai_analysis():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    frame = (330, 120, 1880, 1320)
    mid = draw_swimlane_frame(
        draw,
        frame,
        "Activity Diagram - AI Complaint Analysis Workflow",
        "User / Frontend",
        "Backend / AI System",
    )

    sx = 520
    draw.ellipse((sx - 18, 185, sx + 18, 221), fill="#111827")
    draw_activity_box(draw, (405, 250, 635, 330), "Open complaint detail\nor analysis view")
    draw_activity_box(draw, (405, 390, 635, 470), "Review or request\ncomplaint analysis")
    draw_activity_box(draw, (390, 1080, 660, 1165), "Display enriched complaint,\nstatus update, and\npublic-post draft")
    draw.ellipse((sx - 18, 1225, sx + 18, 1261), fill="#111827")

    draw_activity_box(draw, (1040, 240, 1400, 320), "Receive complaint query / analysis request")
    draw_activity_box(draw, (1080, 380, 1360, 460), "Validate request and\ncheck AI availability")
    draw.ellipse((1130, 525, 1310, 705), fill="#ffffff", outline="#111827", width=3)
    draw_centered_text(draw, (1130, 525, 1310, 705), "AI service\navailable?", FONT_SUBTITLE)
    draw_activity_box(draw, (1450, 430, 1760, 520), "Use AI model for\nstructured analysis")
    draw_activity_box(draw, (1450, 690, 1760, 780), "Use fallback rules /\ntemplates")
    draw_activity_box(draw, (1030, 845, 1410, 935), "Prepare normalized response")
    draw_activity_box(draw, (1030, 1000, 1410, 1090), "Update complaint tracking record")
    draw_activity_box(draw, (1030, 1155, 1410, 1245), "Send result back to frontend")

    draw_polyline_arrow(draw, [(sx, 221), (sx, 250)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(sx, 330), (sx, 390)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(635, 430), (1040, 430), (1040, 280)], width=4, arrow_size=12)
    draw_label(draw, (740, 390), "request analysis")

    draw_polyline_arrow(draw, [(1220, 320), (1220, 380)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1220, 460), (1220, 525)], width=4, arrow_size=12)

    draw_polyline_arrow(draw, [(1310, 585), (1450, 475)], width=4, arrow_size=12)
    draw_label(draw, (1325, 500), "YES")
    draw_polyline_arrow(draw, [(1220, 705), (1450, 735)], width=4, arrow_size=12)
    draw_label(draw, (1330, 720), "NO")

    draw_polyline_arrow(draw, [(1450, 475), (1410, 475), (1410, 890)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1450, 735), (1410, 735), (1410, 890)], width=4, arrow_size=12)
    draw_label(draw, (1460, 835), "analysis result / fallback result")

    draw_polyline_arrow(draw, [(1220, 935), (1220, 1000)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1220, 1090), (1220, 1155)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1030, 1200), (660, 1200)], width=4, arrow_size=12)
    draw_label(draw, (765, 1220), "return enriched output")
    draw_polyline_arrow(draw, [(520, 1165), (520, 1225)], width=4, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_activity_ai_analysis_final.jpg", quality=95)


def create_activity_onboarding():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    frame = (330, 120, 1880, 1320)
    draw_swimlane_frame(
        draw,
        frame,
        "Activity Diagram - User Onboarding Flow",
        "User / Frontend",
        "Backend / System",
    )

    sx = 520
    draw.ellipse((sx - 18, 185, sx + 18, 221), fill="#111827")
    draw_activity_box(draw, (400, 245, 650, 325), "User opens web / mobile app")
    draw_activity_box(draw, (420, 390, 630, 470), "Check user session\nor local state")
    draw.ellipse((430, 545, 650, 745), fill="#ffffff", outline="#111827", width=3)
    draw_centered_text(draw, (430, 545, 650, 745), "New or\nreturning\nuser?", FONT_SUBTITLE)
    draw_activity_box(draw, (360, 820, 720, 900), "Show welcome / intro message\nfor first-time users")
    draw_activity_box(draw, (360, 980, 720, 1060), "Load saved profile, X handle,\nand prior complaint state")
    draw_activity_box(draw, (430, 1130, 650, 1210), "Open home dashboard")
    draw.ellipse((sx - 18, 1265, sx + 18, 1301), fill="#111827")

    draw_activity_box(draw, (1030, 245, 1420, 325), "Validate app state and\nrestore persisted data if available")
    draw_activity_box(draw, (1030, 560, 1420, 640), "Fetch complaint summaries /\ndashboard data")
    draw_activity_box(draw, (1030, 740, 1420, 820), "Return dashboard response")
    draw_activity_box(draw, (1030, 920, 1420, 1000), "Enable tracking, complaint\nsubmission, and profile actions")

    draw_polyline_arrow(draw, [(sx, 221), (sx, 245)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(sx, 325), (sx, 390)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(630, 430), (1030, 430), (1030, 285)], width=4, arrow_size=12)
    draw_label(draw, (760, 390), "open app request")

    draw_polyline_arrow(draw, [(1225, 325), (1225, 560)], width=4, arrow_size=12)
    draw_label(draw, (1250, 430), "restore session / state")
    draw_polyline_arrow(draw, [(1030, 600), (650, 600)], width=4, arrow_size=12)
    draw_label(draw, (760, 620), "return user state")

    draw_polyline_arrow(draw, [(520, 470), (520, 545)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(430, 645), (360, 860)], width=4, arrow_size=12)
    draw_label(draw, (330, 710), "NEW")
    draw_polyline_arrow(draw, [(650, 645), (720, 1020)], width=4, arrow_size=12)
    draw_label(draw, (675, 760), "RETURNING")

    draw_polyline_arrow(draw, [(540, 900), (540, 1130)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(540, 1060), (540, 1130)], width=4, arrow_size=12)

    draw_polyline_arrow(draw, [(650, 1170), (1030, 1170), (1030, 960)], width=4, arrow_size=12)
    draw_label(draw, (760, 1130), "load dashboard actions")
    draw_polyline_arrow(draw, [(1225, 1000), (1225, 820)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1030, 780), (650, 780), (650, 1170)], width=4, arrow_size=12)
    draw_label(draw, (770, 800), "dashboard response")

    draw_polyline_arrow(draw, [(520, 1210), (520, 1265)], width=4, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_activity_onboarding_final.jpg", quality=95)


def draw_entity(draw, box, title, fields, fill="#ffffff", border="#111827"):
    x1, y1, x2, y2 = box
    draw.rectangle(box, outline=border, width=3, fill=fill)
    head_h = 44
    draw.rectangle((x1, y1, x2, y1 + head_h), outline=border, width=3, fill="#e5e7eb")
    draw.text((x1 + 14, y1 + 10), title, font=FONT_SUBTITLE, fill=TITLE)
    y = y1 + head_h + 14
    for field in fields:
        draw.text((x1 + 16, y), field, font=FONT_SMALL, fill=TEXT)
        y += 30


def create_er_class_diagram():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 44)
    draw.text((700, 70), "ER / Class Diagram - UrbanEye Data Model", font=title_font, fill=TITLE)

    user = (170, 220, 520, 560)
    complaint = (720, 150, 1120, 790)
    role = (170, 720, 520, 920)
    status = (1320, 220, 1670, 420)
    local_pref = (1320, 520, 1730, 790)

    draw_entity(
        draw,
        user,
        "USER",
        [
            "PK  id : String",
            "name : String",
            "email : String",
            "password : String",
            "role : Role",
            "createdAt : DateTime",
        ],
        fill="#f8fbff",
        border=BLUE_BORDER,
    )
    draw_entity(
        draw,
        complaint,
        "COMPLAINT",
        [
            "PK  id : String",
            "title : String",
            "description : String",
            "location : String",
            "category : String",
            "priority : String",
            "status : Status",
            "department : String",
            "sentiment : String",
            "confidence : Float",
            "suggestedAction : String",
            "socialPost : String",
            "image : String",
            "latitude : Float",
            "longitude : Float",
            "upvotes : Int",
            "FK  userId : String",
            "createdAt : DateTime",
        ],
        fill="#fdfcff",
        border=VIOLET_BORDER,
    )
    draw_entity(
        draw,
        role,
        "ROLE (Enum)",
        [
            "CITIZEN",
            "ADMIN",
            "AUTHORITY",
        ],
        fill="#eefaf1",
        border=GREEN_BORDER,
    )
    draw_entity(
        draw,
        status,
        "STATUS (Enum)",
        [
            "PENDING",
            "IN_PROGRESS",
            "RESOLVED",
        ],
        fill="#fff9ee",
        border=AMBER_BORDER,
    )
    draw_entity(
        draw,
        local_pref,
        "PROFILE / PREFERENCE",
        [
            "App-level / local state",
            "savedXHandle : String",
            "localComplaintCache : Array",
            "sessionPreferences : Object",
            "restoreOnStartup : Boolean",
        ],
        fill="#f8fafc",
        border="#94a3b8",
    )

    # Relationships
    draw_polyline_arrow(draw, [(520, 390), (620, 390), (620, 390), (720, 390)], width=4, arrow_size=12)
    draw_label(draw, (540, 335), "1 User creates many Complaints")
    draw.text((600, 405), "1", font=FONT_SMALL, fill=TITLE)
    draw.text((675, 405), "N", font=FONT_SMALL, fill=TITLE)

    draw_polyline_arrow(draw, [(345, 560), (345, 640), (345, 720)], width=4, arrow_size=12)
    draw_label(draw, (370, 620), "User has one Role")

    draw_polyline_arrow(draw, [(1120, 310), (1220, 310), (1220, 310), (1320, 310)], width=4, arrow_size=12)
    draw_label(draw, (1135, 250), "Complaint has one Status")

    draw_polyline_arrow(draw, [(1120, 620), (1210, 620), (1210, 620), (1320, 620)], width=4, arrow_size=12)
    draw_label(draw, (1135, 560), "User app stores local preferences")

    # Notes
    note_box = (690, 830, 1180, 1030)
    draw.rounded_rectangle(note_box, radius=20, fill="#ffffff", outline="#cbd5e1", width=3)
    draw.text((710, 855), "Design Note", font=FONT_SUBTITLE, fill=TITLE)
    note_lines = [
        "AI analysis fields are stored directly",
        "inside Complaint rather than a separate",
        "AIAnalysis table in the current project.",
        "This keeps retrieval simple for dashboard,",
        "mobile tracking, and admin monitoring.",
    ]
    y = 900
    for line in note_lines:
        draw.text((715, y), line, font=FONT_SMALL, fill=TEXT)
        y += 28

    img.save(OUT_DIR / "urbaneye_er_class_diagram_final.jpg", quality=95)


def create_component_interactions_board():
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    title_font = load_font("Arial Bold.ttf", 42)
    draw.text((920, 70), "UrbanEye", font=title_font, fill=TITLE)

    # Panel frames
    panel1 = (110, 180, 980, 1180)
    panel2 = (1030, 180, 1510, 1180)
    panel3 = (1560, 180, 2090, 1180)

    for box in [panel1, panel2, panel3]:
        draw.rectangle(box, outline="#d1d5db", width=2, fill="#ffffff")

    draw.text((140, 205), "1. SYSTEM COMPONENT INTERACTION", font=FONT_SUBTITLE, fill=TITLE)
    draw.text((1060, 205), "2. DATA / CACHE FLOW", font=FONT_SUBTITLE, fill=TITLE)
    draw.text((1590, 205), "3. ERROR HANDLING FLOW", font=FONT_SUBTITLE, fill=TITLE)

    # Panel 1
    draw_box(draw, (170, 260, 920, 420), "Client Layer (Web + Mobile)\n\nHome Dashboard    Complaint Form    Complaint Tracking    Admin View", "#eaf2ff", BLUE_BORDER, FONT_SMALL)
    draw_box(draw, (170, 490, 920, 690), "Backend API Handlers\n\nGET /api/complaints\nPOST /api/complaints\nGET /api/admin/overview\nGET /api/map/hotspots\nPOST /analyze", "#f3ebff", VIOLET_BORDER, FONT_SMALL)
    draw_box(draw, (170, 760, 920, 955), "Service Layer (Business Logic)\n\nComplaint Service    AI Integration Service\nAdmin Aggregation    Profile / Preference Service", "#f8fafc", "#94a3b8", FONT_SMALL)
    draw_box(draw, (170, 1010, 920, 1160), "Data / Provider Layer\n\nPrisma Database    AI Service API\nLocal Storage    Optional External Providers", "#eefaf1", GREEN_BORDER, FONT_SMALL)
    draw_polyline_arrow(draw, [(545, 420), (545, 490)], width=4, arrow_size=12)
    draw_label(draw, (575, 445), "HTTP request")
    draw_polyline_arrow(draw, [(545, 690), (545, 760)], width=4, arrow_size=12)
    draw_label(draw, (575, 715), "route to services")
    draw_polyline_arrow(draw, [(545, 955), (545, 1010)], width=4, arrow_size=12)
    draw_label(draw, (575, 970), "fetch / store data")

    # Panel 2
    draw_activity_box(draw, (1135, 270, 1410, 340), "Complaint request arrives")
    draw.ellipse((1180, 410, 1360, 590), fill="#ffffff", outline="#111827", width=3)
    draw_centered_text(draw, (1180, 410, 1360, 590), "Check local\ncache or saved\nstate", FONT_SUBTITLE)
    draw_activity_box(draw, (1075, 670, 1275, 740), "If found,\nreturn data")
    draw_activity_box(draw, (1305, 670, 1465, 740), "If not found,\nquery backend")
    draw_activity_box(draw, (1135, 845, 1410, 915), "Cache normalized data")
    draw_activity_box(draw, (1135, 1030, 1410, 1100), "Return response")
    draw_polyline_arrow(draw, [(1270, 340), (1270, 410)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1180, 500), (1175, 670)], width=4, arrow_size=12)
    draw_label(draw, (1085, 590), "FOUND")
    draw_polyline_arrow(draw, [(1360, 500), (1385, 670)], width=4, arrow_size=12)
    draw_label(draw, (1365, 590), "NOT FOUND")
    draw_polyline_arrow(draw, [(1385, 740), (1385, 880), (1410, 880)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1175, 740), (1175, 1065), (1135, 1065)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1270, 915), (1270, 1030)], width=4, arrow_size=12)

    # Panel 3
    draw_activity_box(draw, (1665, 270, 1985, 350), "AI service / backend issue\nor provider failure")
    draw.ellipse((1730, 430, 1910, 610), fill="#ffffff", outline="#111827", width=3)
    draw_centered_text(draw, (1730, 430, 1910, 610), "Check fallback\navailability", FONT_SUBTITLE)
    draw_activity_box(draw, (1600, 700, 1790, 780), "Use fallback data\nor local logic")
    draw_activity_box(draw, (1835, 700, 2050, 780), "Return error\nresponse")
    draw_activity_box(draw, (1650, 900, 1990, 980), "Log issue to monitoring /\nserver logs")
    draw_activity_box(draw, (1650, 1070, 1990, 1160), "Show user-friendly warning\nand keep platform usable", fill="#eef8dd", border="#84cc16", font=FONT_SMALL)
    draw_polyline_arrow(draw, [(1825, 350), (1825, 430)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1730, 520), (1695, 700)], width=4, arrow_size=12)
    draw_label(draw, (1630, 610), "if available")
    draw_polyline_arrow(draw, [(1910, 520), (1940, 700)], width=4, arrow_size=12)
    draw_label(draw, (1890, 610), "if unavailable")
    draw_polyline_arrow(draw, [(1695, 780), (1695, 900)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1940, 780), (1940, 900)], width=4, arrow_size=12)
    draw_polyline_arrow(draw, [(1820, 980), (1820, 1070)], width=4, arrow_size=12)

    img.save(OUT_DIR / "urbaneye_component_interactions_final.jpg", quality=95)


def draw_class_box(draw, box, title, properties, methods=None, fill="#ffffff", border="#111827"):
    x1, y1, x2, y2 = box
    draw.rectangle(box, outline=border, width=2, fill=fill)
    title_h = 38
    draw.rectangle((x1, y1, x2, y1 + title_h), outline=border, width=2, fill="#e5e7eb")
    draw.text((x1 + 10, y1 + 8), title, font=FONT_SMALL, fill=TITLE)
    y = y1 + title_h + 8
    draw.text((x1 + 10, y), "Properties", font=FONT_SMALL, fill=TITLE)
    y += 24
    for prop in properties:
        draw.text((x1 + 10, y), prop, font=load_font("Arial.ttf", 18), fill=TEXT)
        y += 22
    if methods:
        draw.line((x1, y + 2, x2, y + 2), fill=border, width=1)
        y += 10
        draw.text((x1 + 10, y), "Methods", font=FONT_SMALL, fill=TITLE)
        y += 24
        for method in methods:
            draw.text((x1 + 10, y), method, font=load_font("Arial.ttf", 18), fill=TEXT)
            y += 22


def create_detailed_class_diagram():
    img = Image.new("RGB", (2400, 1600), BG)
    draw = ImageDraw.Draw(img)
    title_font = load_font("Arial Bold.ttf", 40)
    draw.text((920, 60), "UrbanEye Detailed Class Diagram", font=title_font, fill=TITLE)

    # Left data classes
    user = (90, 180, 430, 560)
    complaint = (500, 120, 930, 890)
    airesult = (1010, 180, 1350, 560)
    dashboard = (1010, 650, 1350, 980)
    prefs = (90, 700, 430, 1020)

    # Right service classes
    complaint_service = (1490, 120, 1890, 560)
    ai_service = (1960, 120, 2320, 500)
    admin_service = (1490, 650, 1890, 980)
    profile_service = (1960, 600, 2320, 930)
    storage_service = (1490, 1070, 1890, 1420)

    draw_class_box(
        draw, user, "USER CLASS",
        [
            "- id: string",
            "- name: string",
            "- email: string",
            "- password: string",
            "- role: Role",
            "- createdAt: DateTime",
        ],
        ["+ register()", "+ login()", "+ submitComplaint()", "+ viewDashboard()"],
        fill="#eef4ff", border=BLUE_BORDER,
    )
    draw_class_box(
        draw, complaint, "COMPLAINT CLASS",
        [
            "- id: string",
            "- title: string",
            "- description: string",
            "- location: string",
            "- category: string",
            "- priority: string",
            "- status: Status",
            "- department: string",
            "- sentiment: string",
            "- confidence: float",
            "- suggestedAction: string",
            "- socialPost: string",
            "- image: string",
            "- latitude: float",
            "- longitude: float",
            "- upvotes: int",
            "- userId: string",
            "- createdAt: DateTime",
        ],
        ["+ create()", "+ validate()", "+ updateStatus()", "+ toJSON()"],
        fill="#f8f3ff", border=VIOLET_BORDER,
    )
    draw_class_box(
        draw, airesult, "AI_RESULT CLASS",
        [
            "- category: string",
            "- priority: string",
            "- department: string",
            "- sentiment: string",
            "- confidence: float",
            "- suggestedAction: string",
            "- socialPost: string",
        ],
        ["+ normalize()", "+ attachToComplaint()"],
        fill="#eefaf1", border=GREEN_BORDER,
    )
    draw_class_box(
        draw, dashboard, "DASHBOARD_SUMMARY CLASS",
        [
            "- totalComplaints: number",
            "- pendingCount: number",
            "- inProgressCount: number",
            "- resolvedCount: number",
            "- categoryBreakdown: object",
            "- departmentBreakdown: object",
        ],
        ["+ calculateCounts()", "+ buildOverview()"],
        fill="#fff8ec", border=AMBER_BORDER,
    )
    draw_class_box(
        draw, prefs, "PROFILE_PREFERENCE CLASS",
        [
            "- savedXHandle: string",
            "- localComplaintCache: array",
            "- sessionPreferences: object",
            "- restoreOnStartup: boolean",
        ],
        ["+ saveXHandle()", "+ restoreState()", "+ clearCache()"],
        fill="#f8fafc", border="#94a3b8",
    )
    draw_class_box(
        draw, complaint_service, "COMPLAINT_SERVICE CLASS",
        [
            "- prismaClient: object",
            "- fallbackStore: object",
        ],
        [
            "+ createComplaint()",
            "+ getComplaints()",
            "+ getComplaintById()",
            "+ updateComplaintStatus()",
            "+ normalizeComplaintData()",
        ],
        fill="#eef4ff", border=BLUE_BORDER,
    )
    draw_class_box(
        draw, ai_service, "AI_INTEGRATION_SERVICE CLASS",
        [
            "- analyzeEndpoint: string",
            "- fallbackRules: object",
        ],
        [
            "+ analyzeComplaint()",
            "+ getFallbackAnalysis()",
            "+ generateSocialPost()",
            "+ formatAIResponse()",
        ],
        fill="#eefaf1", border=GREEN_BORDER,
    )
    draw_class_box(
        draw, admin_service, "ADMIN_AGGREGATION_SERVICE CLASS",
        [
            "- complaintSource: object",
        ],
        [
            "+ getComplaintOverview()",
            "+ getStatusBreakdown()",
            "+ getCategoryBreakdown()",
            "+ getDepartmentBreakdown()",
        ],
        fill="#fff8ec", border=AMBER_BORDER,
    )
    draw_class_box(
        draw, profile_service, "PROFILE_SERVICE CLASS",
        [
            "- storage: object",
            "- userContext: object",
        ],
        [
            "+ saveXHandle()",
            "+ getUserProfile()",
            "+ restorePreferences()",
        ],
        fill="#f8fafc", border="#94a3b8",
    )
    draw_class_box(
        draw, storage_service, "STORAGE_PROVIDER CLASS",
        [
            "- prisma: object",
            "- localStorage: object",
            "- asyncStorage: object",
        ],
        [
            "+ saveRecord()",
            "+ loadRecord()",
            "+ cacheComplaint()",
            "+ restoreComplaintCache()",
        ],
        fill="#f8f3ff", border=VIOLET_BORDER,
    )

    # Relations / labels
    draw_polyline_arrow(draw, [(430, 340), (500, 340)], width=3, arrow_size=10)
    draw.text((445, 310), "1..N creates", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(930, 350), (1010, 350)], width=3, arrow_size=10)
    draw.text((940, 320), "produces", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(930, 760), (1010, 760)], width=3, arrow_size=10)
    draw.text((940, 730), "aggregates to", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(430, 860), (500, 860), (500, 930), (1490, 930)], width=3, arrow_size=10)
    draw.text((520, 875), "supports dashboard / profile state", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(1350, 350), (1490, 350)], width=3, arrow_size=10)
    draw.text((1365, 320), "used by", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(1890, 350), (1960, 300)], width=3, arrow_size=10)
    draw.text((1900, 285), "dependency", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(1890, 820), (1960, 760)], width=3, arrow_size=10)
    draw.text((1900, 735), "association", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(1690, 560), (1690, 650)], width=3, arrow_size=10)
    draw.text((1710, 595), "overview", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(1690, 980), (1690, 1070)], width=3, arrow_size=10)
    draw.text((1710, 1015), "storage", font=load_font("Arial.ttf", 18), fill=TITLE)

    draw_polyline_arrow(draw, [(2140, 500), (2140, 600)], width=3, arrow_size=10)
    draw.text((2160, 545), "fallback / profile", font=load_font("Arial.ttf", 18), fill=TITLE)

    img.save(OUT_DIR / "urbaneye_class_diagram_detailed_final.jpg", quality=95)


def main():
    create_use_case()
    create_dfd()
    create_level1_dfd()
    create_wbs()
    create_system_architecture()
    create_complaint_module_architecture()
    create_ai_workflow()
    create_data_access_layered_architecture()
    create_infrastructure_architecture()
    create_activity_submit_complaint()
    create_activity_ai_analysis()
    create_activity_onboarding()
    create_er_class_diagram()
    create_component_interactions_board()
    create_detailed_class_diagram()
    print(OUT_DIR / "urbaneye_use_case_diagram.jpg")
    print(OUT_DIR / "urbaneye_level0_dfd.jpg")
    print(OUT_DIR / "urbaneye_use_case_diagram_final.jpg")
    print(OUT_DIR / "urbaneye_level0_dfd_final.jpg")
    print(OUT_DIR / "urbaneye_level1_dfd_final.jpg")
    print(OUT_DIR / "urbaneye_wbs_final.jpg")
    print(OUT_DIR / "urbaneye_system_architecture_final.jpg")
    print(OUT_DIR / "urbaneye_complaint_module_architecture_final.jpg")
    print(OUT_DIR / "urbaneye_ai_workflow_final.jpg")
    print(OUT_DIR / "urbaneye_data_access_layer_final.jpg")
    print(OUT_DIR / "urbaneye_infrastructure_architecture_final.jpg")
    print(OUT_DIR / "urbaneye_activity_submit_complaint_final.jpg")
    print(OUT_DIR / "urbaneye_activity_ai_analysis_final.jpg")
    print(OUT_DIR / "urbaneye_activity_onboarding_final.jpg")
    print(OUT_DIR / "urbaneye_er_class_diagram_final.jpg")
    print(OUT_DIR / "urbaneye_component_interactions_final.jpg")
    print(OUT_DIR / "urbaneye_class_diagram_detailed_final.jpg")


if __name__ == "__main__":
    main()
