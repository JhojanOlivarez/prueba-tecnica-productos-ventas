import React, { useEffect, useState } from "react";
import api from "../../api/client";
import type {
  Product,
  ProductCreateUpdateDto,
  Category,
} from "../../types";
import styles from "./productsPage.module.css";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductCreateUpdateDto>({
    name: "",
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // =========================
  // Cargar datos iniciales
  // =========================
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get<Product[]>("/api/products"),
        api.get<Category[]>("/api/categories"),
      ]);

      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando productos o categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // =========================
  // Handlers formulario
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      stock: 0,
      categoryId: 0,
      imageUrl: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.name || !form.categoryId) {
        setError("Nombre y categoría son obligatorios.");
        return;
      }

      if (editingId === null) {
        // Crear
        const res = await api.post<Product>("/api/products", form);
        setProducts((prev) => [...prev, res.data]);
      } else {
        // Actualizar
        await api.put(`/api/products/${editingId}`, form);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
        );
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Error guardando el producto.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    setLoading(true);
    setError(null);

    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      setError("Error eliminando el producto.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="page">
      <h1 className="page__title">Productos</h1>

      {error && <div className="alert alert--error">{error}</div>}

      {/* Usamos tu grid global (grid-2) */}
      <div className="grid-2">
        {/* ==== Formulario ==== */}
        <section className="card">
          <h2 className="page__subtitle">
            {editingId ? "Editar producto" : "Nuevo producto"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupRow}`}>
              <div>
                <label htmlFor="price">Precio</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoryId">Categoría</label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId || ""}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">URL de imagen (opcional)</label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl ?? ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                {editingId ? "Guardar cambios" : "Crear producto"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ==== Listado ==== */}
        <section className="card">
          <h2 className="page__subtitle">Listado</h2>

          {loading && products.length === 0 ? (
            <p>Cargando productos...</p>
          ) : products.length === 0 ? (
            <p>No hay productos aún.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.categoryName ?? p.categoryId}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td className={styles.tableActions}>
                        <button
                          type="button"
                          className="btn btn--small btn--ghost"
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn--small btn--danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
