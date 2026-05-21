import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Tiệm giặt là
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Đăng nhập để tiếp tục
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
