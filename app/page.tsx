import Link from "next/link"
import { ArrowRight, Award, BookOpen, LineChart, Users, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/app/header"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activePage="home" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Empower Her
                </h1>
                <p className="text-purple-600 font-semibold text-lg">AI-powered scholarship linkage platform</p>
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
                  src="https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Empowered students"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses AI to match students with the perfect scholarships and mentors
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
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
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Empower Her Today</h2>
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
          </div>
        </section>

          {/* Testimonials */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center sm:text-4xl mb-12">What People Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Aisha, Student",
                  quote: "Empower Her changed my life. I found a full scholarship and a mentor who guided me through my career path.",
                },
                {
                  name: "Ngozi, Mentor",
                  quote: "Being part of Empower Her has been rewarding. I’ve connected with so many talented young women.",
                },
                {
                  name: "Chinwe, Parent",
                  quote: "I was worried about how we would afford university, but Empower Her gave us hope and real solutions.",
                },
              ].map((testimonial, idx) => (
                <Card key={idx} className="h-full shadow-md">
                  <CardHeader className="pb-4">
                    <Quote className="w-6 h-6 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-100 to-teal-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center sm:text-4xl mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Is Empower Her free to use?",
                  answer: "Yes, our platform is completely free for students. We’re here to help you succeed without financial barriers.",
                },
                {
                  question: "How do I qualify for a scholarship?",
                  answer: "Our AI reviews your background, interests, and goals to match you with scholarships you're eligible for.",
                },
                {
                  question: "Can I become a mentor?",
                  answer: "Absolutely! We welcome female professionals from all backgrounds who want to guide and inspire the next generation.",
                },
                {
                  question: "What age group is Empower Her for?",
                  answer: "We support girls and young women from secondary school to university level.",
                },
              ].map((faq, idx) => (
                <div key={idx}>
                  <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 bg-purple-600 text-white text-center">
          <div className="container px-4 md:px-6 space-y-4">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Make a Difference?</h2>
            <p className="text-lg max-w-xl mx-auto">Whether you're a student or a mentor, your journey starts here. Let's build a brighter future together.</p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
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

