import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
    console.error("⚠️ PERINGATAN: GEMINI_API_KEY tidak terdeteksi di dalam file .env!");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateContentWithRetry(promptText, imagePart) {
    const maxRetries = 5;
    let delay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [promptText, imagePart],
                config: {
                    responseMimeType: 'application/json'
                }
            });
            return response;
        } catch (error) {
            const isRateLimit = error.status === 429 || 
                                (error.message && error.message.includes("429")) || 
                                (error.message && error.message.toLowerCase().includes("quota"));

            if (isRateLimit && attempt < maxRetries - 1) {
                console.log(`⚠️ Batas limit API (429) terdeteksi. Mencoba kembali otomatis (Percobaan ${attempt + 1}/${maxRetries}) dalam ${delay / 1000} detik...`);
                await sleep(delay);
                delay *= 2; 
            } else {
                throw error;
            }
        }
    }
}

app.post('/api/analisis-daging', upload.single('gambarDaging'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Mohon unggah gambar daging terlebih dahulu.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'GEMINI_API_KEY belum terkonfigurasi. Pastikan berkas .env Anda telah diletakkan di folder utama proyek.' 
            });
        }

        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        };

        const promptText = `
        BERTINDAKLAH SEBAGAI:
        Sistem Visi Komputer berbasis Pengolahan Citra Digital (PCD) dan Kecerdasan Buatan untuk inspeksi kualitas mutu daging dan perikanan secara ilmiah.
        
        TUGAS UTAMA:
        Ekstrak dan analisis fitur visual dari citra masukan dengan parameter keilmuan PCD sebagai berikut:
        1. Fitur Warna (Color Features): Analisis distribusi intensitas warna R, G, B pada permukaan komoditas. Amati indikasi deoksigenasi mioglobin (rona kecokelatan/kusam) atau diskolorasi (rona hijau/abu-abu pembusukan).
        2. Fitur Tekstur (Texture Features): Analisis keteraturan visual tekstur permukaan, kekasaran, serta deteksi anomali spasial seperti pertumbuhan spora jamur/kapang (lapisan putih/kelabu berbulu halus).
        3. Fitur Bentuk dan Batas Tepi (Shape & Boundary Features): Analisis keutuhan bentuk struktural fisik luar komoditas.

        ATURAN PENILAIAN KRITIS (STANDAR KELAYAKAN):
        - Skor Maksimal: Batasi skor kelayakan di angka maksimal 95%. Hindari 100% karena analisis hanya berbasis representasi 2D visual citra (bukan uji laboratorium kimia).
        - Penalti Jamur & Diskolorasi Parah: Jika terdeteksi spora jamur, kapang, bercak putih asing, atau perubahan warna kehijauan pembusukan secara nyata di permukaan kulit/daging, skor kelayakan WAJIB dijatuhkan di bawah 50% (Kategori Mutlak: TIDAK LAYAK KONSUMSI).

        Kembalikan respons HANYA dalam format JSON murni terstruktur tanpa pembungkus blok markdown:
        {
          "jenis_daging": "Nama spesifik hewan serta tipe potongan fisik yang terdeteksi",
          "deskripsi": {
            "warna": "Deskripsi fitur warna utama permukaan dan distribusinya",
            "tekstur": "Deskripsi fitur tekstur spasial dan apakah ada indikasi jamur/kapang",
            "shapes": "Deskripsi integritas batas tepi kontur fisik potongan komoditas"
          },
          "persentase_kelayakan": 80,
          "alasan_kelayakan": "Penjelasan akademis ringkas mengapa skor tersebut diberikan berdasarkan hasil ekstraksi fitur visual di atas."
        }
        Catatan: Kolom 'persentase_kelayakan' harus bernilai angka bulat (integer) rentang 0-95.
        `;

        const response = await generateContentWithRetry(promptText, imagePart);

        if (!response || !response.text) {
            throw new Error("Layanan AI terhubung tetapi tidak mengirimkan teks respons kembali.");
        }

        let cleanText = response.text.trim();
        if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        }

        const resultJson = JSON.parse(cleanText);
        res.json(resultJson);

    } catch (error) {
        console.error('=== DETAIL DETEKSI EROR SERVER ===');
        console.error(error);
        console.error('==================================');

        let friendlyMessage = error.message || 'Terjadi kesalahan internal pada sistem analisis AI.';
        if (error.status === 429 || friendlyMessage.includes("429") || friendlyMessage.toLowerCase().includes("quota")) {
            friendlyMessage = "Batas kuota harian/menit dari Google Gemini telah tercapai. Silakan coba kembali beberapa saat lagi atau gunakan API Key berbayar.";
        }

        res.status(500).json({ 
            error: `Gagal memproses AI: ${friendlyMessage}` 
        });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});