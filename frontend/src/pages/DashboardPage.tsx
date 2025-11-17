import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import type { SaleResponse, Category } from "../types";
import styles from "./DashboardPage.module.css";

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

    void loadData();
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
    <div className={`page ${styles.pageDashboard}`}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Panel general</h1>
          <p className={styles.pageSubtitle}>
            Resumen en tiempo real de tus ventas, categorías y productos.
          </p>
        </div>
        <div className={styles.pageHeaderRight}>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
            Online
          </span>
        </div>
      </header>

      {loading && (
        <div className={styles.pageLoader}>Cargando datos...</div>
      )}
      {error && <div className={styles.pageError}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Tarjetas KPI */}
          <section className={styles.kpiGrid}>
            <article
              className={`${styles.kpiCard} ${styles.kpiCardPrimary}`}
            >
              <h3>Total ventas</h3>
              <p className={styles.kpiCardValue}>
                {totalSalesCount.toLocaleString("es-CO")}
              </p>
              <span className={styles.kpiCardLabel}>
                Ventas registradas
              </span>
            </article>

            <article
              className={`${styles.kpiCard} ${styles.kpiCardSecondary}`}
            >
              <h3>Ingresos</h3>
              <p className={styles.kpiCardValue}>
                $
                {totalRevenue.toLocaleString("es-CO", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <span className={styles.kpiCardLabel}>COP acumulados</span>
            </article>

            <article
              className={`${styles.kpiCard} ${styles.kpiCardAccent}`}
            >
              <h3>Ítems vendidos</h3>
              <p className={styles.kpiCardValue}>
                {totalItemsSold.toLocaleString("es-CO")}
              </p>
              <span className={styles.kpiCardLabel}>
                Unidades totales
              </span>
            </article>

            <article className={styles.kpiCard}>
              <h3>Categorías activas</h3>
              <p className={styles.kpiCardValue}>{categories.length}</p>
              <span className={styles.kpiCardLabel}>Categorías</span>
            </article>
          </section>

          {/* Grid inferior: últimas ventas + resumen categorías */}
          <section className={styles.bottomGrid}>
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Últimas ventas</h2>
                <span className={styles.panelSubtitle}>
                  {lastSales.length} más recientes
                </span>
              </div>

              {lastSales.length === 0 ? (
                <p className={styles.panelEmpty}>
                  Aún no hay ventas registradas. Crea una desde el módulo
                  de Ventas.
                </p>
              ) : (
                <div className="table-wrapper">
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th className={styles.dataTableThRight}>Total</th>
                        <th className={styles.dataTableThCenter}>Ítems</th>
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
                          <td className={styles.dataTableTdRight}>
                            $
                            {sale.total.toLocaleString("es-CO", {
                              minimumFractionDigits: 0,
                            })}
                          </td>
                          <td className={styles.dataTableTdCenter}>
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

            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Resumen de categorías</h2>
                <span className={styles.panelSubtitle}>
                  Vista rápida de tu catálogo
                </span>
              </div>

              {categories.length === 0 ? (
                <p className={styles.panelEmpty}>
                  Aún no hay categorías. Crea algunas desde el módulo de
                  Categorías.
                </p>
              ) : (
                <ul className={styles.tagList}>
                  {categories.map((cat) => (
                    <li key={cat.id} className={styles.tagListItem}>
                      {cat.name}
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
