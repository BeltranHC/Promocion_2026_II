"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Ticket, 
  DollarSign, 
  Users, 
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  Search,
  MessageCircle
} from "lucide-react";

interface TicketSale {
  id: string;
  buyerName: string;
  buyerPhone?: string;
  buyerEmail?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  ticketPrice: number | null;
  maxTickets: number | null;
  hasTickets: boolean;
}

interface SalesStats {
  totalSales: number;
  totalTicketsSold: number;
  totalRevenue: number;
  availableTickets: number | null;
  pendingSales: number;
  cancelledSales: number;
}

export default function EventSalesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [sales, setSales] = useState<TicketSale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<TicketSale | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    quantity: 1,
    paymentMethod: "yape",
    status: "confirmed",
    notes: ""
  });

  useEffect(() => {
    fetchSales();
  }, [eventId]);

  const fetchSales = async () => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/sales`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setSales(data.sales);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingSale
      ? `/api/admin/events/${eventId}/sales/${editingSale.id}`
      : `/api/admin/events/${eventId}/sales`;

    const method = editingSale ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingSale(null);
        resetForm();
        fetchSales();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar la venta");
      }
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Error al guardar la venta");
    }
  };

  const handleDelete = async (saleId: string) => {
    if (!confirm("¿Eliminar esta venta?")) return;

    try {
      const res = await fetch(`/api/admin/events/${eventId}/sales/${saleId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        fetchSales();
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleEdit = (sale: TicketSale) => {
    setEditingSale(sale);
    setFormData({
      buyerName: sale.buyerName,
      buyerPhone: sale.buyerPhone || "",
      buyerEmail: sale.buyerEmail || "",
      quantity: sale.quantity,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      notes: sale.notes || ""
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      quantity: 1,
      paymentMethod: "yape",
      status: "confirmed",
      notes: ""
    });
  };

  const openNewSale = () => {
    setEditingSale(null);
    resetForm();
    setShowModal(true);
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.buyerPhone?.includes(searchTerm) ||
      sale.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><Check size={12} /> Confirmada</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> Pendiente</span>;
      case "cancelled":
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1"><X size={12} /> Cancelada</span>;
      default:
        return status;
    }
  };

  const getPaymentBadge = (method: string) => {
    const colors: Record<string, string> = {
      yape: "bg-purple-500/20 text-purple-400",
      plin: "bg-cyan-500/20 text-cyan-400",
      efectivo: "bg-green-500/20 text-green-400",
      transferencia: "bg-blue-500/20 text-blue-400"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[method] || "bg-gray-500/20 text-gray-400"}`}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/events")}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Ventas de Entradas</h1>
            <p className="text-gray-400">{event?.title} - {event?.date}</p>
          </div>
        </div>
        <button
          onClick={openNewSale}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
        >
          <Plus size={18} /> Registrar Venta
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-400">S/. {stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Ticket className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Entradas Vendidas</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalTicketsSold}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Ticket className="text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Entradas Disponibles</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.availableTickets !== null ? stats.availableTickets : "∞"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ventas Totales</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalSales}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">Todos los estados</option>
          <option value="confirmed">Confirmadas</option>
          <option value="pending">Pendientes</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Sales Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Comprador</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Contacto</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Cantidad</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Pago</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Fecha</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    {sales.length === 0 
                      ? "No hay ventas registradas aún" 
                      : "No se encontraron ventas con los filtros aplicados"}
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{sale.buyerName}</p>
                      {sale.notes && (
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{sale.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {sale.buyerPhone && (
                        <a
                          href={`https://wa.me/51${sale.buyerPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm"
                        >
                          <MessageCircle size={14} /> {sale.buyerPhone}
                        </a>
                      )}
                      {sale.buyerEmail && (
                        <p className="text-xs text-gray-500">{sale.buyerEmail}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-gray-700 rounded-lg">
                        {sale.quantity} 🎫
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-400">
                      S/. {sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getPaymentBadge(sale.paymentMethod)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingSale ? "Editar Venta" : "Registrar Nueva Venta"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre del Comprador *</label>
                <input
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.buyerPhone}
                    onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Método de Pago</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="confirmed">✅ Confirmada</option>
                  <option value="pending">⏳ Pendiente</option>
                  <option value="cancelled">❌ Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows={2}
                  placeholder="Notas adicionales..."
                />
              </div>

              {event?.ticketPrice && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Total a pagar:</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    S/. {(event.ticketPrice * formData.quantity).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSale(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
                >
                  {editingSale ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
