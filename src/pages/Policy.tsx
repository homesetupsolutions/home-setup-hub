import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Policy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy & Terms | Home Setup Solutions Vancouver</title>
        <meta
          name="description"
          content="Read our privacy policy, terms of service, SMS policy, and cancellation policy for Home Setup Solutions Vancouver. 30-day workmanship warranty on all installations."
        />
        <meta name="keywords" content="Home Setup Solutions policy, cancellation policy Vancouver, privacy policy home services, terms of service handyman Vancouver, SMS policy, warranty home installation" />
        <link rel="canonical" href="https://homesetupsolutions.ca/policy" />
      </Helmet>
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8">
                Our <span className="text-gradient-orange">Policies</span>
              </h1>

              {/* Privacy Policy */}
              <section className="mb-12" id="privacy">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Privacy Policy</h2>
                <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Last Updated:</strong> December 2024
                  </p>
                  <p>
                    Home Setup Solutions ("we," "our," or "us") is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, and safeguard your information when 
                    you use our services.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Information We Collect</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contact information (name, email, phone number, address)</li>
                    <li>Service appointment details and preferences</li>
                    <li>Payment information (processed securely through Square)</li>
                    <li>Communication records for customer service purposes</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground mt-6">How We Use Your Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and improve our services</li>
                    <li>To communicate with you about appointments and services</li>
                    <li>To send appointment reminders via SMS (with your consent)</li>
                    <li>To process payments and prevent fraud</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Data Protection</h3>
                  <p>
                    We implement appropriate security measures to protect your personal information. 
                    We do not sell or rent your personal information to third parties.
                  </p>
                </div>
              </section>

              {/* Terms of Service */}
              <section className="mb-12" id="terms">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Terms of Service</h2>
                <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                  <p>
                    By using Home Setup Solutions' services, you agree to these terms. Please read them carefully.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Service Agreement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Services are provided as described at the time of booking</li>
                    <li>Pricing is confirmed before service begins</li>
                    <li>Additional work beyond the original scope may incur extra charges</li>
                    <li>We reserve the right to refuse service at our discretion</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Liability</h3>
                  <p>
                    While we take every precaution to ensure quality service, we are not liable for 
                    pre-existing damage or issues with customer-provided equipment. Our liability is 
                    limited to the cost of the service provided.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Warranty</h3>
                  <p>
                    We offer a 30-day workmanship warranty on all installations. This covers any issues 
                    directly related to our installation work.
                  </p>
                </div>
              </section>

              {/* SMS Policy */}
              <section className="mb-12" id="sms">
                <h2 className="text-2xl font-semibold mb-4 text-primary">SMS/Text Message Policy</h2>
                <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Important Information About Text Messages from Home Setup Solutions</strong>
                  </p>
                  <p>
                    In accordance with the Canadian Anti-Spam Legislation (CASL) and the Canadian 
                    Radio-television and Telecommunications Commission (CRTC) requirements, we provide 
                    the following information about our SMS messaging practices.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Consent</h3>
                  <p>
                    By providing your phone number and booking an appointment, you consent to receive 
                    text messages from Home Setup Solutions regarding your appointment, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Appointment confirmation</li>
                    <li>Day-of appointment reminder (morning)</li>
                    <li>One-hour reminder before your appointment</li>
                    <li>Technician arrival notifications</li>
                    <li>Rescheduling links if needed</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Message Frequency</h3>
                  <p>
                    You will typically receive 2-4 messages per appointment. Message frequency varies 
                    based on your service appointments.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Message and Data Rates</h3>
                  <p className="bg-card border border-border rounded-lg p-4">
                    <strong className="text-foreground">Standard message and data rates may apply.</strong> 
                    Message rates depend on your mobile carrier and plan. Contact your carrier for details 
                    about your text messaging plan.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Opt-Out Instructions</h3>
                  <p>
                    You may opt out of receiving text messages at any time by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Replying STOP to any of our text messages</li>
                    <li>Calling us at 833-230-2933</li>
                    <li>Emailing admin@homesetupsolutions.ca</li>
                  </ul>
                  <p>
                    After opting out, you will receive a confirmation message. You may still receive 
                    one-time messages if you contact us or book a new appointment.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Contact Information</h3>
                  <p>
                    For questions about our SMS policy or to update your preferences, contact:
                  </p>
                  <ul className="list-none pl-0 space-y-1">
                    <li><strong className="text-foreground">Phone:</strong> 833-230-2933 (Toll Free)</li>
                    <li><strong className="text-foreground">Text:</strong> 1-778-989-4357</li>
                    <li><strong className="text-foreground">Email:</strong> admin@homesetupsolutions.ca</li>
                  </ul>
                  <p className="text-sm mt-4 border-t border-border pt-4">
                    Home Setup Solutions is identified in all messages. We comply with CASL requirements 
                    for commercial electronic messages and CRTC regulations for telecommunications in Canada.
                  </p>
                </div>
              </section>

              {/* Cancellation Policy */}
              <section className="mb-12" id="cancellation">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Cancellation & Rescheduling Policy</h2>
                <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
                    <p className="text-foreground font-medium mb-2">
                      We ask that you please reschedule or cancel at least 1 day before the beginning of your appointment or you may be charged a cancellation fee of CA$40.00.
                    </p>
                    <p className="text-foreground">
                      Cancellation must be done within 24 hours before the appointment, if not a fee will be charged.
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Cancellation</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">24+ hours before appointment:</strong> Free cancellation or reschedule
                    </li>
                    <li>
                      <strong className="text-foreground">Less than 24 hours:</strong> CA$40.00 cancellation fee applies
                    </li>
                    <li>
                      <strong className="text-foreground">No-show:</strong> Full service charge may apply
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Rescheduling</h3>
                  <p>
                    You can reschedule your appointment at no charge up to 24 hours before your scheduled time. 
                    Use the rescheduling link in your appointment reminder text or call us directly.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Emergency Cancellations</h3>
                  <p>
                    We understand emergencies happen. Please contact us as soon as possible, and we'll do 
                    our best to accommodate your situation.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Questions About Our Policies?</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about our policies, please don't hesitate to contact us.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:8332302933"
                    className="text-primary hover:underline font-medium"
                  >
                    Call: 833-230-2933
                  </a>
                  <span className="text-muted-foreground">|</span>
                  <a
                    href="mailto:admin@homesetupsolutions.ca"
                    className="text-primary hover:underline font-medium"
                  >
                    Email: admin@homesetupsolutions.ca
                  </a>
                </div>
              </section>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Policy;