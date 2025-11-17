import React, { useEffect, useState } from "react";
import api from "../../api/client";
import type { Category, CategoryCreateUpdateDto } from "../../types";;

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryCreateUpdateDto>({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Category[]>("/api/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Error cargando categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, form);
      } else {
        await api.post("/api/categories", form);
      }
      setForm({ name: "" });
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      setError("Error guardando la categoría.");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error eliminando categoría.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page__title">Categorías</h1>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="grid-2">
        <section className="card">
          <h2>{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
          <form onSubmit={handleSubmit} className="form-inline">
            <input
              type="text"
              placeholder="Nombre de categoría"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              required
            />
            <button className="btn btn--primary" type="submit">
              {editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </section>

        <section className="card">
          <h2>Listado</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th style={{ width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>
                      <button
                        className="btn btn--small"
                        onClick={() => handleEdit(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3}>No hay categorías aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoriesPage;
