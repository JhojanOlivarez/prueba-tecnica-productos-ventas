import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import type { SaleResponse, Category } from "../types";

const DashboardPage: React.FC = () => {
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar ventas + categorías al entrar
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [salesRes, categoriesRes] = await Promise.all([
          api.get<SaleResponse[]>("/api/sales"),
          api.get<Category[]>("/api/categories"),
        ]);

        setSales(salesRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ====== MÉTRICAS DERIVADAS ======
  const totalRevenue = useMemo(
    () => sales.reduce((acc, sale) => acc + sale.total, 0),
    [sales]
  );

  const totalSalesCount = sales.length;

  const totalItemsSold = useMemo(
    () =>
      sales.reduce(
        (acc, sale) =>
          acc + sale.items.reduce((sum, item) => sum + item.quantity, 0),
        0
      ),
    [sales]
  );

  const lastSales = useMemo(
    () =>
      [...sales]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5),
    [sales]
  );

  return (
    <div className="page page--dashboard">
      <header className="page__header">
        <div>
          <h1 className="page__title">Panel general</h1>
          <p className="page__subtitle">
            Resumen en tiempo real de tus ventas, categorías y productos.
          </p>
        </div>
        <div className="page__header-right">
          <span className="badge badge--success">Online</span>
        </div>
      </header>

      {loading && <div className="page__loader">Cargando datos...</div>}
      {error && <div className="page__error">{error}</div>}

      {!loading && !error && (
        <>
          {/* Tarjetas KPI */}
          <section className="dashboard__kpi-grid">
            <article className="kpi-card kpi-card--primary">
              <h3>Total ventas</h3>
              <p className="kpi-card__value">
                {totalSalesCount.toLocaleString("es-CO")}
              </p>
              <span className="kpi-card__label">Ventas registradas</span>
            </article>

            <article className="kpi-card kpi-card--secondary">
              <h3>Ingresos</h3>
              <p className="kpi-card__value">
                $
                {totalRevenue.toLocaleString("es-CO", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <span className="kpi-card__label">COP acumulados</span>
            </article>

            <article className="kpi-card kpi-card--accent">
              <h3>Ítems vendidos</h3>
              <p className="kpi-card__value">
                {totalItemsSold.toLocaleString("es-CO")}
              </p>
              <span className="kpi-card__label">Unidades totales</span>
            </article>

            <article className="kpi-card">
              <h3>Categorías activas</h3>
              <p className="kpi-card__value">{categories.length}</p>
              <span className="kpi-card__label">Categorías</span>
            </article>
          </section>

          {/* Grid inferior: últimas ventas + resumen categorías */}
          <section className="dashboard__bottom-grid">
            <article className="panel panel--table">
              <div className="panel__header">
                <h2>Últimas ventas</h2>
                <span className="panel__subtitle">
                  {lastSales.length} más recientes
                </span>
              </div>

              {lastSales.length === 0 ? (
                <p className="panel__empty">
                  Aún no hay ventas registradas. Crea una desde el módulo de
                  Ventas.
                </p>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th className="data-table__th--right">Total</th>
                        <th className="data-table__th--center">Ítems</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>
                            {new Date(sale.date).toLocaleString("es-CO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                          <td>{sale.customerName || "Consumidor final"}</td>
                          <td className="data-table__td--right">
                            $
                            {sale.total.toLocaleString("es-CO", {
                              minimumFractionDigits: 0,
                            })}
                          </td>
                          <td className="data-table__td--center">
                            {sale.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <article className="panel">
              <div className="panel__header">
                <h2>Resumen de categorías</h2>
                <span className="panel__subtitle">
                  Vista rápida de tu catálogo
                </span>
              </div>

              {categories.length === 0 ? (
                <p className="panel__empty">
                  Aún no hay categorías. Crea algunas desde el módulo de
                  Categorías.
                </p>
              ) : (
                <ul className="tag-list">
                  {categories.map((cat) => (
                    <li key={cat.id} className="tag-list__item">
                      <span className="tag-list__name">{cat.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
