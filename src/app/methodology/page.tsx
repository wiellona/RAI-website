import Container from "@/components/Container";

export default function MethodologyPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#5C2E2E] mb-6">Methodology</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
          The RAI score combines several metrics: transparency, auditability,
          data privacy, and AI policy maturity.
          The next stage will integrate a Django + MongoDB backend and an analytics
          pipeline using TensorFlow, PyTorch, scikit-learn, pandas, and numpy.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#5C2E2E] mb-6">Assessment Dimensions</h2>
            <ul className="list-disc space-y-4 pl-6 text-gray-700 text-lg">
              <li><strong className="text-[#5C2E2E]">Transparency:</strong> availability of AI policies and documentation</li>
              <li><strong className="text-[#5C2E2E]">Auditability:</strong> ability to conduct internal/external audits of AI systems</li>
              <li><strong className="text-[#5C2E2E]">Data Privacy:</strong> compliance with data management and privacy protection</li>
              <li><strong className="text-[#5C2E2E]">AI Policy:</strong> maturity of AI policies/ethics committee</li>
            </ul>
            
            <p className="text-gray-700 text-lg leading-relaxed mt-6">
              Each dimension is normalized on a 0–100 scale. Default weights can be adjusted
              as the evaluation model is backtested using a broader dataset.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
