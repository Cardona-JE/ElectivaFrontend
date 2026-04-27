import "./Body.css";
import SearchBar from "../SearchBar";
import CategoriesSection from "../CategoriesSection";
import RecommendationsSection from "../Recommendations";

export default function Body() {
  return (
    <main className="body">
      <div className="container">
        <SearchBar />
        <CategoriesSection />
        <RecommendationsSection />
      </div>
    </main>
  );
}