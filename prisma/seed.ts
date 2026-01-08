import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Fechas de las semanas (columnas del CSV)
const WEEK_DATES = [
    '2025-09-08', // Semana 1
    '2025-09-15', // Semana 2
    '2025-09-22', // Semana 3
    '2025-09-29', // Semana 4
    '2025-10-06', // Semana 5
    '2025-10-13', // Semana 6
    '2025-10-20', // Semana 7
    '2025-10-27', // Semana 8
    '2025-11-03', // Semana 9
    '2025-11-10', // Semana 10
    '2025-11-17', // Semana 11
    '2025-11-24', // Semana 12
    '2025-12-01', // Semana 13
    '2025-12-08', // Semana 14
    '2025-12-15', // Semana 15
    '2025-12-22', // Semana 16
    '2025-12-29', // Semana 17
];

// Datos de estudiantes y sus pagos del CSV
// Formato: [orden, nombre, [pagos por semana: 5=normal, 7=tardío, null=no pagó, 0=exonerado]]
const STUDENTS_DATA: [number, string, (number | null)[]][] = [
    [1, 'ANCCORI CESPEDES RUTH SANDRA', [5, 5, 5, 7, 7, 5, 5, 5, null, null, null, null, null, null, null, null, null]],
    [2, 'ANQUISE VARGAS JUAN CARLOS', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null, null, null]],
    [4, 'APAZA CHAMBI, ROCIO ANGELICA', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [5, 'APAZA CUTIMBO, ROSMERY YESICA', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [6, 'CAUNA HUANCA JHOEL EDU', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null, null]],
    [7, 'CHACCA CHARCA, MAYCOL JHONATHAN', [5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null]],
    [8, 'CHARAJA CAHUARI YOSY ADAMARIS', [5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null]],
    [9, 'COILA YUCRA LIZET YULIANA', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null]],
    [10, 'COLQUEHUANCA ZAPANA KRIS XIMENA', [5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [11, 'ESPINOZA HANCO KEWIN ANTHONY', [5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [12, 'ESPINOZA WIRACOCHA, ABIGAIL VANESA', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [13, 'FLORES PACCO NILVER WILFREDO', [5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [14, 'GAMARRA MAMANI, JEFFERSON JOHEL', [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    [15, 'GOMEZ TACURI JOSE FERNANDO', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null]],
    [16, 'GRIMALDOS AVILA LEONARDO SEBASTIAN', [5, 5, 7, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [17, 'HUARAYA CHIPANA, JUNIOR BELTRAN', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null]],
    [19, 'JIMENEZ APAZA CARLOS ANTONIO', [5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [20, 'LAURA LIVISE YEFERSON DARIUN', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null]],
    [21, 'LEON MAMANI OBED ELIU', [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    [22, 'MAMANI RODRIGUEZ, MARCO PAUL', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null]],
    [23, 'MAYTA GUZMAN, LUZ DE BELEN', [5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [24, 'MENA CCORI, NAYELI LIZBETH', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null]],
    [25, 'MOLINA MANSILLA MIGUEL ANGEL', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [26, 'MUÑOZ ANCCORI EDILFONSO', [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    [27, 'PARI BENITO LUIS DIEGO', [5, 5, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    [28, 'PONCE POMA NAHOMI PAOLA', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null]],
    [29, 'PORTILLO MACHACA, KEVIN PLEYER', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null]],
    [30, 'QUECCARA CONDORI, FRANKLIN', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null]],
    [31, 'QUISPE CCALLO, NURY MARGOT', [5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [32, 'QUISPE MAMANI GUERSON PETER', [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    [33, 'RODRIGUEZ YUCRA, LUZ MERY', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [34, 'TORRES ESCOBAR, TONY FRANKLY', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null]],
    [35, 'VARGAS GUTIERREZ, LENING KLEBERSON', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [36, 'VELARDE FLORES, JUAN CARLOS', [5, 5, 5, 5, 5, 5, 5, 7, 7, 5, 5, 5, 5, 5, 5, null, null]],
    [37, 'VILCA CHOQUEMAMANI, LEIDY NAYELY', [5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5]],
    [38, 'VILCA SOLORZANO RICHAR ANDRE', [5, 7, 7, 5, 7, 5, 5, 5, 0, 0, 0, 0, null, null, null, null, null]],
    [39, 'YANA YUCRA DINA MARIBEL', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null, null]],
    [40, 'YANARICO HUANCA FLOR MELANY', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
    [41, 'YUPANQUI QUISPE, AGUSTIN WILSON', [5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, null, null, null]],
];

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@promocion2026.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Administrador',
        },
    });
    console.log(`✅ Admin creado: ${admin.email}`);

    // Create sample events
    const events = [
        {
            date: '15 Mar',
            year: '2026',
            title: 'Sesión de Fotos Oficial',
            description: 'Capturamos nuestros mejores momentos en una sesión fotográfica profesional en el campus UNA.',
            status: 'upcoming',
            icon: '📸',
            order: 1,
        },
        {
            date: '20 Abr',
            year: '2026',
            title: 'Paseo de Promoción',
            description: 'Viaje grupal para fortalecer lazos y crear nuevos recuerdos juntos. Destino por definir.',
            status: 'upcoming',
            icon: '🏖️',
            order: 2,
        },
        {
            date: '10 Jun',
            year: '2026',
            title: 'Cena de Gala',
            description: 'Celebración elegante para despedir nuestra etapa universitaria en la UNA Puno.',
            status: 'upcoming',
            icon: '🎩',
            order: 3,
        },
        {
            date: '15 Jul',
            year: '2026',
            title: 'Ceremonia de Graduación',
            description: 'El gran día donde recibiremos nuestros títulos como Ingenieros Estadísticos e Informáticos.',
            status: 'upcoming',
            icon: '🎓',
            order: 4,
        },
    ];

    for (const event of events) {
        await prisma.event.upsert({
            where: { id: `seed-${event.order}` },
            update: event,
            create: {
                id: `seed-${event.order}`,
                ...event,
            },
        });
    }
    console.log(`✅ ${events.length} eventos creados`);

    // Delete all existing students and payments to start fresh
    console.log('🗑️ Limpiando datos anteriores...');
    await prisma.payment.deleteMany({});
    await prisma.student.deleteMany({});

    // Create all students
    console.log('📚 Creando estudiantes...');
    const createdStudents: Map<number, string> = new Map();

    for (const [orden, name] of STUDENTS_DATA) {
        const student = await prisma.student.create({
            data: {
                name,
                order: orden,
            },
        });
        createdStudents.set(orden, student.id);
    }
    console.log(`✅ ${STUDENTS_DATA.length} estudiantes creados`);

    // Create payments for each student
    console.log('💰 Registrando pagos...');
    let totalPayments = 0;

    for (const [orden, , payments] of STUDENTS_DATA) {
        const studentId = createdStudents.get(orden);
        if (!studentId) continue;

        for (let weekIndex = 0; weekIndex < payments.length; weekIndex++) {
            const amount = payments[weekIndex];
            // Solo registrar pagos con monto > 0 (5 o 7)
            // Los pagos con monto 0 ya no se registran (se consideran como no pagados)
            // Los null tampoco se registran (no pagó)
            if (amount !== null && amount > 0) {
                await prisma.payment.create({
                    data: {
                        studentId,
                        weekNumber: weekIndex + 1,
                        amount: amount, // 5 = normal, 7 = tardío
                        paidAt: new Date(WEEK_DATES[weekIndex]),
                    },
                });
                totalPayments++;
            }
        }
    }
    console.log(`✅ ${totalPayments} pagos registrados`);

    // Create default settings
    await prisma.fundSettings.upsert({
        where: { id: 'main' },
        update: {
            totalMembers: STUDENTS_DATA.length,
            startDate: new Date('2025-09-08'), // Primera semana de aportes
        },
        create: {
            id: 'main',
            goal: 5000,
            weeklyAmount: 5,
            totalMembers: STUDENTS_DATA.length,
            startDate: new Date('2025-09-08'), // Primera semana de aportes
        },
    });

    await prisma.siteSettings.upsert({
        where: { id: 'main' },
        update: {},
        create: {
            id: 'main',
            promotionName: 'Promoción 2026 - II',
            schoolName: 'EPIEI - UNA Puno',
            contactEmail: '',
            instagramUrl: '',
            facebookUrl: '',
            whatsappNumber: '',
        },
    });
    console.log('✅ Configuración inicial creada');

    // Mostrar resumen
    const studentsWithAllPaid = STUDENTS_DATA.filter(([, , payments]) =>
        payments.every(p => p !== null)
    ).length;

    const studentsWithNoPaid = STUDENTS_DATA.filter(([, , payments]) =>
        payments.every(p => p === null)
    ).length;

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   👥 Estudiantes: ${STUDENTS_DATA.length}`);
    console.log(`   💰 Pagos registrados: ${totalPayments}`);
    console.log(`   ✅ Al día (17 semanas): ${studentsWithAllPaid}`);
    console.log(`   ❌ Sin pagos: ${studentsWithNoPaid}`);
    console.log(`   📅 Semanas totales: ${WEEK_DATES.length}`);
    console.log('\n📧 Credenciales de Admin:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  ¡Cambia la contraseña en producción!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
