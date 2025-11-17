import React, { useState } from "react";
import api from "../../api/client";
import type { SaleCreateRequest } from "../../types";

const emptyItem = { productId: 0, quantity: 1 };

const SalesCreatePage: React.FC = () => {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([emptyItem]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (
    index: number,
    field: "productId" | "quantity",
    value: number
  ) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const addRow = () => setItems((prev) => [...prev, emptyItem]);
  const removeRow = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const payload: SaleCreateRequest = {
      customerName,
      items: items.filter((i) => i.productId && i.quantity),
    };

    try {
      const { data } = await api.post("/api/sales", payload);
      setMessage(`Venta registrada. ID: ${data.id}, Total: ${data.total}`);
      setCustomerName("");
      setItems([emptyItem]);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data ?? "Error registrando venta. Revisa productId."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">Nueva venta</h1>

      {message && <div className="alert alert--success">{message}</div>}
      {error && <div className="alert alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <label className="field">
          <span>Cliente</span>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nombre del cliente"
          />
        </label>

        <h2>Ítems</h2>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Producto ID</th>
                <th>Cantidad</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.productId || ""}
                      onChange={(e) =>
                        handleItemChange(index, "productId", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn--small btn--danger"
                        onClick={() => removeRow(index)}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={addRow}
          style={{ marginTop: "0.5rem" }}
        >
          + Agregar producto
        </button>

        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Guardando..." : "Registrar venta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesCreatePage;
