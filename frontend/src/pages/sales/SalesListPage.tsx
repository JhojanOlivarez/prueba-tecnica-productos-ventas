import React, { useEffect, useState } from "react";
import api from "../../api/client";
import type { SaleResponse } from "../../types";


const SalesListPage: React.FC = () => {
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<SaleResponse[]>("/api/sales");
      setSales(data);
    } catch (err) {
      console.error(err);
      setError("Error cargando ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page__title">Historial de ventas</h1>
        <button className="btn btn--ghost" onClick={loadSales}>
          Refrescar
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="table-wrapper card">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{new Date(s.date).toLocaleString()}</td>
                  <td>{s.customerName}</td>
                  <td>${s.total.toFixed(2)}</td>
                </tr>
              ))}
              {sales.length === 0 && !loading && (
                <tr>
                  <td colSpan={4}>No hay ventas registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesListPage;
