import Link from "next/link"
import { ArrowRight, GraduationCap, LineChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/app/header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activePage="about" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  About Empower Her
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our mission is to connect young girls with educational opportunities and mentorship to build a
                  brighter future.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground">
                  Empower Her was founded by Abusi Inuma Faithful, Ejimegbo Chinenye Joy and Obiene Tarinabo Divine, students of Word of Faith Group of Schools
                  and a proud member of DFC Inspire. The platform was created to address the critical issue of
                  educational inequality faced by young girls worldwide.
                </p>
                <p className="text-muted-foreground">
                  After witnessing firsthand how financial barriers prevent talented young women from pursuing higher
                  education, Obiene developed Empower Her as an AI-powered solution to bridge the gap between students
                  and available funding opportunities.
                </p>
              </div>
              <div className="flex justify-center mt-8 lg:mt-0">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Founder"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  The Problem We're Solving
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Millions of girls worldwide are unable to further their education after SSCE due to poverty and lack
                  of access to funding opportunities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 py-12">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
                <div className="rounded-full bg-purple-100 p-4">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">130M+ Girls Out of School</h3>
                <p className="text-center text-muted-foreground">
                  Over 130 million girls globally are out of school, missing the chance to build a brighter future.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
                <div className="rounded-full bg-teal-100 p-4">
                  <LineChart className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Limited Access to Funding</h3>
                <p className="text-center text-muted-foreground">
                  Only 23% of eligible girls have access to scholarship opportunities and financial aid.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
                <div className="rounded-full bg-purple-100 p-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Lack of Mentorship</h3>
                <p className="text-center text-muted-foreground">
                  Many girls lack access to role models and mentors who can guide their educational and career paths.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  We're making a difference in the lives of young women around the world.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 py-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <span className="text-lg font-bold text-purple-600">1</span>
                  </div>
                  <h3 className="text-xl font-bold">5,000+ Girls Connected to Scholarships</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Our platform has helped thousands of young women find and apply for scholarships that match their
                  profile and interests.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <span className="text-lg font-bold text-teal-600">2</span>
                  </div>
                  <h3 className="text-xl font-bold">300+ Mentorship Connections</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  We've facilitated hundreds of mentorship relationships between students and professional women in
                  various fields.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="text-xl font-bold">$2.5M in Scholarship Funding</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Our users have collectively received millions in scholarship funding to pursue their educational
                  dreams.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <span className="text-lg font-bold text-teal-600">4</span>
                  </div>
                  <h3 className="text-xl font-bold">15 Countries Reached</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  We're expanding our reach across Africa and beyond, helping girls in diverse communities access
                  educational opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Mission</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Be part of the movement to empower the next generation of female leaders.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Create an Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/mentorship">
                  <Button size="lg" variant="outline">
                    Become a Mentor
                  </Button>
                </Link>
              </div>
            </div>
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
