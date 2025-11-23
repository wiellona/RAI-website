import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#5C2E2E] mb-6">About RAI</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
          Responsible AI Global University Ranking (RAI) is a project to map the level of
          trustworthiness of universities in the responsible use of AI. The frontend is built with Next.js + Tailwind.
          The backend will use Django and MongoDB, while the AI pipeline uses TensorFlow,
          PyTorch, scikit-learn, pandas, and numpy to analyze evaluation metrics.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-4">Visual Identity</h2>
            <p className="text-gray-700 leading-relaxed">
            Background: <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#FAF9F6</span> (cream),
            gradient accent from <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#C84B4B</span> (red)
            to <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#A83A3A</span> (dark red),
            and text <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#3D1F1F</span> (dark brown).
            The design prioritizes readability and high contrast.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
