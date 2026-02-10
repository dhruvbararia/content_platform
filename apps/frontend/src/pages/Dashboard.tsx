import { useMe } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-4">
            Role: <span className="font-semibold">{user?.role}</span>
          </p>
          <div className="flex gap-4">
            <Button>Documents</Button>
            <Button>Letters</Button>
            <Button>Courses</Button>
            <Button>Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
