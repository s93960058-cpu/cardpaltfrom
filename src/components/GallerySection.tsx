import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash, Loader, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FileUpload } from './FileUpload';

interface GalleryItem {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

interface GallerySectionProps {
  cardId: string;
  isOwner?: boolean;
}

export function GallerySection({ cardId, isOwner = false }: GallerySectionProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    loadGallery();
  }, [cardId]);

  const loadGallery = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('card_id', cardId)
      .order('sort_order', { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from('gallery_items').insert({
      card_id: cardId,
      image_url: formData.image_url,
      title: formData.title || null,
      description: formData.description || null,
    });

    setFormData({ image_url: '', title: '', description: '' });
    setShowForm(false);
    loadGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק תמונה זו?')) return;
    await supabase.from('gallery_items').delete().eq('id', id);
    loadGallery();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">גלריה</h2>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-sm"
          >
            {showForm ? 'ביטול' : <><Plus className="w-4 h-4 ml-2" />הוסף תמונה</>}
          </button>
        )}
      </div>

      {showForm && isOwner && (
        <form onSubmit={handleSubmit} className="card bg-blue-50">
          <h3 className="font-semibold text-gray-900 mb-4">הוסף תמונה לגלריה</h3>

          <div className="space-y-4">
            <FileUpload
              bucket="media"
              label="תמונה *"
              currentImage={formData.image_url}
              onUploadComplete={(url) =>
                setFormData({ ...formData, image_url: url })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כותרת
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תיאור
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={!formData.image_url}
              className="btn btn-primary btn-md w-full"
            >
              הוסף לגלריה
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">אין תמונות בגלריה</p>
          {isOwner && (
            <p className="text-sm text-gray-500">הוסף תמונות להצגת עבודות</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <img
                src={item.image_url}
                alt={item.title || 'Gallery image'}
                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => setSelectedImage(item)}
              />
              {isOwner && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <Trash className="w-3 h-3" />
                </button>
              )}
              {item.title && (
                <p className="mt-1 text-sm text-gray-700 font-medium truncate">
                  {item.title}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4 text-white">
                {selectedImage.title && (
                  <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
