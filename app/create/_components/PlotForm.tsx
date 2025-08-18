"use client";

interface PlotFormProps {
  plot: string;
  setPlot: (plot: string) => void;
}

export function PlotForm({ plot, setPlot }: PlotFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">줄거리</h3>
      <textarea
        value={plot}
        onChange={(e) => setPlot(e.target.value)}
        placeholder="세계관의 전체적인 줄거리를 입력해주세요..."
        className="w-full p-3 border rounded-lg"
        rows={8}
      />
      <p className="text-sm text-gray-500">
        최소 100자 이상 작성해주세요
      </p>
    </div>
  );
}