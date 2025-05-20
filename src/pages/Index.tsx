
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportCard from '@/components/SupportCard';
import ChatWidget from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  PackageCheck, 
  RefreshCw,
  ArrowRight,
  Search,
  MessageSquare
} from 'lucide-react';

const Index = () => {
  const supportCategories = [
    {
      title: "Ask about a product",
      description: "Have questions about size, material, or fit? We're here to help.",
      icon: <Search className="h-6 w-6 text-burgundy" />
    },
    {
      title: "Track your order",
      description: "Check the status and location of your SNITCH order.",
      icon: <Package className="h-6 w-6 text-burgundy" />
    },
    {
      title: "Request a refund",
      description: "Not satisfied? We'll help you process a hassle-free refund.",
      icon: <RefreshCw className="h-6 w-6 text-burgundy" />
    },
    {
      title: "Start an exchange",
      description: "Need a different size or color? Initiate an exchange here.",
      icon: <MessageSquare className="h-6 w-6 text-burgundy" />
    },
    {
      title: "Check refund/exchange status",
      description: "Track the progress of your refund or exchange request.",
      icon: <PackageCheck className="h-6 w-6 text-burgundy" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-white to-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-navy mb-6">
              Need help with your order?
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
              SNITCH Support is here!
            </h2>
            <div className="max-w-xl mx-auto">
              <p className="text-gray-600 mb-8">
                We're committed to providing exceptional customer service. 
                Browse our support topics or chat with our AI assistant to get immediate help.
              </p>
            </div>
            <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
              Contact Support <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
        
        {/* Support Categories Section */}
        <section className="py-16 bg-offwhite">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              How can we help you today?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportCategories.map((category, index) => (
                <SupportCard
                  key={index}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  className="cursor-pointer hover:border-burgundy"
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Preview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-gray-600 mb-8">
                Find quick answers to our most common questions. Can't find what you're looking for?
                Our support team is just a click away.
              </p>
              <div className="space-y-4 text-left mb-8">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">How do I return an item?</h3>
                  <p className="text-gray-600">
                    You can initiate a return through your account within 30 days of receiving your order. 
                    We'll provide a return shipping label for your convenience.
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">What is your shipping policy?</h3>
                  <p className="text-gray-600">
                    We offer free standard shipping on orders over $50. Expedited shipping options are 
                    available at checkout. Most orders ship within 1-2 business days.
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">How do I track my order?</h3>
                  <p className="text-gray-600">
                    You can track your order by clicking the "Track Order" link in the navigation and 
                    entering your order number and email address.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                View All FAQs
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
