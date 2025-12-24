import Container from "@/components/Container";

export default function MethodologyPage() {
  return (
    <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#000080] mb-6">
            Methodology
          </h1>
          <p className="text-[#000080]/70 text-lg leading-relaxed font-medium">
            The RAI score combines several metrics: transparency, auditability,
            data privacy, and AI policy maturity. The next stage will integrate
            a Django + MongoDB backend and an analytics pipeline using
            TensorFlow, PyTorch, scikit-learn, pandas, and numpy.
          </p>

          <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white border-2 border-[#0047AB]/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-[#000080] mb-6">
              Assessment Dimensions
            </h2>
            <ul className="list-disc space-y-4 pl-6 text-[#000080]/70 text-lg">
              <li>
                <strong className="text-[#000080]">Transparency:</strong>{" "}
                availability of AI policies and documentation
              </li>
              <li>
                <strong className="text-[#000080]">Auditability:</strong>{" "}
                ability to conduct internal/external audits of AI systems
              </li>
              <li>
                <strong className="text-[#000080]">Data Privacy:</strong>{" "}
                compliance with data management and privacy protection
              </li>
              <li>
                <strong className="text-[#000080]">AI Policy:</strong> maturity
                of AI policies/ethics committee
              </li>
            </ul>

            <p className="text-[#000080]/70 text-lg leading-relaxed font-medium mt-6">
              Each dimension is normalized on a 0–100 scale. Default weights can
              be adjusted as the evaluation model is backtested using a broader
              dataset.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
