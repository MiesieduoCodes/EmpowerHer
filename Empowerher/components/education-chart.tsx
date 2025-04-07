"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function EducationChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Destroy existing chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Urban", "Rural", "Low Income", "Middle Income", "High Income"],
            datasets: [
              {
                label: "Girls in School (%)",
                data: [85, 62, 58, 78, 92],
                backgroundColor: "rgba(147, 51, 234, 0.7)",
                borderColor: "rgba(147, 51, 234, 1)",
                borderWidth: 1,
              },
              {
                label: "Scholarship Access (%)",
                data: [42, 18, 15, 35, 65],
                backgroundColor: "rgba(20, 184, 166, 0.7)",
                borderColor: "rgba(20, 184, 166, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  // Make legend more readable on small screens
                  boxWidth: 10,
                  padding: 10,
                  font: {
                    size: 10,
                  },
                },
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Percentage (%)",
                },
                ticks: {
                  // Make y-axis ticks more readable on small screens
                  font: {
                    size: 10,
                  },
                },
              },
              x: {
                ticks: {
                  // Make x-axis labels more readable on small screens
                  maxRotation: 45,
                  minRotation: 45,
                  font: {
                    size: 10,
                  },
                },
              },
            },
          },
        })
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

