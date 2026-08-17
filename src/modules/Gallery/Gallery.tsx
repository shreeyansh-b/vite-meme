import { useMemo, useState } from "react";

import { Meme } from "../../hooks/data-fetchers/useGetMemesQuery";

type Props = { images: Meme[]; onSelectMeme: (meme: Meme) => void; selectedMeme: Meme | null };

const categories = ["All", "Classics", "Reaction", "Animals"];

const categoryMatchers: Record<string, RegExp> = {
  Classics: /drake|distracted|two buttons|change my mind|one does not simply|success kid|disaster girl|doge|batman/i,
  Reaction: /waiting|crying|surprised|confused|guy|face|buzz|bernie|always has been|side eye/i,
  Animals: /dog|cat|bird|monkey|horse|seal|parrot|frog|shark|cheems|pigeon/i,
};

const Gallery = ({ images, onSelectMeme, selectedMeme }: Props) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const visibleImages = useMemo(() => {
    const term = search.trim().toLowerCase();
    return images.filter((image) => {
      const categoryMatch = category === "All" || categoryMatchers[category].test(image.name);
      return categoryMatch && (!term || image.name.toLowerCase().includes(term));
    });
  }, [category, images, search]);

  return (
    <>
      <div className="panel-heading">
        <div><p className="eyebrow">Pick a format</p><h1>Templates</h1></div>
        <span className="template-count">{images.length}</span>
      </div>
      <label className="search-field">
        <SearchIcon />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates" />
      </label>
      <div className="filter-row">
        {categories.map((item) => <button className={item === category ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}
      </div>
      <div className="template-grid">
        {visibleImages.map((image) => (
          <button className={`template-card ${selectedMeme?.id === image.id ? "selected" : ""}`} onClick={() => onSelectMeme(image)} type="button" key={image.id}>
            <img src={image.url} alt="" />
            <span>{image.name}</span>
          </button>
        ))}
        {!visibleImages.length && <div className="empty-templates"><strong>No template found</strong><span>Try another search, or browse everything.</span><button type="button" onClick={() => { setSearch(""); setCategory("All"); }}>Show all templates</button></div>}
      </div>
    </>
  );
};

function SearchIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>; }

export { Gallery };
