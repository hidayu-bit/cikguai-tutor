import { GoogleGenAI } from '@google/genai';
import curriculumKB from '../data/curriculum_kb.json';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const cfAccountId = import.meta.env.VITE_CF_ACCOUNT_ID;
const cfApiToken = import.meta.env.VITE_CF_API_TOKEN;

const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

function buildSystemPrompt({ username, gradeLevel, preferredLanguage, learningMode, tutorName, lessonTopic }) {
    const syllabus =
        curriculumKB[gradeLevel] ||
        curriculumKB['Bridge & Lower Secondary (Age 12–15 / Std 6 – Form 3)'];

    const safeName = username && username.trim().length > 1 ? username.trim() : 'pelajar';

    const personaDesc =
        tutorName === 'Ruby'
            ? 'Kamu ialah Cikgu Ruby: sangat ceria, bertenaga, mesra pelajar, suka memberi pujian bersemangat (cth: "Wah, hebat cubaan tu!", "Jom kita tengok sama-sama!"), dan menggunakan bahasa yang hidup serta menyeronokkan.'
            : 'Kamu ialah Cikgu Marcel: tenang, penyabar, tersusun, berwibawa tetapi lembut, menerangkan konsep langkah demi langkah secara teratur (cth: "Mari kita teliti satu per satu...", "Bagus, langkah seterusnya ialah...").';

    const langRule =
        preferredLanguage === 'Bahasa Melayu'
            ? 'Gunakan 100% Bahasa Melayu standard Malaysia (DBP / KSSM).'
            : 'Use clear English for explanations, while keeping all Bahasa Melayu grammar terms, idioms, and examples in accurate Malaysian Bahasa Melayu (DBP/KSSM).';

    return `
Kamu ialah ${tutorName}, guru tuisyen AI Bahasa Melayu bagi pelajar sekolah di Malaysia.
${personaDesc}

PROFIL & TOPIK SEMASA:
- Panggilan Pelajar: ${safeName} (JANGAN guna singkatan 1 huruf seperti "y")
- TOPIK UTAMA SESI INI: "${lessonTopic || 'Penjodoh Bilangan'}" (WAJIB kekal dalam topik ini sepanjang sesi!)
- Tahap Pendidikan: ${gradeLevel}
- Silabus: ${syllabus.syllabus}
- Mod: ${learningMode}

PERATURAN BAHASA MELAYU MALAYSIA (DBP / KSSM):
1. DILARANG KERAS menggunakan perkataan Indonesia ("bisa", "enggak", "kapan", "banget", "gimana", "kalimat").
2. WAJIB gunakan Bahasa Melayu Malaysia rasmi ("boleh", "tidak", "bila", "sangat", "bagaimana", "ayat").
3. Ketepatan tatabahasa DBP wajib dipatuhi:
   - Telur, epal, durian, bola = "sebiji" (BUKAN "sebutir").
   - Beras, pasir, mutiara, peluru = "sebutir".
   - Sawah, tanah, kebun = "sepetak".
   - Buku, rumah, kereta = "sebuah".
4. ${langRule}

PERATURAN LOGIK PENGAJARAN & PAPAN PUTIH:
1. SEMAK JAWAPAN PELAJAR DAHULU: Jika INPUT PELAJAR ialah percubaan menjawab soalan sebelumnya:
   - Jika SALAH (cth: menjawab "sepetak" untuk "buku"), nyatakan pembetulan dengan mesra pada "formula_or_rule" (cth: "Jawapan 'sepetak' untuk tanah/sawah. Untuk buku, gunakan 'sebuah'.") dan terangkan dalam "tutor_speech".
   - Jika BETUL, puji ${safeName} dan perkenalkan contoh baharu yang belum pernah dibincangkan.
2. DILARANG MEMBOCORKAN JAWAPAN DALAM SOALAN: Dalam "follow_up_question", JANGAN tulis jawapannya sekali (SALAH: "Apakah penjodoh bilangan untuk sebuah buku?" -> BETUL: "Apakah penjodoh bilangan yang betul untuk buku?").
3. DILARANG mengulang contoh yang sudah tersenarai dalam SEJARAH PERBUALAN.
4. "image_prompt": Tulis deskripsi visual yang sangat jelas dalam Bahasa Inggeris untuk ilustrasi cat air buku teks (cth: "a brown chicken egg and a cracked egg showing yellow yolk on a kitchen plate", "a stack of colorful school books on a wooden desk").

FORMAT JAWAPAN (JSON SAH SAHAJA TANPA MARKDOWN):
{
  "board_title": "Tajuk topik ${lessonTopic} ringkas (maksimum 4 patah perkataan)",
  "mindmap_branches": [
    "2-3 patah perkataan sahaja (TANPA tulis 'Kata Kunci 1:'). Cth Penjodoh Bilangan: 'bilah : pisau', Cth Tatabahasa: 'dari : tempat/masa'",
    "2-3 patah perkataan sahaja (cth: 'jambak : bunga' atau 'daripada : punca/asal')",
    "2-3 patah perkataan sahaja (cth: 'keping : roti' atau 'pada : waktu/benda')",
    "2-3 patah perkataan sahaja (cth: 'pucuk : surat' atau 'kepada : manusia')",
    "2-3 patah perkataan sahaja (cth: 'rawan : jala' atau 'di : tempat')",
    "2-3 patah perkataan sahaja (cth: 'utas : rantai' atau 'ke : arah')"
  ],
  "formula_or_rule": "Penerangan ringkas dan pembetulan jawapan pelajar jika berkaitan (1-2 baris pendek)",
  "example_text": "Contoh: Ayat lengkap yang tepat bagi topik ${lessonTopic}",
  "target_word": "Satu perkataan atau frasa kunci dalam example_text untuk dibulatkan merah",
  "image_prompt": "Clear, specific literal visual scene of the example in English for a watercolor textbook illustration",
  "meaning_or_takeaway": "Tip / Maksud: Ringkasan 1 baris pendek yang mudah diingat (maksimum 45 aksara)",
  "follow_up_question": "Satu soalan latihan ${lessonTopic} untuk ${safeName} jawab. DILARANG KERAS meletakkan penjodoh bilangan atau perkataan jawapan di dalam soalan (SALAH: 'Apakah penjodoh bilangan untuk sebutir beras?' -> BETUL: 'Apakah penjodoh bilangan yang sesuai bagi beras?').",
  "tutor_speech": "Skrip suara mesra ${tutorName} (2 ayat pendek) menerangkan peta minda kata kunci dan konsep ${lessonTopic} kepada ${safeName}."
}
`.trim();
}

export async function generateIllustrationImage(imagePrompt) {
    if (!cfAccountId || !cfApiToken || !imagePrompt || !imagePrompt.trim()) return null;

    try {
        const response = await fetch(
            `/api/cf-image/client/v4/accounts/${cfAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${cfApiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `${imagePrompt.trim()}, hand-drawn educational textbook watercolor illustration, fine ink outlines, isolated subject on pure solid white background #FFFFFF, minimalist, clean, no borders, no frames`,
                    steps: 4,
                }),
            }
        );

        if (!response.ok) {
            console.warn('Cloudflare FLUX API status:', response.status);
            return null;
        }

        const json = await response.json();
        const base64Image = json?.result?.image;
        return base64Image ? `data:image/png;base64,${base64Image}` : null;
    } catch (err) {
        console.warn('Cloudflare FLUX image error:', err);
        return null;
    }
}

export async function generateWhiteboardLesson({
    userMessage,
    chatHistory = [],
    username,
    gradeLevel,
    preferredLanguage,
    learningMode,
    tutorName,
    lessonTopic,
}) {
    const systemPrompt = buildSystemPrompt({
        username,
        gradeLevel,
        preferredLanguage,
        learningMode,
        tutorName,
        lessonTopic,
    });

    const historyText = chatHistory
        .slice(-6)
        .map((m) => `${m.sender === 'student' ? 'Pelajar' : tutorName}: ${m.text}`)
        .join('\n');

    const fullPrompt = `${systemPrompt}\n\nSEJARAH PERBUALAN:\n${historyText || '(Permulaan sesi)'}\n\nINPUT PELAJAR:\n${userMessage}`;

    if (ai) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash-lite',
                contents: fullPrompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.4,
                },
            });

            const rawText = response.text || '';
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            const imageDataUrl = await generateIllustrationImage(parsed.image_prompt);

            return { provider: 'gemini', data: { ...parsed, imageDataUrl } };
        } catch (err) {
            console.warn('Gemini gagal, beralih ke OpenRouter:', err);
        }
    }

    if (openRouterApiKey) {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${openRouterApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openrouter/free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `Sejarah perbualan:\n${historyText}\n\nSoalan/Topik pelajar: ${userMessage}`,
                    },
                ],
                temperature: 0.4,
            }),
        });

        if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);

        const json = await res.json();
        const content = json.choices?.[0]?.message?.content || '';
        const cleaned = content.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const imageDataUrl = await generateIllustrationImage(parsed.image_prompt);
        return { provider: 'openrouter', data: { ...parsed, imageDataUrl } };
    }

    throw new Error('Tiada kunci API dikonfigurasikan dalam .env');
}