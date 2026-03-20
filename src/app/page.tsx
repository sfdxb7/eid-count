import EidCalculator from '@/components/EidCalculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto pt-2 pb-8">
        <EidCalculator />
      </div>
      
      {/* Footer / Decorative Element */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-30"></div>
    </main>
  );
}
