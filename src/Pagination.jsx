import { useState, useEffect, useCallback } from "react";

// ─── Fake Data Generator ───────────────────────────────────────────────────
const ALL_USERS = Array.from({ length: 87 }, (_, i) => ({
  id: i + 1,
  name: ["Alice Chen", "Bob Martin", "Clara Voss", "David Kim", "Elena Rossi",
         "Frank Müller", "Grace Lee", "Henry Park", "Iris Tanaka", "James Wong",
         "Kira Nolan", "Leo Santos", "Maya Patel", "Nate Brooks", "Olivia Sato",
         "Paul Dubois", "Quinn Walsh", "Rosa Mendez", "Sam Okafor", "Tina Yuen"][i % 20],
  role: ["Engineer", "Designer", "Product", "Marketing", "Data"][i % 5],
  joined: new Date(2022, i % 12, (i % 28) + 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  status: i % 7 === 0 ? "inactive" : "active",
  avatar: String.fromCodePoint(0x1F9D1 + (i % 12)),
}));

const PAGE_SIZE = 8;

// Simulated API calls
const fetchPage = (page) => new Promise(res =>
  setTimeout(() => {
    const start = (page - 1) * PAGE_SIZE;
    res({
      data: ALL_USERS.slice(start, start + PAGE_SIZE),
      total: ALL_USERS.length,
      totalPages: Math.ceil(ALL_USERS.length / PAGE_SIZE),
      page,
    });
  }, 300)
);

const fetchCursor = (cursor) => new Promise(res =>
  setTimeout(() => {
    const startIdx = cursor ? ALL_USERS.findIndex(u => u.id === cursor) + 1 : 0;
    const slice = ALL_USERS.slice(startIdx, startIdx + PAGE_SIZE);
    res({
      data: slice,
      nextCursor: slice.length === PAGE_SIZE ? slice[slice.length - 1].id : null,
      prevCursor: startIdx > 0 ? ALL_USERS[startIdx - 1]?.id ?? null : null,
      hasMore: startIdx + PAGE_SIZE < ALL_USERS.length,
    });
  }, 300)
);

// ─── Components ────────────────────────────────────────────────────────────

function UserRow({ user, index }) {
  return (
    <tr
      style={{
        opacity: 1,
        animation: `fadeSlide 0.25s ease both`,
        animationDelay: `${index * 30}ms`,
        borderBottom: "1px solid #1e2535",
      }}s
    >
      <td style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{user.avatar}</span>
        <div>
          <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14 }}>{user.name}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>#{user.id}</div>
        </div>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          background: { Engineer: "#1e3a5f", Designer: "#3b1f5e", Product: "#1f3b2e", Marketing: "#3b2c1a", Data: "#1a2f3b" }[user.role],
          color: { Engineer: "#60a5fa", Designer: "#c084fc", Product: "#4ade80", Marketing: "#fb923c", Data: "#22d3ee" }[user.role],
          padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
        }}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: 13 }}>{user.joined}</td>
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
          color: user.status === "active" ? "#4ade80" : "#64748b",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: user.status === "active" ? "#4ade80" : "#475569",
            boxShadow: user.status === "active" ? "0 0 6px #4ade80" : "none",
          }} />
          {user.status}
        </span>
      </td>
    </tr>
  );
}

function Skeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <tr key={i} style={{ borderBottom: "1px solid #1e2535" }}>
          {[1, 2, 3, 4].map(c => (
            <td key={c} style={{ padding: "14px 16px" }}>
              <div style={{
                height: 18, borderRadius: 6,
                background: "linear-gradient(90deg, #1e2535 25%, #252e42 50%, #1e2535 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s infinite",
                width: c === 1 ? "70%" : c === 2 ? "50%" : c === 3 ? "60%" : "40%",
              }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Tab 1: Offset Pagination ─────────────────────────────────────────────
function OffsetPagination() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPage(page).then(data => {
      setResult(data);
      setLoading(false);
    });
  }, [page]);

  const tp = result?.totalPages ?? 1;
  const pages = Array.from({ length: tp }, (_, i) => i + 1);
  // Show max 7 page buttons
  const visiblePages = tp <= 7 ? pages : [
    ...pages.slice(0, 2),
    ...(page > 4 ? ["..."] : []),
    ...pages.slice(Math.max(2, page - 1), Math.min(tp - 2, page + 2)),
    ...(page < tp - 3 ? ["..."] : []),
    ...pages.slice(tp - 2),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div>
      <div style={{ marginBottom: 20, padding: "14px 18px", background: "#0d1117", borderRadius: 10, border: "1px solid #1e2535", fontFamily: "monospace", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
        <span style={{ color: "#94a3b8" }}>// Offset formula</span><br />
        <span style={{ color: "#60a5fa" }}>OFFSET</span>{" = (page − 1) × pageSize = "}
        <span style={{ color: "#fb923c" }}>({page} − 1) × {PAGE_SIZE} = {(page - 1) * PAGE_SIZE}</span><br />
        <span style={{ color: "#60a5fa" }}>LIMIT</span>{" = "}<span style={{ color: "#4ade80" }}>{PAGE_SIZE}</span>
        {result && (
          <> &nbsp;→ rows {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, result.total)} of <span style={{ color: "#c084fc" }}>{result.total}</span></>
        )}
      </div>

      <Table loading={loading} data={result?.data} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ color: "#475569", fontSize: 13 }}>
          {result && `${result.total} users · page ${page} of ${tp}`}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</PageBtn>
          {visiblePages.map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} style={{ padding: "6px 4px", color: "#475569", lineHeight: "30px" }}>…</span>
            ) : (
              <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
            )
          )}
          <PageBtn onClick={() => setPage(p => Math.min(tp, p + 1))} disabled={page === tp}>Next →</PageBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Cursor Pagination ─────────────────────────────────────────────
function CursorPagination() {
  const [cursor, setCursor] = useState(null);
  const [history, setHistory] = useState([null]); // stack of cursors for back nav
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCursor(cursor).then(data => {
      setResult(data);
      setLoading(false);
    });
  }, [cursor]);

  const goNext = () => {
    setHistory(h => [...h, result.nextCursor]);
    setCursor(result.nextCursor);
  };

  const goPrev = () => {
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCursor(newHistory[newHistory.length - 1]);
  };

  return (
    <div>
      <div style={{ marginBottom: 20, padding: "14px 18px", background: "#0d1117", borderRadius: 10, border: "1px solid #1e2535", fontFamily: "monospace", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
        <span style={{ color: "#94a3b8" }}>// Cursor-based query</span><br />
        <span style={{ color: "#60a5fa" }}>WHERE</span> id {">"} cursor &nbsp;
        <span style={{ color: "#60a5fa" }}>ORDER BY</span> id &nbsp;
        <span style={{ color: "#60a5fa" }}>LIMIT</span> <span style={{ color: "#4ade80" }}>{PAGE_SIZE}</span><br />
        <span style={{ color: "#94a3b8" }}>current cursor: </span>
        <span style={{ color: "#fb923c" }}>{cursor ?? "null (start)"}</span>
        {result?.nextCursor && (
          <> &nbsp;→ <span style={{ color: "#94a3b8" }}>next cursor:</span> <span style={{ color: "#c084fc" }}>{result.nextCursor}</span></>
        )}
      </div>

      <Table loading={loading} data={result?.data} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ color: "#475569", fontSize: 13 }}>
          {result && `Showing ${result.data?.length ?? 0} records · page ${history.length}`}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <PageBtn onClick={goPrev} disabled={history.length <= 1}>← Prev</PageBtn>
          <PageBtn onClick={goNext} disabled={!result?.hasMore}>Next →</PageBtn>
        </div>
      </div>

      {!result?.hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: 16, color: "#475569", fontSize: 13 }}>
          ✓ End of results
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Infinite Scroll ───────────────────────────────────────────────
function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    fetchCursor(cursor).then(data => {
      setItems(prev => [...prev, ...data.data]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setLoading(false);
      setInitialized(true);
    });
  }, [cursor, loading, hasMore]);

  useEffect(() => { loadMore(); }, []); // initial load

  return (
    <div>
      <div style={{ marginBottom: 20, padding: "14px 18px", background: "#0d1117", borderRadius: 10, border: "1px solid #1e2535", fontFamily: "monospace", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
        <span style={{ color: "#94a3b8" }}>// Infinite scroll = cursor pagination + "load more"</span><br />
        <span style={{ color: "#94a3b8" }}>loaded: </span><span style={{ color: "#4ade80" }}>{items.length}</span>
        <span style={{ color: "#94a3b8" }}> / {ALL_USERS.length} users</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <TableHead />
        <tbody>
          {items.map((user, i) => <UserRow key={user.id} user={user} index={i % PAGE_SIZE} />)}
          {loading && <Skeleton />}
        </tbody>
      </table>

      {initialized && hasMore && !loading && (
        <button onClick={loadMore} style={{
          width: "100%", marginTop: 16, padding: "12px",
          background: "transparent", border: "1px dashed #2d3748",
          color: "#60a5fa", borderRadius: 8, cursor: "pointer",
          fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "#1e2535"; e.target.style.borderStyle = "solid"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderStyle = "dashed"; }}
        >
          + Load more ({ALL_USERS.length - items.length} remaining)
        </button>
      )}

      {!hasMore && initialized && (
        <div style={{ textAlign: "center", marginTop: 16, color: "#475569", fontSize: 13 }}>
          ✓ All {items.length} users loaded
        </div>
      )}
    </div>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────
function TableHead() {
  return (
    <thead>
      <tr style={{ borderBottom: "1px solid #1e2535" }}>
        {["User", "Role", "Joined", "Status"].map(h => (
          <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#475569", fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Table({ loading, data }) {
  return (
    <div style={{ borderRadius: 10, border: "1px solid #1e2535", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <TableHead />
        <tbody>
          {loading ? <Skeleton /> : data?.map((user, i) => <UserRow key={user.id} user={user} index={i} />)}
        </tbody>
      </table>
    </div>
  );
}

function PageBtn({ children, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "6px 12px", borderRadius: 7, border: "1px solid",
      borderColor: active ? "#3b82f6" : disabled ? "#1e2535" : "#2d3748",
      background: active ? "#1d3461" : "transparent",
      color: active ? "#60a5fa" : disabled ? "#2d3748" : "#94a3b8",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.15s",
      fontWeight: active ? 700 : 400,
      minWidth: 36,
    }}
      onMouseEnter={e => { if (!disabled && !active) { e.target.style.borderColor = "#3b82f6"; e.target.style.color = "#e2e8f0"; } }}
      onMouseLeave={e => { if (!disabled && !active) { e.target.style.borderColor = "#2d3748"; e.target.style.color = "#94a3b8"; } }}
    >
      {children}
    </button>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "offset", label: "Offset Pagination" },
  { id: "cursor", label: "Cursor Pagination" },
  { id: "infinite", label: "Infinite Scroll" },
];

export default function Pagination() {
  const [tab, setTab] = useState("offset");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080d14; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#080d14",
        fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
        padding: "40px 24px",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", color: "#f1f5f9" }}>
              Pagination in React
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
              Three approaches — pick what fits your use case
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 28,
            background: "#0d1117", padding: 4, borderRadius: 10,
            border: "1px solid #1e2535", width: "fit-content",
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                background: tab === t.id ? "#1a2235" : "transparent",
                color: tab === t.id ? "#60a5fa" : "#475569",
                transition: "all 0.15s",
                boxShadow: tab === t.id ? "0 0 0 1px #2d4a6b inset" : "none",
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div style={{
            background: "#0d1117", borderRadius: 12,
            border: "1px solid #1e2535", padding: 24,
          }}>
            {tab === "offset" && <OffsetPagination key="offset" />}
            {tab === "cursor" && <CursorPagination key="cursor" />}
            {tab === "infinite" && <InfiniteScroll key="infinite" />}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 20, color: "#2d3748", fontSize: 12, textAlign: "center" }}>
            87 mock users · simulated 300ms network delay
          </div>

        </div>
      </div>
    </>
  );
}