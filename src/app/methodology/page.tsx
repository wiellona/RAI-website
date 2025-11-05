import Container from "@/components/Container";

export default function MethodologyPage() {
  return (
    <Container>
      <div className="my-10 max-w-3xl space-y-6">
  <h1 className="text-4xl font-bold text-(--primary)">Methodology</h1>
  <p className="text-(--foreground)/80 text-lg leading-relaxed">
          The RAI score combines several metrics: transparency, auditability,
          data privacy, and AI policy maturity.
          The next stage will integrate a Django + MongoDB backend and an analytics
          pipeline using TensorFlow, PyTorch, scikit-learn, pandas, and numpy.
        </p>
  <h2 className="mt-8 text-2xl font-bold text-(--primary)">Assessment Dimensions</h2>
  <ul className="list-disc space-y-3 pl-6 text-(--foreground)/80 text-lg">
          <li><strong className="text-(--primary)">Transparency:</strong> availability of AI policies and documentation</li>
          <li><strong className="text-(--primary)">Auditability:</strong> ability to conduct internal/external audits of AI systems</li>
          <li><strong className="text-(--primary)">Data Privacy:</strong> compliance with data management and privacy protection</li>
          <li><strong className="text-(--primary)">AI Policy:</strong> maturity of AI policies/ethics committee</li>
        </ul>
  <p className="text-(--foreground)/80 text-lg leading-relaxed">
          Each dimension is normalized on a 0–100 scale. Default weights can be adjusted
          as the evaluation model is backtested using a broader dataset.
        </p>
      </div>
    </Container>
  );
}
