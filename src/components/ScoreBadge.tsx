export default function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 85
      ? "bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white shadow-lg shadow-[#0047AB]/30"
      : score >= 75
      ? "bg-gradient-to-r from-[#0099ED] to-[#00BFFF] text-white shadow-lg shadow-[#0099ED]/30"
      : "bg-gradient-to-r from-[#A9A9A9] to-[#C0C0C0] text-white shadow-lg shadow-gray-400/30";
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-bold text-sm ${tone} border-2 border-white/20 min-w-[60px]`}
    >
      {score}
    </span>
  );
}
