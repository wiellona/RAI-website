# AI Analysis Feature - Setup Guide

## 🤖 Fitur AI-Powered Analysis

Fitur ini menggunakan **Google Gemini AI** dan **LangChain** untuk menganalisis metrik universitas dan memberikan rekomendasi perbaikan yang detail dan actionable.

## 📋 Yang Sudah Diimplementasikan

### 1. **Backend AI Service** (`src/lib/geminiAI.ts`)
- Integrasi dengan Gemini Pro menggunakan LangChain
- Prompt engineering untuk analisa mendalam
- Error handling yang robust

### 2. **API Endpoint** (`src/app/api/admin/analyze-university/route.ts`)
- POST endpoint untuk analisa universitas
- Integrasi dengan Supabase untuk ambil data
- Response terstruktur dengan analysis result

### 3. **UI Component** (`src/components/admin/AIAnalysis.tsx`)
- Dropdown untuk pilih universitas
- Loading state dengan spinner
- Modal popup scrollable dengan tema yang matching
- Gradient purple-blue sesuai dengan tema aplikasi
- Error handling dan user feedback

### 4. **Admin Dashboard Integration**
- Komponen AI Analysis ditambahkan di halaman admin
- Grid layout responsive
- Posisi strategis di samping Process Scores

## 🚀 Cara Setup

### 1. **Dapatkan Gemini API Key**

1. Buka: https://makersuite.google.com/app/apikey
2. Login dengan Google Account
3. Klik **"Get API Key"** atau **"Create API Key"**
4. Copy API key yang dihasilkan

### 2. **Tambahkan ke Environment Variables**

Edit file `.env.local`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. **Restart Development Server**

```bash
npm run dev
```

## 💡 Cara Menggunakan

### Di Admin Dashboard:

1. **Pilih Universitas**
   - Buka halaman Admin Dashboard
   - Scroll ke section "AI-Powered Analysis"
   - Pilih universitas dari dropdown

2. **Klik Analyze**
   - Klik tombol "Analyze & Get Recommendations"
   - Tunggu beberapa detik (AI sedang menganalisa)

3. **Lihat Hasil**
   - Modal akan muncul dengan analisa lengkap:
     - Overall Assessment
     - Strengths
     - Areas for Improvement
     - Specific Recommendations
     - Priority Actions
   - Scroll untuk melihat semua rekomendasi
   - Klik "Close" untuk menutup

## 📊 Output Analysis

AI akan memberikan:

### ✅ **Overall Assessment**
Ringkasan singkat tentang standing universitas dalam AI responsibility

### 💪 **Strengths**
Metrik apa yang sudah bagus dan mengapa

### ⚠️ **Areas for Improvement**
Metrik mana yang perlu perhatian khusus

### 🎯 **Specific Recommendations**
- Langkah-langkah konkret untuk setiap metrik yang lemah
- Praktis dan actionable
- Disesuaikan dengan konteks universitas

### 🔥 **Priority Actions**
Top 3 aksi paling penting yang harus dilakukan segera

## 🎨 Design Features

### Tema & Warna
- ✅ Gradient purple-blue sesuai dengan brand
- ✅ Card dengan shadow dan border radius
- ✅ Hover effects pada button
- ✅ Smooth transitions

### Modal
- ✅ Overlay dengan backdrop blur
- ✅ Scrollable content untuk hasil panjang
- ✅ Responsive design
- ✅ Max-height 80vh untuk semua layar
- ✅ Header dengan gradient background
- ✅ Footer dengan action button

### UX
- ✅ Loading spinner saat proses analisa
- ✅ Error messages yang informatif
- ✅ Disabled state untuk mencegah double-click
- ✅ Clear visual feedback

## 🔧 Technical Stack

- **AI Model**: Google Gemini 1.5 Flash Latest
- **SDK**: @google/generative-ai (Native Google SDK)
- **UI**: React + TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js App Router
- **Database**: Supabase

## 📝 Notes

- API key Gemini **GRATIS** dengan quota yang cukup untuk development
- Response time biasanya 2-5 detik tergantung kompleksitas
- Analysis disimpan hanya di frontend (tidak di database)
- Setiap request akan hit Gemini API (real-time analysis)
- Model yang digunakan: **gemini-1.5-flash-latest** (updated Nov 2024)

## 🎯 Future Improvements

- [ ] Cache analysis results di database
- [ ] Export analysis sebagai PDF
- [ ] Batch analysis untuk multiple universities
- [ ] Historical analysis tracking
- [ ] Custom prompt templates
- [ ] Benchmark comparison dengan universitas lain

## 🐛 Troubleshooting

### Error: "Gemini API key is not configured"
- Pastikan `GEMINI_API_KEY` sudah di set di `.env.local`
- Restart development server setelah update env

### Error: "Failed to analyze university"
- Check API key valid
- Check internet connection
- Check Gemini API quota/limits

### Modal tidak muncul
- Check browser console untuk error
- Pastikan z-index tidak bentrok dengan komponen lain

## 📚 Resources

- Gemini API Docs: https://ai.google.dev/docs
- LangChain Docs: https://js.langchain.com/docs/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
