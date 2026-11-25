
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
};

const STORAGE_KEY = "idat-assistant-messages";

const welcomeMessage: Message = {
  id: 1,
  sender: "bot",
  text: "¡Hola! 👋 Soy IDAT IA, tu asistente virtual. Estoy aquí para ayudarte con tus consultas académicas y administrativas. ¿Qué necesitas resolver hoy?",
  time: "Ahora"
};

const suggestions = [
  "Tengo problemas con EVA",
  "Consulta sobre matrícula",
  "Quiero registrar un ticket"
];

// Simulador de respuestas
function getResponse(message: string): string {
  const text = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches)/.test(text)) {
    return "¡Hola! 😊 Qué gusto saludarte. Cuéntame qué problema tienes y te ayudaré a encontrar una solución.";
  }

  if (text.includes("matricula") || text.includes("matricular")) {
    return "📚 Sobre tu matrícula: puedo orientarte con consultas generales. Si tienes problemas para completar el proceso, puedes registrar una solicitud en la categoría Académico para recibir atención personalizada.";
  }

  if (text.includes("pago") || text.includes("pension") || text.includes("deuda")) {
    return "💳 Para consultas sobre pagos, pensiones o deudas, te recomiendo registrar una solicitud en la categoría Pagos y matrícula. Así el área correspondiente podrá revisar tu caso.";
  }

  if (text.includes("eva") || text.includes("plataforma") || text.includes("ingresar")) {
    return "💻 ¡Vamos a revisar tu problema con EVA!\n\n1. Verifica tu conexión a Internet.\n2. Comprueba que tus credenciales sean correctas.\n3. Intenta ingresar desde otro navegador.\n\nSi el problema continúa, puedes registrar un ticket en Soporte técnico y adjuntar una captura del error.";
  }

  if (text.includes("ticket") || text.includes("solicitud") || text.includes("reclamo")) {
    return "🎫 ¡Claro! Puedes registrar una solicitud desde la opción «Registrar una solicitud» de la plataforma. Allí podrás describir tu problema, elegir una categoría y prioridad. Recibirás un código para consultar su seguimiento.";
  }

  if (text.includes("horario") || text.includes("clase")) {
    return "🗓️ Para consultas sobre horarios o clases, selecciona la categoría Académico al registrar tu solicitud. El área correspondiente podrá orientarte.";
  }

  if (text.includes("certificado") || text.includes("constancia")) {
    return "📄 Para consultas sobre certificados y constancias, puedes registrar una solicitud en la categoría Administrativo. Describe qué documento necesitas.";
  }

  if (text.includes("asesor") || text.includes("persona") || text.includes("humano")) {
    return "👩‍💼 Si necesitas atención personalizada, puedes registrar un ticket para que tu consulta sea revisada por el área responsable. Así tendrás un registro de tu solicitud.";
  }

  if (text.includes("gracias")) {
    return "¡De nada! 😊 Estoy aquí para ayudarte. ¿Tienes alguna otra consulta?";
  }

  if (text.includes("ayuda") || text.includes("problema")) {
    return "¡Por supuesto! 😊 Cuéntame un poco más sobre lo que está pasando. ¿Tu consulta es académica, administrativa, de pagos o de soporte técnico?";
  }

  return "Gracias por contarme tu consulta. 😊 Todavía no tengo una respuesta específica para ese tema en mi versión de demostración. Puedo orientarte para registrar un ticket y recibir atención del área correspondiente. ¿Quieres que te ayude con eso?";
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [welcomeMessage];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [welcomeMessage];

    const validMessages = parsed.filter(
      (item): item is Message =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "number" &&
        typeof item.text === "string" &&
        (item.sender === "bot" || item.sender === "user") &&
        typeof item.time === "string"
    );

    return validMessages.length > 0
      ? validMessages
      : [welcomeMessage];
  } catch {
    return [welcomeMessage];
  }
}

export default function AssistantIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guardar conversación localmente
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("No se pudo guardar el historial:", error);
    }
  }, [messages]);

  // Desplazarse al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isTyping, isOpen]);

  // Enviar mensaje
  function sendMessage(value?: string) {
    const messageText = (value ?? input).trim();

    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      time: getCurrentTime()
    };

    setMessages(previous => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getResponse(messageText),
        sender: "bot",
        time: getCurrentTime()
      };

      setMessages(previous => [...previous, botMessage]);
      setIsTyping(false);
    }, 1000);
  }

  // Nueva conversación
  function clearChat() {
    setMessages([welcomeMessage]);
    setInput("");
    setIsTyping(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="idat-ai-widget">

      {/* Botón flotante */}
      <button
        className={`ai-floating-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(previous => !previous)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="ai-close-icon">×</span>
        ) : (
          <span className="ai-bot-icon">✦</span>
        )}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <section
          className="ai-chat-panel"
          aria-label="Chat con IDAT IA"
        >

          {/* Encabezado */}
          <header className="ai-chat-header">

            <div className="ai-avatar">
              <span>✦</span>
            </div>

            <div className="ai-header-info">
              <strong>IDAT IA</strong>
              <span>
                <i className="ai-online-dot" />
                Asistente virtual
              </span>
            </div>

            <button
              className="ai-header-action"
              onClick={clearChat}
              title="Nueva conversación"
              aria-label="Reiniciar conversación"
            >
              ↻
            </button>

            <button
              className="ai-header-action"
              onClick={() => setIsOpen(false)}
              title="Cerrar chat"
              aria-label="Cerrar chat"
            >
              ×
            </button>

          </header>

          {/* Información */}
          <div className="ai-chat-intro">
            <span className="ai-intro-icon">✦</span>
            <strong>¡Estamos para acompañarte!</strong>
            <p>
              Consulta tus dudas y recibe orientación de nuestro asistente.
            </p>
          </div>

          {/* Mensajes */}
          <div className="ai-chat-messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message-row ${message.sender}`}
              >

                {message.sender === "bot" && (
                  <div className="ai-message-avatar">✦</div>
                )}

                <div className="ai-message-content">

                  <div className={`ai-message ${message.sender}`}>
                    {message.text}
                  </div>

                  <span className="ai-message-time">
                    {message.time}
                  </span>

                </div>

              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row bot">
                <div className="ai-message-avatar">✦</div>

                <div className="ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Preguntas sugeridas */}
          {messages.length === 1 && !isTyping && (
            <div className="ai-suggestions">
              <span>Consultas frecuentes</span>

              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                  <span>›</span>
                </button>
              ))}
            </div>
          )}

          {/* Entrada de mensajes */}
          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
              aria-label="Escribe tu mensaje"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              ➤
            </button>

          </form>

          <footer className="ai-chat-footer">
            IDAT Te Acompaña · Asistente virtual de demostración
          </footer>

        </section>
      )}

    </div>
  );
}
