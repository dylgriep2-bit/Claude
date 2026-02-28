"use client";

import Link from "next/link";

const plans = [
  {
    name: "Monthly",
    price: "$14.99",
    period: "/month",
    savings: null,
    popular: false,
  },
  {
    name: "Yearly",
    price: "$9.99",
    period: "/month",
    savings: "Save 33%",
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    savings: "Best Value",
    popular: false,
  },
];

const premiumFeatures = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Exclusive Companions",
    description: "Unlock Luna, Alex, Marcus, and future premium companions",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Unlimited Messages",
    description: "No daily limits — talk as much as you want, anytime",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Priority Responses",
    description: "Faster, more thoughtful replies with deeper context memory",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Deeper Connections",
    description: "Companions remember your conversations and grow with you",
  },
];

export default function PremiumPage() {
  return (
    <div className="premium-page">
      <div className="premium-orb orb-1" />
      <div className="premium-orb orb-2" />

      <div className="premium-content">
        <Link href="/companions" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="premium-hero">
          <div className="premium-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1 className="premium-title">Go Premium</h1>
          <p className="premium-subtitle">
            Unlock the full experience — exclusive companions, unlimited
            conversations, and deeper connections.
          </p>
        </div>

        <div className="premium-features">
          {premiumFeatures.map((feature) => (
            <div key={feature.title} className="premium-feature-item">
              <div className="premium-feature-icon">{feature.icon}</div>
              <div>
                <h3 className="premium-feature-title">{feature.title}</h3>
                <p className="premium-feature-desc">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-cards">
          {plans.map((plan) => (
            <button
              key={plan.name}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.savings && (
                <span className="pricing-savings">{plan.savings}</span>
              )}
              <span className="pricing-name">{plan.name}</span>
              <span className="pricing-price">
                {plan.price}
                <span className="pricing-period">{plan.period}</span>
              </span>
            </button>
          ))}
        </div>

        <button className="premium-cta">
          Start Free Trial
          <span className="cta-subtext">7 days free, cancel anytime</span>
        </button>

        <p className="premium-disclaimer">
          Payment will be charged after the trial period ends. You can cancel
          at any time from your account settings.
        </p>
      </div>
    </div>
  );
}
