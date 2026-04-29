import fs from "fs";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// ===== IMPORT CONTENT =====
import { FLAG_CONTENT } from "./part1/Flag_content.js";
import { SYMBOLS_CONTENT } from "./part1/Symbols_content.js";
import { FIRST_INHABITANT_CONTENT } from "./part1/First_Inhabitant_content.js";
import { STATES_TERRITORIES_CONTENT } from "./part1/States_Territories_content.js";
import { NATION_AUSTRALIA_CONTENT } from "./part1/Nation_Australia_content.js";
import { EARLY_EUROPEAN_SETTLEMENT_CONTENT } from "./part1/Early_European_Settlement_content.js";
import { WELCOME_ACKNOWLEDGEMENT_CONTENT } from "./part1/Welcome_Acknowledgement_content.js";
import { LYRIC_ADVANCE_AUSTRALIA_FAIR_CONTENT } from "./part1/Lyric_Advance_Australia_Fair_content.js";

import { GENERAL_CONTENT } from "./GeneralContent.js";

import { DEMOCRATIC_BELIEF_CONTENT } from "./part2/DEMOCRATIC_BELIEF_CONTENT.js";
import { FREEDOMS_CONTENT } from "./part2/Freedoms_content.js";
import { OUR_EQUALITIES_CONTENT } from "./part2/Our_Equalities_content.js";
import { PARTICIPATION_CONTENT } from "./part2/participation_content.js";

import { HOW_DO_I_HAVE_MY_SAY_CONTENT } from "./part3/How_do_I_have_a_say_content.js";
import { HOW_DID_WE_ESTABLISH_GOVERNMENT_CONTENT } from "./part3/how_did_we_establish_system_government_content.js";

dotenv.config();
console.log("🔥 RUNNING UPDATED SERVER VERSION 2026-04-27");


const app = express();
app.use(cors());
app.use(express.json());

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "EXISTS" : "MISSING");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== MAIN PROMPT =====
const SYSTEM_PROMPT = `
You are a warm, clear, and natural Australian Citizenship tutor for Vietnamese learners.

Your job is to help Vietnamese users understand and remember the official Australian Citizenship test content (Australian Citizenship: Our Common Bond).

You should sound like a real teacher talking to a Vietnamese learner:
- natural
- simple
- warm
- easy to understand
- not robotic
- not overly formal

IMPORTANT:
- Stay strictly within the provided Australian Citizenship study content
- Do not add outside knowledge
- Do not guess broadly
- Do not invent names, dates, places, or events if they are not clearly in the content

=====================
🎯 RESPONSE FORMAT
=====================

*** Part:
- Say clearly which Part (Part 1, 2, 3, or 4)
- If Part 4 → add: "⚠️ Đây là phần Values – rất quan trọng, cần chú ý"

+++ Giải nghĩa:
- Explain in very simple Vietnamese
- Sound like a real teacher explaining gently
- Help the learner understand the idea, not just translate word by word
- If there are multiple points, use short bullet points
- Keep the tone natural and human

** Dẫn chứng from Australian Common Bond:
- If the answer is short → give 1 English sentence
- If the answer has multiple key points → give matching English sentences
- Only use sentences from the provided study content
- Do not invent examples

🇻
+++ Dịch ví dụ:
- Translate all English evidence into simple Vietnamese
- Do not skip any sentence

=====================
📚 STRICT RULES
=====================

1. Use the study content as the main source.

If the answer is clearly related to Australian Citizenship knowledge 
but not found directly in the content, you may still answer using general knowledge.

However:
- Prefer answers that match the official content.
- Keep explanation simple and suitable for learners.
- Do NOT give visa or legal advice.

2. Do not answer outside the content
3. Do not add names, years, places, or events unless they clearly appear in the content
4. Every factual point in the Vietnamese explanation must be supported by the content
5. If one point does not have support in the content, do not include it
6. The Vietnamese explanation must stay within the scope of the English evidence
7. The user may ask in Vietnamese or English
8. Always answer in Vietnamese, except for the English evidence
9. If the user asks for "tất cả", "liệt kê", "everything", give a fuller bullet-point answer
10. If there is not enough information in the content, reply exactly:
"❌ Đây không có trong nội dung trong bài học Quốc Tịch Úc."

11. Do not:
- give visa or migration advice
- sound robotic
- use unnecessarily difficult words
- lecture too much
- add outside knowledge
`;

// ===== VOCAB PROMPT =====
const VOCAB_PROMPT = `
You are helping Vietnamese learners understand English words or phrases used in Australian Citizenship study.

Rules:
- Explain the word or phrase in very simple Vietnamese
- Keep the answer short, clear, and easy to understand
- If helpful, give 1 short English example
- Then translate that example into Vietnamese
- Do not make the answer long
- Do not give visa or migration advice
- If the word is related to Australian Citizenship study, explain it in that learning context

Format:

🇻🇳 Giải nghĩa:
- Giải thích ngắn gọn, dễ hiểu bằng tiếng Việt

📌 Ví dụ ngắn:
- 1 câu tiếng Anh ngắn nếu cần

🇻🇳 Dịch ví dụ:
- Dịch câu ví dụ sang tiếng Việt
`;

// ===== CONTENT MAP =====
const CONTENT_MAP = [
  {
    keywords: [
      "how many parts",
      "citizenship test",
      "study guide",
      "part 1",
      "part 2",
      "part 3",
      "part 4",
      "phần 1",
      "phần 2",
      "phần 3",
      "phần 4",
      "phần quan trọng",
      "phần value",
      "phần values",
      "phần không được sai",
      "phần bắt buộc đúng",
      "value",
      "values",
      "mấy phần",
      "bao nhiêu phần",
      "bài học quốc tịch"
    ],
    content: GENERAL_CONTENT
  },
  {
    keywords: [
      "flag",
      "union jack",
      "southern cross",
      "commonwealth star",
      "lá cờ",
      "cờ úc",
      "quốc kỳ úc"
    ],
    content: FLAG_CONTENT
  },
  {
    keywords: [
      "coat of arms",
      "golden wattle",
      "opal",
      "national flower",
      "biểu tượng",
      "quốc hoa",
      "quốc huy"
    ],
    content: SYMBOLS_CONTENT
  },
  {
    keywords: [
      "aboriginal",
      "torres strait islander",
      "first inhabitants",
      "first people",
      "người bản địa",
      "thổ dân",
      "thổ dân úc",
      "người đầu tiên ở úc",
      "người đầu tiên ở australia"
    ],
    content: FIRST_INHABITANT_CONTENT
  },
  {
    keywords: [
      "first fleet",
      "1788",
      "gold rush",
      "1851",
      "convict",
      "settlement",
      "european settlers",
      "định cư đầu tiên",
      "người châu âu đến úc",
      "đoàn tàu đầu tiên",
      "người đầu tiên định cư",
      "first fleet là ai",
      "người định cư đầu tiên",
      "định cư"
    ],
    content: EARLY_EUROPEAN_SETTLEMENT_CONTENT
  },
  {
    keywords: [
      "federation",
      "1901",
      "world war",
      "migration",
      "liên bang",
      "liên bang úc",
      "1901 là gì"
    ],
    content: NATION_AUSTRALIA_CONTENT
  },
  {
    keywords: [
      "state",
      "territory",
      "capital",
      "capital city",
      "new south wales",
      "victoria",
      "queensland",
      "western australia",
      "south australia",
      "tasmania",
      "australian capital territory",
      "northern territory",
      "sydney",
      "melbourne",
      "brisbane",
      "perth",
      "adelaide",
      "hobart",
      "canberra",
      "darwin",
      "tiểu bang",
      "bang",
      "lãnh thổ",
      "thủ đô",
      "thủ phủ",
      "bao nhiêu tiểu bang",
      "bao nhiêu bang",
      "nước úc có bao nhiêu tiểu bang",
      "úc có bao nhiêu tiểu bang"
    ],
    content: STATES_TERRITORIES_CONTENT
  },
  {
    keywords: [
      "welcome to country",
      "acknowledgement",
      "welcome",
      "acknowledgement of country"
    ],
    content: WELCOME_ACKNOWLEDGEMENT_CONTENT
  },
  {
    keywords: [
      "symbols",
      "coat of arms",
      "national flower",
      "anthem"
    ],
    content: SYMBOLS_CONTENT
  },
  {
    keywords: [
      "rule of law",
      "parliamentary democracy",
      "peaceful",
      "vote"
    ],
    content: DEMOCRATIC_BELIEF_CONTENT
  },
  {
    keywords: [
      "freedom of speech",
      "freedom of association",
      "freedom of religion",
      "association",
      "protest"
    ],
    content: FREEDOMS_CONTENT
  },
  {
    keywords: [
      "gender equality",
      "equality of opportunity",
      "qualification",
      "men and women"
    ],
    content: OUR_EQUALITIES_CONTENT
  },
  {
    keywords: [
      "ato",
      "tax",
      "volunteer",
      "participation",
      "community"
    ],
    content: PARTICIPATION_CONTENT
  },

  {
  keywords: [
    "federation",
    "1901",
    "constitution",
    "australian constitution",
    "referendum",
    "double majority",
    "hiến pháp",
    "liên bang úc",
    "trưng cầu dân ý"
  ],
  content: HOW_DID_WE_ESTABLISH_GOVERNMENT_CONTENT
},
  {
  keywords: [
    "how do i have my say",
    "voting",
    "vote",
    "compulsory voting",
    "secret ballot",
    "aec",
    "australian electoral commission",
    "representative",
    "elected representative",
    "raise concerns",
    "government policy",
    "đi bầu",
    "bầu cử",
    "người đại diện",
    "góp ý chính sách"
  ],
  content: HOW_DO_I_HAVE_MY_SAY_CONTENT
},

  {
    keywords: [
      "anthem",
      "advance australia fair",
      "quốc ca"
    ],
    content: LYRIC_ADVANCE_AUSTRALIA_FAIR_CONTENT
  }
];

console.log("===== SERVER DEBUG START =====");
console.log("CONTENT_MAP total:", CONTENT_MAP.length);

console.log(
  "Freedom exists in CONTENT_MAP:",
  CONTENT_MAP.some(item =>
    item.keywords.some(keyword =>
      keyword.toLowerCase() === "freedom of speech"
    )
  )
);

console.log(
  "Aboriginal exists in CONTENT_MAP:",
  CONTENT_MAP.some(item =>
    item.keywords.some(keyword =>
      keyword.toLowerCase() === "aboriginal"
    )
  )
);

console.log("===== SERVER DEBUG END =====");

// ===== HELPERS =====
function getRelevantContent(question = "") {
  const q = question.toLowerCase().trim();
  if (!q) return "";

  const stopWords = ["of", "the", "a", "an", "is", "are", "là", "gì", "của", "và"];

  for (const item of CONTENT_MAP) {
    const hasMatch = item.keywords.some(keyword => {
      const k = keyword.toLowerCase().trim();

      if (q.includes(k) || k.includes(q)) {
        return true;
      }

      const words = q
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word));

      return words.some(word => k.includes(word));
    });

    if (hasMatch) {
      console.log("✅ MATCH:", item.keywords[0]);
      return item.content;
    }
  }

  console.log("❌ NO MATCH");
  return "";
}

function isVocabQuestion(question = "") {
  const q = question.toLowerCase().trim();

  return (
    (
      q.includes("nghĩa là gì") ||
      q.includes("có nghĩa là gì") ||
      q.includes("là gì") ||
      q.includes("dịch là gì") ||
      q.includes("means") ||
      q.includes("meaning")
    )
  );
}
// ===== FRONTEND =====
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9T13622YKY"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9T13622YKY');
        </script>

        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Australian Citizenship AI Coach</title>
        <style>
          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
            background: #f7f7f8;
            color: #111827;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .app-shell {
            width: 100%;
            max-width: 1100px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #ffffff;
          }

          .header {
            padding: 22px 24px 14px;
            border-bottom: 1px solid #e5e7eb;
            background: #ffffff;
            flex-shrink: 0;
          }

          .title {
            margin: 0;
            font-size: 40px;
            font-weight: 700;
            color: #0f172a;
          }

          .subtitle {
            margin-top: 10px;
            font-size: 16px;
            line-height: 1.5;
            color: #6b7280;
          }

          #chat {
            flex: 1;
            overflow-y: auto;
            padding: 22px 20px 120px;
            background: #f7f7f8;
            display: flex;
            flex-direction: column;
            gap: 14px;
            scroll-behavior: smooth;
          }

          .message-row {
            display: flex;
            width: 100%;
          }

          .message-row.user {
            justify-content: flex-end;
          }

          .message-row.assistant {
            justify-content: flex-start;
          }

          .message {
            max-width: 82%;
            border-radius: 18px;
            padding: 16px 18px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.7;
            font-size: 22px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }

          .message.user {
            background: #dbeafe;
            border: 1px solid #bfdbfe;
          }

          .message.assistant {
            background: #ffffff;
            border: 1px solid #e5e7eb;
          }

          .label {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 8px;
            color: #6b7280;
          }

          .composer-wrap {
            position: sticky;
            bottom: 0;
            background: linear-gradient(to top, #ffffff 70%, rgba(255,255,255,0.85) 100%);
            border-top: 1px solid #e5e7eb;
            padding: 16px 18px 20px;
            flex-shrink: 0;
          }

          .composer-inner {
            max-width: 100%;
            display: flex;
            gap: 12px;
            align-items: flex-end;
          }

          #input {
            flex: 1;
            resize: none;
            min-height: 62px;
            max-height: 180px;
            padding: 16px 18px;
            border: 1px solid #d1d5db;
            border-radius: 18px;
            font-size: 22px;
            line-height: 1.5;
            outline: none;
            background: #ffffff;
            color: #111827;
          }

          #input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          }

          #sendBtn {
            height: 62px;
            min-width: 120px;
            padding: 0 24px;
            border: none;
            border-radius: 16px;
            background: #111827;
            color: #ffffff;
            font-size: 22px;
            font-weight: 600;
            cursor: pointer;
          }

          #sendBtn:hover {
            background: #1f2937;
          }

          #sendBtn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .loading {
            margin-top: 10px;
            font-size: 16px;
            color: #6b7280;
            display: none;
          }

          .empty-state {
            margin: auto;
            max-width: 760px;
            text-align: center;
            color: #6b7280;
            padding: 20px;
            font-size: 20px;
            line-height: 1.7;
          }

          @media (max-width: 900px) {
            .title {
              font-size: 32px;
            }

            .message {
              max-width: 90%;
              font-size: 18px;
            }

            #input {
              font-size: 18px;
            }

            #sendBtn {
              font-size: 18px;
              min-width: 96px;
            }
          }

          @media (max-width: 700px) {
            .app-shell {
              height: 100vh;
            }

            .header {
              padding: 16px 16px 12px;
            }

            .title {
              font-size: 26px;
            }

            .subtitle {
              font-size: 14px;
              margin-top: 8px;
            }

            #chat {
              padding: 14px 12px 110px;
              gap: 10px;
            }

            .message {
              max-width: 100%;
              font-size: 16px;
              line-height: 1.6;
              padding: 12px 14px;
              border-radius: 14px;
            }

            .label {
              font-size: 11px;
              margin-bottom: 6px;
            }

            .composer-wrap {
              padding: 12px 12px 14px;
            }

            .composer-inner {
              gap: 10px;
              align-items: stretch;
            }

            #input {
              min-height: 52px;
              max-height: 140px;
              padding: 12px 14px;
              font-size: 16px;
              border-radius: 14px;
            }

            #sendBtn {
              height: 52px;
              min-width: 84px;
              padding: 0 16px;
              font-size: 16px;
              border-radius: 14px;
            }

            .loading {
              font-size: 14px;
            }

            .empty-state {
              font-size: 16px;
              padding: 12px;
            }
          }
        </style>
      </head>
      <body>
        <div class="app-shell">
          <div class="header">
            <h1 class="title">🇦🇺 Australian Citizenship AI Coach</h1>
            <div class="subtitle">
              This tool is for educational purposes only and is not affiliated with the Australian Government.
            </div>
          </div>

          <div id="chat">
            <div id="emptyState" class="empty-state">
              Hãy nhập câu hỏi về Quốc tịch Úc hoặc hỏi nghĩa của một từ tiếng Anh như:
              <br /><br />
              <strong>Aboriginal là ai?</strong><br />
              <strong>settlement là gì?</strong>
            </div>
          </div>

          <div class="composer-wrap">
            <div class="composer-inner">
              <textarea
                id="input"
                placeholder="Ask something..."
                rows="1"
              ></textarea>
              <button id="sendBtn" type="button">Send</button>
            </div>
            <div id="loading" class="loading">Đang trả lời...</div>
          </div>
        </div>

        <script>
          const input = document.getElementById("input");
          const sendBtn = document.getElementById("sendBtn");
          const chat = document.getElementById("chat");
          const loading = document.getElementById("loading");
          const emptyState = document.getElementById("emptyState");

          let isSending = false;

          function escapeHtml(text) {
            const div = document.createElement("div");
            div.innerText = text;
            return div.innerHTML;
          }

          function addMessage(role, text) {
            if (emptyState) {
              emptyState.style.display = "none";
            }

            const row = document.createElement("div");
            row.className = "message-row " + role;

            const box = document.createElement("div");
            box.className = "message " + role;
            box.innerHTML =
              "<div class='label'>" +
              (role === "user" ? "Bạn hỏi" : "AI trả lời") +
              "</div>" +
              escapeHtml(text);

            row.appendChild(box);
            chat.appendChild(row);
            chat.scrollTop = chat.scrollHeight;
          }

          function autoResize() {
            input.style.height = "auto";
            input.style.height = Math.min(input.scrollHeight, 180) + "px";
          }

          async function send() {
            const message = input.value.trim();

            if (!message || isSending) return;

            isSending = true;
            sendBtn.disabled = true;
            loading.style.display = "block";

            addMessage("user", message);

            input.value = "";
            autoResize();
            input.blur();

            try {
              const res = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
              });

              const data = await res.json();
              addMessage("assistant", data.reply || data.error || "Có lỗi xảy ra.");

              if (typeof gtag === "function") {
                gtag("event", "ask_question", {
                  question_length: message.length
                });
              }
            } catch (error) {
              addMessage("assistant", "Có lỗi xảy ra khi gửi câu hỏi.");
            } finally {
              loading.style.display = "none";
              sendBtn.disabled = false;
              isSending = false;

              setTimeout(() => {
                input.focus();
              }, 50);
            }
          }

          sendBtn.addEventListener("pointerdown", function(event) {
            event.preventDefault();
            send();
          });

          input.addEventListener("input", autoResize);

          input.addEventListener("keydown", function(event) {
            if (event.isComposing) return;
          });

          input.focus();
          autoResize();
        </script>
      </body>
    </html>
  `);
});


// ===== CHAT =====
app.get("/debug-match", (req, res) => {
  const question = req.query.q || "freedom of speech là gì";
  const content = getRelevantContent(question);
fs.appendFileSync(
  "questions.log",
  `\n${new Date().toISOString()} - ${userMessage}`
);

  res.json({
    question,
    matched: !!content,
    matchedPart: content?.part || null,
    matchedSection: content?.section || null,
    totalContentMap: CONTENT_MAP.length,
    freedomKeywords: CONTENT_MAP.find(item =>
      item.content === FREEDOMS_CONTENT
    )?.keywords || []
  });
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  console.log("User question:", userMessage);

  try {
    const content = getRelevantContent(userMessage);
    console.log("Matched content:", content ? "YES" : "NO");

    if (content) {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
        {
  role: "system",
  content: "Use this study content only:\n\n" + JSON.stringify(content, null, 2)
},
          { role: "user", content: userMessage }
        ],
      });

      return res.json({
        reply: response.choices[0].message.content
      });
    }

    if (isVocabQuestion(userMessage)) {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: VOCAB_PROMPT },
          { role: "user", content: userMessage }
        ],
      });

      return res.json({
        reply: response.choices[0].message.content
      });
    }

    return res.json({
      reply: "❌ Đây không có trong nội dung trong bài học Quốc Tịch Úc."
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.json({ error: error.message || "Error" });
  }
});



// ===== RUN SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});