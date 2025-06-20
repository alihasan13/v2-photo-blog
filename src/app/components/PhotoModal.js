'use client'

import ModalLayout from "./ModalLayout";
import React, { useState,useEffect } from "react";

const PhotoModal = ({ album, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!album?.id) return;
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/photos?albumId=${album.id}&_limit=5`
        );
        const data = await res.json();
        // FIX: Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setPhotos(data);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, [album.id]);

  const renderPhotoSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ));
  };

  return (
    <ModalLayout title={album.title} subtitle="Photos" onClose={onClose}>
      {isLoading ? (
        <div className="space-y-4">{renderPhotoSkeletons()}</div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="flex items-center space-x-4">
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{photo.title}</p>
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  View full size
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalLayout>
  );
};
export default PhotoModal;