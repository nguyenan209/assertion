// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuickReport from "@/components/QuickReport";
import SearchBar from "@/components/SearchBar";
import ProjectCard from "@/components/ProjectCard";
import UserMenu from "@/components/UserMenu";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  // Lấy dữ liệu Quick Report
  const totalIssues = await prisma.issue.count();
  const remainingIssues = await prisma.issue.count({
    where: { status: { notIn: ["Done", "Reject/Cancel"] } },
  });
  const remainingBugs = await prisma.issue.count({
    where: { type: "Bug", status: { notIn: ["Done", "Reject/Cancel"] } },
  });
  const readyForTest = await prisma.issue.count({
    where: { status: "Ready for Test" },
  });

  // Lấy danh sách dự án
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">DASHBOARD - HOME</h1>
        <UserMenu userName={session.user?.name || "User"} />
      </div>

      {/* Bố cục 12 cột */}
      <div className="grid grid-cols-12 gap-6">
        {/* Quick Report: 3 cột bên trái */}
        <div className="col-span-3">
          <QuickReport
            totalIssues={totalIssues}
            remainingIssues={remainingIssues}
            remainingBugs={remainingBugs}
            readyForTest={readyForTest}
          />
        </div>

        {/* Phần chính: 6 cột, căn giữa */}
        <div className="col-span-6 flex flex-col items-center">
          {/* Thanh tìm kiếm */}
          <div className="w-full mb-6">
            <SearchBar />
          </div>

          {/* Nếu không có dự án, hiển thị nút "Add new" */}
          {projects.length === 0 ? (
            <ProjectCard project={null} />
          ) : (
            <>
              {/* Danh sách dự án, chia thành 4 cột trong 6 cột chính */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Nút "Add new" */}
              <div className="mt-6">
                <ProjectCard project={null} />
              </div>
            </>
          )}
        </div>

        {/* Khoảng trống bên phải: 3 cột */}
        <div className="col-span-3" />
      </div>
    </div>
  );
}
