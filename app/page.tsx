import Link from "next/link"
import { ArrowRight, Award, BookOpen, LineChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/app/header"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activePage="home" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/30 dark:to-teal-950/30">
          <div className="container px-4 md:px-6">
            <ScrollAnimationWrapper>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Empower Her
                  </h1>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg">
                    AI-powered scholarship linkage platform
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connecting young girls with scholarship opportunities, financial aid programs, and mentorship to
                    ensure that financial constraints do not limit their education and career growth.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center mt-8 lg:mt-0">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Empowered students"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover max-w-full h-auto"
                  />
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <ScrollAnimationWrapper direction="up">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our platform uses AI to match students with the perfect scholarships and mentors
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              <ScrollAnimationWrapper delay={0.1} direction="up">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Matching</CardTitle>
                    <Award className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Scholarships</div>
                    <p className="text-xs text-muted-foreground">
                      Our AI analyzes your profile to find the most suitable scholarships
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper delay={0.2} direction="up">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Real-Time Updates</CardTitle>
                    <BookOpen className="h-4 w-4 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Opportunities</div>
                    <p className="text-xs text-muted-foreground">
                      Get notified about new grants, bursaries, and sponsorships
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper delay={0.3} direction="up">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mentorship</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Guidance</div>
                    <p className="text-xs text-muted-foreground">
                      Connect with inspiring female professionals for career advice
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
              <ScrollAnimationWrapper delay={0.4} direction="up">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Data Insights</CardTitle>
                    <LineChart className="h-4 w-4 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Analytics</div>
                    <p className="text-xs text-muted-foreground">Track education disparities and impact in real-time</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/30 dark:to-teal-950/30">
          <div className="container px-4 md:px-6">
            <ScrollAnimationWrapper direction="up">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Join Empower Her Today
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Take the first step towards unlocking your educational potential
                  </p>
                </div>
                <Link href="/register">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Create Your Profile
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Empower Her. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
