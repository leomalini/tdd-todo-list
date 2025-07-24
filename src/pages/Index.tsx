import TodoApp from '@/components/TodoApp';
import { Auth } from '@/components/Auth';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={() => window.location.reload()} />;
  }

  return <TodoApp />;
};

export default Index;
