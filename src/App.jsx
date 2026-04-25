import { useEffect, useRef, useState } from "react";

const API_URL = "http://192.168.31.246:3001/chat";

const CREATOR_EMAIL = "bhaskhar@lura.ai";
const CREATOR_PASS = "123456";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState(["admin@lura.ai"]);
  const [newAdmin, setNewAdmin] = useState("");

  const [mode, setMode] = useState("Friendly");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Welcome to Lura AI Mobile ✨" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typing, setTyping] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, typing]);

  function login() {
    const e = email.trim().toLowerCase();
    const p = password.trim();

    if (!e || !p) return alert("Enter email and password");

    if (e === CREATOR_EMAIL && p === CREATOR_PASS) {
      setUser({ email: e, role: "creator" });
      setScreen("chat");
      setMessages([{ role: "ai", text: "Welcome back, Creator 👑" }]);
      return;
    }

    if (admins.includes(e)) {
      setUser({ email: e, role: "admin" });
      setScreen("chat");
      setMessages([{ role: "ai", text: "Welcome Admin 🛡️" }]);
      return;
    }

    setUser({ email: e, role: "user" });
    setScreen("chat");
    setMessages([{ role: "ai", text: "Welcome to Lura AI ✨ Ask me anything." }]);
  }

  function typeText(text) {
    setTyping(true);
    let i = 0;
    const words = text.split(/(\s+)/);

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    const timer = setInterval(() => {
      i++;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "ai",
          text: words.slice(0, i).join(""),
        };
        return copy;
      });

      if (i >= words.length) {
        clearInterval(timer);
        setTyping(false);
      }
    }, 18);
  }

  async function send() {
    if (!input.trim() || thinking || typing) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setThinking(true);

    const prompt = `
You are Lura AI Mobile.

Mode: ${mode}
User role: ${user?.role}

Rules:
- Be friendly and easy to understand.
- Understand typos and spelling mistakes.
- Deep mode: detailed and careful.
- Hurry mode: short and useful.
- Study mode: teacher-like explanation.
- Never reveal private creator/admin details to normal users.
- If creator asks who created you, say: "You are recognized as the creator of Lura AI 👑"
- For medical/legal/finance/safety topics, be careful and avoid fake certainty.

Question:
${userMsg}
`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      setThinking(false);
      typeText(data.reply || "No reply from AI.");
    } catch {
      setThinking(false);
      typeText("Backend not connected. Keep PC server running and phone on same Wi-Fi.");
    }
  }

  function addAdmin() {
    const e = newAdmin.trim().toLowerCase();
    if (!e) return;
    if (!admins.includes(e)) setAdmins([...admins, e]);
    setNewAdmin("");
  }

  function removeAdmin(e) {
    setAdmins(admins.filter((a) => a !== e));
  }

  if (screen === "login") {
    return (
      <div className="page">
        <Style />
        <div className="bgOrb one" />
        <div className="bgOrb two" />

        <div className="loginCard">
          <div className="logo">✦</div>
          <h1>Lura AI</h1>
          <p>Mobile Preview v1.0</p>

          <button className="google">Continue with Google</button>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary" onClick={login}>
            Enter Lura AI
          </button>

          <small>Creator access is private.</small>
        </div>
      </div>
    );
  }

  if (screen === "admin") {
    return (
      <div className="page">
        <Style />

        <div className="mobileShell">
          <header className="top">
            <button onClick={() => setScreen("chat")} className="ghost">‹</button>
            <div>
              <h2>Control Panel</h2>
              <p>{user.role === "creator" ? "Creator" : "Admin"} access</p>
            </div>
          </header>

          <section className="adminBody">
            <div className="panelCard">
              <h3>Admin Access</h3>
              <p>Add people who can access the admin panel.</p>

              {user.role === "creator" && (
                <div className="addBox">
                  <input
                    placeholder="admin email"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                  />
                  <button onClick={addAdmin}>Add</button>
                </div>
              )}

              <div className="adminList">
                {admins.map((a) => (
                  <div className="adminItem" key={a}>
                    <span>{a}</span>
                    {user.role === "creator" && (
                      <button onClick={() => removeAdmin(a)}>Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="panelCard">
              <h3>Plans</h3>
              <div className="chips">
                <button>Free</button>
                <button>Pro</button>
                <button>VIP</button>
                <button>Owner</button>
              </div>
            </div>

            <div className="panelCard">
              <h3>Security</h3>
              <p>No backdoors. API key stays on backend server only.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Style />
      <div className="bgOrb one" />
      <div className="bgOrb two" />

      <div className="mobileShell">
        <header className="top">
          <div>
            <h2>Lura AI</h2>
            <p>{mode} • {user.role}</p>
          </div>

          {(user.role === "creator" || user.role === "admin") && (
            <button className="adminBtn" onClick={() => setScreen("admin")}>
              Panel
            </button>
          )}
        </header>

        <div className="modeRow">
          {["Friendly", "Deep", "Hurry", "Study"].map((m) => (
            <button
              key={m}
              className={mode === m ? "chip active" : "chip"}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <section className="chatArea">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "row user" : "row"}>
              <div className={m.role === "user" ? "bubble userBubble" : "bubble aiBubble"}>
                {m.text}
                {typing && i === messages.length - 1 && m.role === "ai" && (
                  <span className="cursor">▍</span>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="row">
              <div className="thinking">
                Lura AI is thinking
                <div className="dots"><i></i><i></i><i></i></div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </section>

        <footer className="composer">
          <input
            placeholder="Message Lura AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} disabled={thinking || typing}>➤</button>
        </footer>
      </div>
    </div>
  );
}

function Style() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; background: #dff7ff; }

      .page {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 20% 10%, rgba(255,255,255,.95), transparent 28%),
          radial-gradient(circle at 90% 15%, rgba(56,189,248,.45), transparent 32%),
          linear-gradient(135deg,#dff7ff,#bdeaff,#eef8ff);
        color: #0f172a;
      }

      .bgOrb {
        position: fixed;
        border-radius: 999px;
        filter: blur(60px);
        pointer-events: none;
        animation: float 10s infinite ease-in-out;
      }

      .bgOrb.one {
        width: 260px;
        height: 260px;
        top: -80px;
        left: -80px;
        background: rgba(255,255,255,.75);
      }

      .bgOrb.two {
        width: 300px;
        height: 300px;
        bottom: -100px;
        right: -80px;
        background: rgba(14,165,233,.35);
      }

      @keyframes float {
        50% { transform: translate(25px, 20px) scale(1.05); }
      }

      @keyframes pop {
        from { opacity: 0; transform: translateY(12px) scale(.98); }
        to { opacity: 1; transform: none; }
      }

      @keyframes jump {
        0%,80%,100% { transform: translateY(0); opacity: .35; }
        40% { transform: translateY(-7px); opacity: 1; }
      }

      @keyframes blink {
        0%,50% { opacity: 1; }
        51%,100% { opacity: 0; }
      }

      .loginCard {
        position: relative;
        z-index: 2;
        width: min(92vw, 390px);
        margin: 9vh auto 0;
        padding: 28px;
        border-radius: 34px;
        background: rgba(255,255,255,.55);
        border: 1px solid rgba(255,255,255,.8);
        backdrop-filter: blur(28px);
        box-shadow: 0 25px 80px rgba(15,23,42,.18);
        text-align: center;
        animation: pop .3s ease;
      }

      .logo {
        width: 64px;
        height: 64px;
        margin: 0 auto 12px;
        display: grid;
        place-items: center;
        border-radius: 24px;
        color: white;
        font-size: 28px;
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
        box-shadow: 0 0 35px rgba(14,165,233,.45);
      }

      .loginCard h1 { margin: 0; font-size: 34px; color: #0f172a; }
      .loginCard p, .loginCard small { color: #475569; }

      .loginCard input {
        width: 100%;
        margin: 8px 0;
        padding: 15px;
        border: 0;
        border-radius: 18px;
        background: rgba(255,255,255,.85);
        color: #0f172a;
        outline: none;
      }

      .google, .primary {
        width: 100%;
        margin: 9px 0;
        padding: 14px;
        border: 0;
        border-radius: 18px;
        font-weight: 900;
        cursor: pointer;
      }

      .google { background: white; color: #0f172a; }
      .primary {
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
        color: white;
      }

      .mobileShell {
        position: relative;
        z-index: 2;
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-rows: auto auto minmax(0,1fr) auto;
        background: rgba(255,255,255,.22);
        backdrop-filter: blur(18px);
      }

      .top {
        padding: 18px 18px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .top h2 {
        margin: 0;
        color: #0f172a;
        font-size: 26px;
      }

      .top p {
        margin: 4px 0 0;
        color: #475569;
        font-size: 13px;
      }

      .adminBtn, .ghost {
        border: 0;
        border-radius: 16px;
        padding: 10px 14px;
        color: white;
        font-weight: 900;
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
      }

      .ghost {
        font-size: 24px;
        padding: 6px 14px;
      }

      .modeRow {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 0 14px 12px;
      }

      .chip {
        white-space: nowrap;
        border: 1px solid rgba(255,255,255,.75);
        background: rgba(255,255,255,.6);
        color: #0f172a;
        padding: 10px 13px;
        border-radius: 999px;
        font-weight: 800;
      }

      .chip.active {
        color: white;
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
      }

      .chatArea {
        min-height: 0;
        overflow-y: auto;
        padding: 14px;
      }

      .row {
        display: flex;
        margin-bottom: 12px;
        animation: pop .22s ease;
      }

      .row.user {
        justify-content: flex-end;
      }

      .bubble {
        max-width: 86%;
        padding: 13px 15px;
        border-radius: 24px;
        white-space: pre-wrap;
        line-height: 1.48;
        font-size: 15px;
        box-shadow: 0 10px 30px rgba(15,23,42,.12);
      }

      .aiBubble {
        background: rgba(255,255,255,.86);
        color: #0f172a;
        border-bottom-left-radius: 8px;
      }

      .userBubble {
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
        color: white;
        border-bottom-right-radius: 8px;
      }

      .cursor {
        animation: blink .8s infinite;
        color: #0ea5e9;
        font-weight: 900;
      }

      .thinking {
        background: rgba(255,255,255,.86);
        color: #0f172a;
        padding: 13px 15px;
        border-radius: 24px;
        border-bottom-left-radius: 8px;
      }

      .dots {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }

      .dots i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #0ea5e9;
        animation: jump .9s infinite;
      }

      .dots i:nth-child(2) { animation-delay: .15s; }
      .dots i:nth-child(3) { animation-delay: .3s; }

      .composer {
        display: flex;
        gap: 8px;
        padding: 10px 12px 14px;
        background: rgba(255,255,255,.2);
      }

      .composer input {
        flex: 1;
        border: 0;
        border-radius: 22px;
        padding: 15px;
        outline: none;
        background: rgba(255,255,255,.9);
        color: #0f172a;
      }

      .composer button {
        width: 52px;
        border: 0;
        border-radius: 20px;
        color: white;
        font-size: 20px;
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
      }

      .adminBody {
        min-height: 0;
        overflow-y: auto;
        padding: 14px;
      }

      .panelCard {
        background: rgba(255,255,255,.75);
        border: 1px solid rgba(255,255,255,.85);
        border-radius: 26px;
        padding: 16px;
        margin-bottom: 12px;
        color: #0f172a;
        box-shadow: 0 10px 35px rgba(15,23,42,.10);
      }

      .panelCard h3 {
        margin: 0 0 6px;
      }

      .panelCard p {
        color: #475569;
      }

      .addBox {
        display: flex;
        gap: 8px;
        margin: 10px 0;
      }

      .addBox input {
        flex: 1;
        border: 0;
        border-radius: 16px;
        padding: 12px;
        background: white;
      }

      .addBox button, .adminItem button {
        border: 0;
        border-radius: 14px;
        padding: 10px;
        color: white;
        background: linear-gradient(135deg,#0ea5e9,#2563eb);
      }

      .adminItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding: 10px;
        border-radius: 16px;
        background: rgba(255,255,255,.65);
        margin-top: 8px;
        color: #0f172a;
      }

      .adminItem span {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      @media (min-width: 720px) {
        .mobileShell {
          width: 430px;
          height: 92vh;
          margin: 4vh auto;
          border-radius: 36px;
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(15,23,42,.25);
        }
      }
    `}</style>
  );
}