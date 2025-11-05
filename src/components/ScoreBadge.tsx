export default function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 85 ? "text-green-700" : score >= 75 ? "text-amber-700" : "text-red-700";
  return (
    <span className={`badge ${tone} font-semibold`}>
      {score}
    </span>
  );
}
