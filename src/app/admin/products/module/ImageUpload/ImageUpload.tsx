import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Link, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { deleteProductImage } from "@/services/products-service";

interface ImageUploadProps {
  productId: number;
  initialImages: { id: number; url: string }[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  productId,
  initialImages,
  onImagesChange,
  maxImages = 5
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [existingImages, setExistingImages] = useState(initialImages);

  useEffect(() => {
    setExistingImages(initialImages);
  }, [initialImages]);


  const totalImages = images.length + existingImages.length;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      const remainingSlots = maxImages - totalImages;
      const newImages = [...images, ...acceptedFiles].slice(0, remainingSlots);
      setImages(newImages);
      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
      onImagesChange(newImages);
      if (acceptedFiles.length > remainingSlots) {
        toast.warning(`Solo se pueden subir ${maxImages} imágenes en total. Se han seleccionado las primeras ${remainingSlots}.`);
      }
    },
    multiple: true,
    maxFiles: maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newImages);
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImage(productId, imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      toast.success("Imagen eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleExternalUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (externalUrl && totalImages < maxImages) {
      fetch(externalUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "external-image", { type: blob.type });
          const newImages = [...images, file];
          setImages(newImages);
          setPreviewUrls([...previewUrls, externalUrl]);
          setExternalUrl("");
          onImagesChange(newImages);
        })
        .catch((error) => {
          console.error("Error fetching external image:", error);
          toast.error("Error al cargar la imagen externa");
        });
    } else if (totalImages >= maxImages) {
      toast.warning(`Ya has alcanzado el límite de ${maxImages} imágenes.`);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Fotos</h2>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "upload"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Subir imágenes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("external")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "external"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Imágenes externas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "ai"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Generar con IA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "gallery"
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Galería
          </button>
        </div>

        {activeTab === "upload" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors ${totalImages >= maxImages ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <input {...getInputProps()} disabled={totalImages >= maxImages} />
            <Upload className="h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2 text-sm text-gray-500">
                Suelta las imágenes aquí...
              </p>
            ) : totalImages >= maxImages ? (
              <p className="mt-2 text-sm text-gray-500">
                Has alcanzado el límite de {maxImages} imágenes
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-gray-500">
                  Arrastra y suelta imágenes aquí o haz clic para seleccionar
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB (Máximo {maxImages} imágenes)
                </p>
              </>
            )}
          </div>
        )}

        {activeTab === "external" && (
          <form onSubmit={handleExternalUrlSubmit} className="space-y-4">
            <div className="flex items-center">
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={totalImages >= maxImages}
              />
              <button
                type="submit"
                className={`px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${totalImages >= maxImages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={totalImages >= maxImages}
              >
                <Link className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}

        {activeTab === "ai" && (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Próximamente
            </h3>
            <p className="text-sm text-gray-500">
              La generación de imágenes con IA estará disponible pronto.
            </p>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Galería de imágenes
            </h3>
            <p className="text-sm text-gray-500">
              Aquí podrás ver y seleccionar imágenes de tu galería.
            </p>
          </div>
        )}

        <div className="grid grid-cols-5 gap-4 mt-4">
          {existingImages.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <Image
                src={image.url}
                alt="Existing product image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className="relative aspect-square">
              <Image
                src={url}
                alt={`New image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {[...Array(maxImages - totalImages)].map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square">
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl text-gray-400">+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
