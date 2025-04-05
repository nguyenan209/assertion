// app/dashboard/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

// Schema validation với Zod
const planSchema = z.object({
  stageName: z.string().min(1, "Tên giai đoạn là bắt buộc"),
  timeline: z.string().optional(),
  platforms: z.object({
    ios: z.boolean(),
    android: z.boolean(),
    web: z.boolean(),
  }),
  code: z.string().optional(),
});

const formSchema = z.object({
  projectCode: z.string().min(1, "Mã dự án là bắt buộc"),
  projectName: z.string().min(1, "Tên dự án là bắt buộc"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon là bắt buộc"),
  color: z.string().min(1, "Color là bắt buộc"),
  defaultPlan: planSchema,
  additionalPlans: z.array(planSchema),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateProjectPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectCode: "",
      projectName: "",
      description: "",
      icon: "",
      color: "",
      defaultPlan: {
        stageName: "",
        timeline: "",
        platforms: { ios: false, android: false, web: false },
        code: "",
      },
      additionalPlans: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalPlans",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: data.projectCode,
          name: data.projectName,
          description: data.description,
          icon: data.icon,
          color: data.color,
          status: "Draft", // Mặc định là Draft, sẽ cập nhật sau
          plans: [
            {
              stageName: data.defaultPlan.stageName,
              timeline: data.defaultPlan.timeline,
              platforms: Object.keys(data.defaultPlan.platforms).filter(
                (key) =>
                  data.defaultPlan.platforms[
                    key as keyof typeof data.defaultPlan.platforms
                  ]
              ),
              code: data.defaultPlan.code,
            },
            ...data.additionalPlans.map((plan) => ({
              stageName: plan.stageName,
              timeline: plan.timeline,
              platforms: Object.keys(plan.platforms).filter(
                (key) => plan.platforms[key as keyof typeof plan.platforms]
              ),
              code: plan.code,
            })),
          ],
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCreateAndActivate = async (data: FormData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: data.projectCode,
          name: data.projectName,
          description: data.description,
          icon: data.icon,
          color: data.color,
          status: "Active",
          plans: [
            {
              stageName: data.defaultPlan.stageName,
              timeline: data.defaultPlan.timeline,
              platforms: Object.keys(data.defaultPlan.platforms).filter(
                (key) =>
                  data.defaultPlan.platforms[
                    key as keyof typeof data.defaultPlan.platforms
                  ]
              ),
              code: data.defaultPlan.code,
            },
            ...data.additionalPlans.map((plan) => ({
              stageName: plan.stageName,
              timeline: plan.timeline,
              platforms: Object.keys(plan.platforms).filter(
                (key) => plan.platforms[key as keyof typeof plan.platforms]
              ),
              code: plan.code,
            })),
          ],
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tạo dự án mới</h1>
        <div className="space-x-3">
          <Button
            onClick={handleSubmit(handleCreateAndActivate)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Tạo và kích hoạt
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Tạo
          </Button>
        </div>
      </div>

      {/* Bố cục 12 cột */}
      <div className="grid grid-cols-12 gap-6">
        {/* Khoảng trống bên trái: 3 cột */}
        <div className="col-span-3" />

        {/* Phần chính: 6 cột, căn giữa */}
        <div className="col-span-6">
          {/* Thông tin dự án */}
          <Card className="bg-gray-800 border-gray-600 mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Thông tin dự án
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="projectCode" className="text-white">
                    Mã dự án *
                  </Label>
                  <Controller
                    name="projectCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="projectCode"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                        placeholder="Mã dự án"
                      />
                    )}
                  />
                  {errors.projectCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="icon" className="text-white">
                    Icon *
                  </Label>
                  <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="icon"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                        placeholder="Icon"
                      />
                    )}
                  />
                  {errors.icon && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.icon.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="projectName" className="text-white">
                    Tên dự án *
                  </Label>
                  <Controller
                    name="projectName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="projectName"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                        placeholder="Tên dự án"
                      />
                    )}
                  />
                  {errors.projectName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="color" className="text-white">
                    Color *
                  </Label>
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="color"
                        {...field}
                        className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                        placeholder="Color"
                      />
                    )}
                  />
                  {errors.color && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.color.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">
                  Mô tả
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      {...field}
                      className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                      placeholder="Mô tả"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Kế hoạch dự án */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg text-white">
                Kế hoạch dự án
              </CardTitle>
              <Button
                onClick={() =>
                  append({
                    stageName: "",
                    timeline: "",
                    platforms: { ios: false, android: false, web: false },
                    code: "",
                  })
                }
                variant="ghost"
                className="text-blue-400 hover:text-blue-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm mới
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Block 1: Cố định */}
              <div className="border border-gray-600 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label
                      htmlFor="defaultPlan.stageName"
                      className="text-white"
                    >
                      Tên giai đoạn *
                    </Label>
                    <Controller
                      name="defaultPlan.stageName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="defaultPlan.stageName"
                          {...field}
                          className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                          placeholder="Tên giai đoạn"
                        />
                      )}
                    />
                    {errors.defaultPlan?.stageName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.defaultPlan.stageName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="defaultPlan.timeline"
                      className="text-white"
                    >
                      Timeline
                    </Label>
                    <Controller
                      name="defaultPlan.timeline"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="defaultPlan.timeline"
                          {...field}
                          className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                          placeholder="dd/mm/yyyy - dd/mm/yyyy"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="defaultPlan.code" className="text-white">
                      Mã số
                    </Label>
                    <Controller
                      name="defaultPlan.code"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="defaultPlan.code"
                          {...field}
                          className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                          placeholder="Mã số"
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-end space-x-4">
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="defaultPlan.platforms.ios"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="defaultPlan.platforms.ios"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="defaultPlan.platforms.ios"
                        className="text-white"
                      >
                        iOS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="defaultPlan.platforms.android"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="defaultPlan.platforms.android"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="defaultPlan.platforms.android"
                        className="text-white"
                      >
                        Android
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="defaultPlan.platforms.web"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="defaultPlan.platforms.web"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="defaultPlan.platforms.web"
                        className="text-white"
                      >
                        Web
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 2: Có thể thêm/xóa */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-600 p-4 rounded-lg relative"
                >
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor={`additionalPlans.${index}.stageName`}
                        className="text-white"
                      >
                        Tình trạng phát triển trong giai đoạn:
                      </Label>
                      <Controller
                        name={`additionalPlans.${index}.stageName`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`additionalPlans.${index}.stageName`}
                            {...field}
                            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                            placeholder="Tình trạng"
                          />
                        )}
                      />
                      {errors.additionalPlans?.[index]?.stageName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.additionalPlans[index].stageName?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor={`additionalPlans.${index}.code`}
                        className="text-white"
                      >
                        Mã số
                      </Label>
                      <Controller
                        name={`additionalPlans.${index}.code`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`additionalPlans.${index}.code`}
                            {...field}
                            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 mt-1"
                            placeholder="Mã số"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-end space-x-4 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name={`additionalPlans.${index}.platforms.ios`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`additionalPlans.${index}.platforms.ios`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`additionalPlans.${index}.platforms.ios`}
                          className="text-white"
                        >
                          iOS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name={`additionalPlans.${index}.platforms.android`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`additionalPlans.${index}.platforms.android`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`additionalPlans.${index}.platforms.android`}
                          className="text-white"
                        >
                          Android
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name={`additionalPlans.${index}.platforms.web`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`additionalPlans.${index}.platforms.web`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`additionalPlans.${index}.platforms.web`}
                          className="text-white"
                        >
                          Web
                        </Label>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => remove(index)}
                    variant="ghost"
                    className="absolute top-4 right-4 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Khoảng trống bên phải: 3 cột */}
        <div className="col-span-3" />
      </div>
    </div>
  );
}
