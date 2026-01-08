import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT - Actualizar una venta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; saleId: string }> }
) {
  try {
    const { id: eventId, saleId } = await params;
    const body = await request.json();

    const {
      buyerName,
      buyerPhone,
      buyerEmail,
      quantity,
      paymentMethod,
      status,
      notes
    } = body;

    // Verificar que la venta existe y pertenece al evento
    const existingSale = await prisma.ticketSale.findFirst({
      where: {
        id: saleId,
        eventId
      },
      include: {
        event: {
          include: {
            ticketSales: {
              where: { status: 'confirmed', NOT: { id: saleId } }
            }
          }
        }
      }
    });

    if (!existingSale) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    // Si cambia la cantidad, verificar disponibilidad
    if (quantity && quantity !== existingSale.quantity && existingSale.event.maxTickets) {
      const soldTickets = existingSale.event.ticketSales.reduce((sum, s) => sum + s.quantity, 0);
      const available = existingSale.event.maxTickets - soldTickets;

      if (quantity > available + existingSale.quantity) {
        return NextResponse.json(
          { error: `Solo quedan ${available + existingSale.quantity} entradas disponibles` },
          { status: 400 }
        );
      }
    }

    // Recalcular total si cambia la cantidad
    const newQuantity = quantity || existingSale.quantity;
    const totalAmount = existingSale.unitPrice * newQuantity;

    // Actualizar la venta
    const sale = await prisma.ticketSale.update({
      where: { id: saleId },
      data: {
        buyerName: buyerName || existingSale.buyerName,
        buyerPhone: buyerPhone !== undefined ? buyerPhone : existingSale.buyerPhone,
        buyerEmail: buyerEmail !== undefined ? buyerEmail : existingSale.buyerEmail,
        quantity: newQuantity,
        totalAmount,
        paymentMethod: paymentMethod || existingSale.paymentMethod,
        status: status || existingSale.status,
        notes: notes !== undefined ? notes : existingSale.notes
      }
    });

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json(
      { error: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una venta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; saleId: string }> }
) {
  try {
    const { id: eventId, saleId } = await params;

    // Verificar que la venta existe y pertenece al evento
    const existingSale = await prisma.ticketSale.findFirst({
      where: {
        id: saleId,
        eventId
      }
    });

    if (!existingSale) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    await prisma.ticketSale.delete({
      where: { id: saleId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}
