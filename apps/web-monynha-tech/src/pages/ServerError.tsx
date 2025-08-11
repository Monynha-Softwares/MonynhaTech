import { useLanguage } from "@/hooks/useLanguage";

const ServerError = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">500</h1>
        <p className="text-xl text-gray-600 mb-4">
          {t("Erro interno do servidor", "Internal server error")}
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t("Voltar para a home", "Back to home")}
        </a>
      </div>
    </div>
  );
};

export default ServerError;
