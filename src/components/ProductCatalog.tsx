import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit, Trash, Loader, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FileUpload } from './FileUpload';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_available: boolean;
}

interface ProductCatalogProps {
  cardId: string;
  isOwner?: boolean;
}

export function ProductCatalog({ cardId, isOwner = false }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    loadProducts();
  }, [cardId]);

  const loadProducts = async () => {
    const query = supabase
      .from('products')
      .select('*')
      .eq('card_id', cardId)
      .order('sort_order', { ascending: true });

    if (!isOwner) {
      query.eq('is_available', true);
    }

    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url || null,
          is_available: formData.is_available,
        })
        .eq('id', editingId);
    } else {
      await supabase.from('products').insert({
        card_id: cardId,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        currency: 'ILS',
      });
    }

    resetForm();
    loadProducts();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_available: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      is_available: product.is_available,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק מוצר זה?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
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
        <h2 className="text-2xl font-bold text-gray-900">קטלוג מוצרים</h2>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-sm"
          >
            {showForm ? 'ביטול' : <><Plus className="w-4 h-4 ml-2" />הוסף מוצר</>}
          </button>
        )}
      </div>

      {showForm && isOwner && (
        <form onSubmit={handleSubmit} className="card bg-blue-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'ערוך מוצר' : 'הוסף מוצר חדש'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם המוצר *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מחיר (₪) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                className="input"
                required
              />
            </div>

            <FileUpload
              bucket="media"
              label="תמונת המוצר"
              currentImage={formData.image_url}
              onUploadComplete={(url) =>
                setFormData({ ...formData, image_url: url })
              }
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.is_available}
                onChange={(e) =>
                  setFormData({ ...formData, is_available: e.target.checked })
                }
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="available" className="text-sm text-gray-700">
                המוצר זמין למכירה
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary btn-md flex-1">
                {editingId ? 'עדכן מוצר' : 'הוסף מוצר'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline btn-md"
              >
                ביטול
              </button>
            </div>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">אין מוצרים בקטלוג</p>
          {isOwner && (
            <p className="text-sm text-gray-500">הוסף מוצרים כדי להציג אותם ללקוחות</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  ₪{product.price.toFixed(2)}
                </span>
                {!product.is_available && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    אזל מהמלאי
                  </span>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-outline btn-sm flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
