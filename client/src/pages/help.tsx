import { KnowledgeBase } from "@/components/help/knowledge-base";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <KnowledgeBase />
      </div>
      <Footer />
    </div>
  );
}