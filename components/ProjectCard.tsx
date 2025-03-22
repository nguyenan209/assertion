// components/ProjectCard.tsx
import { Project } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal } from "lucide-react";

interface ProjectCardProps {
  project: Project | null;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  if (!project) {
    return (
      <Link href="/dashboard/create">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Add new +
        </Button>
      </Link>
    );
  }

  const statusColor =
    project.status === "Active"
      ? "bg-green-500"
      : project.status === "Draft"
      ? "bg-yellow-500"
      : "bg-gray-500";

  return (
    <Card className="bg-gray-800 border-gray-600 relative">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
            <Link href={`/dashboard/${project.id}`}>
              <CardTitle className="text-lg text-white">
                {project.name}
              </CardTitle>
            </Link>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-yellow-400">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-blue-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {project.status === "Active" && (
        <span className="absolute top-2 right-2 text-orange-400 text-sm">
          new
        </span>
      )}
    </Card>
  );
}
