import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart3, CheckCircle, Star, Zap, Shield } from 'lucide-react';
import './styles/LandingPage.css';

const LandingPage = () => {
  const features = [
    { icon: BookOpen, title: 'Academic Excellence', desc: 'Comprehensive curriculum for grades 1-10 with performance tracking' },
    { icon: Users, title: 'Easy Communication', desc: 'Direct parent-teacher communication with real-time notifications' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Detailed progress reports with visual insights and trends' },
    { icon: Shield, title: 'Secure System', desc: 'Enterprise-grade security with encrypted data and access control' }
  ];

  const testimonials = [
    { name: 'Principal Aisha Khan', school: 'Delhi Public School', text: 'Transformed how we manage student data and parent communication.' },
    { name: 'Teacher James Wilson', school: 'Sunrise Academy', text: 'The grade management system is incredibly intuitive and efficient.' },
    { name: 'Parent Sarah Ahmed', school: 'Elite International', text: 'Finally can track my child\'s progress easily and communicate with teachers.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">📚</div>
            <span>Edustrem</span>
          </div>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#testimonials">Testimonials</a>
            <Link to="/auth/login" className="nav-login">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="hero-content">
          <motion.div className="live-badge" variants={itemVariants} initial="hidden" animate="visible">
            <div className="pulse-dot"></div>
            <span>Live Demo Available</span>
          </motion.div>
          <motion.h1 className="hero-title" variants={itemVariants} initial="hidden" animate="visible">
            Edustrem: Premium School Management
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants} initial="hidden" animate="visible">
            Experience our fully functional dashboard with real-time data, analytics, and interactive features. Ready to use right now!
          </motion.p>
          <motion.div className="hero-cta" variants={itemVariants} initial="hidden" animate="visible">
            <Link to="/dashboard" className="cta-button primary large">
              🚀 Try Live Dashboard <ArrowRight size={20} />
            </Link>
            <a href="#features" className="cta-button secondary">
              See Features
            </a>
          </motion.div>
          <motion.div className="demo-info" variants={itemVariants} initial="hidden" animate="visible">
            <div className="demo-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Teachers</span>
              </div>
              <div className="stat">
                <span className="stat-number">10</span>
                <span className="stat-label">Classes</span>
              </div>
            </div>
            <p className="demo-note">✨ Real data • Live updates • Interactive charts • Working features • Auto-login enabled</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" className="features">
        <div className="section-container">
          <motion.h2 className="section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            Why Choose Edustrem?
          </motion.h2>
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section id="benefits" className="benefits">
        <div className="section-container">
          <div className="benefits-grid">
            {/* Feature 1 */}
            <motion.div className="benefit-item" whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} viewport={{ once: true }}>
              <div className="benefit-icon">
                <Zap size={40} />
              </div>
              <h3>Real-Time Updates</h3>
              <p>Instant notifications for attendance, grades, and important announcements</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div className="benefit-item" whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 50 }} viewport={{ once: true }}>
              <div className="benefit-icon">
                <BarChart3 size={40} />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Detailed performance metrics, attendance trends, and progress reports</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div className="benefit-item" whileInView={{ opacity: 1, x: -50 }} initial={{ opacity: 0, x: -50 }} viewport={{ once: true }}>
              <div className="benefit-icon">
                <Users size={40} />
              </div>
              <h3>Parent Portal</h3>
              <p>Parents access grades, attendance, and communicate directly with teachers</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div className="benefit-item" whileInView={{ opacity: 1, x: 50 }} initial={{ opacity: 0, x: 50 }} viewport={{ once: true }}>
              <div className="benefit-icon">
                <Shield size={40} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption, role-based access, and data backup systems</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section id="testimonials" className="testimonials">
        <div className="section-container">
          <motion.h2 className="section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            Trusted by Schools Worldwide
          </motion.h2>
          <motion.div
            className="testimonials-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} className="testimonial-card" variants={itemVariants} whileHover={{ y: -5 }}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-school">{testimonial.school}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section className="pricing">
        <div className="section-container">
          <motion.h2 className="section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            Simple, Transparent Pricing
          </motion.h2>
          <motion.div
            className="pricing-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Basic Plan */}
            <motion.div className="pricing-card" variants={itemVariants} whileHover={{ y: -10 }}>
              <h3>Starter</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">9,999</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><CheckCircle size={16} /> Up to 500 students</li>
                <li><CheckCircle size={16} /> Basic attendance tracking</li>
                <li><CheckCircle size={16} /> Grade management</li>
                <li><CheckCircle size={16} /> Email notifications</li>
              </ul>
              <button className="pricing-btn">Get Started</button>
            </motion.div>

            {/* Professional Plan */}
            <motion.div className="pricing-card featured" variants={itemVariants} whileHover={{ y: -10 }}>
              <div className="badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">24,999</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><CheckCircle size={16} /> Up to 2000 students</li>
                <li><CheckCircle size={16} /> Advanced analytics</li>
                <li><CheckCircle size={16} /> Parent portal</li>
                <li><CheckCircle size={16} /> SMS & email</li>
                <li><CheckCircle size={16} /> Priority support</li>
              </ul>
              <button className="pricing-btn primary">Start Free Trial</button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div className="pricing-card" variants={itemVariants} whileHover={{ y: -10 }}>
              <h3>Enterprise</h3>
              <div className="price">
                <span className="custom">Custom</span>
              </div>
              <ul className="features-list">
                <li><CheckCircle size={16} /> Unlimited students</li>
                <li><CheckCircle size={16} /> Custom integrations</li>
                <li><CheckCircle size={16} /> Dedicated support</li>
                <li><CheckCircle size={16} /> On-premise option</li>
                <li><CheckCircle size={16} /> SLA guarantee</li>
              </ul>
              <button className="pricing-btn">Contact Sales</button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="cta-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          Ready to Transform Your School?
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Join hundreds of schools already using Edustrem to streamline their management
        </motion.p>
        <motion.div
          className="cta-button primary large"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Open Dashboard
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>Edustrem</h4>
            <p>Transforming school management with technology</p>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#">Security</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Edustrem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
