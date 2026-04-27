import { useState } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import SearchBar from "../components/common/SearchBar";
import CategoriesSection from "../components/common/CategoriesSection";
import RecommendationsSection from "../components/common/Recommendations/Recommendations";
import Footer from "../components/layout/Footer/Footer";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", marginTop: "70px" }}>
        <SearchBar onSearch={setSearch} />
        <CategoriesSection onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
        <RecommendationsSection search={search} selectedCategory={selectedCategory} />
      </div>
      <Footer />
    </div>
  );
}