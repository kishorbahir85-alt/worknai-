import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ui/ScrollToTop';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import HRLayout from './components/hr/HRLayout';

// Public pages
import Home from './pages/public/Home';
import Courses from './pages/public/Courses';
import CourseDetail from './pages/public/CourseDetail';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Career from './pages/public/Career';
import JobDetail from './pages/public/JobDetail';
import Partners from './pages/public/Partners';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';
import ServicePage from './pages/public/ServicePage';
import JoinUs from './pages/public/JoinUs';
import TrendingOverview from './pages/public/trending/Overview';
import TrendingOurApproach from './pages/public/trending/OurApproach';
import TrendingSuccessStories from './pages/public/trending/SuccessStories';
import TrendingExpertVoices from './pages/public/trending/ExpertVoices';
import TrendingContactUs from './pages/public/trending/ContactUs';
import Blog from './pages/public/Blog';
import BlogDetail from './pages/public/BlogDetail';
import Tutorials from './pages/public/Tutorials';
import TutorialDetail from './pages/public/TutorialDetail';
import Templates from './pages/public/Templates';
import HelpCenter from './pages/public/HelpCenter';

// HR pages
import HRLogin from './pages/hr/Login';
import HRDashboard from './pages/hr/Dashboard';
import HRManageCourses from './pages/hr/ManageCourses';
import HRManageJobs from './pages/hr/ManageJobs';
import HRManageProducts from './pages/hr/ManageProducts';
import HRApplications from './pages/hr/Applications';
import HREnrollments from './pages/hr/Enrollments';
import HRProfile from './pages/hr/Profile';

const HRProtected = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user || user.role !== 'hr') return <Navigate to="/hr/login" state={{ from: location }} replace />;
  return children;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="cosmos-stars" />
      <div className="grain-overlay" />
      <Routes>
        {/* ============ PUBLIC ============ */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/career" element={<Career />} />
          <Route path="/career/:slug" element={<JobDetail />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/trending-topics/overview" element={<TrendingOverview />} />
          <Route path="/trending-topics/our-approach" element={<TrendingOurApproach />} />
          <Route path="/trending-topics/success-stories" element={<TrendingSuccessStories />} />
          <Route path="/trending-topics/expert-voices" element={<TrendingExpertVoices />} />
          <Route path="/trending-topics/contact-us" element={<TrendingContactUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/tutorials/:slug" element={<TutorialDetail />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/help" element={<HelpCenter />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ============ HR PANEL ============ */}
        <Route path="/hr/login" element={<HRLogin />} />
        <Route
          path="/hr"
          element={<HRProtected><HRLayout /></HRProtected>}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="courses" element={<HRManageCourses />} />
          <Route path="jobs" element={<HRManageJobs />} />
          <Route path="products" element={<HRManageProducts />} />
          <Route path="applications" element={<HRApplications />} />
          <Route path="enrollments" element={<HREnrollments />} />
          <Route path="profile" element={<HRProfile />} />
        </Route>
      </Routes>
    </>
  );
}
