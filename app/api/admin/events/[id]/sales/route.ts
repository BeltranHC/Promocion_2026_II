import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Obtener todas las ventas de un evento
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    // Obtener el evento con sus ventas
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketSales: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Calcular estadísticas
    const confirmedSales = event.ticketSales.filter(s => s.status === 'confirmed');
    const totalTicketsSold = confirmedSales.reduce((sum, s) => sum + s.quantity, 0);
    const totalRevenue = confirmedSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const availableTickets = event.maxTickets ? event.maxTickets - totalTicketsSold : null;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        ticketPrice: event.ticketPrice,
        maxTickets: event.maxTickets,
        hasTickets: event.hasTickets
      },
      sales: event.ticketSales,
      stats: {
        totalSales: confirmedSales.length,
        totalTicketsSold,
        totalRevenue,
        availableTickets,
        pendingSales: event.ticketSales.filter(s => s.status === 'pending').length,
        cancelledSales: event.ticketSales.filter(s => s.status === 'cancelled').length
      }
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Error al obtener las ventas" },
      { status: 500 }
    );
  }
}

// POST - Registrar nueva venta
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();

    const {
      buyerName,
      buyerPhone,
      buyerEmail,
      quantity,
      paymentMethod = 'yape',
      status = 'confirmed',
      notes
    } = body;

    // Validaciones
    if (!buyerName || !quantity) {
      return NextResponse.json(
        { error: "Nombre del comprador y cantidad son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el evento existe y tiene entradas
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketSales: {
          where: { status: 'confirmed' }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    if (!event.hasTickets) {
      return NextResponse.json(
        { error: "Este evento no tiene venta de entradas habilitada" },
        { status: 400 }
      );
    }

    // Verificar disponibilidad de entradas
    if (event.maxTickets) {
      const soldTickets = event.ticketSales.reduce((sum, s) => sum + s.quantity, 0);
      const available = event.maxTickets - soldTickets;

      if (quantity > available) {
        return NextResponse.json(
          { error: `Solo quedan ${available} entradas disponibles` },
          { status: 400 }
        );
      }
    }

    // Calcular monto total
    const unitPrice = event.ticketPrice || 0;
    const totalAmount = unitPrice * quantity;

    // Crear la venta
    const sale = await prisma.ticketSale.create({
      data: {
        eventId,
        buyerName,
        buyerPhone,
        buyerEmail,
        quantity,
        unitPrice,
        totalAmount,
        paymentMethod,
        status,
        notes
      }
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Error al registrar la venta" },
      { status: 500 }
    );
  }
}
