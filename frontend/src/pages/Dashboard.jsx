import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

const INITIAL_TIERS = {
  S: { label: "S", color: "#ff7f7f", items: [] },
  A: { label: "A", color: "#ffbf7f", items: [] },
  B: { label: "B", color: "#ffff7f", items: [] },
  C: { label: "C", color: "#7fff7f", items: [] },
  D: { label: "D", color: "#7fbfff", items: [] },
  F: { label: "F", color: "#ff7fff", items: [] },
};

export const Dashboard = () => {
  const { logout } = useAuth();
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [pool, setPool] = useState([]);

  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("spotify_jwt");

      const res = await fetch(`${BASE_URL}/spotify/search?q=${encodeURIComponent(query)}&type=${searchType}`, { headers: { Authorization: `Bearer ${token}` } });

      if (!res.ok) {
        throw new Error("Search request failed.");
      }
      const data = await res.json();
      console.log(res);

      let items = [];

      if (searchType === "track" && data.tracks?.items) {
        items = data.tracks.items.map((t) => ({
          id: t.id,
          name: t.name,
          subtitle: t.artists?.[0]?.name || "Track",
          img: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || "",
        }));
      } else if (searchType === "artist" && data.artists?.items) {
        items = data.artists.items.map((a) => ({
          id: a.id,
          name: a.name,
          subtitle: "Artist",
          img: a.images?.[1].url || a.images?.[0]?.url || "",
        }));
      } else if (searchType === "album" && data.albums?.items) {
        items = data.albums.items.map((al) => ({
          id: al.id,
          name: al.name,
          subtitle: al.artists?.[0]?.name || "Album",
          img: al.images?.[1].url || al.image?.[0]?.url || "",
        }));
      }
      setSearchResults(items);
    } catch (error) {
      console.error(error);
      setErrorMsg("Could not fetch search results. Check your backend endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const addToPool = (item) => {
    const existsInPool = pool.some((p) => p.id === item.id);
    const existsInTiers = Object.values(tiers).some((t) => t.items.some((i) => i.id === item.id));

    if (existsInPool || existsInTiers) return;

    setPool((prev) => [...prev, item]);
  };

  const removeFromPool = (idToRemove) => {
    setPool((prevPool) => prevPool.filter((item) => item.id !== idToRemove));

    setTiers((prevTiers) => {
      const updated = {};
      for (const [tierKey, tierData] of Object.entries(prevTiers)) {
        updated[tierKey] = {
          ...tierData,
          items: tierData.items.filter((item) => item.id !== idToRemove),
        };
      }
      return updated;
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const getList = (id) => (id === "pool" ? [...pool] : [...tiers[id].items]);

    const sourceList = getList(source.droppableId);
    const destList = source.droppableId === destination.droppableId ? sourceList : getList(destination.droppableId);

    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    if (source.droppableId === "pool") {
      setPool(sourceList);
    } else {
      setTiers((prev) => ({
        ...prev,
        [source.droppableId]: { ...prev[source.droppableId], items: sourceList },
      }));
    }

    if (destination.droppableId === "pool") {
      setPool(destList);
    } else {
      setTiers((prev) => ({
        ...prev,
        [destination.droppableId]: { ...prev[destination.droppableId], items: destList },
      }));
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Top Bar */}
      <header className={styles.nav}>
        <h1 className={styles.brandTitle}>Spotify Tier Maker</h1>
        <button
          onClick={() => {
            (setTiers(INITIAL_TIERS), setPool([]), setQuery(""), setSearchResults([]));
          }}
          className={styles.logoutBtn}
        >
          Reset
        </button>
        <button onClick={logout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </header>

      {/* Search & Filter Controls */}
      <section className={styles.searchSection}>
        {/* The 3 Filter Buttons requested */}
        <div className={styles.filterRow}>
          <button type="button" onClick={() => setSearchType("track")} className={`${styles.filterBtn} ${searchType === "track" ? styles.activeFilter : ""}`}>
            Tracks
          </button>
          <button type="button" onClick={() => setSearchType("artist")} className={`${styles.filterBtn} ${searchType === "artist" ? styles.activeFilter : ""}`}>
            Artists
          </button>
          <button type="button" onClick={() => setSearchType("album")} className={`${styles.filterBtn} ${searchType === "album" ? styles.activeFilter : ""}`}>
            Albums
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search for ${searchType}s...`} className={styles.textInput} />
          <button type="submit" disabled={loading} className={styles.searchBtn}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {/* Results Tray */}
        {searchResults.length > 0 && (
          <div className={styles.resultsContainer}>
            <span className={styles.trayLabel}>Click to add to your unranked pool:</span>
            <div className={styles.resultsGrid}>
              {searchResults.map((item) => (
                <button key={item.id} onClick={() => addToPool(item)} className={styles.resultCard}>
                  <img src={item.img} alt={item.name} className={styles.resultImg} />
                  <div className={styles.resultInfo}>
                    <p className={styles.resultName}>{item.name}</p>
                    <p className={styles.resultSubtitle}>{item.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Tier Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <section className={styles.tierBoard}>
          {Object.entries(tiers).map(([tierKey, tier]) => (
            <div key={tierKey} className={styles.tierRow}>
              <div className={styles.tierHeader} style={{ backgroundColor: tier.color }}>
                {tier.label}
              </div>
              <Droppable droppableId={tierKey} direction="horizontal">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={`${styles.tierDropArea} ${snapshot.isDraggingOver ? styles.dragOver : ""}`}>
                    {tier.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.card}>
                            <img src={item.img} alt={item.name} className={styles.cardImg} />
                            <span className={styles.cardTooltip}>{item.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </section>

        {/* Unranked Pool Dock */}
        <section className={styles.poolSection}>
          <h2 className={styles.poolTitle}>Unranked Pool ({pool.length} items)</h2>
          <Droppable droppableId="pool" direction="horizontal">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={`${styles.poolDropArea} ${snapshot.isDraggingOver ? styles.dragOver : ""}`}>
                {pool.length === 0 && <p className={styles.emptyPoolText}>Search above and select items to populate your pool.</p>}
                {pool.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.card}>
                        <button
                          type="button"
                          className={styles.removeCardBtn}
                          title="Remove from pool"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPool(item.id);
                          }}
                        >
                          X
                        </button>
                        <img src={item.img} alt={item.name} className={styles.cardImg} />
                        <span className={styles.cardTooltip}>{item.name}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
      </DragDropContext>
    </div>
  );
};
