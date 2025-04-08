"use client"

import { useState } from "react"
import { Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EducationChart } from "@/components/education-chart"
import { Header } from "@/app/header"

export default function InsightsPage() {
  const [region, setRegion] = useState("global")

  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage="insights" />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Education Insights</h1>
              <p className="text-muted-foreground">
                Real-time data on education disparities and the impact of scholarships on girls' education.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Tabs defaultValue="overview" className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <TabsList className="flex overflow-x-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="namerica">North America</SelectItem>
                        <SelectItem value="samerica">South America</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download data</span>
                    </Button>
                  </div>
                </div>
                <TabsContent value="overview">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Girls Out of School</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-purple-600"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">130M+</div>
                        <p className="text-xs text-muted-foreground">
                          Globally, over 130 million girls are out of school
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scholarship Access</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-teal-600"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">23%</div>
                        <p className="text-xs text-muted-foreground">
                          Of eligible girls have access to scholarship opportunities
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Education ROI</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-purple-600"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">25%</div>
                        <p className="text-xs text-muted-foreground">
                          Increase in earnings per additional year of education
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Impact</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-teal-600"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">5,000+</div>
                        <p className="text-xs text-muted-foreground">
                          Girls connected to scholarships through our platform
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Education Access by Demographics</CardTitle>
                      <CardDescription>
                        Comparing education access and scholarship availability across different demographics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <EducationChart />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="trends">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education Trends Over Time</CardTitle>
                      <CardDescription>
                        Tracking changes in girls' education and scholarship access over the past decade
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                          <h3 className="text-lg font-medium mt-4">Trend data visualization</h3>
                          <p className="text-muted-foreground mt-1">
                            This would display a line chart showing education trends over time
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="impact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scholarship Impact Analysis</CardTitle>
                      <CardDescription>
                        Measuring the impact of scholarships on educational outcomes and career trajectories
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                          <h3 className="text-lg font-medium mt-4">Impact data visualization</h3>
                          <p className="text-muted-foreground mt-1">
                            This would display various charts showing the impact of scholarships
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reports">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Annual Education Report 2024</CardTitle>
                        <CardDescription>Comprehensive analysis of global education disparities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          This report provides a detailed analysis of the current state of girls' education globally,
                          highlighting key challenges and opportunities.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Report (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Scholarship Impact Study</CardTitle>
                        <CardDescription>Research on the long-term effects of educational funding</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          This study tracks the outcomes of scholarship recipients over a 10-year period, measuring
                          educational attainment, career progression, and economic impact.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Study (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Regional Education Disparities</CardTitle>
                        <CardDescription>Comparative analysis across different regions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          This report examines how education access and outcomes vary across different regions, with a
                          focus on identifying best practices and areas for improvement.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Report (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Mentorship Program Evaluation</CardTitle>
                        <CardDescription>Assessment of mentorship impact on educational outcomes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          This evaluation measures the effectiveness of mentorship programs in supporting girls'
                          educational journeys and career development.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Evaluation (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
