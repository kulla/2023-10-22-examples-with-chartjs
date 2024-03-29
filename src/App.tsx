import { Scatter, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Colors,
  AnimationSpec,
} from "chart.js";
import { getRelativePosition } from "chart.js/helpers";
import "./App.css";
import { useState } from "react";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Colors
);

function App() {
  const sequence = generateConvergingSequence({
    target: 2.5,
    oscillationRange: 2.5,
    convergenceSpeed: 1.2,
    sequenceLength: 100,
  });

  const totalDuration = 2000;
  const delayBetweenPoints = totalDuration / sequence.length;
  const previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx: any) {
        if (ctx.type !== "data" || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  } as unknown as AnimationSpec<"scatter">;

  return (
    <div className="App">
      <h2>Sequence on the number line</h2>
      <div style={{ height: 150 }}>
        <Scatter
          data={{
            datasets: [
              {
                label: "Sequence",
                data: sequence.map((x) => ({ x, y: 0 })),
              },
            ],
          }}
          options={{
            animation,
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 1, display: false },
              x: { min: 0, max: 5, grid: { display: false } },
            },
          }}
        />
      </div>
      <h2>Sequence in the diagram</h2>
      <Scatter
        data={{
          datasets: [
            {
              label: "Sequence",
              data: sequence.map((x, n) => ({ x, y: n + 1 })),
            },
          ],
        }}
        options={{
          animation,
          scales: {
            y: { beginAtZero: true },
            x: { min: 0, max: 5 },
          },
        }}
      />
      <SequenceDiagramWithLimit sequence={sequence} />
    </div>
  );
}

function SequenceDiagramWithLimit({ sequence }: { sequence: number[] }) {
  const [value, setValue] = useState<number | null>(1.5);

  return (
    <>
      <h2>Click value in diagram</h2>
      <Chart
        type={"scatter"}
        data={{
          datasets: [
            ...(value
              ? [
                  {
                    label: `Wert`,
                    type: "line" as const,
                    data: [
                      { x: value, y: 0 },
                      { x: value, y: sequence.length },
                    ],
                  },
                ]
              : []),
            {
              label: "Sequence",
              type: "scatter",
              data: sequence.map((x, n) => ({ x, y: n + 1 })),
            },
          ],
        }}
        options={{
          onClick(event, _, chart) {
            // @ts-expect-error
            const canvasPosition = getRelativePosition(event, chart);

            // Substitute the appropriate scale IDs
            const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);

            if (dataX) {
              setValue(dataX);
            }
          },
          scales: {
            y: { beginAtZero: true },
            x: { min: 0, max: 5 },
          },
        }}
      />
      <b>Wert: {value}</b>
    </>
  );
}

function generateConvergingSequence({
  target,
  oscillationRange,
  convergenceSpeed,
  sequenceLength,
}: {
  target: number;
  oscillationRange: number;
  convergenceSpeed: number;
  sequenceLength: number;
}) {
  const sequence = [];

  for (let n = 1; n <= sequenceLength; n++) {
    const randomNumber = 2 * Math.random() - 1;
    const oscillation =
      (oscillationRange * randomNumber) / n ** convergenceSpeed;
    sequence.push(target + oscillation);
  }

  return sequence;
}

export default App;
