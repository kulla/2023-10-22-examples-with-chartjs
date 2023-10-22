import { Scatter } from "react-chartjs-2";
import {
  Chart,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Colors,
} from "chart.js";
import "./App.css";

Chart.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Colors);

function App() {
  const sequence = generateConvergingSequence({
    target: 2.5,
    oscillationRange: 2.5,
    convergenceSpeed: 1.2,
    sequenceLength: 100,
  });

  const data = {
    datasets: [
      {
        label: "Sequence",
        data: sequence.map((x) => ({ x, y: 0 })),
      },
    ],
  };

  return (
    <div className="App">
      <h2>Sequence on the number line</h2>
      <div style={{ height: 150 }}>
        <Scatter
          data={data}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 1, display: false },
              x: { min: 0, max: 5, grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
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
