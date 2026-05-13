import React from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, FileText, Target, GraduationCap, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../assets/ImageWithFallback';

const services = [
  {
    icon: BookOpen,
    title: 'Research Writing',
    description: 'Expert assistance with academic research papers and literature reviews',
  },
  {
    icon: FileText,
    title: 'Assignment Help',
    description: 'Get guidance on completing your assignments with quality and accuracy',
  },
  {
    icon: Target,
    title: 'Project Guidance',
    description: 'Professional mentorship for your academic projects from start to finish',
  },
  {
    icon: GraduationCap,
    title: 'Exam Preparation',
    description: 'Structured preparation plans to help you excel in your exams',
  },
];

const modules = [
  'Research Writing',
  'Assignment Help',
  'Project Guidance',
  'Exam Preparation',
  'Proofreading',
  'Data Analysis',
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Economics Student',
    text: 'The tutors helped me understand complex economic theories. My grades improved significantly!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Michael Chen',
    role: 'Finance Major',
    text: 'Professional, responsive, and knowledgeable. They really care about student success.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Emily Davis',
    role: 'Supply Chain Student',
    text: 'Thanks to their guidance, I completed my project ahead of schedule with excellent feedback!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AcademicHub
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="border-cyan-300 hover:bg-cyan-50">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-slate-900">
              Struggling with <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Research, Assignments</span> or Projects?
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Connect with expert tutors who understand your academic challenges and provide personalized guidance to help you succeed.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-cyan-300 hover:bg-cyan-50">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1595315342809-fa10945ed07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGlicmFyeSUyMGFjYWRlbWljfGVufDF8fHx8MTc3Njc5MzE1NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Students studying"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-slate-900">500+ Students</p>
                  <p className="text-sm text-slate-600">Successfully Helped</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Our Services</h2>
          <p className="text-lg text-slate-600">Comprehensive academic support tailored to your needs</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border-cyan-200 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section className="bg-white/60 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Modules We Offer</h2>
            <p className="text-lg text-slate-600">Expert guidance across multiple academic disciplines</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-md"
              >
                <p className="font-semibold">{module}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">What Students Say</h2>
          <p className="text-lg text-slate-600">Real experiences from students we've helped</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-cyan-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-slate-900">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Excel in Your Studies?</h2>
          <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have improved their academic performance with our expert tutors.
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-cyan-600 hover:bg-cyan-50">
            <Link to="/register">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Get in Touch</h2>
          <p className="text-lg text-slate-600">Have questions? We're here to help</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-cyan-200 bg-white/80 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-900">Email</CardTitle>
              <CardDescription>support@academichub.com</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-cyan-200 bg-white/80 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-900">Phone</CardTitle>
              <CardDescription>+1 (555) 123-4567</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-cyan-200 bg-white/80 backdrop-blur-sm text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-900">Location</CardTitle>
              <CardDescription>Remote - Available Worldwide</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">AcademicHub</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted partner in academic excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Research Writing</li>
                <li>Assignment Help</li>
                <li>Project Guidance</li>
                <li>Exam Preparation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/login" className="hover:text-cyan-400">Login</Link></li>
                <li><Link to="/register" className="hover:text-cyan-400">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@academichub.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 AcademicHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};