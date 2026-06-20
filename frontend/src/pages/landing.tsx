/**
 * Professional Landing Page with Feature Showcase
 * Market-ready presentation for law firms
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

const features: Feature[] = [
  {
    icon: '🔍',
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze legal documents in seconds',
    details: [
      'Extract key clauses automatically',
      'Identify legal obligations',
      'Detect critical deadlines',
      'Analyze payment terms',
    ],
  },
  {
    icon: '⚠️',
    title: 'Risk Detection',
    description: 'Intelligent risk identification with scoring from 0-100',
    details: [
      'High-risk clause identification',
      'Unlimited liability detection',
      'Data privacy concerns',
      'Compliance violations',
    ],
  },
  {
    icon: '✓',
    title: 'Compliance Verification',
    description: 'Ensure documents meet regulatory requirements',
    details: [
      'GDPR compliance checking',
      'HIPAA validation',
      'CCPA verification',
      'SOX compliance',
    ],
  },
  {
    icon: '📚',
    title: 'Legal Research',
    description: 'Search relevant case law and legal precedents',
    details: [
      'Access legal knowledge base',
      'Find similar cases',
      'Retrieve citations',
      'Analyze precedents',
    ],
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Work together seamlessly on document analysis',
    details: [
      'Share documents securely',
      'Collaborative annotations',
      'Real-time updates',
      'Team workspaces',
    ],
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Comprehensive insights and reporting dashboard',
    details: [
      'Risk trend analysis',
      'Compliance metrics',
      'Team performance tracking',
      'Custom report generation',
    ],
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Senior Partner, Johnson & Associates',
    company: 'Legal Firm',
    text: 'Legal Assistant has reduced our document review time by 70%. Our team can now focus on strategic work instead of tedious analysis.',
    avatar: '👩‍⚖️',
  },
  {
    name: 'Michael Chen',
    role: 'General Counsel, TechCorp',
    company: 'Technology Company',
    text: 'The risk detection is incredibly accurate. We\'ve caught compliance issues we would have missed with manual review.',
    avatar: '👨‍💼',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Contract Manager, GlobalTrade Inc',
    company: 'International Business',
    text: 'The real-time collaboration features have transformed how our team works on contracts. It\'s a game-changer.',
    avatar: '👩‍💼',
  },
];

const PricingPlan = ({ name, price, features, highlighted = false }: any) => (
  <div
    className={`rounded-lg p-8 ${
      highlighted
        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl transform scale-105'
        : 'bg-white border-2 border-gray-200 text-gray-900'
    }`}
  >
    <h3 className="text-2xl font-bold">{name}</h3>
    <p className="text-4xl font-bold my-4">
      ${price}
      <span className="text-lg font-normal">/month</span>
    </p>
    <ul className="space-y-3 mb-8">
      {features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-center">
          <span className="mr-3">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
        highlighted
          ? 'bg-white text-blue-600 hover:bg-gray-100'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      Get Started
    </button>
  </div>
);

export const LandingPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-xl font-bold text-gray-900">Legal Assistant</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">
              Testimonials
            </a>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Legal Document Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Analyze contracts, detect risks, verify compliance, and conduct legal research in seconds.
            Trusted by law firms and corporate legal departments worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg transform hover:scale-105 transition"
            >
              Start Free Trial
            </Link>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50">
              Watch Demo
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            No credit card required • Free for 14 days • Full access to all features
          </p>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-2xl h-96 flex items-center justify-center">
            <div className="text-6xl">📊</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Powerful Features for Modern Law Firms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedFeature(index)}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Selected Feature Details */}
          <div className="bg-blue-50 rounded-lg p-12">
            <div className="max-w-2xl">
              <div className="text-4xl mb-4">{features[selectedFeature].icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {features[selectedFeature].title}
              </h3>
              <p className="text-gray-700 mb-6">{features[selectedFeature].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features[selectedFeature].details.map((detail, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Loved by Legal Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex mt-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingPlan
              name="Starter"
              price="99"
              features={[
                'Up to 50 documents/month',
                'Basic analysis',
                'Email support',
                '1 user',
              ]}
            />
            <PricingPlan
              name="Professional"
              price="299"
              features={[
                'Unlimited documents',
                'Full AI analysis',
                'Priority support',
                'Up to 5 users',
                'Team collaboration',
                'Advanced reports',
              ]}
              highlighted={true}
            />
            <PricingPlan
              name="Enterprise"
              price="Custom"
              features={[
                'Unlimited everything',
                'Custom integrations',
                'Dedicated support',
                'Unlimited users',
                'Advanced security',
                'SLA guarantee',
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Legal Document Review?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of law firms already using Legal Assistant to save time and catch risks.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg transform hover:scale-105 transition"
          >
            Start Your Free 14-Day Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p>&copy; 2024 Legal Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
