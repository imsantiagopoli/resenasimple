import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Clock,
  Share2,
  Bookmark,
  FileText,
  Zap,
  Shield,
  Building2,
  ArrowRight
} from 'lucide-react';

const BlogArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock blog data (in a real app, this would come from an API)
  const blogPosts = [
    {
      id: 1,
      title: 'TACS Raises $15M Series A to Revolutionize Document Management',
      excerpt: 'We\'re excited to announce our Series A funding round, led by top-tier VCs, to accelerate our AI-powered document management platform.',
      category: 'company',
      author: 'John Smith',
      publishDate: '2024-01-20',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2',
      content: `
        <p>We're thrilled to announce that TACS has successfully raised $15 million in Series A funding, led by Andreessen Horowitz with participation from Sequoia Capital and other top-tier venture capital firms. This significant investment will accelerate our mission to revolutionize how businesses manage, process, and secure their critical documents.</p>

        <h2>The Future of Document Management</h2>
        <p>At TACS, we've always believed that document management should be intelligent, secure, and effortless. Our AI-powered platform has already helped over 1,200 companies streamline their document workflows, reduce compliance risks, and save thousands of hours on manual processing.</p>

        <p>This funding round validates our vision and positions us to expand our capabilities in several key areas:</p>

        <ul>
          <li><strong>Advanced AI Processing:</strong> Enhancing our machine learning models for even more accurate document classification and data extraction</li>
          <li><strong>Enterprise Security:</strong> Developing cutting-edge security features to meet the most stringent compliance requirements</li>
          <li><strong>Global Expansion:</strong> Scaling our platform to serve businesses worldwide</li>
          <li><strong>Team Growth:</strong> Hiring world-class talent across engineering, product, and customer success</li>
        </ul>

        <h2>What This Means for Our Customers</h2>
        <p>Our existing customers can expect:</p>
        <ul>
          <li>Faster processing speeds with our enhanced AI engine</li>
          <li>New compliance frameworks and regulatory support</li>
          <li>Expanded integration capabilities with popular business tools</li>
          <li>24/7 premium support for enterprise customers</li>
        </ul>

        <h2>Looking Ahead</h2>
        <p>With this funding, we're not just growing our company – we're building the future of business document management. Our roadmap includes groundbreaking features like automated compliance reporting, intelligent document workflows, and predictive analytics.</p>

        <p>We want to thank our investors for believing in our vision, our customers for their continued trust, and our team for their incredible dedication. This is just the beginning of our journey to transform how businesses handle their most important documents.</p>

        <p>Stay tuned for exciting product announcements and updates as we continue to innovate and expand our platform capabilities.</p>
      `
    },
    {
      id: 2,
      title: 'New AI Features: Automated Document Classification',
      excerpt: 'Discover how our latest AI improvements can automatically categorize your documents with 99.5% accuracy.',
      category: 'product',
      author: 'Sarah Johnson',
      publishDate: '2024-01-18',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2',
      content: `
        <p>We're excited to introduce our most advanced AI-powered document classification system yet. With our latest machine learning improvements, TACS can now automatically categorize your documents with an industry-leading 99.5% accuracy rate.</p>

        <h2>What's New in Document Classification</h2>
        <p>Our enhanced AI engine brings several breakthrough capabilities:</p>

        <ul>
          <li><strong>Multi-format Support:</strong> Classify PDFs, Word documents, Excel files, images, and more</li>
          <li><strong>Smart Content Analysis:</strong> Understand document context, not just keywords</li>
          <li><strong>Custom Categories:</strong> Train the AI on your specific document types</li>
          <li><strong>Real-time Processing:</strong> Get instant results as documents are uploaded</li>
        </ul>

        <h2>How It Works</h2>
        <p>Our AI system uses advanced natural language processing and computer vision to analyze documents across multiple dimensions:</p>

        <ol>
          <li><strong>Content Analysis:</strong> The AI reads and understands the text content</li>
          <li><strong>Structure Recognition:</strong> Identifies document layouts and formats</li>
          <li><strong>Context Understanding:</strong> Considers business context and relationships</li>
          <li><strong>Confidence Scoring:</strong> Provides accuracy ratings for each classification</li>
        </ol>

        <h2>Real-World Benefits</h2>
        <p>Our customers are already seeing tremendous value:</p>

        <blockquote>
          "TACS has reduced our document processing time by 90%. What used to take hours now happens automatically in seconds." - Maria Rodriguez, CFO at TechCorp
        </blockquote>

        <h2>Getting Started</h2>
        <p>The new classification features are available to all TACS customers immediately. Simply upload your documents, and our AI will handle the rest. For custom categories, reach out to our support team for personalized training.</p>
      `
    }
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || ''));
  
  if (!post) {
    return (
      <div>
        <AnnouncementBanner />
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-purple-600 hover:text-purple-700">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return Zap;
      case 'compliance': return Shield;
      case 'tax': return FileText;
      case 'security': return Shield;
      case 'company': return Building2;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return '#6e54dc';
      case 'compliance': return '#10b981';
      case 'tax': return '#f59e0b';
      case 'security': return '#ef4444';
      case 'company': return '#8b5cf6';
      default: return '#6e54dc';
    }
  };

  const CategoryIcon = getCategoryIcon(post.category);

  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div>
      <AnnouncementBanner />
      <Navbar />
      
      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/blog"
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
              style={{ color: '#6e54dc' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5a45b8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6e54dc'}
            >
              <ArrowLeft size={16} />
              <span>Back to Blog</span>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex items-center space-x-4 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: getCategoryColor(post.category) + '20' }}
              >
                <CategoryIcon size={20} style={{ color: getCategoryColor(post.category) }} />
              </div>
              <div>
                <span 
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: getCategoryColor(post.category) }}
                >
                  {post.category.replace('-', ' ')}
                </span>
                <div className="flex items-center space-x-4 text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ color: '#161616' }}>
              {post.title}
            </h1>

            {/* Article Actions */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: 'rgb(229, 231, 235)' }}>
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'rgb(209, 213, 219)',
                    color: '#161616'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Bookmark size={16} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none blog-content"
              style={{ color: '#161616' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgb(229, 231, 235)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#6e54dc' }}
                  >
                    <User size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#161616' }}>
                      {post.author}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                      Published on {new Date(post.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="p-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg border transition-colors duration-200"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'rgb(209, 213, 219)',
                      color: '#161616'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8" style={{ color: '#161616' }}>
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const RelatedCategoryIcon = getCategoryIcon(relatedPost.category);
                  return (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="group block bg-white rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{ borderColor: 'rgb(229, 231, 235)' }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getCategoryColor(relatedPost.category) + '20' }}
                          >
                            <RelatedCategoryIcon size={14} style={{ color: getCategoryColor(relatedPost.category) }} />
                          </div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: getCategoryColor(relatedPost.category) }}
                          >
                            {relatedPost.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#161616' }}>
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgb(107, 114, 128)' }}>
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          <div className="flex items-center space-x-1">
                            <User size={12} />
                            <span>{relatedPost.author}</span>
                          </div>
                          <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                            <span>Read more</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogArticlePage;