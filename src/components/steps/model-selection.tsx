"use client"

import { useState, useEffect, useCallback } from "react"
import type { ModelCategory, VehicleModel, FormData } from "@/lib/types"

interface ModelSelectionProps {
  formData: FormData
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  modelCategories: ModelCategory[]
  vehicleModels: VehicleModel[]
}

export default function ModelSelection({
  formData,
  updateFormData,
  modelCategories,
  vehicleModels,
}: ModelSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  console.log(selectedCategory)

  const handleModelSelect = useCallback(
    (model: VehicleModel) => {
      updateFormData("model", model.name)
      updateFormData("modelData", model)
    },
    [updateFormData],
  )

  // Add this useEffect after the existing useState declarations
  useEffect(() => {
    // Auto-select first model if none is selected and models are available
    if (!formData.model && vehicleModels.length > 0) {
      handleModelSelect(vehicleModels[0])
    }
  }, [vehicleModels, formData.model, handleModelSelect])

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId)
  }

  // Group models by category
  const getModelsByCategory = (categoryId: number) => {
    return vehicleModels.filter((model) => model.category_id === categoryId)
  }

  // Get selected model data
  const selectedModel = formData.modelData || null

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Select Your Model</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {modelCategories.map((category) => (
            <div key={category.id}>
              <h3
                className="font-bold mb-2 text-white cursor-pointer"
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {getModelsByCategory(category.id).map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model)}
                    className={`p-3 text-center text-white rounded ${
                      formData.model === model.name
                        ? "bg-[#FFE4A8] !text-black"
                        : "bg-[#1e1e1e] hover:bg-[#FFE4A8] hover:text-black"
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-0">
          {selectedModel && (
            <div className="space-y-4">
              <div className="aspect-video relative">
                <img
                  src={
                    selectedModel.inner_image
                      ? `${import.meta.env.VITE_BACKEND_URL}/${selectedModel.inner_image}`
                      : "/placeholder.svg?height=300&width=500"
                  }
                  alt={selectedModel.name}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=300&width=500"
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/ref-icon.svg" alt="Refrigerator" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Refrigerator</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/sleeps-icon.svg" alt="Sleeps" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Sleeps {selectedModel.sleep_person}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/shower-icon.svg" alt="Shower" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Shower</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/assets/toilet.svg" alt="Toilet" width={40} height={40} />
                  </div>
                  <span className="text-xs mt-1 text-white">Toilet</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2 text-white text-[20px] text-start">{selectedModel.name}</h3>
                <p className="text-white text-sm text-start">{selectedModel.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
