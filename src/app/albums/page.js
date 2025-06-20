'use client'

import React, { useState, useEffect, useRef } from "react";
import PhotoModal from "../components/PhotoModal";

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null); // 🔁 used instead of getElementById

  // Fetch initial albums + users
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [albumsRes, usersRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/albums?_page=1&_limit=20"),
          fetch("https://jsonplaceholder.typicode.com/users"),
        ]);
        const albumsData = await albumsRes.json();
        const usersData = await usersRes.json();

        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        setAlbums(albumsData);
        setUsers(usersMap);
        setPage(2);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch more albums on scroll
  const fetchMoreAlbums = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/albums?_page=${page}&_limit=20`);
      const newAlbums = await res.json();

      if (newAlbums.length > 0) {
        setAlbums((prev) => [...prev, ...newAlbums]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Observe when user scrolls to the bottom loader
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMoreAlbums();
      },
      { threshold: 1, rootMargin: "200px" }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loaderRef, hasMore, isLoading, page]);

  const renderAlbumSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    ));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Albums</h2>

      {albums.length === 0 && isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderAlbumSkeletons()}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg text-gray-900 truncate">{album.title}</h3>
              <p className="text-sm text-gray-600">{users[album.userId]?.name || "Unknown User"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loaderRef} className="h-10 flex justify-center items-center text-gray-500">
        {isLoading && albums.length > 0 && "Loading more..."}
        {!hasMore && "No more albums to load."}
      </div>

      {selectedAlbum && (
        <PhotoModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </div>
  );
};

export default AlbumsPage;
