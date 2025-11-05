import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <Container>
      <div className="my-10 max-w-3xl space-y-6">
  <h1 className="text-4xl font-bold text-(--primary)">About</h1>
  <p className="text-(--foreground)/80 text-lg leading-relaxed">
          Responsible AI Global University Ranking (RAI) is a project to map the level of
          trustworthiness of universities in the responsible use of AI. The frontend is built with Next.js + Tailwind.
          The backend will use Django and MongoDB, while the AI pipeline uses TensorFlow,
          PyTorch, scikit-learn, pandas, and numpy to analyze evaluation metrics.
        </p>
        <div className="card p-6 bg-linear-to-br from-[#FFF0F0] to-white">
          <h2 className="text-xl font-bold text-(--primary) mb-3">Visual Identity</h2>
          <p className="text-(--foreground)/80 leading-relaxed">
            Background: <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#FAF9F6</span> (cream),
            gradient accent from <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#C84B4B</span> (red)
            to <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#A83A3A</span> (dark red),
            and text <span className="font-mono text-sm bg-(--muted) px-2 py-1 rounded">#3D1F1F</span> (dark brown).
            The design prioritizes readability and high contrast.
          </p>
        </div>
      </div>
    </Container>
  );
}
