import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import HeritageManager from './HeritageManager';
import MusicManager from './MusicManager';
import FineArtManager from './FineArtManager';
import MapPlacesManagement from './MapPlacesManagement';
import PeopleManager from './PeopleManager';
import FestivalManager from './FestivalManager';
import QuizManager from './QuizManager';
import AudioManager from './AudioManager';
import TagManager from './TagManager';
import EconomicsManagement from './EconomicsManagement';
import GeographyManagement from './GeographyManagement';
import LiteratureManagement from './LiteratureManagement';
import SettingsPage from './SettingsPage';

export default function AdminPage() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-heritage-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-heritage-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-heritage-earth-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Handle navigation between admin pages
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Render the appropriate page based on current selection
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} currentPage={currentPage} />;
      case 'heritages':
        return <HeritageManager onBack={() => handleNavigate('dashboard')} />;
      case 'music':
        return <MusicManager onBack={() => handleNavigate('dashboard')} />;
      case 'fineart':
        return <FineArtManager onBack={() => handleNavigate('dashboard')} />;
      case 'mapplaces':
        return <MapPlacesManagement onBack={() => handleNavigate('dashboard')} />;
      case 'people':
        return <PeopleManager onBack={() => handleNavigate('dashboard')} />;
      case 'festivals':
        return <FestivalManager onBack={() => handleNavigate('dashboard')} />;
      case 'quizzes':
        return <QuizManager onBack={() => handleNavigate('dashboard')} />;
      case 'audio':
        return <AudioManager onBack={() => handleNavigate('dashboard')} />;
      case 'tags':
        return <TagManager onBack={() => handleNavigate('dashboard')} />;
      case 'economics':
        return <EconomicsManagement onBack={() => handleNavigate('dashboard')} />;
      case 'geography':
        return <GeographyManagement onBack={() => handleNavigate('dashboard')} />;
      case 'literature':
        return <LiteratureManagement onBack={() => handleNavigate('dashboard')} />;
      case 'settings':
        return <SettingsPage onBack={() => handleNavigate('dashboard')} />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} currentPage={currentPage} />;
    }
  };

  return renderPage();
}
