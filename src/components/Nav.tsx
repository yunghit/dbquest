import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { BADGES } from "../game";
import type { Profile } from "../types";

const student: [string, string, string][] = [
  ["/", "🏠", "Home"],
  ["/boss", "⚔️", "Boss"],
  ["/materials", "📎", "Files"],
  ["/leaderboard", "🏆", "Ranks"],
  ["/history", "🕘", "History"],
];
const admin: [string, string, string][] = [
  ["/admin", "🛠️", "Dashboard"],
  ["/learn", "📚", "Student view"],
  ["/materials", "📎", "Files"],
  ["/leaderboard", "🏆", "Ranks"],
];

export default function Nav({ prof }: { prof: Profile }) {
  const isAdmin = prof.role === "admin";
  const items = isAdmin ? admin : student;
  const xp = prof.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  return (
    <header className="top">
      <div className="brand">
        <img src="/icon.png" alt="DB Quest" />
        <div className="brand-copy">
          <b>
            DB Quest
            {isAdmin && (
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 99,
                  background: "var(--a1)",
                  color: "#fff",
                  marginLeft: 7,
                  letterSpacing: "0.08em",
                }}
              >
                ADMIN
              </span>
            )}
          </b>
          <small>
            <span className="brand-kicker">DBMS LAB</span>
            <span aria-hidden="true"> · </span>
            {isAdmin ? prof.email : "COMP 332"}
          </small>
        </div>
        <button
          type="button"
          className="ghost"
          aria-label="Sign out of DB Quest"
          onClick={() => signOut(auth)}
        >
          Sign out
        </button>
      </div>
      {!isAdmin && (
        <div className="xp" aria-label={`Level ${level}, ${xp} experience points`}>
          <span className="xp-level">LV {level}</span>
          <div className="bar" aria-hidden="true">
            <i style={{ width: `${xpProgress}%` }} />
          </div>
          <span>
            {xp} XP <span aria-hidden="true">·</span> 🔥 {prof.streak ?? 0}
          </span>
        </div>
      )}
      <nav aria-label="Primary navigation">
        {items.map(([to, icon, title]) => (
          <NavLink key={to} to={to} end>
            <span aria-hidden="true">{icon}</span> {title}
          </NavLink>
        ))}
      </nav>
      {!isAdmin && (
        <div className="badges" aria-label="Badges">
          {BADGES.map((badge) => (
            <img
              key={badge.name}
              title={badge.name}
              alt={badge.name}
              src={`/${badge.img}`}
              style={{
                opacity: badge.ok(prof) ? 1 : 0.22,
                filter: badge.ok(prof) ? "none" : "grayscale(1)",
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
}
