'use server'

import { SchoolSede, Simulacro, User } from "@/src/generated/prisma";
import prisma from "@/src/lib/prisma";

export type ReportData = {
  area: string;
  firstSimulacroAvg: number | null;
  lastSimulacroAvg: number | null;
};

export interface BarChartDataType {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    borderRadius?: number | number[]
    borderSkipped?: 'left' | 'right' | 'top' | 'bottom' | false
    categoryPercentage?: number
    barPercentage?: number
    maxBarThickness?: number
    minBarLength?: number
    offsetGridLines?: boolean
    datalabels?: {
      anchor?: 'start' | 'end' | 'center'
      align?: 'start' | 'end' | 'center'
      offset?: number
    }
    barThickness?: number
    indexAxis?: 'x' | 'y'
  }[]
}

export type CompetencyReportData = {
  area: string;
  competencia: string;
  firstSimulacroAvg: number | null;
  lastSimulacroAvg: number | null;
};

export interface CompetencyBarChartDataType {
  area: string;
  chartData: BarChartDataType;
}

export type EvidenceReportData = {
  area: string;
  competencia: string;
  evidencia: string;
  firstSimulacroAvg: number | null;
  lastSimulacroAvg: number | null;
};

export interface EvidenceBarChartDataType {
  area: string;
  competencia: string;
  chartData: BarChartDataType;
}

export type StudentReport = {
  id: string;
  idDocument: string | null;
  fullName: string;
  sede: string | null;
  degree: string | null;
  overall: {
    first: number | null;
    last: number | null;
  };
  areas: {
    name: string;
    first: number | null;
    last: number | null;
  }[];
};

type whereClauseType = {
  schoolId?: string;
  role?: 'USER';
  schoolSedeId?: string;
  degree?: string | { not: null };
  id?: string;
}

export async function getSchoolStudentReportsData(schoolId: string, sedeId?: string, degree?: string, studentId?: string): Promise<StudentReport[]> {
  
  
  // 1. Get filtered students
  const whereClause: whereClauseType = { schoolId, role: 'USER' };
  if (sedeId && sedeId !== 'all') whereClause.schoolSedeId = sedeId;
  if (degree && degree !== 'all') whereClause.degree = degree;
  if (studentId && studentId !== 'all') whereClause.id = studentId;

  const students = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      idDocument: true,
      name: true,
      lastName: true,
      degree: true,
      schoolSede: {
        select: {
          nombre: true
        }
      }
    }
  });

  if (students.length === 0) return [];
  const studentIds = students.map(s => s.id);

  // 2. Get all simulacros for these students
  const allSimulacros = await prisma.simulacro.findMany({
    where: {
      userId: { in: studentIds }
    },
    include: {
      competencia: {
        include: {
          area: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const areas = await prisma.area.findMany();

  // 3. Process data for each student
  const studentReports: StudentReport[] = students.map(student => {
    const studentSimulacros = allSimulacros.filter(s => s.userId === student.id);

    let overallFirst: number | null = null;
    let overallLast: number | null = null;

    if (studentSimulacros.length > 0) {
      const firstDate = studentSimulacros[0].createdAt;
      const lastDate = studentSimulacros[studentSimulacros.length - 1].createdAt;

      const firstSimulacros = studentSimulacros.filter(s => s.createdAt.getTime() === firstDate.getTime());
      const lastSimulacros = studentSimulacros.filter(s => s.createdAt.getTime() === lastDate.getTime());

      const firstScores = firstSimulacros.map(s => s.score).filter((s): s is number => s !== null);
      if (firstScores.length > 0) {
        overallFirst = firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
      }

      const lastScores = lastSimulacros.map(s => s.score).filter((s): s is number => s !== null);
      if (lastScores.length > 0) {
        overallLast = lastScores.reduce((a, b) => a + b, 0) / lastScores.length;
      }
    }

    const areaResults = areas.map(area => {
      const areaSimulacros = studentSimulacros.filter(s => s.competencia!.areaId === area.id);
      let first: number | null = null;
      let last: number | null = null;

      if (areaSimulacros.length > 0) {
        first = areaSimulacros[0].score ?? null;
        last = areaSimulacros[areaSimulacros.length - 1].score ?? null;
      }

      return {
        name: area.nombre,
        first,
        last
      };
    });

    return {
      id: student.id,
      idDocument: student.idDocument,
      fullName: `${student.name} ${student.lastName || ''}`.trim(),
      sede: student.schoolSede?.nombre || null,
      degree: student.degree,
      overall: {
        first: overallFirst,
        last: overallLast,
      },
      areas: areaResults
    };
  });

  return studentReports;
}

export async function getSchoolEvidenceReportsChartData(schoolId: string, sedeId?: string, degree?: string, studentId?: string): Promise<EvidenceBarChartDataType[]> {

  const reports = await getSchoolEvidenceReportsData(schoolId, sedeId, degree, studentId);

  const competencies = [...new Set(reports.map(r => r.competencia))];

  const chartData: EvidenceBarChartDataType[] = competencies.map(competencia => {
    const competencyReports = reports.filter(r => r.competencia === competencia);
    const labels = competencyReports.map(r => r.evidencia);
    const firstSimulacroData = competencyReports.map(r => r.firstSimulacroAvg ?? 0);
    const lastSimulacroData = competencyReports.map(r => r.lastSimulacroAvg ?? 0);
    const area = competencyReports[0]?.area ?? '';

    return {
      area,
      competencia,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Primer Simulacro',
            data: firstSimulacroData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            indexAxis: 'y',
          },
          {
            label: 'Último Simulacro',
            data: lastSimulacroData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            indexAxis: 'y',
          },
        ],
      }
    };
  });

  return chartData;
}


export async function getSchoolEvidenceReportsData(schoolId: string, sedeId?: string, degree?: string, studentId?: string): Promise<EvidenceReportData[]> {  
  
  // 1. Get filtered students
  const whereClause: whereClauseType = { schoolId: schoolId, role: 'USER' };
  if (sedeId && sedeId !== 'all') whereClause.schoolSedeId = sedeId;
  if (degree && degree !== 'all') whereClause.degree = degree;
  if (studentId && studentId !== 'all') whereClause.id = studentId;

  const students = await prisma.user.findMany({ where: whereClause, select: { id: true } });
  if (students.length === 0) return [];
  const studentIds = students.map(s => s.id);

  // 2. Get all simulacro preguntas for these students
  const allSimulacroPreguntas = await prisma.simulacroPregunta.findMany({
    where: {
      simulacro: {
        userId: { in: studentIds }
      }
    },
    include: {
      simulacro: {
        select: {
          userId: true,
          createdAt: true
        }
      },
      pregunta: {
        include: {
          evidencia: {
            include: {
              afirmacion: {
                include: {
                  competencia: {
                    include: {
                      area: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      simulacro: {
        createdAt: 'asc'
      }
    }
  });

  if (allSimulacroPreguntas.length === 0) return [];

  // 3. Process data in memory
  type SimulacroPreguntaWithIncludes = typeof allSimulacroPreguntas[number];
  const simulacrosByUser: { [userId: string]: SimulacroPreguntaWithIncludes[] } = {};

  allSimulacroPreguntas.forEach(p => {
    const userId = p.simulacro.userId;
    if (!simulacrosByUser[userId]) {
      simulacrosByUser[userId] = [];
    }
    simulacrosByUser[userId].push(p);
  });

  const evidences = await prisma.evidencia.findMany({
    include: {
      afirmacion: {
        include: {
          competencia: {
            include: {
              area: true
            }
          }
        }
      }
    }
  });

  const reportData: EvidenceReportData[] = [];

  for (const evid of evidences) {
    let firstSimulacroCorrect = 0;
    let firstSimulacroTotal = 0;
    let lastSimulacroCorrect = 0;
    let lastSimulacroTotal = 0;

    for (const userId in simulacrosByUser) {
      const userPreguntas = simulacrosByUser[userId].filter(p => p.pregunta.evidenciaId === evid.id);
      if (userPreguntas.length > 0) {
        const firstDate = userPreguntas[0].simulacro.createdAt;
        const lastDate = userPreguntas[userPreguntas.length - 1].simulacro.createdAt;

        const firstSimulacroPreguntas = userPreguntas.filter(p => p.simulacro.createdAt.getTime() === firstDate.getTime());
        const lastSimulacroPreguntas = userPreguntas.filter(p => p.simulacro.createdAt.getTime() === lastDate.getTime());

        firstSimulacroCorrect += firstSimulacroPreguntas.filter(p => p.correcta).length;
        firstSimulacroTotal += firstSimulacroPreguntas.length;
        lastSimulacroCorrect += lastSimulacroPreguntas.filter(p => p.correcta).length;
        lastSimulacroTotal += lastSimulacroPreguntas.length;
      }
    }

    const firstSimulacroAvg = firstSimulacroTotal > 0 ? (firstSimulacroCorrect / firstSimulacroTotal) * 100 : null;
    const lastSimulacroAvg = lastSimulacroTotal > 0 ? (lastSimulacroCorrect / lastSimulacroTotal) * 100 : null;

    if (firstSimulacroTotal > 0 || lastSimulacroTotal > 0) {
      reportData.push({
        area: evid.afirmacion.competencia.area.nombre,
        competencia: evid.afirmacion.competencia.nombre,
        evidencia: evid.nombre,
        firstSimulacroAvg,
        lastSimulacroAvg,
      });
    }
  }

  return reportData;
}


export async function getSchoolCompetencyReportsChartData(schoolId: string, sedeId?: string, degree?: string, studentId?: string): Promise<CompetencyBarChartDataType[]> {
  const reports = await getSchoolCompetencyReportsData(schoolId, sedeId, degree, studentId);

  const areas = [...new Set(reports.map(r => r.area))];

  const chartData: CompetencyBarChartDataType[] = areas.map(area => {
    const areaReports = reports.filter(r => r.area === area);
    const labels = areaReports.map(r => r.competencia);
    const firstSimulacroData = areaReports.map(r => r.firstSimulacroAvg ?? 0);
    const lastSimulacroData = areaReports.map(r => r.lastSimulacroAvg ?? 0);

    return {
      area,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Primer Simulacro',
            data: firstSimulacroData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Último Simulacro',
            data: lastSimulacroData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      }
    };
  });

  return chartData;
}

export async function getSchoolCompetencyReportsData(schoolId: string, sedeId?: string, degree?: string, studentId?: string): Promise<CompetencyReportData[]> {
  const whereClause: whereClauseType = {
    schoolId: schoolId,
    role: 'USER'
  };
  if (sedeId && sedeId !== 'all') {
    whereClause.schoolSedeId = sedeId;
  }
  if (degree && degree !== 'all') {
    whereClause.degree = degree;
  }
  if (studentId && studentId !== 'all') {
    whereClause.id = studentId;
  }

  const students = await prisma.user.findMany({
    where: whereClause,
    select: { id: true }
  });

  if (students.length === 0) {
    return [];
  }

  const studentIds = students.map(s => s.id);

  const simulacros = await prisma.simulacro.findMany({
    where: {
      userId: { in: studentIds }
    },
    include: {
      competencia: {
        include: {
          area: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const competencias = await prisma.competencia.findMany({ 
    include: { area: true }
  });

  const reportData: CompetencyReportData[] = [];

  for (const comp of competencias) {
    const competenciaSimulacros = simulacros.filter(s => s.competenciaId === comp.id);

    if (competenciaSimulacros.length > 0) {
      const simulacrosByUser: { [userId: string]: Simulacro[] } = {};
      for (const s of competenciaSimulacros) {
        if (!simulacrosByUser[s.userId]) {
          simulacrosByUser[s.userId] = [];
        }
        simulacrosByUser[s.userId].push(s);
      }

      const firstSimulacroScores: number[] = [];
      const lastSimulacroScores: number[] = [];

      for (const userId in simulacrosByUser) {
        const userSimulacros = simulacrosByUser[userId];
        if (userSimulacros.length > 0) {
          if (userSimulacros[0].score !== null) {
            firstSimulacroScores.push(userSimulacros[0].score);
          }
          if (userSimulacros.length > 1 && userSimulacros[userSimulacros.length - 1].score !== null) {
            lastSimulacroScores.push(userSimulacros[userSimulacros.length - 1].score!);
          } else if (userSimulacros.length === 1 && userSimulacros[0].score !== null) {
            lastSimulacroScores.push(userSimulacros[0].score);
          }
        }
      }

      const firstSimulacroAvg = firstSimulacroScores.length > 0 ? firstSimulacroScores.reduce((a, b) => a + b, 0) / firstSimulacroScores.length : null;
      const lastSimulacroAvg = lastSimulacroScores.length > 0 ? lastSimulacroScores.reduce((a, b) => a + b, 0) / lastSimulacroScores.length : null;

      reportData.push({
        area: comp.area.nombre,
        competencia: comp.nombre,
        firstSimulacroAvg,
        lastSimulacroAvg
      });
    } else {
      reportData.push({
        area: comp.area.nombre,
        competencia: comp.nombre,
        firstSimulacroAvg: null,
        lastSimulacroAvg: null
      });
    }
  }

  return reportData;
}


export async function getSchoolReportsChartData(schoolId: string, sedeId?: string, studentId?: string, degree?: string): Promise<BarChartDataType> {
  const reports = await getSchoolReportsData(schoolId, sedeId, studentId, degree);

  const labels = reports.map(r => r.area);
  const firstSimulacroData = reports.map(r => r.firstSimulacroAvg ?? 0);
  const lastSimulacroData = reports.map(r => r.lastSimulacroAvg ?? 0);

  return {
    labels,
    datasets: [
      {
        label: 'Primer Simulacro',
        data: firstSimulacroData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Último Simulacro',
        data: lastSimulacroData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };
}

export async function getSchoolReportsData(schoolId: string, sedeId?: string, studentId?: string, degree?: string): Promise<ReportData[]> {
  // 1. Get all areas
  const areas = await prisma.area.findMany();

  // 2. Get all students for the school/sede/student
  const whereClause: whereClauseType = {
    schoolId: schoolId,
    role: 'USER'
  };
  if (sedeId && sedeId !== 'all') {
    whereClause.schoolSedeId = sedeId;
  }
  if (studentId && studentId !== 'all') {
    whereClause.id = studentId;
  }
  if (degree && degree !== 'all') {
    whereClause.degree = degree;
  }
  const students = await prisma.user.findMany({
    where: whereClause,
    select: { id: true }
  });

  if (students.length === 0) {
    return areas.map(area => ({
      area: area.nombre,
      firstSimulacroAvg: null,
      lastSimulacroAvg: null,
    }));
  }

  const studentIds = students.map(s => s.id);

  // 3. Get all simulacros for the students
  const simulacros = await prisma.simulacro.findMany({
    where: {
      userId: { in: studentIds }
    },
    include: {
      competencia: {
        include: { 
          area: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // 4. Process data
  const reportData: ReportData[] = [];

  for (const area of areas) {
    const areaSimulacros = simulacros.filter(s => s.competencia!.area.id === area.id);

    if (areaSimulacros.length > 0) {
      const simulacrosByUser: { [userId: string]: Simulacro[] } = {};
      for (const s of areaSimulacros) {
        if (!simulacrosByUser[s.userId]) {
          simulacrosByUser[s.userId] = [];
        }
        simulacrosByUser[s.userId].push(s);
      }

      const firstSimulacroScores: number[] = [];
      const lastSimulacroScores: number[] = [];

      for (const userId in simulacrosByUser) {
        const userSimulacros = simulacrosByUser[userId];
        if (userSimulacros.length > 0) {
          if (userSimulacros[0].score !== null) {
            firstSimulacroScores.push(userSimulacros[0].score);
          }
          if (userSimulacros.length > 1 && userSimulacros[userSimulacros.length - 1].score !== null) {
            lastSimulacroScores.push(userSimulacros[userSimulacros.length - 1].score!);
          } else if (userSimulacros.length === 1 && userSimulacros[0].score !== null) {
            // If only one simulacro, it's both first and last
            lastSimulacroScores.push(userSimulacros[0].score);
          }
        }
      }

      const firstSimulacroAvg = firstSimulacroScores.length > 0 ? firstSimulacroScores.reduce((a, b) => a + b, 0) / firstSimulacroScores.length : null;
      const lastSimulacroAvg = lastSimulacroScores.length > 0 ? lastSimulacroScores.reduce((a, b) => a + b, 0) / lastSimulacroScores.length : null;

      reportData.push({
        area: area.nombre,
        firstSimulacroAvg,
        lastSimulacroAvg
      });
    } else {
      reportData.push({
        area: area.nombre,
        firstSimulacroAvg: null,
        lastSimulacroAvg: null
      });
    }
  }

  return reportData;
}

export async function getSchoolSedes(schoolId: string): Promise<SchoolSede[]> {
  const sedes = await prisma.schoolSede.findMany({
    where: { schoolId }
  });
  return sedes;
}

export async function getSchoolDegrees(schoolId: string, sedeId?: string): Promise<string[]> {
    
  const whereClause: whereClauseType = {
    schoolId,
    role: 'USER',
    degree: { not: null }
  };

  if (sedeId && sedeId !== 'all') {
    whereClause.schoolSedeId = sedeId;
  }

  const degrees = await prisma.user.findMany({
    where: whereClause,
    distinct: ['degree'],
    select: { degree: true }
  });
  return degrees.map(d => d.degree!);
}

export async function getSedeStudents(sedeId: string, degree?: string): Promise<Pick<User, 'id' | 'name' | 'lastName'>[]> {
  const whereClause: whereClauseType = { schoolSedeId: sedeId, role: 'USER' };

  if (degree && degree !== 'all') {
    whereClause.degree = degree;
  }
  const estudiantes = await prisma.user.findMany({
    where: whereClause,
    select: { id: true, name: true, lastName: true }
  });

  return estudiantes
}

export async function getSchoolStudents(schoolId: string, degree?: string): Promise<Pick<User, 'id' | 'name' | 'lastName'>[]> {
  const whereClause: whereClauseType = { schoolId: schoolId, role: 'USER' };
  if (degree && degree !== 'all') {
    whereClause.degree = degree;
  }
  const students = await prisma.user.findMany({
    where: whereClause,
    select: { id: true, name: true, lastName: true }
  });

  return students
}