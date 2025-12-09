import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#000080] mb-6">About RAI</h1>
          <p className="text-[#000080]/80 text-lg leading-relaxed font-medium">
            Responsible AI Global University Ranking (RAI) is a project to map
            the level of trustworthiness of universities in the responsible use
            of AI. The frontend is built with Next.js + Tailwind. The backend
            will use Django and MongoDB, while the AI pipeline uses TensorFlow,
            PyTorch, scikit-learn, pandas, and numpy to analyze evaluation
            metrics.
          </p>

          <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white border-2 border-[#0047AB]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#000080] mb-4">
              Visual Identity
            </h2>
            <p className="text-[#000080]/80 leading-relaxed font-medium">
              Background:{" "}
              <span className="font-mono text-sm bg-[#0047AB]/10 px-3 py-1 rounded-lg font-bold text-[#0047AB] border border-[#0047AB]/20">
                #F0F4FF
              </span>{" "}
              (light blue), gradient accent from{" "}
              <span className="font-mono text-sm bg-[#0047AB]/10 px-3 py-1 rounded-lg font-bold text-[#0047AB] border border-[#0047AB]/20">
                #0047AB
              </span>{" "}
              (cobalt) to{" "}
              <span className="font-mono text-sm bg-[#0047AB]/10 px-3 py-1 rounded-lg font-bold text-[#0047AB] border border-[#0047AB]/20">
                #0099ED
              </span>{" "}
              (light cobalt), and text{" "}
              <span className="font-mono text-sm bg-[#0047AB]/10 px-3 py-1 rounded-lg font-bold text-[#000080] border border-[#0047AB]/20">
                #000080
              </span>{" "}
              (navy). The design prioritizes modern futuristic aesthetics with
              high contrast.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
