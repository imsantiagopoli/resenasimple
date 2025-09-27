import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Building2,
  Clock
} from 'lucide-react';

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Posts', count: 12 },
    { id: 'product', label: 'Product Updates', count: 4 },
    { id: 'compliance', label: 'Compliance', count: 3 },
    { id: 'tax', label: 'Tax & Finance', count: 2 },
    { id: 'security', label: 'Security', count: 2 },
    { id: 'company', label: 'Company News', count: 1 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'TACS Raises $15M Series A to Revolutionize Document Management',
      excerpt: 'We\'re excited to announce our Series A funding round, led by top-tier VCs, to accelerate our AI-powered document management platform.',
      category: 'company',
      author: 'John Smith',
      publishDate: '2024-01-20',
      readTime: '5 min read',
      featured: true,
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    },
    {
      id: 2,
      title: 'New AI Features: Automated Document Classification',
      excerpt: 'Discover how our latest AI improvements can automatically categorize your documents with 99.5% accuracy, saving hours of manual work.',
      category: 'product',
      author: 'Sarah Johnson',
      publishDate: '2024-01-18',
      readTime: '8 min read',
      featured: false,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    },
    {
      id: 3,
      title: 'SOX Compliance Made Easy: A Complete Guide',
      excerpt: 'Navigate SOX compliance requirements with confidence. Learn best practices and how TACS simplifies regulatory adherence.',
      category: 'compliance',
      author: 'Michael Chen',
      publishDate: '2024-01-15',
      readTime: '12 min read',
      featured: true,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    },
    {
      id: 4,
      title: 'Enterprise Security: Zero-Trust Architecture',
      excerpt: 'How TACS implements zero-trust security principles to protect your most sensitive business documents and data.',
      category: 'security',
      author: 'Lisa Rodriguez',
      publishDate: '2024-01-12',
      readTime: '6 min read',
      featured: false,
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    },
    {
      id: 5,
      title: '2024 Tax Season: Digital Document Preparation',
      excerpt: 'Streamline your tax preparation process with digital document management. Tips and best practices for tax professionals.',
      category: 'tax',
      author: 'David Wilson',
      publishDate: '2024-01-10',
      readTime: '10 min read',
      featured: false,
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    },
    {
      id: 6,
      title: 'API v2.0 Release: Enhanced Integration Capabilities',
      excerpt: 'Our new API version brings powerful integration features, webhooks, and improved performance for enterprise customers.',
      category: 'product',
      author: 'Alex Thompson',
      publishDate: '2024-01-08',
      readTime: '7 min read',
      featured: false,
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
    }
  ];

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

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div>
      <AnnouncementBanner />
      <Navbar />
      
      {/* Blog Header */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ color: '#161616' }}>
              TACS
              <span className="block" style={{ color: '#6e54dc' }}>
                Blog
              </span>
            </h1>
            <p 
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
              style={{ color: 'rgb(107, 114, 128)' }}
            >
              Insights, updates, and best practices for document management, compliance, 
              and business automation from the TACS team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'rgb(107, 114, 128)' }}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm"
                style={{
                  borderColor: 'rgb(209, 213, 219)',
                  color: '#161616',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories and Content */}
      <section className="pt-8 pb-16 lg:pb-24" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center pt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#6e54dc' : 'white',
                  borderColor: selectedCategory === category.id ? '#6e54dc' : 'rgb(209, 213, 219)',
                  color: selectedCategory === category.id ? 'white' : '#161616'
                }}
              >
                <span>{category.label}</span>
                <span 
                  className={`px-1.5 py-0.5 rounded text-xs ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}
                  style={{
                    color: selectedCategory === category.id ? 'white' : 'rgb(107, 114, 128)'
                  }}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => {
                  const CategoryIcon = getCategoryIcon(post.category);
                  return (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group block bg-white rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{ borderColor: 'rgb(229, 231, 235)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                      }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getCategoryColor(post.category) + '20' }}
                          >
                            <CategoryIcon size={16} style={{ color: getCategoryColor(post.category) }} />
                          </div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: getCategoryColor(post.category) }}
                          >
                            {post.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: '#161616' }}>
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'rgb(107, 114, 128)' }}>
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User size={12} />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} />
                              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#161616' }}>
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => {
                  const CategoryIcon = getCategoryIcon(post.category);
                  return (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group block bg-white rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{ borderColor: 'rgb(229, 231, 235)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                      }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getCategoryColor(post.category) + '20' }}
                          >
                            <CategoryIcon size={14} style={{ color: getCategoryColor(post.category) }} />
                          </div>
                          <span 
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: getCategoryColor(post.category) }}
                          >
                            {post.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#161616' }}>
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgb(107, 114, 128)' }}>
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
                          <div className="flex items-center space-x-1">
                            <User size={12} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'rgb(156, 163, 175)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: '#161616' }}>
                No articles found
              </h3>
              <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>
                Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;