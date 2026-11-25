import { FormEvent, ReactNode, useMemo, useState } from "react";
import AssistantIA from "./components/AssistantIA";

type View =
  | "landing"
  | "login"
  | "dashboard"
  | "new"
  | "tickets"
  | "detail"
  | "notifications"
  | "profile"
  | "admin";

type IconName =
  | "home"
  | "plus"
  | "ticket"
  | "history"
  | "bell"
  | "user"
  | "logout"
  | "search"
  | "chevron"
  | "arrow"
  | "check"
  | "clock"
  | "headset"
  | "spark"
  | "shield"
  | "paperclip"
  | "send"
  | "eye"
  | "menu"
  | "calendar"
  | "filter"
  | "users"
  | "book"
  | "settings"
  | "close";

const iconPaths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4Z" />
      <path d="M13 5v2m0 3v2m0 3v2m0 2v-1" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 1 2-2h2v7H6a2 2 0 0 1-2-2Zm16 0a2 2 0 0 0-2-2h-2v7h2a2 2 0 0 0 2-2ZM16 19c0 2-2 2-4 2" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8ZM19 15l.6 2.1 1.9.9-1.9.9L19 21l-.6-2.1-1.9-.9 1.9-.9Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  paperclip: (
    <path d="m21 11-8.5 8.5a6 6 0 0 1-8.5-8.5L13 2a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.8-2.8L15 5.8" />
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  filter: <path d="M4 5h16l-6 7v5l-4 2v-7Z" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5Z" />
      <path d="M4 6v13.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button
      className={`brand ${light ? "brand-light" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="IDAT Te Acompaña - Ir al inicio"
    >
      <img
        src="/idat-logo.jpg"
        alt="Logo institucional IDAT"
        className="brand-logo"
      />

      <span className="brand-subtitle">
        TE ACOMPAÑA
      </span>
    </button>
  );
}

type Ticket = {
  code: string;
  subject: string;
  category: string;
  date: string;
  priority: string;
  status: string;
  advisor?: string;
  description?: string;
};

const initialTickets: Ticket[] = [
  {
    code: "IDT-2025-0482",
    subject: "Error en nota de evaluación final",
    category: "Académico",
    date: "12 Jun, 2025",
    priority: "Alta",
    status: "En atención",
  },
  {
    code: "IDT-2025-0467",
    subject: "Validación de pago de matrícula",
    category: "Pagos y matrícula",
    date: "10 Jun, 2025",
    priority: "Pendiente de evaluación",
    status: "Pendiente",
  },
  {
    code: "IDT-2025-0421",
    subject: "Acceso bloqueado a plataforma EVA",
    category: "Plataforma EVA",
    date: "04 Jun, 2025",
    priority: "Urgente",
    status: "Derivado",
  },
  {
    code: "IDT-2025-0398",
    subject: "Solicitud de constancia de estudios",
    category: "Administrativo",
    date: "29 May, 2025",
    priority: "Baja",
    status: "Solucionado",
  },
  {
    code: "IDT-2025-0376",
    subject: "Actualización de datos personales",
    category: "Administrativo",
    date: "25 May, 2025",
    priority: "Media",
    status: "Solucionado",
  },
];

function Status({ value }: { value: string }) {
  const type = value.toLowerCase().replace(" ", "-").replace("ó", "o");
  return (
    <span className={`status status-${type}`}>
      <i />
      {value}
    </span>
  );
}

function Priority({ value }: { value: string }) {
  return <span className={`priority priority-${value.toLowerCase()}`}>{value}</span>;
}

function Landing({ go }: { go: (view: View) => void }) {
  return (
    <div className="landing">
      <header className="landing-nav shell">
        <Brand />
        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#como-funciona">¿Cómo funciona?</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#faq">Preguntas frecuentes</a>
        </nav>
        <button className="btn btn-outline" onClick={() => go("login")}>
          Iniciar sesión <Icon name="arrow" size={17} />
        </button>
      </header>

      <main>
        <section className="hero shell" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow">
              <Icon name="spark" size={15} /> Estamos para acompañarte
            </div>
            <h1>
              Tu atención académica,
              <br />
              <span>más fácil</span> y sin complicaciones
            </h1>
            <p>
              Registra tus consultas, realiza el seguimiento de tus solicitudes y recibe respuestas
              sin tener que explicar tu problema varias veces.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => go("new")}>
                Registrar una solicitud <Icon name="arrow" size={18} />
              </button>
              <button className="btn btn-quiet btn-lg" onClick={() => go("tickets")}>
                <Icon name="search" size={18} /> Consultar mi ticket
              </button>
            </div>
            <div className="trust-row">
              <span>
                <Icon name="check" size={14} /> Seguimiento en tiempo real
              </span>
              <span>
                <Icon name="check" size={14} /> Atención centralizada
              </span>
            </div>
          </div>
          <HeroIllustration />
        </section>

        <section className="steps-section" id="como-funciona">
          <div className="shell">
            <div className="section-heading">
              <span>Simple y transparente</span>
              <h2>Resuelve tus solicitudes en 3 pasos</h2>
              <p>Un proceso claro para que siempre sepas qué sucede con tu caso.</p>
            </div>
            <div className="steps-grid">
              {[
                [
                  "01",
                  "Cuéntanos tu caso",
                  "Registra tu solicitud y adjunta la información necesaria.",
                  "book",
                ],
                [
                  "02",
                  "Sigue el progreso",
                  "Recibe notificaciones y conoce quién atiende tu caso.",
                  "clock",
                ],
                [
                  "03",
                  "Obtén una solución",
                  "Conversa con tu asesor y confirma cuando esté resuelto.",
                  "check",
                ],
              ].map(([n, title, text, icon]) => (
                <div className="step-card" key={n}>
                  <span className="step-number">{n}</span>
                  <div className="step-icon">
                    <Icon name={icon as IconName} size={25} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="benefits shell" id="beneficios">
          <div className="benefit-panel">
            <div>
              <span className="section-kicker">Todo en un solo lugar</span>
              <h2>
                Tu tiempo importa.
                <br />
                Tu tranquilidad también.
              </h2>
              <p>Una experiencia pensada para acompañarte durante toda tu vida académica.</p>
            </div>
            <div className="benefit-list">
              <div>
                <Icon name="clock" />
                <span>
                  <b>Respuesta más rápida</b>
                  <small>Tu solicitud llega directamente al área correcta.</small>
                </span>
              </div>
              <div>
                <Icon name="shield" />
                <span>
                  <b>Información segura</b>
                  <small>Toda tu conversación queda registrada y protegida.</small>
                </span>
              </div>
              <div>
                <Icon name="bell" />
                <span>
                  <b>Siempre informado</b>
                  <small>Recibe alertas cada vez que tu caso avance.</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="faq shell" id="faq">
          <div className="section-heading">
            <span>Preguntas frecuentes</span>
            <h2>Estamos para ayudarte</h2>
          </div>
          {[
            "¿Necesito ser estudiante activo para registrar una solicitud?",
            "¿Cuánto demora la atención de mi ticket?",
            "¿Puedo adjuntar capturas o documentos?",
          ].map((q, i) => (
            <details key={q} open={i === 0}>
              <summary>
                {q}
                <Icon name="plus" />
              </summary>
              <p>
                {i === 0
                  ? "Sí, ingresa con tu correo institucional para validar tus datos y brindarte una atención personalizada."
                  : "Encontrarás toda la información y actualizaciones dentro del detalle de tu solicitud."}
              </p>
            </details>
          ))}
        </section>
      </main>
      <footer>
        <div className="shell">
          <Brand light />
          <p>Una iniciativa para acompañar a la comunidad estudiantil IDAT.</p>
          <small>© 2025 IDAT. Todos los derechos reservados.</small>
        </div>
      </footer>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="hero-visual">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="floating-card float-ticket">
        <span>
          <Icon name="ticket" size={20} />
        </span>
        <div>
          <small>Ticket actualizado</small>
          <b>En atención</b>
        </div>
        <Icon name="check" size={17} />
      </div>
      <div className="floating-card float-message">
        <span>
          <Icon name="bell" size={20} />
        </span>
        <div>
          <small>Nueva respuesta</small>
          <b>Hace 2 minutos</b>
        </div>
      </div>
      <svg
        className="student-art"
        viewBox="0 0 540 430"
        role="img"
        aria-label="Estudiante usando una laptop para recibir soporte académico"
      >
        <ellipse cx="280" cy="399" rx="190" ry="18" fill="#bddcf6" opacity=".48" />
        <path d="M163 336c8-64 40-100 87-113 52-14 109 10 131 65l18 80H145Z" fill="#fff" />
        <path
          d="M206 240c11-18 35-27 55-27 41 0 70 24 80 61l18 94H170l13-79c4-23 11-38 23-49Z"
          fill="#0868c9"
        />
        <path d="M258 213c7 11 27 11 35 0v32c-8 10-29 10-37 0Z" fill="#f3b18c" />
        <ellipse cx="275" cy="178" rx="43" ry="51" fill="#ffc7a6" />
        <path
          d="M233 174c-5-33 11-58 43-58 26 0 45 16 46 46-11-9-22-20-30-31-12 16-33 27-59 31Z"
          fill="#19385b"
        />
        <path
          d="M233 170c-10-4-13 6-8 16 3 8 10 11 14 6M319 170c10-4 13 6 8 16-3 8-10 11-14 6"
          fill="#ffc7a6"
        />
        <circle cx="258" cy="177" r="2.4" fill="#19385b" />
        <circle cx="294" cy="177" r="2.4" fill="#19385b" />
        <path
          d="M267 196c6 4 12 4 18 0"
          stroke="#c87465"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M181 278c-18 11-33 31-41 61l40 10 35-66ZM337 278c20 7 36 28 43 56l-36 12-34-61Z"
          fill="#ffc7a6"
        />
        <path d="M117 290h211l32 105H150Z" fill="#d7ebfa" stroke="#8bbde6" strokeWidth="3" />
        <path
          d="M328 290h20l31 103c2 6-2 10-8 10H152c-7 0-12-3-14-9l-29-94c-2-6 2-10 8-10Z"
          fill="#eff8ff"
        />
        <circle cx="245" cy="344" r="18" fill="#0a70d7" opacity=".14" />
        <path
          d="m239 344 5 5 9-11"
          stroke="#0a70d7"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M100 395h298" stroke="#0b4c8d" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M413 139c-9-22 1-51 27-58 26-7 52 10 58 36 6 26-11 51-37 57-10 2-20 1-29-3l-23 11 6-25c-1-6-2-12-2-18Z"
          fill="#fff"
          stroke="#9ecff0"
          strokeWidth="3"
        />
        <path d="M438 130h36M438 142h24" stroke="#0a70d7" strokeWidth="5" strokeLinecap="round" />
        <circle cx="143" cy="129" r="40" fill="#e8f5ff" />
        <path d="M125 131h36M143 113v36" stroke="#44a0e6" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Login({ go }: { go: (view: View) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-aside">
        <button className="back-link" onClick={() => go("landing")}>
          <span>←</span> Volver al inicio
        </button>
        <div className="auth-aside-copy">
          <Brand light />
          <h2>
            Estamos contigo
            <br />
            en cada paso.
          </h2>
          <p>
            Centraliza tus consultas, conversa con tu asesor y sigue el avance de tus solicitudes.
          </p>
          <div className="auth-quote">
            “Ahora puedo saber exactamente quién está atendiendo mi solicitud.”
            <small>— Andrea, estudiante de Diseño Digital</small>
          </div>
        </div>
        <div className="auth-shape" />
      </div>
      <div className="auth-form-wrap">
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            go("dashboard");
          }}
        >
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="auth-kicker">Bienvenido de vuelta</span>
          <h1>Inicia sesión</h1>
          <p>Ingresa con tus credenciales institucionales.</p>
          <label>
            Correo institucional
            <div className="input-box">
              <span className="at-icon">@</span>
              <input type="email" defaultValue="valeria.quispe@idat.edu.pe" required />
            </div>
          </label>
          <label>
            Contraseña
            <div className="input-box">
              <input type={show ? "text" : "password"} defaultValue="idat2025" required />
              <button type="button" onClick={() => setShow(!show)} aria-label="Mostrar contraseña">
                <Icon name="eye" size={19} />
              </button>
            </div>
          </label>
          <div className="form-row">
            <label className="check-label">
              <input type="checkbox" defaultChecked /> <span /> Recordar sesión
            </label>
            <button type="button" className="text-button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <button className="btn btn-primary btn-submit">
            Iniciar sesión <Icon name="arrow" size={18} />
          </button>
          <div className="secure-note">
            <Icon name="shield" size={16} /> Acceso seguro para estudiantes IDAT
          </div>
        </form>
      </div>
    </div>
  );
}

const navItems: { view: View; label: string; icon: IconName }[] = [
  { view: "dashboard", label: "Inicio", icon: "home" },
  { view: "new", label: "Crear solicitud", icon: "plus" },
  { view: "tickets", label: "Mis tickets", icon: "ticket" },
  { view: "tickets", label: "Historial", icon: "history" },
  { view: "notifications", label: "Notificaciones", icon: "bell" },
  { view: "profile", label: "Mi perfil", icon: "user" },
];

function AppShell({
  view,
  go,
  title,
  subtitle,
  children,
}: {
  view: View;
  go: (v: View) => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <div className="app-shell">
      <aside className={mobileMenu ? "sidebar open" : "sidebar"}>
        <div className="side-top">
          <Brand light />
          <button className="mobile-close" onClick={() => setMobileMenu(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="student-mini">
          <div className="avatar">VQ</div>
          <div>
            <b>Valeria Quispe</b>
            <small>Estudiante · Diseño Digital</small>
          </div>
        </div>
        <nav>
          {navItems.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              className={
                view === item.view && !(item.label === "Historial" && view === "tickets")
                  ? "active"
                  : ""
              }
              onClick={() => {
                go(item.view);
                setMobileMenu(false);
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "Notificaciones" && <i className="nav-dot">3</i>}
            </button>
          ))}
        </nav>
        <div className="support-card">
          <span>
            <Icon name="headset" />
          </span>
          <b>¿Necesitas ayuda?</b>
          <small>Revisa nuestras preguntas frecuentes.</small>
          <button>Centro de ayuda</button>
        </div>
        <button className="logout-button" onClick={() => go("landing")}>
          <Icon name="logout" /> Cerrar sesión
        </button>
      </aside>
      {mobileMenu && (
        <button
          className="backdrop"
          onClick={() => setMobileMenu(false)}
          aria-label="Cerrar menú"
        />
      )}
      <main className="app-main">
        <header className="app-header">
          <button className="menu-button" onClick={() => setMobileMenu(true)}>
            <Icon name="menu" />
          </button>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="header-actions">
            <button className="icon-button" onClick={() => go("notifications")}>
              <Icon name="bell" />
              <i />
            </button>
            <button className="header-profile" onClick={() => go("profile")}>
              <span className="avatar">VQ</span>
              <span>
                <b>Valeria</b>
                <small>Estudiante</small>
              </span>
              <span>⌄</span>
            </button>
          </div>
        </header>
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

function Dashboard({ go, tickets }: { go: (v: View) => void; tickets: Ticket[] }) {
  const stats = [
    ["Total de solicitudes", "12", "ticket", "blue", "+2 este mes"],
    ["Pendientes", "2", "clock", "orange", "Requieren atención"],
    ["En atención", "3", "headset", "cyan", "En proceso"],
    ["Solucionadas", "7", "check", "green", "58% del total"],
  ];
  return (
    <AppShell
      view="dashboard"
      go={go}
      title="¡Hola, Valeria!"
      subtitle="Aquí tienes un resumen de tus solicitudes."
    >
      <div className="welcome-banner">
        <div>
          <span>MIÉRCOLES, 18 DE JUNIO</span>
          <h2>¿En qué podemos ayudarte hoy?</h2>
          <p>Nuestro equipo está listo para resolver tus consultas académicas y administrativas.</p>
          <button className="btn btn-white" onClick={() => go("new")}>
            <Icon name="plus" size={18} /> Nueva solicitud
          </button>
        </div>
        <div className="banner-art">
          <Icon name="headset" size={78} strokeWidth={1.2} />
          <span className="signal s1" />
          <span className="signal s2" />
          <span className="signal s3" />
        </div>
      </div>
      <div className="stats-grid">
        {stats.map(([label, value, icon, color, note]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon name={icon as IconName} />
            </div>
            <div className="stat-value">{value}</div>
            <b>{label}</b>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <section className="content-card">
        <div className="card-heading">
          <div>
            <h2>Solicitudes recientes</h2>
            <p>Revisa el estado de tus últimos tickets.</p>
          </div>
          <button className="text-button" onClick={() => go("tickets")}>
            Ver todas <Icon name="arrow" size={16} />
          </button>
        </div>
        <TicketTable rows={tickets.slice(0, 4)} go={go} />
      </section>
      <div className="dashboard-bottom">
        <div className="tip-card">
          <div className="tip-icon">
            <Icon name="spark" />
          </div>
          <div>
            <span>CONSEJO IDAT</span>
            <h3>Describe tu solicitud con claridad</h3>
            <p>Incluye fechas, cursos y capturas. Así podremos ayudarte mucho más rápido.</p>
          </div>
        </div>
        <button className="admin-access" onClick={() => go("admin")}>
          <Icon name="settings" />
          <span>
            <b>Vista demostración</b>
            <small>Ir al panel administrativo</small>
          </span>
          <Icon name="chevron" />
        </button>
      </div>
    </AppShell>
  );
}

function TicketTable({
  rows,
  go,
  admin = false,
  onPriorityChange,
  onManage,
}: {
  rows: Ticket[];
  go: (v: View) => void;
  admin?: boolean;
  onPriorityChange?: (code: string, priority: string) => void;
  onManage?: (code: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            {admin && <th>Estudiante</th>}
            <th>Asunto</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Prioridad</th>
            <th>Estado</th>
            {admin && <th>Asesor</th>}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((ticket, i) => (
            <tr key={ticket.code}>
              <td>
                <b className="ticket-code">{ticket.code}</b>
              </td>
              {admin && (
                <td>
                  <div className="student-cell">
                    <span>{["VQ", "JM", "AR", "LC", "FS"][i]}</span>
                    {
                      [
                        "Valeria Quispe",
                        "Jorge Muñoz",
                        "Ana Rojas",
                        "Luis Castro",
                        "Fiorella Soto",
                      ][i]
                    }
                  </div>
                </td>
              )}
              <td>
                <b>{ticket.subject}</b>
              </td>
              <td>{ticket.category}</td>
              <td>{ticket.date}</td>
              <td>
                {admin ? (
                  <select
                    className="admin-priority-select"
                    aria-label={`Asignar prioridad a ${ticket.code}`}
                    value={ticket.priority}
                    onChange={(e) => onPriorityChange?.(ticket.code, e.target.value)}
                  >
                    <option value="Pendiente de evaluación">Pendiente de evaluación</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Emergencia</option>
                  </select>
                ) : (
                  ticket.priority === "Pendiente de evaluación"
                    ? <span className="priority">Pendiente de evaluación</span>
                    : <Priority value={ticket.priority} />
                )}
              </td>
              <td>
                <Status value={ticket.status} />
              </td>
              {admin && (
                <td>
                  {ticket.advisor ?? (i === 1
                    ? "Sin asignar"
                    : ["María Paredes", "—", "Carlos León", "Ana Torres", "María Paredes"][i])}
                </td>
              )}
              <td>
                <button className="row-action" onClick={() => admin ? onManage?.(ticket.code) : go("detail")}>
                  <span>{admin ? "Gestionar" : "Ver detalle"}</span>
                  <Icon name="chevron" size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewTicket({ go }: { go: (v: View) => void }) {
  const [submitted, setSubmitted] = useState(false);
  if (submitted)
    return (
      <AppShell
        view="new"
        go={go}
        title="Crear solicitud"
        subtitle="Cuéntanos qué necesitas y te ayudaremos."
      >
        <div className="success-panel">
          <div className="success-rings">
            <div>
              <Icon name="check" size={44} strokeWidth={2.4} />
            </div>
          </div>
          <span className="success-kicker">SOLICITUD REGISTRADA</span>
          <h2>¡Recibimos tu solicitud!</h2>
          <p>
            Tu caso fue registrado correctamente. Te notificaremos cada vez que tenga una
            actualización.
          </p>
          <div className="ticket-receipt">
            <small>CÓDIGO DE SEGUIMIENTO</small>
            <strong>IDT-2025-0491</strong>
            <button onClick={() => navigator.clipboard?.writeText("IDT-2025-0491")}>
              Copiar código
            </button>
          </div>
          <div className="success-info">
            <Icon name="clock" />
            <span>
              <b>Tiempo estimado de respuesta</b>
              <small>Entre 24 y 48 horas hábiles</small>
            </span>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => go("detail")}>
              Ver seguimiento <Icon name="arrow" size={17} />
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSubmitted(false);
                window.scrollTo(0, 0);
              }}
            >
              Crear otra solicitud
            </button>
          </div>
        </div>
      </AppShell>
    );
  return (
    <AppShell
      view="new"
      go={go}
      title="Crear una solicitud"
      subtitle="Completa la información para que podamos ayudarte mejor."
    >
      <div className="form-layout">
        <form
          className="ticket-form content-card"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            window.scrollTo(0, 0);
          }}
        >
          <div className="form-section-heading">
            <span>1</span>
            <div>
              <h2>Datos del estudiante</h2>
              <p>Verifica que tus datos sean correctos.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Nombre del estudiante
              <input value="Valeria Quispe Ramírez" readOnly />
            </label>
            <label>
              Código de estudiante
              <input value="2023104582" readOnly />
            </label>
            <label className="wide">
              Correo institucional
              <input value="valeria.quispe@idat.edu.pe" readOnly />
            </label>
          </div>
          <hr />
          <div className="form-section-heading">
            <span>2</span>
            <div>
              <h2>Cuéntanos sobre tu solicitud</h2>
              <p>Mientras más detalles incluyas, mejor podremos orientarte.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Categoría
              <select required defaultValue="">
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                <option>Académico</option>
                <option>Administrativo</option>
                <option>Pagos y matrícula</option>
                <option>Plataforma EVA</option>
                <option>Soporte técnico</option>
                <option>Otros</option>
              </select>
            </label>
            <label className="wide">
              Asunto
              <input placeholder="Ej. No puedo visualizar mi nota final" required />
            </label>
            <label className="wide">
              Descripción detallada
              <textarea
                placeholder="Describe qué sucedió, cuándo empezó el problema y cualquier información relevante..."
                maxLength={500}
                required
              />
              <small className="char-count">Máximo 500 caracteres</small>
            </label>
            <label className="wide">
              Archivos adjuntos <small>(opcional)</small>
              <div className="drop-zone">
                <Icon name="paperclip" size={24} />
                <b>
                  Arrastra tus archivos aquí o <span>selecciónalos</span>
                </b>
                <small>PNG, JPG o PDF · Máximo 10 MB</small>
                <input type="file" multiple />
              </div>
            </label>
          </div>
          <div className="form-footer">
            <span>
              <Icon name="shield" size={17} /> Tus datos están protegidos
            </span>
            <button className="btn btn-primary btn-lg">
              Enviar solicitud <Icon name="send" size={18} />
            </button>
          </div>
        </form>
        <aside className="form-help">
          <div className="help-icon">
            <Icon name="spark" />
          </div>
          <h3>Antes de enviar</h3>
          <ul>
            <li>
              <Icon name="check" /> Elige la categoría correcta.
            </li>
            <li>
              <Icon name="check" /> Describe el problema con detalle.
            </li>
            <li>
              <Icon name="check" /> Adjunta evidencia si la tienes.
            </li>
          </ul>
          <div className="help-separator" />
          <b>¿Cómo se define la prioridad?</b>
          <p>Un asesor revisará tu solicitud y determinará si es baja, media, alta o una emergencia, según la situación que describas.</p>
        </aside>
      </div>
    </AppShell>
  );
}

function Tickets({ go, tickets }: { go: (v: View) => void; tickets: Ticket[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos los estados");
  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (t.code + t.subject).toLowerCase().includes(query.toLowerCase()) &&
          (status === "Todos los estados" || t.status === status),
      ),
    [query, status],
  );
  return (
    <AppShell
      view="tickets"
      go={go}
      title="Mis tickets"
      subtitle="Consulta y da seguimiento a todas tus solicitudes."
    >
      <div className="page-actions">
        <div className="mini-summary">
          <b>12</b>
          <span>Solicitudes totales</span>
          <i /> <b>5</b>
          <span>En proceso</span>
        </div>
        <button className="btn btn-primary" onClick={() => go("new")}>
          <Icon name="plus" size={18} /> Nueva solicitud
        </button>
      </div>
      <section className="content-card">
        <div className="filters">
          <div className="search-input">
            <Icon name="search" size={19} />
            <input
              placeholder="Buscar por código o asunto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select>
            <option>Todas las categorías</option>
            <option>Académico</option>
            <option>Administrativo</option>
            <option>Plataforma EVA</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>En atención</option>
            <option>Derivado</option>
            <option>Solucionado</option>
          </select>
          <button className="filter-date">
            <Icon name="calendar" size={18} /> Cualquier fecha
          </button>
        </div>
        <div className="result-meta">
          <span>
            Mostrando <b>{filtered.length}</b> de 12 solicitudes
          </span>
          <button>
            <Icon name="filter" size={16} /> Limpiar filtros
          </button>
        </div>
        <TicketTable rows={filtered} go={go} />
        <div className="pagination">
          <button disabled>←</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>→</button>
        </div>
      </section>
    </AppShell>
  );
}

function TicketDetail({ go }: { go: (v: View) => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["Gracias, quedo atenta a la validación."]);
  const steps = [
    "Solicitud registrada",
    "Solicitud recibida",
    "En revisión",
    "En atención",
    "Solucionada",
  ];
  return (
    <AppShell
      view="detail"
      go={go}
      title="Detalle de solicitud"
      subtitle="Consulta el avance y conversa con tu asesor."
    >
      <button className="back-to-list" onClick={() => go("tickets")}>
        ← Volver a mis tickets
      </button>
      <div className="detail-header content-card">
        <div>
          <div className="detail-code">
            <span>IDT-2025-0482</span>
            <Status value="En atención" />
          </div>
          <h2>Error en nota de evaluación final</h2>
          <p>Creado el 12 de junio de 2025 · Última actualización hace 2 horas</p>
        </div>
        <button className="more-button">•••</button>
        <div className="detail-facts">
          <div>
            <small>CATEGORÍA</small>
            <b>Académico</b>
          </div>
          <div>
            <small>PRIORIDAD</small>
            <Priority value="Alta" />
          </div>
          <div>
            <small>ASESORA RESPONSABLE</small>
            <span className="advisor">
              <i>MP</i>
              <b>María Paredes</b>
            </span>
          </div>
          <div>
            <small>TIEMPO TRANSCURRIDO</small>
            <b>4 días</b>
          </div>
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <section className="content-card progress-card">
            <div className="card-heading">
              <div>
                <h2>Progreso de tu solicitud</h2>
                <p>Estamos trabajando para resolver tu caso.</p>
              </div>
              <span className="progress-percent">75% completado</span>
            </div>
            <div className="timeline">
              {steps.map((step, i) => (
                <div
                  className={`timeline-step ${i < 4 ? "done" : ""} ${i === 3 ? "current" : ""}`}
                  key={step}
                >
                  <span>{i < 3 ? <Icon name="check" size={15} /> : i + 1}</span>
                  <b>{step}</b>
                  <small>
                    {i < 4
                      ? ["12 Jun · 09:32", "12 Jun · 09:35", "12 Jun · 11:10", "13 Jun · 08:45"][i]
                      : "Pendiente"}
                  </small>
                </div>
              ))}
            </div>
          </section>
          <section className="content-card conversation">
            <div className="card-heading">
              <div>
                <h2>Conversación</h2>
                <p>Todo el historial de tu caso en un solo lugar.</p>
              </div>
            </div>
            <div className="message student-message">
              <div className="message-avatar">VQ</div>
              <div>
                <div className="message-meta">
                  <b>Tú</b>
                  <span>12 Jun · 09:32</span>
                </div>
                <div className="message-bubble">
                  Hola, en el portal figura una nota de 11 en mi evaluación final del curso Diseño
                  de Interfaces, pero mi docente me indicó que obtuve 16. Adjunto la captura del
                  aula virtual.
                </div>
                <div className="attachment">
                  <Icon name="paperclip" size={16} />
                  <span>
                    <b>captura_nota_final.png</b>
                    <small>1.2 MB</small>
                  </span>
                  <button>Ver</button>
                </div>
              </div>
            </div>
            <div className="day-divider">
              <span>13 DE JUNIO</span>
            </div>
            <div className="message advisor-message">
              <div className="message-avatar">MP</div>
              <div>
                <div className="message-meta">
                  <b>
                    María Paredes <em>Asesora IDAT</em>
                  </b>
                  <span>13 Jun · 08:45</span>
                </div>
                <div className="message-bubble">
                  Hola, Valeria. Gracias por enviarnos la evidencia. Ya nos comunicamos con el área
                  académica para validar la calificación registrada. Te confirmaré apenas tengamos
                  respuesta.
                </div>
              </div>
            </div>
            {messages.map((m, i) => (
              <div className="message student-message compact" key={`${m}-${i}`}>
                <div className="message-avatar">VQ</div>
                <div>
                  <div className="message-meta">
                    <b>Tú</b>
                    <span>Hoy</span>
                  </div>
                  <div className="message-bubble">{m}</div>
                </div>
              </div>
            ))}
            <form
              className="reply-box"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  setMessages([...messages, message]);
                  setMessage("");
                }
              }}
            >
              <textarea
                placeholder="Escribe un mensaje para tu asesora..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div>
                <button type="button" className="attach-button">
                  <Icon name="paperclip" size={18} /> Adjuntar archivo
                </button>
                <button className="btn btn-primary">
                  Enviar mensaje <Icon name="send" size={16} />
                </button>
              </div>
            </form>
          </section>
        </div>
        <aside>
          <div className="side-info-card">
            <h3>Resumen del caso</h3>
            <div>
              <small>Curso</small>
              <b>Diseño de Interfaces</b>
            </div>
            <div>
              <small>Periodo académico</small>
              <b>2025 - I</b>
            </div>
            <div>
              <small>Sede</small>
              <b>Lima Centro</b>
            </div>
            <div>
              <small>Área responsable</small>
              <b>Coordinación Académica</b>
            </div>
          </div>
          <div className="solution-card">
            <div>
              <Icon name="shield" />
            </div>
            <h3>¿Tu caso ya fue resuelto?</h3>
            <p>Cuando confirmes la solución, el ticket se cerrará.</p>
            <button
              className="btn btn-outline"
              onClick={() => alert("Gracias. Registramos tu confirmación.")}
            >
              Confirmar solución
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Notifications({ go }: { go: (v: View) => void }) {
  const items = [
    [
      "Nueva respuesta de tu asesora",
      "María Paredes respondió en tu ticket IDT-2025-0482.",
      "Hace 2 horas",
      "headset",
      "blue",
    ],
    [
      "Tu solicitud está en atención",
      "El ticket IDT-2025-0482 cambió al estado En atención.",
      "Ayer, 08:45",
      "clock",
      "cyan",
    ],
    [
      "Solicitud derivada",
      "Tu solicitud sobre acceso a EVA fue enviada a Soporte técnico.",
      "15 Jun, 16:20",
      "arrow",
      "purple",
    ],
    [
      "Solicitud solucionada",
      "La constancia de estudios ya está disponible para descargar.",
      "04 Jun, 11:12",
      "check",
      "green",
    ],
    [
      "Solicitud registrada correctamente",
      "Recibimos tu ticket IDT-2025-0467. Te avisaremos sobre los avances.",
      "10 Jun, 09:05",
      "ticket",
      "orange",
    ],
  ];
  return (
    <AppShell
      view="notifications"
      go={go}
      title="Notificaciones"
      subtitle="Mantente al día con el avance de tus solicitudes."
    >
      <div className="page-actions">
        <div className="tabs">
          <button className="active">
            Todas <span>5</span>
          </button>
          <button>
            No leídas <span>3</span>
          </button>
        </div>
        <button className="text-button">
          <Icon name="check" size={16} /> Marcar todas como leídas
        </button>
      </div>
      <section className="content-card notification-list">
        {items.map(([title, text, time, icon, color], i) => (
          <button
            className={i < 3 ? "notification unread" : "notification"}
            key={title}
            onClick={() => go("detail")}
          >
            <span className={`notification-icon ${color}`}>
              <Icon name={icon as IconName} />
            </span>
            <span className="notification-copy">
              <b>{title}</b>
              <small>{text}</small>
              <em>{time}</em>
            </span>
            {i < 3 && <i className="unread-dot" />}
            <Icon name="chevron" />
          </button>
        ))}
      </section>
    </AppShell>
  );
}

function Profile({ go }: { go: (v: View) => void }) {
  return (
    <AppShell
      view="profile"
      go={go}
      title="Mi perfil"
      subtitle="Administra tu información personal y preferencias."
    >
      <div className="profile-grid">
        <aside className="content-card profile-summary">
          <div className="profile-photo">
            VQ<button>✎</button>
          </div>
          <h2>Valeria Quispe Ramírez</h2>
          <p>Diseño Gráfico Digital</p>
          <span className="student-status">
            <i /> Estudiante activa
          </span>
          <hr />
          <div>
            <small>CÓDIGO DE ESTUDIANTE</small>
            <b>2023104582</b>
          </div>
          <div>
            <small>SEDE</small>
            <b>Lima Centro</b>
          </div>
          <div>
            <small>PERIODO</small>
            <b>2025 - I</b>
          </div>
        </aside>
        <div className="content-card profile-form">
          <div className="card-heading">
            <div>
              <h2>Información personal</h2>
              <p>Estos datos provienen de tu registro académico.</p>
            </div>
            <button className="btn btn-outline">Editar datos</button>
          </div>
          <div className="form-grid">
            <label>
              Nombres
              <input value="Valeria" readOnly />
            </label>
            <label>
              Apellidos
              <input value="Quispe Ramírez" readOnly />
            </label>
            <label>
              Correo institucional
              <input value="valeria.quispe@idat.edu.pe" readOnly />
            </label>
            <label>
              Teléfono
              <input value="+51 987 654 321" readOnly />
            </label>
          </div>
          <hr />
          <div className="card-heading">
            <div>
              <h2>Preferencias de notificación</h2>
              <p>Elige cómo quieres recibir las novedades.</p>
            </div>
          </div>
          <div className="preference">
            <span>
              <b>Notificaciones por correo</b>
              <small>Recibe actualizaciones de tus tickets.</small>
            </span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <i />
            </label>
          </div>
          <div className="preference">
            <span>
              <b>Recordatorios de seguimiento</b>
              <small>Te avisaremos si hay una acción pendiente.</small>
            </span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <i />
            </label>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Admin({
  go,
  tickets,
  setTickets,
}: {
  go: (v: View) => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}) {
  const [filter, setFilter] = useState("Todos");
  const [adminSection, setAdminSection] = useState("Resumen");
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdvisor, setNewAdvisor] = useState("");
  const [newAdvisorArea, setNewAdvisorArea] = useState("Académico");
  const [advisors, setAdvisors] = useState([
    { name: "María Paredes", area: "Académico" },
    { name: "Carlos León", area: "Soporte técnico" },
    { name: "Ana Torres", area: "Administrativo" },
    { name: "Luis Castro", area: "Matrícula y pagos" },
  ]);
  const [categories, setCategories] = useState([
    { name: "Académico", description: "Notas, cursos y evaluaciones" },
    { name: "Administrativo", description: "Constancias y datos personales" },
    { name: "Pagos y matrícula", description: "Pagos, cuotas y matrícula" },
    { name: "Plataforma EVA", description: "Acceso y problemas de plataforma" },
    { name: "Soporte técnico", description: "Problemas técnicos y equipos" },
    { name: "Otros", description: "Consultas generales" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const selectedTicket = tickets.find((ticket) => ticket.code === selectedCode) ?? null;

  const updateTicket = (code: string, changes: Partial<Ticket>) => {
    setTickets((current) =>
      current.map((ticket) => ticket.code === code ? { ...ticket, ...changes } : ticket)
    );
  };

  const updatePriority = (code: string, priority: string) => {
    updateTicket(code, { priority });
  };
  const rows = tickets.filter((ticket) => {
    const matchesFilter = filter === "Todos" || ticket.status === filter || ticket.priority === filter;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [
      ticket.code, ticket.subject, ticket.category, ticket.advisor ?? "",
    ].some((value) => value.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const addAdvisor = () => {
    const name = newAdvisor.trim();
    if (!name || advisors.some((advisor) => advisor.name.toLowerCase() === name.toLowerCase())) return;
    setAdvisors((current) => [...current, { name, area: newAdvisorArea }]);
    setNewAdvisor("");
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name || categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) return;
    setCategories((current) => [...current, { name, description: "Nueva categoría de atención" }]);
    setNewCategory("");
  };

  const exportTickets = () => {
    const header = ["Código", "Asunto", "Categoría", "Fecha", "Prioridad", "Estado", "Asesor"];
    const csvRows = tickets.map((ticket) => [
      ticket.code, ticket.subject, ticket.category, ticket.date,
      ticket.priority, ticket.status, ticket.advisor ?? "Sin asignar",
    ]);
    const csv = [header, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\\n");
    const blob = new Blob(["\\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte-idat-te-acompana.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand light />
        <div className="admin-label">PANEL DE GESTIÓN</div>
        <nav>
          {[
            ["Resumen", "home"],
            ["Solicitudes", "ticket"],
            ["Asesores", "users"],
            ["Áreas y categorías", "book"],
            ["Reportes", "history"],
            ["Configuración", "settings"],
          ].map(([label, icon]) => (
            <button
              key={label}
              className={adminSection === label ? "active" : ""}
              onClick={() => setAdminSection(label)}
            >
              <Icon name={icon as IconName} /> {label}
              {label === "Solicitudes" && <span>{tickets.filter((t) => t.status !== "Solucionado").length}</span>}
            </button>
          ))}
        </nav>
        <button className="student-return" onClick={() => go("dashboard")}>
          <Icon name="arrow" />
          <span>
            <b>Vista estudiante</b>
            <small>Volver al portal</small>
          </span>
        </button>
        <div className="admin-user">
          <span>CL</span>
          <div>
            <b>Carlos León</b>
            <small>Administrador</small>
          </div>
          <Icon name="chevron" />
        </div>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <h1>Panel de gestión</h1>
            <p>Miércoles, 18 de junio de 2025</p>
          </div>
          <div className="header-actions" style={{display:"flex",gap:10,alignItems:"center"}}>
            <input
              aria-label="Buscar solicitudes"
              placeholder="Buscar ticket..."
              value={searchTerm}
              onChange={(event) => { setSearchTerm(event.target.value); setAdminSection("Solicitudes"); }}
              style={{maxWidth:190,padding:"10px 12px",border:"1px solid #d7e2ec",borderRadius:10}}
            />
            <button className="icon-button" title="Ver solicitudes pendientes" onClick={() => { setFilter("Pendiente"); setAdminSection("Solicitudes"); }}>
              <Icon name="bell" />
            </button>
          </div>
        </header>
        <div className="admin-content">
          {adminSection === "Resumen" && (
          <>
          <div className="admin-welcome">
            <div>
              <span>RESUMEN GENERAL</span>
              <h2>Buenos días, Carlos</h2>
              <p>
                Hay <b>{tickets.filter((ticket) => ticket.status !== "Solucionado").length} solicitudes</b> que necesitan atención hoy.
              </p>
            </div>
            <button className="btn btn-white" onClick={() => setAdminSection("Asesores")}>
              <Icon name="users" /> Gestionar asesores
            </button>
          </div>
          <div className="admin-stats">
            {[
              ["Total recibidos", String(tickets.length), "Tickets registrados", "ticket", "blue"],
              ["Pendientes", String(tickets.filter((t) => t.status === "Pendiente").length), "Por revisar", "clock", "orange"],
              ["En atención", String(tickets.filter((t) => t.status === "En atención").length), "En proceso", "headset", "cyan"],
              ["Solucionados", String(tickets.filter((t) => t.status === "Solucionado").length), "Casos cerrados", "check", "green"],
              ["Urgentes", String(tickets.filter((t) => t.priority === "Urgente").length), "Revisar primero", "spark", "red"],
            ].map(([label, val, note, icon, color]) => (
              <div key={label}>
                <span className={`stat-icon ${color}`}>
                  <Icon name={icon as IconName} />
                </span>
                <small>{label}</small>
                <strong>{val}</strong>
                <em>{note}</em>
              </div>
            ))}
          </div>
          <section className="content-card admin-table-card">
            <div className="card-heading">
              <div>
                <h2>Gestión de solicitudes</h2>
                <p>Prioriza y asigna los casos de los estudiantes.</p>
              </div>
              <button className="btn btn-outline">
                <Icon name="filter" size={17} /> Más filtros
              </button>
            </div>
            <div className="admin-tabs">
              {["Todos", "Pendiente", "En atención", "Urgente", "Solucionado"].map((x) => (
                <button
                  className={filter === x ? "active" : ""}
                  onClick={() => setFilter(x)}
                  key={x}
                >
                  {x}
                  {x === "Pendiente" && <span>24</span>}
                </button>
              ))}
            </div>
            <TicketTable
              rows={rows}
              go={go}
              admin
              onPriorityChange={updatePriority}
              onManage={setSelectedCode}
            />
          </section>
          </>
          )}

          {adminSection === "Solicitudes" && (
            <section className="content-card admin-table-card">
              <div className="card-heading">
                <div>
                  <h2>Todas las solicitudes</h2>
                  <p>Revisa, evalúa y asigna los tickets registrados.</p>
                </div>
                <button className="btn btn-outline" onClick={exportTickets}>Exportar CSV</button>
              </div>
              <div className="admin-tabs">
                {["Todos", "Pendiente", "En atención", "Urgente", "Solucionado"].map((x) => (
                  <button className={filter === x ? "active" : ""} onClick={() => setFilter(x)} key={x}>{x}</button>
                ))}
              </div>
              <TicketTable rows={rows} go={go} admin onPriorityChange={updatePriority} onManage={setSelectedCode} />
            </section>
          )}

          {adminSection === "Asesores" && (
            <section className="content-card admin-table-card">
              <div className="card-heading">
                <div><h2>Gestión de asesores</h2><p>Personal disponible para atender solicitudes.</p></div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",padding:20,alignItems:"center"}}>
                <input value={newAdvisor} onChange={(e) => setNewAdvisor(e.target.value)} placeholder="Nombre del nuevo asesor" style={{padding:11,border:"1px solid #d7e2ec",borderRadius:9,flex:"1 1 190px"}} />
                <select value={newAdvisorArea} onChange={(e) => setNewAdvisorArea(e.target.value)} style={{padding:11,border:"1px solid #d7e2ec",borderRadius:9}}>
                  {["Académico","Soporte técnico","Administrativo","Matrícula y pagos"].map(area => <option key={area}>{area}</option>)}
                </select>
                <button className="btn btn-primary" onClick={addAdvisor}>Agregar asesor</button>
              </div>
              <div className="admin-stats">
                {advisors.map((advisor) => {
                  const assigned = tickets.filter((ticket) => ticket.advisor === advisor.name && ticket.status !== "Solucionado").length;
                  return <div key={advisor.name}>
                    <span className="stat-icon blue"><Icon name="users" /></span>
                    <strong style={{fontSize:17}}>{advisor.name}</strong>
                    <small>{advisor.area}</small>
                    <em>{assigned} tickets activos</em>
                    <button className="btn btn-outline" style={{marginTop:8}} onClick={() => setAdvisors(current => current.filter(item => item.name !== advisor.name))}>Quitar</button>
                  </div>;
                })}
              </div>
              <p style={{padding:18,color:"#64748b"}}>Los asesores agregados aparecerán como opciones al asignar una solicitud.</p>
            </section>
          )}

          {adminSection === "Áreas y categorías" && (
            <section className="content-card admin-table-card">
              <div className="card-heading"><div><h2>Áreas y categorías</h2><p>Clasificación de las consultas de los estudiantes.</p></div></div>
              <div style={{display:"flex",gap:10,padding:20,flexWrap:"wrap"}}>
                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nombre de nueva categoría" style={{padding:11,border:"1px solid #d7e2ec",borderRadius:9,flex:"1 1 220px"}} />
                <button className="btn btn-primary" onClick={addCategory}>Agregar categoría</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,padding:20}}>
                {categories.map((category) => (
                  <div key={category.name} style={{background:"#f3f7fb",borderRadius:12,padding:18}}>
                    <b style={{color:"#173b5c"}}>{category.name}</b>
                    <p style={{margin:"8px 0 12px",fontSize:13,color:"#64748b"}}>{category.description}</p>
                    <button className="btn btn-outline" onClick={() => setCategories(current => current.filter(item => item.name !== category.name))}>Eliminar</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {adminSection === "Reportes" && (() => {
            const total = tickets.length;
            const countStatus = (status: string) => tickets.filter((ticket) => ticket.status === status).length;
            const countPriority = (priority: string) => tickets.filter((ticket) => ticket.priority === priority).length;
            const resolved = countStatus("Solucionado");
            const completion = total ? Math.round((resolved / total) * 100) : 0;
            const statusItems = [
              { label: "Pendientes", value: countStatus("Pendiente"), color: "#F59E0B" },
              { label: "En atención", value: countStatus("En atención"), color: "#0EA5E9" },
              { label: "Derivados", value: countStatus("Derivado"), color: "#8B5CF6" },
              { label: "Solucionados", value: resolved, color: "#10B981" },
            ];
            const priorityItems = [
              { label: "Pendiente de evaluación", value: countPriority("Pendiente de evaluación"), color: "#94A3B8" },
              { label: "Baja", value: countPriority("Baja"), color: "#10B981" },
              { label: "Media", value: countPriority("Media"), color: "#0EA5E9" },
              { label: "Alta", value: countPriority("Alta"), color: "#F59E0B" },
              { label: "Emergencia", value: countPriority("Urgente"), color: "#EF4444" },
            ];
            const categoryItems = categories
              .map((category) => ({
                label: category.name,
                value: tickets.filter((ticket) => ticket.category === category.name).length,
              }))
              .filter((category) => category.value > 0)
              .sort((a, b) => b.value - a.value);
            return (
              <div style={{display:"grid",gap:20}}>
                <section style={{background:"linear-gradient(120deg,#0b3764 0%,#0877c9 100%)",borderRadius:18,padding:"26px 28px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",gap:18,flexWrap:"wrap",boxShadow:"0 12px 28px rgba(8,75,130,.15)"}}>
                  <div>
                    <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,opacity:.78}}>CENTRO DE ANÁLISIS</span>
                    <h2 style={{fontSize:25,margin:"8px 0 6px",color:"#fff"}}>Reportes de atención</h2>
                    <p style={{margin:0,color:"rgba(255,255,255,.82)",fontSize:14}}>Visualiza el movimiento y el estado de las solicitudes registradas.</p>
                  </div>
                  <button className="btn btn-white" onClick={exportTickets}><Icon name="history" /> Exportar reporte</button>
                </section>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:14}}>
                  {[
                    {label:"Solicitudes registradas",value:total,sub:"Total de tickets",icon:"ticket",color:"#0B74C8",bg:"#E7F3FC"},
                    {label:"Pendientes",value:countStatus("Pendiente"),sub:"Esperando revisión",icon:"clock",color:"#D97706",bg:"#FFF4E5"},
                    {label:"En atención",value:countStatus("En atención"),sub:"En proceso",icon:"headset",color:"#0284C7",bg:"#E5F6FC"},
                    {label:"Solucionadas",value:resolved,sub:"Casos cerrados",icon:"check",color:"#059669",bg:"#E6F8F0"},
                  ].map((item) => (
                    <div key={item.label} style={{background:"#fff",border:"1px solid #E3EBF3",borderRadius:16,padding:19,boxShadow:"0 5px 16px rgba(19,55,86,.04)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                        <small style={{color:"#64748B",fontWeight:600}}>{item.label}</small>
                        <span style={{width:38,height:38,borderRadius:12,background:item.bg,color:item.color,display:"grid",placeItems:"center"}}><Icon name={item.icon as IconName}/></span>
                      </div>
                      <strong style={{display:"block",fontSize:30,color:"#163B5C",marginTop:13,lineHeight:1.1}}>{item.value}</strong>
                      <span style={{fontSize:12,color:"#94A3B8",display:"block",marginTop:7}}>{item.sub}</span>
                    </div>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18}}>
                  <section style={{background:"#fff",border:"1px solid #E3EBF3",borderRadius:16,padding:22,boxShadow:"0 5px 16px rgba(19,55,86,.04)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,marginBottom:20}}>
                      <div><h3 style={{margin:0,color:"#173B5C",fontSize:17}}>Estado de solicitudes</h3><p style={{margin:"5px 0 0",fontSize:12,color:"#94A3B8"}}>Distribución según su estado actual</p></div>
                      <span style={{fontSize:12,fontWeight:700,color:"#0873C5",background:"#EAF5FD",padding:"6px 9px",borderRadius:20}}>{total} en total</span>
                    </div>
                    {statusItems.map((item) => {
                      const percent = total ? Math.round((item.value / total) * 100) : 0;
                      return <div key={item.label} style={{marginBottom:18}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,marginBottom:8}}>
                          <span style={{color:"#52677C",fontWeight:600}}>{item.label}</span>
                          <b style={{color:"#173B5C"}}>{item.value} <span style={{fontWeight:400,color:"#94A3B8"}}>({percent}%)</span></b>
                        </div>
                        <div style={{height:10,background:"#EEF3F7",borderRadius:20,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${percent}%`,background:item.color,borderRadius:20,transition:"width .3s"}}/>
                        </div>
                      </div>;
                    })}
                  </section>

                  <section style={{background:"#fff",border:"1px solid #E3EBF3",borderRadius:16,padding:22,boxShadow:"0 5px 16px rgba(19,55,86,.04)"}}>
                    <div style={{marginBottom:20}}><h3 style={{margin:0,color:"#173B5C",fontSize:17}}>Prioridad de los casos</h3><p style={{margin:"5px 0 0",fontSize:12,color:"#94A3B8"}}>Clasificación asignada por los asesores</p></div>
                    {priorityItems.map((item) => {
                      const percent = total ? Math.round((item.value / total) * 100) : 0;
                      return <div key={item.label} style={{display:"flex",alignItems:"center",gap:11,marginBottom:15}}>
                        <span style={{width:9,height:9,borderRadius:20,background:item.color,flexShrink:0}}/>
                        <span style={{fontSize:12,color:"#52677C",flex:1}}>{item.label}</span>
                        <b style={{fontSize:13,color:"#173B5C",minWidth:18,textAlign:"right"}}>{item.value}</b>
                        <span style={{fontSize:11,color:"#94A3B8",width:38,textAlign:"right"}}>{percent}%</span>
                      </div>;
                    })}
                    <div style={{marginTop:20,padding:14,background:"#F5F9FC",borderRadius:12}}>
                      <div style={{fontSize:12,color:"#64748B"}}>Casos de emergencia</div>
                      <strong style={{fontSize:23,color:"#DC2626"}}>{countPriority("Urgente")}</strong>
                      <span style={{fontSize:12,color:"#94A3B8",marginLeft:8}}>requieren atención prioritaria</span>
                    </div>
                  </section>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) minmax(250px,.8fr)",gap:18}}>
                  <section style={{background:"#fff",border:"1px solid #E3EBF3",borderRadius:16,padding:22,boxShadow:"0 5px 16px rgba(19,55,86,.04)"}}>
                    <h3 style={{margin:"0 0 5px",color:"#173B5C",fontSize:17}}>Solicitudes por categoría</h3>
                    <p style={{margin:"0 0 20px",fontSize:12,color:"#94A3B8"}}>Áreas que concentran más consultas</p>
                    {categoryItems.length ? categoryItems.map((item) => {
                      const percent = total ? Math.round((item.value / total) * 100) : 0;
                      return <div key={item.label} style={{marginBottom:15}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:7,color:"#52677C"}}><span>{item.label}</span><b style={{color:"#173B5C"}}>{item.value}</b></div>
                        <div style={{height:8,background:"#EEF3F7",borderRadius:20,overflow:"hidden"}}><div style={{height:"100%",width:`${percent}%`,background:"linear-gradient(90deg,#0B74C8,#38A2E8)",borderRadius:20}}/></div>
                      </div>;
                    }) : <p style={{fontSize:13,color:"#94A3B8"}}>Todavía no hay solicitudes por categoría.</p>}
                  </section>

                  <section style={{background:"#F0F7FC",border:"1px solid #DCEBF7",borderRadius:16,padding:22,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <div>
                      <span style={{width:42,height:42,borderRadius:13,background:"#DCEFFD",color:"#0873C5",display:"grid",placeItems:"center"}}><Icon name="history" size={21}/></span>
                      <h3 style={{margin:"17px 0 6px",fontSize:17,color:"#173B5C"}}>Nivel de resolución</h3>
                      <p style={{margin:0,fontSize:12,color:"#71869A"}}>Porcentaje de solicitudes que figuran como solucionadas.</p>
                    </div>
                    <div style={{display:"flex",alignItems:"baseline",gap:5,marginTop:20}}>
                      <strong style={{fontSize:44,color:"#0873C5",lineHeight:1}}>{completion}%</strong>
                      <span style={{fontSize:12,color:"#71869A"}}>resueltas</span>
                    </div>
                    <div style={{height:11,background:"#DCE8F1",borderRadius:20,overflow:"hidden",marginTop:13}}>
                      <div style={{height:"100%",width:`${completion}%`,background:"linear-gradient(90deg,#0873C5,#25A4D8)",borderRadius:20}}/>
                    </div>
                    <p style={{fontSize:12,color:"#71869A",margin:"12px 0 0"}}>{resolved} de {total} solicitudes solucionadas.</p>
                  </section>
                </div>
                <p style={{margin:"0 2px",fontSize:11,color:"#94A3B8"}}>Los indicadores se calculan con los tickets disponibles en esta demostración y se actualizan cuando cambias su estado o prioridad.</p>
              </div>
            );
          })()}

          {adminSection === "Configuración" && (
            <section className="content-card admin-table-card">
              <div className="card-heading"><div><h2>Configuración</h2><p>Información general del portal de demostración.</p></div></div>
              <div style={{padding:22,display:"grid",gap:16}}>
                <div><small style={{color:"#64748b"}}>NOMBRE DEL SISTEMA</small><h3>IDAT Te Acompaña</h3></div>
                <div><small style={{color:"#64748b"}}>TIPO DE ALMACENAMIENTO</small><h3>Almacenamiento local del navegador</h3><p style={{color:"#64748b"}}>Los cambios de tickets se conservan en este navegador. No hay sincronización entre dispositivos.</p></div>
                <div><small style={{color:"#64748b"}}>PERFIL ACTUAL</small><h3>Carlos León · Administrador</h3></div>
              </div>
            </section>
          )}
        </div>

        {selectedTicket && (
          <div
            role="presentation"
            onClick={() => setSelectedCode(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(7, 29, 52, .58)",
              display: "grid",
              placeItems: "center",
              padding: 20,
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="manage-ticket-title"
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(680px, 100%)",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#fff",
                borderRadius: 18,
                padding: 26,
                boxShadow: "0 24px 80px rgba(0,0,0,.24)",
                color: "#173b5c",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
                <div>
                  <small style={{ color: "#0873c5", fontWeight: 700 }}>GESTIÓN DE TICKET</small>
                  <h2 id="manage-ticket-title" style={{ margin: "6px 0" }}>Revisar solicitud</h2>
                  <p style={{ margin: 0, color: "#60758a" }}>{selectedTicket.code}</p>
                </div>
                <button className="icon-button" onClick={() => setSelectedCode(null)} aria-label="Cerrar">
                  <Icon name="close" />
                </button>
              </div>

              <div style={{ background: "#f3f7fb", borderRadius: 12, padding: 16, margin: "20px 0" }}>
                <small style={{ color: "#60758a" }}>ASUNTO</small>
                <h3 style={{ margin: "5px 0 12px" }}>{selectedTicket.subject}</h3>
                <p style={{ margin: 0, color: "#526b82" }}>
                  {selectedTicket.description || "No se ha agregado una descripción adicional para este ticket de demostración."}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 14, fontSize: 13 }}>
                  <span><b>Categoría:</b> {selectedTicket.category}</span>
                  <span><b>Fecha:</b> {selectedTicket.date}</span>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  Prioridad (la define el asesor)
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => updateTicket(selectedTicket.code, { priority: e.target.value })}
                  >
                    <option value="Pendiente de evaluación">Pendiente de evaluación</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Emergencia</option>
                  </select>
                </label>
                <label>
                  Estado de la solicitud
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicket(selectedTicket.code, { status: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En atención">En atención</option>
                    <option value="Derivado">Derivado</option>
                    <option value="Solucionado">Solucionado</option>
                  </select>
                </label>
                <label className="wide">
                  Asesor responsable
                  <select
                    value={selectedTicket.advisor ?? ""}
                    onChange={(e) => updateTicket(selectedTicket.code, { advisor: e.target.value })}
                  >
                    <option value="">Sin asignar</option>
                    {advisors.map((advisor) => (
                      <option key={advisor.name} value={advisor.name}>{advisor.name} – {advisor.area}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button className="btn btn-outline" onClick={() => setSelectedCode(null)}>Cerrar</button>
                <button className="btn btn-primary" onClick={() => setSelectedCode(null)}>Guardar cambios</button>
              </div>
              <p style={{ color: "#718399", fontSize: 12, marginBottom: 0 }}>
                Los cambios se guardan automáticamente en este navegador.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [ticketData, setTicketData] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("idat-tickets");
    if (saved) {
      try {
        return JSON.parse(saved) as Ticket[];
      } catch {
        return initialTickets;
      }
    }
    return initialTickets;
  });

  const updateTickets = (next: React.SetStateAction<Ticket[]>) => {
    setTicketData((current) => {
      const updated = typeof next === "function" ? next(current) : next;
      localStorage.setItem("idat-tickets", JSON.stringify(updated));
      return updated;
    });
  };

  const go = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let currentView;

  if (view === "landing") currentView = <Landing go={go} />;
  else if (view === "login") currentView = <Login go={go} />;
  else if (view === "dashboard") currentView = <Dashboard go={go} tickets={ticketData} />;
  else if (view === "new") currentView = <NewTicket go={go} />;
  else if (view === "tickets") currentView = <Tickets go={go} tickets={ticketData} />;
  else if (view === "detail") currentView = <TicketDetail go={go} />;
  else if (view === "notifications") currentView = <Notifications go={go} />;
  else if (view === "profile") currentView = <Profile go={go} />;
  else currentView = <Admin go={go} tickets={ticketData} setTickets={updateTickets} />;

  return (
    <>
      {currentView}
      <AssistantIA />
    </>
  );
}
