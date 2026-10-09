const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-page font-sans text-sm text-gray-800 antialiased">
      <main className="mx-auto w-full max-w-xl space-y-3 px-3 py-5">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
